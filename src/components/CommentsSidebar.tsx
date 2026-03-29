import React, { useRef } from 'react';
import { useCommentState, CommentPlatform, Profile, Comment } from '@/hooks/useCommentState';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Twitter, Instagram, Linkedin, Facebook, Youtube, Plus, Trash2, Upload, MessageSquare, Heart, Clock, RotateCcw, Wand2, Users, Palette, MessageCircle, Crown, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { COMMENT_TEMPLATES } from '@/lib/templates';
import { useAuth } from '@/contexts/AuthContext';
import { SmartFillModal } from './modals/SmartFillModal';
import { ParsedChat } from '@/lib/parsers';

// Mapping TikTok icon manually or using a similar one since Lucide might not have it or it's named differently
// For now using MessageSquare as placeholder if TikTok not available, but let's check basic icons.
// Lucide doesn't have TikTok. We needed SVGs for badges, maybe good to have SVGs for tabs too?
// For now, straightforward text or available icons.

interface CommentsSidebarProps {
    state: ReturnType<typeof useCommentState>['state'];
    setPlatform: ReturnType<typeof useCommentState>['setPlatform'];
    setConfig: ReturnType<typeof useCommentState>['setConfig'];
    addProfile: ReturnType<typeof useCommentState>['addProfile'];
    updateProfile: ReturnType<typeof useCommentState>['updateProfile'];
    removeProfile: ReturnType<typeof useCommentState>['removeProfile'];
    addComment: (parentId?: string) => void;
    updateComment: (id: string, updates: Partial<Comment>) => void;
    deleteComment: (id: string) => void;
    onReset?: () => void;
    onTemplateLoad?: (template: any) => void;
    onRandomize?: () => void;
}

export const CommentsSidebar: React.FC<CommentsSidebarProps> = ({
    state,
    setPlatform,
    setConfig,
    addProfile,
    updateProfile,
    removeProfile,
    addComment,
    updateComment,
    deleteComment,
    onReset,
    onTemplateLoad,
    onRandomize,
}) => {
    const { plan, setUpgradeModalOpen } = useAuth();
    const [isSmartFillOpen, setIsSmartFillOpen] = React.useState(false);

    const handleSmartFillClick = () => {
        if (plan === 'free') {
            setUpgradeModalOpen(true);
            return;
        }
        setIsSmartFillOpen(true);
    };

    const handleSmartFillSuccess = (data: ParsedChat) => {
        // Map AI generated participants to profiles
        if (data.participants && data.participants.length > 0) {
            data.participants.forEach((p, idx) => {
                const existing = state.profiles.find(prof => prof.name === p.name);
                if (!existing) {
                    addProfile();
                }
            });
        }

        // Map AI generated messages to comments
        if (data.messages && data.messages.length > 0) {
            data.messages.forEach((msg, idx) => {
                const author = (data.participants?.[idx] || data.participants?.[0] || { name: 'User' }) as any;
                const profile = state.profiles.find(p => p.name === author.name);
                
                if (idx === 0 && state.comments[0]) {
                    updateComment(state.comments[0].id, {
                        userId: profile?.id || state.profiles[0]?.id || '',
                        text: msg.text,
                        likes: Math.floor(Math.random() * 50).toString(),
                        timeAgo: 'Just now'
                    });
                } else {
                    addComment();
                    // Note: In a real app, we might need a way to get the ID of the newly added comment 
                    // or batch update the state. For now, this populates the first or adds more.
                }
            });
        }
    };
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePlatformChange = (val: CommentPlatform) => {
        const isPremium = val === 'tiktok' || val === 'youtube';
        if (isPremium && plan === 'free') {
            setUpgradeModalOpen(true);
        } else {
            setPlatform(val);
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>, profileId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProfile(profileId, { avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const renderCommentEditor = (comment: Comment, depth = 0) => {
        const commenter = state.profiles.find(p => p.id === comment.userId) || state.profiles[0];

        return (
            <div key={comment.id} className="border-l-2 border-border pl-4 mb-4 relative">
                <div className="grid gap-3 mb-2">
                    <div className="flex items-center gap-2">
                        <Select
                            value={comment.userId}
                            onValueChange={(val) => updateComment(comment.id, { userId: val })}
                        >
                            <SelectTrigger className="h-10 text-sm font-medium w-[150px] bg-background border-zinc-200">
                                <SelectValue placeholder="Select User" />
                            </SelectTrigger>
                            <SelectContent>
                                {state.profiles.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1.5 relative">
                            <Heart className="w-4 h-4 text-muted-foreground absolute left-2.5 pointer-events-none" />
                            <Input
                                className="h-10 text-sm w-[80px] pl-8 bg-background border-zinc-200"
                                placeholder="Likes"
                                value={comment.likes}
                                onChange={(e) => updateComment(comment.id, { likes: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-1.5 relative">
                            <Clock className="w-4 h-4 text-muted-foreground absolute left-2.5 pointer-events-none" />
                            <Input
                                className="h-10 text-sm w-[80px] pl-8 bg-background border-zinc-200"
                                placeholder="Time"
                                value={comment.timeAgo}
                                onChange={(e) => updateComment(comment.id, { timeAgo: e.target.value })}
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteComment(comment.id)}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>

                    <Textarea
                        className="text-sm font-medium min-h-[70px] bg-background border-zinc-200 leading-relaxed"
                        value={comment.text}
                        onChange={(e) => updateComment(comment.id, { text: e.target.value })}
                        placeholder="Comment text..."
                    />

                    <div className="flex items-center gap-2">
                        {/* Platform specific toggles? e.g. Liked by author */}
                        {(state.platform === 'instagram' || state.platform === 'tiktok' || state.platform === 'youtube') && (
                            <div className="flex items-center gap-2">
                                <Switch
                                    className="scale-90"
                                    checked={comment.isLikedByAuthor}
                                    onCheckedChange={(c) => updateComment(comment.id, { isLikedByAuthor: c })}
                                />
                                <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-wide">Liked by creator</span>
                            </div>
                        )}
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 text-xs font-bold ml-auto px-4 rounded-lg uppercase tracking-wider"
                            onClick={() => addComment(comment.id)}
                        >
                            Reply
                        </Button>
                    </div>
                </div>

                {/* Recursive Replies */}
                <div className="pl-2">
                    {comment.replies.map(reply => renderCommentEditor(reply, depth + 1))}
                </div>
            </div>
        );
    };

    return (
        <aside className="w-full lg:w-[450px] bg-sidebar-bg border-r border-sidebar-border h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-3 pt-5 pb-2 border-b border-sidebar-border shrink-0 min-h-[64px]">
                <div className="flex items-center gap-1.5 flex-1">
                    <Select onValueChange={(val) => {
                        if (onTemplateLoad) {
                            const template = COMMENT_TEMPLATES[val as keyof typeof COMMENT_TEMPLATES];
                            if (template) onTemplateLoad(template);
                        }
                    }}>
                        <SelectTrigger className="w-[140px] h-8 text-xs font-medium">
                            <SelectValue placeholder="Templates" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Instagram</SelectLabel>
                                <SelectItem value="instagramHype">IG Hype</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>TikTok</SelectLabel>
                                <SelectItem value="tiktokViral">Viral Video</SelectItem>
                                <SelectItem value="tiktokRecipe">Cooking Tips</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>X (Twitter)</SelectLabel>
                                <SelectItem value="twitterRatio">Ratioed</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>YouTube</SelectLabel>
                                <SelectItem value="youtubeKnowledge">Knowledge Sharing</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1">
                    {onReset && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            onClick={onReset}
                            title="Reset All"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    )}
                    
                    {onRandomize && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 relative group"
                            onClick={() => {
                                if (plan === 'free') {
                                    setUpgradeModalOpen(true);
                                    return;
                                }
                                onRandomize();
                            }}
                            title="Randomize Content (Premium)"
                        >
                            <Wand2 className="w-4 h-4" />
                            {plan === 'free' && (
                                <Crown className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-amber-500 fill-amber-500/20 drop-shadow-sm border-2 border-sidebar-bg rounded-full bg-sidebar-bg p-[0.5px]" />
                            )}
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 relative group"
                        onClick={handleSmartFillClick}
                        title="AI Smart Fill (Premium)"
                    >
                        <Sparkles className="w-4 h-4 fill-amber-500/20" />
                        {plan === 'free' && (
                            <Crown className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-amber-500 fill-amber-500/20 drop-shadow-sm border-2 border-sidebar-bg rounded-full bg-sidebar-bg p-[0.5px]" />
                        )}
                    </Button>
                </div>
            </div>

            <SmartFillModal
                isOpen={isSmartFillOpen}
                onClose={() => setIsSmartFillOpen(false)}
                onSuccess={handleSmartFillSuccess}
                platform="comment_thread"
            />

            <div className="px-3 py-2.5 border-b border-sidebar-border shrink-0 flex items-center justify-center min-h-[56px]">
                <Tabs
                    value={state.platform}
                    onValueChange={(val) => handlePlatformChange(val as CommentPlatform)}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-4 h-10">
                        <TabsTrigger value="instagram" className="relative">
                            <Instagram className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="tiktok" className="relative">
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                            {plan === 'free' && <Crown className="w-2.5 h-2.5 text-amber-500 absolute top-0.5 right-0.5" />}
                        </TabsTrigger>
                        <TabsTrigger value="twitter" className="relative">
                            <Twitter className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="youtube" className="relative">
                            <Youtube className="w-4 h-4" />
                            {plan === 'free' && <Crown className="w-2.5 h-2.5 text-amber-500 absolute top-0.5 right-0.5" />}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-2 scrollbar-thin">
                <Accordion type="multiple" defaultValue={["people", "comments"]} className="space-y-2">

                    {/* PEOPLE SECTION */}
                    <AccordionItem value="people" className="border rounded-xl bg-card shadow-sm overflow-hidden">
                        <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Users className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="font-semibold text-sm">People ({state.profiles.length})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-4 px-3 pb-3">
                            {state.profiles.map((profile, index) => (
                                <div key={profile.id} className="bg-muted/30 p-3 rounded-lg border border-border">
                                    <div className="flex items-start gap-3">
                                        <div className="relative group">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={profile.avatar} className="object-cover" />
                                                <AvatarFallback>{profile.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded-full cursor-pointer">
                                                <Upload className="w-4 h-4 text-white" />
                                                <Input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    onChange={(e) => handleAvatarUpload(e, profile.id)}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="grid gap-2">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Display Name</Label>
                                                <Input
                                                    value={profile.name}
                                                    onChange={(e) => updateProfile(profile.id, { name: e.target.value })}
                                                    placeholder="Display Name"
                                                    className="h-10 text-base font-medium bg-background border-zinc-200"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Handle</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={profile.handle}
                                                        onChange={(e) => updateProfile(profile.id, { handle: e.target.value })}
                                                        placeholder="Handle"
                                                        className="h-10 text-base font-medium flex-1 bg-background border-zinc-200"
                                                    />
                                                    <div className="flex items-center gap-2 px-2 bg-background border border-zinc-200 rounded-lg h-10">
                                                        <Switch
                                                            className="scale-75"
                                                            checked={profile.verified}
                                                            onCheckedChange={(c) => updateProfile(profile.id, { verified: c })}
                                                        />
                                                        <span className="text-[10px] font-bold text-muted-foreground">VERIFIED</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {!profile.isCreator && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeProfile(profile.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full h-10 text-xs font-bold uppercase tracking-wider" onClick={addProfile}>
                                <Plus className="w-4 h-4 mr-2" /> Add Person
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    {/* COMMENTS SECTION */}
                    <AccordionItem value="comments" className="border rounded-xl bg-card shadow-sm overflow-hidden">
                        <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <MessageCircle className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="font-semibold text-sm">Comments</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 px-3 pb-3">
                            {state.comments.map(comment => renderCommentEditor(comment))}
                            <Button className="w-full mt-4 h-12 text-sm font-bold uppercase tracking-wider bg-[#1d2333] hover:bg-[#1d2333]/90 rounded-xl" onClick={() => addComment()}>
                                <Plus className="w-4 h-4 mr-2" /> Add New Comment
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    {/* APPEARANCE SECTION */}
                    <AccordionItem value="appearance" className="border rounded-xl bg-card shadow-sm overflow-hidden">
                        <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Palette className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="font-semibold text-sm">Appearance</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-4 px-3 pb-3">
                            <div className="flex items-center justify-between">
                                <Label>Dark Mode</Label>
                                <Switch
                                    checked={state.config.theme === 'dark'}
                                    onCheckedChange={(checked) => setConfig({ theme: checked ? 'dark' : 'light' })}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </aside>
    );
};
