// =============================================
// Loading Spinner Component
// =============================================

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="relative">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-slate-700 border-t-cyan-400"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-14 w-14 border border-cyan-400/20"></div>
            </div>
        </div>
    );
}
