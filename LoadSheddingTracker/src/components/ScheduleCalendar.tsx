import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useLoadShedding } from '../context/LoadSheddingContext';

function ScheduleCalendar() {
    const { areas, schedules, addSchedule } = useLoadShedding();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showAddForm, setShowAddForm] = useState(false);

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setMonth(currentDate.getMonth() - 1);
        } else {
            newDate.setMonth(currentDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const getSchedulesForDate = (date: Date) => {
        return schedules.filter(schedule => {
            const scheduleDate = new Date(schedule.start);
            return scheduleDate.toDateString() === date.toDateString();
        });
    };

    const getStageColor = (stage: number) => {
        const colors = {
            1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            2: 'bg-orange-100 text-orange-800 border-orange-200',
            3: 'bg-red-100 text-red-800 border-red-200',
            4: 'bg-purple-100 text-purple-800 border-purple-200'
        };
        return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-gray-900">Schedule Calendar</h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => navigateMonth('prev')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-lg font-semibold min-w-[150px] text-center">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button
                            onClick={() => navigateMonth('next')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Schedule</span>
                </button>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Load Shedding Stages</h3>
                <div className="flex flex-wrap gap-4">
                    {[1, 2, 3, 4].map(stage => (
                        <div key={stage} className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded border ${getStageColor(stage)}`}></div>
                            <span className="text-sm text-gray-700">Stage {stage}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Days of week header */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7">
                    {days.map((day, index) => {
                        if (!day) {
                            return <div key={index} className="h-24 border-b border-r border-gray-200"></div>;
                        }

                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const daySchedules = getSchedulesForDate(date);
                        const isToday = date.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={day}
                                className={`h-24 border-b border-r border-gray-200 p-2 relative ${isToday ? 'bg-blue-50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'
                                    }`}>
                                    {day}
                                </div>

                                <div className="mt-1 space-y-1">
                                    {daySchedules.slice(0, 2).map(schedule => {
                                        const area = areas.find(a => a.id === schedule.areaId);
                                        return (
                                            <div
                                                key={schedule.id}
                                                className={`text-xs px-2 py-1 rounded border ${getStageColor(schedule.stage)}`}
                                                title={`${area?.name} - Stage ${schedule.stage}`}
                                            >
                                                <div className="truncate">
                                                    {area?.name}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {daySchedules.length > 2 && (
                                        <div className="text-xs text-gray-500">
                                            +{daySchedules.length - 2} more
                                        </div>
                                    )}
                                </div>

                                {isToday && (
                                    <div className="absolute top-1 right-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Upcoming Schedules */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Schedules</h3>
                <div className="space-y-3">
                    {schedules
                        .filter(s => s.status === 'scheduled' && s.start > new Date())
                        .sort((a, b) => a.start.getTime() - b.start.getTime())
                        .slice(0, 5)
                        .map(schedule => {
                            const area = areas.find(a => a.id === schedule.areaId);
                            return (
                                <div key={schedule.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 rounded ${getStageColor(schedule.stage)}`}></div>
                                        <div>
                                            <p className="font-medium text-gray-900">{area?.name}</p>
                                            <p className="text-sm text-gray-600">Stage {schedule.stage} Load Shedding</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {schedule.start.toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {schedule.start.toLocaleTimeString()} - {schedule.end.toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

export default ScheduleCalendar;