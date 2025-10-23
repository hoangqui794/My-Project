import React, { useState, useEffect } from 'react';
import { fetchUser } from '../services/userApi';
import { useSignalR } from '../hooks/useSignalR';
import { useUserStore } from '../store/userStore';
import NavBar from '../components/layout/NavBar';
import CreatePost from '../components/social/CreatePost';
import PostItem from '../components/social/PostItem';
import type { Post } from '../types';
import { fetchPosts } from '../services/postApi';

const HomePage: React.FC = () => {
    // Hàm xóa bài viết và cập nhật state trực tiếp
    const handleDeletePost = (postId: string) => {
        setPosts(prev => prev.filter(post => String(post.id) !== String(postId)));
    };
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
            console.log('SignalR NewPost event received:', post);
            setPosts(prev => [
                {
                    id: post.id,
                    content: post.content,
                    imageUrl: post.imageurl ? `data:image/png;base64,${post.imageurl}` : undefined,
                    createdAt: post.createdat,
                    updatedAt: post.createdat,
                    authorId: post.authorid,
                    author: {
                        id: post.authorid,
                        username: post.authorname,
                        avatar: post.authorAvatar ? `data:image/png;base64,${post.authorAvatar}` : undefined,
                    },
                    commentCount: post.commentCount,
                    likeCount: post.likeCount,
                    isLiked: false,
                },
                ...prev
            ]);
        },
        PostDeleted: (payload: { postId: number }) => {
            setPosts(prev => prev.filter(post => Number(post.id) !== payload.postId));
        },
        PostLiked: (payload: { postId: number; userId: string }) => {
            console.log('BUG: Nhận sự kiện PostLiked:', payload);
            // Chỉ cập nhật likeCount nếu userId khác user hiện tại
            if (!user || payload.userId !== user.id) {
                setPosts(prev => {
                    const newPosts = prev.map(post =>
                        Number(post.id) === payload.postId
                            ? { ...post, likeCount: post.likeCount + 1 }
                            : post
                    );
                    console.log('BUG: State sau khi cập nhật like:', newPosts);
                    return newPosts;
                });
            }
        },
        PostUnliked: (payload: { postId: number; userId: string }) => {
            console.log('BUG: Nhận sự kiện PostUnliked:', payload);
            if (!user || payload.userId !== user.id) {
                setPosts(prev => {
                    const newPosts = prev.map(post =>
                        Number(post.id) === payload.postId
                            ? { ...post, likeCount: Math.max(0, post.likeCount - 1) }
                            : post
                    );
                    console.log('BUG: State sau khi cập nhật unlike:', newPosts);
                    return newPosts;
                });
            }
        },
        NewComment: (payload: { postId: number }) => {
            setPosts(prev => prev.map(post =>
                Number(post.id) === payload.postId
                    ? { ...post, commentCount: post.commentCount + 1 }
                    : post
            ));
        },
        CommentDeleted: (payload: { postId: number }) => {
            setPosts(prev => prev.map(post =>
                Number(post.id) === payload.postId
                    ? { ...post, commentCount: Math.max(0, post.commentCount - 1) }
                    : post
            ));
        },
    });

    const handleCreatePost = async (content: string, imageFile?: File | null) => {
        setIsLoading(true);
        try {
            // Tạo bài viết mới
            await import('../services/postApi').then(({ createPost }) => createPost({ content, imageFile }));
            // Sau khi tạo xong, fetch lại danh sách bài viết
            const data = await fetchPosts(0, 20);
            setPosts(data);
        } catch (err) {
            // Có thể show thông báo lỗi
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async (postId: string) => {
        setPosts(prev => prev.map(post =>
            post.id === postId
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likeCount: post.isLiked ? Math.max(0, post.likeCount - 1) : post.likeCount + 1
                }
                : post
        ));
        try {
            const { likePost, unlikePost } = await import('../services/postApi');
            const post = posts.find(p => p.id === postId);
            if (post?.isLiked) {
                await unlikePost(postId);
            } else {
                await likePost(postId);
            }
        } catch (err) {
            // Có thể show thông báo lỗi
        }
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

    const { user, setUser } = useUserStore();

    // Khi app khởi động, nếu có token mà user chưa có thì fetch lại user từ API
    useEffect(() => {
        const authStore = JSON.parse(localStorage.getItem('auth-storage') || '{}');
        const token = authStore.state?.token;
        if (token && !user) {
            fetchUser().then(setUser).catch(() => { });
        }
    }, [user, setUser]);
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
                                    key={String(post.id) || Math.random().toString(36)}
                                    post={post}
                                    onLike={handleLike}
                                    onComment={handleComment}
                                    onShare={handleShare}
                                    onDelete={handleDeletePost}
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