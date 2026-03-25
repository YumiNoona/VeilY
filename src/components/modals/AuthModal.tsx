import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Mail, X, ArrowRight, ArrowLeft, KeyRound, CheckCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getRedirectUrl } from '@/lib/electron-utils';
import { cn } from '@/lib/utils';

type AuthStep = "form" | "otp";
type AuthMode = "signin" | "signup";

export const AuthModal = () => {
    const { isAuthModalOpen, setAuthModalOpen } = useAuth();
    const [step, setStep] = useState<AuthStep>("form");
    const [mode, setMode] = useState<AuthMode>("signin");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (!isAuthModalOpen) {
            setStep("form");
            setMode("signin");
            setError(null);
            setPassword("");
            setFullName("");
            setOtp("");
        }
    }, [isAuthModalOpen]);

    // Cooldown Timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((c) => c - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim() || loading) return;

        setLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;
            
            toast.success("Successfully logged in!");
            setAuthModalOpen(false);
        } catch (err: any) {
            setError(err.message || "Invalid email or password.");
            toast.error(err.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim() || !fullName.trim() || loading) return;

        setLoading(true);
        setError(null);

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: getRedirectUrl(),
                }
            });

            if (signUpError) throw signUpError;
            
            setStep("otp");
            setCooldown(60);
            toast.success("Verification code sent to your email!");
        } catch (err: any) {
            setError(err.message || "Sign up failed.");
            toast.error(err.message || "Sign up failed.");
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async (codeToVerify: string) => {
        if (!codeToVerify.trim() || codeToVerify.length < 6 || loading) return;

        setLoading(true);
        setError(null);

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: codeToVerify,
                type: "signup",
            });

            if (verifyError) throw verifyError;

            toast.success("Account verified!");
            setAuthModalOpen(false);
        } catch (err: any) {
            setError(err.message || "Invalid code");
            toast.error(err.message || "Invalid code");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        verifyCode(otp);
    };

    // Auto-submit when 6 digits are reached
    useEffect(() => {
        if (otp.length === 6 && !loading) {
            verifyCode(otp);
        }
    }, [otp]);

    if (!isAuthModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                <button 
                    onClick={() => setAuthModalOpen(false)}
                    className="absolute top-6 right-6 z-50 p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
                
                <div className="text-center space-y-2 mb-8 relative z-10">
                    <h2 className="text-3xl font-black tracking-tight text-zinc-950">
                        {step === 'form' ? (mode === 'signin' ? 'Welcome back' : 'Join Veily') : 'Verify Email'}
                    </h2>
                    <p className="text-sm text-zinc-500 font-medium px-4 leading-relaxed">
                        {step === 'form'
                            ? (mode === 'signin' ? 'Login to your account' : 'Start your creative journey today.')
                            : `We sent a 6-digit code to ${email}`}
                    </p>
                </div>

                {step === 'form' ? (
                    <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4 relative z-10">
                        {mode === 'signup' && (
                            <div className="group space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                                <Input
                                    type="text"
                                    placeholder="Jane Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="h-12 border-zinc-100 bg-zinc-50 focus:bg-white rounded-xl transition-all text-sm font-medium"
                                />
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
                                    className="h-12 pl-10 border-zinc-100 bg-zinc-50 focus:bg-white rounded-xl transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="group space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-12 pl-10 border-zinc-100 bg-zinc-50 focus:bg-white rounded-xl transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-500 font-bold ml-1">⚠️ {error}</p>}

                        <Button
                            type="submit"
                            disabled={loading || !email.trim() || !password.trim() || (mode === 'signup' && !fullName.trim())}
                            className="w-full h-12 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-zinc-200 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{mode === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>}
                        </Button>

                        <div className="text-center pt-2">
                            <p className="text-xs text-zinc-400 font-medium">
                                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode(mode === 'signin' ? 'signup' : 'signin');
                                        setError(null);
                                    }}
                                    className="text-zinc-950 font-bold hover:underline"
                                >
                                    {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 relative z-10">
                        <div className="group space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">6-Digit Code</label>
                            <Input
                                type="text"
                                maxLength={6}
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                required
                                className="h-12 border-zinc-100 bg-zinc-50 focus:bg-white rounded-xl transition-all text-sm font-mono tracking-[0.4rem] text-center font-bold"
                            />
                        </div>

                        {error && <p className="text-xs text-red-500 font-bold ml-1 text-center font-medium">⚠️ {error}</p>}

                        <Button
                            type="submit"
                            disabled={loading || otp.length < 6}
                            className="w-full h-12 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-zinc-200 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Verify Account <CheckCheck className="w-4 h-4" /></>}
                        </Button>
                    </form>
                )}
            </div>
            
            <div className="absolute inset-0 -z-10" onClick={() => setAuthModalOpen(false)} />
        </div>
    );
};
