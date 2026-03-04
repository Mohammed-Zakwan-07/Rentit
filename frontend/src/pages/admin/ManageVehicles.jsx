// =============================================
// Manage Vehicles Page (Admin)
// =============================================

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/api';

export default function ManageVehicles() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await fetch(`${API_URL}/vehicles`);
            const data = await res.json();
            setVehicles(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (vehicle) => {
        setEditingId(vehicle.id);
        setEditForm({
            name: vehicle.name,
            brand: vehicle.brand,
            model: vehicle.model,
            price_per_day: vehicle.price_per_day,
            status: vehicle.status,
        });
    };

    const handleUpdate = async (id) => {
        try {
            const res = await fetch(`${API_URL}/vehicles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editForm, role: user.role }),
            });

            if (!res.ok) {
                showToast('Failed to update', 'error');
                return;
            }

            showToast('Vehicle updated!', 'success');
            setEditingId(null);
            fetchVehicles();
        } catch (error) {
            showToast('Network error', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vehicle?')) return;

        try {
            const res = await fetch(`${API_URL}/vehicles/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: user.role }),
            });

            if (!res.ok) {
                showToast('Failed to delete', 'error');
                return;
            }

            showToast('Vehicle deleted', 'success');
            fetchVehicles();
        } catch (error) {
            showToast('Network error', 'error');
        }
    };

    if (loading) return <div className="flex-1 p-8"><LoadingSpinner /></div>;

    return (
        <div className="flex-1 p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Manage Vehicles</h1>
                <p className="text-slate-400 mt-1">{vehicles.length} vehicles in your fleet</p>
            </div>

            {vehicles.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-2xl">
                    <div className="text-5xl mb-4">🚗</div>
                    <p className="text-slate-400 text-lg">No vehicles yet. Add some!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Brand</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Model</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Price/Day</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle.id} className="hover:bg-slate-800/50 transition-colors">
                                    {editingId === vehicle.id ? (
                                        <>
                                            <td className="py-3 px-4">
                                                <input
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm w-full focus:outline-none focus:border-cyan-500"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    value={editForm.brand}
                                                    onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                                                    className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm w-full focus:outline-none focus:border-cyan-500"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    value={editForm.model}
                                                    onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                                                    className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm w-full focus:outline-none focus:border-cyan-500"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    value={editForm.price_per_day}
                                                    onChange={(e) => setEditForm({ ...editForm, price_per_day: e.target.value })}
                                                    className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm w-24 focus:outline-none focus:border-cyan-500"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <select
                                                    value={editForm.status}
                                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                    className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                                                >
                                                    <option value="available">Available</option>
                                                    <option value="booked">Booked</option>
                                                    <option value="maintenance">Maintenance</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdate(vehicle.id)}
                                                        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium hover:bg-emerald-500/20"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="px-3 py-1.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="py-3 px-4 text-sm font-medium text-white">{vehicle.name}</td>
                                            <td className="py-3 px-4 text-sm text-slate-400">{vehicle.brand}</td>
                                            <td className="py-3 px-4 text-sm text-slate-400">{vehicle.model}</td>
                                            <td className="py-3 px-4 text-sm font-medium text-cyan-400">₹{parseFloat(vehicle.price_per_day).toLocaleString()}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${vehicle.status === 'available'
                                                            ? 'bg-emerald-500/10 text-emerald-400'
                                                            : vehicle.status === 'booked'
                                                                ? 'bg-amber-500/10 text-amber-400'
                                                                : 'bg-red-500/10 text-red-400'
                                                        }`}
                                                >
                                                    {vehicle.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(vehicle)}
                                                        className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-medium hover:bg-cyan-500/20"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(vehicle.id)}
                                                        className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium hover:bg-red-500/20"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
