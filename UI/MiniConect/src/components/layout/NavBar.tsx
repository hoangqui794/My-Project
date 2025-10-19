import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';

const NavBar: React.FC = () => {
    const location = useLocation();
    const { user } = useUserStore();
    const { logout } = useAuthStore();

    const isActive = (path: string) => {
        return location.pathname === path ? 'bg-blue-700 text-white shadow-lg' : 'text-blue-100 hover:bg-blue-600 hover:text-white';
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800 shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent select-none">
                        MiniConnect
                    </Link>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex gap-1 lg:gap-3">
                        <Link to="/" className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${isActive('/')}`}>Trang chủ</Link>
                        <Link to="/blog" className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${isActive('/blog')}`}>Blog</Link>
                        <Link to="/messages" className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${isActive('/messages')}`}>Tin nhắn</Link>
                        <Link to="/search" className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${isActive('/search')}`}>Tìm kiếm</Link>
                        <Link to="/notifications" className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${isActive('/notifications')}`}>Thông báo</Link>
                    </div>

                    {/* User Menu - Desktop */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {user && user.username ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                                >
                                    {user.username}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/auth"
                                className="px-4 py-2 rounded-xl font-semibold bg-blue-900/80 hover:bg-blue-900 text-white transition-all duration-200"
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden mt-2">
                    <div className="flex flex-col gap-2 bg-blue-700/90 rounded-xl p-3">
                        <Link to="/" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive('/')}`}>Trang chủ</Link>
                        <Link to="/blog" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive('/blog')}`}>Blog</Link>
                        <Link to="/messages" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive('/messages')}`}>Tin nhắn</Link>
                        <Link to="/search" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive('/search')}`}>Tìm kiếm</Link>
                        <Link to="/notifications" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive('/notifications')}`}>Thông báo</Link>
                        {user && user.username ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="px-4 py-2 rounded-lg font-semibold bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                                >
                                    {user.username}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md w-full text-left mt-2"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/auth"
                                className="px-4 py-2 rounded-lg font-semibold bg-blue-900/80 hover:bg-blue-900 text-white transition-all duration-200"
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>

                {/* Debug user info */}
                {/* <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-bl-xl shadow-md z-50">
                    user: {JSON.stringify(user)}
                </div> */}

                {/* Clear Data Button - For debugging */}
                {/* <div className="mt-4">
                    <button
                        onClick={() => {
                            localStorage.removeItem('auth-storage');
                            window.location.reload(); // Làm mới trang để cập nhật trạng thái
                        }}
                        className="px-4 py-2 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md"
                    >
                        Xóa dữ liệu
                    </button>
                </div> */}

            </div>
        </nav>
    );
};

export default NavBar;