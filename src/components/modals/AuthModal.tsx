import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, User, Mail, Lock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const AuthModal = () => {
    const { isAuthModalOpen, setAuthModalOpen, loginWithAdmin } = useAuth();
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'signin') {
                const isAdmin = await loginWithAdmin(email, password);
                if (isAdmin) {
                    toast.success('Admin login successful!');
                    setAuthModalOpen(false);
                    return;
                }
            }

            if (mode === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                        data: {
                            full_name: fullName,
                        }
                    }
                });
                if (error) throw error;
                
                if (data?.user && !data.session) {
                    toast.success('Confirmation email sent! Please check your inbox.');
                } else {
                    toast.success('Registration successful! Welcome to Veily.');
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                {/* Close Button */}
                <button 
                    onClick={() => setAuthModalOpen(false)}
                    className="absolute top-6 right-6 z-50 p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                
                {/* Header */}
                <div className="text-center space-y-2 mb-8 relative z-10">
                    <h2 className="text-3xl font-black tracking-tight text-zinc-950">
                        {mode === 'signin' ? 'Welcome back' : 'Join the club'}
                    </h2>
                    <p className="text-sm text-zinc-500 font-medium px-8 leading-relaxed">
                        {mode === 'signin'
                            ? 'Sign in to access your professional mockups and studio tools.'
                            : 'Create an account to save your creations and unlock premium features.'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    {mode === 'signup' && (
                        <div className="group space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="h-12 pl-10 bg-zinc-50 border-zinc-100 rounded-xl focus:bg-white transition-all text-sm font-medium"
                                />
                            </div>
                        </div>
                    )}

                    <div className="group space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                            <Input
                                type="email"
                                placeholder="jane@studio.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 pl-10 bg-zinc-50 border-zinc-100 rounded-xl focus:bg-white transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="group space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Secure Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 pl-10 bg-zinc-50 border-zinc-100 rounded-xl focus:bg-white transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-zinc-200 transition-all active:scale-[0.98] mt-4"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>

                {/* Footer / Toggle */}
                <p className="text-sm text-center mt-6 text-zinc-500 font-medium">
                    {mode === 'signin' ? (
                        <>
                            Don’t have an account?{" "}
                            <span 
                                onClick={() => setMode('signup')} 
                                className="text-zinc-950 font-bold cursor-pointer hover:underline"
                            >
                                Sign up for free
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <span 
                                onClick={() => setMode('signin')} 
                                className="text-zinc-950 font-bold cursor-pointer hover:underline"
                            >
                                Sign in
                            </span>
                        </>
                    )}
                </p>
            </div>
            
            {/* Click outside to close */}
            <div 
                className="absolute inset-0 -z-10" 
                onClick={() => setAuthModalOpen(false)} 
            />
        </div>
    );
};
