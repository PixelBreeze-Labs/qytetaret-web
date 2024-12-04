'use client';
import React from 'react';
import { Dialog as ReachDialog } from '@reach/dialog';
import '@reach/dialog/styles.css'; // You can replace this with your styles or framework (e.g., TailwindCSS).

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    return (
        <ReachDialog
            isOpen={open}
            onDismiss={() => onOpenChange(false)}
            className="rounded-lg shadow-lg p-6 bg-white max-w-md mx-auto"
        >
            {children}
        </ReachDialog>
    );
};

interface DialogContentProps {
    children: React.ReactNode;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children }) => {
    return <div className="space-y-4">{children}</div>;
};

interface DialogHeaderProps {
    children: React.ReactNode;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
    return <div className="border-b pb-2 mb-4">{children}</div>;
};

interface DialogTitleProps {
    children: React.ReactNode;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
    return <h2 className="text-xl font-bold text-gray-900">{children}</h2>;
};

interface DialogDescriptionProps {
    children: React.ReactNode;
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ children }) => {
    return <p className="text-sm text-gray-600">{children}</p>;
};

interface DialogFooterProps {
    children: React.ReactNode;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({ children }) => {
    return <div className="flex justify-end gap-2 mt-4">{children}</div>;
};
