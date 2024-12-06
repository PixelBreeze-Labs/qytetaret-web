"use client";
import { useState } from 'react';
import { Category } from '@/types';
import { useRouter } from 'next/navigation';
import { Mic, Square, Camera, X } from 'lucide-react';

export const ReportFormMain = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setForm(prev => ({ ...prev, media: [...prev.media, ...newFiles] }));
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setMediaPreview(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setMediaPreview(prev => prev.filter((_, i) => i !== index));
        setForm(prev => ({
            ...prev,
            media: prev.media.filter((_, i) => i !== index)
        }));
    };

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
            console.error("Error accessing microphone:", err);
            setError("Failed to access microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('content', form.content);
        formData.append('category', form.category);
        formData.append('isAnonymous', String(form.isAnonymous));
        form.media.forEach((file, index) => {
            formData.append(`media_${index}`, file);
        });
        if (form.audio) {
            formData.append('audio', form.audio);
        }

        try {
            // TODO: Add API call with formData
            router.push('/reports');
        } catch (err) {
            setError('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-dropdown">
            <div className="p-6 border-b dark:border-gray-800">
                <h1 className="text-2xl font-bold">Submit New Report</h1>
                <p className="text-gray-600 dark:text-gray-400">Report an issue in your community</p>
            </div>

            {error && (
                <div className="mx-6 mt-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                    <label className="block mb-2 font-medium">Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
                        required
                        placeholder="Brief description of the issue"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Category</label>
                    <select
                        value={form.category}
                        onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
                        required
                    >
                        <option value="">Select a category</option>
                        {Object.values(Category).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Description</label>
                    <textarea
                        value={form.content}
                        onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 min-h-[150px] focus:ring-2 focus:ring-primary/50"
                        required
                        placeholder="Provide detailed information about the issue"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Evidence</label>
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
                                <div className="text-gray-500">Click to upload or drag images</div>
                                <div className="text-sm text-gray-400">PNG, JPG up to 10MB each</div>
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
                                {isRecording ? 'Stop Recording' : 'Start Recording'}
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
                        Submit anonymously
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Submitting...' : 'Submit Report'}
                </button>
            </form>
        </div>
    );
};