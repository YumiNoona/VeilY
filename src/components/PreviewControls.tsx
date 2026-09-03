import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Download, Maximize2, Minus, Monitor, Play, Plus, Smartphone, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeviceView } from '@/types/chat';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PreviewControlsProps {
  activeView: DeviceView;
  onViewChange: (view: DeviceView) => void;
  onDownload: () => void;
  onCopy?: () => void;
  showDeviceToggle?: boolean;
  availableViews?: DeviceView[];
  isAnimating?: boolean;
  onToggleAnimation?: () => void;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
}

const clampZoom = (value: number) => Math.min(125, Math.max(50, value));

export function PreviewControls({
  activeView,
  onViewChange,
  onDownload,
  onCopy,
  showDeviceToggle = true,
  availableViews = ['desktop', 'mobile'],
  isAnimating = false,
  onToggleAnimation,
  zoom,
  onZoomChange,
}: PreviewControlsProps) {
  const allViews: { id: DeviceView; icon: React.ElementType; label: string }[] = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];
  const views = allViews.filter((view) => availableViews.includes(view.id));
  const hasZoom = typeof zoom === 'number' && Boolean(onZoomChange);

  return (
    <div className="pointer-events-none absolute right-2 top-1/2 z-50 -translate-y-1/2 md:right-4">
      <div className="pointer-events-auto flex flex-col items-center gap-1 rounded-3xl border border-zinc-200/90 bg-white/95 p-1.5 shadow-[0_16px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        {showDeviceToggle && views.length > 1 && (
          <>
            <div className="flex flex-col items-center rounded-2xl bg-zinc-100 p-1" aria-label="Preview device">
              {views.map((view) => {
                const Icon = view.icon;
                const active = activeView === view.id;
                return (
                  <Tooltip key={view.id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => onViewChange(view.id)}
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition',
                          active ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900',
                        )}
                        aria-label={`${view.label} preview`}
                        aria-pressed={active}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Show the {view.label.toLowerCase()} preview</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
            <div className="my-1 h-px w-7 bg-zinc-200" />
          </>
        )}

        {hasZoom && (
          <>
            <div className="flex flex-col items-center gap-0.5" aria-label="Preview zoom">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => onZoomChange?.(clampZoom(zoom - 10))} className="h-9 w-9 rounded-lg" aria-label="Zoom out">
                    <Minus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Zoom out</TooltipContent>
              </Tooltip>
              <button
                type="button"
                onClick={() => onZoomChange?.(100)}
                className="h-9 w-9 rounded-lg text-[11px] font-bold tabular-nums text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
                aria-label="Reset zoom to 100 percent"
              >
                {zoom}%
              </button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => onZoomChange?.(clampZoom(zoom + 10))} className="h-9 w-9 rounded-lg" aria-label="Zoom in">
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Zoom in</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => onZoomChange?.(75)} className="h-9 w-9 rounded-lg" aria-label="Fit preview">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Fit more of the preview</TooltipContent>
              </Tooltip>
            </div>
            <div className="my-1 h-px w-7 bg-zinc-200" />
          </>
        )}

        {onToggleAnimation && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleAnimation}
                variant={isAnimating ? 'default' : 'ghost'}
                size="icon"
                className={cn('h-9 w-9 rounded-lg', isAnimating && 'bg-amber-500 text-white hover:bg-amber-600')}
                aria-label={isAnimating ? 'Stop preview animation' : 'Play preview animation'}
              >
                {isAnimating ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">{isAnimating ? 'Stop the message animation' : 'Preview the message animation'}</TooltipContent>
          </Tooltip>
        )}

        {onCopy && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onCopy} variant="ghost" size="icon" className="h-9 w-9 rounded-lg" aria-label="Copy preview image">
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Copy the preview as a PNG</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={onDownload} size="icon" className="h-10 w-10 rounded-full bg-zinc-950 text-white hover:bg-zinc-800" aria-label="Open export options">
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Export an image or video</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
