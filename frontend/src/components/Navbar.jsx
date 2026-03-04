// =============================================
// Navbar Component
// =============================================

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <img src="/images/rentit_logo.png" alt="Rentit Logo" className="w-9 h-9 rounded-lg object-cover" />
                        <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">
                            Rentit
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="text-slate-300 hover:text-cyan-400 transition-colors font-medium text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                {isAdmin ? (
                                    <Link
                                        to="/admin"
                                        className="text-slate-300 hover:text-cyan-400 transition-colors font-medium text-sm"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className="text-slate-300 hover:text-cyan-400 transition-colors font-medium text-sm"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/vehicles"
                                            className="text-slate-300 hover:text-cyan-400 transition-colors font-medium text-sm"
                                        >
                                            Vehicles
                                        </Link>
                                        <Link
                                            to="/my-bookings"
                                            className="text-slate-300 hover:text-cyan-400 transition-colors font-medium text-sm"
                                        >
                                            My Bookings
                                        </Link>
                                    </>
                                )}

                                {/* User info & logout */}
                                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700">
                                    <span className="text-sm text-slate-400">
                                        Hi, <span className="text-cyan-400 font-medium">{user.name}</span>
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-red-400 hover:text-red-300 transition-colors font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
