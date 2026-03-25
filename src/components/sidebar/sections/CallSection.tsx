import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Users, Phone, MicOff, VideoOff, Plus, Trash2, SignalHigh, SignalLow, Disc, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CallState, CallParticipant } from "@/types/chat";
import { cn } from "@/lib/utils";

interface CallSectionProps {
    state: CallState;
    onUpdateDuration: (duration: string) => void;
    onAddParticipant: (p: CallParticipant) => void;
    onUpdateParticipant: (id: string, updates: Partial<CallParticipant>) => void;
    onRemoveParticipant: (id: string) => void;
    onToggleSignal: () => void;
    onToggleRecording: () => void;
}

export function CallSection({
    state,
    onUpdateDuration,
    onAddParticipant,
    onUpdateParticipant,
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

    return (
        <AccordionItem value="call-participants" className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-sm">Participants & Settings</span>
                    <span className="ml-1 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                        {state.participants.length}
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1 space-y-4">
                {/* Call Settings */}
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border/50">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Duration
                        </Label>
                        <Input 
                            value={state.duration} 
                            onChange={(e) => onUpdateDuration(e.target.value)}
                            className="h-8 text-[12px]"
                        />
                    </div>
                    <div className="flex flex-col justify-end gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn("h-8 text-[10px] gap-1.5", state.isSignalLow && "border-red-500 text-red-500")}
                            onClick={onToggleSignal}
                        >
                            {state.isSignalLow ? <SignalLow className="w-3 h-3" /> : <SignalHigh className="w-3 h-3" />}
                            Signal
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn("h-8 text-[10px] gap-1.5", state.isRecording && "border-red-500 text-red-500")}
                            onClick={onToggleRecording}
                        >
                            <Disc className={cn("w-3 h-3", state.isRecording && "animate-pulse fill-current")} />
                            Recording
                        </Button>
                    </div>
                </div>

                {/* Participant List */}
                <div className="space-y-3">
                    {state.participants.map((p) => (
                        <div key={p.id} className="p-2 border rounded-lg bg-secondary/20 space-y-2">
                            <div className="flex items-center gap-2">
                                <Input 
                                    value={p.name} 
                                    onChange={(e) => onUpdateParticipant(p.id, { name: e.target.value })}
                                    className="h-7 text-xs flex-1"
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
                            <div className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`mute-${p.id}`} 
                                        checked={p.isMuted} 
                                        onCheckedChange={(val) => onUpdateParticipant(p.id, { isMuted: !!val })} 
                                    />
                                    <Label htmlFor={`mute-${p.id}`} className="text-[10px] font-medium flex items-center gap-1">
                                        <MicOff className="w-3 h-3" /> Mute
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`cam-${p.id}`} 
                                        checked={p.isCameraOff} 
                                        onCheckedChange={(val) => onUpdateParticipant(p.id, { isCameraOff: !!val })} 
                                    />
                                    <Label htmlFor={`cam-${p.id}`} className="text-[10px] font-medium flex items-center gap-1">
                                        <VideoOff className="w-3 h-3" /> Cam Off
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 ml-auto">
                                    <Checkbox 
                                        id={`speak-${p.id}`} 
                                        checked={p.isSpeaking} 
                                        onCheckedChange={(val) => onUpdateParticipant(p.id, { isSpeaking: !!val })} 
                                    />
                                    <Label htmlFor={`speak-${p.id}`} className="text-[10px] font-medium text-emerald-600">
                                        Speaking
                                    </Label>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button 
                        variant="outline" 
                        className="w-full h-8 text-[11px] gap-2 border-dashed"
                        onClick={handleAdd}
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Participant
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
