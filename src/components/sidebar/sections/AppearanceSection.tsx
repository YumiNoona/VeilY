import React from "react";
import { AppearanceSettings } from "@/types/chat";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Palette, X, Image, Type } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { readFileAsDataURL } from "@/lib/image-utils";

interface AppearanceSectionProps {
    appearance: AppearanceSettings;
    onAppearanceChange: (appearance: AppearanceSettings) => void;
    mode?: 'default' | 'ai' | 'call';
}

export function AppearanceSection({ appearance, onAppearanceChange, mode = 'default' }: AppearanceSectionProps) {
    const isChat = mode === 'default';

    const handleWallpaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const result = await readFileAsDataURL(file);
                onAppearanceChange({ ...appearance, wallpaperUrl: result });
            } catch (error) {
                console.error("Error reading wallpaper:", error);
            }
        }
    };

    const removeWallpaper = () => {
        onAppearanceChange({ ...appearance, wallpaperUrl: undefined });
    };

    return (
        <AccordionItem value="appearance" className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Palette className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="font-semibold text-sm">Appearance</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1 space-y-3">
                {/* Toggle Options */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between py-1">
                        <Label htmlFor="dark-mode" className="text-sm">Dark mode</Label>
                        <Switch
                            id="dark-mode"
                            checked={appearance.darkMode}
                            onCheckedChange={(checked) => onAppearanceChange({ ...appearance, darkMode: checked })}
                        />
                    </div>

                    {isChat && (
                        <>
                            <div className="flex items-center justify-between py-1">
                                <Label htmlFor="show-timestamps" className="text-sm">Show timestamps</Label>
                                <Switch
                                    id="show-timestamps"
                                    checked={appearance.showTimestamps}
                                    onCheckedChange={(checked) => onAppearanceChange({ ...appearance, showTimestamps: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <Label htmlFor="is-typing" className="text-sm">Show typing indicator</Label>
                                <Switch
                                    id="is-typing"
                                    checked={appearance.isTyping ?? false}
                                    onCheckedChange={(checked) => onAppearanceChange({ ...appearance, isTyping: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <Label htmlFor="show-status" className="text-sm">Show status</Label>
                                <Switch
                                    id="show-status"
                                    checked={appearance.showStatus}
                                    onCheckedChange={(checked) => onAppearanceChange({ ...appearance, showStatus: checked })}
                                />
                            </div>
                            {appearance.showStatus && (
                                <div className="flex flex-col gap-1.5 pt-1 pb-2">
                                    <Label htmlFor="status-text" className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Status Text</Label>
                                    <Input
                                        id="status-text"
                                        type="text"
                                        value={appearance.statusText || ""}
                                        onChange={(e) => onAppearanceChange({ ...appearance, statusText: e.target.value })}
                                        placeholder="last seen today at 12:00 PM"
                                        className="h-8 text-sm bg-zinc-50 border-zinc-100 rounded-lg focus:bg-white transition-all"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex items-center justify-between py-1">
                        <Label htmlFor="transparent-bg" className="text-sm">Transparent background</Label>
                        <Switch
                            id="transparent-bg"
                            checked={appearance.transparentBackground ?? false}
                            onCheckedChange={(checked) => onAppearanceChange({ ...appearance, transparentBackground: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between py-1">
                        <Label htmlFor="time-format" className="text-sm">Time format</Label>
                        <Select
                            value={appearance.use24HourFormat ? "24h" : "12h"}
                            onValueChange={(value) => onAppearanceChange({ ...appearance, use24HourFormat: value === "24h" })}
                        >
                            <SelectTrigger className="w-24 h-7 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12h">12-hour</SelectItem>
                                <SelectItem value="24h">24-hour</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Font / Typography */}
                <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5" /> Typography
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between py-1">
                            <Label htmlFor="font-size" className="text-sm">Font size</Label>
                            <Select
                                value={appearance.fontSize ?? 'sm'}
                                onValueChange={(value) => onAppearanceChange({ ...appearance, fontSize: value as any })}
                            >
                                <SelectTrigger className="w-24 h-7 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="xs">Extra Small</SelectItem>
                                    <SelectItem value="sm">Small</SelectItem>
                                    <SelectItem value="base">Medium</SelectItem>
                                    <SelectItem value="lg">Large</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <Label htmlFor="font-family" className="text-sm">Font style</Label>
                            <Select
                                value={appearance.fontFamily ?? 'sans'}
                                onValueChange={(value) => onAppearanceChange({ ...appearance, fontFamily: value as any })}
                            >
                                <SelectTrigger className="w-24 h-7 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sans">Sans</SelectItem>
                                    <SelectItem value="serif">Serif</SelectItem>
                                    <SelectItem value="mono">Mono</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {isChat && (
                            <div className="flex items-center justify-between py-1">
                                <Label htmlFor="chat-style" className="text-sm">Chat style</Label>
                                <Select
                                    value={appearance.chatStyle ?? 'global'}
                                    onValueChange={(value) => onAppearanceChange({ ...appearance, chatStyle: value as any })}
                                >
                                    <SelectTrigger className="w-24 h-7 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="global">Global</SelectItem>
                                        <SelectItem value="indian">Indian</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Wallpaper - chat only */}
                {isChat && (
                    <div className="pt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Chat Wallpaper</p>
                        <div className="flex gap-2">
                            {appearance.wallpaperUrl ? (
                                <div className="relative">
                                    <img src={appearance.wallpaperUrl} alt="Wallpaper" className="w-16 h-16 rounded-lg object-cover" />
                                    <button
                                        onClick={removeWallpaper}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive rounded-full flex items-center justify-center"
                                    >
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <label className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                                    <Image className="w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleWallpaperUpload}
                                    />
                                </label>
                            )}
                            <div className="flex-1 flex items-center text-xs text-muted-foreground">
                                {appearance.wallpaperUrl ? 'Click X to remove wallpaper' : 'Add a custom wallpaper to your chat preview'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Device Options - chat only */}
                {isChat && (
                    <div className="pt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Device Options</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between py-1">
                                <Label htmlFor="show-status-bar" className="text-sm">Show status bar</Label>
                                <Switch
                                    id="show-status-bar"
                                    checked={appearance.showDeviceStatusBar ?? true}
                                    onCheckedChange={(checked) => onAppearanceChange({ ...appearance, showDeviceStatusBar: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <Label htmlFor="show-frame" className="text-sm">Show device frame</Label>
                                <Switch
                                    id="show-frame"
                                    checked={appearance.showDeviceFrame ?? true}
                                    onCheckedChange={(checked) => onAppearanceChange({ ...appearance, showDeviceFrame: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <Label htmlFor="status-bar-time" className="text-sm">Status bar time</Label>
                                <Input
                                    id="status-bar-time"
                                    type="text"
                                    value={appearance.statusBarTime ?? '9:41'}
                                    onChange={(e) => onAppearanceChange({ ...appearance, statusBarTime: e.target.value })}
                                    className="h-7 w-16 text-xs text-center"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}
