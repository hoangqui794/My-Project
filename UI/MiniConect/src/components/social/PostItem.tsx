import React, { useState } from 'react';
import type { Post } from '../../types';

interface PostItemProps {
    post: Post;
    onLike: (postId: string) => void;
    onComment: (postId: string, content: string) => void;
    onShare: (postId: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onLike, onComment, onShare }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleLike = () => {
        onLike(post.id);
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post.id, commentText);
            setCommentText('');
        }
    };

    const handleShare = () => {
        onShare(post.id);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            {/* Header */}
            <div className="flex items-center mb-4">
                {post.author.avatar ? (
                    <img
                        src={post.author.avatar}
                        alt={post.author.username}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <span className="text-gray-600 font-medium">
                            {post.author.username[0].toUpperCase()}
                        </span>
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-gray-900">{post.author.username}</h3>
                    <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                {post.imageUrl && (
                    <img
                        src={post.imageUrl}
                        alt="Post image"
                        className="mt-3 rounded-lg max-w-full h-auto"
                    />
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t pt-3">
                <div className="flex space-x-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-1 px-3 py-1 rounded ${post.isLiked
                                ? 'bg-red-100 text-red-600'
                                : 'hover:bg-gray-100 text-gray-600'
                            }`}
                    >
                        <span>{post.isLiked ? '❤️' : '🤍'}</span>
                        <span>{post.likeCount}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-gray-100 text-gray-600"
                    >
                        <span>💬</span>
                        <span>{post.commentCount}</span>
                    </button>

                    <button
                        onClick={handleShare}
                        className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-gray-100 text-gray-600"
                    >
                        <span>🔄</span>
                        <span>Chia sẻ</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 border-t pt-4">
                    <form onSubmit={handleComment} className="mb-4">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Viết bình luận..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                Gửi
                            </button>
                        </div>
                    </form>

                    {/* Comments would be rendered here */}
                    <div className="text-sm text-gray-500">
                        Bình luận sẽ được hiển thị ở đây...
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostItem;