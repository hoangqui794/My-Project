import React, { useState } from 'react';
import { changeUserPassword } from '../../services/userApi';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp!');
      return;
    }
    setLoading(true);
    try {
      await changeUserPassword({ oldPassword: currentPassword, newPassword });
      setSuccess('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đổi mật khẩu thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8 max-w-md mx-auto animate-fadeIn">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Đổi mật khẩu</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Mật khẩu hiện tại</label>
          <input
            type="password"
            className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Mật khẩu mới</label>
          <input
            type="password"
            className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Nhập lại mật khẩu mới</label>
          <input
            type="password"
            className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:from-blue-600 hover:to-indigo-700 transition"
          disabled={loading}
        >
          {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
