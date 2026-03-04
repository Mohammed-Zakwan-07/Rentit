// =============================================
// Toast Context - Notification system
// =============================================

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    // Show a toast message
    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    // Remove a specific toast
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast-enter flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium min-w-[280px] cursor-pointer
              ${toast.type === 'success' ? 'bg-emerald-600/90 text-white' : ''}
              ${toast.type === 'error' ? 'bg-red-600/90 text-white' : ''}
              ${toast.type === 'info' ? 'bg-cyan-600/90 text-white' : ''}
              ${toast.type === 'warning' ? 'bg-amber-600/90 text-white' : ''}
            `}
                        onClick={() => removeToast(toast.id)}
                    >
                        <span>
                            {toast.type === 'success' && '✅'}
                            {toast.type === 'error' && '❌'}
                            {toast.type === 'info' && 'ℹ️'}
                            {toast.type === 'warning' && '⚠️'}
                        </span>
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export default ToastContext;
