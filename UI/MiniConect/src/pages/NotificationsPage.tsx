import React from 'react';
import NavBar from '../components/layout/NavBar';

const NotificationsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="max-w-4xl mx-auto py-6 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Thông báo</h1>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-600">Chức năng thông báo đang được phát triển...</p>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;