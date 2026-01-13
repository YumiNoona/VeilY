import { useState, useCallback } from "react";
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
    showDeviceFrame: true,
    statusBarTime: '9:41',
    batteryLevel: 100,
    transparentBackground: false,
};

export const useChatState = () => {
    const [chatState, setChatState] = useState<ChatState>({
        platform: 'whatsapp',
        chatType: 'direct',
        people: initialPeople,
        messages: initialMessages,
        appearance: initialAppearance,
        aiModel: 'gpt-4o',
    });

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
        const newPerson: Person = {
            id: crypto.randomUUID(),
            name: `Person ${chatState.people.length}`,
            isOnline: true,
            avatar: undefined // ensure new person starts without avatar
        };
        setChatState(prev => ({ ...prev, people: [...prev.people, newPerson] }));
    }, [chatState.people.length]); // Added dependency

    const handleRemovePerson = useCallback((id: string) => {
        // Correct logic: Check if we have more than 2 people BEFORE removing
        if (chatState.people.length <= 2) return;
        setChatState(prev => ({ ...prev, people: prev.people.filter(p => p.id !== id) }));
    }, [chatState.people.length]); // Added dependency

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
    };
};
