import { ChatType } from "@/types/chat";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TypeSectionProps {
    chatType: ChatType;
    onChatTypeChange: (type: ChatType) => void;
}

export function TypeSection({ chatType, onChatTypeChange }: TypeSectionProps) {
    return (
        <AccordionItem value="type" className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="font-semibold text-sm">Type</span>
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
                        {chatType === 'direct' ? 'Direct' : 'Group'}
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1">
                <div className="flex gap-2">
                    <button
                        onClick={() => onChatTypeChange('direct')}
                        className={cn(
                            "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5",
                            chatType === 'direct'
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                        )}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Direct
                    </button>
                    <button
                        onClick={() => onChatTypeChange('group')}
                        className={cn(
                            "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5",
                            chatType === 'group'
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                        )}
                    >
                        <Users className="w-3.5 h-3.5" />
                        Group
                    </button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
