import { Platform } from "@/types/chat";
import { PlatformSelector } from "@/components/PlatformSelector";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { AppWindow } from "lucide-react";

interface AppSectionProps {
    platform: Platform;
    onPlatformChange: (platform: Platform) => void;
}

export function AppSection({ platform, onPlatformChange }: AppSectionProps) {
    return (
        <AccordionItem value="app" className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <AppWindow className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-base font-semibold">App</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1">
                <PlatformSelector selected={platform} onSelect={onPlatformChange} />
            </AccordionContent>
        </AccordionItem>
    );
}
