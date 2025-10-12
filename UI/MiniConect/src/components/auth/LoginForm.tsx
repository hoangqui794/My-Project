import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

interface LoginFormProps {
    onSwitchToRegister: () => void;
    onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onForgotPassword }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const { login, isLoading } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(formData);
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập email của bạn"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mật khẩu"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <button
                    onClick={onForgotPassword}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Quên mật khẩu?
                </button>
            </div>

            <div className="mt-6 text-center">
                <span className="text-sm text-gray-600">Chưa có tài khoản? </span>
                <button
                    onClick={onSwitchToRegister}
                    className="text-sm text-blue-600 hover:underline font-medium"
                >
                    Đăng ký ngay
                </button>
            </div>
        </div>
    );
};

export default LoginForm;