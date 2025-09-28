import React from 'react';
import { 
  Search, 
  ShoppingCart, 
  Sprout, 
  Users, 
  Package, 
  AlertCircle, 
  FileX, 
  Wifi,
  RefreshCw,
  Plus,
  ArrowRight,
  Leaf,
  MapPin
} from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action,
  secondaryAction,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className}`}>
      {Icon && (
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-forest-200 to-harvest-200 rounded-full blur-xl opacity-30"></div>
          <div className="relative bg-gradient-to-br from-forest-100 to-harvest-100 dark:from-forest-900 dark:to-harvest-900 p-6 rounded-full">
            <Icon className="h-16 w-16 text-forest-600 dark:text-forest-400" />
          </div>
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {action && (
          <button
            onClick={action.onClick}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 ${
              action.variant === 'secondary'
                ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                : 'bg-gradient-primary text-white hover:shadow-glow'
            }`}
          >
            {action.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="text-forest-600 dark:text-forest-400 font-medium hover:text-forest-700 dark:hover:text-forest-300 transition-colors"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};

// Specific Empty State Components

export const NoSearchResults: React.FC<{
  query: string;
  onClear: () => void;
  onBrowse?: () => void;
}> = ({ query, onClear, onBrowse }) => (
  <EmptyState
    icon={Search}
    title="No results found"
    description={`We couldn't find any crops matching "${query}". Try adjusting your search terms or explore our featured products.`}
    action={{
      label: "Clear search",
      onClick: onClear,
      variant: 'secondary'
    }}
    secondaryAction={onBrowse ? {
      label: "Browse all crops",
      onClick: onBrowse
    } : undefined}
  />
);

export const EmptyCart: React.FC<{
  onStartShopping: () => void;
}> = ({ onStartShopping }) => (
  <EmptyState
    icon={ShoppingCart}
    title="Your cart is empty"
    description="Start exploring our marketplace to find fresh, sustainable produce from verified farmers around the world."
    action={{
      label: "Start shopping",
      onClick: onStartShopping
    }}
  />
);

export const NoFarmsNearby: React.FC<{
  onExpandRadius: () => void;
  onViewAll?: () => void;
}> = ({ onExpandRadius, onViewAll }) => (
  <EmptyState
    icon={MapPin}
    title="No farms in your area"
    description="We couldn't find any farms near your location. Try expanding your search radius or browse our global marketplace."
    action={{
      label: "Expand search area",
      onClick: onExpandRadius
    }}
    secondaryAction={onViewAll ? {
      label: "View all farms",
      onClick: onViewAll
    } : undefined}
  />
);

export const EmptyFarmDashboard: React.FC<{
  onAddCrop: () => void;
  onLearnMore?: () => void;
}> = ({ onAddCrop, onLearnMore }) => (
  <EmptyState
    icon={Sprout}
    title="Start your farming journey"
    description="Welcome! Create your first crop NFT to begin selling your agricultural products on our blockchain marketplace."
    action={{
      label: "Add your first crop",
      onClick: onAddCrop
    }}
    secondaryAction={onLearnMore ? {
      label: "Learn more",
      onClick: onLearnMore
    } : undefined}
  />
);

export const NoOrders: React.FC<{
  onBrowse: () => void;
}> = ({ onBrowse }) => (
  <EmptyState
    icon={Package}
    title="No orders yet"
    description="You haven't made any purchases yet. Explore our marketplace to discover amazing products from sustainable farms."
    action={{
      label: "Explore marketplace",
      onClick: onBrowse
    }}
  />
);

export const NoNotifications: React.FC = () => (
  <EmptyState
    icon={AlertCircle}
    title="You're all caught up"
    description="No new notifications right now. We'll let you know when there's something important to see."
  />
);

export const NoUsers: React.FC<{
  onInvite?: () => void;
}> = ({ onInvite }) => (
  <EmptyState
    icon={Users}
    title="No users to display"
    description="This community is just getting started. Be among the first to join our agricultural blockchain network."
    action={onInvite ? {
      label: "Invite others",
      onClick: onInvite
    } : undefined}
  />
);

export const FileNotFound: React.FC<{
  onGoBack: () => void;
  onHome?: () => void;
}> = ({ onGoBack, onHome }) => (
  <EmptyState
    icon={FileX}
    title="Page not found"
    description="The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL."
    action={{
      label: "Go back",
      onClick: onGoBack,
      variant: 'secondary'
    }}
    secondaryAction={onHome ? {
      label: "Go to homepage",
      onClick: onHome
    } : undefined}
  />
);

export const ConnectionError: React.FC<{
  onRetry: () => void;
}> = ({ onRetry }) => (
  <EmptyState
    icon={Wifi}
    title="Connection problem"
    description="We're having trouble connecting to our servers. Please check your internet connection and try again."
    action={{
      label: "Try again",
      onClick: onRetry
    }}
  />
);

export const ServerError: React.FC<{
  onRetry: () => void;
}> = ({ onRetry }) => (
  <div className="text-center py-16 px-4">
    <div className="mb-6">
      <div className="bg-red-100 dark:bg-red-900/20 p-6 rounded-full inline-block">
        <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
      Something went wrong
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
      We're experiencing some technical difficulties. Our team has been notified and is working on a fix.
    </p>
    <button
      onClick={onRetry}
      className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105"
    >
      <RefreshCw className="h-4 w-4 mr-2" />
      Try again
    </button>
  </div>
);

// Maintenance Mode
export const MaintenanceMode: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-50 to-harvest-50 dark:from-gray-900 dark:to-gray-800 px-4">
    <div className="text-center max-w-md">
      <div className="mb-8">
        <div className="bg-harvest-100 dark:bg-harvest-900/20 p-8 rounded-full inline-block">
          <Leaf className="h-24 w-24 text-harvest-600 dark:text-harvest-400 animate-float" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        We'll be right back!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        We're currently updating our agricultural marketplace to serve you better. 
        Thank you for your patience.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Expected completion: <span className="font-semibold text-gray-700 dark:text-gray-300">30 minutes</span>
        </p>
      </div>
    </div>
  </div>
);

export default EmptyState;