
export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    followerCount: number;
    followingCount: number;
    postCount: number;
    isFollowing?: boolean;
    createdAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}