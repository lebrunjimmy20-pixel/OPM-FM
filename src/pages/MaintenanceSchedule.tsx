import { useState } from 'react';
import Calendar from '../components/schedule/Calendar';
import { mockEvents } from '../mock/calendarEvents';
import type { CalendarEvent } from '../mock/calendarEvents';

const MaintenanceSchedule = () => {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-100px)]">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Maintenance Schedule</h1>
                <p className="text-gray-500 mt-1">Plan and view preventive and corrective maintenance.</p>
            </div>

            <Calendar
                events={mockEvents}
                onEventClick={(evt) => setSelectedEvent(evt)}
            />

            {/* Event Details Modal (Simplified) */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-2">{selectedEvent.title}</h3>
                        <div className="space-y-2 text-sm text-gray-600 mb-6">
                            <p><span className="font-semibold">Status:</span> <span className="capitalize">{selectedEvent.status}</span></p>
                            <p><span className="font-semibold">Type:</span> <span className="capitalize">{selectedEvent.type}</span></p>
                            <p><span className="font-semibold">Start:</span> {selectedEvent.start.toLocaleString()}</p>
                            <p><span className="font-semibold">End:</span> {selectedEvent.end.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceSchedule;
