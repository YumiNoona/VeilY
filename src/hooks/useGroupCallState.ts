import { useState, useCallback, useEffect } from "react";
import { CallState, CallParticipant, CallPlatform } from "@/types/chat";
import { toast } from "sonner";

const initialParticipants: CallParticipant[] = [
    { id: '1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', isMuted: false, isCameraOff: false, isSpeaking: true },
    { id: '2', name: 'Mary Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', isMuted: true, isCameraOff: false, isSpeaking: false },
    { id: '3', name: 'Robert Brown', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', isMuted: false, isCameraOff: true, isSpeaking: false },
];

const initialCallState: CallState = {
    platform: 'whatsapp',
    participants: initialParticipants,
    duration: '04:20',
    isSignalLow: false,
    isRecording: false,
};

const STORAGE_KEY = 'groupCallState';

export const useGroupCallState = () => {
    const [callState, setCallState] = useState<CallState>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        return initialCallState;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(callState));
    }, [callState]);

    const updatePlatform = useCallback((platform: CallPlatform) => {
        setCallState(prev => ({ ...prev, platform }));
        toast.success(`Switched to ${platform} call mode`);
    }, []);

    const updateDuration = useCallback((duration: string) => {
        setCallState(prev => ({ ...prev, duration }));
    }, []);

    const addParticipant = useCallback((participant: CallParticipant) => {
        setCallState(prev => ({ ...prev, participants: [...prev.participants, participant] }));
    }, []);

    const updateParticipant = useCallback((id: string, updates: Partial<CallParticipant>) => {
        setCallState(prev => ({
            ...prev,
            participants: prev.participants.map(p => p.id === id ? { ...p, ...updates } : p)
        }));
    }, []);

    const removeParticipant = useCallback((id: string) => {
        setCallState(prev => {
            if (prev.participants.length <= 1) {
                toast.error("At least one participant is required");
                return prev;
            }
            return { ...prev, participants: prev.participants.filter(p => p.id !== id) };
        });
    }, []);

    const resetCall = useCallback(() => {
        setCallState(initialCallState);
        toast.success("Call state reset");
    }, []);

    const toggleSignal = useCallback(() => {
        setCallState(prev => ({ ...prev, isSignalLow: !prev.isSignalLow }));
    }, []);

    const toggleRecording = useCallback(() => {
        setCallState(prev => ({ ...prev, isRecording: !prev.isRecording }));
    }, []);

    return {
        callState,
        updatePlatform,
        updateDuration,
        addParticipant,
        updateParticipant,
        removeParticipant,
        resetCall,
        toggleSignal,
        toggleRecording
    };
};
