import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function SupportBanner() {
  const { setSupportModalOpen } = useAuth();

  return (
      <div className="relative z-10 flex w-full max-w-2xl shrink-0 items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 shadow-lg shadow-zinc-200/50">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-800">Support Our Service</p>
          <p className="text-xs leading-relaxed text-zinc-500">If Veily helps your work, consider supporting its continued development.</p>
        </div>
        <button
          type="button"
          onClick={() => setSupportModalOpen(true)}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:from-rose-600 hover:to-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          <Heart className="h-3.5 w-3.5 fill-current" />
          Donate
        </button>
      </div>
  );
}
