import React from 'react';
import { useSocialPostState, SocialPlatform, ThreadItem } from '@/hooks/useSocialPostState';
import { formatMetric } from '@/lib/utils';
import { SOCIAL_TEMPLATES } from '@/lib/templates';
import { v4 as uuidv4 } from 'uuid';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Upload, X, Twitter, Instagram, Linkedin, Facebook, MessageSquare, Wand2, ChevronDown, ChevronRight, BadgeCheck } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '@/contexts/AuthContext';

interface SocialPostSidebarProps {
    state: ReturnType<typeof useSocialPostState>['state'];
    setPlatform: ReturnType<typeof useSocialPostState>['setPlatform'];
    setAuthor: ReturnType<typeof useSocialPostState>['setAuthor'];
    setContent: ReturnType<typeof useSocialPostState>['setContent'];
    setMetrics: ReturnType<typeof useSocialPostState>['setMetrics'];
    setConfig: ReturnType<typeof useSocialPostState>['setConfig'];
    setThreadItems: ReturnType<typeof useSocialPostState>['setThreadItems'];
    loadTemplate: ReturnType<typeof useSocialPostState>['loadTemplate'];
    randomizeState: ReturnType<typeof useSocialPostState>['randomizeState'];
}

export const SocialPostSidebar: React.FC<SocialPostSidebarProps> = ({
    state,
    setPlatform,
    setAuthor,
    setContent,
    setMetrics,
    setConfig,
    setThreadItems,
    loadTemplate,
    randomizeState
}) => {
    const { isPremium, setUpgradeModalOpen } = useAuth();
    const [collapsedThreads, setCollapsedThreads] = React.useState<Record<string, boolean>>({});

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

    const handleThreadImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: 'avatar' | 'image') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThreadItems(prev => prev.map(item => {
                    if (item.id === id) {
                        if (field === 'avatar') {
                            return { ...item, author: { ...item.author, avatar: reader.result as string } };
                        } else {
                            return { ...item, content: { ...item.content, image: reader.result as string } };
                        }
                    }
                    return item;
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addThreadItem = (type: 'comment' | 'reply' | 'continuation', parentId: string | null = null) => {
        const newItem: ThreadItem = {
            id: uuidv4(),
            parentId,
            author: { name: 'New User', handle: 'user123', avatar: 'https://github.com/shadcn.png', verified: false },
            content: { text: 'Adding a new thought here...', image: null, date: new Date() },
            metrics: { likes: '0' },
            depth: type === 'reply' ? 1 : 0,
            isThreadContinuation: type === 'continuation'
        };
        setThreadItems(prev => [...prev, newItem]);
    };

    const removeThreadItem = (id: string) => {
        setThreadItems(prev => prev.filter(item => item.id !== id && item.parentId !== id));
    };

    const updateThreadItem = (id: string, updates: Partial<ThreadItem>) => {
        setThreadItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const toggleThreadCollapse = (id: string) => {
        setCollapsedThreads(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const collapseAllThreads = () => {
        const allIds = state.threadItems.reduce((acc, item) => ({ ...acc, [item.id]: true }), {});
        setCollapsedThreads(allIds);
    };

    const expandAllThreads = () => {
        setCollapsedThreads({});
    };

    return (
        <aside className="w-full lg:w-[450px] bg-sidebar-bg border-r border-sidebar-border h-full flex flex-col overflow-hidden">
            <div className="pt-5 px-3 pb-2 border-b border-sidebar-border">
                <div className="flex items-center justify-between mb-4">
                    <Logo />
                    <div className="flex items-center gap-1.5">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                            onClick={randomizeState}
                            title="Randomize Content"
                        >
                            <Wand2 className="h-4 w-4" />
                        </Button>
                        <Select onValueChange={(val) => {
                            switch (val) {
                                case 'viralTweet': loadTemplate(SOCIAL_TEMPLATES.viralTweet); break;
                                case 'linkedinFlex': loadTemplate(SOCIAL_TEMPLATES.linkedinFlex); break;
                                case 'redditTifu': loadTemplate(SOCIAL_TEMPLATES.redditTifu); break;
                                case 'instagramViral': loadTemplate(SOCIAL_TEMPLATES.instagramViral); break;
                            }
                        }}>
                        <SelectTrigger className="w-[180px] h-8 text-xs font-medium">
                            <SelectValue placeholder="Load Template..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Viral</SelectLabel>
                                <SelectItem value="viralTweet">Tech Bro Tweet</SelectItem>
                                <SelectItem value="instagramViral">Aesthetic IG Post</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>Professional</SelectLabel>
                                <SelectItem value="linkedinFlex">LinkedIn Flex</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>Funny / Stories</SelectLabel>
                                <SelectItem value="redditTifu">Reddit TIFU</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    </div>
                </div>

                <Tabs
                    value={state.platform}
                    onValueChange={(val) => setPlatform(val as SocialPlatform)}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-5 h-10">
                        <TabsTrigger value="twitter"><Twitter className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="instagram"><Instagram className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="linkedin"><Linkedin className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="facebook"><Facebook className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="reddit"><MessageSquare className="w-4 h-4" /></TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <Accordion type="multiple" defaultValue={["author", "content"]} className="w-full">

                    {/* AUTHOR SECTION */}
                    <AccordionItem value="author">
                        <AccordionTrigger>Main Author</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <div className="grid gap-2">
                                <Label>Display Name</Label>
                                <Input
                                    value={state.author.name}
                                    onChange={(e) => setAuthor({ name: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Handle / Username (Subreddit for Reddit)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">{state.platform === 'reddit' ? 'r/' : '@'}</span>
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
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">img</div>
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
                                <Label>Text / Caption</Label>
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

                    {/* THREADS / COMMENTS SECTION */}
                    <AccordionItem value="threads">
                        <AccordionTrigger>Thread & Comments</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex gap-2 flex-wrap">
                                    <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => addThreadItem('comment')}>+ Comment</Button>
                                    {state.platform === 'twitter' && (
                                        <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => addThreadItem('continuation')}>+ Continuation</Button>
                                    )}
                                    {(state.platform === 'reddit' || state.platform === 'instagram') && state.threadItems.length > 0 && (
                                        <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => addThreadItem('reply', state.threadItems[0].id)}>+ Reply</Button>
                                    )}
                                </div>
                                
                                {state.threadItems.length > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <Button size="sm" variant="ghost" className="h-8 text-[11px] px-2" onClick={expandAllThreads}>Expand</Button>
                                        <Button size="sm" variant="secondary" className="h-8 text-[11px] px-2" onClick={collapseAllThreads}>Collapse</Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                {state.threadItems.map((item) => {
                                    const isCollapsed = collapsedThreads[item.id];
                                    return (
                                    <Card key={item.id} className="p-3 bg-muted/30 relative">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 z-10"
                                            onClick={() => removeThreadItem(item.id)}
                                        >
                                            <X className="h-3 w-3"/>
                                        </Button>
                                        
                                        <div 
                                            className="mb-3 pr-6 flex items-center cursor-pointer select-none"
                                            onClick={() => toggleThreadCollapse(item.id)}
                                        >
                                            {isCollapsed ? <ChevronRight className="w-4 h-4 mr-1 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 mr-1 text-muted-foreground" />}
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-2">
                                                {item.isThreadContinuation ? 'Thread Continuation' : (item.depth === 1 ? 'Reply (Nested)' : 'Top-Level Comment')}
                                            </span>
                                            {isCollapsed && (
                                                <span className="text-xs font-medium text-muted-foreground truncate max-w-[120px]">
                                                    {item.author.name}
                                                </span>
                                            )}
                                        </div>

                                        {!isCollapsed && (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="flex gap-2">
                                                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0">
                                                        {item.author.avatar ? (
                                                            <img src={item.author.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground">img</div>
                                                        )}
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            onChange={(e) => handleThreadImageUpload(e, item.id, 'avatar')}
                                                        />
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Input 
                                                                className="h-8 text-xs placeholder:text-muted-foreground" 
                                                                placeholder="Name"
                                                                value={item.author.name}
                                                                onChange={(e) => updateThreadItem(item.id, { author: { ...item.author, name: e.target.value } })}
                                                            />
                                                            <Input 
                                                                className="h-8 text-xs placeholder:text-muted-foreground" 
                                                                placeholder="Handle"
                                                                value={item.author.handle}
                                                                onChange={(e) => updateThreadItem(item.id, { author: { ...item.author, handle: e.target.value } })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Textarea 
                                                    className="min-h-[60px] text-xs resize-none" 
                                                    placeholder="Comment text..."
                                                    value={item.content.text}
                                                    onChange={(e) => updateThreadItem(item.id, { content: { ...item.content, text: e.target.value } })}
                                                />
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-xs whitespace-nowrap">Likes/Votes:</Label>
                                                    <Input 
                                                        className="h-7 text-xs w-24" 
                                                        value={item.metrics.likes}
                                                        onChange={(e) => updateThreadItem(item.id, { metrics: { ...item.metrics, likes: e.target.value } })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                )})}
                                {state.threadItems.length === 0 && (
                                    <div className="text-center p-4 border border-dashed rounded-lg text-sm text-muted-foreground">
                                        No comments or threads yet.
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* METRICS SECTION */}
                    <AccordionItem value="metrics">
                        <AccordionTrigger>Post Metrics</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Likes / Upvotes</Label>
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
                        <AccordionTrigger>Appearance & Pro</AccordionTrigger>
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
                            <div className="p-3 border rounded-lg bg-blue-500/5 mt-4">
                                <div className="flex items-center justify-between mb-1">
                                    <Label className="font-semibold text-blue-500">Premium Status</Label>
                                    {isPremium ? (
                                        <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full">
                                            <BadgeCheck className="w-3.5 h-3.5" />
                                            Active
                                        </div>
                                    ) : (
                                        <Button 
                                            size="sm" 
                                            onClick={() => setUpgradeModalOpen(true)}
                                            className="h-7 text-[10px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                                        >
                                            Upgrade
                                        </Button>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                                    Premium fully removes watermark branding and unlocks advanced AI generators.
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>
        </aside>
    );
};
