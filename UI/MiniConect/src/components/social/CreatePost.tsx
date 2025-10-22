
import React, { useState } from 'react';

interface CreatePostProps {
    onCreatePost: (content: string, imageFile?: File | null) => Promise<void>;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost }) => {
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            await onCreatePost(content, imageFile);
            setContent('');
            setImageFile(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Bạn đang nghĩ gì?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                        required
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {imageFile && (
                    <div className="mb-4">
                        <img
                            src={URL.createObjectURL(imageFile)}
                            alt="Preview"
                            className="max-w-full h-48 object-cover rounded-md"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {content.length}/500 ký tự
                    </div>
                    <button
                        type="submit"
                        disabled={!content.trim() || isLoading || content.length > 500}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Đang đăng...' : 'Đăng bài'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;