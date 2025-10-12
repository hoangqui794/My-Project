import { apiClient } from '../utils/apiClient';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/register', data);
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