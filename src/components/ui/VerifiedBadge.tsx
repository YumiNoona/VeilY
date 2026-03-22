import React from 'react';
import { SocialPlatform } from '@/hooks/useSocialPostState';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
    platform: SocialPlatform;
    className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ platform, className }) => {
    if (platform === 'twitter') {
        return (
            <svg viewBox="0 0 24 24" aria-label="Verified Account" className={cn("w-5 h-5 text-[#1D9BF0]", className)} fill="currentColor">
                <g>
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                </g>
            </svg>
        );
    }

    if (platform === 'instagram') {
        return (
            <svg viewBox="0 0 40 40" className={cn("w-4 h-4 text-[#0095F6]", className)} fill="currentColor">
                <path d="M19.998 3.094 14.638 0l-5.36 3.094-5.36-3.094L3.91 6.188l-5.36 3.094 2.853 5.39-2.854 5.39 5.36 3.094 0 6.188 5.36-3.094 5.36 3.094 5.36-3.094 0-6.188 5.36 3.094-2.854-5.39 2.854-5.39-5.36-3.094-5.36 3.094Z" transform="translate(3.5 3.5)" />
                {/* Simplified star shape, adding white check on top via overlay or subtraction would be ideal. 
            For now, using a path that represents the filled badge. 
            Real Instagram/FB badge is complex. 
            Let's use a standard 'verified' icon approximation that looks good. */}
                <path d="M19.95 0C8.96 0 0 8.96 0 19.98s8.96 19.98 19.95 19.98c11.01 0 20.05-8.96 20.05-19.98S30.96 0 19.95 0z" />
                <path fill="#fff" d="M16.7 27.3L8.8 18.9l2.7-2.6 5.2 5.5 12.1-12.2 2.6 2.7z" />
            </svg>
        );
    }

    // LinkedIn / General fallback
    return (
        <svg viewBox="0 0 24 24" className={cn("w-4 h-4 text-[#0A66C2]", className)} fill="currentColor">
            <path d="M21 12.02c0 1.66-.88 3.1-2.16 3.79.16.46.25.96.25 1.48 0 2.32-1.8 4.2-4 4.2-.49 0-.96-.09-1.42-.25-.68 1.28-2.12 2.16-3.79 2.16s-3.11-.88-3.79-2.16c-.46.16-.93.25-1.42.25-2.2 0-4-1.88-4-4.2 0-.52.09-1.02.25-1.48-1.28-.69-2.16-2.13-2.16-3.79s.88-3.1 2.16-3.79c-.16-.46-.25-.96-.25-1.48 0-2.32 1.8-4.2 4-4.2.49 0 .96.09 1.42.25.68-1.28 2.12-2.16 3.79-2.16s3.11.88 3.79 2.16c.46-.16.93-.25 1.42-.25 2.2 0 4 1.88 4 4.2 0 .52-.09 1.02-.25 1.48 1.28.69 2.16 2.13 2.16 3.79zM9.54 16.77l9.14-9.14-1.41-1.41-7.73 7.73-3.08-3.08-1.41 1.41 4.49 4.49z" />
        </svg>
    );
};
