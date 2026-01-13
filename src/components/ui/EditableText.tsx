import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
    inputClassName?: string;
    multiline?: boolean;
    disabled?: boolean;
    displayValue?: React.ReactNode;
}

export const EditableText: React.FC<EditableTextProps> = ({
    value,
    onSave,
    className,
    inputClassName,
    multiline = false,
    disabled = false,
    displayValue
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            if ('select' in inputRef.current) {
                inputRef.current.select();
            }
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue !== value) {
            onSave(tempValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (!multiline || e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleBlur();
        }
        if (e.key === 'Escape') {
            setTempValue(value);
            setIsEditing(false);
        }
    };

    if (disabled) {
        return <span className={className}>{value}</span>;
    }

    if (isEditing) {
        if (multiline) {
            return (
                <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "w-full bg-transparent border-none outline-none ring-1 ring-primary/30 rounded p-1 resize-none focus:ring-primary",
                        inputClassName
                    )}
                    rows={Math.max(1, tempValue.split('\n').length)}
                />
            );
        }
        return (
            <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={cn(
                    "w-full bg-transparent border-none outline-none ring-1 ring-primary/30 rounded p-0.5 focus:ring-primary",
                    inputClassName
                )}
            />
        );
    }

    return (
        <span
            onClick={() => setIsEditing(true)}
            className={cn(
                "cursor-text hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors inline-block min-w-[1ch]",
                className
            )}
            title="Click to edit"
        >
            {displayValue || value || <span className="text-muted-foreground italic">Empty</span>}
        </span>
    );
};
