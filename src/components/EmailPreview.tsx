import React, { useRef } from 'react';
import { useEmailState } from '@/hooks/useEmailState';
import { Paperclip } from 'lucide-react';
import { Watermark } from '@/components/Watermark';
import { exportAsImage, copyToClipboard } from '@/lib/export-utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type EmailState = ReturnType<typeof useEmailState>['state'];

interface EmailPreviewProps {
    state: EmailState;
}

export interface EmailPreviewRef {
    handleDownload: () => Promise<void>;
    handleCopy: () => Promise<void>;
    getRef: () => React.RefObject<HTMLDivElement>;
}

/** Replaces **text** with black redacted boxes */
const RedactedText: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    const inner = part.slice(2, -2);
                    return (
                        <span
                            key={i}
                            className="inline-block bg-black text-black select-none rounded-sm mx-0.5"
                            style={{ minWidth: Math.max(30, inner.length * 7) }}
                        >
                            {inner}
                        </span>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
};

/** Formats ISO datetime to readable email format */
const formatEmailDate = (dt: string): string => {
    try {
        const d = new Date(dt);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const hours = d.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const h = hours % 12 || 12;
        const min = d.getMinutes().toString().padStart(2, '0');
        return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${h}:${min}:00 ${ampm} +0000`;
    } catch {
        return dt;
    }
};

const EmailCard: React.FC<{ state: EmailState }> = ({ state }) => {
    // For the header we use the first email's sender and recipients
    const firstEmail = state.emails[0];
    const fromP = state.participants.find(p => p.id === firstEmail?.fromParticipantId) || state.participants[0];
    const toParticipants = state.participants.filter(p => p.id !== fromP?.id);

    const renderName = (p: typeof fromP) => {
        if (!p) return '';
        return p.redactName ? <span className="inline-block bg-black text-black rounded-sm px-2">{p.name}</span> : <>{p.name}</>;
    };

    const renderEmail = (p: typeof fromP) => {
        if (!p) return '';
        return p.redactEmail ? <span className="inline-block bg-black text-black rounded-sm px-2">{p.email}</span> : <>&lt;{p.email}&gt;</>;
    };

    return (
        <div
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            style={{ width: 560, fontFamily: 'Georgia, serif' }}
        >
            {/* Email Header */}
            <div className="px-8 pt-8 pb-4 border-b border-gray-200">
                <table className="text-sm text-gray-800 w-full" style={{ borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                            <td className="pr-4 py-0.5 font-bold text-right whitespace-nowrap align-top" style={{ width: 90 }}>From:</td>
                            <td className="py-0.5">
                                {renderName(fromP)} {renderEmail(fromP)}
                            </td>
                        </tr>
                        {toParticipants.map((p, i) => (
                            <tr key={p.id}>
                                <td className="pr-4 py-0.5 font-bold text-right whitespace-nowrap align-top">
                                    {i === 0 ? 'To:' : 'Cc:'}
                                </td>
                                <td className="py-0.5">
                                    "{renderName(p)}" {renderEmail(p)}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td className="pr-4 py-0.5 font-bold text-right whitespace-nowrap">Subject:</td>
                            <td className="py-0.5"><RedactedText text={state.subject} /></td>
                        </tr>
                        {firstEmail && (
                            <tr>
                                <td className="pr-4 py-0.5 font-bold text-right whitespace-nowrap">Date:</td>
                                <td className="py-0.5 text-gray-600">{formatEmailDate(firstEmail.dateTime)}</td>
                            </tr>
                        )}
                        {state.attachment && (
                            <tr>
                                <td className="pr-4 py-0.5 font-bold text-right whitespace-nowrap">Attachment:</td>
                                <td className="py-0.5">
                                    <span className="text-blue-600 underline cursor-pointer flex items-center gap-1 w-fit">
                                        <Paperclip className="w-3 h-3" />
                                        <RedactedText text={state.attachment} />
                                    </span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Divider */}
                <div className="mt-4 border-t border-gray-300" />
            </div>

            {/* Email Bodies */}
            <div className="px-8 py-6 space-y-6">
                {state.emails.map((email, idx) => {
                    const sender = state.participants.find(p => p.id === email.fromParticipantId);
                    return (
                        <div key={email.id} className={idx > 0 ? 'pt-6 border-t border-gray-100' : ''}>
                            {idx > 0 && sender && (
                                <p className="text-xs text-gray-400 mb-3 italic">
                                    — {sender.redactName
                                        ? <span className="inline-block bg-black text-black rounded-sm px-1">{sender.name}</span>
                                        : sender.name
                                    } on {formatEmailDate(email.dateTime)} wrote:
                                </p>
                            )}
                            <div className="text-sm text-gray-800 leading-7 whitespace-pre-wrap">
                                {email.body.split('\n').map((line, li) => (
                                    <p key={li} className={line === '' ? 'h-3' : ''}>
                                        {line !== '' && <RedactedText text={line} />}
                                    </p>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Watermark */}
        </div>
    );
};

export const EmailPreview = React.forwardRef<EmailPreviewRef, EmailPreviewProps>(({ state }, ref) => {
    const captureRef = useRef<HTMLDivElement>(null);
    const { user, plan, downloadsUsed, setAuthModalOpen, setUpgradeModalOpen, incrementDownloads } = useAuth();

    React.useImperativeHandle(ref, () => ({
        handleDownload: async () => {
            if (!user) {
                setAuthModalOpen(true);
                return;
            }

            if (plan === 'free' && (3 - downloadsUsed) <= 0) {
                toast.error("You've reached your free export limit!");
                setUpgradeModalOpen(true);
                return;
            }

            if (!captureRef.current) return;
            try {
                await exportAsImage(captureRef.current, {
                    scale: 2,
                    filename: `veily-email-${Date.now()}.png`
                });
                await incrementDownloads();
                toast.success("Mockup downloaded!");
            } catch (err) {
                toast.error("Download failed");
            }
        },
        handleCopy: async () => {
            if (!user) {
                setAuthModalOpen(true);
                return;
            }

            if (!captureRef.current) return;
            try {
                const success = await copyToClipboard(captureRef.current, 2);
                if (success) toast.success("Copied to clipboard!");
                else toast.error("Failed to copy image");
            } catch (err) {
                toast.error("Copy failed");
            }
        },
        getRef: () => captureRef
    }));

    return (
        <div ref={captureRef} className="relative inline-block p-8">
            <EmailCard state={state} />
            <Watermark />
        </div>
    );
});
