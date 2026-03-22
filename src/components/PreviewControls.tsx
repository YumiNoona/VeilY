import React from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Download, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeviceView } from "@/types/chat";

interface PreviewControlsProps {
  activeView: DeviceView;
  onViewChange: (view: DeviceView) => void;
  onDownload: () => void;
  onCopy?: () => void;
}

export function PreviewControls({ activeView, onViewChange, onDownload, onCopy }: PreviewControlsProps) {
  const views: { id: DeviceView; icon: React.ElementType; label: string }[] = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 bg-card border border-border rounded-full py-4 px-2 shadow-lg z-50">
      <div className="flex flex-col items-center bg-secondary rounded-full p-1 gap-1">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                activeView === view.id
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={view.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      <div className="w-6 h-px bg-border" />

      <div className="flex flex-col gap-2">
        {onCopy && (
          <Button onClick={onCopy} variant="outline" size="icon" className="rounded-full w-10 h-10" title="Copy Image">
            <Copy className="w-4 h-4" />
          </Button>
        )}
        <Button onClick={onDownload} size="icon" className="rounded-full w-10 h-10" title="Download Image">
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
