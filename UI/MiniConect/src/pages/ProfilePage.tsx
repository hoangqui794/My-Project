import React from 'react';
import NavBar from '../components/layout/NavBar';
import { useAuthStore } from '../store/authStore';

const ProfilePage: React.FC = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="max-w-4xl mx-auto py-6 px-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center space-x-4 mb-6">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-20 h-20 rounded-full"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 text-2xl font-medium">
                                    {user.username[0].toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                            <p className="text-gray-600">{user.email}</p>
                            {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">{user.postCount || 0}</div>
                            <div className="text-gray-600">Bài đăng</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">{user.followerCount || 0}</div>
                            <div className="text-gray-600">Người theo dõi</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">{user.followingCount || 0}</div>
                            <div className="text-gray-600">Đang theo dõi</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Bài đăng của tôi</h2>
                    <p className="text-gray-600">Chưa có bài đăng nào.</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;