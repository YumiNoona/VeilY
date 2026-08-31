import React from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Download, Copy, Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeviceView } from "@/types/chat";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PreviewControlsProps {
  activeView: DeviceView;
  onViewChange: (view: DeviceView) => void;
  onDownload: () => void;
  onCopy?: () => void;
  showDeviceToggle?: boolean;
  availableViews?: DeviceView[];
  isAnimating?: boolean;
  onToggleAnimation?: () => void;
}

export function PreviewControls({ 
  activeView, 
  onViewChange, 
  onDownload, 
  onCopy,
  showDeviceToggle = true,
  availableViews = ['desktop', 'mobile'],
  isAnimating = false,
  onToggleAnimation
}: PreviewControlsProps) {
  const allViews: { id: DeviceView; icon: React.ElementType; label: string }[] = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];
  const views = allViews.filter(view => availableViews.includes(view.id));

  return (
    <div className="absolute md:fixed right-3 md:right-2 xl:right-6 top-3 md:top-1/2 translate-y-0 md:-translate-y-1/2 flex flex-row md:flex-col items-center gap-2 md:gap-4 bg-card border border-border rounded-2xl md:rounded-full py-2 md:py-4 px-2 shadow-lg z-50 will-change-transform transform-gpu">
      {showDeviceToggle && views.length > 1 && (
        <>
          <div className="flex flex-row md:flex-col items-center bg-secondary rounded-full p-1 gap-1">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <Tooltip key={view.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onViewChange(view.id)}
                      className={cn(
                        "rounded-full p-2 transition-all duration-200",
                        activeView === view.id
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-label={`${view.label} preview`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">{view.label} preview</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          <div className="h-6 w-px md:h-px md:w-6 bg-border" />
        </>
      )}

      <div className="flex flex-row md:flex-col gap-2">
        {onCopy && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onCopy} variant="outline" size="icon" className="h-10 w-10 rounded-full" aria-label="Copy image">
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Copy image</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onDownload} size="icon" className="h-10 w-10 rounded-full" aria-label="Download image">
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Download image</TooltipContent>
        </Tooltip>

        {onToggleAnimation && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleAnimation}
                variant={isAnimating ? "default" : "outline"}
                size="icon"
                className={cn("h-10 w-10 rounded-full", isAnimating && "bg-amber-500 hover:bg-amber-600")}
                aria-label={isAnimating ? "Stop animation" : "Play typing animation"}
              >
                {isAnimating ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">{isAnimating ? "Stop animation" : "Play typing animation"}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
