import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newText: string) => void;
    initialText: string;
}

export function EditMessageModal({ isOpen, onClose, onSave, initialText }: EditMessageModalProps) {
    const [text, setText] = useState(initialText);

    useEffect(() => {
        if (isOpen) setText(initialText);
    }, [isOpen, initialText]);

    const handleSave = () => {
        onSave(text);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1b1e] border-[#2c2d31] text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[17px] font-semibold">
                        <div className="p-1.5 rounded-full bg-blue-500/10">
                            <Edit2 className="w-4 h-4 text-blue-400" />
                        </div>
                        Edit Message
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <Textarea
                        className="min-h-[120px] bg-[#0f1012] border-[#2c2d31] text-white placeholder:text-zinc-600 focus-visible:ring-blue-500/50 resize-none rounded-xl"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your message here..."
                        autoFocus
                    />
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl px-6"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
