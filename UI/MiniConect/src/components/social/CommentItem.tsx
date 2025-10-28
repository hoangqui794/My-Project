import React, { useState } from 'react';
import { deleteComment } from '../../services/postApi';
import type { Comment } from '../../types/post.types';

interface CommentItemProps {
    comment: Comment;
    postId: string;
    isOwner?: boolean;
    onDeleted?: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, postId, isOwner, onDeleted }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteComment(postId, comment.id);
            if (onDeleted) onDeleted(comment.id);
        } catch (err) {
            alert('Xóa bình luận thất bại!');
        }
        setIsDeleting(false);
        setShowConfirm(false);
    };

    return (
        <li className="border-b pb-2 flex gap-2 items-start">
            {comment.author.avatar ? (
                <img
                    src={comment.author.avatar}
                    alt={comment.author.username || 'avatar'}
                    className="w-8 h-8 rounded-full mt-1"
                />
            ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mt-1">
                    <span className="text-gray-600 font-medium text-base">
                        {comment.author.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                </div>
            )}
            <div className="flex-1">
                <div className="font-semibold">{comment.author.username || 'Ẩn danh'}</div>
                <div>{comment.content}</div>
                <div className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</div>
            </div>
            {isOwner && (
                <>
                    <button
                        className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50"
                        onClick={() => setShowConfirm(true)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Đang xóa...' : 'Xóa'}
                    </button>
                    {showConfirm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs relative animate-fadeIn">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Xác nhận xóa bình luận</h3>
                                <p className="text-gray-700 mb-6 text-center">Bạn có chắc muốn xóa bình luận này?</p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
                                        disabled={isDeleting}
                                        onClick={handleDelete}
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
                </>
            )}
        </li>
    );
};

export default CommentItem;
