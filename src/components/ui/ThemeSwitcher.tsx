import React, { useState } from 'react';
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'dropdown' | 'minimal';
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className = '',
  showLabel = true,
  variant = 'button'
}) => {
  const { theme, actualTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: Sun,
      description: 'Light theme',
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: Moon,
      description: 'Dark theme',
    },
    {
      value: 'auto' as const,
      label: 'Auto',
      icon: Monitor,
      description: 'Follow system preference',
    },
  ];

  const currentTheme = themes.find(t => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Monitor;

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => setTheme(actualTheme === 'light' ? 'dark' : 'light')}
        className={`p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${className}`}
        aria-label={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
      >
        <Sun className={`h-5 w-5 transition-all duration-300 ${
          actualTheme === 'dark' 
            ? 'rotate-0 scale-100 text-yellow-500' 
            : 'rotate-90 scale-0 text-gray-400'
        } absolute`} />
        <Moon className={`h-5 w-5 transition-all duration-300 ${
          actualTheme === 'dark' 
            ? 'rotate-90 scale-0 text-gray-400' 
            : 'rotate-0 scale-100 text-blue-600'
        }`} />
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={() => setTheme(actualTheme === 'light' ? 'dark' : 'light')}
        className={`group flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${className}`}
        aria-label={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
      >
        <div className="relative">
          <Sun className={`h-5 w-5 transition-all duration-300 ${
            actualTheme === 'dark' 
              ? 'rotate-0 scale-100 text-yellow-500' 
              : 'rotate-90 scale-0 text-gray-400'
          } absolute`} />
          <Moon className={`h-5 w-5 transition-all duration-300 ${
            actualTheme === 'dark' 
              ? 'rotate-90 scale-0 text-gray-400' 
              : 'rotate-0 scale-100 text-blue-600'
          }`} />
        </div>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            {actualTheme === 'light' ? 'Dark' : 'Light'} Mode
          </span>
        )}
      </button>
    );
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        aria-label="Theme options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <CurrentIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </div>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            {currentTheme?.label}
          </span>
        )}
        <Palette className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            <div className="py-2">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.value;
                
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isSelected 
                        ? 'bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 ${
                        isSelected 
                          ? 'text-forest-600 dark:text-forest-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                      <div>
                        <div className="font-medium">{themeOption.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {themeOption.description}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-forest-600 dark:text-forest-400" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Theme preference is saved locally
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;