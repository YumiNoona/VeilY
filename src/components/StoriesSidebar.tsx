import React, { useRef } from 'react';
import { Plus, Trash2, Upload, Instagram, Ghost, Crown, RotateCcw, Wand2, User, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStoriesState } from '@/hooks/useStoriesState';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AppearanceSection } from './sidebar/sections/AppearanceSection';
import { cn } from '@/lib/utils';
import { STORIES_TEMPLATES } from '@/lib/templates';
import { AppearanceSettings } from '@/types/chat';

type StoriesState = ReturnType<typeof useStoriesState>['state'];
type SetFn<T> = (val: T) => void;

interface StoriesSidebarProps {
    state: StoriesState;
    setPlatform: SetFn<'instagram' | 'snapchat'>;
    setUsername: SetFn<string>;
    setVerified: SetFn<boolean>;
    setTimeAgo: SetFn<string>;
    setPostedAt: SetFn<string>;
    setActiveSlide: SetFn<number>;
    addSlide: () => void;
    updateSlideImage: (index: number, imageUrl: string | null) => void;
    removeSlide: (index: number) => void;
    setAppearance: (updates: Partial<AppearanceSettings>) => void;
    handleReset: () => void;
    onTemplateLoad?: (template: any) => void;
    onRandomize?: () => void;
}

export const StoriesSidebar: React.FC<StoriesSidebarProps> = ({
    state, setPlatform, setUsername, setVerified, setTimeAgo, setPostedAt,
    setActiveSlide, addSlide, updateSlideImage, removeSlide, setAppearance,
    handleReset, onTemplateLoad, onRandomize
}) => {
    const { plan, setUpgradeModalOpen } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => updateSlideImage(index, ev.target?.result as string);
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const activeSlide = state.slides[state.activeSlideIndex];

    return (
        <aside className="w-full lg:w-[450px] bg-sidebar-bg border-r border-sidebar-border h-full flex flex-col overflow-hidden">
            {/* App selection Header block */}
            <div className="pt-5 px-3 pb-2 border-b border-sidebar-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 flex-1">
                        <Select onValueChange={(val) => {
                            if (onTemplateLoad) {
                                const template = STORIES_TEMPLATES[val as keyof typeof STORIES_TEMPLATES];
                                if (template) onTemplateLoad(template);
                            }
                        }}>
                            <SelectTrigger className="w-[140px] h-8 text-xs font-medium">
                                <SelectValue placeholder="Templates" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Instagram</SelectLabel>
                                    <SelectItem value="influencerDay">Influencer Day</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                    <SelectLabel>Snapchat</SelectLabel>
                                    <SelectItem value="snapchatVibe">Chill Vibes</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-1">
                        {handleReset && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground"
                                onClick={handleReset}
                                title="Reset All"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        )}
                        
                        {onRandomize && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                onClick={onRandomize}
                                title="Randomize Content"
                            >
                                <Wand2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <Tabs
                    value={state.platform}
                    onValueChange={(val) => {
                        if (val === 'snapchat' && plan === 'free') {
                            setUpgradeModalOpen(true);
                            return;
                        }
                        setPlatform(val as 'instagram' | 'snapchat');
                    }}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 h-10">
                        <TabsTrigger value="instagram" className="flex items-center gap-2">
                            <Instagram className="w-4 h-4" /> <span className="text-xs font-semibold">Instagram</span>
                        </TabsTrigger>
                        <TabsTrigger value="snapchat" className="flex relative items-center justify-center gap-2">
                            <Ghost className="w-4 h-4" /> <span className="text-xs font-semibold">Snapchat</span>
                            {plan === 'free' && <Crown className="w-3 h-3 text-amber-500 absolute top-1 right-2 drop-shadow-sm" />}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <Accordion type="multiple" defaultValue={["profile", "content"]} className="w-full">

                    {/* PROFILE SECTION */}
                    <AccordionItem value="profile" className="border rounded-xl bg-card shadow-sm overflow-hidden">
                        <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <User className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="font-semibold text-sm">Profile</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 px-3 pb-3">
                            <div className="grid gap-2">
                                <Label>Username</Label>
                                <Input
                                    value={state.username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="username"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Verified Badge</Label>
                                <Switch checked={state.verified} onCheckedChange={setVerified} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* CONTENT SECTION */}
                    <AccordionItem value="content" className="border rounded-xl bg-card shadow-sm overflow-hidden mt-3">
                        <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="font-semibold text-sm">Story Content ({state.slides.length})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-2 px-3 pb-3">
                            
                            {/* Slides navigator */}
                            <div className="grid gap-2">
                                <Label>Slides</Label>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {state.slides.map((slide, i) => (
                                        <button
                                            key={slide.id}
                                            onClick={() => setActiveSlide(i)}
                                            className={cn(
                                                "w-12 h-12 rounded-lg border-2 overflow-hidden flex items-center justify-center text-xs font-bold relative group",
                                                state.activeSlideIndex === i
                                                    ? 'border-primary border-solid'
                                                    : 'border-border border-solid hover:border-primary/50'
                                            )}
                                        >
                                            {slide.imageUrl ? (
                                                <img src={slide.imageUrl} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <span className="text-muted-foreground">{i + 1}</span>
                                            )}
                                            {state.slides.length > 1 && (
                                                <button
                                                    onClick={ev => { ev.stopPropagation(); removeSlide(i); }}
                                                    className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-white"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </button>
                                    ))}
                                    <button
                                        onClick={addSlide}
                                        className="w-12 h-12 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Active Slide Image Upload */}
                            <div className="grid gap-2">
                                <Label>Slide {state.activeSlideIndex + 1} Image</Label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={e => handleImageUpload(e, state.activeSlideIndex)}
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-all",
                                        activeSlide?.imageUrl ? 'h-32 p-2' : 'h-48 p-6'
                                    )}
                                >
                                    {activeSlide?.imageUrl ? (
                                        <div className="relative w-full h-full">
                                            <img src={activeSlide.imageUrl} className="w-full h-full object-contain rounded-lg" alt="Story slide" />
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-muted-foreground" />
                                            <span className="text-sm font-medium text-muted-foreground">Click to upload</span>
                                        </>
                                    )}
                                </div>
                                <p className="text-[10px] text-muted-foreground">9:16 aspect ratio recommended. Supports JPEG, PNG, WebP.</p>
                            </div>

                            <div className="grid gap-2">
                                <Label>Posted At</Label>
                                <Input
                                    type="datetime-local"
                                    value={state.postedAt}
                                    onChange={e => setPostedAt(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Time Label (shown on preview)</Label>
                                <Input
                                    value={state.timeAgo}
                                    onChange={e => setTimeAgo(e.target.value)}
                                    placeholder="e.g. 3 months"
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    
                    {/* APPEARANCE SECTION */}
                    <AppearanceSection 
                        appearance={state.appearance}
                        onAppearanceChange={setAppearance}
                    />

                </Accordion>
            </div>
        </aside>
    );
};
