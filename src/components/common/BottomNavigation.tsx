import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Settings, Sprout, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Don't show on login page
  if (location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

  const getNavigationItems = () => {
    if (user?.role === 'farmer') {
      return [
        {
          id: 'dashboard',
          label: 'Farm',
          icon: Sprout,
          path: '/farmer',
        },
        {
          id: 'marketplace',
          label: 'Market',
          icon: ShoppingBag,
          path: '/marketplace',
        },
        {
          id: 'profile',
          label: 'Profile',
          icon: User,
          path: '/profile',
        }
      ];
    } else if (user?.role === 'admin') {
      return [
        {
          id: 'admin',
          label: 'Admin',
          icon: Shield,
          path: '/admin',
        },
        {
          id: 'marketplace',
          label: 'Market',
          icon: ShoppingBag,
          path: '/marketplace',
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          path: '/settings',
        }
      ];
    } else {
      // Consumer
      return [
        {
          id: 'marketplace',
          label: 'Market',
          icon: ShoppingBag,
          path: '/marketplace',
        },
        {
          id: 'profile',
          label: 'Profile',
          icon: User,
          path: '/profile',
        }
      ];
    }
  };

  const navigationItems = getNavigationItems();
  
  const isActive = (path: string) => {
    if (path === '/marketplace' && (location.pathname === '/marketplace' || location.pathname.startsWith('/product/'))) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        {/* Navigation Container */}
        <div className="flex justify-center pb-6 px-4">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-full shadow-2xl border border-gray-800/50 pointer-events-auto">
            <nav className="flex items-center px-2 py-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`
                      relative flex items-center justify-center p-4 mx-1 rounded-full
                      transition-all duration-300 ease-out
                      ${active 
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }
                      active:scale-95 hover:scale-105
                      min-w-[56px] min-h-[56px]
                    `}
                  >
                    {/* Icon */}
                    <Icon className={`
                      h-6 w-6 transition-all duration-300 ease-out
                      ${active ? 'scale-110' : ''}
                    `} />
                    
                    {/* Active indicator ripple */}
                    {active && (
                      <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Bottom safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom pointer-events-none"></div>
      </div>
      
      {/* Spacer to prevent content from being hidden behind bottom nav on mobile */}
      <div className="md:hidden h-24"></div>
    </>
  );
};

export default BottomNavigation;