import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
    user: User | null;
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

const AuthContext = createContext<AuthContextType>({
    user: null,
    plan: 'free',
    downloadsUsed: 0,
    videosUsed: 0,
    aiFillsUsed: 0,
    lastAiFillDate: null,
    avatarUrl: null,
    fullName: null,
    loading: true,
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
    const [user, setUser] = useState<User | null>(null);
    const [plan, setPlan] = useState<'free' | 'pro' | 'premium'>('free');
    const [downloadsUsed, setDownloadsUsed] = useState<number>(0);
    const [videosUsed, setVideosUsed] = useState<number>(0);
    const [aiFillsUsed, setAiFillsUsed] = useState<number>(0);
    const [lastAiFillDate, setLastAiFillDate] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [triedBulkImport, setTriedBulkImport] = useState<boolean>(false);
    
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
    
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchUserStatus = async (currentUser: User) => {
        if (currentUser.user_metadata?.full_name && !fullName) {
            setFullName(currentUser.user_metadata.full_name);
        }
        if (currentUser.user_metadata?.avatar_url && !avatarUrl) {
            setAvatarUrl(currentUser.user_metadata.avatar_url);
        }

        for (let i = 0; i < 3; i++) {
            if (!isMounted.current) return;
            
            const { data, error } = await supabase
                .from('users')
                .select('plan, downloads_used, videos_used, ai_fills_used, last_ai_fill_date, avatar_url, full_name')
                .eq('id', currentUser.id)
                .single();

            if (!error && data !== null) {
                if (isMounted.current) {
                    setPlan(data.plan as 'free' | 'pro' | 'premium');
                    setDownloadsUsed(data.downloads_used || 0);
                    setVideosUsed(data.videos_used || 0);

                    const today = new Date().toISOString().split('T')[0];
                    if (data.last_ai_fill_date !== today) {
                        setAiFillsUsed(0);
                        setLastAiFillDate(today);
                        supabase.from('users').update({ 
                            last_ai_fill_date: today, 
                            ai_fills_used: 0 
                        }).eq('id', currentUser.id).then();
                    } else {
                        setAiFillsUsed(data.ai_fills_used || 0);
                        setLastAiFillDate(data.last_ai_fill_date);
                    }

                    if (data.avatar_url) setAvatarUrl(data.avatar_url);
                    if (data.full_name) setFullName(data.full_name);
                }
                return;
            }
            
            await new Promise(r => setTimeout(r, 500));
        }
    };

    const refetchUserStatus = async () => {
        if (user) {
            await fetchUserStatus(user);
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error("Supabase signOut error:", err);
        } finally {
            // Reset state synchronously right here.
            // onAuthStateChange will also fire, which is fine — setting null→null is a no-op.
            // But this guarantees the UI updates immediately without waiting for the event.
            setUser(null);
            setPlan('free');
            setDownloadsUsed(0);
            setVideosUsed(0);
            setAiFillsUsed(0);
            setLastAiFillDate(null);
            setFullName(null);
            setAvatarUrl(null);
            toast.success("Successfully logged out");
        }
    };

    const incrementDownloads = async () => {
        if (!user) return;
        const newVal = downloadsUsed + 1;
        const { error } = await supabase
            .from('users')
            .update({ downloads_used: newVal })
            .eq('id', user.id);
        
        if (!error) setDownloadsUsed(newVal);
    };

    const incrementVideos = async () => {
        if (!user) return;
        const newVal = videosUsed + 1;
        const { error } = await supabase
            .from('users')
            .update({ videos_used: newVal })
            .eq('id', user.id);
        
        if (!error) setVideosUsed(newVal);
    };

    const incrementAIFills = async () => {
        if (!user) return;
        const { data, error } = await supabase.rpc('increment_ai_fills', { 
            target_user_id: user.id 
        });
        
        if (!error && data !== null) {
            setAiFillsUsed(data);
        }
    };

    useEffect(() => {
        const tried = localStorage.getItem('veily_tried_bulk_import') === 'true';
        setTriedBulkImport(tried);
    }, []);

    const markBulkImportAsTried = () => {
        setTriedBulkImport(true);
        localStorage.setItem('veily_tried_bulk_import', 'true');
    };

    const updateProfile = async (updates: { avatar_url?: string; full_name?: string }) => {
        if (!user) throw new Error("No user found");

        try {
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: updates.full_name !== undefined ? updates.full_name : fullName,
                    avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : avatarUrl,
                }
            });
            if (authError) console.warn("Auth metadata update failed:", authError);

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
        } catch (err: any) {
            console.error("Profile update failed:", err);
            throw err;
        }
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
                        setAiFillsUsed(0);
                    }
                }
            } catch (err) {
                console.error("Auth initialization failed:", err);
            } finally {
                if (isMounted.current) setLoading(false);
            }
        };

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
                    setAiFillsUsed(0);
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
            user, plan, downloadsUsed, videosUsed, aiFillsUsed, lastAiFillDate, avatarUrl, fullName, loading,
            isAuthModalOpen, setAuthModalOpen,
            isUpgradeModalOpen, setUpgradeModalOpen,
            isProfileModalOpen, setProfileModalOpen,
            isDownloadModalOpen, setDownloadModalOpen,
            refetchUserStatus, signOut, updateProfile,
            incrementDownloads, incrementVideos, incrementAIFills,
            triedBulkImport, markBulkImportAsTried
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
