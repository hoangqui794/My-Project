import React, { useRef, useState } from 'react';
import { updateUserProfile } from '../../services/userApi';

interface EditProfileProps {
    user: {
        username: string;
        bio: string | null;
    };
    onSuccess?: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSuccess }) => {
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('UserName', username);
            formData.append('Bio', bio);
            if (fileRef.current?.files?.[0]) {
                formData.append('ProfilePictureFile', fileRef.current.files[0]);
            }
            await updateUserProfile({
                username,
                bio,
                profilePictureFile: fileRef.current?.files?.[0] || null
            });
            setLoading(false);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra!');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-medium">Tên người dùng</label>
                <input
                    className="border rounded px-3 py-2 w-full"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block font-medium">Giới thiệu</label>
                <textarea
                    className="border rounded px-3 py-2 w-full"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                />
            </div>
            <div>
                <label className="block font-medium">Ảnh đại diện</label>
                <input type="file" ref={fileRef} accept="image/*" />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </form>
    );
};

export default EditProfile;
