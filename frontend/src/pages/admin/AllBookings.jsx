// =============================================
// All Bookings Page (Admin)
// =============================================

import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/api';

export default function AllBookings() {
    const { showToast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${API_URL}/bookings`);
            const data = await res.json();
            setBookings(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;

        try {
            const res = await fetch(`${API_URL}/bookings/cancel/${id}`, { method: 'PUT' });
            if (!res.ok) {
                showToast('Failed to cancel', 'error');
                return;
            }
            showToast('Booking cancelled', 'success');
            fetchBookings();
        } catch (error) {
            showToast('Network error', 'error');
        }
    };

    if (loading) return <div className="flex-1 p-8"><LoadingSpinner /></div>;

    return (
        <div className="flex-1 p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">All Bookings</h1>
                <p className="text-slate-400 mt-1">{bookings.length} total bookings</p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-2xl">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-slate-400 text-lg">No bookings yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Driver</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Dates</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="py-3 px-4 text-sm text-slate-400">#{booking.id}</td>
                                    <td className="py-3 px-4 text-sm font-medium text-white">{booking.user_name || `User #${booking.user_id}`}</td>
                                    <td className="py-3 px-4 text-sm text-slate-300">{booking.vehicle_name || `Vehicle #${booking.vehicle_id}`}</td>
                                    <td className="py-3 px-4 text-sm text-slate-400">{booking.driver_name || 'Self Drive'}</td>
                                    <td className="py-3 px-4 text-sm text-slate-400">
                                        {new Date(booking.pickup_date).toLocaleDateString()} → {new Date(booking.dropoff_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium text-cyan-400">₹{parseFloat(booking.total_price).toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-red-500/10 text-red-400'
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        {booking.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium hover:bg-red-500/20"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
