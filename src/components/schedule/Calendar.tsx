import { useState } from 'react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { CalendarEvent } from '../../mock/calendarEvents';

interface Props {
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
}

const Calendar = ({ events, onEventClick }: Props) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Generate cells
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    const getEventColor = (type: string, status: string) => {
        if (status === 'overdue') return 'bg-red-100 text-red-700 border-red-200';
        if (status === 'completed') return 'bg-blue-100 text-blue-700 border-blue-200';
        if (type === 'preventive') return 'bg-green-100 text-green-700 border-green-200';
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[800px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex rounded-md shadow-sm">
                        <button onClick={prevMonth} className="p-1 px-2 border border-r-0 border-gray-300 rounded-l-md hover:bg-gray-50 text-gray-500">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => setCurrentMonth(new Date())} className="px-3 border-t border-b border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 text-gray-700">
                            Today
                        </button>
                        <button onClick={nextMonth} className="p-1 px-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50 text-gray-500">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {['Month', 'Week', 'Day'].map(v => (
                            <button
                                key={v}
                                onClick={() => setView(v.toLowerCase() as any)}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${view === v.toLowerCase() ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-green-800 text-sm font-medium">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Event
                    </button>
                </div>
            </div>

            {/* Calendar Grid (Month View) */}
            <div className="flex-1 flex flex-col">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                    {daysOfWeek.map(d => (
                        <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 grid-rows-5 flex-1 bg-gray-200 gap-px border-b border-gray-200">
                    {allDays.map((dayItem) => {
                        const dayEvents = events.filter(e => isSameDay(e.start, dayItem));
                        return (
                            <div
                                key={dayItem.toISOString()}
                                className={`bg-white min-h-[120px] p-2 flex flex-col ${!isSameMonth(dayItem, monthStart) ? 'bg-gray-50 text-gray-400' : ''}`}
                            >
                                <div className={`text-right text-xs font-medium mb-1 ${isToday(dayItem) ? 'flex justify-end' : ''}`}>
                                    <span className={isToday(dayItem) ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}>
                                        {format(dayItem, 'd')}
                                    </span>
                                </div>

                                <div className="space-y-1 overflow-y-auto max-h-[100px] custom-scrollbar">
                                    {dayEvents.map(evt => (
                                        <button
                                            key={evt.id}
                                            onClick={() => onEventClick(evt)}
                                            className={`w-full text-left px-2 py-1 rounded border text-xs truncate ${getEventColor(evt.type, evt.status)}`}
                                        >
                                            {format(evt.start, 'HH:mm')} {evt.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
