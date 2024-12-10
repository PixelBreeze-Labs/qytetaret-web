"use client";
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
    Mic, Square, Camera, X, Loader2, CheckCircle,
    MapPin, ArrowLeft, ArrowRight, Eye, Save, Info
} from 'lucide-react';
import { CategoryReport } from '@/types';
import { ReportsService } from '@/services/api/reportsService';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { cn } from '@/lib/utils';

// Types
interface FormData {
    title: string;
    content: string;
    category: string;
    isAnonymous: boolean;
    media: File[];
    audio: Blob | null;
    location: {
        lat: number;
        lng: number;
        accuracy: number;
    };
}

type Step = 'category' | 'details' | 'media' | 'location' | 'review';

// Configuration
const STEPS: Step[] = ['category', 'details', 'media', 'location', 'review'];

const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '0.5rem'
};

const Progress = ({ currentStep }: { currentStep: Step }) => {
    const currentIndex = STEPS.indexOf(currentStep);
    const percentage = ((currentIndex + 1) / STEPS.length) * 100;
    const t = useTranslations('reports.form');
    return (
        <div className="w-full">
            <div className="flex justify-between mb-2">
                {STEPS.map((step, index) => (
                    <span
                        key={step}
                        className={cn(
                            "text-sm capitalize",
                            index <= currentIndex
                                ? "text-primary"
                                : "text-gray-400 dark:text-white/90"
                        )}
                    >
                        {t(`steps.${step}.label`)}
                    </span>
                ))}
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const StepNavigation = ({
                            canGoNext,
                            onBack,
                            onNext,
                            isLastStep,
                            isLoading,
                            isFirstStep  // Add this prop
                        }: {
    canGoNext: boolean;
    onBack: () => void;
    onNext: () => void;
    isLastStep: boolean;
    isLoading: boolean;
    isFirstStep: boolean;
}) => {

    const t = useTranslations('reports.form');
    return (
    <div className="flex justify-between mt-8 pt-6 border-t dark:border-gray-700">
        {!isFirstStep && (
            <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-gray-700 dark:text-white hover:text-gray-900 flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                {t('navigation.back')}
            </button>
        )}
        <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className={cn(
                "px-6 py-2 bg-primary text-white rounded-lg flex items-center gap-2 ml-auto", // Added ml-auto
                (!canGoNext || isLoading)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary/90"
            )}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                </>
            ) : (
                <>
                    {isLastStep ? 'Submit' : 'Next'}
                    <ArrowRight className="w-4 h-4" />
                </>
            )}
        </button>
    </div>
    );
};

// Individual Step Components
const CategoryStep = ({ form, onChange }: { form: FormData; onChange: (value: string) => void }) => {

        const t = useTranslations('reports.form');

        return (
    <div className="space-y-6">
        <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('steps.category.label')}</h2>
            <p className="text-gray-600 dark:text-white/80">{t('steps.category.description')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(CategoryReport).map(category => (
                <button
                    key={category}
                    type="button"
                    onClick={() => onChange(category)}
                    className={cn(
                        "p-4 rounded-lg border-2 transition-all text-left hover:bg-gray-50 dark:hover:bg-dark-4",
                        "text-gray-900 dark:text-white",
                        form.category === category
                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                            : "border-gray-200 dark:border-gray-700"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>
    </div>
        );
};

const DetailsStep = ({form, onChange}: { form: FormData; onChange: (field: string, value: string | boolean) => void }) => {
    const t = useTranslations('reports.form');

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <label className="block">
                    <span className="block text-sm font-medium mb-1.5 dark:text-white">
                        {t('steps.details.titleLabel')}
                    </span>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => onChange('title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-dark-4 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
                        placeholder={t('steps.details.titleInput')}
                    />
                </label>

                <label className="block">
                    <span className="block text-sm font-medium mb-1.5 dark:text-white">
                        {t('steps.details.description')}
                    </span>
                    <textarea
                        value={form.content}
                        onChange={(e) => onChange('content', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-dark-4 dark:border-gray-700 min-h-[150px] focus:ring-2 focus:ring-primary/50"
                        placeholder={t('steps.details.contentInput')}
                    />
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={form.isAnonymous}
                        onChange={(e) => onChange('isAnonymous', e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                    />
                    <span className="text-sm dark:text-white">
                        {t('steps.details.anonymousLabel')}
                    </span>
                </label>
            </div>
        </div>
    );
};

const MediaStep = ({
                       form,
                       onMediaAdd,
                       onMediaRemove,
                       onAudioRecord,
                       isRecording,
                       audioUrl
                   }: {
    form: FormData;
    onMediaAdd: (files: File[]) => void;
    onMediaRemove: (index: number) => void;
    onAudioRecord: () => void;
    isRecording: boolean;
    audioUrl: string | null;
}) => {
    const t = useTranslations('reports.form');

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold dark:text-white">
                    {t('steps.media.label')}
                </h2>

                <div className="border-2 border-dashed dark:border-gray-700 rounded-lg p-4">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files) {
                                onMediaAdd(Array.from(e.target.files));
                            }
                        }}
                        className="hidden"
                        id="media-upload"
                    />
                    <label
                        htmlFor="media-upload"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                        <Camera className="w-8 h-8 text-gray-400" />
                        <div className="text-gray-500 dark:text-gray-400">
                            {t('steps.media.uploadText')}
                        </div>
                        <div className="text-sm text-gray-400">
                            {t('steps.media.uploadSpecs')}
                        </div>
                    </label>

                    {form.media.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {Array.from(form.media).map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={t('steps.media.preview')}
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onMediaRemove(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 bg-gray-50 dark:bg-dark-4 rounded-lg p-4">
                    <button
                        type="button"
                        onClick={onAudioRecord}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors",
                            isRecording
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-primary hover:bg-primary/90"
                        )}
                    >
                        {isRecording ? (
                            <>
                                <Square className="w-4 h-4" />
                                {t('steps.media.stopRecording')}
                            </>
                        ) : (
                            <>
                                <Mic className="w-4 h-4" />
                                {t('steps.media.startRecording')}
                            </>
                        )}
                    </button>

                    {audioUrl && (
                        <audio controls src={audioUrl} className="flex-1" />
                    )}
                </div>
            </div>
        </div>
    );
};

const LocationStep = ({ form, onChange }: { form: FormData; onChange: (lat: number, lng: number) => void }) => {
    const t = useTranslations('reports.form');
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
    });

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold dark:text-white">
                    {t('steps.location.label')}
                </h2>
                <p className="text-gray-600 dark:text-white/90">
                    {t('steps.location.description')}
                </p>
            </div>

            {isLoaded ? (
                <div className="rounded-lg overflow-hidden">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={form.location}
                        zoom={13}
                        onClick={(e) => {
                            if (e.latLng) {
                                onChange(e.latLng.lat(), e.latLng.lng());
                            }
                        }}
                    >
                        <MarkerF position={form.location} />
                    </GoogleMap>
                </div>
            ) : (
                <div className="h-[300px] bg-gray-100 dark:bg-dark-4 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    {t('steps.location.loading')}
                </div>
            )}
        </div>
    );
};

const ReviewStep = ({ form }: { form: FormData }) => {
    const t = useTranslations('reports.form');

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold dark:text-white">
                    {t('steps.review.label')}
                </h2>
                <p className="text-gray-600 dark:text-white/90">
                    {t('steps.review.description')}
                </p>
            </div>

            <div className="space-y-4 bg-gray-50 dark:bg-dark-4 rounded-lg p-4">
                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('steps.review.category')}
                    </span>
                    <div className="font-medium dark:text-white">{form.category}</div>
                </div>

                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('steps.review.title')}
                    </span>
                    <div className="font-medium dark:text-white">{form.title}</div>
                </div>

                <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('steps.review.description')}
                    </span>
                    <div className="font-medium dark:text-white whitespace-pre-wrap">{form.content}</div>
                </div>

                {form.media.length > 0 && (
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t('steps.review.media')}
                        </span>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                            {Array.from(form.media).map((file, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(file)}
                                    alt={t('steps.review.preview')}
                                    className="w-full h-20 object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {form.audio && (
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t('steps.review.audio')}
                        </span>
                        <audio controls src={URL.createObjectURL(form.audio)} className="mt-2 w-full" />
                    </div>
                )}
            </div>
        </div>
    );
};

export const ReportFormMain = () => {
    const t = useTranslations('reports.form');
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>('category');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraft, setIsDraft] = useState(false);

    // Media states
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const [form, setForm] = useState<FormData>({
        title: '',
        content: '',
        category: '',
        isAnonymous: false,
        media: [],
        audio: null,
        location: {
            lat: 41.3275,
            lng: 19.8187,
            accuracy: 0
        }
    });

    // Load draft on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('reportDraft');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                setForm(prevForm => ({
                    ...prevForm,
                    ...draft,
                    // Reset file-based fields as they can't be stored in localStorage
                    media: [],
                    audio: null
                }));
                setIsDraft(true);
            } catch (e) {
                console.error('Error loading draft:', e);
            }
        }
    }, []);

    // Auto-save draft
    useEffect(() => {
        if (Object.values(form).some(value => value)) {
            const draftData = {
                ...form,
                media: [],  // Don't store files
                audio: null // Don't store audio blob
            };
            localStorage.setItem('reportDraft', JSON.stringify(draftData));
            setIsDraft(true);
        }
    }, [form]);

    // Audio recording handlers
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = e => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setForm(prev => ({ ...prev, audio: blob }));
                setAudioUrl(URL.createObjectURL(blob));
            };

            setMediaRecorder(recorder);
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            setError('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const handleAudioToggle = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Form navigation handlers
    const canGoNext = () => {
        switch (currentStep) {
            case 'category':
                return !!form.category;
            case 'details':
                return !!form.title && !!form.content;
            case 'media':
                return true; // Media is optional
            case 'location':
                return form.location.lat !== 0 && form.location.lng !== 0;
            case 'review':
                return true;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep === 'review') {
            handleSubmit();
            return;
        }

        const currentIndex = STEPS.indexOf(currentStep);
        if (currentIndex < STEPS.length - 1) {
            setCurrentStep(STEPS[currentIndex + 1]);
        }
    };

    const handleBack = () => {
        const currentIndex = STEPS.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(STEPS[currentIndex - 1]);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('title', form.title.trim());
            formData.append('content', form.content.trim());
            formData.append('category', form.category);
            formData.append('isAnonymous', String(form.isAnonymous));
            formData.append('location', JSON.stringify(form.location));

            form.media.forEach((file) => {
                formData.append('media', file);
            });

            if (form.audio) {
                formData.append('audio', form.audio);
            }

            await ReportsService.create(formData);

            // Clear draft and redirect
            localStorage.removeItem('reportDraft');
            router.push('/reports');

        } catch (err: any) {
            setError(err.message || 'Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    const currentStepContent = () => {
        switch (currentStep) {
            case 'category':
                return (
                    <CategoryStep
                        form={form}
                        onChange={(value) => setForm(prev => ({ ...prev, category: value }))}
                    />
                );
            case 'details':
                return (
                    <DetailsStep
                        form={form}
                        onChange={(field, value) => setForm(prev => ({ ...prev, [field]: value }))}
                    />
                );
            case 'media':
                return (
                    <MediaStep
                        form={form}
                        onMediaAdd={(files) => setForm(prev => ({ ...prev, media: [...prev.media, ...files] }))}
                        onMediaRemove={(index) => {
                            setForm(prev => ({
                                ...prev,
                                media: prev.media.filter((_, i) => i !== index)
                            }));
                        }}
                        onAudioRecord={handleAudioToggle}
                        isRecording={isRecording}
                        audioUrl={audioUrl}
                    />
                );
            case 'location':
                return (
                    <LocationStep
                        form={form}
                        onChange={(lat, lng) => setForm(prev => ({
                            ...prev,
                            location: { ...prev.location, lat, lng }
                        }))}
                    />
                );
            case 'review':
                return <ReviewStep form={form} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-dark-3 rounded-lg shadow-lg">
            <div className="p-6 border-b dark:border-gray-700">
                <Progress currentStep={currentStep} />
            </div>

            <div className="p-6">
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {isDraft && (
                    <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-white px-4 py-3 rounded-lg flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Draft saved automatically
                    </div>
                )}

                {currentStepContent()}

                <StepNavigation
                    canGoNext={canGoNext()}
                    onBack={handleBack}
                    onNext={handleNext}
                    isLastStep={currentStep === 'review'}
                    isLoading={loading}
                    isFirstStep={currentStep === 'category'} // Add this
                />
            </div>
        </div>
    );
};