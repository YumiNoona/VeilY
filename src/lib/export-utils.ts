import html2canvas from 'html2canvas';

export interface ExportOptions {
    scale?: number;
    filename?: string;
    format?: 'png' | 'jpg';
}

/**
 * Common utility to export a DOM element as an image using html2canvas.
 * @param element The HTML element to capture.
 * @param options Export configuration (scale, filename, format).
 */
export const exportAsImage = async (
    element: HTMLElement,
    options: ExportOptions = {}
): Promise<void> => {
    const { 
        scale = 2, 
        filename = `mockup-${Date.now()}.png`,
        format = 'png'
    } = options;

    try {
        const canvas = await html2canvas(element, {
            scale,
            backgroundColor: null,
            useCORS: true,
            allowTaint: true,
            logging: false,
        });

        const image = canvas.toDataURL(`image/${format}`, format === 'jpg' ? 0.9 : undefined);
        const link = document.createElement('a');
        link.download = filename;
        link.href = image;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Failed to export image:', error);
        throw error;
    }
};

/**
 * Copy an element capture to clipboard.
 */
export const copyToClipboard = async (
    element: HTMLElement,
    scale: number = 2
): Promise<boolean> => {
    try {
        const canvas = await html2canvas(element, {
            scale,
            backgroundColor: null,
            useCORS: true,
            allowTaint: true,
        });

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
};
