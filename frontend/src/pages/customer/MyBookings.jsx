// =============================================
// My Bookings Page (Customer)
// =============================================

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/api';

export default function MyBookings() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${API_URL}/bookings/${user.id}`);
            const data = await res.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            const res = await fetch(`${API_URL}/bookings/cancel/${bookingId}`, {
                method: 'PUT',
            });

            if (!res.ok) {
                showToast('Failed to cancel booking', 'error');
                return;
            }

            showToast('Booking cancelled successfully', 'success');
            fetchBookings(); // Refresh
        } catch (error) {
            showToast('Network error', 'error');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Bookings</h1>
                <p className="text-slate-400 mt-1">View and manage your reservations</p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-2xl">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-slate-400 text-lg mb-4">No bookings yet</p>
                    <a
                        href="/vehicles"
                        className="inline-block bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        Browse Vehicles
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="glass-card rounded-2xl p-6 hover-glow transition-all duration-300">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                {/* Booking Info */}
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl">🚗</div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {booking.vehicle_name || `Vehicle #${booking.vehicle_id}`}
                                        </h3>
                                        {booking.vehicle_brand && (
                                            <p className="text-slate-400 text-sm">{booking.vehicle_brand}</p>
                                        )}
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
                                            <span>📅 {new Date(booking.pickup_date).toLocaleDateString()} → {new Date(booking.dropoff_date).toLocaleDateString()}</span>
                                            {booking.driver_name && <span>👤 {booking.driver_name}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Price & Status */}
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xl font-bold gradient-text">
                                            ₹{parseFloat(booking.total_price).toLocaleString()}
                                        </div>
                                        <span
                                            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    {booking.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
