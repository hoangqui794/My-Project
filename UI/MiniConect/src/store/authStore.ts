import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (data: { username: string; email: string; password: string }) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (credentials) => {
                set({ isLoading: true });
                try {
                    const data = await authService.login(credentials);

                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (data) => {
                set({ isLoading: true });
                try {
                    await authService.register(data);

                    set({
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                // Call logout API if needed
                authService.logout().catch(console.error);

                localStorage.removeItem('auth-storage');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            setUser: (user) => {
                set({ user });
            },

            setLoading: (loading) => {
                set({ isLoading: loading });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// Lắng nghe sự kiện storage để đồng bộ trạng thái giữa các tab
window.addEventListener('storage', (event) => {
    if (event.key === 'auth-storage' && !event.newValue) {
        // Xóa token và cập nhật trạng thái
        useAuthStore.getState().logout();
    }
});