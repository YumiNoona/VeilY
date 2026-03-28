import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Monitors browser online/offline status and shows a persistent toast
 * when the user loses connectivity. Auto-dismisses when back online.
 */
export function useOfflineDetection() {
    const toastIdRef = useRef<string | number | null>(null);

    useEffect(() => {
        const handleOffline = () => {
            toastIdRef.current = toast.error('You are offline. Some features may not work.', {
                duration: Infinity,
                id: 'offline-banner',
                description: 'Check your internet connection.',
            });
        };

        const handleOnline = () => {
            if (toastIdRef.current) {
                toast.dismiss('offline-banner');
                toastIdRef.current = null;
            }
            toast.success('Back online!', { duration: 2000 });
        };

        // Check initial state
        if (!navigator.onLine) {
            handleOffline();
        }

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);
}
