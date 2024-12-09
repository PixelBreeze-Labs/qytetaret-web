import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    children: React.ReactNode;
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
         className,
         variant = 'default',
         size = 'default',
         isLoading = false,
         children,
         disabled,
         ...props
     }, ref) => {
        const variantStyles = {
            default: 'bg-primary text-white hover:bg-primary/90',
            outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800',
            ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
            secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100',
            destructive: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
            link: 'text-primary underline-offset-4 hover:underline',
        };

        const sizeStyles = {
            default: 'h-10 px-4 py-2',
            sm: 'h-8 px-3 text-sm',
            lg: 'h-12 px-8',
            icon: 'h-10 w-10',
        };

        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                ref={ref}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {children}
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';