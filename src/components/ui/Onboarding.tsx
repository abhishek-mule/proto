import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Lightbulb, ArrowRight } from 'lucide-react';
import { FadeIn } from './Animations';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingProps {
  steps: OnboardingStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && steps[currentStep]?.target) {
      const element = document.querySelector(steps[currentStep].target) as HTMLElement;
      setTargetElement(element);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isOpen, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
    setCurrentStep(0);
  };

  const handleSkip = () => {
    onClose();
    setCurrentStep(0);
  };

  if (!isOpen || !steps.length) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Highlight overlay */}
      {targetElement && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-glow-lg"
            style={{
              top: targetElement.offsetTop - 8,
              left: targetElement.offsetLeft - 8,
              width: targetElement.offsetWidth + 16,
              height: targetElement.offsetHeight + 16,
              border: '3px solid rgb(34, 197, 94)',
              animation: 'pulse 2s infinite'
            }}
          />
        </div>
      )}

      {/* Tooltip */}
      <FadeIn className="absolute" delay={200}>
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm w-80 ${
            targetElement ? 'absolute' : 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
          }`}
          style={targetElement ? {
            top: getTooltipPosition().top,
            left: getTooltipPosition().left
          } : undefined}
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>

          {/* Progress indicator */}
          <div className="flex items-center space-x-1 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index <= currentStep
                    ? 'bg-forest-500'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-forest-100 dark:bg-forest-900/20 rounded-lg">
                <Lightbulb className="h-5 w-5 text-forest-600 dark:text-forest-400" />
              </div>
              <span className="text-sm text-forest-600 dark:text-forest-400 font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {currentStepData.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Step action */}
            {currentStepData.action && (
              <button
                onClick={currentStepData.action.onClick}
                className="mt-4 px-4 py-2 bg-forest-100 dark:bg-forest-900/20 text-forest-700 dark:text-forest-300 rounded-lg hover:bg-forest-200 dark:hover:bg-forest-800/30 transition-colors text-sm font-medium"
              >
                {currentStepData.action.label}
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentStep + 1} / {steps.length}
            </span>

            <button
              onClick={handleNext}
              className="flex items-center space-x-1 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all"
            >
              <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
              {currentStep === steps.length - 1 ? (
                <Check className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  );

  function getTooltipPosition() {
    if (!targetElement || !currentStepData.position) {
      return { top: '50%', left: '50%' };
    }

    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = 320; // w-80
    const tooltipHeight = 300; // approximate height
    const offset = 16;

    let top = 0;
    let left = 0;

    switch (currentStepData.position) {
      case 'top':
        top = rect.top - tooltipHeight - offset;
        left = rect.left + (rect.width - tooltipWidth) / 2;
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + (rect.width - tooltipWidth) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipHeight) / 2;
        left = rect.left - tooltipWidth - offset;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipHeight) / 2;
        left = rect.right + offset;
        break;
      default:
        top = rect.bottom + offset;
        left = rect.left;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    left = Math.max(16, Math.min(left, viewportWidth - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, viewportHeight - tooltipHeight - 16));

    return { top: `${top}px`, left: `${left}px` };
  }
};

// Tooltip component for individual features
interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShouldShow(true);
      setIsVisible(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setTimeout(() => setShouldShow(false), 200);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800 dark:border-t-gray-200';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800 dark:border-b-gray-200';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800 dark:border-l-gray-200';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800 dark:border-r-gray-200';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800 dark:border-t-gray-200';
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {shouldShow && (
        <div
          className={`absolute z-50 ${getPositionClasses()} transition-opacity duration-200 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap max-w-xs">
            {content}
            <div
              className={`absolute w-0 h-0 border-4 border-transparent ${getArrowClasses()}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Feature highlight component
interface FeatureHighlightProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  title,
  description,
  icon,
  className = '',
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <FadeIn className={className}>
      <div className="bg-gradient-to-br from-forest-50 to-harvest-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-forest-200 dark:border-gray-600">
        <div className="flex items-start space-x-4">
          {icon && (
            <div className="p-3 bg-forest-100 dark:bg-forest-900/20 rounded-xl">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {description}
            </p>
            {children}
          </div>
        </div>
      </div>
    </FadeIn>
  );
};