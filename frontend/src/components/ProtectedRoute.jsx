// =============================================
// Protected Route Component
// =============================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protects routes based on authentication and role
export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth();

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect if role doesn't match
    if (role && user.role !== role) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
    }

    return children;
}
