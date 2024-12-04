'use client';
import React from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => (
    <Transition show={open} as={Fragment}>
        <HeadlessDialog onClose={() => onOpenChange(false)} className="relative z-50">
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black/50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <HeadlessDialog.Panel className="w-full max-w-md transform rounded-lg bg-white dark:bg-[#151F34] p-6 shadow-xl transition-all">
                            {children}
                        </HeadlessDialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </HeadlessDialog>
    </Transition>
);

export const DialogContent = ({ children }: { children: React.ReactNode }) => (
    <div className="space-y-4">{children}</div>
);

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">{children}</div>
);

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
    <HeadlessDialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
        {children}
    </HeadlessDialog.Title>
);

export const DialogDescription = ({ children }: { children: React.ReactNode }) => (
    <HeadlessDialog.Description className="text-sm text-gray-600 dark:text-gray-400">
        {children}
    </HeadlessDialog.Description>
);

export const DialogFooter = ({ children }: { children: React.ReactNode }) => (
    <div className="flex justify-end gap-3 mt-6">{children}</div>
);