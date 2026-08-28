import { useState, useCallback, useEffect } from "react";
import { ChatState, Message, Person, Platform, ChatType, AppearanceSettings } from "@/types/chat";
import { ParsedChat } from "@/lib/parsers";
import { getAvatarUrl } from '@/lib/avatar-utils';
import { toast } from "sonner";
import { aiScenarios } from './scenarios';
import { globalScenarios, indianScenarios } from './scenarios-natural';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

const getConversationTimestamp = (index: number, total: number, now = Date.now()): Date => {
    const olderExchangeEnd = Math.min(4, Math.max(2, total - 7));
    const recentExchangeEnd = olderExchangeEnd + Math.ceil((total - olderExchangeEnd) * 0.4);

    if (index < olderExchangeEnd) {
        return new Date(now - (7 * DAY) + (index * 3 * MINUTE));
    }

    if (index < recentExchangeEnd) {
        return new Date(now - (2 * DAY) + ((index - olderExchangeEnd) * 4 * MINUTE));
    }

    return new Date(now - ((total - index) * 2 * MINUTE));
};

const initialMessages: Message[] = [
    { id: '1', text: "Kal wali client call ka recording mila?", senderId: 'user', timestamp: getConversationTimestamp(0, 6), isOwn: false },
    { id: '2', text: "Haan, Drive folder mein daal diya. 18 minute tak unka screen share blank tha.", senderId: 'friend', timestamp: getConversationTimestamp(1, 6), isOwn: true },
    { id: '3', text: "Classic. Main notes clean karke bhej deta hoon.", senderId: 'user', timestamp: getConversationTimestamp(2, 6), isOwn: false },
    { id: '4', text: "Please. Point 6 ka actual decision abhi bhi unclear hai.", senderId: 'friend', timestamp: getConversationTimestamp(3, 6), isOwn: true },
    { id: '5', text: "Deck update kar diya. Slide 9 ek baar check kar lena.", senderId: 'user', timestamp: getConversationTimestamp(4, 6), isOwn: false },
    { id: '6', text: "Dekh raha hoon. Numbers sahi hain, title thoda chhota lag raha hai.", senderId: 'friend', timestamp: getConversationTimestamp(5, 6), isOwn: true },
];

const initialPeople: Person[] = [
    { id: 'friend', name: 'You', isOnline: true },
    { id: 'user', name: 'Rohan Mehta', isOnline: true, avatar: getAvatarUrl('Rohan Mehta') },
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
    chatStyle: 'mixed',
};

const initialChatState: ChatState = {
    platform: 'whatsapp',
    chatType: 'direct',
    people: initialPeople,
    messages: initialMessages,
    appearance: initialAppearance,
    aiModel: 'claude-4.8-opus',
};

const loadStateFromLocalStorage = (storageKey: string, fallbackState: ChatState): ChatState => {
    try {
        const serializedState = localStorage.getItem(storageKey);
        if (serializedState === null) {
            return fallbackState;
        }
        let storedState: ChatState = JSON.parse(serializedState);

        // Migrate the old ambiguous "Family group" random scenario into a clearly
        // identified direct conversation instead of preserving it indefinitely.
        if (storedState.messages?.some(message => message.text.includes('mummy ne kheer banayi hai'))) {
            const dinnerScenario = indianScenarios.find(scenario => scenario.name === 'Dinner at home');
            if (dinnerScenario) {
                storedState = {
                    ...storedState,
                    chatType: 'direct',
                    people: [
                        { id: 'friend', name: 'You', isOnline: true },
                        { id: 'user', name: 'Mom', isOnline: true, avatar: getAvatarUrl('Mom') },
                    ],
                    messages: dinnerScenario.messages.map((message, index) => ({
                        id: `dinner-${index + 1}`,
                        text: message.text,
                        senderId: message.isOwn ? 'friend' : 'user',
                        timestamp: getConversationTimestamp(index, dinnerScenario.messages.length),
                        isOwn: message.isOwn,
                    })),
                };
            }
        }

        // Ensure timestamps are Date objects
        const messagesWithDates = storedState.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        }));

        return {
            ...fallbackState, // Use the requested editor defaults as a base to pick up new fields
            ...storedState,
            messages: messagesWithDates,
        };
    } catch (error) {
        console.error("Error loading state from localStorage:", error);
        return fallbackState;
    }
};

export const useChatState = (storageKey: string = 'chatState', fallbackState: ChatState = initialChatState) => {
    const [chatState, setChatState] = useState<ChatState>(() => loadStateFromLocalStorage(storageKey, fallbackState));

    useEffect(() => {
        try {
            const serializedState = JSON.stringify(chatState);
            localStorage.setItem(storageKey, serializedState);
        } catch (error) {
            console.error("Error saving state to localStorage:", error);
        }
    }, [chatState, storageKey]);

    const handlePlatformChange = useCallback((platform: Platform) => {
        setChatState(prev => prev.platform === platform ? prev : ({ ...prev, platform }));
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
            people: prev.people.map(person => {
                if (person.id !== updatedPerson.id) return person;

                const nameChanged = person.name !== updatedPerson.name;
                const usedGeneratedAvatar = !person.avatar || person.avatar === getAvatarUrl(person.name);
                return {
                    ...updatedPerson,
                    avatar: nameChanged && usedGeneratedAvatar
                        ? getAvatarUrl(updatedPerson.name)
                        : updatedPerson.avatar,
                };
            }),
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
        setChatState(fallbackState);
        localStorage.removeItem(storageKey);
        toast.success("Chat state reset to defaults.");
    }, [fallbackState, storageKey]);

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
        
        const indianNames = [
            "Rohan Mehta", "Arjun Kapoor", "Priya Sharma", "Kavya Nair", "Rahul Verma",
            "Neha Joshi", "Aarav Patel", "Ananya Rao", "Ishaan Malhotra", "Diya Shah",
            "Meera Iyer", "Kabir Singh", "Tara Desai", "Vikram Sethi", "Saanvi Gupta",
            "Aditya Bose", "Leena Menon", "Nikhil Jain", "Riya Kulkarni", "Dev Khanna",
        ];
        const westernNames = [
            "Jake Miller", "Sarah Collins", "Tyler Brooks", "Zoe Bennett", "Marcus Reed",
            "Emma Wilson", "Liam Carter", "Olivia Parker", "Ethan Hayes", "Sophia Turner",
            "Maya Chen", "Daniel Kim", "Sofia Martinez", "Noah Williams", "Ava Thompson",
            "Lucas Martin", "Chloe Anderson", "Elena Rossi", "Mia Johnson", "Theo Morgan",
        ];
        
        if (isAIPlatform) {
            const scenario = aiScenarios[Math.floor(Math.random() * aiScenarios.length)];
            const senderName = chatState.platform === 'chatgpt' ? 'ChatGPT' : chatState.platform === 'claude' ? 'Claude' : chatState.platform === 'gemini' ? 'Gemini' : 'Grok';

            const newMessages: Message[] = scenario.messages.map((m, i) => ({
                id: crypto.randomUUID(),
                text: m.text,
                senderId: m.isOwn ? 'friend' : 'user',
                timestamp: getConversationTimestamp(i, scenario.messages.length),
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
            const selectedStyle = chatState.appearance.chatStyle ?? 'mixed';
            const isIndian = selectedStyle === 'indian' || (selectedStyle === 'mixed' && Math.random() < 0.5);
            const scenarios = isIndian ? indianScenarios : globalScenarios;
            const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            const platform = chatState.platform;

            const senderName = scenario.contactName || (isIndian
                ? indianNames[Math.floor(Math.random() * indianNames.length)]
                : westernNames[Math.floor(Math.random() * westernNames.length)]);

            const newMessages: Message[] = scenario.messages.map((m, i) => ({
                id: crypto.randomUUID(),
                text: m.text,
                senderId: m.isOwn ? 'friend' : 'user',
                timestamp: getConversationTimestamp(i, scenario.messages.length),
                isOwn: m.isOwn
            }));

            const newPeople: Person[] = [
                { id: 'friend', name: 'You', isOnline: true },
                { id: 'user', name: senderName, isOnline: Math.random() > 0.3, avatar: getAvatarUrl(senderName) }
            ];

            setChatState(prev => ({
                ...prev,
                platform,
                chatType: 'direct',
                people: newPeople,
                messages: newMessages,
                appearance: {
                    ...prev.appearance,
                    darkMode: Math.random() > 0.5,
                    use24HourFormat: false,
                    chatStyle: selectedStyle,
                }
            }));

            toast.success(`Randomized: ${scenario.name}`);
        }
    }, [chatState.appearance.chatStyle, chatState.platform]);

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
