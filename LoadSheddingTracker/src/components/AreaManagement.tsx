import React, { useState } from 'react';
import { Plus, MapPin, Edit, Trash2, Power, Clock } from 'lucide-react';
import { useLoadShedding } from '../context/LoadSheddingContext';

function AreaManagement() {
    const { areas, schedules, addArea, updateArea, deleteArea } = useLoadShedding();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingArea, setEditingArea] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        stage: 1,
        isActive: false,
        nextScheduled: '',
        duration: 2
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const areaData = {
            name: formData.name,
            stage: formData.stage,
            isActive: formData.isActive,
            nextScheduled: formData.nextScheduled ? new Date(formData.nextScheduled) : null,
            duration: formData.duration
        };

        if (editingArea) {
            updateArea(editingArea, areaData);
            setEditingArea(null);
        } else {
            addArea(areaData);
        }

        setFormData({
            name: '',
            stage: 1,
            isActive: false,
            nextScheduled: '',
            duration: 2
        });
        setShowAddForm(false);
    };

    const handleEdit = (area: any) => {
        setFormData({
            name: area.name,
            stage: area.stage,
            isActive: area.isActive,
            nextScheduled: area.nextScheduled ?
                new Date(area.nextScheduled).toISOString().slice(0, 16) : '',
            duration: area.duration
        });
        setEditingArea(area.id);
        setShowAddForm(true);
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingArea(null);
        setFormData({
            name: '',
            stage: 1,
            isActive: false,
            nextScheduled: '',
            duration: 2
        });
    };

    const getAreaSchedules = (areaId: string) => {
        return schedules.filter(s => s.areaId === areaId);
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'text-red-600' : 'text-green-600';
    };

    const getStatusIcon = (isActive: boolean) => {
        return isActive ? 'bg-red-100 border-red-200' : 'bg-green-100 border-green-200';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Area Management</h2>
                    <p className="text-gray-600 mt-1">Monitor and manage load shedding areas</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Area</span>
                </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingArea ? 'Edit Area' : 'Add New Area'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Area Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Stage
                            </label>
                            <select
                                value={formData.stage}
                                onChange={(e) => setFormData({ ...formData, stage: Number(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {[1, 2, 3, 4].map(stage => (
                                    <option key={stage} value={stage}>Stage {stage}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Next Scheduled Outage
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.nextScheduled}
                                onChange={(e) => setFormData({ ...formData, nextScheduled: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duration (hours)
                            </label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                min="0.5"
                                step="0.5"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Currently experiencing load shedding</span>
                            </label>
                        </div>
                        <div className="md:col-span-2 flex space-x-3">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {editingArea ? 'Update Area' : 'Add Area'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {areas.map(area => {
                    const areaSchedules = getAreaSchedules(area.id);
                    const upcomingSchedules = areaSchedules.filter(s => s.status === 'scheduled').length;

                    return (
                        <div key={area.id} className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg border ${getStatusIcon(area.isActive)}`}>
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{area.name}</h3>
                                        <p className={`text-sm ${getStatusColor(area.isActive)}`}>
                                            {area.isActive ? 'Power Out' : 'Power On'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => handleEdit(area)}
                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteArea(area.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Current Stage</span>
                                    <span className="font-medium">Stage {area.stage}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Upcoming Schedules</span>
                                    <span className="font-medium">{upcomingSchedules}</span>
                                </div>

                                {area.nextScheduled && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Next Outage</span>
                                        <span className="text-sm font-medium">
                                            {new Date(area.nextScheduled).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Duration</span>
                                    <span className="font-medium">{area.duration}h</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex space-x-2">
                                    <button className="flex-1 flex items-center justify-center space-x-2 text-sm bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                                        <Clock className="w-4 h-4" />
                                        <span>View Schedule</span>
                                    </button>
                                    <button className="flex-1 flex items-center justify-center space-x-2 text-sm bg-gray-50 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <Power className="w-4 h-4" />
                                        <span>Quick Action</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {areas.length === 0 && (
                <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Areas Added</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first monitoring area</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add Your First Area
                    </button>
                </div>
            )}
        </div>
    );
}

export default AreaManagement;