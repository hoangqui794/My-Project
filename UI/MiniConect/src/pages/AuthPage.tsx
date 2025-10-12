import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import ForgotPassword from '../components/auth/ForgotPassword';

type AuthMode = 'login' | 'register' | 'forgot-password';

const AuthPage: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>('login');

    const renderAuthForm = () => {
        switch (mode) {
            case 'login':
                return (
                    <LoginForm
                        onSwitchToRegister={() => setMode('register')}
                        onForgotPassword={() => setMode('forgot-password')}
                    />
                );
            case 'register':
                return (
                    <SignUpForm
                        onSwitchToLogin={() => setMode('login')}
                    />
                );
            case 'forgot-password':
                return (
                    <ForgotPassword
                        onBackToLogin={() => setMode('login')}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {renderAuthForm()}
            </div>
        </div>
    );
};

export default AuthPage;