import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EMAIL_TEMPLATES } from '@/lib/templates';
import { AppearanceSettings } from '@/types/chat';
import { toast } from 'sonner';

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
        isTyping: false,
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
        const scenarios = [
            {
                name: "Jeffrey Epstein Files",
                subject: "URGENT: Regarding the travel logs and island guest list",
                attachment: "travel_logs_2008.pdf",
                participants: [
                    { id: 'p1', name: "Jeffrey Epstein", email: "je@island.com", redactName: false, redactEmail: false },
                    { id: 'p2', name: "Ghislaine Maxwell", email: "gm@london.net", redactName: false, redactEmail: false }
                ],
                emails: [
                    {
                        id: uuidv4(),
                        fromParticipantId: 'p1',
                        dateTime: 'May 14, 2008 at 11:42 PM',
                        body: "Make sure those files are **encrypted** before the flight tomorrow. We can't afford any leaks regarding the **V.I.P. list**. Check the **Black Book** again for any missing entries."
                    }
                ]
            },
            {
                name: "FBI Security Alert",
                subject: "CRITICAL: Potential unauthorized access to federal systems",
                attachment: "incident_report_FBI.docx",
                participants: [
                    { id: 'p1', name: "FBI Cyber Division", email: "security@fbi.gov", redactName: false, redactEmail: false },
                    { id: 'p2', name: "Agent Mulder", email: "f.mulder@fbi.gov", redactName: false, redactEmail: false }
                ],
                emails: [
                    {
                        id: uuidv4(),
                        fromParticipantId: 'p1',
                        dateTime: 'Just now',
                        body: "Agent, we've detected a breach in the **classified server**. Immediate action is required to secure the **evidence files**. Do not discuss this over unsecured lines."
                    }
                ]
            },
            {
                name: "Corporate Resignation",
                subject: "Resignation - Rohan Gupta",
                attachment: "",
                participants: [
                    { id: 'p1', name: "Rohan Gupta", email: "rohan.g@veily.app", redactName: false, redactEmail: false },
                    { id: 'p2', name: "HR Department", email: "hr@veily.app", redactName: false, redactEmail: false }
                ],
                emails: [
                    {
                        id: uuidv4(),
                        fromParticipantId: 'p1',
                        dateTime: 'Today, 10:00 AM',
                        body: "Hi Team,\n\nPlease accept this email as formal notification that I am resigning from my position as Senior Developer. My last day will be October 15th. Thank you for the opportunities during my time here."
                    }
                ]
            },
            {
                name: "Job Offer",
                subject: "Offer Letter: Software Engineer - Veily",
                attachment: "Offer_Letter_Veily.pdf",
                participants: [
                    { id: 'p1', name: "Sarah Jenkins", email: "s.jenkins@veily.app", redactName: false, redactEmail: false },
                    { id: 'p2', name: "Ananya Singh", email: "ananya.s@gmail.com", redactName: false, redactEmail: false }
                ],
                emails: [
                    {
                        id: uuidv4(),
                        fromParticipantId: 'p1',
                        dateTime: 'Yesterday',
                        body: "Hi Ananya,\n\nWe were incredibly impressed with your technical rounds! Included is your official offer letter for the Software Engineer position. We'd love to have you join the team."
                    }
                ]
            }
        ];

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        setState(prev => ({
            ...prev,
            subject: scenario.subject,
            attachment: scenario.attachment,
            participants: scenario.participants.map(p => ({ ...p, id: uuidv4() })), 
            emails: scenario.emails.map(e => ({ ...e, id: uuidv4() })),
            provider: 'generic',
            appearance: {
                ...prev.appearance,
                darkMode: Math.random() > 0.5
            }
        }));
        
        toast.success(`Randomized: ${scenario.name}`);
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
