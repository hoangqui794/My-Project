
import React, { useState } from 'react';
import type { User } from '../types/user.types';
import NavBar from '../components/layout/NavBar';
import { useUserStore } from '../store/userStore';
import { useSignalR } from '../hooks/useSignalR';

import EditProfile from '../components/user/EditProfile';
import ChangePassword from '../components/user/ChangePassword';
import { fetchUser } from '../services/userApi';


const HUB_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/hubs/userHub';

import { useEffect } from 'react';

const ProfilePage: React.FC = () => {
    const { user, setUser } = useUserStore();
    const [showEdit, setShowEdit] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    // Fetch user info on mount if not available
    useEffect(() => {
        if (!user) {
            fetchUser()
                .then(setUser)
                .catch(console.error);
        }
    }, [user, setUser]);

    // Hàm reload lại user sau khi chỉnh sửa
    const reloadUser = async () => {
        const newUser = await fetchUser();
        setUser({ ...newUser, postCount: newUser.postCount ?? 0 });
    };

    // Listen for real-time profile updates
    useSignalR(HUB_URL, {
        ProfileUpdated: (updated: User) => {
            if (user && updated.id === user.id) {
                setUser({ ...user, ...updated, postCount: updated.postCount ?? user.postCount ?? 0 });
            }
        },
        FollowChanged: (payload: { userId: string; followerCount: number; followingCount: number }) => {
            if (user && payload.userId === user.id) {
                setUser({ ...user, followerCount: payload.followerCount, followingCount: payload.followingCount });
            }
        },
    });


    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="max-w-4xl mx-auto py-6 px-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center space-x-4 mb-6 relative">
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
                        <div className="ml-auto flex items-center gap-2">
                            <button
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full shadow hover:from-blue-600 hover:to-indigo-700 transition font-semibold text-base"
                                onClick={() => setShowEdit(true)}
                            >
                                <svg className="inline w-5 h-5 mr-1 -mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V21h8" /></svg>
                                Chỉnh sửa
                            </button>
                            <div className="relative">
                                <button
                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
                                    onClick={() => setShowMenu((v) => !v)}
                                    aria-label="Menu"
                                >
                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
                                </button>
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-10 border border-gray-100 animate-fadeIn">
                                        <button
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 text-blue-700 font-semibold rounded-xl"
                                            onClick={() => { setShowChangePassword(true); setShowMenu(false); }}
                                        >
                                            Đổi mật khẩu
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Popup đổi mật khẩu */}
                        {showChangePassword && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
                                    <button
                                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition text-2xl font-bold"
                                        onClick={() => setShowChangePassword(false)}
                                        aria-label="Đóng"
                                    >
                                        ×
                                    </button>
                                    <ChangePassword />
                                </div>
                            </div>
                        )}
                    </div>

                    {showEdit && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
                                <button
                                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition text-2xl font-bold"
                                    onClick={() => setShowEdit(false)}
                                    aria-label="Đóng"
                                >
                                    ×
                                </button>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Chỉnh sửa hồ sơ</h3>
                                <EditProfile
                                    user={{
                                        username: user.username,
                                        bio: user.bio ?? ''
                                    }}
                                    onSuccess={() => {
                                        setShowEdit(false);
                                        reloadUser();
                                    }}
                                />
                            </div>
                        </div>
                    )}

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