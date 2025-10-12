import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const NavBar: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const isActive = (path: string) => {
        return location.pathname === path ? 'bg-blue-700' : '';
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold">
                            MiniConnect
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex space-x-4">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/')}`}
                        >
                            Trang chủ
                        </Link>
                        <Link
                            to="/blog"
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/blog')}`}
                        >
                            Blog
                        </Link>
                        <Link
                            to="/messages"
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/messages')}`}
                        >
                            Tin nhắn
                        </Link>
                        <Link
                            to="/search"
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/search')}`}
                        >
                            Tìm kiếm
                        </Link>
                        <Link
                            to="/notifications"
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/notifications')}`}
                        >
                            Thông báo
                        </Link>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {user && (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-md"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt="Avatar"
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span className="text-gray-600 text-sm font-medium">
                                                {user.username[0].toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-sm font-medium">{user.username}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/"
                            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive('/')}`}
                        >
                            Trang chủ
                        </Link>
                        <Link
                            to="/blog"
                            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive('/blog')}`}
                        >
                            Blog
                        </Link>
                        <Link
                            to="/messages"
                            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive('/messages')}`}
                        >
                            Tin nhắn
                        </Link>
                        <Link
                            to="/search"
                            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive('/search')}`}
                        >
                            Tìm kiếm
                        </Link>
                        <Link
                            to="/notifications"
                            className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 ${isActive('/notifications')}`}
                        >
                            Thông báo
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;