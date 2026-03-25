import { Message, Person } from "@/types/chat";

export interface ParsedChat {
    messages: Message[];
    participants: Person[];
}

/**
 * Parses WhatsApp export (.txt)
 * Format: [12/10/23, 14:38:51] Name: Message
 * Or: 12/10/23, 2:38 PM - Name: Message
 */
export const parseWhatsApp = (text: string): ParsedChat => {
    const lines = text.split('\n');
    const messages: Message[] = [];
    const participants: Person[] = [];
    const nameToId = new Map<string, string>();
    
    // Robust regex to handle various WhatsApp formats across regions and OS versions
    const regex = /^\[?(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?)\]?\s*(?:-?\s+)?([^:]+):\s*(.*)$/i;

    lines.forEach((line) => {
        const match = line.match(regex);
        if (match) {
            const [_, timestampStr, name, msgText] = match;
            const trimmedMsg = msgText.trim();
            
            // Skip media omitted, system text, and EMPTY messages
            const lowerMsg = trimmedMsg.toLowerCase();
            if (!trimmedMsg ||
                lowerMsg.includes('<media omitted>') || 
                lowerMsg.includes('messages and calls are end-to-end encrypted') ||
                lowerMsg.includes('owner is a contact') ||
                lowerMsg.includes('rent is awaited') || // Specific user context filtering
                lowerMsg === '.' ) {
                return;
            }

            let senderId = nameToId.get(name);
            if (!senderId) {
                // Initial IDs from useChatState: 'friend' is Me (right), 'user' is Friend (left)
                if (name.toLowerCase() === 'you') {
                    senderId = 'friend';
                } else if (nameToId.size === 0) {
                    // First person found who isn't 'You' is the 'friend' (Left side, ID: 'user')
                    senderId = 'user';
                } else if (nameToId.size === 1) {
                    // Second person found is 'me' (Right side, ID: 'friend')
                    senderId = 'friend';
                } else {
                    senderId = `user_${nameToId.size + 1}`;
                }
                
                nameToId.set(name, senderId);
                participants.push({
                    id: senderId,
                    name: name.toLowerCase() === 'you' ? 'Me' : name,
                    isOnline: false
                });
            }

            // Robust date parsing for WhatsApp's varied formats
            let timestamp: Date;
            try {
                const cleanTS = timestampStr.replace(' ', ' ').trim();
                // Attempt standard parse first
                timestamp = new Date(cleanTS);
                
                // If invalid, try manual parse for DD/MM/YYYY
                if (isNaN(timestamp.getTime())) {
                    const dateParts = cleanTS.split(', ');
                    if (dateParts.length >= 2) {
                        const [dPart, tPart] = dateParts;
                        const [d, m, y] = dPart.split(/[\/\.-]/).map(Number);
                        // Very basic time parse (8:44 pm)
                        const timeMatch = tPart.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([ap]m)?/i);
                        if (timeMatch) {
                            let [_, hours, mins, secs, ampm] = timeMatch;
                            let h = parseInt(hours);
                            if (ampm?.toLowerCase() === 'pm' && h < 12) h += 12;
                            if (ampm?.toLowerCase() === 'am' && h === 12) h = 0;
                            timestamp = new Date(y, m - 1, d, h, parseInt(mins), parseInt(secs || "0"));
                        }
                    }
                }
            } catch (e) {
                timestamp = new Date();
            }

            if (isNaN(timestamp.getTime())) {
                timestamp = new Date();
            }

            messages.push({
                id: Math.random().toString(36).substr(2, 9),
                text: msgText.trim(),
                senderId: senderId,
                timestamp: timestamp,
                isOwn: senderId === 'friend'
            });
        } else if (messages.length > 0 && line.trim()) {
            // This is likely a multi-line message continuation
            const lastMsg = messages[messages.length - 1];
            lastMsg.text += '\n' + line.trim();
        }
    });

    return { messages, participants };
};

/**
 * Parses Telegram export (.json)
 */
export const parseTelegram = (json: any): ParsedChat => {
    const messages: Message[] = [];
    const participants: Person[] = [];
    const nameToId = new Map<string, string>();
    
    if (!json.messages || !Array.isArray(json.messages)) {
        return { messages: [], participants: [] };
    }

    json.messages.forEach((msg: any) => {
        // We only care about text messages for now
        if (msg.type === 'message' && msg.text && typeof msg.text === 'string') {
            const name = msg.from;
            if (!name) return;

            let senderId = nameToId.get(name);
            if (!senderId) {
                // Heuristic for Telegram: First unique as 'user' (other), second as 'friend' (me)
                if (nameToId.size === 0) {
                    senderId = 'user';
                } else if (nameToId.size === 1) {
                    senderId = 'friend';
                } else {
                    senderId = `user_${nameToId.size + 1}`;
                }
                
                nameToId.set(name, senderId);
                participants.push({
                    id: senderId,
                    name: name,
                    isOnline: false
                });
            }

            messages.push({
                id: msg.id.toString(),
                text: msg.text.trim(),
                senderId: senderId,
                timestamp: new Date(msg.date),
                isOwn: senderId === 'friend'
            });
        }
    });

    return { messages, participants };
};
