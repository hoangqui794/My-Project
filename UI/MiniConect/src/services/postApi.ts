
import { apiClient } from '../utils/apiClient';
import type { Post, CreatePostRequest, Comment, CreateCommentRequest } from '../types/post.types';


// Lấy bài viết của user hiện tại
export const fetchMyPosts = async (skip = 0, take = 20): Promise<Post[]> => {
    const response = await apiClient.get('/api/v1/posts/myposts', {
        params: { skip, take }
    });
    return response.data.map((post: any) => ({
        id: post.id,
        content: post.content,
        imageUrl: post.imageurl ? `data:image/png;base64,${post.imageurl}` : undefined,
        createdAt: post.createdat,
        updatedAt: post.updatedat || post.createdat,
        authorId: post.authorid,
        author: {
            id: post.authorid,
            username: post.authorname,
            avatar: post.authorAvatar ? `data:image/png;base64,${post.authorAvatar}` : undefined,
        },
        commentCount: post.commentCount,
        likeCount: post.likeCount,
        isLiked: post.isLiked ?? false,
    }));
};
// Lấy danh sách bài viết
export const fetchPosts = async (skip = 0, take = 20): Promise<Post[]> => {
    const response = await apiClient.get('/api/v1/posts', {
        params: { skip, take }
    });

    return response.data.map((post: any) => ({
        id: post.id,
        content: post.content,
        imageUrl: post.imageurl ? `data:image/png;base64,${post.imageurl}` : undefined,
        createdAt: post.createdat,
        updatedAt: post.updatedat || post.createdat,
        authorId: post.authorid,
        author: {
            id: post.authorid,
            username: post.authorname,
            avatar: post.authorAvatar ? `data:image/png;base64,${post.authorAvatar}` : undefined,
        },
        commentCount: post.commentCount,
        likeCount: post.likeCount,
        isLiked: post.isLiked ?? false,
    }));
};

// Đăng bài mới
export const createPost = async (data: CreatePostRequest): Promise<Post> => {
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.imageFile) {
        formData.append('imageFile', data.imageFile);
    }

    const response = await apiClient.post('/api/v1/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// Like bài viết
export const likePost = async (postId: string): Promise<void> => {
    await apiClient.post(`/api/v1/posts/${postId}/like`);
};

// Bỏ like bài viết
export const unlikePost = async (postId: string): Promise<void> => {
    await apiClient.post(`/api/v1/posts/${postId}/unlike`);
};

// Lấy bình luận của bài viết
export const fetchComments = async (postId: string): Promise<Comment[]> => {
    const response = await apiClient.get(`/api/v1/posts/${postId}/comments`);
    return response.data;
};

// Thêm bình luận vào bài viết
export const createComment = async (data: CreateCommentRequest): Promise<Comment> => {
    const response = await apiClient.post(`/api/v1/posts/${data.postId}/comments`, { content: data.content });
    return response.data;
};

// Xóa bài viết
export const deletePost = async (postId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/posts/${postId}`);
};

// Xóa bình luận
export const deleteComment = async (postId: string, commentId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/posts/${postId}/comments/${commentId}`);
};
