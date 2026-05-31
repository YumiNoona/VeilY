import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Download, Sparkles } from "lucide-react";
import { open as openExternal } from "@tauri-apps/plugin-shell";

interface UpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentVersion: string | null;
  latestVersion: string | null;
  releasesUrl: string;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  open,
  onOpenChange,
  currentVersion,
  latestVersion,
  releasesUrl,
}) => {
  const handleUpdate = async () => {
    await openExternal(releasesUrl);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[420px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-200 rotate-6">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg">Update available</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                A new version of Veily is ready
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="mx-1 space-y-3">
          <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <span className="text-sm font-semibold text-zinc-500">Current version</span>
            <span className="text-sm font-bold text-zinc-800">v{currentVersion || "—"}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-500">New version</span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                <Sparkles className="w-3 h-3" /> Latest
              </span>
            </div>
            <span className="text-sm font-bold text-zinc-800">v{latestVersion || "—"}</span>
          </div>
        </div>

        <AlertDialogFooter className="sm:justify-between gap-2">
          <AlertDialogCancel className="rounded-xl">Later</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpdate}
            className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl shadow-lg shadow-zinc-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
