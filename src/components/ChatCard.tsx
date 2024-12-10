import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

interface Message {
    type: 'bot' | 'user';
    content: string;
    options?: string[];
    media?: string[];
    audio?: string;
    summary?: any;
}

interface ChatCardProps {
    title?: string;
    messages: Message[];
    onClose: () => void;
    onOptionSelect: (option: string) => void;
    children: React.ReactNode;
}

const ChatMessage = ({ message, onOptionSelect }: { message: Message; onOptionSelect: (option: string) => void }) => {
    const t = useTranslations('reports.form');
    const isBot = message.type === 'bot';

    return (
        <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
            {isBot && (
                <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10">
                        <Bot className="w-4 h-4 text-primary" />
                    </AvatarFallback>
                </Avatar>
            )}

            <div className={`flex flex-col gap-2 max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
                <div className={`p-3 rounded-lg ${
                    isBot
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        : 'bg-primary text-primary-foreground'
                }`}>
                    <p className="text-sm">{message.content}</p>

                    {message.options && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {message.options.map((option, index) => (
                                <Button
                                    key={index}
                                    variant="secondary"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => onOptionSelect(option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    )}

                    {message.media && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {message.media.map((url, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={url}
                                        alt={t('fields.evidence.upload.text')}
                                        className="w-full h-16 object-cover rounded"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {message.audio && (
                        <div className="mt-2">
                            <audio controls src={message.audio} className="w-full h-8" />
                        </div>
                    )}

                    {message.summary && (
                        <div className="mt-2 space-y-2 text-sm">
                            <p><strong>{t('fields.title.label')}:</strong> {message.summary.title}</p>
                            <p><strong>{t('fields.category.label')}:</strong> {message.summary.category}</p>
                            <p><strong>{t('fields.description.label')}:</strong> {message.summary.content}</p>
                            <p><strong>{t('fields.anonymous')}:</strong> {message.summary.isAnonymous ? t('anonymousYes') : t('anonymousNo')}</p>
                        </div>
                    )}
                </div>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {!isBot && (
                <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10">
                        <User className="w-4 h-4 text-primary" />
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    );
};

const ChatCard: React.FC<ChatCardProps> = ({
                                               title = "Chat",
                                               messages = [],
                                               onClose,
                                               onOptionSelect,
                                               children
                                           }) => {
    const t = useTranslations('reports.form');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <Card className="w-full shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold text-lg">{title}</h2>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X className="w-4 h-4" />
                </Button>
            </CardHeader>

            <CardContent className="p-4 h-96 overflow-y-auto space-y-4 scroll-pt-4">
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message}
                        onOptionSelect={onOptionSelect}
                    />
                ))}
                <div ref={messagesEndRef} className="h-1" />
            </CardContent>

            <CardFooter className="p-4 border-t">
                {children}
            </CardFooter>
        </Card>
    );
};

export default ChatCard;