// src/components/reports/ReportForm.tsx
"use client";
import { useState } from 'react';
import { Category } from '@/types';
import { MapPin, Camera, FileText } from 'lucide-react';

export function ReportForm() {
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [category, setCategory] = useState<Category>(Category.OTHER);
    const [content, setContent] = useState('');
    const [media, setMedia] = useState<File[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement submission logic
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
                Create a New Report
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={() => setIsAnonymous(!isAnonymous)}
                            className="mr-2"
                        />
                        <span>Post Anonymously</span>
                    </label>
                </div>

                {!isAnonymous && (
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Your Name (Optional)"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                )}

                <div className="mb-4">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        {Object.values(Category).map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
          <textarea
              placeholder="Describe your report..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
          />
                </div>

                <div className="mb-4 flex space-x-4">
                    <label className="flex-grow flex items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer">
                        <Camera className="mr-2" />
                        <span>Upload Media</span>
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setMedia(Array.from(e.target.files));
                                }
                            }}
                        />
                    </label>
                </div>

                {media.length > 0 && (
                    <div className="mb-4 grid grid-cols-3 gap-2">
                        {media.map((file, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Media preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-md"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center mb-4">
                    <MapPin className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">
            Location will be automatically detected
          </span>
                </div>

                <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition"
                >
                    Submit Report
                </button>
            </form>
        </div>
    );
}
