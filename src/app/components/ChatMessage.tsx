import { useState, useEffect } from 'react';

interface ChatMessageProps {
    message: string;
    isUser: boolean;
    isTyping: boolean;
}

export default function ChatMessage({ message, isUser, isTyping }: ChatMessageProps) {
    const [displayedText, setDisplayedText] = useState<string>('');
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        if (!isUser && !isTyping && message) {
            const timer = setTimeout(() => {
                if (currentIndex < message.length) {
                    setDisplayedText(message.slice(0, currentIndex + 1));
                    setCurrentIndex(currentIndex + 1);
                }
            }, 20);

            return () => clearTimeout(timer);
        } else if (isUser) {
            setDisplayedText(message);
        }
    }, [currentIndex, message, isUser, isTyping]);

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
            >
                {isTyping ? (
                    <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap">{displayedText}</p>
                )}
            </div>
        </div>
    );
}