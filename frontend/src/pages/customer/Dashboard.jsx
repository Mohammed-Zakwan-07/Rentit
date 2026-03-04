// =============================================
// Customer Dashboard
// =============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalBookings: 0, activeBookings: 0 });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/bookings/${user.id}`);
            const bookings = await res.json();
            setStats({
                totalBookings: bookings.length,
                activeBookings: bookings.filter(b => b.status === 'confirmed').length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Banner with Car Image */}
            <div className="banner-image mb-10">
                <img src="/images/suv_car.png" alt="Premium vehicle" />
                <div className="banner-content">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                        Welcome back, <span className="gradient-text">{user.name}</span>! 👋
                    </h1>
                    <p className="text-slate-300 text-sm md:text-base">Here's your rental overview</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="glass-card rounded-2xl p-6 hover-glow transition-all duration-300">
                    <div className="text-3xl mb-2">📋</div>
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalBookings}</div>
                    <div className="text-slate-400 text-sm">Total Bookings</div>
                </div>
                <div className="glass-card rounded-2xl p-6 hover-glow transition-all duration-300">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.activeBookings}</div>
                    <div className="text-slate-400 text-sm">Active Bookings</div>
                </div>
                <div className="glass-card rounded-2xl p-6 hover-glow transition-all duration-300">
                    <div className="text-3xl mb-2">❌</div>
                    <div className="text-3xl font-bold text-red-400 mb-1">
                        {stats.totalBookings - stats.activeBookings}
                    </div>
                    <div className="text-slate-400 text-sm">Cancelled</div>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
                <Link
                    to="/vehicles"
                    className="glass-card rounded-xl overflow-hidden hover-glow transition-all duration-300 hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-0">
                        <div className="w-28 h-24 flex-shrink-0 overflow-hidden">
                            <img
                                src="/images/sedan_car.png"
                                alt="Browse vehicles"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                Browse Vehicles
                            </h3>
                            <p className="text-slate-400 text-sm">Find and rent your perfect ride</p>
                        </div>
                    </div>
                </Link>
                <Link
                    to="/my-bookings"
                    className="glass-card rounded-xl overflow-hidden hover-glow transition-all duration-300 hover:-translate-y-1 group"
                >
                    <div className="flex items-center gap-0">
                        <div className="w-28 h-24 flex-shrink-0 overflow-hidden">
                            <img
                                src="/images/suv_car.png"
                                alt="My bookings"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                My Bookings
                            </h3>
                            <p className="text-slate-400 text-sm">View and manage your reservations</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
