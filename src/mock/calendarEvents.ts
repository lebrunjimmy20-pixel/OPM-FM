import { addDays, subDays, startOfMonth, addHours } from 'date-fns';

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'preventive' | 'inspection' | 'corrective';
    status: 'scheduled' | 'completed' | 'overdue';
}

const generateEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const today = new Date();
    const start = startOfMonth(subDays(today, 30));

    for (let i = 0; i < 40; i++) {
        const date = addDays(start, Math.floor(Math.random() * 90));
        const type = Math.random() > 0.6 ? 'preventive' : Math.random() > 0.3 ? 'inspection' : 'corrective';
        let status: CalendarEvent['status'] = 'scheduled';

        if (date < today) {
            status = Math.random() > 0.2 ? 'completed' : 'overdue';
        }

        events.push({
            id: `evt-${i}`,
            title: `${type === 'preventive' ? 'PM:' : type === 'inspection' ? 'Inspect' : 'Fix'} Unit ${Math.floor(Math.random() * 20)}`,
            start: addHours(date, 9),
            end: addHours(date, 10 + Math.floor(Math.random() * 4)),
            type,
            status,
        });
    }
    return events;
};

export const mockEvents = generateEvents();
