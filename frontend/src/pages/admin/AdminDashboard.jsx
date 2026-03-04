// =============================================
// Admin Dashboard
// =============================================

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        vehicles: 0,
        bookings: 0,
        drivers: 0,
        revenue: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [vehiclesRes, bookingsRes, driversRes] = await Promise.all([
                fetch(`${API_URL}/vehicles`),
                fetch(`${API_URL}/bookings`),
                fetch(`${API_URL}/drivers`),
            ]);

            const vehicles = await vehiclesRes.json();
            const bookings = await bookingsRes.json();
            const drivers = await driversRes.json();

            const revenue = bookings
                .filter((b) => b.status === 'confirmed')
                .reduce((sum, b) => sum + parseFloat(b.total_price), 0);

            setStats({
                vehicles: vehicles.length,
                bookings: bookings.length,
                drivers: drivers.length,
                revenue,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div className="flex-1 p-8">
            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-slate-400">Welcome, {user.name}. Here's your system overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { icon: '🚗', label: 'Total Vehicles', value: stats.vehicles, color: 'text-cyan-400' },
                    { icon: '📋', label: 'Total Bookings', value: stats.bookings, color: 'text-violet-400' },
                    { icon: '👤', label: 'Drivers', value: stats.drivers, color: 'text-amber-400' },
                    {
                        icon: '💰',
                        label: 'Revenue',
                        value: `₹${stats.revenue.toLocaleString()}`,
                        color: 'text-emerald-400',
                    },
                ].map((stat, index) => (
                    <div
                        key={index}
                        className="glass-card rounded-2xl p-6 hover-glow transition-all duration-300"
                    >
                        <div className="text-3xl mb-3">{stat.icon}</div>
                        <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                        <div className="text-slate-400 text-sm">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Quick Info */}
            <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Tips</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4">
                        <p className="text-sm text-slate-400">
                            <span className="text-cyan-400 font-medium">Add Vehicle</span> — Use the sidebar to add new vehicles to your fleet.
                        </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                        <p className="text-sm text-slate-400">
                            <span className="text-cyan-400 font-medium">Manage Bookings</span> — View all customer bookings from the All Bookings page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
