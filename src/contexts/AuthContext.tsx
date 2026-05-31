import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    user: any;
    plan: 'free' | 'pro' | 'premium';
    downloadsUsed: number;
    videosUsed: number;
    aiFillsUsed: number;
    lastAiFillDate: string | null;
    avatarUrl: string | null;
    fullName: string | null;
    loading: boolean;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    isUpgradeModalOpen: boolean;
    setUpgradeModalOpen: (open: boolean) => void;
    isProfileModalOpen: boolean;
    setProfileModalOpen: (open: boolean) => void;
    isDownloadModalOpen: boolean;
    setDownloadModalOpen: (open: boolean) => void;
    refetchUserStatus: () => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: { avatar_url?: string; full_name?: string }) => Promise<void>;
    incrementDownloads: () => Promise<void>;
    incrementVideos: () => Promise<void>;
    incrementAIFills: () => Promise<void>;
    triedBulkImport: boolean;
    markBulkImportAsTried: () => void;
}

const defaultUser = {
    id: 'local-user',
    email: 'local@veily.app',
    user_metadata: { full_name: 'Local User', avatar_url: null },
};

const AuthContext = createContext<AuthContextType>({
    user: defaultUser,
    plan: 'premium',
    downloadsUsed: 0,
    videosUsed: 0,
    aiFillsUsed: 0,
    lastAiFillDate: null,
    avatarUrl: null,
    fullName: 'Local User',
    loading: false,
    isAuthModalOpen: false,
    setAuthModalOpen: () => {},
    isUpgradeModalOpen: false,
    setUpgradeModalOpen: () => {},
    isProfileModalOpen: false,
    setProfileModalOpen: () => {},
    isDownloadModalOpen: false,
    setDownloadModalOpen: () => {},
    refetchUserStatus: async () => {},
    signOut: async () => {},
    updateProfile: async () => {},
    incrementDownloads: async () => {},
    incrementVideos: async () => {},
    incrementAIFills: async () => {},
    triedBulkImport: false,
    markBulkImportAsTried: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user] = useState(defaultUser);
    const [plan] = useState<'free' | 'pro' | 'premium'>('premium');
    const [downloadsUsed] = useState(0);
    const [videosUsed] = useState(0);
    const [aiFillsUsed, setAiFillsUsed] = useState(0);
    const [lastAiFillDate] = useState<string | null>(null);
    const [avatarUrl] = useState<string | null>(null);
    const [fullName, setFullName] = useState(() => localStorage.getItem('veily_display_name') || 'Local User');
    const [triedBulkImport, setTriedBulkImport] = useState(() => localStorage.getItem('veily_tried_bulk_import') === 'true');

    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);

    const markBulkImportAsTried = () => {
        setTriedBulkImport(true);
        localStorage.setItem('veily_tried_bulk_import', 'true');
    };

    return (
        <AuthContext.Provider value={{
            user, plan, downloadsUsed, videosUsed, aiFillsUsed, lastAiFillDate, avatarUrl, fullName,
            loading: false,
            isAuthModalOpen, setAuthModalOpen,
            isUpgradeModalOpen, setUpgradeModalOpen,
            isProfileModalOpen, setProfileModalOpen,
            isDownloadModalOpen, setDownloadModalOpen,
            refetchUserStatus: async () => {},
            signOut: async () => { setAiFillsUsed(0); },
            updateProfile: async (updates: any) => {
                if (updates.full_name) {
                    setFullName(updates.full_name);
                    localStorage.setItem('veily_display_name', updates.full_name);
                }
            },
            incrementDownloads: async () => {},
            incrementVideos: async () => {},
            incrementAIFills: async () => { setAiFillsUsed(prev => prev + 1); },
            triedBulkImport, markBulkImportAsTried,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
