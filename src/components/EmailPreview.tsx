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

    if (state.provider === 'gmail') {
        return (
            <div
                className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                style={{ width: 600, fontFamily: '"Google Sans", Roboto, sans-serif' }}
            >
                {/* Gmail Style Header */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                            {fromP?.name[0] || 'G'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-gray-900">{renderName(fromP)}</span>
                                <span className="text-[11px] text-gray-500">{firstEmail ? formatEmailDate(firstEmail.dateTime).split(' ').slice(0, 4).join(' ') : ''}</span>
                            </div>
                            <div className="text-[12px] text-gray-500 truncate">
                                to {toParticipants.map((p, i) => (
                                    <span key={p.id}>{i > 0 && ', '}{p.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <h1 className="text-xl font-medium text-gray-900 mb-4 ml-1">
                        <RedactedText text={state.subject} />
                    </h1>
                </div>

                <div className="px-6 pb-8 ml-1">
                    <div className="text-[14px] text-gray-800 leading-[1.5] whitespace-pre-wrap">
                        {state.emails.map((email, idx) => {
                            const sender = state.participants.find(p => p.id === email.fromParticipantId);
                            return (
                                <div key={email.id} className={idx > 0 ? 'mt-8 pt-8 border-t border-gray-100' : ''}>
                                    <div className="mb-4">
                                        {email.body.split('\n').map((line, li) => (
                                            <p key={li} className={line === '' ? 'h-3' : 'mb-1'}>
                                                {line !== '' && <RedactedText text={line} />}
                                            </p>
                                        ))}
                                    </div>
                                    {state.attachment && idx === 0 && (
                                        <div className="mt-6 p-3 border border-gray-200 rounded-lg flex items-center gap-3 w-fit bg-gray-50/50">
                                            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                                <Paperclip className="w-4 h-4 text-red-600" />
                                            </div>
                                            <div className="text-xs">
                                                <p className="font-medium text-gray-700 underline"><RedactedText text={state.attachment} /></p>
                                                <p className="text-gray-400">1.2 MB</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (state.provider === 'outlook') {
        return (
            <div
                className="bg-white rounded-md shadow-2xl border border-gray-300 overflow-hidden"
                style={{ width: 620, fontFamily: '"Segoe UI", sans-serif' }}
            >
                {/* Outlook Header */}
                <div className="bg-[#0078d4] px-4 py-2 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center">
                            <span className="font-bold text-xs">O</span>
                        </div>
                        <span className="text-sm font-semibold">Outlook</span>
                    </div>
                </div>

                <div className="p-6">
                    <h1 className="text-2xl font-light text-gray-900 mb-6 border-b pb-4">
                        <RedactedText text={state.subject} />
                    </h1>

                    <div className="flex items-start gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#0078d4] flex items-center justify-center text-white font-semibold">
                            {fromP?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-[15px]">{renderName(fromP)} &lt;{fromP?.email}&gt;</div>
                            <div className="text-[13px] text-gray-600 mt-0.5">
                                To: {toParticipants.map((p, i) => (
                                    <span key={p.id}>{i > 0 && '; '}{p.name} &lt;{p.email}&gt;</span>
                                ))}
                            </div>
                            <div className="text-[12px] text-gray-500 mt-1">{firstEmail ? formatEmailDate(firstEmail.dateTime) : ''}</div>
                        </div>
                    </div>

                    <div className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap min-h-[200px]">
                        {state.emails[0]?.body.split('\n').map((line, li) => (
                            <p key={li} className={line === '' ? 'h-4' : 'mb-1'}>
                                {line !== '' && <RedactedText text={line} />}
                            </p>
                        ))}
                    </div>

                    {state.attachment && (
                        <div className="mt-8 pt-4 border-t border-gray-100 italic text-[13px] text-gray-500 flex items-center gap-2">
                            <Paperclip className="w-4 h-4" />
                            <span>Attachment: </span>
                            <span className="text-[#0078d4] hover:underline cursor-pointer font-medium"><RedactedText text={state.attachment} /></span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Generic (Matched to user's provided reference image)
    return (
        <div
            className="bg-white p-12 shadow-sm"
            style={{ width: 680, fontFamily: 'Georgia, serif' }}
        >
            {/* Header Table */}
            <table className="text-[15px] leading-[22px] text-gray-900 w-full mb-4" style={{ borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        <td className="pr-4 py-0.5 font-bold text-right" style={{ width: 120 }}>From:</td>
                        <td className="py-0.5">
                            {renderName(fromP)} {renderEmail(fromP)}
                        </td>
                    </tr>
                    <tr>
                        <td className="pr-4 py-0.5 font-bold text-right">To:</td>
                        <td className="py-0.5">
                            {toParticipants.length > 0 ? (
                                <>"{renderName(toParticipants[0])}" {renderEmail(toParticipants[0])}</>
                            ) : (
                                <span className="text-gray-400">...</span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="pr-4 py-0.5 font-bold text-right">Subject:</td>
                        <td className="py-0.5"><RedactedText text={state.subject} /></td>
                    </tr>
                    {firstEmail && (
                        <tr>
                            <td className="pr-4 py-0.5 font-bold text-right">Date:</td>
                            <td className="py-0.5">{formatEmailDate(firstEmail.dateTime)}</td>
                        </tr>
                    )}
                    {state.attachment && (
                        <tr>
                            <td className="pr-4 py-0.5 font-bold text-right">Attachment:</td>
                            <td className="py-0.5">
                                <span className="text-blue-600 underline cursor-pointer">
                                    <RedactedText text={state.attachment} />
                                </span>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Thick Black Divider line match user image */}
            <div className="border-t-[2px] border-black mt-2 mb-8" />

            {/* Bodies */}
            <div className="space-y-8">
                {state.emails.map((email, idx) => {
                    const sender = state.participants.find(p => p.id === email.fromParticipantId);
                    return (
                        <div key={email.id}>
                            {idx > 0 && sender && (
                                <p className="text-[13px] text-gray-500 mb-4 italic opacity-80">
                                    — {sender.redactName
                                        ? <span className="inline-block bg-black text-black rounded-sm px-1">{sender.name}</span>
                                        : sender.name
                                    } on {formatEmailDate(email.dateTime)} wrote:
                                </p>
                            )}
                            <div className="text-[16px] text-gray-900 leading-[1.6] whitespace-pre-wrap">
                                {email.body.split('\n').map((line, li) => (
                                    <p key={li} className={line === '' ? 'h-4' : 'mb-1'}>
                                        {line !== '' && <RedactedText text={line} />}
                                    </p>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
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
        <div ref={captureRef} className="inline-block p-8">
            <div className="relative">
                <EmailCard state={state} />
                <Watermark isDark={false} />
            </div>
        </div>
    );
});
