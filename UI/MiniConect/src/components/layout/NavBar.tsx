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

    const [mobileOpen, setMobileOpen] = React.useState(false);

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

                    {/* Hamburger menu icon - Mobile */}
                    <button
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-700 text-white"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Mở menu"
                    >
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="17" x2="20" y2="17" />
                        </svg>
                    </button>
                </div>

                {/* Mobile menu - Hamburger */}
                {mobileOpen && (
                    <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-40 flex items-start justify-end">
                        <div className="w-64 bg-blue-700/95 rounded-l-xl p-6 h-full flex flex-col gap-4 animate-fadeIn">
                            <button
                                className="self-end mb-4 text-white text-2xl"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Đóng menu"
                            >
                                ×
                            </button>
                            <Link to="/" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive('/')}`} onClick={() => setMobileOpen(false)}>Trang chủ</Link>
                            <Link to="/blog" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive('/blog')}`} onClick={() => setMobileOpen(false)}>Blog</Link>
                            <Link to="/messages" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive('/messages')}`} onClick={() => setMobileOpen(false)}>Tin nhắn</Link>
                            <Link to="/search" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive('/search')}`} onClick={() => setMobileOpen(false)}>Tìm kiếm</Link>
                            <Link to="/notifications" className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isActive('/notifications')}`} onClick={() => setMobileOpen(false)}>Thông báo</Link>
                            {user && user.username ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="px-4 py-2 rounded-lg font-semibold bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {user.username}
                                    </Link>
                                    <button
                                        onClick={() => { setMobileOpen(false); handleLogout(); }}
                                        className="px-4 py-2 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md w-full text-left mt-2"
                                    >
                                        Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="px-4 py-2 rounded-lg font-semibold bg-blue-900/80 hover:bg-blue-900 text-white transition-all duration-200"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Đăng nhập
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;