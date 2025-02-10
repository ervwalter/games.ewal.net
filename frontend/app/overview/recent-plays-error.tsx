'use client';

import { FallbackProps } from 'react-error-boundary';
import { useEffect } from 'react';

export default function RecentPlaysError({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    console.error('Recent Plays Error:', error);
  }, [error]);

  return (
    <div className="rounded-lg bg-yellow-50 p-4">
      <div className="flex flex-col items-center space-y-3">
        <h3 className="text-sm font-medium text-yellow-800">
          Unable to load recent plays
        </h3>
        <p className="text-sm text-yellow-700">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="rounded bg-yellow-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500">
          Try again
        </button>
      </div>
    </div>
  );
}
