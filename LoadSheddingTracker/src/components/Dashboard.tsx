import React from 'react';
import { Power, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { useLoadShedding } from '../context/LoadSheddingContext';
import StatusCard from './StatusCard';
import LiveUpdates from './LiveUpdates';

function Dashboard() {
    const { areas, schedules } = useLoadShedding();

    const activeOutages = areas.filter(area => area.isActive).length;
    const scheduledOutages = schedules.filter(s => s.status === 'scheduled').length;
    const totalAreas = areas.length;

    const getNextOutage = () => {
        const upcoming = schedules
            .filter(s => s.status === 'scheduled')
            .sort((a, b) => a.start.getTime() - b.start.getTime())[0];

        if (upcoming) {
            const area = areas.find(a => a.id === upcoming.areaId);
            return { schedule: upcoming, area };
        }
        return null;
    };

    const nextOutage = getNextOutage();

    return (
        <div className="space-y-6">
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard
                    title="Active Outages"
                    value={activeOutages}
                    icon={Power}
                    color="red"
                    subtitle={`${totalAreas - activeOutages} areas with power`}
                />
                <StatusCard
                    title="Scheduled Today"
                    value={scheduledOutages}
                    icon={Clock}
                    color="yellow"
                    subtitle="Upcoming outages"
                />
                <StatusCard
                    title="Total Areas"
                    value={totalAreas}
                    icon={MapPin}
                    color="blue"
                    subtitle="Monitored locations"
                />
                <StatusCard
                    title="System Status"
                    value="Online"
                    icon={AlertTriangle}
                    color="green"
                    subtitle="All systems operational"
                />
            </div>

            {/* Next Outage Alert */}
            {nextOutage && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-amber-900">Next Scheduled Outage</h3>
                            <p className="text-amber-700 mt-1">
                                <strong>{nextOutage.area?.name}</strong> - Stage {nextOutage.schedule.stage}
                            </p>
                            <p className="text-amber-600 text-sm mt-2">
                                Starts: {nextOutage.schedule.start.toLocaleString()} |
                                Duration: {((nextOutage.schedule.end.getTime() - nextOutage.schedule.start.getTime()) / (1000 * 60 * 60)).toFixed(1)} hours
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Live Updates and Current Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Updates */}
                <div className="lg:col-span-2">
                    <LiveUpdates />
                </div>

                {/* Current Outages */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Outages</h3>
                    <div className="space-y-4">
                        {areas.filter(area => area.isActive).map(area => {
                            const activeSchedule = schedules.find(s =>
                                s.areaId === area.id && s.status === 'active'
                            );
                            return (
                                <div key={area.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                    <div>
                                        <p className="font-medium text-red-900">{area.name}</p>
                                        <p className="text-sm text-red-600">Stage {area.stage} Load Shedding</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                        {activeSchedule && (
                                            <p className="text-xs text-red-600 mt-1">
                                                Until {activeSchedule.end.toLocaleTimeString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {areas.filter(area => area.isActive).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Power className="w-12 h-12 mx-auto mb-3 text-green-500" />
                                <p>No active outages</p>
                                <p className="text-sm">All areas currently have power</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                        <MapPin className="w-6 h-6 text-blue-600 mb-2" />
                        <p className="font-medium text-gray-900">Add New Area</p>
                        <p className="text-sm text-gray-500">Monitor additional location</p>
                    </button>
                    <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                        <Clock className="w-6 h-6 text-blue-600 mb-2" />
                        <p className="font-medium text-gray-900">Schedule Outage</p>
                        <p className="text-sm text-gray-500">Plan maintenance window</p>
                    </button>
                    <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                        <AlertTriangle className="w-6 h-6 text-blue-600 mb-2" />
                        <p className="font-medium text-gray-900">Report Outage</p>
                        <p className="text-sm text-gray-500">Log unscheduled outage</p>
                    </button>
                    <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                        <Power className="w-6 h-6 text-blue-600 mb-2" />
                        <p className="font-medium text-gray-900">System Settings</p>
                        <p className="text-sm text-gray-500">Configure monitoring</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;