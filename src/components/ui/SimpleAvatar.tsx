"use client";

import { cn } from "@/lib/utils";

interface SimpleAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    size?: 'sm' | 'md' | 'lg';
    showName?: boolean;
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
};

const SimpleAvatar = ({
                          name,
                          size = 'md',
                          showName = false,
                          className,
                          ...props
                      }: SimpleAvatarProps) => {
    return (
        <div className="flex items-center gap-2">
            <div
                className={cn(
                    "relative flex shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800",
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
               <span className="flex h-full w-full items-center justify-center font-medium text-gray-900 dark:text-gray-100">
                   {getInitials(name)}
               </span>
            </div>
            {showName && (
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                   {name}
               </span>
            )}
        </div>
    );
};

export { SimpleAvatar };