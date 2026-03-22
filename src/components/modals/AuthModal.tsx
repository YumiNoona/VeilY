import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const AuthModal = () => {
    const { isAuthModalOpen, setAuthModalOpen } = useAuth();
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                    }
                });
                if (error) throw error;
                
                if (data?.user && !data.session) {
                    toast.success('Confirmation email sent! Please check your inbox.');
                } else {
                    toast.success('Registration successful! You are now logged in.');
                }
                setAuthModalOpen(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success('Successfully logged in!');
                setAuthModalOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <h2 className="text-2xl font-semibold text-gray-900">
                    {mode === 'signin' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {mode === 'signin'
                        ? 'Sign in to continue to Veily'
                        : 'Start using Veily today'}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="space-y-1">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition"
                        />
                    </div>

                    <div className="space-y-1">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center disabled:opacity-50"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {/* Footer / Toggle */}
                <p className="text-sm text-center mt-4 text-gray-600">
                    {mode === 'signin' ? (
                        <>
                            Don’t have an account?{" "}
                            <span 
                                onClick={() => setMode('signup')} 
                                className="text-black font-medium cursor-pointer hover:underline"
                            >
                                Sign up
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <span 
                                onClick={() => setMode('signin')} 
                                className="text-black font-medium cursor-pointer hover:underline"
                            >
                                Sign in
                            </span>
                        </>
                    )}
                </p>
            </div>
            
            {/* Click outside to close (optional but standard) */}
            <div 
                className="absolute inset-0 -z-10" 
                onClick={() => setAuthModalOpen(false)} 
            />
        </div>
    );
};
