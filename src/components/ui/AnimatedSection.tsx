import React, { type ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'blur-in'
  | 'scale-up'
  | 'fade-in';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
  as?: any;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Wrapper component that triggers CSS animations when scrolled into view.
 * Uses IntersectionObserver via useScrollReveal for performance.
 */
export function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  threshold,
  rootMargin,
}: AnimatedSectionProps) {
  const ref = useScrollReveal<HTMLDivElement>({
    threshold,
    rootMargin,
  });

  const Component = Tag as any;

  return (
    <Component
      ref={ref}
      className={`scroll-reveal scroll-${animation} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms`, animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  animation?: AnimationType;
  as?: any;
}

/**
 * Container that staggers the reveal of its children.
 * Each child should be wrapped in an element with data-reveal attribute.
 */
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 100,
  animation = 'fade-up',
  as: Tag = 'div',
}: StaggerContainerProps) {
  const ref = useScrollReveal<HTMLDivElement>({
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px',
  });

  const Component = Tag as any;

  return (
    <Component ref={ref} className={`stagger-parent scroll-reveal scroll-${animation} ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        const childProps = (child.props || {}) as any;
        const existingStyle = typeof childProps.style === 'object' ? childProps.style : {};
        
        return React.cloneElement(child, {
          'data-reveal': true,
          style: {
            ...existingStyle,
            transitionDelay: `${index * staggerDelay}ms`,
            animationDelay: `${index * staggerDelay}ms`,
          },
        } as any);
      })}
    </Component>
  );
}

