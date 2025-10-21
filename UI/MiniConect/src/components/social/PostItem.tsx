import React, { useState } from 'react';
import type { Post } from '../../types';

interface PostItemProps {
    post: Post;
    onLike: (postId: string) => void;
    onComment: (postId: string, content: string) => void;
    onShare: (postId: string) => void;
    onDelete?: (postId: string) => void;
    isOwner?: boolean;
}

import { deletePost } from '../../services/postApi';
const PostItem: React.FC<PostItemProps> = ({ post, onLike, onComment, onShare, onDelete, isOwner }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 relative">
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
                {/* Menu 3 chấm */}
                {isOwner && (
                    <div className="ml-auto relative">
                        <button
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                            onClick={() => setShowMenu((v) => !v)}
                            aria-label="Menu"
                        >
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg z-10 border border-gray-100 animate-fadeIn">
                                <button
                                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-700 font-semibold rounded-xl"
                                    disabled={isDeleting}
                                    onClick={() => setShowConfirm(true)}
                                >
                                    {isDeleting ? 'Đang xóa...' : 'Xóa bài viết'}
                                </button>
                            </div>
                        )}
                        {/* Modal xác nhận xóa bài viết */}
                        {showConfirm && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs relative animate-fadeIn">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Xác nhận xóa bài viết</h3>
                                    <p className="text-gray-700 mb-6 text-center">Bạn có chắc muốn xóa bài viết này?</p>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
                                            disabled={isDeleting}
                                            onClick={async () => {
                                                console.log('Xóa bài viết:', post.id);
                                                setIsDeleting(true);
                                                try {
                                                    await deletePost(post.id);
                                                    if (onDelete) onDelete(post.id);
                                                } catch (e) {
                                                    alert('Xóa bài viết thất bại!');
                                                }
                                                setIsDeleting(false);
                                                setShowConfirm(false);
                                                setShowMenu(false);
                                            }}
                                        >
                                            {isDeleting ? 'Đang xóa...' : 'Xóa'}
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                                            onClick={() => setShowConfirm(false)}
                                            disabled={isDeleting}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
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