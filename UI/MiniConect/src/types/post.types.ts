export interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    authorId: string;
    author: {
        id: string;
        username: string;
        avatar?: string;
    };
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: string;
    content: string;
    postId: string;
    authorId: string;
    author: {
        id: string;
        username: string;
        avatar?: string;
    };
    createdAt: string;
}

export interface CreatePostRequest {
    content: string;
    imageUrl?: string;
}

export interface CreateCommentRequest {
    content: string;
    postId: string;
}