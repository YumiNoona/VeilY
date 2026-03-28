import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Global keyboard shortcuts wired at the Layout level.
 *
 * Ctrl/Cmd + 1-6  → Navigate between primary tabs
 * Ctrl/Cmd + ,    → Open Profile modal
 * Ctrl/Cmd + U    → Open Upgrade modal
 * Escape          → Close any open modal
 */
export function useKeyboardShortcuts() {
    const navigate = useNavigate();
    const {
        setProfileModalOpen,
        setUpgradeModalOpen,
        setAuthModalOpen,
        setDownloadModalOpen,
        isProfileModalOpen,
        isUpgradeModalOpen,
        isAuthModalOpen,
        isDownloadModalOpen,
    } = useAuth();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const mod = e.ctrlKey || e.metaKey;

            // Don't intercept when user is typing in an input/textarea
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            // Escape — dismiss any open modal
            if (e.key === 'Escape') {
                if (isProfileModalOpen) { setProfileModalOpen(false); return; }
                if (isUpgradeModalOpen) { setUpgradeModalOpen(false); return; }
                if (isAuthModalOpen) { setAuthModalOpen(false); return; }
                if (isDownloadModalOpen) { setDownloadModalOpen(false); return; }
            }

            if (!mod) return;

            // Tab navigation: Ctrl+1 through Ctrl+6
            const tabRoutes: Record<string, string> = {
                '1': '/',
                '2': '/ai-chat',
                '3': '/social',
                '4': '/comments',
                '5': '/stories',
                '6': '/email',
            };

            if (tabRoutes[e.key]) {
                e.preventDefault();
                navigate(tabRoutes[e.key]);
                return;
            }

            // Ctrl+, → Profile
            if (e.key === ',') {
                e.preventDefault();
                setProfileModalOpen(true);
                return;
            }

            // Ctrl+U → Upgrade
            if (e.key === 'u' || e.key === 'U') {
                e.preventDefault();
                setUpgradeModalOpen(true);
                return;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [
        navigate,
        isProfileModalOpen, isUpgradeModalOpen, isAuthModalOpen, isDownloadModalOpen,
        setProfileModalOpen, setUpgradeModalOpen, setAuthModalOpen, setDownloadModalOpen,
    ]);
}
