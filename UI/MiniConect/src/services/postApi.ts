import { apiClient } from '../utils/apiClient';
import type { Post, CreatePostRequest, Comment, CreateCommentRequest } from '../types/post.types';

// Lấy danh sách bài viết
export const fetchPosts = async (): Promise<Post[]> => {
    const response = await apiClient.get('/api/v1/posts');
    return response.data;
};

// Đăng bài mới
export const createPost = async (data: CreatePostRequest): Promise<Post> => {
    const response = await apiClient.post('/api/v1/posts', data);
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
