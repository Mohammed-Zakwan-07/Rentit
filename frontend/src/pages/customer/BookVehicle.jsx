// =============================================
// Book Vehicle Page
// =============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/api';

export default function BookVehicle() {
    const { id } = useParams();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [pickupDate, setPickupDate] = useState('');
    const [dropoffDate, setDropoffDate] = useState('');
    const [selectedDriver, setSelectedDriver] = useState('');
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [vehicleRes, driversRes] = await Promise.all([
                fetch(`${API_URL}/vehicles`),
                fetch(`${API_URL}/drivers`),
            ]);
            const vehiclesData = await vehicleRes.json();
            const driversData = await driversRes.json();

            const found = vehiclesData.find((v) => v.id === parseInt(id));
            setVehicle(found);
            setDrivers(driversData.filter((d) => d.availability === 'available'));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate total price
    const calculateTotal = () => {
        if (!pickupDate || !dropoffDate || !vehicle) return 0;
        const days = Math.ceil(
            (new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
        );
        return days > 0 ? days * parseFloat(vehicle.price_per_day) : 0;
    };

    const getDays = () => {
        if (!pickupDate || !dropoffDate) return 0;
        return Math.ceil(
            (new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
        );
    };

    const handleBook = async (e) => {
        e.preventDefault();

        if (!pickupDate || !dropoffDate) {
            showToast('Please select dates', 'error');
            return;
        }
        if (getDays() <= 0) {
            showToast('Drop-off must be after pickup date', 'error');
            return;
        }

        setBooking(true);
        try {
            const res = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    vehicle_id: parseInt(id),
                    driver_id: selectedDriver ? parseInt(selectedDriver) : null,
                    pickup_date: pickupDate,
                    dropoff_date: dropoffDate,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.error || 'Booking failed', 'error');
                return;
            }

            showToast('Vehicle booked successfully!', 'success');
            navigate('/my-bookings');
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
        } finally {
            setBooking(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    if (!vehicle) {
        return (
            <div className="text-center py-20">
                <div className="text-5xl mb-4">🚫</div>
                <p className="text-slate-400 text-lg">Vehicle not found</p>
            </div>
        );
    }

    // Today's date for min date input
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">Book Vehicle</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Vehicle Info */}
                <div className="glass-card rounded-2xl p-6">
                    <div className="h-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-t-2xl -mt-6 -mx-6 mb-6"></div>
                    <div className="text-6xl mb-4 text-center">🚗</div>
                    <h2 className="text-2xl font-bold text-white text-center mb-2">{vehicle.name}</h2>
                    <p className="text-slate-400 text-center mb-6">
                        {vehicle.brand} · {vehicle.model}
                    </p>

                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                        <span className="text-3xl font-bold gradient-text">
                            ₹{parseFloat(vehicle.price_per_day).toLocaleString()}
                        </span>
                        <span className="text-slate-500"> /day</span>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-6">Booking Details</h3>

                    <form onSubmit={handleBook} className="space-y-5">
                        {/* Pickup Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Pickup Date</label>
                            <input
                                id="pickup-date"
                                type="date"
                                min={today}
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        {/* Dropoff Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Drop-off Date</label>
                            <input
                                id="dropoff-date"
                                type="date"
                                min={pickupDate || today}
                                value={dropoffDate}
                                onChange={(e) => setDropoffDate(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        {/* Driver Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Driver <span className="text-slate-500">(optional)</span>
                            </label>
                            <select
                                id="driver-select"
                                value={selectedDriver}
                                onChange={(e) => setSelectedDriver(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            >
                                <option value="">Self Drive</option>
                                {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.name} - {driver.phone}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Summary */}
                        {getDays() > 0 && (
                            <div className="bg-slate-800/50 rounded-xl p-4">
                                <div className="flex justify-between text-sm text-slate-400 mb-2">
                                    <span>₹{parseFloat(vehicle.price_per_day).toLocaleString()} × {getDays()} days</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                                    <span className="font-medium">Total</span>
                                    <span className="text-2xl font-bold gradient-text">
                                        ₹{calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            id="confirm-booking"
                            type="submit"
                            disabled={booking}
                            className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {booking ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
