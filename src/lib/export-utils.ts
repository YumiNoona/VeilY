import html2canvas from 'html2canvas';

export interface ExportOptions {
    scale?: number;
    filename?: string;
    format?: 'png' | 'jpg';
    captureMode?: 'viewport' | 'full';
}

export interface VideoExportOptions {
    scale?: number;
    filename?: string;
    durationMs?: number;
    fps?: number;
    autoScroll?: boolean;
    onProgress?: (progress: number) => void;
}

type CaptureMode = NonNullable<ExportOptions['captureMode']>;

const nextPaint = () => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
});

const findChatScroller = (element: HTMLElement): HTMLElement | null => {
    const explicitScroller = element.querySelector<HTMLElement>('[data-chat-scroll]');
    if (explicitScroller) return explicitScroller;

    const message = element.querySelector<HTMLElement>('[data-chat-message]');
    let candidate = message?.parentElement ?? null;
    while (candidate && candidate !== element) {
        const overflowY = window.getComputedStyle(candidate).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') return candidate;
        candidate = candidate.parentElement;
    }
    return null;
};

const waitForAssets = async (element: HTMLElement) => {
    await document.fonts?.ready;
    await Promise.all(Array.from(element.querySelectorAll('img')).map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
            image.addEventListener('load', () => resolve(), { once: true });
            image.addEventListener('error', () => resolve(), { once: true });
        });
    }));
    await nextPaint();
};

const prepareFullConversationClone = async (element: HTMLElement) => {
    const sourceRect = element.getBoundingClientRect();
    const sourceWidth = Math.max(element.offsetWidth || Math.ceil(sourceRect.width), 1);
    const sourceHeight = Math.max(element.offsetHeight || Math.ceil(sourceRect.height), 1);
    const sourceScroller = findChatScroller(element);
    const overflowHeight = sourceScroller ? Math.max(0, sourceScroller.scrollHeight - sourceScroller.clientHeight) : 0;
    const exportHeight = sourceHeight + overflowHeight;
    const host = document.createElement('div');
    const clone = element.cloneNode(true) as HTMLElement;

    Object.assign(host.style, {
        position: 'absolute',
        left: '-100000px',
        top: '0',
        width: `${sourceWidth}px`,
        height: `${exportHeight}px`,
        overflow: 'visible',
        pointerEvents: 'none',
    });
    Object.assign(clone.style, {
        width: `${sourceWidth}px`,
        maxWidth: 'none',
        height: `${exportHeight}px`,
        minHeight: '0',
        maxHeight: `${exportHeight}px`,
        margin: '0',
        transform: 'none',
        transition: 'none',
    });

    host.appendChild(clone);
    document.body.appendChild(host);

    const scroller = findChatScroller(clone);
    if (scroller && sourceScroller) {
        scroller.scrollTop = 0;
        Object.assign(scroller.style, {
            height: `${sourceScroller.scrollHeight}px`,
            minHeight: `${sourceScroller.scrollHeight}px`,
            maxHeight: `${sourceScroller.scrollHeight}px`,
            overflow: 'visible',
            overflowY: 'visible',
            flex: 'none',
        });

    }

    await waitForAssets(clone);
    return { clone, host, width: sourceWidth, height: exportHeight };
};

const getSafeCanvasScale = (width: number, height: number, requestedScale: number) => {
    const maxDimension = 32760;
    const maxArea = 64_000_000;
    return Math.max(0.1, Math.min(
        requestedScale,
        maxDimension / width,
        maxDimension / height,
        Math.sqrt(maxArea / (width * height)),
    ));
};

const captureElement = async (
    element: HTMLElement,
    scale: number,
    captureMode: CaptureMode = 'viewport',
) => {
    await waitForAssets(element);
    let captureTarget = element;
    let cleanup: (() => void) | undefined;
    const sourceRect = element.getBoundingClientRect();
    let width = Math.max(element.offsetWidth || Math.ceil(sourceRect.width), 1);
    let height = Math.max(element.offsetHeight || Math.ceil(sourceRect.height), 1);

    if (captureMode === 'full' && findChatScroller(element)) {
        const { clone, host, width: cloneWidth, height: cloneHeight } = await prepareFullConversationClone(element);
        captureTarget = clone;
        cleanup = () => host.remove();
        width = cloneWidth;
        height = cloneHeight;
    }

    const safeScale = getSafeCanvasScale(width, height, scale);

    try {
        return await html2canvas(captureTarget, {
            scale: safeScale,
            width,
            height,
            windowWidth: Math.max(document.documentElement.clientWidth, width),
            windowHeight: Math.max(document.documentElement.clientHeight, height),
            scrollX: 0,
            scrollY: 0,
            backgroundColor: null,
            useCORS: true,
            allowTaint: false,
            logging: false,
            imageTimeout: 15000,
            removeContainer: true,
            onclone: (clonedDocument) => {
                clonedDocument.querySelectorAll<HTMLElement>('[data-export-root], [data-export-root] *').forEach((node) => {
                    node.style.animationPlayState = 'paused';
                    node.style.transition = 'none';
                    node.style.caretColor = 'transparent';
                });
            },
        });
    } finally {
        cleanup?.();
    }
};

const isTauri = () =>
    typeof window !== 'undefined' && typeof window.__TAURI_INTERNALS__ !== 'undefined';

const saveBlob = async (blob: Blob, filename: string): Promise<boolean> => {
    if (isTauri()) {
        const [{ save }, { writeFile }] = await Promise.all([
            import('@tauri-apps/plugin-dialog'),
            import('@tauri-apps/plugin-fs'),
        ]);
        const extension = filename.split('.').pop()?.toLowerCase() || 'png';
        const path = await save({
            defaultPath: filename,
            filters: [{
                name: extension === 'webm' ? 'WebM video' : extension === 'jpg' ? 'JPEG image' : 'PNG image',
                extensions: [extension],
            }],
        });

        if (!path) return false;
        await writeFile(path, new Uint8Array(await blob.arrayBuffer()));
        return true;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
};

/**
 * Common utility to export a DOM element as an image using html2canvas.
 * @param element The HTML element to capture.
 * @param options Export configuration (scale, filename, format).
 */
export const exportAsImage = async (
    element: HTMLElement,
    options: ExportOptions = {}
): Promise<boolean> => {
    const { 
        scale = 2, 
        filename = `mockup-${Date.now()}.png`,
        format = 'png',
        captureMode = 'viewport',
    } = options;

    try {
        const canvas = await captureElement(element, scale, captureMode);
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, mimeType, format === 'jpg' ? 0.9 : undefined)
        );
        if (!blob) throw new Error('The image encoder returned an empty file.');
        return await saveBlob(blob, filename);
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
    scale: number = 2,
    captureMode: CaptureMode = 'viewport',
): Promise<boolean> => {
    try {
        if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
            throw new Error('Copying images is not supported by this browser.');
        }
        const canvas = await captureElement(element, scale, captureMode);

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
): Promise<boolean> => {
    const {
        scale = 1.5,
        filename = `mockup-${Date.now()}.webm`,
        durationMs = 6000,
        fps = 30,
        autoScroll = false,
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

    const scroller = autoScroll ? findChatScroller(element) : null;
    const originalScrollTop = scroller?.scrollTop ?? 0;
    if (scroller) {
        scroller.scrollTop = 0;
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }

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
            const elapsed = performance.now() - start;
            if (scroller) {
                const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
                scroller.scrollTop = maxScroll * Math.min(1, elapsed / durationMs);
            }
            const frame = await captureElement(element, scale);
            context.clearRect(0, 0, output.width, output.height);
            context.drawImage(frame, 0, 0, output.width, output.height);
            onProgress?.(Math.min(0.98, elapsed / durationMs));
            await new Promise((resolve) => window.setTimeout(resolve, captureIntervalMs));
        }
    } finally {
        if (recorder.state !== 'inactive') recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        if (scroller) scroller.scrollTop = originalScrollTop;
    }

    const video = await recordingComplete;
    if (!video.size) throw new Error('The video encoder returned an empty file.');
    onProgress?.(1);
    return await saveBlob(video, filename.endsWith('.webm') ? filename : `${filename}.webm`);
};
