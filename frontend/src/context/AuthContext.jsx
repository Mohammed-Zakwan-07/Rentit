// =============================================
// Auth Context - Manages user authentication state
// =============================================

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('rentit_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // Login - save user to state and localStorage
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('rentit_user', JSON.stringify(userData));
    };

    // Logout - clear user from state and localStorage
    const logout = () => {
        setUser(null);
        localStorage.removeItem('rentit_user');
    };

    const value = {
        user,
        login,
        logout,
        loading,
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'customer',
        isLoggedIn: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
