import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
    user: User | null;
    plan: 'free' | 'pro' | 'premium';
    downloadsUsed: number;
    videosUsed: number;
    avatarUrl: string | null;
    fullName: string | null;
    loading: boolean;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    isUpgradeModalOpen: boolean;
    setUpgradeModalOpen: (open: boolean) => void;
    isProfileModalOpen: boolean;
    setProfileModalOpen: (open: boolean) => void;
    refetchUserStatus: () => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: { avatar_url?: string; full_name?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    plan: 'free',
    downloadsUsed: 0,
    videosUsed: 0,
    avatarUrl: null,
    fullName: null,
    loading: true,
    isAuthModalOpen: false,
    setAuthModalOpen: () => {},
    isUpgradeModalOpen: false,
    setUpgradeModalOpen: () => {},
    isProfileModalOpen: false,
    setProfileModalOpen: () => {},
    refetchUserStatus: async () => {},
    signOut: async () => {},
    updateProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [plan, setPlan] = useState<'free' | 'pro' | 'premium'>('free');
    const [downloadsUsed, setDownloadsUsed] = useState<number>(0);
    const [videosUsed, setVideosUsed] = useState<number>(0);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    // Global Modal States for easy triggering
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    
    // Memory leak guard
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchUserStatus = async (currentUser: User) => {
        // 3-count retry loop for async database trigger lag logic
        for (let i = 0; i < 3; i++) {
            if (!isMounted.current) return;
            
            const { data } = await supabase
                .from('users')
                .select('plan, downloads_used, videos_used, avatar_url, full_name')
                .eq('id', currentUser.id)
                .single();

            if (data !== null) {
                if (isMounted.current) {
                    setPlan(data.plan as 'free' | 'pro' | 'premium');
                    setDownloadsUsed(data.downloads_used || 0);
                    setVideosUsed(data.videos_used || 0);
                    setAvatarUrl(data.avatar_url || null);
                    setFullName(data.full_name || null);
                }
                return;
            }
            
            await new Promise(r => setTimeout(r, 300));
        }
    };

    const refetchUserStatus = async () => {
        if (user) {
            await fetchUserStatus(user);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setPlan('free');
        setDownloadsUsed(0);
        setVideosUsed(0);
        toast.success("Successfully logged out");
    };

    const updateProfile = async (updates: { avatar_url?: string; full_name?: string }) => {
        if (!user) throw new Error("No user found");

        // Use upsert instead of update to handle cases where the profile row might be missing
        const { error: dbError } = await supabase
            .from('users')
            .upsert({
                id: user.id,
                email: user.email,
                avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : (avatarUrl || ""),
                full_name: updates.full_name !== undefined ? updates.full_name : (fullName || ""),
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'id'
            });
        
        if (dbError) throw dbError;

        if (updates.avatar_url !== undefined) setAvatarUrl(updates.avatar_url);
        if (updates.full_name !== undefined) setFullName(updates.full_name);
        toast.success("Profile updated!");
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (isMounted.current) {
                    setUser(session?.user ?? null);
                }

                if (session?.user) {
                    await fetchUserStatus(session.user);
                } else {
                    if (isMounted.current) {
                        setPlan('free');
                        setDownloadsUsed(0);
                        setVideosUsed(0);
                    }
                }
            } catch (err) {
                console.error("Auth initialization failed:", err);
            } finally {
                if (isMounted.current) setLoading(false);
            }
        };

        // Guard against frozen Supabase edge nodes hanging startup
        const timeoutFailsafe = setTimeout(() => {
            if (isMounted.current && loading) {
                setLoading(false);
            }
        }, 2000);

        initializeAuth().finally(() => clearTimeout(timeoutFailsafe));

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (isMounted.current) {
                setUser(session?.user ?? null);
            }
            
            if (session?.user) {
                await fetchUserStatus(session.user);
            } else {
                if (isMounted.current) {
                    setPlan('free');
                    setDownloadsUsed(0);
                    setVideosUsed(0);
                }
            }
            if (isMounted.current) setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, plan, downloadsUsed, videosUsed, avatarUrl, fullName, loading,
            isAuthModalOpen, setAuthModalOpen,
            isUpgradeModalOpen, setUpgradeModalOpen,
            isProfileModalOpen, setProfileModalOpen,
            refetchUserStatus, signOut, updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
