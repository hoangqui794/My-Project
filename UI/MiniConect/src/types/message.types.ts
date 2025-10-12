import { User } from './user.types';

export interface Message {
    id: string;
    sender: User;
    content: string;
    timestamp: Date;
    isRead: boolean;
}