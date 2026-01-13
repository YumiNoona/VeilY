import React from 'react';
import { useSocialPostState, SocialPlatform } from '@/hooks/useSocialPostState';
import { formatMetric } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Upload, X, Check, Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Logo } from './Logo';

interface SocialPostSidebarProps {
    state: ReturnType<typeof useSocialPostState>['state'];
    setPlatform: ReturnType<typeof useSocialPostState>['setPlatform'];
    setAuthor: ReturnType<typeof useSocialPostState>['setAuthor'];
    setContent: ReturnType<typeof useSocialPostState>['setContent'];
    setMetrics: ReturnType<typeof useSocialPostState>['setMetrics'];
    setConfig: ReturnType<typeof useSocialPostState>['setConfig'];
}

export const SocialPostSidebar: React.FC<SocialPostSidebarProps> = ({
    state,
    setPlatform,
    setAuthor,
    setContent,
    setMetrics,
    setConfig,
}) => {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'image') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (field === 'avatar') {
                    setAuthor({ avatar: reader.result as string });
                } else {
                    setContent({ image: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <aside className="w-full lg:w-[450px] bg-sidebar-bg border-r border-sidebar-border h-full flex flex-col overflow-hidden">
            <div className="pt-5 px-3 pb-2 border-b border-sidebar-border">
                <div className="flex items-center justify-between mb-4">
                    <Logo />
                    <Button variant="outline" size="sm" className="text-xs font-medium h-8">Sign In</Button>
                </div>

                <Tabs
                    value={state.platform}
                    onValueChange={(val) => setPlatform(val as SocialPlatform)}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="twitter"><Twitter className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="instagram"><Instagram className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="linkedin"><Linkedin className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="facebook"><Facebook className="w-4 h-4" /></TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <Accordion type="single" collapsible defaultValue="author" className="w-full">

                    {/* AUTHOR SECTION */}
                    <AccordionItem value="author">
                        <AccordionTrigger>Author</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <div className="grid gap-2">
                                <Label>Display Name</Label>
                                <Input
                                    value={state.author.name}
                                    onChange={(e) => setAuthor({ name: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Handle / Username</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                                    <Input
                                        className="pl-7"
                                        value={state.author.handle}
                                        onChange={(e) => setAuthor({ handle: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>Verified Badge</Label>
                                <Switch
                                    checked={state.author.verified}
                                    onCheckedChange={(checked) => setAuthor({ verified: checked })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Profile Picture</Label>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted border border-border">
                                        {state.author.avatar ? (
                                            <img src={state.author.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                                img
                                            </div>
                                        )}
                                    </div>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="w-full text-sm"
                                        onChange={(e) => handleImageUpload(e, 'avatar')}
                                    />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* CONTENT SECTION */}
                    <AccordionItem value="content">
                        <AccordionTrigger>Post Content</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <div className="grid gap-2">
                                <Label>Caption</Label>
                                <Textarea
                                    className="min-h-[100px]"
                                    value={state.content.text}
                                    onChange={(e) => setContent({ text: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Post Image</Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                    {state.content.image ? (
                                        <div className="relative">
                                            <img src={state.content.image} alt="Content" className="max-h-40 mx-auto rounded-md" />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                                                onClick={() => setContent({ image: null })}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-muted-foreground text-sm">
                                            <Upload className="w-6 h-6 mb-2" />
                                            <span>Click to upload image</span>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => handleImageUpload(e, 'image')}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* METRICS SECTION */}
                    <AccordionItem value="metrics">
                        <AccordionTrigger>Metrics</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Likes</Label>
                                    <Input
                                        value={state.metrics.likes}
                                        onChange={(e) => setMetrics({ likes: e.target.value })}
                                        onBlur={(e) => setMetrics({ likes: formatMetric(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Comments</Label>
                                    <Input
                                        value={state.metrics.comments}
                                        onChange={(e) => setMetrics({ comments: e.target.value })}
                                        onBlur={(e) => setMetrics({ comments: formatMetric(e.target.value) })}
                                    />
                                </div>
                                {(state.platform === 'twitter' || state.platform === 'linkedin') && (
                                    <div className="grid gap-2">
                                        <Label>Reposts</Label>
                                        <Input
                                            value={state.metrics.reposts}
                                            onChange={(e) => setMetrics({ reposts: e.target.value })}
                                            onBlur={(e) => setMetrics({ reposts: formatMetric(e.target.value) })}
                                        />
                                    </div>
                                )}
                                {state.platform === 'twitter' && (
                                    <div className="grid gap-2">
                                        <Label>Views</Label>
                                        <Input
                                            value={state.metrics.views}
                                            onChange={(e) => setMetrics({ views: e.target.value })}
                                            onBlur={(e) => setMetrics({ views: formatMetric(e.target.value) })}
                                        />
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* APPEARANCE SECTION */}
                    <AccordionItem value="appearance">
                        <AccordionTrigger>Appearance</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                                <Label>Dark Mode</Label>
                                <Switch
                                    checked={state.config.theme === 'dark'}
                                    onCheckedChange={(checked) => setConfig({ theme: checked ? 'dark' : 'light' })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>Transparent Background</Label>
                                <Switch
                                    checked={state.config.transparentBackground}
                                    onCheckedChange={(checked) => setConfig({ transparentBackground: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label>Show Watermark</Label>
                                <Switch
                                    checked={state.config.showWatermark}
                                    onCheckedChange={(checked) => setConfig({ showWatermark: checked })}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>
        </aside>
    );
};
