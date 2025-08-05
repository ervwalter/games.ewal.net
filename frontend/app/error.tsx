'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Something went wrong!
              </h2>
              <p className="text-sm text-gray-600">
                {error.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={reset}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500">
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
