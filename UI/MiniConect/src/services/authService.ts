import { apiClient } from '../utils/apiClient';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/api/v1/login', credentials);
        const data = response.data;
        // Map API fields to FE fields
        return {
            token: data.token,
            user: {
                id: data.id, // Nếu API trả về id thì lấy, không thì để rỗng
                username: data.userName,
                email: data.email,
                avatar: data.pictureUrl,
                bio: data.bio,
                createdAt: data.creatAt,
                followerCount: 0,
                followingCount: 0,
                postCount: 0,
            }
        };
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/api/v1/register', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },

    refreshToken: async (): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/refresh');
        return response.data;
    },

    forgotPassword: async (email: string): Promise<void> => {
        await apiClient.post('/auth/forgot-password', { email });
    },

    resetPassword: async (token: string, newPassword: string): Promise<void> => {
        await apiClient.post('/auth/reset-password', { token, newPassword });
    },
};