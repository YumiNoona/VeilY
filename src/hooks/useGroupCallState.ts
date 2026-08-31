import { useState, useCallback, useEffect } from "react";
import { CallState, CallParticipant, CallPlatform } from "@/types/chat";
import { toast } from "sonner";

const initialParticipants: CallParticipant[] = [
    { id: '1', name: 'Aarav Patel', avatar: '/avatars/indian/indian-03.png', isMuted: false, isCameraOff: false, isSpeaking: true },
    { id: '2', name: 'Priya Sharma', avatar: '/avatars/indian/indian-02.png', isMuted: true, isCameraOff: false, isSpeaking: false },
    { id: '3', name: 'Kabir Singh', avatar: '/avatars/indian/indian-06.png', isMuted: false, isCameraOff: true, isSpeaking: false },
];

const legacyParticipantNames = new Set(['John Doe', 'Mary Smith', 'Robert Brown']);

const initialCallState: CallState = {
    platform: 'whatsapp',
    participants: initialParticipants,
    title: 'Weekend Plans',
    meetingCode: 'abc-defg-hij',
    duration: '04:20',
    layout: 'grid',
    quality: 'hd',
    showNames: true,
    showTimer: true,
    backgroundBlur: false,
    isScreenSharing: false,
    sharedMedia: undefined,
    showCaptions: false,
    showChatPanel: false,
    showParticipantPanel: false,
    isSignalLow: false,
    isRecording: false,
};

const STORAGE_KEY = 'groupCallState';

const isCallState = (value: unknown): value is CallState => {
    if (!value || typeof value !== 'object') return false;
    const candidate = value as Partial<CallState>;
    const platforms: CallState['platform'][] = ['whatsapp', 'discord', 'facetime', 'zoom', 'meet'];

    return !!candidate.platform
        && platforms.includes(candidate.platform)
        && typeof candidate.duration === 'string'
        && Array.isArray(candidate.participants)
        && candidate.participants.length > 0
        && candidate.participants.every(participant =>
            participant
            && typeof participant.id === 'string'
            && typeof participant.name === 'string'
            && typeof participant.avatar === 'string'
            && typeof participant.isMuted === 'boolean'
            && typeof participant.isCameraOff === 'boolean'
            && typeof participant.isSpeaking === 'boolean'
        );
};

export const useGroupCallState = () => {
    const [callState, setCallState] = useState<CallState>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed: unknown = JSON.parse(stored);
                if (isCallState(parsed)) {
                    const isLegacySample = parsed.participants.length === 3
                        && parsed.participants.every(participant => legacyParticipantNames.has(participant.name));
                    return {
                        ...initialCallState,
                        ...parsed,
                        participants: isLegacySample ? initialParticipants : parsed.participants,
                    };
                }
                localStorage.removeItem(STORAGE_KEY);
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        return initialCallState;
    });

    useEffect(() => {
        // Preview uploads can be several megabytes. Keep those in memory so a
        // large image can never take down the editor by exhausting localStorage.
        const persistableState: CallState = {
            ...callState,
            sharedMedia: undefined,
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(persistableState));
        } catch (error) {
            // A full browser store should not crash the call editor.
            console.warn('Unable to persist call settings:', error);
        }
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

    const updateSettings = useCallback((updates: Partial<CallState>) => {
        setCallState(prev => ({ ...prev, ...updates }));
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
        updateSettings,
        removeParticipant,
        resetCall,
        toggleSignal,
        toggleRecording
    };
};
