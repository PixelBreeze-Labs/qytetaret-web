"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {Mic, Square, Camera, X, Loader2, CheckCircle} from 'lucide-react';
import { CategoryReport } from '@/types';
import { ReportsService } from '@/services/api/reportsService';

export const ReportFormMain = () => {
    const t = useTranslations('reports.form');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(true);

    const [form, setForm] = useState({
        title: '',
        content: '',
        category: '',
        isAnonymous: false,
        media: [] as File[],
        audio: null as Blob | null,
        location: {
            lat: 0,
            lng: 0,
            accuracy: 0
        }
    });

    const [error, setError] = useState<string | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    useEffect(() => {
        // Get user location on mount
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setForm(prev => ({
                    ...prev,
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    }
                }));
                setLocationLoading(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                setError(t('errors.location'));
                setLocationLoading(false);
            }
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Client-side validation
            if (!form.title.trim()) {
                throw new Error(t('errors.validation.title'));
            }
            if (!form.content.trim()) {
                throw new Error(t('errors.validation.content'));
            }
            if (!form.category) {
                throw new Error(t('errors.validation.category'));
            }

            const formData = new FormData();
            formData.append('title', form.title.trim());
            formData.append('content', form.content.trim());
            formData.append('category', form.category);
            formData.append('isAnonymous', String(form.isAnonymous));

            formData.append('location.lat', String(form.location.lat));
            formData.append('location.lng', String(form.location.lng));
            formData.append('location.accuracy', String(form.location.accuracy));

            form.media.forEach((file) => {
                formData.append('media', file);
            });

            if (form.audio) {
                formData.append('audio', form.audio);
            }

            const createdReport = await ReportsService.create(formData);

            // Show success message
            setSuccessMessage(t('successSubmit'));

            // Redirect after a short delay to allow user to see success message
            setTimeout(() => {
                router.push('/reports');
            }, 2000);
        } catch (err: any) {

            // Handle backend validation errors
            if (err.response?.statusCode === 401) {
                // Assuming backend returns { message: string, errors: { field: string[] }[] }
                const data = await err.response.json();
                if (data.errors) {
                    // Show first validation error
                    const firstError = Object.values(data.errors)[0];
                    setError(t(`errors.validation.${firstError}`));
                    return;
                }
            }

            // Handle other known errors
            if (err.response?.status === 401) {
                setError(t('errors.server.UNAUTHORIZED'));
                return;
            }

            // Handle general errors
            setError(err.message || t('errors.submit'));
        } finally {
            setLoading(false);
        }
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // Validate file types and size
        const validFiles = Array.from(files).filter(file => {
            const isValid = file.type.startsWith('image/');
            const isUnderLimit = file.size <= 5 * 1024 * 1024; // 5MB limit
            return isValid && isUnderLimit;
        });

        if (validFiles.length !== files.length) {
            setError(t('errors.invalidFiles'));
            return;
        }

        setForm(prev => ({ ...prev, media: [...prev.media, ...validFiles] }));
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setMediaPreview(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(mediaPreview[index]); // Clean up
        setMediaPreview(prev => prev.filter((_, i) => i !== index));
        setForm(prev => ({
            ...prev,
            media: prev.media.filter((_, i) => i !== index)
        }));
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            });

            const chunks: BlobPart[] = [];
            recorder.ondataavailable = e => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                if (blob.size > 10 * 1024 * 1024) { // 10MB limit
                    setError(t('errors.audioTooLarge'));
                    return;
                }
                setForm(prev => ({ ...prev, audio: blob }));
                setAudioUrl(URL.createObjectURL(blob));
            };

            setMediaRecorder(recorder);
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError(t('errors.microphone'));
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
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown">
            <div className="p-6 border-b dark:border-gray-800">
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
            </div>

            {error && (
                <div className="mx-6 mt-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label className="block mb-2 font-medium">{t('fields.title.label')}</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
                        required
                        placeholder={t('fields.title.placeholder')}
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">{t('fields.category.label')}</label>
                    <select
                        value={form.category}
                        onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
                        required
                    >
                        <option value="">{t('fields.category.placeholder')}</option>
                        {/* Assuming Category is an enum imported from types */}
                        {Object.values(CategoryReport).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">{t('fields.description.label')}</label>
                    <textarea
                        value={form.content}
                        onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 min-h-[150px] focus:ring-2 focus:ring-primary/50"
                        required
                        placeholder={t('fields.description.placeholder')}
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">{t('fields.evidence.label')}</label>
                    <div className="space-y-4">
                        <div className="border-2 border-dashed dark:border-gray-700 rounded-lg p-4">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleMediaChange}
                                className="hidden"
                                id="media-upload"
                            />
                            <label
                                htmlFor="media-upload"
                                className="cursor-pointer flex flex-col items-center justify-center gap-2"
                            >
                                <Camera className="w-8 h-8 text-gray-400" />
                                <div className="text-gray-500">{t('fields.evidence.upload.text')}</div>
                                <div className="text-sm text-gray-400">{t('fields.evidence.upload.specs')}</div>
                            </label>

                            {mediaPreview.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    {mediaPreview.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt="Preview"
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <button
                                type="button"
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                    isRecording
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-primary hover:bg-primary/90'
                                } text-white transition-colors`}
                            >
                                {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                {isRecording
                                    ? t('fields.evidence.voice.stop')
                                    : t('fields.evidence.voice.start')
                                }
                            </button>

                            {audioUrl && (
                                <audio controls src={audioUrl} className="flex-1" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <input
                        type="checkbox"
                        id="anonymous"
                        checked={form.isAnonymous}
                        onChange={(e) => setForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="anonymous" className="ml-2 text-gray-700 dark:text-gray-300">
                        {t('fields.anonymous')}
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading || locationLoading}
                    className={`w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2
                    ${(loading || locationLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t('submitting')}
                        </>
                    ) : (
                        t('submit')
                    )}
                </button>

                {/* Success message */}
                {successMessage && (
                    <div className="mx-6 mt-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
};