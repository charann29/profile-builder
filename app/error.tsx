'use client';

import React from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    React.useEffect(() => {
        // Log the error to your error reporting service (e.g., Sentry)
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6 ring-4 ring-red-100">
                    <svg
                        className="w-8 h-8 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                    Something went wrong
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                    An unexpected error occurred. Please try again.
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 rounded-xl bg-[#01334c] hover:bg-[#024466] text-white text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#01334c]/20 hover:shadow-[#01334c]/40 active:scale-95"
                >
                    Try Again
                </button>
                {process.env.NODE_ENV === 'development' && error?.message && (
                    <details className="mt-6 text-left">
                        <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                            Error details
                        </summary>
                        <pre className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg p-3 overflow-auto max-h-40 border border-red-100">
                            {error.message}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}
