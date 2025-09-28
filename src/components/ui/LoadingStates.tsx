import React from 'react';
import { Loader2, Sprout, Wheat, Leaf } from 'lucide-react';

// Skeleton Components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl p-6 space-y-4">
      <div className="bg-gray-300 dark:bg-gray-600 h-40 rounded-xl"></div>
      <div className="space-y-3">
        <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4"></div>
        <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-1/2"></div>
        <div className="bg-gray-300 dark:bg-gray-600 h-6 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{ count?: number; className?: string }> = ({ 
  count = 8, 
  className = "" 
}) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({ 
  count = 5, 
  className = "" 
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
        <div className="bg-gray-300 dark:bg-gray-600 h-12 w-12 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4"></div>
          <div className="bg-gray-300 dark:bg-gray-600 h-3 rounded w-1/2"></div>
        </div>
        <div className="bg-gray-300 dark:bg-gray-600 h-8 w-20 rounded"></div>
      </div>
    ))}
  </div>
);

// Loading Spinners
export const LoadingSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className = "" }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <Loader2 className={`animate-spin text-forest-600 ${sizeClasses[size]} ${className}`} />
  );
};

export const AgricultureLoadingSpinner: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <Sprout className="h-6 w-6 text-forest-500 animate-bounce" style={{ animationDelay: '0ms' }} />
      <Wheat className="h-6 w-6 text-harvest-500 animate-bounce" style={{ animationDelay: '150ms' }} />
      <Leaf className="h-6 w-6 text-forest-600 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
};

// Page Loading Component
export const PageLoading: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-50 via-white to-harvest-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-forest-400 to-harvest-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="relative">
          <AgricultureLoadingSpinner className="scale-150" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {message}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we prepare your agricultural marketplace
        </p>
      </div>
    </div>
  </div>
);

// Component Loading Overlay
export const LoadingOverlay: React.FC<{ 
  isLoading: boolean; 
  message?: string;
  children: React.ReactNode;
}> = ({ isLoading, message = "Loading...", children }) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
        <div className="text-center space-y-4">
          <AgricultureLoadingSpinner />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

// Shimmer Effect Component
export const ShimmerEffect: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-shimmer bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent ${className}`} />
);

// Progress Loading Bar
export const ProgressBar: React.FC<{ 
  progress: number; 
  className?: string;
  showPercentage?: boolean;
}> = ({ progress, className = "", showPercentage = false }) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading...</span>
      {showPercentage && (
        <span className="text-sm text-gray-500 dark:text-gray-400">{progress}%</span>
      )}
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
      <div 
        className="bg-gradient-to-r from-forest-500 to-forest-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  </div>
);

export default {
  SkeletonCard,
  SkeletonGrid,
  SkeletonList,
  LoadingSpinner,
  AgricultureLoadingSpinner,
  PageLoading,
  LoadingOverlay,
  ShimmerEffect,
  ProgressBar,
};