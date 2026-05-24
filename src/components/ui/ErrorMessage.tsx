import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

export interface ErrorMessageProps {
  message: string;
  title?: string;
  variant?: 'inline' | 'banner';
  severity?: 'error' | 'warning';
  onDismiss?: () => void;
  className?: string;
}

/**
 * ErrorMessage component for displaying validation errors
 * Requirements: 9.1, 9.3
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title,
  variant = 'inline',
  severity = 'error',
  onDismiss,
  className = ''
}) => {
  const severityStyles = {
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-500',
      title: 'text-red-900'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-500',
      title: 'text-yellow-900'
    }
  };
  
  const Icon = severity === 'error' ? XCircle : AlertCircle;
  const styles = severityStyles[severity];
  
  if (variant === 'inline') {
    return (
      <div
        className={`flex items-start gap-2 text-sm ${className}`.trim()}
        role="alert"
        aria-live="polite"
      >
        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${styles.icon}`} aria-hidden="true" />
        <span className={styles.container.split(' ')[2]}>{message}</span>
      </div>
    );
  }
  
  // Banner variant
  return (
    <div
      className={`rounded-lg border p-4 ${styles.container} ${className}`.trim()}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 ${styles.icon}`} aria-hidden="true" />
        
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold mb-1 ${styles.title}`}>
              {title}
            </h3>
          )}
          <p className="text-sm">{message}</p>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current"
            aria-label="Dismiss error message"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
