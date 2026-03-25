import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Mail, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getRedirectUrl } from '@/lib/electron-utils';

type AuthStep = "form" | "otp";

const Auth = () => {
    const { user, setAuthModalOpen } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState<AuthStep>("form");
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const isLocked = attempts >= 5;

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/');
        }
        setAuthModalOpen(false);
    }, [user, navigate, setAuthModalOpen]);

    // Cooldown Timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((c) => c - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleSendOtp = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!email.trim() || loading) return;
        
        setLoading(true);
        setError(null);
        setAttempts(0); // Reset attempts on new send

        try {
            const { error: signUpError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                    emailRedirectTo: getRedirectUrl(),
                }
            });

            if (signUpError) throw signUpError;
            
            setStep("otp");
            setCooldown(60);
            toast.success("Verification code sent to your email!");
        } catch (err: any) {
            setError(err.message || "Failed to send verification code.");
            toast.error(err.message || "Failed to send verification code.");
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async (codeToVerify: string) => {
        if (!codeToVerify.trim() || codeToVerify.length < 6 || loading || isLocked) return;

        setLoading(true);
        setError(null);

        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: codeToVerify,
                type: "email",
            });

            if (verifyError) {
                setAttempts(prev => prev + 1);
                if (verifyError.message.includes("expired")) {
                    throw new Error("Code expired. Please resend.");
                }
                throw verifyError;
            }

            toast.success("Successfully authenticated!");
            navigate('/');
        } catch (err: any) {
            const msg = attempts >= 4 ? "Too many failed attempts. Please resend code." : (err.message || "Invalid code");
            setError(msg);
            toast.error(msg);
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
        if (otp.length === 6 && !loading && !isLocked) {
            verifyCode(otp);
        }
    }, [otp]);

    const handleResend = async () => {
        if (cooldown > 0 || !email) return;
        await handleSendOtp();
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6 h-full relative">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
            
            <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-gray-100 p-8 sm:p-10 max-w-md w-full relative z-10 animate-in zoom-in-95 fade-in duration-500">
                <div className="space-y-2 mb-8 text-center">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">
                        {step === 'form' ? 'Welcome to Veily' : 'Enter Code'}
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium px-4">
                        {step === 'form' 
                            ? 'The ultimate studio for professional social mockups.' 
                            : `We sent a 6-digit code to ${email}`}
                    </p>
                </div>

                {step === 'form' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
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
                                    className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium"
                                />
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-500 font-bold ml-1">⚠️ {error}</p>}

                        <Button
                            type="submit"
                            disabled={loading || !email.trim()}
                            className="w-full h-12 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-[14px] shadow-lg hover:shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Verification Code</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    required
                                    disabled={isLocked}
                                    className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-mono text-lg tracking-[0.5rem] text-center disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {error && <p className="text-xs text-red-500 font-bold ml-1 text-center">⚠️ {error}</p>}

                        <Button
                            type="submit"
                            disabled={loading || otp.length < 6 || isLocked}
                            className="w-full h-12 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-[14px] shadow-lg hover:shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Verify Account <ArrowRight className="w-4 h-4" /></>}
                        </Button>

                        <div className="pt-4 flex flex-col gap-3">
                            <Button 
                                type="button"
                                variant="ghost" 
                                onClick={handleResend}
                                disabled={loading || cooldown > 0}
                                className={cn(
                                    "text-xs font-bold text-gray-500 hover:text-primary",
                                    isLocked && "text-primary animate-pulse"
                                )}
                            >
                                {cooldown > 0 ? `Resend code in ${cooldown}s` : (isLocked ? "Get New Code" : "Didn't get a code? Resend")}
                            </Button>
                            <Button 
                                type="button"
                                variant="link" 
                                onClick={() => {
                                    setStep("form");
                                    setAttempts(0);
                                }}
                                className="text-xs font-bold text-gray-400 flex items-center justify-center gap-1"
                            >
                                <ArrowLeft className="w-3 h-3" /> Change email
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Auth;
