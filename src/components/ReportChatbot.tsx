import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Camera, Loader2, SendHorizontal } from 'lucide-react';
import { CategoryReport } from '@/types';
import { Button } from '@/components/ui/Button';
import ChatCard from '@/components/ChatCard';
import { useTranslations } from 'next-intl';

interface ReportChatbotProps {
    onClose: () => void;
}

interface Message {
    type: 'bot' | 'user';
    content: string;
    options?: string[];
    media?: string[];
    audio?: string;
    summary?: any;
}

interface FormData {
    title: string;
    category: string;
    content: string;
    media: File[];
    isAnonymous: boolean;
    audio: Blob | null;
}

const ReportChatbot: React.FC<ReportChatbotProps> = ({ onClose }) => {
    const t = useTranslations('reports.form');

    const [messages, setMessages] = useState<Message[]>([
        { type: 'bot', content: t('description') }
    ]);
    const [userInput, setUserInput] = useState('');
    const [currentStep, setCurrentStep] = useState('title');
    const [formData, setFormData] = useState<FormData>({
        title: '',
        category: '',
        content: '',
        media: [],
        isAnonymous: false,
        audio: null
    });
    const [loading, setLoading] = useState(false);
    const [mediaPreview, setMediaPreview] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!userInput.trim() && currentStep !== 'media') return;

        const newMessages = [...messages];

        if (userInput.trim()) {
            newMessages.push({ type: 'user', content: userInput });
        }

        switch (currentStep) {
            case 'title':
                setFormData(prev => ({ ...prev, title: userInput }));
                newMessages.push({
                    type: 'bot',
                    content: t('fields.category.label'),
                    options: Object.values(CategoryReport)
                });
                setCurrentStep('category');
                break;

            case 'category':
                setFormData(prev => ({ ...prev, category: userInput }));
                newMessages.push({
                    type: 'bot',
                    content: t('fields.description.placeholder')
                });
                setCurrentStep('content');
                break;

            case 'content':
                setFormData(prev => ({ ...prev, content: userInput }));
                newMessages.push({
                    type: 'bot',
                    content: t('fields.evidence.label'),
                    options: [
                        t('fields.evidence.upload.text'),
                        t('fields.evidence.voice.start'),
                        'Skip'
                    ]
                });
                setCurrentStep('media');
                break;

            case 'media':
                if (userInput === 'Skip' || !userInput) {
                    newMessages.push({
                        type: 'bot',
                        content: t('fields.anonymous'),
                        options: [t('anonymousYes'), t('anonymousNo')]
                    });
                    setCurrentStep('anonymous');
                }
                break;

            case 'anonymous':
                setFormData(prev => ({
                    ...prev,
                    isAnonymous: userInput === t('anonymousYes')
                }));
                newMessages.push({
                    type: 'bot',
                    content: t('description'),
                    summary: formData,
                    options: [t('submit'), t('cancel')]
                });
                setCurrentStep('confirm');
                break;

            case 'confirm':
                if (userInput === t('submit')) {
                    setLoading(true);
                    try {
                        // Add submission logic here
                        newMessages.push({
                            type: 'bot',
                            content: t('successSubmit')
                        });
                        setCurrentStep('complete');
                        setTimeout(() => {
                            onClose();
                        }, 2000);
                    } catch (error) {
                        newMessages.push({
                            type: 'bot',
                            content: t('errors.submit')
                        });
                    } finally {
                        setLoading(false);
                    }
                } else if (userInput === t('cancel')) {
                    onClose();
                }
                break;
        }

        setMessages(newMessages);
        setUserInput('');
        setTimeout(scrollToBottom, 100);
    };

    const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const validFiles = Array.from(files).filter(file => {
            const isValid = file.type.startsWith('image/');
            const isUnderLimit = file.size <= 5 * 1024 * 1024;
            return isValid && isUnderLimit;
        });

        if (validFiles.length === 0) {
            setMessages(prev => [...prev, {
                type: 'bot',
                content: t('errors.validation.media.type')
            }]);
            return;
        }

        setFormData(prev => ({
            ...prev,
            media: [...prev.media, ...validFiles]
        }));

        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setMediaPreview(prev => [...prev, ...newPreviews]);

        setMessages(prev => [...prev, {
            type: 'user',
            content: t('fields.evidence.upload.text'),
            media: newPreviews
        }]);

        setTimeout(scrollToBottom, 100);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = e => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                if (blob.size > 10 * 1024 * 1024) {
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        content: t('errors.validation.audio.size')
                    }]);
                    return;
                }

                setFormData(prev => ({ ...prev, audio: blob }));
                setAudioUrl(URL.createObjectURL(blob));

                setMessages(prev => [...prev, {
                    type: 'user',
                    content: t('fields.evidence.voice.start'),
                    audio: URL.createObjectURL(blob)
                }]);

                setTimeout(scrollToBottom, 100);
            };

            setMediaRecorder(recorder);
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: t('errors.server.BAD_REQUEST')
            }]);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    return (
        <ChatCard
            title={t('title')}
            messages={messages}
            onClose={onClose}
            onOptionSelect={(option) => {
                setUserInput(option);
                handleSend();
            }}
        >
            <div className="w-full space-y-4">
                {currentStep === 'media' && (
                    <div className="flex gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleMediaUpload}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Camera className="w-4 h-4 mr-2" />
                            {t('fields.evidence.upload.text')}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            {isRecording ? <Square className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                            {isRecording ? t('fields.evidence.voice.stop') : t('fields.evidence.voice.start')}
                        </Button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={t('fields.description.placeholder')}
                        className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={loading || currentStep === 'complete'}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={loading || currentStep === 'complete'}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <SendHorizontal className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>
        </ChatCard>
    );
};

export default ReportChatbot;