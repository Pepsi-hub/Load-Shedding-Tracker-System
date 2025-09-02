
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LoadSheddingArea {
    id: string;
    name: string;
    stage: number;
    isActive: boolean;
    nextScheduled: Date | null;
    duration: number; // hours
}

export interface ScheduleEvent {
    id: string;
    areaId: string;
    start: Date;
    end: Date;
    stage: number;
    status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

interface LoadSheddingContextType {
    areas: LoadSheddingArea[];
    schedules: ScheduleEvent[];
    addArea: (area: Omit<LoadSheddingArea, 'id'>) => void;
    updateArea: (id: string, updates: Partial<LoadSheddingArea>) => void;
    deleteArea: (id: string) => void;
    addSchedule: (schedule: Omit<ScheduleEvent, 'id'>) => void;
    updateSchedule: (id: string, updates: Partial<ScheduleEvent>) => void;
    deleteSchedule: (id: string) => void;
}

const LoadSheddingContext = createContext<LoadSheddingContextType | undefined>(undefined);

export function LoadSheddingProvider({ children }: { children: React.ReactNode }) {
    const [areas, setAreas] = useState<LoadSheddingArea[]>([
        {
            id: '1',
            name: 'Cape Town Central',
            stage: 2,
            isActive: false,
            nextScheduled: new Date(Date.now() + 2 * 60 * 60 * 1000),
            duration: 2.5
        },
        {
            id: '2',
            name: 'Johannesburg North',
            stage: 3,
            isActive: true,
            nextScheduled: new Date(Date.now() + 4 * 60 * 60 * 1000),
            duration: 4
        },
        {
            id: '3',
            name: 'Durban South',
            stage: 1,
            isActive: false,
            nextScheduled: new Date(Date.now() + 6 * 60 * 60 * 1000),
            duration: 2
        }
    ]);

    const [schedules, setSchedules] = useState<ScheduleEvent[]>([
        {
            id: '1',
            areaId: '1',
            start: new Date(Date.now() + 2 * 60 * 60 * 1000),
            end: new Date(Date.now() + 4.5 * 60 * 60 * 1000),
            stage: 2,
            status: 'scheduled'
        },
        {
            id: '2',
            areaId: '2',
            start: new Date(Date.now() - 1 * 60 * 60 * 1000),
            end: new Date(Date.now() + 3 * 60 * 60 * 1000),
            stage: 3,
            status: 'active'
        },
        {
            id: '3',
            areaId: '3',
            start: new Date(Date.now() + 6 * 60 * 60 * 1000),
            end: new Date(Date.now() + 8 * 60 * 60 * 1000),
            stage: 1,
            status: 'scheduled'
        }
    ]);

    const addArea = (area: Omit<LoadSheddingArea, 'id'>) => {
        const newArea = { ...area, id: Date.now().toString() };
        setAreas(prev => [...prev, newArea]);
    };

    const updateArea = (id: string, updates: Partial<LoadSheddingArea>) => {
        setAreas(prev => prev.map(area =>
            area.id === id ? { ...area, ...updates } : area
        ));
    };

    const deleteArea = (id: string) => {
        setAreas(prev => prev.filter(area => area.id !== id));
        setSchedules(prev => prev.filter(schedule => schedule.areaId !== id));
    };

    const addSchedule = (schedule: Omit<ScheduleEvent, 'id'>) => {
        const newSchedule = { ...schedule, id: Date.now().toString() };
        setSchedules(prev => [...prev, newSchedule]);
    };

    const updateSchedule = (id: string, updates: Partial<ScheduleEvent>) => {
        setSchedules(prev => prev.map(schedule =>
            schedule.id === id ? { ...schedule, ...updates } : schedule
        ));
    };

    const deleteSchedule = (id: string) => {
        setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            // Update schedule statuses
            setSchedules(prev => prev.map(schedule => {
                if (now >= schedule.start && now <= schedule.end && schedule.status === 'scheduled') {
                    return { ...schedule, status: 'active' };
                }
                if (now > schedule.end && schedule.status === 'active') {
                    return { ...schedule, status: 'completed' };
                }
                return schedule;
            }));

            // Update area active status
            setAreas(prev => prev.map(area => {
                const activeSchedule = schedules.find(s =>
                    s.areaId === area.id && s.status === 'active'
                );
                return { ...area, isActive: !!activeSchedule };
            }));
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [schedules]);

    return (
        <LoadSheddingContext.Provider value={{
            areas,
            schedules,
            addArea,
            updateArea,
            deleteArea,
            addSchedule,
            updateSchedule,
            deleteSchedule
        }}>
            {children}
        </LoadSheddingContext.Provider>
    );
}

export function useLoadShedding() {
    const context = useContext(LoadSheddingContext);
    if (context === undefined) {
        throw new Error('useLoadShedding must be used within a LoadSheddingProvider');
    }
    return context;
}