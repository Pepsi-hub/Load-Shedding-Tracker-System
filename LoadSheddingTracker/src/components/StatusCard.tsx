import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatusCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: 'red' | 'yellow' | 'green' | 'blue';
    subtitle?: string;
}

function StatusCard({ title, value, icon: Icon, color, subtitle }: StatusCardProps) {
    const colorClasses = {
        red: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            icon: 'text-red-600',
            text: 'text-red-900',
            subtitle: 'text-red-600'
        },
        yellow: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            icon: 'text-amber-600',
            text: 'text-amber-900',
            subtitle: 'text-amber-600'
        },
        green: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            icon: 'text-green-600',
            text: 'text-green-900',
            subtitle: 'text-green-600'
        },
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: 'text-blue-600',
            text: 'text-blue-900',
            subtitle: 'text-blue-600'
        }
    };

    const classes = colorClasses[color];

    return (
        <div className={`${classes.bg} ${classes.border} border rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
                <Icon className={`w-6 h-6 ${classes.icon}`} />
            </div>
            <div>
                <p className={`text-2xl font-bold ${classes.text}`}>{value}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">{title}</p>
                {subtitle && (
                    <p className={`text-xs mt-2 ${classes.subtitle}`}>{subtitle}</p>
                )}
            </div>
        </div>
    );
}

export default StatusCard;