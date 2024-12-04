// components/ReportForm.tsx
"use client";

import { useState } from 'react';
import { Category } from '@/types';
import { useRouter } from 'next/navigation';

export const ReportForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        content: '',
        category: '',
        isAnonymous: false,
        media: [] as File[],
        location: {
            lat: 0,
            lng: 0,
            accuracy: 0
        }
    });

    const [error, setError] = useState<string | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string[]>([]);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setForm(prev => ({ ...prev, media: [...prev.media, ...newFiles] }));

            // Create preview URLs
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setMediaPreview(prev => [...prev, ...newPreviews]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // TODO: Add API call
            router.push('/reports');
        } catch (err) {
            setError('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Submit New Report</h1>
                    <p className="text-gray-600 dark:text-gray-400">Report an issue in your community</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 font-medium">Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Description</label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700 min-h-[150px]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                            required
                        >
                            <option value="">Select a category</option>
                            {Object.values(Category).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Media</label>
                        <div className="border-2 border-dashed rounded-lg p-4">
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
                                className="cursor-pointer flex flex-col items-center justify-center"
                            >
                                <div className="text-gray-500">
                                    Click to upload or drag and drop
                                </div>
                                <div className="text-sm text-gray-400">
                                    PNG, JPG up to 10MB each
                                </div>
                            </label>

                            {mediaPreview.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    {mediaPreview.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt="Preview"
                                            className="w-full h-24 object-cover rounded"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="anonymous"
                            checked={form.isAnonymous}
                            onChange={(e) => setForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                            className="rounded border-gray-300"
                        />
                        <label htmlFor="anonymous" className="ml-2">
                            Submit anonymously
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors
                                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};