import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Settings, Sprout, Shield, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide navigation on scroll (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Only add scroll listener on mobile devices
    if (window.innerWidth < 768) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  // Don't show on login page
  if (location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

  const getNavigationItems = () => {
    if (user?.role === 'farmer') {
      return [
        {
          id: 'home',
          label: 'Home',
          icon: Home,
          path: '/',
        },
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
          id: 'home',
          label: 'Home',
          icon: Home,
          path: '/',
        },
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
          id: 'home',
          label: 'Home',
          icon: Home,
          path: '/',
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
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Navigation Container */}
        <div className="flex justify-center pb-safe px-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 max-w-sm w-full">
            <nav className="flex items-center justify-around px-2 py-3">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`group relative flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 min-w-0 ${
                      active
                        ? 'text-forest-600 dark:text-forest-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    aria-label={item.label}
                  >
                    {/* Background highlight for active item */}
                    {active && (
                      <div className="absolute inset-0 bg-forest-50 dark:bg-forest-900/20 rounded-xl scale-100 opacity-100 transition-all duration-300" />
                    )}
                    
                    {/* Icon container with ripple effect */}
                    <div className={`relative z-10 transition-all duration-300 ${
                      active ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                      <Icon className="h-5 w-5" />
                      
                      {/* Active indicator dot */}
                      {active && (
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-forest-600 dark:bg-forest-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    
                    {/* Label with better spacing */}
                    <span className={`relative z-10 text-xs mt-1 font-medium transition-all duration-300 truncate max-w-full ${
                      active ? 'text-forest-700 dark:text-forest-300' : ''
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Hover ripple effect */}
                    <div className="absolute inset-0 rounded-xl bg-gray-200/50 dark:bg-gray-700/50 opacity-0 group-hover:opacity-100 group-active:opacity-75 transition-opacity duration-200 pointer-events-none" />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Floating Action Button for farmers */}
        {user?.role === 'farmer' && (
          <div className="absolute -top-6 right-6">
            <Link
              to="/farmer/add-crop"
              className="group w-12 h-12 bg-gradient-primary text-white rounded-full shadow-glow hover:shadow-glow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-forest-500/30"
              aria-label="Add new crop"
            >
              <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            </Link>
          </div>
        )}
      </div>
      
      {/* Spacer to prevent content from being hidden behind bottom nav on mobile */}
      <div className="md:hidden h-20 safe-bottom"></div>
    </>
  );
};

export default BottomNavigation;