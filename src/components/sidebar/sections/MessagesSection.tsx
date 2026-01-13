import React, { useState, useRef } from "react";
import { Message, Person } from "@/types/chat";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { MessageCircle, X, ImagePlus, Plus, User, Clock, Trash2, Check, Bot, GripVertical, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { readFileAsDataURL } from "@/lib/image-utils";

interface MessagesSectionProps {
    messages: Message[];
    people: Person[];
    mode?: 'default' | 'ai';
    onAddMessage: (text: string, isOwn: boolean, image?: string) => void;
    onRemoveMessage: (id: string) => void;
    onUpdateMessage: (id: string, newText: string, newTimestamp?: Date, newImage?: string, isOwn?: boolean) => void;
}

export function MessagesSection({
    messages,
    people,
    mode = 'default',
    onAddMessage,
    onRemoveMessage,
    onUpdateMessage,
}: MessagesSectionProps) {
    const [newMessage, setNewMessage] = useState("");
    const [isOwnMessage, setIsOwnMessage] = useState(true);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editingTimestampId, setEditingTimestampId] = useState<string | null>(null);
    const [messageImage, setMessageImage] = useState<string | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);

    // Temp state for date/time editing
    const [tempDate, setTempDate] = useState<string>("");
    const [tempTime, setTempTime] = useState<string>("");

    const handleSendMessage = () => {
        if (newMessage.trim() || messageImage) {
            onAddMessage(newMessage.trim(), isOwnMessage, messageImage || undefined);
            setNewMessage("");
            setMessageImage(null);
        }
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
                // Cast to match the new signature which expects isOwn specific arguments or we just pass undefined
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
        // Toggle isOwn. If currently true (User), become false (Assistant), and vice versa.
        // We only change the isOwn property.
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
                        <div className="flex gap-1.5">
                            <button
                                onClick={() => setIsOwnMessage(false)}
                                className={cn(
                                    "flex-1 py-1.5 px-2 rounded-lg text-[10px] font-medium transition-all",
                                    !isOwnMessage ? "bg-secondary ring-2 ring-primary text-foreground" : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60"
                                )}
                            >
                                Received
                            </button>
                            <button
                                onClick={() => setIsOwnMessage(true)}
                                className={cn(
                                    "flex-1 py-1.5 px-2 rounded-lg text-[10px] font-medium transition-all",
                                    isOwnMessage ? "bg-primary text-primary-foreground" : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60"
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
                        <Input
                            placeholder={mode === 'ai' ? "Add a message..." : "Type a message..."}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1 h-9 text-sm"
                        />
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageSelect}
                        />
                        {mode === 'default' && (
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => imageInputRef.current?.click()}
                                className="flex-shrink-0 h-9 w-9"
                            >
                                <ImagePlus className="w-4 h-4" />
                            </Button>
                        )}
                        <Button size="icon" onClick={handleSendMessage} className="flex-shrink-0 h-9 w-9">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Message List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
                    {messages.map((message) => {
                        const msgPerson = people.find(p => p.id === message.senderId);

                        // AI Mode Specific Rendering
                        if (mode === 'ai') {
                            const isUser = message.isOwn;
                            return (
                                <div key={message.id} className="group relative flex gap-2 rounded-xl border border-border/60 bg-card p-3 shadow-sm hover:border-border/80 transition-colors">
                                    {/* Drag Handle */}
                                    <div className="mt-1 text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing">
                                        <GripVertical className="w-4 h-4" />
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        {/* Header */}
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

                                        {/* Content Input */}
                                        <Textarea
                                            value={message.text}
                                            onChange={(e) => onUpdateMessage(message.id, e.target.value)}
                                            className="min-h-[60px] text-sm resize-y bg-background"
                                        />

                                        {/* Footer Actions */}
                                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/30">
                                            <button
                                                onClick={() => toggleMessageRole(message)}
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
                            <div key={message.id} className={cn("rounded-lg border border-border/50 overflow-hidden", message.isOwn ? "bg-primary/5" : "bg-secondary/30")}>
                                {editingMessageId === message.id ? (
                                    <div className="p-2.5">
                                        <Textarea
                                            value={message.text}
                                            onChange={(e) => onUpdateMessage(message.id, e.target.value)}
                                            onBlur={() => setEditingMessageId(null)}
                                            className="min-h-[50px] text-sm"
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <div className="p-2.5 space-y-1.5">
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
                                                onClick={() => startEditingTimestamp(message.id, message.timestamp)}
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
                                                        onClick={() => saveTimestamp(message.id)}
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
                    })}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
