'use client';

import {CheckIcon} from '@heroicons/react/24/solid';
import { Globe } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';
import {useTransition} from 'react';
import {Locale} from '@/i18n/config';
import {setUserLocale} from '@/services/locale';

type Props = {
    defaultValue: string;
    items: Array<{value: string; label: string}>;
    label: string;
};

export default function LocaleSwitcherSelect({
                                                 defaultValue,
                                                 items,
                                                 label
                                             }: Props) {
    const [isPending, startTransition] = useTransition();

    function onChange(value: string) {
        const locale = value as Locale;
        startTransition(() => {
            setUserLocale(locale);
        });
    }

    return (
        <div className="relative">
            <Select.Root defaultValue={defaultValue} onValueChange={onChange}>
                {/* Updated Trigger */}
                <Select.Trigger
                    aria-label={label}
                    className={clsx(
                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-gray-800',
                        isPending && 'pointer-events-none opacity-60'
                    )}
                >
                    <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium">{defaultValue.toUpperCase()}</span>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content
                        align="end"
                        className="z-[9999] min-w-[8rem] overflow-hidden rounded-lg bg-white dark:bg-gray-800 py-1 shadow-lg border border-gray-200 dark:border-gray-700"
                        position="popper"
                        sideOffset={5}
                    >
                        <Select.Viewport>
                            {items.map((item) => (
                                <Select.Item
                                    key={item.value}
                                    className="flex cursor-pointer items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    value={item.value}
                                >
                                    <div className="mr-2 w-[1rem]">
                                        {item.value === defaultValue && (
                                            <CheckIcon className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                    <span>{item.label}</span>
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </div>
    );
}