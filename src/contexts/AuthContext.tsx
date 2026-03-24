import React, { createContext, useContext, useEffect, useState, useRef } from 'react'; // Re-saved to clear runtime error
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
    isDownloadModalOpen: boolean;
    setDownloadModalOpen: (open: boolean) => void;
    refetchUserStatus: () => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: { avatar_url?: string; full_name?: string }) => Promise<void>;
    incrementDownloads: () => Promise<void>;
    incrementVideos: () => Promise<void>;
    loginWithAdmin: (email: string, pass: string) => Promise<boolean>;
    triedBulkImport: boolean;
    markBulkImportAsTried: () => void;
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
    isDownloadModalOpen: false,
    setDownloadModalOpen: () => {},
    refetchUserStatus: async () => {},
    signOut: async () => {},
    updateProfile: async () => {},
    incrementDownloads: async () => {},
    incrementVideos: async () => {},
    loginWithAdmin: async () => false,
    triedBulkImport: false,
    markBulkImportAsTried: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [plan, setPlan] = useState<'free' | 'pro' | 'premium'>('free');
    const [downloadsUsed, setDownloadsUsed] = useState<number>(0);
    const [videosUsed, setVideosUsed] = useState<number>(0);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [triedBulkImport, setTriedBulkImport] = useState<boolean>(false);
    
    // Global Modal States for easy triggering
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
    
    // Memory leak guard
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchUserStatus = async (currentUser: User) => {
        // Set initial state from metadata if available
        if (currentUser.user_metadata?.full_name && !fullName) {
            setFullName(currentUser.user_metadata.full_name);
        }
        if (currentUser.user_metadata?.avatar_url && !avatarUrl) {
            setAvatarUrl(currentUser.user_metadata.avatar_url);
        }

        // 3-count retry loop for async database trigger lag logic
        for (let i = 0; i < 3; i++) {
            if (!isMounted.current) return;
            
            const { data, error } = await supabase
                .from('users')
                .select('plan, downloads_used, videos_used, avatar_url, full_name')
                .eq('id', currentUser.id)
                .single();

            if (!error && data !== null) {
                if (isMounted.current) {
                    setPlan(data.plan as 'free' | 'pro' | 'premium');
                    setDownloadsUsed(data.downloads_used || 0);
                    setVideosUsed(data.videos_used || 0);
                    // DB values take precedence if they exist
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
        await supabase.auth.signOut();
        setUser(null);
        setPlan('free');
        setDownloadsUsed(0);
        setVideosUsed(0);
        setFullName(null);
        setAvatarUrl(null);
        toast.success("Successfully logged out");
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

    const loginWithAdmin = async (email: string, pass: string) => {
        const hash = async (str: string) => {
            const msgUint8 = new TextEncoder().encode(str);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        };

        const eHash = await hash(email);
        const pHash = await hash(pass);

        // Provided hashes for admin login
        const TARGET_E = '9e504b26ed173aa4d02db96b4ae478254df4df86a6e37410843ff8f813327fcc';
        const TARGET_P = '899b3e44f37138b58efeeccbe7444ea725fbe56463e3c59c689ef23e82f494dc';

        if (eHash === TARGET_E && pHash === TARGET_P) {
            const adminUser: User = {
                id: 'admin_rushikesh_2001',
                email: email,
                user_metadata: { full_name: 'Rushikesh Ingale (Admin)' },
                app_metadata: {},
                aud: 'authenticated',
                created_at: new Date().toISOString()
            } as User;

            setUser(adminUser);
            setPlan('premium');
            setFullName('Rushikesh Ingale (Admin)');
            setDownloadsUsed(0);
            setVideosUsed(0);
            setAuthModalOpen(false);
            return true;
        }
        return false;
    };
    
    // Track Bulk Import trial
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
            // Update Auth Metadata first as it's faster and acts as a fallback
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: updates.full_name !== undefined ? updates.full_name : fullName,
                    avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : avatarUrl,
                }
            });
            if (authError) console.warn("Auth metadata update failed:", authError);

            // Use upsert on the users table
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
            isDownloadModalOpen, setDownloadModalOpen,
            refetchUserStatus, signOut, updateProfile,
            incrementDownloads, incrementVideos, loginWithAdmin,
            triedBulkImport, markBulkImportAsTried
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
