// =============================================
// Manage Drivers Page (Admin)
// =============================================

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/api';

export default function ManageDrivers() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const res = await fetch(`${API_URL}/drivers`);
            const data = await res.json();
            setDrivers(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!name || !phone) {
            showToast('Name and phone are required', 'error');
            return;
        }

        setAdding(true);
        try {
            const res = await fetch(`${API_URL}/drivers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, role: user.role }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.error || 'Failed to add driver', 'error');
                return;
            }

            showToast('Driver added!', 'success');
            setName('');
            setPhone('');
            fetchDrivers();
        } catch (error) {
            showToast('Network error', 'error');
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div className="flex-1 p-8"><LoadingSpinner /></div>;

    return (
        <div className="flex-1 p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Manage Drivers</h1>
                <p className="text-slate-400 mt-1">{drivers.length} drivers registered</p>
            </div>

            {/* Add Driver Form */}
            <div className="glass-card rounded-2xl p-6 mb-8 max-w-2xl">
                <h2 className="text-lg font-semibold mb-4">Add New Driver</h2>
                <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
                    <input
                        id="driver-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Driver name"
                        className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <input
                        id="driver-phone"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number"
                        className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button
                        id="add-driver-submit"
                        type="submit"
                        disabled={adding}
                        className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                        {adding ? 'Adding...' : 'Add Driver'}
                    </button>
                </form>
            </div>

            {/* Drivers List */}
            {drivers.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-2xl">
                    <div className="text-5xl mb-4">👤</div>
                    <p className="text-slate-400 text-lg">No drivers yet. Add one above!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {drivers.map((driver) => (
                        <div key={driver.id} className="glass-card rounded-xl p-5 hover-glow transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-xl">
                                    👤
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{driver.name}</h3>
                                    <p className="text-sm text-slate-400">{driver.phone}</p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-700/50">
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${driver.availability === 'available'
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : 'bg-red-500/10 text-red-400'
                                        }`}
                                >
                                    {driver.availability}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
