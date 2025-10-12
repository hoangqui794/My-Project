import React, { useState, useEffect } from 'react';
import NavBar from '../components/layout/NavBar';
import CreatePost from '../components/social/CreatePost';
import PostItem from '../components/social/PostItem';
import type { Post } from '../types';

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mock data - replace with actual API calls
    useEffect(() => {
        const mockPosts: Post[] = [
            {
                id: '1',
                content: 'Chào mọi người! Đây là bài đăng đầu tiên của tôi trên MiniConnect.',
                authorId: '1',
                author: {
                    id: '1',
                    username: 'user1',
                    avatar: undefined,
                },
                likeCount: 5,
                commentCount: 2,
                isLiked: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: '2',
                content: 'Hôm nay thời tiết thật đẹp! 🌞',
                authorId: '2',
                author: {
                    id: '2',
                    username: 'user2',
                    avatar: undefined,
                },
                likeCount: 12,
                commentCount: 4,
                isLiked: true,
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                updatedAt: new Date(Date.now() - 3600000).toISOString(),
            },
        ];

        setTimeout(() => {
            setPosts(mockPosts);
            setIsLoading(false);
        }, 1000);
    }, []);

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