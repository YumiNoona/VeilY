import React, { useRef } from 'react';
import { Plus, Trash2, Upload, RotateCcw, Wand2, User, FileText } from 'lucide-react';
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
import { PlatformIcon } from './icons/PlatformIcons';
import { cn } from '@/lib/utils';
import { STORIES_TEMPLATES } from '@/lib/templates';
import { AppearanceSettings } from '@/types/chat';

type StoriesState = ReturnType<typeof useStoriesState>['state'];
type SetFn<T> = (val: T) => void;

interface StoriesSidebarProps {
    state: StoriesState;
    setPlatform: SetFn<'instagram' | 'snapchat' | 'whatsapp' | 'messenger'>;
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
            <div className="flex items-center justify-between gap-2 border-b border-sidebar-border p-3 shrink-0">
                <div className="flex items-center gap-1.5 flex-1">
                    <Select onValueChange={(val) => {
                        if (onTemplateLoad) {
                            const template = STORIES_TEMPLATES[val as keyof typeof STORIES_TEMPLATES];
                            if (template) onTemplateLoad(template);
                        }
                    }}>
                        <SelectTrigger className="h-10 w-full rounded-xl text-sm font-medium">
                            <SelectValue placeholder="Templates" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Instagram</SelectLabel>
                                <SelectItem value="influencerDay">Coastal Trip</SelectItem>
                                <SelectItem value="productLaunch">Product Photos</SelectItem>
                                <SelectItem value="dayInLife">Saturday Diary</SelectItem>
                                <SelectItem value="morningCoffee">Morning Coffee</SelectItem>
                                <SelectItem value="gymSession">Training Session</SelectItem>
                                <SelectItem value="natureEscape">Mountain Walk</SelectItem>
                                <SelectItem value="urbanVibe">City Walk</SelectItem>
                                <SelectItem value="petLove">Milo at Home</SelectItem>
                                <SelectItem value="foodieHeaven">Dinner Prep</SelectItem>
                                <SelectItem value="techSetup">Desk Setup</SelectItem>
                                <SelectItem value="minimalFashion">Wardrobe Edit</SelectItem>
                                <SelectItem value="modernArch">Architecture Study</SelectItem>
                                <SelectItem value="artGallery">Gallery Visit</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>Snapchat</SelectLabel>
                                <SelectItem value="snapchatVibe">Evening Out</SelectItem>
                                <SelectItem value="travelJournal">Road Trip</SelectItem>
                                <SelectItem value="beachDay">Beach Day</SelectItem>
                                <SelectItem value="cityNight">City at Night</SelectItem>
                                <SelectItem value="luxuryDrive">Weekend Drive</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1">
                    {handleReset && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-xl text-muted-foreground"
                            onClick={handleReset}
                            aria-label="Reset configuration"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    )}
                    
                    {onRandomize && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-xl text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/30"
                            onClick={onRandomize}
                            aria-label="Randomize content"
                        >
                            <Wand2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="px-3 py-2.5 border-b border-sidebar-border shrink-0 flex items-center justify-center min-h-[56px]">
                <Tabs
                    value={state.platform}
                    onValueChange={(val) => setPlatform(val as 'instagram' | 'snapchat' | 'whatsapp' | 'messenger')}
                    className="w-full"
                >
                    <TabsList className="grid h-10 w-full grid-cols-4">
                        <TabsTrigger value="instagram" aria-label="Instagram story" title="Instagram story">
                            <PlatformIcon platform="instagram" className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="snapchat" aria-label="Snapchat story" title="Snapchat story">
                            <PlatformIcon platform="snapchat" className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="whatsapp" aria-label="WhatsApp status" title="WhatsApp status">
                            <PlatformIcon platform="whatsapp" className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="messenger" aria-label="Messenger story" title="Messenger story">
                            <PlatformIcon platform="messenger" className="w-4 h-4" />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-2 scrollbar-thin">
                <Accordion type="multiple" defaultValue={["profile", "content"]} className="space-y-2">

                    {/* PROFILE SECTION */}
                    <AccordionItem value="profile" className="border rounded-xl bg-card shadow-sm overflow-hidden">
                        <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <User className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="text-base font-semibold">Profile</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 px-3 pb-3">
                            <div className="grid gap-2 mt-1">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</Label>
                                <Input
                                    value={state.username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="username"
                                    className="h-10 text-sm font-medium bg-background border-zinc-200"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Verified Badge</Label>
                                <Switch checked={state.verified} onCheckedChange={setVerified} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* CONTENT SECTION */}
                    <AccordionItem value="content" className="border rounded-xl bg-card shadow-sm overflow-hidden">
                        <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="text-base font-semibold">Story Content ({state.slides.length})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-2 px-3 pb-3">
                            
                            {/* Slides navigator */}
                            <div className="grid gap-2 mt-1">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Slides</Label>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {state.slides.map((slide, i) => (
                                        <div
                                            key={slide.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => setActiveSlide(i)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') {
                                                    event.preventDefault();
                                                    setActiveSlide(i);
                                                }
                                            }}
                                            aria-label={`Select slide ${i + 1}`}
                                            className={cn(
                                                "group relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 text-xs font-medium",
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
                                                    type="button"
                                                    aria-label={`Remove slide ${i + 1}`}
                                                    onClick={ev => { ev.stopPropagation(); removeSlide(i); }}
                                                    className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-white"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        aria-label="Add slide"
                                        onClick={addSlide}
                                        className="w-12 h-12 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Active Slide Image Upload */}
                            <div className="grid gap-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Slide {state.activeSlideIndex + 1} Image</Label>
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
                                <p className="text-xs text-muted-foreground">9:16 aspect ratio recommended. Supports JPEG, PNG, WebP.</p>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Posted At</Label>
                                <Input
                                    type="datetime-local"
                                    value={state.postedAt}
                                    onChange={e => setPostedAt(e.target.value)}
                                    className="h-10 text-sm font-medium bg-background border-zinc-200"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time Label (shown on preview)</Label>
                                <Input
                                    className="h-10 text-sm font-medium bg-background border-zinc-200"
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
