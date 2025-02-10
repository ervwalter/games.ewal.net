import React from 'react';

export const SortIndicator = ({ direction }: { direction: "asc" | "desc" }) => {
  return (
    <span className="inline-flex items-center ml-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 transition-transform ${direction === 'desc' ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 15l7-7 7 7"
        />
      </svg>
    </span>
  );
};
