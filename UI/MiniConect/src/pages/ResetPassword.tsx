import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        if (newPassword !== confirmPassword) {
            setMessage('Mật khẩu xác nhận không khớp!');
            setLoading(false);
            return;
        }
        try {
            await authService.resetPassword(token || '', newPassword);
            setMessage('Đặt lại mật khẩu thành công!');
            setTimeout(() => navigate('/auth'), 2000);
        } catch {
            setMessage('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Đặt lại mật khẩu</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded mb-4"
                />
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded mb-4"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
            </form>
            {message && <div className="mt-4 text-center text-green-600">{message}</div>}
        </div>
    );
};

export default ResetPassword;
