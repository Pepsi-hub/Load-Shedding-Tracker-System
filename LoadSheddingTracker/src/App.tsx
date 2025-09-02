import React, { useState, useEffect } from 'react';
import { Power, MapPin, Calendar, Bell, TrendingUp, Download } from 'lucide-react';
import Dashboard from '../src/components/Dashboard';
import ScheduleCalendar from '../src/components/ScheduleCalender';
import AreaManagement from '../src/components/AreaManagement';
import Analytics from '../src/components/Analytics';
import { LoadSheddingProvider } from '../src/context/LoadSheddingContext';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Power },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'areas', label: 'Areas', icon: MapPin },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    ];

    return (
        <LoadSheddingProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Power className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Load Shedding Tracker</h1>
                                    <p className="text-sm text-gray-500">Power outage monitoring system</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Bell className="w-5 h-5" />
                                </button>
                                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    <Download className="w-4 h-4" />
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Navigation */}
                <nav className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex space-x-8">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'schedule' && <ScheduleCalendar />}
                    {activeTab === 'areas' && <AreaManagement />}
                    {activeTab === 'analytics' && <Analytics />}
                </main>
            </div>
        </LoadSheddingProvider>
    );
}

export default App;