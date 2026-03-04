// =============================================
// Login Page
// =============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const API_URL = 'http://localhost:5000/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.error || 'Login failed', 'error');
                return;
            }

            // Save user and redirect
            login(data.user);
            showToast('Welcome back!', 'success');
            navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split-layout">
            {/* Left side - Car Image */}
            <div className="auth-image-side">
                <img
                    src="/images/login_car_bg.png"
                    alt="Luxury car"
                />
                {/* Overlay branding */}
                <div className="absolute bottom-8 left-8 z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <img src="/images/rentit_logo.png" alt="Rentit" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-xl font-bold gradient-text">Rentit</span>
                    </div>
                    <p className="text-slate-300 text-sm max-w-xs">Your premium car rental experience starts here.</p>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex items-center justify-center px-4 py-10 relative">
                {/* Background effects */}
                <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl"></div>

                <div className="glass-card rounded-2xl p-8 w-full max-w-md relative">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-slate-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
