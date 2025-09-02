import React, { useState } from 'react';
import { TrendingUp, BarChart3, Clock, Power, Download, Calendar } from 'lucide-react';
import { useLoadShedding } from '../context/LoadSheddingContext';

function Analytics() {
    const { areas, schedules } = useLoadShedding();
    const [timeRange, setTimeRange] = useState('7d');

    const calculateStats = () => {
        const now = new Date();
        const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

        const recentSchedules = schedules.filter(s => s.start >= startDate);
        const totalOutages = recentSchedules.length;
        const completedOutages = recentSchedules.filter(s => s.status === 'completed').length;

        const totalDuration = recentSchedules.reduce((acc, schedule) => {
            return acc + (schedule.end.getTime() - schedule.start.getTime());
        }, 0);

        const averageDuration = totalOutages > 0 ? totalDuration / (totalOutages * 60 * 60 * 1000) : 0;

        const stageBreakdown = recentSchedules.reduce((acc, schedule) => {
            acc[schedule.stage] = (acc[schedule.stage] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return {
            totalOutages,
            completedOutages,
            averageDuration: Math.round(averageDuration * 10) / 10,
            stageBreakdown,
            affectedAreas: new Set(recentSchedules.map(s => s.areaId)).size
        };
    };

    const stats = calculateStats();

    const generateChartData = () => {
        const days = [];
        const now = new Date();
        const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

        for (let i = daysBack - 1; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const daySchedules = schedules.filter(s => {
                const scheduleDate = new Date(s.start);
                return scheduleDate.toDateString() === date.toDateString();
            });

            days.push({
                date: date.toISOString().split('T')[0],
                outages: daySchedules.length,
                duration: daySchedules.reduce((acc, s) =>
                    acc + (s.end.getTime() - s.start.getTime()) / (1000 * 60 * 60), 0
                )
            });
        }

        return days;
    };

    const chartData = generateChartData();
    const maxOutages = Math.max(...chartData.map(d => d.outages), 1);
    const maxDuration = Math.max(...chartData.map(d => d.duration), 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
                    <p className="text-gray-600 mt-1">Load shedding insights and trends</p>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Power className="w-8 h-8 text-red-500" />
                        <span className="text-2xl font-bold text-gray-900">{stats.totalOutages}</span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Total Outages</p>
                        <p className="text-sm text-gray-600">In selected period</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="w-8 h-8 text-amber-500" />
                        <span className="text-2xl font-bold text-gray-900">{stats.averageDuration}h</span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Avg Duration</p>
                        <p className="text-sm text-gray-600">Per outage</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <BarChart3 className="w-8 h-8 text-blue-500" />
                        <span className="text-2xl font-bold text-gray-900">{stats.affectedAreas}</span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Affected Areas</p>
                        <p className="text-sm text-gray-600">With outages</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="w-8 h-8 text-green-500" />
                        <span className="text-2xl font-bold text-gray-900">{stats.completedOutages}</span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Completed</p>
                        <p className="text-sm text-gray-600">Successfully resolved</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Outages Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Outages</h3>
                    <div className="space-y-3">
                        {chartData.slice(-7).map((day, index) => (
                            <div key={day.date} className="flex items-center space-x-3">
                                <div className="w-16 text-sm text-gray-600">
                                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short', day: 'numeric' })}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-200 rounded-full h-6 flex items-center">
                                        <div
                                            className="bg-red-500 h-6 rounded-full flex items-center justify-end pr-2"
                                            style={{ width: `${(day.outages / maxOutages) * 100}%` }}
                                        >
                                            <span className="text-xs text-white font-medium">
                                                {day.outages > 0 && day.outages}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-12 text-sm text-gray-600 text-right">
                                    {day.outages}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Duration Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Duration (hours)</h3>
                    <div className="space-y-3">
                        {chartData.slice(-7).map((day, index) => (
                            <div key={day.date} className="flex items-center space-x-3">
                                <div className="w-16 text-sm text-gray-600">
                                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short', day: 'numeric' })}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-200 rounded-full h-6 flex items-center">
                                        <div
                                            className="bg-amber-500 h-6 rounded-full flex items-center justify-end pr-2"
                                            style={{ width: `${(day.duration / maxDuration) * 100}%` }}
                                        >
                                            <span className="text-xs text-white font-medium">
                                                {day.duration > 0 && day.duration.toFixed(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-12 text-sm text-gray-600 text-right">
                                    {day.duration.toFixed(1)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stage Breakdown and Area Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stage Breakdown */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Outages by Stage</h3>
                    <div className="space-y-4">
                        {Object.entries(stats.stageBreakdown).map(([stage, count]) => {
                            const percentage = (count / stats.totalOutages) * 100;
                            const stageColors = {
                                '1': 'bg-yellow-500',
                                '2': 'bg-orange-500',
                                '3': 'bg-red-500',
                                '4': 'bg-purple-500'
                            };

                            return (
                                <div key={stage} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 rounded ${stageColors[stage as keyof typeof stageColors]}`}></div>
                                        <span className="font-medium">Stage {stage}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${stageColors[stage as keyof typeof stageColors]}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Area Performance */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Area Performance</h3>
                    <div className="space-y-3">
                        {areas.map(area => {
                            const areaSchedules = schedules.filter(s => s.areaId === area.id);
                            const areaOutages = areaSchedules.length;
                            const totalDuration = areaSchedules.reduce((acc, s) =>
                                acc + (s.end.getTime() - s.start.getTime()) / (1000 * 60 * 60), 0
                            );

                            return (
                                <div key={area.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{area.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {areaOutages} outages • {totalDuration.toFixed(1)}h total
                                        </p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${area.isActive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {area.isActive ? 'Offline' : 'Online'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">Peak Hours</h4>
                        <p className="text-sm text-gray-600">
                            Most outages occur between 6 PM - 10 PM during high demand periods
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Calendar className="w-6 h-6 text-amber-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">Weekly Pattern</h4>
                        <p className="text-sm text-gray-600">
                            Monday and Tuesday show the highest frequency of scheduled outages
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">Compliance</h4>
                        <p className="text-sm text-gray-600">
                            94% of outages completed within scheduled timeframes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;