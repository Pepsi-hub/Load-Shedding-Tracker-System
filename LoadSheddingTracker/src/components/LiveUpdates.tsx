import React, { useState, useEffect } from 'react';
import { Clock, Power, AlertCircle, CheckCircle } from 'lucide-react';
import { useLoadShedding } from '../context/LoadSheddingContext';

interface Update {
    id: string;
    timestamp: Date;
    type: 'outage_start' | 'outage_end' | 'schedule_change' | 'system_alert';
    message: string;
    areaName?: string;
}

function LiveUpdates() {
    const { areas, schedules } = useLoadShedding();
    const [updates, setUpdates] = useState<Update[]>([
        {
            id: '1',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            type: 'outage_start',
            message: 'Load shedding started - Stage 3',
            areaName: 'Johannesburg North'
        },
        {
            id: '2',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            type: 'schedule_change',
            message: 'Schedule updated for tomorrow',
            areaName: 'Cape Town Central'
        },
        {
            id: '3',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            type: 'outage_end',
            message: 'Power restored after scheduled outage',
            areaName: 'Durban East'
        },
        {
            id: '4',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            type: 'system_alert',
            message: 'System maintenance completed successfully'
        }
    ]);

    const getUpdateIcon = (type: Update['type']) => {
        switch (type) {
            case 'outage_start':
                return <Power className="w-4 h-4 text-red-500" />;
            case 'outage_end':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'schedule_change':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'system_alert':
                return <AlertCircle className="w-4 h-4 text-amber-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getUpdateColor = (type: Update['type']) => {
        switch (type) {
            case 'outage_start':
                return 'border-red-200 bg-red-50';
            case 'outage_end':
                return 'border-green-200 bg-green-50';
            case 'schedule_change':
                return 'border-blue-200 bg-blue-50';
            case 'system_alert':
                return 'border-amber-200 bg-amber-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    const formatTimeAgo = (timestamp: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - timestamp.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return timestamp.toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Live Updates</h3>
                <div className="flex items-center space-x-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live</span>
                </div>
            </div>

            <div className="space-y-4">
                {updates.map(update => (
                    <div
                        key={update.id}
                        className={`flex items-start space-x-3 p-4 rounded-lg border ${getUpdateColor(update.type)}`}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {getUpdateIcon(update.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {update.message}
                                    </p>
                                    {update.areaName && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            Area: {update.areaName}
                                        </p>
                                    )}
                                </div>
                                <time className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                    {formatTimeAgo(update.timestamp)}
                                </time>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    View All Updates
                </button>
            </div>
        </div>
    );
}

export default LiveUpdates;