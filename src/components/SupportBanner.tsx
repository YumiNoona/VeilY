import { useState } from "react";
import { Heart } from "lucide-react";
import { SupportModal } from "@/components/modals/SupportModal";

export function SupportBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full max-w-2xl shrink-0 rounded-2xl border border-zinc-200/80 bg-white/95 px-5 py-3.5 shadow-lg shadow-zinc-200/50 backdrop-blur-sm flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-800">Support Our Service</p>
          <p className="text-xs leading-relaxed text-zinc-500">If Veily helps your work, consider supporting its continued development.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:from-rose-600 hover:to-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          <Heart className="h-3.5 w-3.5 fill-current" />
          Donate
        </button>
      </div>
      <SupportModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
