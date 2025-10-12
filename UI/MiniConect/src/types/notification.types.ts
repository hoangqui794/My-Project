import type { Message } from './message.types';

export interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'message';
    message: string;
    fromUser: {
        id: string;
        username: string;
        avatar?: string;
    };
    postId?: string;
    isRead: boolean;
    createdAt: string;
}

export interface Chat {
    id: string;
    participants: {
        id: string;
        username: string;
        avatar?: string;
    }[];
    lastMessage?: Message;
    unreadCount: number;
    updatedAt: string;
}