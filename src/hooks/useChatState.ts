import { useState, useCallback, useEffect } from "react";
import { ChatState, Message, Person, Platform, ChatType, AppearanceSettings } from "@/types/chat";
import { ParsedChat } from "@/lib/parsers";
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
    aiModel: 'gpt-4o',
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
        
        const scenarios = isAIPlatform ? [
            {
                name: "Coding help",
                messages: [
                    { text: "how do I fix a hydration error in nextjs", isOwn: true },
                    { text: "Hydration errors usually happen when the server-rendered HTML doesn't match the client's first render. Are you using any browser-only APIs like window inside your component?", isOwn: false },
                    { text: "yeah I'm checking window.innerWidth in a div", isOwn: true },
                    { text: "That's it. Wrap that logic in a useEffect hook so it only runs on the client. Or use a custom useHasMounted hook.", isOwn: false }
                ]
            },
            {
                name: "Recipe advice",
                messages: [
                    { text: "what can I make with chicken, spinach and heavy cream?", isOwn: true },
                    { text: "You can make a classic Creamy Tuscan Chicken! Pan-sear the chicken, then make a sauce with the cream, garlic, and spinach. Serve it over pasta or rice.", isOwn: false },
                    { text: "sounds fire, can I add mushrooms too?", isOwn: true },
                    { text: "Definitely! Sauté them with the garlic before adding the cream. It'll add a great earthy flavor.", isOwn: false }
                ]
            },
            {
                name: "Life advice",
                messages: [
                    { text: "how do I tell my boss I'm quititng without being awkward", isOwn: true },
                    { text: "Keep it professional and concise. Start with 'I'm writing to formally resign from my position as [Role]...'", isOwn: false },
                    { text: "should I mention the new job?", isOwn: true },
                    { text: "Only if you want to. You're not obligated. Just focus on your gratitude for the opportunity and your planned last day.", isOwn: false }
                ]
            },
            {
                name: "Quick Translation",
                messages: [
                    { text: "how do you say 'where is the nearest metro' in french", isOwn: true },
                    { text: "You say: 'Où se trouve la station de métro la plus proche ?'", isOwn: false },
                    { text: "and how do you pronounce it?", isOwn: true },
                    { text: "Oo su troov la sta-syon du may-tro la ploo prosh.", isOwn: false }
                ]
            }
        ] : [
            {
                name: "Making plans (Western)",
                messages: [
                    { text: "yooo u coming tonight?", isOwn: false },
                    { text: "wait what's happening??", isOwn: true },
                    { text: "birthday drinks for marcus lol did u forget", isOwn: false },
                    { text: "omg istg I completely blanked", isOwn: true },
                    { text: "standard lol. be there at 9", isOwn: false },
                    { text: "aight bet", isOwn: true }
                ]
            },
            {
                name: "Indian College Chaos",
                messages: [
                    { text: "bhai notes de", isOwn: false },
                    { text: "konsay?", isOwn: true },
                    { text: "kal jo mpmc lab main hua tha, sir ne mera proxy marna mana kar diya", isOwn: false },
                    { text: "lmao tune kuch kiya hoga", isOwn: true },
                    { text: "arey bhai kuch nhi kiya bas late tha thoda", isOwn: false },
                    { text: "chal library mil batata hu", isOwn: true }
                ]
            },
            {
                name: "Roasting (Western)",
                messages: [
                    { text: "ur fit in that story is... interesting", isOwn: false },
                    { text: "stfu i look good", isOwn: true },
                    { text: "bro u look like a highlighter 💀", isOwn: false },
                    { text: "it's called fashion marcus look it up", isOwn: true },
                    { text: "fashion from a construction site maybe", isOwn: false },
                    { text: "ratio", isOwn: true }
                ]
            },
            {
                name: "Indian Family Group",
                messages: [
                    { text: "beta ghar kab aaoge?", isOwn: false },
                    { text: "mummy bas 6 baje nikalunga office se", isOwn: true },
                    { text: "theek hai, dahi lete aana raste se", isOwn: false },
                    { text: "ok mummy", isOwn: true },
                    { text: "aur papa puch rahe the ki light ka bill bhara ki nhi", isOwn: false },
                    { text: "bhar diya tha subah hi", isOwn: true }
                ]
            },
            {
                name: "Gossip (Western)",
                messages: [
                    { text: "did u see what she posted???", isOwn: false },
                    { text: "wait no what", isOwn: true },
                    { text: "look at her story rn", isOwn: false },
                    { text: "omg with TYLER??", isOwn: true },
                    { text: "ngl i saw that coming months ago", isOwn: false },
                    { text: "i'm actually screaming", isOwn: true }
                ]
            },
            {
                name: "School homework (Indian)",
                messages: [
                    { text: "bhai assignment kiya?", isOwn: false },
                    { text: "kounsa wala", isOwn: true },
                    { text: "woh math ka jo sharma sir ne diya tha", isOwn: false },
                    { text: "nhi yaar abhi toh start bhi nhi kiya", isOwn: true },
                    { text: "chal done, milte hai playground per discuss karenge", isOwn: false },
                    { text: "ok bhai", isOwn: true }
                ]
            },
            {
                name: "Discord Chaos",
                messages: [
                    { text: "@everyone raid in 5 mins get on vc", isOwn: false },
                    { text: "stfu pinging for a raid at 3am", isOwn: true },
                    { text: "ratio + based", isOwn: false },
                    { text: "loggin in rn u better be there", isOwn: true },
                    { text: "i'm healer per usual", isOwn: false },
                    { text: "L guest", isOwn: true }
                ]
            }
        ];

        // Randomly pick a scenario
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const platform = isAIPlatform ? chatState.platform : ['whatsapp', 'imessage', 'discord', 'instagram'][Math.floor(Math.random() * 4)] as Platform;
        
        const isIndian = scenario.name.includes("Indian");
        const senderName = isAIPlatform ? (platform === 'chatgpt' ? 'ChatGPT' : platform === 'claude' ? 'Claude' : platform === 'gemini' ? 'Gemini' : 'Grok') : (isIndian ? indianNames[Math.floor(Math.random() * indianNames.length)] : westernNames[Math.floor(Math.random() * westernNames.length)]);

        const newMessages: Message[] = scenario.messages.map((m, i) => ({
            id: crypto.randomUUID(),
            text: m.text,
            senderId: m.isOwn ? 'friend' : 'user',
            timestamp: new Date(Date.now() - (scenario.messages.length - i) * 120000),
            isOwn: m.isOwn
        }));

        const newPeople: Person[] = [
            { id: 'friend', name: 'You', isOnline: true },
            { id: 'user', name: senderName, isOnline: Math.random() > 0.3, avatar: isAIPlatform ? undefined : `https://i.pravatar.cc/150?u=${senderName}` }
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
