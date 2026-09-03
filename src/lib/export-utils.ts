import html2canvas from 'html2canvas';

export interface ExportOptions {
    scale?: number;
    filename?: string;
    format?: 'png' | 'jpg';
}

export interface VideoExportOptions {
    scale?: number;
    filename?: string;
    durationMs?: number;
    fps?: number;
    onProgress?: (progress: number) => void;
}

const captureElement = (element: HTMLElement, scale: number) => {
    const width = Math.max(element.offsetWidth || Math.ceil(element.getBoundingClientRect().width), 1);
    const height = Math.max(element.offsetHeight || Math.ceil(element.getBoundingClientRect().height), 1);

    return html2canvas(element, {
        scale,
        width,
        height,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000,
    });
};

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

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
        const canvas = await captureElement(element, scale);
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, mimeType, format === 'jpg' ? 0.9 : undefined)
        );
        if (!blob) throw new Error('The image encoder returned an empty file.');
        downloadBlob(blob, filename);
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
        const canvas = await captureElement(element, scale);

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

/**
 * Record a preview as a WebM video. The DOM is re-rendered during capture so
 * typing indicators, message reveals, story progress, and call UI changes are
 * included in the exported clip.
 */
export const exportAsVideo = async (
    element: HTMLElement,
    options: VideoExportOptions = {}
): Promise<void> => {
    const {
        scale = 1.5,
        filename = `mockup-${Date.now()}.webm`,
        durationMs = 6000,
        fps = 30,
        onProgress,
    } = options;

    if (typeof MediaRecorder === 'undefined') {
        throw new Error('Video export is not supported by this browser.');
    }

    const mimeType = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
    ].find((type) => MediaRecorder.isTypeSupported(type));

    if (!mimeType) throw new Error('No supported WebM encoder was found.');

    const firstFrame = await captureElement(element, scale);
    const output = document.createElement('canvas');
    output.width = firstFrame.width;
    output.height = firstFrame.height;
    const context = output.getContext('2d');
    if (!context) throw new Error('Could not create the video canvas.');
    context.drawImage(firstFrame, 0, 0);

    const stream = output.captureStream(fps);
    const pixelCount = output.width * output.height;
    const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: pixelCount >= 8_000_000 ? 24_000_000 : pixelCount >= 2_000_000 ? 12_000_000 : 6_000_000,
    });
    const chunks: BlobPart[] = [];
    recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) chunks.push(event.data);
    });

    const recordingComplete = new Promise<Blob>((resolve, reject) => {
        recorder.addEventListener('stop', () => resolve(new Blob(chunks, { type: mimeType })));
        recorder.addEventListener('error', () => reject(new Error('The video recorder stopped unexpectedly.')));
    });

    recorder.start(500);
    const start = performance.now();
    const captureIntervalMs = 180;

    try {
        while (performance.now() - start < durationMs) {
            const frame = await captureElement(element, scale);
            context.clearRect(0, 0, output.width, output.height);
            context.drawImage(frame, 0, 0, output.width, output.height);
            onProgress?.(Math.min(0.98, (performance.now() - start) / durationMs));
            await new Promise((resolve) => window.setTimeout(resolve, captureIntervalMs));
        }
    } finally {
        if (recorder.state !== 'inactive') recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
    }

    const video = await recordingComplete;
    if (!video.size) throw new Error('The video encoder returned an empty file.');
    onProgress?.(1);
    downloadBlob(video, filename.endsWith('.webm') ? filename : `${filename}.webm`);
};
