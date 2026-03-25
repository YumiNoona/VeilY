import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Trash2, ChevronDown, ChevronRight, RotateCcw, Wand2, FileText, Users, MessageCircle, Mail, Crown, Sparkles } from 'lucide-react';
import { useEmailState } from '@/hooks/useEmailState';
import { SmartFillModal } from './modals/SmartFillModal';
import { ParsedChat } from '@/lib/parsers';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppearanceSection } from './sidebar/sections/AppearanceSection';
import { cn } from '@/lib/utils';
import { EMAIL_TEMPLATES } from '@/lib/templates';
import { AppearanceSettings } from '@/types/chat';

type EmailState = ReturnType<typeof useEmailState>['state'];

interface EmailSidebarProps {
    state: EmailState;
    setSubject: (v: string) => void;
    setAttachment: (v: string) => void;
    setProvider: (v: EmailState['provider']) => void;
    addParticipant: () => void;
    updateParticipant: (id: string, updates: any) => void;
    removeParticipant: (id: string) => void;
    addEmail: () => void;
    updateEmail: (id: string, updates: any) => void;
    removeEmail: (id: string) => void;
    handleReset: () => void;
    onTemplateLoad?: (template: any) => void;
    onRandomize?: () => void;
    setAppearance: (updates: Partial<AppearanceSettings>) => void;
}

export const EmailSidebar: React.FC<EmailSidebarProps> = ({
    state, setSubject, setAttachment, setProvider,
    addParticipant, updateParticipant, removeParticipant,
    addEmail, updateEmail, removeEmail,
    handleReset, onTemplateLoad, onRandomize, setAppearance
}) => {
    const { plan, setUpgradeModalOpen } = useAuth();
    const [collapsedEmails, setCollapsedEmails] = React.useState<Record<string, boolean>>({});
    const [isSmartFillOpen, setIsSmartFillOpen] = React.useState(false);

    const handleSmartFillClick = () => {
        if (plan === 'free') {
            setUpgradeModalOpen(true);
            return;
        }
        setIsSmartFillOpen(true);
    };

    const handleSmartFillSuccess = (data: ParsedChat) => {
        // Map AI generated participants
        if (data.participants && data.participants.length > 0) {
            data.participants.forEach((p, idx) => {
                const existing = state.participants.find(part => part.name === p.name);
                if (!existing) {
                    addParticipant();
                    // Note: Update logic would go here if we could track new participant IDs
                }
            });
        }

        // Map AI generated messages to email body
        if (data.messages && data.messages.length > 0) {
            data.messages.forEach((msg, idx) => {
                if (idx === 0 && state.emails[0]) {
                    updateEmail(state.emails[0].id, {
                        content: msg.text,
                        timestamp: 'Just now'
                    });
                } else {
                    addEmail();
                }
            });
        }
    };

    const handleProviderChange = (val: EmailState['provider']) => {
        if (val === 'outlook' && plan === 'free') {
            setUpgradeModalOpen(true);
        } else {
            setProvider(val);
        }
    };

    const toggleEmailCollapse = (id: string) => {
        setCollapsedEmails(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const expandAllEmails = () => setCollapsedEmails({});
    const collapseAllEmails = () => {
        const allIds = state.emails.reduce((acc, email) => ({ ...acc, [email.id]: true }), {});
        setCollapsedEmails(allIds);
    };

    return (
        <aside className="w-full lg:w-[450px] bg-sidebar-bg border-r border-sidebar-border h-full flex flex-col overflow-hidden">
            {/* App selection Header block */}
            <div className="flex items-center justify-between px-3 pt-5 pb-2 border-b border-sidebar-border shrink-0 min-h-[64px]">
                <div className="flex items-center gap-1.5 flex-1">
                    <Select onValueChange={(val) => {
                        if (onTemplateLoad) {
                            const template = EMAIL_TEMPLATES[val as keyof typeof EMAIL_TEMPLATES];
                            if (template) onTemplateLoad(template);
                        }
                    }}>
                        <SelectTrigger className="w-[140px] h-8 text-xs font-medium">
                            <SelectValue placeholder="Templates" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Business</SelectLabel>
                                <SelectItem value="businessMeeting">Meeting Strategy</SelectItem>
                                <SelectItem value="projectKickoff">Project Kickoff</SelectItem>
                                <SelectItem value="invoiceReminder">Invoice Reminder</SelectItem>
                                <SelectItem value="formalGreeting">Formal Intro</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel>Newsletters</SelectLabel>
                                <SelectItem value="newsletterBoost">Product Update</SelectItem>
                                <SelectItem value="supportWelcome">Support Welcome</SelectItem>
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

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        onClick={handleSmartFillClick}
                        title="AI Smart Fill (Premium)"
                    >
                        <Sparkles className="w-4 h-4 fill-amber-500/20" />
                    </Button>
                </div>
            </div>

            <SmartFillModal
                isOpen={isSmartFillOpen}
                onClose={() => setIsSmartFillOpen(false)}
                onSuccess={handleSmartFillSuccess}
                platform="email_thread"
            />

            <div className="px-3 py-2.5 border-b border-sidebar-border shrink-0 flex items-center justify-center min-h-[56px]">
                <Tabs
                    value={state.provider}
                    onValueChange={(val) => handleProviderChange(val as any)}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-3 h-10">
                        <TabsTrigger value="generic" className="relative">
                            <Mail className="w-4 h-4" />
                        </TabsTrigger>
                        <TabsTrigger value="gmail" className="relative">
                            <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#EA4335" d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.39l-9 6.58-9-6.58V21H1.5C.65 21 0 20.35 0 19.5v-15c0-1.21 1.36-1.93 2.36-1.24L12 10.32l9.64-7.06c1-.69 2.36.03 2.36 1.24z"/></svg>
                        </TabsTrigger>
                        <TabsTrigger value="outlook" className="relative">
                            <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#0078D4" d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM2 6h20v.5L12 13 2 6.5V6zm0 12V8.5L12 15l10-6.5V18H2z"/></svg>
                            {plan === 'free' && <Crown className="w-2.5 h-2.5 text-amber-500 absolute top-0.5 right-0.5" />}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <Accordion type="multiple" defaultValue={["subject", "participants", "thread", "appearance"]} className="w-full">
                    
                    {/* SUBJECT & ATTACHMENT */}
                    <AccordionItem value="subject" className="border rounded-xl bg-card shadow-sm overflow-hidden">
                        <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="font-semibold text-sm">Subject & Attachment</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 px-3 pb-3">
                            <div className="grid gap-2 mt-1">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Subject</Label>
                                <Input
                                    value={state.subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Email subject..."
                                    className="h-10 text-base font-medium bg-background border-zinc-200"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Attachment</Label>
                                <Input
                                    value={state.attachment}
                                    onChange={e => setAttachment(e.target.value)}
                                    placeholder="file.pdf"
                                    className="h-10 text-base font-medium bg-background border-zinc-200"
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* PARTICIPANTS */}
                    <AccordionItem value="participants" className="border rounded-xl bg-card shadow-sm overflow-hidden mt-3">
                        <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Users className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="font-semibold text-sm">Participants ({state.participants.length})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 px-3 pb-3">
                            <div className="flex justify-end mb-2">
                                <Button size="sm" variant="outline" className="text-xs h-8" onClick={addParticipant}>
                                    + Add Participant
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {state.participants.map((p, i) => (
                                    <div key={p.id} className="p-3 border rounded-lg bg-card space-y-3 relative">
                                        <div className="flex items-center justify-between">
                                            <Label className="font-bold">Participant {i + 1}</Label>
                                            {state.participants.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                                                    onClick={() => removeParticipant(p.id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid gap-3">
                                            <Input
                                                value={p.name}
                                                onChange={e => updateParticipant(p.id, { name: e.target.value })}
                                                placeholder="Full Name"
                                                className="h-10 text-base font-medium bg-background border-zinc-200"
                                            />
                                            <Input
                                                value={p.email}
                                                onChange={e => updateParticipant(p.id, { email: e.target.value })}
                                                placeholder="email@example.com"
                                                className="h-10 text-base font-medium bg-background border-zinc-200"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    id={`redact-name-${p.id}`}
                                                    checked={p.redactName}
                                                    onCheckedChange={(c) => updateParticipant(p.id, { redactName: c })}
                                                />
                                                <Label htmlFor={`redact-name-${p.id}`} className={p.redactName ? 'text-destructive' : 'text-muted-foreground'}>Redact Name</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    id={`redact-email-${p.id}`}
                                                    checked={p.redactEmail}
                                                    onCheckedChange={(c) => updateParticipant(p.id, { redactEmail: c })}
                                                />
                                                <Label htmlFor={`redact-email-${p.id}`} className={p.redactEmail ? 'text-destructive' : 'text-muted-foreground'}>Redact Email</Label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* EMAIL THREAD */}
                    <AccordionItem value="thread" className="border rounded-xl bg-card shadow-sm overflow-hidden mt-3">
                        <AccordionTrigger className="hover:no-underline px-3 py-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <MessageCircle className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="font-semibold text-sm">Email Thread</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 px-3 pb-3">
                            <div className="flex items-center justify-between mb-2">
                                <Button size="sm" variant="outline" className="text-xs h-8" onClick={addEmail}>
                                    + Add Email
                                </Button>
                                {state.emails.length > 0 && (
                                    <div className="flex items-center gap-1.5">
                                        <Button size="sm" variant="ghost" className="h-8 text-[11px] px-2" onClick={expandAllEmails}>Expand</Button>
                                        <Button size="sm" variant="secondary" className="h-8 text-[11px] px-2" onClick={collapseAllEmails}>Collapse</Button>
                                    </div>
                                )}
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-4">
                                Use <strong>**double asterisks**</strong> around text to redact it (e.g., **secret info**)
                            </p>

                            <div className="space-y-3">
                                {state.emails.map((email, idx) => {
                                    const isCollapsed = collapsedEmails[email.id];
                                    const sender = state.participants.find(p => p.id === email.fromParticipantId);

                                    return (
                                        <Card key={email.id} className="p-3 bg-muted/30 relative">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 z-10"
                                                onClick={() => removeEmail(email.id)}
                                            >
                                                <Trash2 className="h-3 w-3"/>
                                            </Button>

                                            <div 
                                                className="mb-3 pr-8 flex items-center cursor-pointer select-none"
                                                onClick={() => toggleEmailCollapse(email.id)}
                                            >
                                                {isCollapsed ? <ChevronRight className="w-4 h-4 mr-1 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 mr-1 text-muted-foreground" />}
                                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">
                                                    Email {idx + 1}
                                                </span>
                                                {isCollapsed && (
                                                    <span className="text-xs font-medium text-muted-foreground truncate max-w-[120px]">
                                                        {sender?.name || 'Unknown'}
                                                    </span>
                                                )}
                                            </div>

                                            {!isCollapsed && (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <div className="grid gap-2">
                                                        <Label>From</Label>
                                                        <Select
                                                            value={email.fromParticipantId}
                                                            onValueChange={(val) => updateEmail(email.id, { fromParticipantId: val })}
                                                        >
                                                            <SelectTrigger className="w-full text-base font-medium h-10 bg-background border-zinc-200">
                                                                <SelectValue placeholder="Select sender..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {state.participants.map(p => (
                                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label>Date & Time</Label>
                                                        <Input
                                                            type="datetime-local"
                                                            value={email.dateTime}
                                                            onChange={e => updateEmail(email.id, { dateTime: e.target.value })}
                                                            className="h-10 text-base font-medium bg-background border-zinc-200"
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label>Body</Label>
                                                        <Textarea
                                                            value={email.body}
                                                            onChange={e => updateEmail(email.id, { body: e.target.value })}
                                                            placeholder="Email body... Use **text** to redact."
                                                            className="min-h-[120px] font-mono whitespace-pre-wrap text-sm border-zinc-200 leading-relaxed"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <div className="mt-3">
                        <AppearanceSection 
                            appearance={state.appearance}
                            onAppearanceChange={setAppearance}
                        />
                    </div>

                </Accordion>
            </div>
        </aside>
    );
};

