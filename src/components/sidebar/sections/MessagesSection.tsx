import React, { useState, useRef } from "react";
import { Message, Person } from "@/types/chat";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { 
    MessageCircle, X, ImagePlus, Plus, User, Clock, Trash2, 
    Check, Bot, GripVertical, RefreshCw, FileUp, Crown, Mic 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { parseWhatsApp, parseTelegram, ParsedChat } from "@/lib/parsers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { readFileAsDataURL } from "@/lib/image-utils";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MessagesSectionProps {
    messages: Message[];
    people: Person[];
    mode?: 'default' | 'ai';
    onAddMessage: (text: string, isOwn: boolean, image?: string, isVoiceNote?: boolean, voiceDuration?: string) => void;
    onRemoveMessage: (id: string) => void;
    onUpdateMessage: (id: string, newText: string, newTimestamp?: Date, newImage?: string, isOwn?: boolean) => void;
    onReorderMessages?: (newMessages: Message[]) => void;
    onBulkImport?: (data: ParsedChat) => void;
}

export function MessagesSection({
    messages,
    people,
    mode = 'default',
    onAddMessage,
    onRemoveMessage,
    onUpdateMessage,
    onReorderMessages,
    onBulkImport,
}: MessagesSectionProps) {
    const { plan, setUpgradeModalOpen, triedBulkImport, markBulkImportAsTried } = useAuth();
    const [newMessage, setNewMessage] = useState("");
    const [isOwnMessage, setIsOwnMessage] = useState(true);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editingTimestampId, setEditingTimestampId] = useState<string | null>(null);
    const [messageImage, setMessageImage] = useState<string | null>(null);
    const [isVoiceNote, setIsVoiceNote] = useState(false);
    const [voiceDuration, setVoiceDuration] = useState("0:12");

    const imageInputRef = useRef<HTMLInputElement>(null);
    const bulkImportRef = useRef<HTMLInputElement>(null);

    // Temp state for date/time editing
    const [tempDate, setTempDate] = useState<string>("");
    const [tempTime, setTempTime] = useState<string>("");

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = messages.findIndex((m) => m.id === active.id);
            const newIndex = messages.findIndex((m) => m.id === over.id);
            const newMessages = arrayMove(messages, oldIndex, newIndex);
            onReorderMessages?.(newMessages);
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim() || messageImage || isVoiceNote) {
            onAddMessage(
                isVoiceNote ? "" : newMessage.trim(), 
                isOwnMessage, 
                messageImage || undefined,
                isVoiceNote,
                voiceDuration
            );
            setNewMessage("");
            setMessageImage(null);
            setIsVoiceNote(false);
        }
    };

    const handleBulkImportClick = () => {
        if (plan === 'free' && triedBulkImport) {
            setUpgradeModalOpen(true);
            return;
        }
        bulkImportRef.current?.click();
    };

    const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            let parsed: ParsedChat | null = null;
            
            try {
                if (file.name.endsWith('.json')) {
                    const json = JSON.parse(content);
                    parsed = parseTelegram(json);
                } else if (file.name.endsWith('.txt')) {
                    parsed = parseWhatsApp(content);
                } else {
                    toast.error("Unsupported file format. Please use .txt or .json");
                    return;
                }

                if (parsed && parsed.messages.length > 0) {
                    onBulkImport?.(parsed);
                    if (plan === 'free') {
                        markBulkImportAsTried();
                        toast.success("Trial used! Upgrade to Premium for unlimited imports.");
                    } else {
                        toast.success(`Successfully imported ${parsed.messages.length} messages.`);
                    }
                } else {
                    toast.error("No valid messages found in the file.");
                }
            } catch (err) {
                toast.error("Error parsing file. Ensure it's a valid WhatsApp/Telegram export.");
                console.error(err);
            }
        };
        reader.readAsText(file);
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const result = await readFileAsDataURL(file);
                setMessageImage(result);
            } catch (error) {
                console.error("Error reading image:", error);
            }
        }
    };

    const formatTimestamp = (date: Date) => {
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDateValue = (timestamp: Date) => {
        const d = timestamp instanceof Date ? timestamp : new Date(timestamp);
        return d.toISOString().split('T')[0];
    };

    const getTimeValue = (timestamp: Date) => {
        const d = timestamp instanceof Date ? timestamp : new Date(timestamp);
        return d.toTimeString().slice(0, 5);
    };

    const startEditingTimestamp = (messageId: string, timestamp: Date) => {
        setEditingTimestampId(messageId);
        setTempDate(getDateValue(timestamp));
        setTempTime(getTimeValue(timestamp));
    };

    const saveTimestamp = (messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (message && tempDate && tempTime) {
            const [year, month, day] = tempDate.split('-').map(Number);
            const [hours, minutes] = tempTime.split(':').map(Number);
            if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hours) && !isNaN(minutes)) {
                const newDate = new Date(year, month - 1, day, hours, minutes);
                onUpdateMessage(messageId, message.text, newDate, undefined, message.isOwn);
            }
        }
        setEditingTimestampId(null);
        setTempDate("");
        setTempTime("");
    };

    const cancelEditingTimestamp = () => {
        setEditingTimestampId(null);
        setTempDate("");
        setTempTime("");
    };

    const toggleMessageRole = (message: Message) => {
        onUpdateMessage(message.id, message.text, message.timestamp, message.image, !message.isOwn);
    };

    return (
        <AccordionItem value="messages" className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="font-semibold text-sm">Messages</span>
                    <span className="ml-1 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        {messages.length}
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1 space-y-3">
                {/* Add Message */}
                <div className="space-y-2">
                    {mode === 'default' && (
                        <div className="flex gap-1.5 pt-1">
                            <button
                                onClick={() => setIsOwnMessage(false)}
                                className={cn(
                                    "flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all uppercase tracking-wide",
                                    !isOwnMessage ? "bg-[#1d2333] text-white shadow-md ring-1 ring-white/10" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                )}
                            >
                                Received
                            </button>
                            <button
                                onClick={() => setIsOwnMessage(true)}
                                className={cn(
                                    "flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all uppercase tracking-wide",
                                    isOwnMessage ? "bg-[#1d2333] text-white shadow-md ring-1 ring-white/10" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                )}
                            >
                                Sent
                            </button>
                        </div>
                    )}

                    {/* Image Preview */}
                    {messageImage && (
                        <div className="relative inline-block">
                            <img src={messageImage} alt="Preview" className="h-16 rounded-lg object-cover" />
                            <button
                                onClick={() => setMessageImage(null)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive rounded-full flex items-center justify-center"
                            >
                                <X className="w-3 h-3 text-white" />
                            </button>
                        </div>
                    )}

                    <div className="flex gap-1.5">
                        {isVoiceNote ? (
                            <Input
                                placeholder="Duration (e.g. 0:45)"
                                value={voiceDuration}
                                onChange={(e) => setVoiceDuration(e.target.value)}
                                className="flex-1 h-9 text-sm border-blue-400 focus:ring-blue-400"
                            />
                        ) : (
                            <Input
                                placeholder={mode === 'ai' ? "Add a message..." : "Type a message..."}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1 h-9 text-sm"
                            />
                        )}
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageSelect}
                        />
                        {mode === 'default' && (
                            <div className="flex gap-1 flex-shrink-0">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => imageInputRef.current?.click()}
                                    className="h-9 w-9"
                                    disabled={isVoiceNote}
                                >
                                    <ImagePlus className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant={isVoiceNote ? "default" : "outline"}
                                    onClick={() => setIsVoiceNote(!isVoiceNote)}
                                    className={cn("h-9 w-9", isVoiceNote && "bg-blue-500 hover:bg-blue-600")}
                                    title="Voice Note"
                                >
                                    <Mic className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                        <Button size="icon" onClick={handleSendMessage} className="flex-shrink-0 h-9 w-9">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Bulk Import Trigger */}
                    <div className={cn(
                        "pt-1 pb-1",
                        mode === 'ai' && "hidden"
                    )}>
                        <input
                            ref={bulkImportRef}
                            type="file"
                            accept=".txt,.json"
                            className="hidden"
                            onChange={handleFileImport}
                        />
                        <Button
                            variant="outline"
                            className="w-full h-10 text-xs font-bold gap-2 border-dashed border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50 transition-all group overflow-hidden relative"
                            onClick={handleBulkImportClick}
                        >
                            <FileUp className="w-4 h-4 text-zinc-500 group-hover:text-zinc-700 transition-colors" />
                            Import Real Chat Data
                            {plan === 'free' && (
                                <div className="absolute top-0 right-0 bg-amber-500 text-[9px] text-white px-2 py-0.5 rounded-bl-md flex items-center gap-1 shadow-sm uppercase tracking-tighter">
                                    <Crown className="w-2.5 h-2.5 fill-white" />
                                    TRIAL
                                </div>
                            )}
                        </Button>
                        {plan === 'free' && !triedBulkImport && (
                            <p className="text-xs text-zinc-400 mt-2 text-center font-medium"> Free users can try bulk import <span className="text-zinc-600 font-bold">once</span>.</p>
                        )}
                    </div>
                </div>

                {/* Message List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={messages.map(m => m.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {messages.map((message) => (
                                <SortableMessageItem
                                    key={message.id}
                                    message={message}
                                    people={people}
                                    mode={mode}
                                    onUpdateMessage={onUpdateMessage}
                                    onRemoveMessage={onRemoveMessage}
                                    toggleMessageRole={() => toggleMessageRole(message)}
                                    editingMessageId={editingMessageId}
                                    setEditingMessageId={setEditingMessageId}
                                    editingTimestampId={editingTimestampId}
                                    tempDate={tempDate}
                                    setTempDate={setTempDate}
                                    tempTime={tempTime}
                                    setTempTime={setTempTime}
                                    startEditingTimestamp={() => startEditingTimestamp(message.id, message.timestamp)}
                                    saveTimestamp={() => saveTimestamp(message.id)}
                                    cancelEditingTimestamp={cancelEditingTimestamp}
                                    formatTimestamp={formatTimestamp}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

interface SortableMessageItemProps {
    message: Message;
    people: Person[];
    mode: 'default' | 'ai';
    onUpdateMessage: (id: string, text: string, timestamp?: Date, image?: string, isOwn?: boolean) => void;
    onRemoveMessage: (id: string) => void;
    toggleMessageRole: () => void;
    editingMessageId: string | null;
    setEditingMessageId: (id: string | null) => void;
    editingTimestampId: string | null;
    tempDate: string;
    setTempDate: (date: string) => void;
    tempTime: string;
    setTempTime: (time: string) => void;
    startEditingTimestamp: () => void;
    saveTimestamp: () => void;
    cancelEditingTimestamp: () => void;
    formatTimestamp: (date: Date) => string;
}

function SortableMessageItem({
    message,
    people,
    mode,
    onUpdateMessage,
    onRemoveMessage,
    toggleMessageRole,
    editingMessageId,
    setEditingMessageId,
    editingTimestampId,
    tempDate,
    setTempDate,
    tempTime,
    setTempTime,
    startEditingTimestamp,
    saveTimestamp,
    cancelEditingTimestamp,
    formatTimestamp
}: SortableMessageItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: message.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    const msgPerson = people.find(p => p.id === message.senderId);

    // AI Mode Specific Rendering
    if (mode === 'ai') {
        const isUser = message.isOwn;
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="group relative flex gap-2 rounded-xl border border-border/60 bg-card p-3 shadow-sm hover:border-border/80 transition-colors"
            >
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="mt-1 text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing shrink-0"
                >
                    <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-[10px]",
                                isUser ? "bg-secondary text-secondary-foreground" : "bg-orange-100 text-orange-600"
                            )}>
                                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                            </div>
                            <span className="text-xs font-medium">
                                {isUser ? "User" : "Assistant"}
                                <span className="text-muted-foreground font-normal ml-1">
                                    {isUser ? "(You)" : "(AI)"}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Content Input */}
                    <Textarea
                        value={message.text}
                        onChange={(e) => onUpdateMessage(message.id, e.target.value)}
                        className="min-h-[60px] text-sm resize-y bg-background"
                    />

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/30">
                        <button
                            onClick={toggleMessageRole}
                            className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary/50"
                        >
                            <RefreshCw className="w-3 h-3" />
                            Switch to {isUser ? "Assistant" : "User"}
                        </button>
                        <div className="h-3 w-px bg-border/50" />
                        <button
                            onClick={() => onRemoveMessage(message.id)}
                            className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Default Mode rendering
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn("rounded-lg border border-border/50 overflow-hidden relative group", message.isOwn ? "bg-primary/5" : "bg-secondary/30")}
        >
            <div
                {...attributes}
                {...listeners}
                className="absolute left-1 top-2 p-1 text-muted-foreground/0 group-hover:text-muted-foreground/30 cursor-grab active:cursor-grabbing transition-colors z-20"
            >
                <GripVertical className="w-3 h-3" />
            </div>

            {editingMessageId === message.id ? (
                <div className="p-2.5 pl-6">
                    <Textarea
                        value={message.text}
                        onChange={(e) => onUpdateMessage(message.id, e.target.value)}
                        onBlur={() => setEditingMessageId(null)}
                        className="min-h-[50px] text-sm"
                        autoFocus
                    />
                </div>
            ) : (
                <div className="p-2.5 pl-6 space-y-1.5">
                    {/* Message Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                {msgPerson?.avatar ? (
                                    <img src={msgPerson.avatar} className="w-4 h-4 rounded-full object-cover" />
                                ) : (
                                    <User className="w-3.5 h-3.5" />
                                )}
                                <span className="text-[10px] font-medium">{message.isOwn ? 'You' : msgPerson?.name || 'Friend'}</span>
                            </div>
                        </div>
                        <button
                            onClick={startEditingTimestamp}
                            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(message.timestamp)}
                        </button>
                    </div>

                    {/* Message Image */}
                    {message.image && (
                        <img src={message.image} alt="" className="max-h-20 rounded-lg object-cover" />
                    )}

                    {/* Message Text */}
                    <p
                        className="text-sm cursor-pointer hover:bg-muted/50 rounded px-1.5 py-0.5 -mx-1.5 transition-colors"
                        onClick={() => setEditingMessageId(message.id)}
                    >
                        {message.text}
                    </p>

                    {/* Timestamp Editor */}
                    {editingTimestampId === message.id && (
                        <div className="pt-2 border-t border-border/50 space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    type="date"
                                    value={tempDate}
                                    onChange={(e) => setTempDate(e.target.value)}
                                    className="h-8 text-xs flex-1"
                                />
                                <Input
                                    type="time"
                                    value={tempTime}
                                    onChange={(e) => setTempTime(e.target.value)}
                                    className="h-8 text-xs w-28"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={saveTimestamp}
                                    className="flex-1 h-7 text-xs gap-1"
                                >
                                    <Check className="w-3 h-3" />
                                    Save
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEditingTimestamp}
                                    className="h-7 text-xs"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end pt-1">
                        <button
                            onClick={() => onRemoveMessage(message.id)}
                            className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
