import React, { useCallback } from "react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export const useScreenshot = (ref: React.RefObject<HTMLElement>) => {
    const downloadScreenshot = useCallback(async (fileNamePrefix: string = 'screenshot') => {
        if (!ref.current) return;

        try {
            const canvas = await html2canvas(ref.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
            });

            const link = document.createElement('a');
            link.download = `${fileNamePrefix}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success("Screenshot downloaded!");
        } catch (error) {
            console.error("Screenshot failed:", error);
            toast.error("Failed to download screenshot");
        }
    }, [ref]);

    const copyScreenshot = useCallback(async () => {
        if (!ref.current) return;

        try {
            const canvas = await html2canvas(ref.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
            });

            canvas.toBlob(async (blob) => {
                if (blob) {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    toast.success("Screenshot copied to clipboard!");
                }
            });
        } catch (error) {
            console.error("Copy failed:", error);
            toast.error("Failed to copy screenshot");
        }
    }, [ref]);

    return { downloadScreenshot, copyScreenshot };
};
