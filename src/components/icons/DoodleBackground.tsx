import React, { useMemo } from 'react';
import { PlatformIcon } from './PlatformIcons';

const platforms = ['whatsapp', 'instagram', 'discord', 'x', 'messenger', 'telegram', 'snapchat', 'tiktok', 'reddit', 'slack'];

export const DoodleBackground = ({ color = "text-white" }: { color?: string }) => {
    const doodles = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            platform: platforms[i % platforms.length],
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            rotation: `${Math.random() * 360}deg`,
            size: `${Math.random() * 20 + 20}px`,
            opacity: Math.random() * 0.15 + 0.08,
            delay: `${Math.random() * 5}s`
        }));
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {doodles.map((d) => (
                <div
                    key={d.id}
                    className="absolute transition-transform duration-[10s] ease-in-out animate-pulse"
                    style={{
                        top: d.top,
                        left: d.left,
                        transform: `rotate(${d.rotation})`,
                        opacity: d.opacity,
                        animationDelay: d.delay
                    }}
                >
                    <PlatformIcon platform={d.platform as any} className={color} style={{ width: d.size, height: d.size }} />
                </div>
            ))}
        </div>
    );
};
