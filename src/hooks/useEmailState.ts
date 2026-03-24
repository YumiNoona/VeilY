import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EMAIL_TEMPLATES } from '@/lib/templates';
import { AppearanceSettings } from '@/types/chat';

export interface EmailParticipant {
    id: string;
    name: string;
    email: string;
    redactName: boolean;
    redactEmail: boolean;
}

export interface EmailEntry {
    id: string;
    fromParticipantId: string;
    dateTime: string;
    body: string;
}

export interface EmailState {
    subject: string;
    attachment: string;
    participants: EmailParticipant[];
    emails: EmailEntry[];
    provider: 'generic' | 'gmail' | 'outlook';
    appearance: AppearanceSettings;
}

const INITIAL_PARTICIPANTS: EmailParticipant[] = [
    {
        id: 'p1',
        name: 'Effrey Jepstein',
        email: 'jeeholiday@gmail.com',
        redactName: false,
        redactEmail: false,
    },
    {
        id: 'p2',
        name: 'Gill Bates',
        email: 'gillbates@microhard.com',
        redactName: false,
        redactEmail: false,
    },
];

const INITIAL_EMAILS: EmailEntry[] = [
    {
        id: uuidv4(),
        fromParticipantId: 'p1',
        dateTime: '2024-08-15T20:02',
        body: 'I wanted to follow up on our previous **discussion** regarding the **upcoming event**.\n\nPlease let me know your availability for next week. We should also discuss the **guest list** and **arrangements**.\n\nUse **double asterisks** around text to redact it.',
    },
];

const INITIAL_STATE: EmailState = {
    subject: 'Re: Follow-up on Recent Discussion',
    attachment: 'file.pdf',
    participants: INITIAL_PARTICIPANTS,
    emails: INITIAL_EMAILS,
    provider: 'generic',
    appearance: {
        darkMode: false,
        showTimestamps: true,
        showStatus: true,
        use24HourFormat: false,
        showDeviceStatusBar: true,
        showDeviceFrame: true,
        statusBarTime: '9:41',
        batteryLevel: 100,
        transparentBackground: false,
    },
};

export const useEmailState = () => {
    const [state, setState] = useState<EmailState>(INITIAL_STATE);

    const setSubject = (subject: string) =>
        setState(prev => ({ ...prev, subject }));

    const setAttachment = (attachment: string) =>
        setState(prev => ({ ...prev, attachment }));

    const addParticipant = () => {
        const newP: EmailParticipant = {
            id: uuidv4(),
            name: 'New Person',
            email: 'newperson@example.com',
            redactName: false,
            redactEmail: false,
        };
        setState(prev => ({ ...prev, participants: [...prev.participants, newP] }));
    };

    const updateParticipant = (id: string, updates: Partial<EmailParticipant>) => {
        setState(prev => ({
            ...prev,
            participants: prev.participants.map(p => p.id === id ? { ...p, ...updates } : p),
        }));
    };

    const removeParticipant = (id: string) => {
        setState(prev => ({
            ...prev,
            participants: prev.participants.filter(p => p.id !== id),
            emails: prev.emails.filter(e => e.fromParticipantId !== id),
        }));
    };

    const addEmail = () => {
        const newEmail: EmailEntry = {
            id: uuidv4(),
            fromParticipantId: state.participants[0]?.id || '',
            dateTime: new Date().toISOString().slice(0, 16),
            body: 'Write your email body here...',
        };
        setState(prev => ({ ...prev, emails: [...prev.emails, newEmail] }));
    };

    const updateEmail = (id: string, updates: Partial<EmailEntry>) => {
        setState(prev => ({
            ...prev,
            emails: prev.emails.map(e => e.id === id ? { ...e, ...updates } : e),
        }));
    };

    const removeEmail = (id: string) => {
        setState(prev => ({ ...prev, emails: prev.emails.filter(e => e.id !== id) }));
    };

    const handleReset = () => setState(INITIAL_STATE);

    const loadTemplate = (template: Partial<EmailState>) => {
        setState(prev => ({
            ...prev,
            ...template,
            participants: template.participants?.map(p => ({ ...p, id: uuidv4() })) || prev.participants,
            emails: template.emails?.map(e => ({ ...e, id: uuidv4() })) || prev.emails,
        }));
    };

    const randomizeState = () => {
        const templates = Object.values(EMAIL_TEMPLATES);
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        loadTemplate(randomTemplate);
    };

    const setProvider = (provider: EmailState['provider']) =>
        setState(prev => ({ ...prev, provider }));

    const setAppearance = (updates: Partial<EmailState['appearance']>) => {
        setState(prev => ({ ...prev, appearance: { ...prev.appearance, ...updates } }));
    };

    return {
        state,
        setSubject,
        setAttachment,
        setProvider,
        addParticipant,
        updateParticipant,
        removeParticipant,
        addEmail,
        updateEmail,
        removeEmail,
        handleReset,
        loadTemplate,
        randomizeState,
        setAppearance,
    };
};
