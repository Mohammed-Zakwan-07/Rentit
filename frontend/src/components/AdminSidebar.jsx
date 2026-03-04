// =============================================
// Admin Sidebar Component
// =============================================

import { NavLink } from 'react-router-dom';

export default function AdminSidebar() {
    // Sidebar navigation items
    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊' },
        { path: '/admin/add-vehicle', label: 'Add Vehicle', icon: '➕' },
        { path: '/admin/manage-vehicles', label: 'Manage Vehicles', icon: '🚗' },
        { path: '/admin/manage-drivers', label: 'Manage Drivers', icon: '👤' },
        { path: '/admin/bookings', label: 'All Bookings', icon: '📋' },
    ];

    return (
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-slate-900 border-r border-slate-700/50 p-4">
            <div className="mb-6 px-3">
                <div className="flex items-center gap-2 mb-3">
                    <img src="/images/rentit_logo.png" alt="Rentit" className="w-7 h-7 rounded-md object-cover" />
                    <span className="text-sm font-bold gradient-text">Rentit</span>
                </div>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Admin Panel
                </h2>
            </div>

            <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
