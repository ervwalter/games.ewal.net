'use client';

import { FallbackProps } from 'react-error-boundary';
import { useEffect } from 'react';

export default function TopTenError({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    console.error('Top Ten Error:', error);
  }, [error]);

  return (
    <div className="rounded-lg bg-red-50 p-8">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-lg font-semibold text-red-800">
          Unable to load top ten games
        </h2>
        <p className="text-sm text-red-600">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
          Try again
        </button>
      </div>
    </div>
  );
}
