import React, { useState, useEffect } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import { useUserStore } from '../store/userStore';
import NavBar from '../components/layout/NavBar';
import CreatePost from '../components/social/CreatePost';
import PostItem from '../components/social/PostItem';
import type { Post } from '../types';
import { fetchPosts } from '../services/postApi';

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Gọi API lấy danh sách bài viết
    useEffect(() => {
        setIsLoading(true);
        fetchPosts(0, 20)
            .then((data) => setPosts(data))
            .catch(() => setPosts([]))
            .finally(() => setIsLoading(false));
    }, []);

    // Lắng nghe sự kiện xóa bài viết qua SignalR
    useSignalR((import.meta.env.VITE_API_BASE_URL || '') + '/hubs/postHub', {
        NewPost: (post: any) => {
            setPosts(prev => [
                {
                    id: post.Id,
                    content: post.Content,
                    imageUrl: post.Imageurl ? `data:image/png;base64,${post.Imageurl}` : undefined,
                    createdAt: post.Createdat,
                    updatedAt: post.Createdat,
                    authorId: post.Authorid,
                    author: {
                        id: post.Authorid,
                        username: post.Authorname,
                        avatar: post.AuthorAvatar ? `data:image/png;base64,${post.AuthorAvatar}` : undefined,
                    },
                    commentCount: post.CommentCount,
                    likeCount: post.likeCount,
                    isLiked: false,
                },
                ...prev
            ]);
        },
        PostDeleted: (payload: { PostId: number }) => {
            console.log('SignalR PostDeleted event received:', payload);
            setPosts(prev => prev.filter(post => post.id !== String(payload.PostId)));
        },
        PostLiked: (payload: { PostId: number; UserId: string }) => {
            setPosts(prev => prev.map(post =>
                post.id === String(payload.PostId)
                    ? { ...post, likeCount: post.likeCount + 1 }
                    : post
            ));
        },
        PostUnliked: (payload: { PostId: number; UserId: string }) => {
            setPosts(prev => prev.map(post =>
                post.id === String(payload.PostId)
                    ? { ...post, likeCount: Math.max(0, post.likeCount - 1) }
                    : post
            ));
        },
        NewComment: (payload: { PostId: number }) => {
            setPosts(prev => prev.map(post =>
                post.id === String(payload.PostId)
                    ? { ...post, commentCount: post.commentCount + 1 }
                    : post
            ));
        },
        CommentDeleted: (payload: { PostId: number }) => {
            setPosts(prev => prev.map(post =>
                post.id === String(payload.PostId)
                    ? { ...post, commentCount: Math.max(0, post.commentCount - 1) }
                    : post
            ));
        },
    });

    const handleCreatePost = async (content: string, imageUrl?: string) => {
        // TODO: Replace with actual API call
        const newPost: Post = {
            id: Date.now().toString(),
            content,
            imageUrl,
            authorId: 'current-user',
            author: {
                id: 'current-user',
                username: 'Bạn',
                avatar: undefined,
            },
            likeCount: 0,
            commentCount: 0,
            isLiked: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setPosts(prev => [newPost, ...prev]);
    };

    const handleLike = async (postId: string) => {
        setPosts(prev => prev.map(post =>
            post.id === postId
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
                }
                : post
        ));
    };

    const handleComment = async (postId: string, content: string) => {
        // TODO: Implement comment functionality
        console.log('Comment on post:', postId, 'Content:', content);
        setPosts(prev => prev.map(post =>
            post.id === postId
                ? { ...post, commentCount: post.commentCount + 1 }
                : post
        ));
    };

    const handleShare = async (postId: string) => {
        // TODO: Implement share functionality
        console.log('Share post:', postId);
    };

    const { user } = useUserStore();
    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="max-w-2xl mx-auto py-6 px-4">
                <CreatePost onCreatePost={handleCreatePost} />

                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Đang tải...</p>
                    </div>
                ) : (
                    <div>
                        {posts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Chưa có bài đăng nào.</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <PostItem
                                    key={post.id}
                                    post={post}
                                    onLike={handleLike}
                                    onComment={handleComment}
                                    onShare={handleShare}
                                    isOwner={!!user && post.authorId === user?.id}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;