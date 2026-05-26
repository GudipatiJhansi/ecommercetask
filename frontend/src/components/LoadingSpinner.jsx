import React from 'react';

const LoadingSpinner = ({ fullPage = false }) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Premium Multi-Layer Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-darkbg-border"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-brand-500 border-r-brand-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-b-violet-400 border-l-violet-400 animate-spin" style={{ animationDirection: 'reverse' }}></div>
      </div>
      <p className="text-sm font-display tracking-wider font-semibold text-gray-500 dark:text-gray-400 animate-pulse uppercase">
        Loading Zenith...
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/70 dark:bg-darkbg/85 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-12">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;
