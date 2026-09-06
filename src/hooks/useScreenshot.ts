import React, { useCallback } from "react";
import { copyToClipboard, exportAsImage } from "@/lib/export-utils";
import { toast } from "sonner";

export const useScreenshot = (ref: React.RefObject<HTMLElement>) => {
    const downloadScreenshot = useCallback(async (fileNamePrefix: string = 'screenshot') => {
        if (!ref.current) return;
        try {
            const saved = await exportAsImage(ref.current, {
                scale: 2,
                filename: `${fileNamePrefix}-${Date.now()}.png`,
                captureMode: 'viewport',
            });
            if (saved) toast.success("Screenshot downloaded!");
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download screenshot");
        }
    }, [ref]);

    const copyScreenshot = useCallback(async () => {
        if (!ref.current) return;
        try {
            const copied = await copyToClipboard(ref.current, 2, 'viewport');
            if (copied) toast.success("Screenshot copied to clipboard!");
            else toast.error("Failed to copy screenshot");
        } catch (error) {
            console.error("Copy failed:", error);
            toast.error("Failed to copy screenshot");
        }
    }, [ref]);

    return { downloadScreenshot, copyScreenshot };
};
