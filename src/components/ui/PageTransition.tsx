import { type ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps page content with a smooth enter animation on route change.
 * Uses CSS transitions for fade + slide effect.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);

    // Small RAF delay to ensure DOM paint before triggering animation
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    // Scroll to top on page change
    if (typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch {
        // JSDOM defines scrollTo but does not implement it.
      }
    }

    return () => cancelAnimationFrame(raf);
  }, [location.pathname]);

  return (
    <div
      className={`page-transition ${isVisible ? 'page-enter-active' : 'page-enter'}`}
    >
      {children}
    </div>
  );
}
