// =============================================
// Vehicle List Page (Customer)
// =============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/api';

// Car images to cycle through for vehicle cards
const CAR_IMAGES = [
    '/images/sedan_car.png',
    '/images/suv_car.png',
    '/images/hero_car.png',
];

export default function VehicleList() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await fetch(`${API_URL}/vehicles`);
            const data = await res.json();
            setVehicles(data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter vehicles by search term
    const filteredVehicles = vehicles.filter(
        (v) =>
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.brand.toLowerCase().includes(search.toLowerCase()) ||
            v.model.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Top Banner with Car Image */}
            <div className="banner-image mb-8">
                <img src="/images/hero_car.png" alt="Vehicle fleet" />
                <div className="banner-content">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Available Vehicles</h1>
                    <p className="text-slate-300 text-sm md:text-base max-w-md">
                        Find the perfect ride for your next trip from our premium fleet
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="🔍 Search vehicles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 w-full md:w-72 transition-colors"
                />
            </div>

            {/* Vehicle Grid */}
            {filteredVehicles.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-5xl mb-4">🚫</div>
                    <p className="text-slate-400 text-lg">No vehicles found</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((vehicle, index) => (
                        <div
                            key={vehicle.id}
                            className="glass-card rounded-2xl overflow-hidden hover-glow transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Vehicle Image */}
                            <div className="vehicle-card-image">
                                <img
                                    src={CAR_IMAGES[index % CAR_IMAGES.length]}
                                    alt={vehicle.name}
                                />
                            </div>

                            <div className="p-6">
                                {/* Status badge */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{vehicle.name}</h3>
                                        <p className="text-slate-400 text-sm">
                                            {vehicle.brand} · {vehicle.model}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${vehicle.status === 'available'
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : vehicle.status === 'booked'
                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            }`}
                                    >
                                        {vehicle.status}
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-700/50">
                                    <div>
                                        <span className="text-2xl font-bold gradient-text">
                                            ₹{parseFloat(vehicle.price_per_day).toLocaleString()}
                                        </span>
                                        <span className="text-slate-500 text-sm"> /day</span>
                                    </div>

                                    {vehicle.status === 'available' ? (
                                        <Link
                                            to={`/book/${vehicle.id}`}
                                            className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                        >
                                            Book Now
                                        </Link>
                                    ) : (
                                        <span className="text-slate-500 text-sm">Unavailable</span>
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
