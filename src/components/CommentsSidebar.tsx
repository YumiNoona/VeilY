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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Twitter, Instagram, Linkedin, Facebook, Youtube, Plus, Trash2, Upload, MessageSquare, Heart, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from './Logo';

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
    addComment: ReturnType<typeof useCommentState>['addComment'];
    updateComment: ReturnType<typeof useCommentState>['updateComment'];
    deleteComment: ReturnType<typeof useCommentState>['deleteComment'];
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
}) => {

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
                            <SelectTrigger className="h-8 text-xs w-[140px]">
                                <SelectValue placeholder="Select User" />
                            </SelectTrigger>
                            <SelectContent>
                                {state.profiles.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1.5 relative">
                            <Heart className="w-3.5 h-3.5 text-muted-foreground absolute left-2 pointer-events-none" />
                            <Input
                                className="h-8 text-xs w-[70px] pl-7"
                                placeholder="Likes"
                                value={comment.likes}
                                onChange={(e) => updateComment(comment.id, { likes: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center gap-1.5 relative">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground absolute left-2 pointer-events-none" />
                            <Input
                                className="h-8 text-xs w-[70px] pl-7"
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
                        className="text-xs min-h-[60px]"
                        value={comment.text}
                        onChange={(e) => updateComment(comment.id, { text: e.target.value })}
                        placeholder="Comment text..."
                    />

                    <div className="flex items-center gap-2">
                        {/* Platform specific toggles? e.g. Liked by author */}
                        {(state.platform === 'instagram' || state.platform === 'tiktok' || state.platform === 'youtube') && (
                            <div className="flex items-center gap-1">
                                <Switch
                                    className="scale-75"
                                    checked={comment.isLikedByAuthor}
                                    onCheckedChange={(c) => updateComment(comment.id, { isLikedByAuthor: c })}
                                />
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">Liked by creator</span>
                            </div>
                        )}
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-6 text-[10px] ml-auto"
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
            <div className="pt-5 px-3 pb-2 border-b border-sidebar-border">
                <div className="flex items-center justify-between mb-4">
                    <Logo />
                    <Button variant="outline" size="sm" className="text-xs font-medium h-8">Sign In</Button>
                </div>

                <Tabs
                    value={state.platform}
                    onValueChange={(val) => setPlatform(val as CommentPlatform)}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="instagram"><Instagram className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="tiktok">
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                        </TabsTrigger>
                        <TabsTrigger value="twitter"><Twitter className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="youtube"><Youtube className="w-4 h-4" /></TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <Accordion type="single" collapsible defaultValue="comments" className="w-full">

                    {/* PEOPLE SECTION */}
                    <AccordionItem value="people">
                        <AccordionTrigger>People</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-4">
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

                                        <div className="flex-1 space-y-2">
                                            <Input
                                                value={profile.name}
                                                onChange={(e) => updateProfile(profile.id, { name: e.target.value })}
                                                placeholder="Display Name"
                                                className="h-8 text-sm"
                                            />
                                            <div className="flex gap-2">
                                                <Input
                                                    value={profile.handle}
                                                    onChange={(e) => updateProfile(profile.id, { handle: e.target.value })}
                                                    placeholder="Handle"
                                                    className="h-8 text-sm"
                                                />
                                                <Switch
                                                    checked={profile.verified}
                                                    onCheckedChange={(c) => updateProfile(profile.id, { verified: c })}
                                                />
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
                            <Button variant="outline" className="w-full" onClick={addProfile}>
                                <Plus className="w-4 h-4 mr-2" /> Add Person
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    {/* COMMENTS SECTION */}
                    <AccordionItem value="comments">
                        <AccordionTrigger>Comments</AccordionTrigger>
                        <AccordionContent className="pt-2">
                            {state.comments.map(comment => renderCommentEditor(comment))}
                            <Button className="w-full mt-4" onClick={() => addComment()}>
                                <Plus className="w-4 h-4 mr-2" /> Add New Comment
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    {/* APPEARANCE SECTION */}
                    <AccordionItem value="appearance">
                        <AccordionTrigger>Appearance</AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Dark Mode</Label>
                                <Switch
                                    checked={state.config.theme === 'dark'}
                                    onCheckedChange={(checked) => setConfig({ theme: checked ? 'dark' : 'light' })}
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
