import { apiClient } from "../utils/apiClient";
import type { User } from "../types";

// Lấy thông tin user hiện tại
export const fetchUser = async () => {
    const response = await apiClient.get("/api/v1/users/me");
    const data = response.data;
    // Chuẩn hoá object user trả về cho frontend
    return {
        id: data.id,
        username: data.userName,
        email: data.email,
        avatar: data.pictureUrl ? `data:image/png;base64,${data.pictureUrl}` : undefined,
        bio: data.bio,
        createdAt: data.createdAt,
        followerCount: data.followersCount,
        followingCount: data.followingsCount,
        followerIds: data.followerIds,
        followingIds: data.followingIds,
        postCount: data.postCount ?? 0,
        // Có thể bổ sung các trường khác nếu backend trả về
    };
};

// Cập nhật thông tin user hiện tại (multipart/form-data)
export const updateUserProfile = async (data: { username: string; bio: string; profilePictureFile?: File | null }) => {
    const formData = new FormData();
    formData.append('UserName', data.username);
    formData.append('Bio', data.bio);
    if (data.profilePictureFile) {
        formData.append('ProfilePictureFile', data.profilePictureFile);
    } else {
        formData.append('ProfilePictureFile', '');
    }
    const response = await apiClient.put("/api/v1/users/me", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
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
