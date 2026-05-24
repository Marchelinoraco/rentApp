import React from 'react';
import toast, { Toaster, type ToastOptions } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Toast component using React Hot Toast for notifications
 * Requirements: 3.5, 7.3, 9.3
 */

// Toast notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Custom toast function with icons
export const showToast = (message: string, type: ToastType = 'info', options?: ToastOptions) => {
  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-primary-500" />
  };
  
  const icon = iconMap[type];
  
  const defaultOptions: ToastOptions = {
    duration: 4000,
    position: 'top-right',
    ...options
  };
  
  switch (type) {
    case 'success':
      return toast.success(message, {
        ...defaultOptions,
        icon: icon,
        className: 'toast-success'
      });
    case 'error':
      return toast.error(message, {
        ...defaultOptions,
        icon: icon,
        className: 'toast-error'
      });
    case 'warning':
      return toast(message, {
        ...defaultOptions,
        icon: icon,
        className: 'toast-warning'
      });
    case 'info':
    default:
      return toast(message, {
        ...defaultOptions,
        icon: icon,
        className: 'toast-info'
      });
  }
};

// Toast container component to be placed in App root
export const ToastContainer: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          maxWidth: '500px'
        },
        // Success
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff'
          }
        },
        // Error
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff'
          }
        }
      }}
    />
  );
};

// Export the toast object for direct usage
export { toast };
