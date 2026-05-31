import { useState, useCallback, useEffect } from "react";
import { ChatState, Message, Person, Platform, ChatType, AppearanceSettings } from "@/types/chat";
import { ParsedChat } from "@/lib/parsers";
import { getAvatarUrl } from '@/lib/avatar-utils';
import { toast } from "sonner";
import { aiScenarios, globalScenarios, indianScenarios } from './scenarios';

const initialMessages: Message[] = [
    { id: '1', text: "yo have you checked out Veily? its this dope mockup tool for creating chat screenshots that look super clean", senderId: 'user', timestamp: new Date(), isOwn: false },
    { id: '2', text: "wait really? like those screenshots people use in design portfolios?", senderId: 'friend', timestamp: new Date(), isOwn: true },
    { id: '3', text: "yeah exactly! you can set up WhatsApp, iMessage, Discord, literally any platform. they have templates and everything, all completely free", senderId: 'user', timestamp: new Date(), isOwn: false },
    { id: '4', text: "no way i need this for my UX case studies. is it actually free?", senderId: 'friend', timestamp: new Date(), isOwn: true },
    { id: '5', text: "100% free, every feature unlocked. oh and check out vexo.venusapp.in too they have some really cool projects", senderId: 'user', timestamp: new Date(), isOwn: false },
    { id: '6', text: "bro you just made my day, building my portfolio mockups tonight 🙌", senderId: 'friend', timestamp: new Date(), isOwn: true },
];

const initialPeople: Person[] = [
    { id: 'friend', name: 'You', isOnline: true },
    { id: 'user', name: 'Alex Rivera', isOnline: true, avatar: getAvatarUrl('Alex Rivera') },
];

const initialAppearance: AppearanceSettings = {
    darkMode: false,
    showTimestamps: true,
    showStatus: true,
    use24HourFormat: false,
    showDeviceStatusBar: true,
    showDeviceFrame: false,
    statusBarTime: '9:41',
    batteryLevel: 100,
    statusText: 'last seen today at 12:00 PM',
    transparentBackground: false,
    isTyping: false,
};

const CHAT_STATE_STORAGE_KEY = 'chatState';

const initialChatState: ChatState = {
    platform: 'whatsapp',
    chatType: 'direct',
    people: initialPeople,
    messages: initialMessages,
    appearance: initialAppearance,
    aiModel: 'claude-4.8-opus',
};

const loadStateFromLocalStorage = (storageKey: string): ChatState => {
    try {
        const serializedState = localStorage.getItem(storageKey);
        if (serializedState === null) {
            return initialChatState;
        }
        const storedState: ChatState = JSON.parse(serializedState);

        // Ensure timestamps are Date objects
        const messagesWithDates = storedState.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        }));

        return {
            ...initialChatState, // Use initial state as a base to pick up new fields
            ...storedState,
            messages: messagesWithDates,
        };
    } catch (error) {
        console.error("Error loading state from localStorage:", error);
        return initialChatState;
    }
};

export const useChatState = (storageKey: string = 'chatState') => {
    const [chatState, setChatState] = useState<ChatState>(() => loadStateFromLocalStorage(storageKey));

    useEffect(() => {
        try {
            const serializedState = JSON.stringify(chatState);
            localStorage.setItem(storageKey, serializedState);
        } catch (error) {
            console.error("Error saving state to localStorage:", error);
        }
    }, [chatState, storageKey]);

    const handlePlatformChange = useCallback((platform: Platform) => {
        setChatState(prev => ({ ...prev, platform }));
        toast.success(`Switched to ${platform}`);
    }, []);

    const handleChatTypeChange = useCallback((chatType: ChatType) => {
        setChatState(prev => ({ ...prev, chatType }));
    }, []);

    const handleAddMessage = useCallback((text: string, isOwn: boolean, image?: string, isVoiceNote?: boolean, voiceDuration?: string) => {
        const newMessage: Message = {
            id: crypto.randomUUID(),
            text,
            senderId: isOwn ? 'friend' : 'user',
            timestamp: new Date(),
            isOwn,
            image,
            isVoiceNote,
            voiceDuration,
        };
        setChatState(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
    }, []);

    const handleRemoveMessage = useCallback((id: string) => {
        setChatState(prev => ({ ...prev, messages: prev.messages.filter(m => m.id !== id) }));
    }, []);

    const handleUpdatePerson = useCallback((updatedPerson: Person) => {
        setChatState(prev => ({
            ...prev,
            people: prev.people.map(p => p.id === updatedPerson.id ? updatedPerson : p),
        }));
    }, []);

    const handleAddPerson = useCallback(() => {
        setChatState(prev => {
            const newPerson: Person = {
                id: crypto.randomUUID(),
                name: `Person ${prev.people.length + 1}`, // Use prev.people.length
                isOnline: true,
                avatar: undefined
            };
            return { ...prev, people: [...prev.people, newPerson] };
        });
    }, []); // No dependencies needed as prev state is used

    const handleRemovePerson = useCallback((id: string) => {
        setChatState(prev => {
            // Correct logic: Check if we have more than 2 people BEFORE removing
            if (prev.people.length <= 2) {
                toast.error("Cannot remove more people. At least two people are required.");
                return prev;
            }
            return { ...prev, people: prev.people.filter(p => p.id !== id) };
        });
    }, []); // No dependencies needed as prev state is used

    const handleUpdateMessage = useCallback((id: string, newText: string, newTimestamp?: Date, newImage?: string, isOwn?: boolean, isVoiceNote?: boolean, voiceDuration?: string) => {
        setChatState(prev => ({
            ...prev,
            messages: prev.messages.map(m => m.id === id ? {
                ...m,
                text: newText,
                ...(newTimestamp && { timestamp: newTimestamp }),
                ...(newImage !== undefined && { image: newImage }),
                ...(isOwn !== undefined && { isOwn }),
                ...(isVoiceNote !== undefined && { isVoiceNote }),
                ...(voiceDuration !== undefined && { voiceDuration }),
            } : m),
        }));
    }, []);

    const handleAppearanceChange = useCallback((appearance: AppearanceSettings) => {
        setChatState(prev => ({ ...prev, appearance }));
    }, []);

    const handleAiModelChange = useCallback((aiModel: string) => {
        setChatState(prev => ({ ...prev, aiModel }));
    }, []);

    const handleReorderMessages = useCallback((newMessages: Message[]) => {
        setChatState(prev => ({ ...prev, messages: newMessages }));
    }, []);

    const globalReplaceSenderName = useCallback((oldName: string, newName: string) => {
        setChatState(prev => ({
            ...prev,
            people: prev.people.map(p => p.name === oldName ? { ...p, name: newName } : p)
        }));
    }, []);

    const handleResetState = useCallback(() => {
        setChatState(initialChatState);
        localStorage.removeItem(storageKey);
        toast.success("Chat state reset to defaults.");
    }, [storageKey]);

    const handleLoadTemplate = useCallback((template: ChatState) => {
        // Revive timestamps
        const messagesWithDates = template.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        }));
        setChatState({ ...template, messages: messagesWithDates });
        toast.success("Template loaded successfully.");
    }, []);

    const handleBulkDataImport = useCallback((data: ParsedChat) => {
        setChatState(prev => ({
            ...prev,
            people: data.participants.length > 0 ? data.participants : prev.people,
            messages: data.messages,
        }));
    }, []);

    const handleSmartFill = useCallback((data: ParsedChat) => {
        setChatState(prev => ({
            ...prev,
            people: data.participants.length > 0 ? data.participants : prev.people,
            messages: data.messages,
        }));
        toast.success("AI Conversation generated!");
    }, []);

    const randomizeState = useCallback(() => {
        const isAIPlatform = ['chatgpt', 'claude', 'gemini', 'grok'].includes(chatState.platform);
        
        const indianNames = ["Rohan", "Arjun", "Priya", "Kavya", "Rahul", "Neha", "Aarav", "Ananya", "Ishaan", "Diya"];
        const westernNames = ["Jake", "Sarah", "Tyler", "Zoe", "Marcus", "Emma", "Liam", "Olivia", "Ethan", "Sophia"];
        
        if (isAIPlatform) {
            const scenario = aiScenarios[Math.floor(Math.random() * aiScenarios.length)];
            const senderName = chatState.platform === 'chatgpt' ? 'ChatGPT' : chatState.platform === 'claude' ? 'Claude' : chatState.platform === 'gemini' ? 'Gemini' : 'Grok';

            const newMessages: Message[] = scenario.messages.map((m, i) => ({
                id: crypto.randomUUID(),
                text: m.text,
                senderId: m.isOwn ? 'friend' : 'user',
                timestamp: new Date(Date.now() - (scenario.messages.length - i) * 120000),
                isOwn: m.isOwn
            }));

            const newPeople: Person[] = [
                { id: 'friend', name: 'You', isOnline: true },
                { id: 'user', name: senderName, isOnline: true }
            ];

            setChatState(prev => ({
                ...prev,
                platform: chatState.platform,
                people: newPeople,
                messages: newMessages,
                appearance: {
                    ...prev.appearance,
                    darkMode: Math.random() > 0.5,
                }
            }));

            toast.success("Randomized AI chat");
        } else {
            const isIndian = Math.random() > 0.5;
            const scenarios = isIndian ? indianScenarios : globalScenarios;
            const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            const platform = ['whatsapp', 'imessage', 'discord', 'instagram'][Math.floor(Math.random() * 4)] as Platform;
            
            const senderName = isIndian ? indianNames[Math.floor(Math.random() * indianNames.length)] : westernNames[Math.floor(Math.random() * westernNames.length)];

            const newMessages: Message[] = scenario.messages.map((m, i) => ({
                id: crypto.randomUUID(),
                text: m.text,
                senderId: m.isOwn ? 'friend' : 'user',
                timestamp: new Date(Date.now() - (scenario.messages.length - i) * 120000),
                isOwn: m.isOwn
            }));

            const newPeople: Person[] = [
                { id: 'friend', name: 'You', isOnline: true },
                { id: 'user', name: senderName, isOnline: Math.random() > 0.3, avatar: getAvatarUrl(senderName) }
            ];

            setChatState(prev => ({
                ...prev,
                platform,
                people: newPeople,
                messages: newMessages,
                appearance: {
                    ...prev.appearance,
                    darkMode: Math.random() > 0.5,
                    use24HourFormat: isIndian
                }
            }));

            toast.success(`Randomized: ${scenario.name}`);
        }
    }, [chatState.platform]);

    return {
        chatState,
        handlePlatformChange,
        handleChatTypeChange,
        handleAddMessage,
        handleRemoveMessage,
        handleUpdatePerson,
        handleAddPerson,
        handleRemovePerson,
        handleUpdateMessage,
        handleAppearanceChange,
        handleAiModelChange,
        handleReorderMessages,
        globalReplaceSenderName,
        handleResetState,
        handleLoadTemplate,
        handleBulkDataImport,
        handleSmartFill,
        randomizeState,
    };
};
