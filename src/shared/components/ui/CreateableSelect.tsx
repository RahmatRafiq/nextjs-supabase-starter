'use client';

import { useState, KeyboardEvent, useRef } from 'react';
import { X, Info } from 'lucide-react';

interface CreateableSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function CreateableSelect({
    value = [],
    onChange,
    placeholder = 'Type and press Enter...',
    className = '',
}: CreateableSelectProps) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeTag(value.length - 1);
        }
    };

    const addTag = () => {
        const tag = inputValue.trim();
        if (tag && !value.includes(tag)) {
            onChange([...value, tag]);
            setInputValue('');
        } else if (tag === '' && inputValue.trim() === '') {
            // Just plain space or clear
            setInputValue('');
        }
    };

    const removeTag = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    return (
        <div className="space-y-1.5">
            <div
                className={`flex flex-wrap items-center gap-2 p-2 bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent ${className}`}
                onClick={() => inputRef.current?.focus()}
            >
                {value.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-green-100 text-green-800 rounded-md animate-in fade-in zoom-in duration-200"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeTag(index);
                            }}
                            className="text-green-600 hover:text-green-800 focus:outline-none"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}

                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm placeholder-gray-400 focus:ring-0 p-1"
                    placeholder={value.length === 0 ? placeholder : ''}
                />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 px-1">
                <Info className="w-3.5 h-3.5" />
                <span>Press Space, Enter, or Comma to add tags</span>
            </div>
        </div>
    );
}
