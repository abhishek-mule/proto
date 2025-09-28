import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useAccessibility';

// Fade in animation component
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 500,
  direction = 'up',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getDirectionClasses = () => {
    if (prefersReducedMotion) return '';
    
    const base = 'transition-all duration-500 ease-out';
    if (isVisible) return `${base} opacity-100 translate-x-0 translate-y-0`;
    
    switch (direction) {
      case 'up':
        return `${base} opacity-0 translate-y-8`;
      case 'down':
        return `${base} opacity-0 -translate-y-8`;
      case 'left':
        return `${base} opacity-0 translate-x-8`;
      case 'right':
        return `${base} opacity-0 -translate-x-8`;
      default:
        return `${base} opacity-0 translate-y-8`;
    }
  };

  return (
    <div
      ref={ref}
      className={`${getDirectionClasses()} ${className}`}
      style={{
        transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms`,
        transitionDuration: prefersReducedMotion ? '0ms' : `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

// Stagger animation for lists
interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  staggerDelay = 100,
  className = ''
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn
          delay={prefersReducedMotion ? 0 : index * staggerDelay}
          direction="up"
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
};

// Hover scale animation
interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export const HoverScale: React.FC<HoverScaleProps> = ({
  children,
  scale = 1.05,
  className = ''
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div
      className={`${prefersReducedMotion ? '' : 'transition-transform duration-200 hover:scale-105 active:scale-95'} ${className}`}
      style={{
        '--tw-scale-x': prefersReducedMotion ? '1' : undefined,
        '--tw-scale-y': prefersReducedMotion ? '1' : undefined
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// Ripple effect component
interface RippleProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const Ripple: React.FC<RippleProps> = ({
  children,
  className = '',
  color = 'rgba(255, 255, 255, 0.6)'
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: string }>>([]);
  const prefersReducedMotion = useReducedMotion();

  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now().toString();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onClick={createRipple}
    >
      {children}
      {!prefersReducedMotion && ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute animate-ping rounded-full pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
};

// Floating animation
interface FloatingProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export const Floating: React.FC<FloatingProps> = ({
  children,
  className = '',
  amplitude = 10,
  duration = 3
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`${prefersReducedMotion ? '' : 'animate-float'} ${className}`}
      style={{
        animationDuration: prefersReducedMotion ? '0s' : `${duration}s`,
        '--float-amplitude': prefersReducedMotion ? '0px' : `${amplitude}px`
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// Pulse animation
interface PulseProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'soft' | 'medium' | 'strong';
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  className = '',
  intensity = 'soft'
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  const getIntensityClass = () => {
    if (prefersReducedMotion) return '';
    
    switch (intensity) {
      case 'soft':
        return 'animate-pulse-soft';
      case 'medium':
        return 'animate-pulse';
      case 'strong':
        return 'animate-bounce';
      default:
        return 'animate-pulse-soft';
    }
  };

  return (
    <div className={`${getIntensityClass()} ${className}`}>
      {children}
    </div>
  );
};

// Count up animation
interface CountUpProps {
  end: number;
  duration?: number;
  start?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 2000,
  start = 0,
  className = ''
}) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    const actualDuration = prefersReducedMotion ? 0 : duration;
    const stepTime = actualDuration / Math.abs(end - start);
    let current = start;

    const timer = setInterval(() => {
      current += (end - start) / Math.abs(end - start);
      setCount(current);

      if ((end > start && current >= end) || (end < start && current <= end)) {
        setCount(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, end, start, duration, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {Math.round(count).toLocaleString()}
    </span>
  );
};

// Slide in from direction
interface SlideInProps {
  children: React.ReactNode;
  direction: 'left' | 'right' | 'top' | 'bottom';
  duration?: number;
  delay?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction,
  duration = 500,
  delay = 0,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getSlideClasses = () => {
    if (prefersReducedMotion) return 'opacity-100 translate-x-0 translate-y-0';
    
    const base = 'transition-all ease-out';
    if (isVisible) return `${base} opacity-100 translate-x-0 translate-y-0`;
    
    switch (direction) {
      case 'left':
        return `${base} opacity-0 -translate-x-full`;
      case 'right':
        return `${base} opacity-0 translate-x-full`;
      case 'top':
        return `${base} opacity-0 -translate-y-full`;
      case 'bottom':
        return `${base} opacity-0 translate-y-full`;
      default:
        return `${base} opacity-0 translate-y-8`;
    }
  };

  return (
    <div
      ref={ref}
      className={`${getSlideClasses()} ${className}`}
      style={{
        transitionDuration: prefersReducedMotion ? '0ms' : `${duration}ms`,
        transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// Typewriter effect
interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  className = '',
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    if (prefersReducedMotion) {
      setDisplayText(text);
      onComplete?.();
      return;
    }

    let i = 0;
    const timer = setInterval(() => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [isVisible, text, speed, prefersReducedMotion, onComplete]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {!prefersReducedMotion && displayText.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};