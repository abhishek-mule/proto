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
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 pointer-events-auto">
            <nav className="flex items-center px-3 py-3">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex flex-col items-center justify-center px-5 py-1 rounded-xl transition-all duration-300 ${
                      active
                        ? 'text-green-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className={`relative ${active ? 'scale-110' : ''}`}>
                      <Icon className="h-5 w-5" />
                      {active && (
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                    <span className="text-xs mt-1 font-medium">{item.label}</span>
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