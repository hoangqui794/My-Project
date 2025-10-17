import { apiClient } from "../utils/apiClient";
import type { User } from "../types";

// Lấy thông tin user hiện tại
export const fetchUser = async () => {
    const response = await apiClient.get("/api/v1/users/me");
    // return response.data;
    const data = response.data;
    return {
        User: {
            id: data.id,
            username: data.username,
            email: data.email,
            avatar: data.pictureUrl,
            bio: data.bio,
            followerCount: data.followersCount,
            followingCount: data.followingsCount,
            // postCount: data.postCount,
        }
    };
};

// Cập nhật thông tin user hiện tại
export const updateUserProfile = async (data: any) => {
    const response = await apiClient.put("/api/v1/users/me", data);
    return response.data;
};

// Lấy profile user theo username
export const getUserProfileByUsername = async (username: string) => {
    const response = await apiClient.get(`/api/v1/users/${username}`);
    return response.data;
};

// Đổi mật khẩu user hiện tại
export const changeUserPassword = async (data: { oldPassword: string; newPassword: string }) => {
    const response = await apiClient.post("/api/v1/users/me/password", data);
    return response.data;
};

// Tìm kiếm user
export const searchUsers = async (query: string) => {
    const response = await apiClient.get(`/api/v1/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
};

// Follow user
export const followUser = async (userId: string) => {
    const response = await apiClient.post(`/api/v1/users/${userId}/follow`);
    return response.data;
};

// Unfollow user
export const unfollowUser = async (userId: string) => {
    const response = await apiClient.post(`/api/v1/users/${userId}/unfollow`);
    return response.data;
};
