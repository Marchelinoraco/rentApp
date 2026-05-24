import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Card component for consistent card styling
 * Requirements: 1.1
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'medium',
  shadow = 'medium',
  hover = false,
  onClick
}) => {
  const baseStyles = 'bg-white rounded-lg border border-gray-200 transition-shadow';
  
  const paddingStyles = {
    none: '',
    small: 'p-3',
    medium: 'p-4 md:p-6',
    large: 'p-6 md:p-8'
  };
  
  const shadowStyles = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg'
  };
  
  const hoverStyles = hover ? 'hover:shadow-lg cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';
  
  const combinedClassName = `${baseStyles} ${paddingStyles[padding]} ${shadowStyles[shadow]} ${hoverStyles} ${clickableStyles} ${className}`.trim();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };
  
  return (
    <div
      className={combinedClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};
