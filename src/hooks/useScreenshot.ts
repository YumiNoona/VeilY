import React, { useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

export const useScreenshot = (ref: React.RefObject<HTMLElement>) => {
    const getCanvas = useCallback(async (): Promise<HTMLCanvasElement | null> => {
        if (!ref.current) return null;
        try {
            const canvas = await html2canvas(ref.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
            });
            return canvas;
        } catch (error) {
            console.error("Canvas render failed:", error);
            toast.error("Failed to generate image");
            return null;
        }
    }, [ref]);

    const downloadScreenshot = useCallback(async (fileNamePrefix: string = 'screenshot') => {
        const canvas = await getCanvas();
        if (!canvas) return;
        try {
            const link = document.createElement('a');
            link.download = `${fileNamePrefix}-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success("Screenshot downloaded!");
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download screenshot");
        }
    }, [getCanvas]);

    const copyScreenshot = useCallback(async () => {
        const canvas = await getCanvas();
        if (!canvas) return;
        try {
            // Wrap toBlob in a Promise so we can properly catch null
            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
            if (!blob) {
                toast.error("Failed to copy — could not generate image blob");
                return;
            }
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            toast.success("Screenshot copied to clipboard!");
        } catch (error) {
            console.error("Copy failed:", error);
            toast.error("Failed to copy screenshot");
        }
    }, [getCanvas]);

    return { downloadScreenshot, copyScreenshot };
};
