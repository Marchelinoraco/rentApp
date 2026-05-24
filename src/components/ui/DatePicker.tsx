import React, { forwardRef } from 'react';
import { format } from 'date-fns';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * DatePicker component using native HTML5 date input
 * Validates date ranges
 * Requirements: 3.1, 3.6
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      minDate,
      maxDate,
      className = '',
      id,
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || `datepicker-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    const hasError = !!error;
    
    const baseInputStyles = 'block px-3 py-2 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed';
    
    const stateStyles = hasError
      ? 'border-red-500 text-red-900 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';
    
    const widthStyles = fullWidth ? 'w-full' : '';
    
    const inputClassName = `${baseInputStyles} ${stateStyles} ${widthStyles} ${className}`.trim();
    
    // Format dates for HTML5 date input (YYYY-MM-DD)
    const minDateStr = minDate ? format(minDate, 'yyyy-MM-dd') : undefined;
    const maxDateStr = maxDate ? format(maxDate, 'yyyy-MM-dd') : undefined;
    
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          type="date"
          id={inputId}
          className={inputClassName}
          disabled={disabled}
          required={required}
          min={minDateStr}
          max={maxDateStr}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          {...props}
        />
        
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
