import { useState, useCallback, useEffect } from "react";
import { ChatState, Message, Person, Platform, ChatType, AppearanceSettings } from "@/types/chat";
import { toast } from "sonner";

const initialMessages: Message[] = [
    { id: '1', text: "Hey, want to try building a chat app mockup?", senderId: 'user', timestamp: new Date(), isOwn: false },
    { id: '2', text: "A chat app mockup? You mean like pretending to send messages?", senderId: 'friend', timestamp: new Date(), isOwn: true },
    { id: '3', text: "Exactly! We can design fake conversations, test layouts, and have some fun.", senderId: 'user', timestamp: new Date(), isOwn: false },
    { id: '4', text: "Can we add funny names and profile pics too?", senderId: 'friend', timestamp: new Date(), isOwn: true },
    { id: '5', text: "Of course! And try out different chat platforms—like making it look like Discord or iMessage.", senderId: 'user', timestamp: new Date(), isOwn: false },
];

const initialPeople: Person[] = [
    { id: 'friend', name: 'You', isOnline: true },
    { id: 'user', name: 'Friend', isOnline: true },
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
    transparentBackground: false,
};

const CHAT_STATE_STORAGE_KEY = 'chatState';

const initialChatState: ChatState = {
    platform: 'whatsapp',
    chatType: 'direct',
    people: initialPeople,
    messages: initialMessages,
    appearance: initialAppearance,
    aiModel: 'gpt-4o',
};

const loadStateFromLocalStorage = (): ChatState => {
    try {
        const serializedState = localStorage.getItem(CHAT_STATE_STORAGE_KEY);
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

export const useChatState = () => {
    const [chatState, setChatState] = useState<ChatState>(loadStateFromLocalStorage);

    useEffect(() => {
        try {
            const serializedState = JSON.stringify(chatState);
            localStorage.setItem(CHAT_STATE_STORAGE_KEY, serializedState);
        } catch (error) {
            console.error("Error saving state to localStorage:", error);
        }
    }, [chatState]);

    const handlePlatformChange = useCallback((platform: Platform) => {
        setChatState(prev => ({ ...prev, platform }));
        toast.success(`Switched to ${platform}`);
    }, []);

    const handleChatTypeChange = useCallback((chatType: ChatType) => {
        setChatState(prev => ({ ...prev, chatType }));
    }, []);

    const handleAddMessage = useCallback((text: string, isOwn: boolean, image?: string) => {
        const newMessage: Message = {
            id: crypto.randomUUID(),
            text,
            senderId: isOwn ? 'friend' : 'user',
            timestamp: new Date(),
            isOwn,
            image,
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

    const handleUpdateMessage = useCallback((id: string, newText: string, newTimestamp?: Date, newImage?: string, isOwn?: boolean) => {
        setChatState(prev => ({
            ...prev,
            messages: prev.messages.map(m => m.id === id ? {
                ...m,
                text: newText,
                ...(newTimestamp && { timestamp: newTimestamp }),
                ...(newImage !== undefined && { image: newImage }),
                ...(isOwn !== undefined && { isOwn })
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
        localStorage.removeItem(CHAT_STATE_STORAGE_KEY);
        toast.success("Chat state reset to defaults.");
    }, []);

    const handleLoadTemplate = useCallback((template: ChatState) => {
        // Revive timestamps
        const messagesWithDates = template.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        }));
        setChatState({ ...template, messages: messagesWithDates });
        toast.success("Template loaded successfully.");
    }, []);

    const randomizeState = useCallback(() => {
        const platforms: Platform[] = ['whatsapp', 'discord', 'imessage', 'instagram', 'messenger', 'signal', 'slack', 'telegram', 'teams', 'snapchat'];
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
        
        const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth"];
        const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
        
        const randomName = () => `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        
        const randomMessagesPool = [
            "Hey! How's it going?",
            "Did you see the news today?",
            "I'm so excited for the weekend!",
            "Can you send me that file again?",
            "Just finished the project, check it out! 🚀",
            "Are we still meeting at 5?",
            "That's hilarious! 🤣🤣",
            "I'll be there in 10 mins.",
            "Wow, I didn't know that.",
            "Let's grab coffee tomorrow! ☕️",
            "Check out this photo I took! 📸",
            "Did you finish the sprint tasks?",
            "Happy birthday! 🎂🎉",
            "The new update is amazing.",
            "I'm literally shaking right now. 😭"
        ];

        const numMessages = Math.floor(Math.random() * 5) + 3;
        const newMessages: Message[] = [];
        for (let i = 0; i < numMessages; i++) {
            newMessages.push({
                id: crypto.randomUUID(),
                text: randomMessagesPool[Math.floor(Math.random() * randomMessagesPool.length)],
                senderId: Math.random() > 0.5 ? 'user' : 'friend',
                timestamp: new Date(Date.now() - (numMessages - i) * 300000),
                isOwn: Math.random() > 0.5
            });
        }

        const newPeople: Person[] = [
            { id: 'friend', name: randomName(), isOnline: Math.random() > 0.3 },
            { id: 'user', name: 'You', isOnline: true }
        ];

        setChatState(prev => ({
            ...prev,
            platform: randomPlatform,
            people: newPeople,
            messages: newMessages,
            appearance: {
                ...prev.appearance,
                darkMode: Math.random() > 0.5,
                use24HourFormat: Math.random() > 0.5
            }
        }));
        toast.success("Randomized chat content!");
    }, []);

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
        randomizeState,
    };
};
