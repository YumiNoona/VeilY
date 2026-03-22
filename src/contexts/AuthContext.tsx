import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    isPremium: boolean;
    loading: boolean;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    isUpgradeModalOpen: boolean;
    setUpgradeModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isPremium: false,
    loading: true,
    isAuthModalOpen: false,
    setAuthModalOpen: () => {},
    isUpgradeModalOpen: false,
    setUpgradeModalOpen: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isPremium, setIsPremium] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    
    // Global Modal States for easy triggering
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false);
    
    // Memory leak guard
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchPremiumStatus = async (currentUser: User) => {
        // 3-count retry loop for async database trigger lag logic
        for (let i = 0; i < 3; i++) {
            if (!isMounted.current) return;
            
            const { data } = await supabase
                .from('users')
                .select('is_premium')
                .eq('id', currentUser.id)
                .single();

            if (data !== null) {
                if (isMounted.current) setIsPremium(data.is_premium);
                return;
            }
            
            await new Promise(r => setTimeout(r, 300));
        }
        
        if (isMounted.current) setIsPremium(false);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (isMounted.current) {
                    setUser(session?.user ?? null);
                }

                if (session?.user) {
                    await fetchPremiumStatus(session.user);
                } else {
                    if (isMounted.current) setIsPremium(false);
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
                // If event was password recovery, don't necessarily fetch premium, 
                // but any SIGN_IN or similar should fetch
                await fetchPremiumStatus(session.user);
            } else {
                if (isMounted.current) setIsPremium(false);
            }
            if (isMounted.current) setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, isPremium, loading,
            isAuthModalOpen, setAuthModalOpen,
            isUpgradeModalOpen, setUpgradeModalOpen
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
