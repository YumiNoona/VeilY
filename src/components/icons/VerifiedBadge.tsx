import React from 'react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  platform: 'instagram' | 'snapchat' | 'whatsapp' | 'messenger';
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ platform, className }) => {
  if (platform === 'instagram') {
    return (
      <svg 
        viewBox="0 0 24 24" 
        className={cn("w-3.5 h-3.5 fill-[#0095f6]", className)}
        aria-label="Verified"
      >
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5.4 8.7l-6.3 6.3c-.2.2-.5.3-.7.3s-.5-.1-.7-.3l-3.1-3.1c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l2.4 2.4 5.6-5.6c.4-.4 1-.4 1.4 0s.4 1 0 1.4z" />
      </svg>
    );
  }

  if (platform === 'snapchat') {
    return (
      <div className={cn("flex items-center justify-center bg-[#FFFC00] rounded-sm p-[1px] shadow-sm", className)}>
         <svg 
          viewBox="0 0 24 24" 
          className="w-2.5 h-2.5 fill-black"
          aria-label="Verified"
        >
          <path d="M12 1L14.39 8.26H22L15.81 12.75L18.19 20L12 15.5L5.81 20L8.19 12.75L2 8.26H9.61L12 1Z" />
        </svg>
      </div>
    );
  }

  if (platform === 'whatsapp' || platform === 'messenger') {
    return (
      <svg 
        viewBox="0 0 24 24" 
        className={cn("w-3.5 h-3.5", platform === 'whatsapp' ? "fill-[#25D366]" : "fill-[#0084FF]", className)}
        aria-label="Verified"
      >
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5.4 8.7l-6.3 6.3c-.2.2-.5.3-.7.3s-.5-.1-.7-.3l-3.1-3.1c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l2.4 2.4 5.6-5.6c.4-.4 1-.4 1.4 0s.4 1 0 1.4z" />
      </svg>
    );
  }

  return null;
};
