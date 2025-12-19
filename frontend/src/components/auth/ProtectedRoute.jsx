import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { RouteLogin } from '../../helper/RouteName';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }) => {

    const { isAuthenticated, loading } = useAuth()
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>
    }
    if (!isAuthenticated) {
        return <Navigate to={RouteLogin} state={{ from: location }} replace />
    }
    return children;
}

export default ProtectedRoute