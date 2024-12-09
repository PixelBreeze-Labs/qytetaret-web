import React from 'react';

// Helper function to merge class names
const cn = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
};

// Define the variant styles
const variantStyles = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border-gray-300 bg-white hover:bg-gray-100"
};

// Badge Props interface
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: keyof typeof variantStyles;
}

const Badge: React.FC<BadgeProps> = ({
                                         className,
                                         variant = 'default',
                                         children,
                                         ...props
                                     }) => {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variantStyles[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export { Badge };