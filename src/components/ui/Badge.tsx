const Badge = ({
                   variant = 'default',
                   className = '',
                   children,
                   ...props
               }) => {
    const variants = {
        default: "bg-primary text-white",
        secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        outline: "border border-gray-200 dark:border-gray-700",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
        error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
            {...props}
        >
      {children}
    </span>
    );
};

export { Badge };