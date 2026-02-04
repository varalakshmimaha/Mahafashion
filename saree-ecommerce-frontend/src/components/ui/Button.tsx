import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  style,
  ...props
}) => {
  // Base styles - Flex, Center, Transitions
  const baseClasses = 'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed gap-2';

  // Strict Size variants - Enforcing 48px height for standard buttons
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm h-10', // Smaller option if absolutely needed
    md: 'px-6 py-3.5 h-[48px]', // The GOLD STANDARD: 48px height, 14px vertical padding (approx)
    lg: 'px-8 py-4 h-[56px]', // Larger option
  };

  // Dynamic style object based on theme variables
  const themeStyles: React.CSSProperties = {
    borderRadius: 'var(--btn-radius)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--btn-font-weight)',
    fontSize: 'var(--btn-font-size)', // Always enforce global font size for primary/default buttons, unless overridden by size class specificity which might not work if this is inline. 
    // Actually, allowing Tailwind text-* classes to work is better, so only set if size is 'md' or leave it to class.
    // User requested "Same Size, Same Font". 
    // Let's enforce it strongly.
    ...style,
  };

  // Specific override for size if not 'md' to allow scaling, OR enforce strictly.
  // "Use ONE color, same size, same font, same radius everywhere."
  // I will enforce the variables.
  if (size === 'md') {
    themeStyles.fontSize = 'var(--btn-font-size)';
  } else if (size === 'sm') {
    themeStyles.fontSize = 'calc(var(--btn-font-size) * 0.875)';
  } else if (size === 'lg') {
    themeStyles.fontSize = 'calc(var(--btn-font-size) * 1.125)';
  }

  // Variant-specific styles
  let variantClass = '';

  if (variant === 'primary') {
    variantClass = 'text-[color:var(--btn-text-color)] shadow-md hover:shadow-lg active:scale-95 border-2 border-transparent';
    themeStyles.backgroundColor = 'var(--btn-bg)';
    // Hover handling
    variantClass += ' hover:bg-[var(--btn-hover-bg)]';
  } else if (variant === 'secondary') {
    // Secondary is often grey or muted
    variantClass = 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-2 border-transparent';
  } else if (variant === 'outline') {
    // Secondary Action Button (Optional) - "Cancel", "Back"
    // Outline usually takes the primary color for the border
    variantClass = 'bg-transparent hover:bg-[var(--btn-bg)] hover:text-[color:var(--btn-text-color)]';
    themeStyles.borderColor = 'var(--btn-bg)';
    themeStyles.color = 'var(--btn-bg)';
    themeStyles.borderWidth = '2px';
    themeStyles.borderStyle = 'solid';
  } else if (variant === 'ghost') {
    // Ghost - "Continue Shopping" maybe?
    variantClass = 'bg-transparent hover:bg-gray-50 border-2 border-transparent';
    themeStyles.color = 'var(--btn-bg)';
  } else if (variant === 'danger') {
    variantClass = 'bg-red-600 text-white hover:bg-red-700 border-2 border-transparent';
  }

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClass} ${widthClass} ${className}`}
      disabled={disabled}
      style={themeStyles}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
