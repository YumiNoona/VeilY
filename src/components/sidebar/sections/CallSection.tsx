import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Users, MicOff, VideoOff, Plus, Trash2, SignalHigh, SignalLow, Disc, Clock, Camera, MonitorUp, LayoutGrid, Image as ImageIcon, X, Captions, MessageSquare, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CallState, CallParticipant } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resizeImageAsDataURL } from "@/lib/image-utils";
import { toast } from "sonner";

interface CallSectionProps {
    state: CallState;
    onUpdateDuration: (duration: string) => void;
    onAddParticipant: (p: CallParticipant) => void;
    onUpdateParticipant: (id: string, updates: Partial<CallParticipant>) => void;
    onUpdateSettings: (updates: Partial<CallState>) => void;
    onRemoveParticipant: (id: string) => void;
    onToggleSignal: () => void;
    onToggleRecording: () => void;
}

export function CallSection({
    state,
    onUpdateDuration,
    onAddParticipant,
    onUpdateParticipant,
    onUpdateSettings,
    onRemoveParticipant,
    onToggleSignal,
    onToggleRecording
}: CallSectionProps) {
    const handleAdd = () => {
        const newP: CallParticipant = {
            id: crypto.randomUUID(),
            name: `Participant ${state.participants.length + 1}`,
            avatar: "",
            isMuted: false,
            isCameraOff: false,
            isSpeaking: false
        };
        onAddParticipant(newP);
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, participant: CallParticipant) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const avatar = await resizeImageAsDataURL(file, 512, 0.84);
            onUpdateParticipant(participant.id, { avatar });
        } catch (error) {
            console.error("Error reading participant image:", error);
            toast.error(error instanceof Error ? error.message : "Unable to upload that image");
        } finally {
            event.target.value = '';
        }
    };

    const handleSharedMediaChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const sharedMedia = await resizeImageAsDataURL(file, 1600, 0.84);
            onUpdateSettings({ sharedMedia, isScreenSharing: true });
            toast.success("Shared image added");
        } catch (error) {
            console.error("Error reading shared image:", error);
            toast.error(error instanceof Error ? error.message : "Unable to upload that image");
        } finally {
            event.target.value = '';
        }
    };

    return (
        <AccordionItem value="call-participants" className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-base font-semibold">Participants & Settings</span>
                    <span className="ml-1 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                        {state.participants.length}
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1 space-y-4">
                {/* Call Settings */}
                <div className="space-y-3 pb-3 border-b border-border/50">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="call-title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Call title</Label>
                            <Input
                                id="call-title"
                                value={state.title}
                                onChange={(event) => onUpdateSettings({ title: event.target.value })}
                                className="h-9 text-sm"
                                placeholder="Team catch-up"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="meeting-code" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Meeting code</Label>
                            <Input
                                id="meeting-code"
                                value={state.meetingCode}
                                onChange={(event) => onUpdateSettings({ meetingCode: event.target.value })}
                                className="h-9 font-mono text-sm"
                                placeholder="abc-defg-hij"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase text-muted-foreground flex items-center gap-1">
                                <LayoutGrid className="w-3 h-3" /> Layout
                            </Label>
                            <Select value={state.layout} onValueChange={(value) => onUpdateSettings({ layout: value as CallState['layout'] })}>
                                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="grid">Grid</SelectItem>
                                    <SelectItem value="speaker">Speaker</SelectItem>
                                    <SelectItem value="sidebar">Stage + strip</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase text-muted-foreground">Quality</Label>
                            <Select value={state.quality} onValueChange={(value) => onUpdateSettings({ quality: value as CallState['quality'] })}>
                                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="auto">Auto</SelectItem>
                                    <SelectItem value="hd">HD</SelectItem>
                                    <SelectItem value="low">Low bandwidth</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 items-end gap-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Duration
                            </Label>
                            <Input
                                value={state.duration}
                                onChange={(e) => onUpdateDuration(e.target.value)}
                                className="h-9 text-sm"
                            />
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn("h-9 gap-1 px-2 text-xs", state.isSignalLow && "border-red-500 text-red-500")}
                            onClick={onToggleSignal}
                        >
                            {state.isSignalLow ? <SignalLow className="w-3 h-3" /> : <SignalHigh className="w-3 h-3" />}
                            Signal
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn("h-9 gap-1 px-2 text-xs", state.isRecording && "border-red-500 text-red-500")}
                            onClick={onToggleRecording}
                        >
                            <Disc className={cn("w-3 h-3", state.isRecording && "animate-pulse fill-current")} />
                            Recording
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="flex h-10 items-center justify-between gap-2 rounded-lg border bg-background px-2.5">
                            <Label htmlFor="call-names" className="text-xs">Name labels</Label>
                            <Switch id="call-names" checked={state.showNames} onCheckedChange={(checked) => onUpdateSettings({ showNames: checked })} />
                        </div>
                        <div className="flex h-10 items-center justify-between gap-2 rounded-lg border bg-background px-2.5">
                            <Label htmlFor="call-timer" className="text-xs">Call timer</Label>
                            <Switch id="call-timer" checked={state.showTimer} onCheckedChange={(checked) => onUpdateSettings({ showTimer: checked })} />
                        </div>
                        <div className="flex h-10 items-center justify-between gap-2 rounded-lg border bg-background px-2.5">
                            <Label htmlFor="call-blur" className="text-xs">Background blur</Label>
                            <Switch id="call-blur" checked={state.backgroundBlur} onCheckedChange={(checked) => onUpdateSettings({ backgroundBlur: checked })} />
                        </div>
                        <div className="flex h-10 items-center justify-between gap-2 rounded-lg border bg-background px-2.5">
                            <Label htmlFor="call-share" className="flex items-center gap-1 text-xs"><MonitorUp className="w-3.5 h-3.5" /> Present</Label>
                            <Switch id="call-share" checked={state.isScreenSharing} onCheckedChange={(checked) => onUpdateSettings({ isScreenSharing: checked })} />
                        </div>
                        <div className="flex h-10 items-center justify-between gap-2 rounded-lg border bg-background px-2.5">
                            <Label htmlFor="call-captions" className="flex items-center gap-1 text-xs"><Captions className="w-3.5 h-3.5" /> Captions</Label>
                            <Switch id="call-captions" checked={state.showCaptions} onCheckedChange={(checked) => onUpdateSettings({ showCaptions: checked })} />
                        </div>
                        <div className="flex h-10 items-center justify-between gap-2 rounded-lg border bg-background px-2.5">
                            <Label htmlFor="call-chat" className="flex items-center gap-1 text-xs"><MessageSquare className="w-3.5 h-3.5" /> Chat panel</Label>
                            <Switch id="call-chat" checked={state.showChatPanel} onCheckedChange={(checked) => onUpdateSettings({ showChatPanel: checked, ...(checked ? { showParticipantPanel: false } : {}) })} />
                        </div>
                        <div className="col-span-2 flex h-10 items-center justify-between gap-2 rounded-lg border bg-background px-2.5">
                            <Label htmlFor="call-people" className="flex items-center gap-1 text-xs"><PanelRight className="w-3.5 h-3.5" /> Participant panel</Label>
                            <Switch id="call-people" checked={state.showParticipantPanel} onCheckedChange={(checked) => onUpdateSettings({ showParticipantPanel: checked, ...(checked ? { showChatPanel: false } : {}) })} />
                        </div>
                    </div>

                    <div className="rounded-xl border border-dashed bg-background p-2.5">
                        <div className="mb-2 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold">Shared image</p>
                                <p className="mt-0.5 text-xs leading-4 text-muted-foreground">Upload a screen, slide, photo, or document preview.</p>
                            </div>
                            {state.sharedMedia && (
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateSettings({ sharedMedia: undefined })} title="Remove shared image"><X className="h-3.5 w-3.5" /></Button>
                            )}
                        </div>
                        {state.sharedMedia ? (
                            <label className="group relative block h-20 cursor-pointer overflow-hidden rounded-lg border bg-muted">
                                <img src={state.sharedMedia} alt="Shared preview" className="h-full w-full object-cover" />
                                <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">Replace image</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleSharedMediaChange} />
                            </label>
                        ) : (
                            <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-muted/30 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground">
                                <ImageIcon className="h-4 w-4" /> Choose image
                                <input type="file" accept="image/*" className="hidden" onChange={handleSharedMediaChange} />
                            </label>
                        )}
                    </div>
                </div>

                {/* Participant List */}
                <div className="space-y-3">
                    {state.participants.map((p) => (
                        <div key={p.id} className="p-2.5 border rounded-lg bg-secondary/20 space-y-2.5">
                            <div className="flex items-center gap-2">
                                <label className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-full bg-muted group">
                                    {p.avatar ? (
                                        <img src={p.avatar} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">{p.name.charAt(0) || '?'}</span>
                                    )}
                                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Camera className="h-3.5 w-3.5 text-white" />
                                    </span>
                                    <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImageChange(event, p)} />
                                </label>
                                <Input 
                                    value={p.name} 
                                    onChange={(e) => onUpdateParticipant(p.id, { name: e.target.value })}
                                    className="h-9 flex-1 text-sm"
                                    placeholder="Name"
                                />
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => onRemoveParticipant(p.id)}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`mute-${p.id}`} 
                                        checked={p.isMuted} 
                                        onCheckedChange={(val) => onUpdateParticipant(p.id, { isMuted: !!val })} 
                                    />
                                    <Label htmlFor={`mute-${p.id}`} className="text-xs font-medium flex items-center gap-1">
                                        <MicOff className="w-3 h-3" /> Mute
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`cam-${p.id}`} 
                                        checked={p.isCameraOff} 
                                        onCheckedChange={(val) => onUpdateParticipant(p.id, { isCameraOff: !!val })} 
                                    />
                                    <Label htmlFor={`cam-${p.id}`} className="text-xs font-medium flex items-center gap-1">
                                        <VideoOff className="w-3 h-3" /> Cam Off
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 ml-auto">
                                    <Checkbox 
                                        id={`speak-${p.id}`} 
                                        checked={p.isSpeaking} 
                                        onCheckedChange={(val) => onUpdateParticipant(p.id, { isSpeaking: !!val })} 
                                    />
                                    <Label htmlFor={`speak-${p.id}`} className="text-xs font-medium text-emerald-600">
                                        Speaking
                                    </Label>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button 
                        variant="outline" 
                        className="h-9 w-full gap-2 border-dashed text-sm"
                        onClick={handleAdd}
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Participant
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
