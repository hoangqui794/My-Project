import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;