import React from 'react';

function LoadingSpinner() {
    return <div className="flex items-center justify-center p-12">
        <div className="relative">
            {/* outer ring */}
            <div className="w-20 h-20 border-4 border-white/20 rounded-full animate-spin border-t-white/80 shadow-lg"></div>
        </div>

    </div>;
}

export default LoadingSpinner;