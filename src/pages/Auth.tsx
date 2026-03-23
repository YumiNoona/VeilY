import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Auth = () => {
    const { user, setAuthModalOpen } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isWaitingForVerification, setIsWaitingForVerification] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
        // Ensure the global modal is closed when on this page
        setAuthModalOpen(false);
    }, [user, navigate, setAuthModalOpen]);

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
                        data: {
                            full_name: fullName,
                        }
                    }
                });
                if (error) throw error;
                
                if (data?.user && !data.session) {
                    setIsWaitingForVerification(true);
                } else {
                    toast.success('Registration successful!');
                    navigate('/');
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success('Welcome back!');
                navigate('/');
            }
        } catch (error: any) {
            toast.error(error.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    if (isWaitingForVerification) {
        return (
            <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-4rem)]">
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-10 max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Check your inbox</h1>
                    <p className="text-muted-foreground text-[15px] leading-relaxed">
                        We've sent a verification link to <span className="font-semibold text-foreground">{email}</span>. 
                        Please click the link to confirm your account.
                    </p>
                    <div className="pt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsWaitingForVerification(false)}
                            className="rounded-xl px-8 h-12 font-semibold shadow-sm w-full"
                        >
                            Back to Sign In
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex items-center justify-center p-6 h-full relative">
            {/* Subtle background pattern to make it feel like an overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
            
            <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-gray-100 p-8 sm:p-10 max-w-md w-full relative z-10 animate-in zoom-in-95 fade-in duration-500">
                <div className="space-y-2 mb-8 text-center">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">
                        {mode === 'signin' ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        {mode === 'signin' 
                            ? 'Enter your details to access your workspace.' 
                            : 'Join Veily to start creating stunning mockups.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Email address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-[14px] shadow-lg hover:shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {mode === 'signin' ? 'Sign In' : 'Create Account'}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="pt-6 text-center text-[13px] font-medium text-muted-foreground border-t border-gray-100 mt-6">
                    {mode === 'signin' ? (
                        <p>
                            Don't have an account?{' '}
                            <button
                                onClick={() => setMode('signup')}
                                className="text-primary font-bold hover:underline underline-offset-2"
                            >
                                Sign up
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button
                                onClick={() => setMode('signin')}
                                className="text-primary font-bold hover:underline underline-offset-2"
                            >
                                Log in
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
