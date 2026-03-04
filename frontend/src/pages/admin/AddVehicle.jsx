// =============================================
// Add Vehicle Page (Admin)
// =============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const API_URL = 'http://localhost:5000/api';

export default function AddVehicle() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        brand: '',
        model: '',
        price_per_day: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.brand || !form.model || !form.price_per_day) {
            showToast('All fields are required', 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/vehicles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, role: user.role }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.error || 'Failed to add vehicle', 'error');
                return;
            }

            showToast('Vehicle added successfully!', 'success');
            navigate('/admin/manage-vehicles');
        } catch (error) {
            showToast('Network error', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-8">
            <div className="max-w-2xl">
                <h1 className="text-3xl font-bold mb-2">Add New Vehicle</h1>
                <p className="text-slate-400 mb-8">Add a vehicle to your rental fleet</p>

                <div className="glass-card rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Vehicle Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Vehicle Name</label>
                            <input
                                id="vehicle-name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Swift Dzire"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Brand</label>
                            <input
                                id="vehicle-brand"
                                type="text"
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                placeholder="e.g. Maruti Suzuki"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        {/* Model */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Model</label>
                            <input
                                id="vehicle-model"
                                type="text"
                                name="model"
                                value={form.model}
                                onChange={handleChange}
                                placeholder="e.g. 2024"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        {/* Price Per Day */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Price Per Day (₹)</label>
                            <input
                                id="vehicle-price"
                                type="number"
                                name="price_per_day"
                                value={form.price_per_day}
                                onChange={handleChange}
                                placeholder="e.g. 1500"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            id="add-vehicle-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Vehicle'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
