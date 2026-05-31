import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Check, Heart, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SupportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onOpenChange }) => {
  const [isCopying, setIsCopying] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [upiId] = useState('rushikeshingale2001@okicici');

  const upiLink = `upi://pay?pa=${upiId}&pn=VeilySupport&tid=VeilyDonation`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(upiLink)}`;

  useEffect(() => {
    if (isOpen) {
      setQrLoaded(false);
      const img = new Image();
      img.src = qrUrl;
      img.onload = () => setQrLoaded(true);
    }
  }, [isOpen, qrUrl]);

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(upiId);
      setTimeout(() => setIsCopying(false), 1500);
    } catch (err) {
      setIsCopying(false);
    }
  };

  const handleOpenAutoFocus = (e: Event) => e.preventDefault();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]" onOpenAutoFocus={handleOpenAutoFocus}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold tracking-tight">
            <Heart className="w-5 h-5 text-rose-500 inline-block mr-1.5 -mt-0.5 fill-rose-500" />
            Support VeilY
          </DialogTitle>
        </DialogHeader>

        <p className="text-center text-sm text-zinc-500 mb-6">
          If you like our service, please consider donating to keep these tools free forever.
        </p>

        {/* Donate QR Code */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-semibold text-zinc-700 text-center">Donate QR Code</p>
          <div className="flex justify-center">
            <div className="rounded-2xl border border-zinc-200 shadow-sm bg-white inline-block">
              {!qrLoaded && (
                <div className="w-60 h-60 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
                </div>
              )}
              <img
                src={qrUrl}
                alt="Veily UPI QR Code"
                className={cn("w-60 h-60 block", qrLoaded ? "" : "hidden")}
                onLoad={() => setQrLoaded(true)}
              />
            </div>
          </div>
        </div>

        {/* Direct UPI Payment */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-semibold text-zinc-700 text-center">Direct UPI Payment</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-mono bg-zinc-50 text-center text-zinc-700 select-all cursor-pointer">
              {upiId}
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isCopying
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
              )}
            >
              {isCopying ? (
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Copied
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Copy className="w-4 h-4" /> Copy
                </span>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 pb-2">
          Every donation, no matter how small, helps cover hosting and AI API costs.<br />
          Thank you for your kindness!
        </p>
      </DialogContent>
    </Dialog>
  );
};
