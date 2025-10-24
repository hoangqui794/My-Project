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
    // Log trạng thái kết nối SignalR
    import('../utils/signalR').then(({ getSignalRConnection }) => {
        const conn = getSignalRConnection();
        console.log('SignalR connection state:', conn?.state);
        if (!conn || conn.state !== 'Connected') {
            console.error('SignalR connection is not established! Current state:', conn?.state);
        }
    });
    // State cho input bình luận popup
    const [commentInput, setCommentInput] = useState('');
    const [sendingComment, setSendingComment] = useState(false);
    // State cho chi tiết bài viết và comment
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
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
        NewComment: (payload: any) => {
            console.log('SignalR NewComment event received:', payload, 'Current user:', user?.id);
            // Tăng số lượng comment trên feed
            setPosts(prev => prev.map(post =>
                Number(post.id) === payload.postId
                    ? { ...post, commentCount: post.commentCount + 1 }
                    : post
            ));
            // Nếu đang mở popup chi tiết đúng bài viết thì thêm bình luận mới vào
            setSelectedPost(post => {
                if (post && Number(post.id) === payload.postId) {
                    setComments(prev => {
                        // Nếu comment đã tồn tại thì không thêm nữa (so sánh đúng key Id)
                        if (prev.some(c => String(c.id) === String(payload.id))) return prev;
                        return [
                            {
                                id: payload.id,
                                postId: payload.postId,
                                authorId: payload.authorId,
                                content: payload.content,
                                createdat: payload.createdat,
                                authorName: payload.authorName,
                                authorAvatar: payload.authorAvatar
                            },
                            ...prev
                        ];
                    });
                    return { ...post, commentCount: post.commentCount + 1 };
                }
                return post;
            });
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

    // Khi nhấn vào nút bình luận trên bài viết
    const handleShowComments = async (post: Post) => {
        setSelectedPost(post);
        setLoadingComments(true);
        try {
            const { fetchComments } = await import('../services/postApi');
            const data = await fetchComments(post.id);
            setComments(data);
        } catch {
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    };

    // Hàm gửi bình luận mới (giữ lại logic cũ nếu cần)
    const handleComment = async (postId: string, content: string) => {
        // ...existing code...
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
                                    onCommentIconClick={() => handleShowComments(post)}
                                    onComment={handleComment}
                                    onShare={handleShare}
                                    onDelete={handleDeletePost}
                                    isOwner={!!user && post.authorId === user?.id}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Popup chi tiết bài viết kiểu Facebook */}
                {selectedPost && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative animate-fadeIn">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition text-2xl font-bold"
                                onClick={() => setSelectedPost(null)}
                                aria-label="Đóng"
                            >
                                ×
                            </button>
                            <div className="p-5 max-h-[80vh] overflow-y-auto">
                                {/* Header: Avatar và tên user */}
                                <div className="flex items-center mb-4">
                                    {selectedPost.author?.avatar ? (
                                        <img
                                            src={selectedPost.author.avatar}
                                            alt={selectedPost.author.username}
                                            className="w-12 h-12 rounded-full mr-3"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-gray-600 font-medium text-xl">
                                                {selectedPost.author?.username?.[0]?.toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{selectedPost.author?.username}</h3>
                                    </div>
                                </div>
                                {/* Bài viết */}
                                <div className="mb-4">
                                    {selectedPost.imageUrl && (
                                        <img src={selectedPost.imageUrl} alt="post" className="w-full max-h-96 object-cover rounded" />
                                    )}
                                    <div>{selectedPost.content}</div>
                                </div>
                                {/* Like/Comment/Share */}
                                <div className="flex items-center justify-between py-2 border-b mb-2">
                                    <div className="flex gap-4">
                                        <button
                                            className={`flex items-center space-x-1 px-3 py-1 rounded transition-all duration-150 focus:outline-none ${selectedPost.isLiked
                                                ? 'bg-red-100 text-red-600 font-bold'
                                                : 'hover:bg-gray-100 text-gray-600'
                                                }`}
                                            aria-label={selectedPost.isLiked ? 'Bỏ thích' : 'Thích'}
                                            onClick={async () => {
                                                // Like/Unlike logic cho popup
                                                const { likePost, unlikePost } = await import('../services/postApi');
                                                let newIsLiked = !selectedPost.isLiked;
                                                let newLikeCount = newIsLiked ? selectedPost.likeCount + 1 : Math.max(0, selectedPost.likeCount - 1);
                                                if (newIsLiked) {
                                                    await likePost(selectedPost.id);
                                                } else {
                                                    await unlikePost(selectedPost.id);
                                                }
                                                setSelectedPost({ ...selectedPost, isLiked: newIsLiked, likeCount: newLikeCount });
                                                setPosts(prev => prev.map(post => post.id === selectedPost.id ? { ...post, isLiked: newIsLiked, likeCount: newLikeCount } : post));
                                            }}
                                        >
                                            <span className="text-lg">{selectedPost.isLiked ? '❤️' : '🤍'}</span>
                                            <span>{selectedPost.likeCount}</span>
                                        </button>
                                        <span className="text-gray-600">💬 {selectedPost.commentCount}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="text-gray-700 hover:text-blue-600 font-semibold">Share</button>
                                    </div>
                                </div>
                                {/* Danh sách bình luận */}
                                <div className="mb-2">
                                    <h4 className="font-bold mb-2">Bình luận</h4>
                                    {loadingComments ? (
                                        <div className="text-center py-4">Đang tải bình luận...</div>
                                    ) : comments.length === 0 ? (
                                        <div className="text-gray-500">Chưa có bình luận nào.</div>
                                    ) : (
                                        <ul className="space-y-2">
                                            {comments.map(comment => (
                                                <li key={comment.id} className="border-b pb-2 flex gap-2 items-start">
                                                    {comment.authorAvatar ? (
                                                        <img
                                                            src={`data:image/png;base64,${comment.authorAvatar}`}
                                                            alt={comment.authorName || 'avatar'}
                                                            className="w-8 h-8 rounded-full mt-1"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mt-1">
                                                            <span className="text-gray-600 font-medium text-base">
                                                                {comment.authorName?.[0]?.toUpperCase() || 'U'}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-semibold">{comment.authorName || 'Ẩn danh'}</div>
                                                        <div>{comment.content}</div>
                                                        <div className="text-xs text-gray-400">{new Date(comment.createdat).toLocaleString()}</div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {/* Khung nhập bình luận */}
                                <form
                                    className="flex items-center gap-2 mt-4"
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        if (!commentInput.trim()) return;
                                        setSendingComment(true);
                                        try {
                                            const { createComment } = await import('../services/postApi');
                                            await createComment({ postId: selectedPost.id, content: commentInput });
                                            setCommentInput('');
                                            // Không tự thêm vào danh sách comment, chỉ cập nhật khi nhận SignalR
                                        } catch {
                                            // Có thể show thông báo lỗi
                                        } finally {
                                            setSendingComment(false);
                                        }
                                    }}
                                >
                                    <img src={user?.avatar || 'https://ui-avatars.com/api/?name=User'} alt="avatar" className="w-8 h-8 rounded-full" />
                                    <input
                                        type="text"
                                        placeholder="Viết bình luận..."
                                        className="flex-1 px-3 py-2 border rounded"
                                        value={commentInput}
                                        onChange={e => setCommentInput(e.target.value)}
                                        disabled={sendingComment}
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                        disabled={sendingComment || !commentInput.trim()}
                                    >
                                        {sendingComment ? 'Đang gửi...' : 'Gửi'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;