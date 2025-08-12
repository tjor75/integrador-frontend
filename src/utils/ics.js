export default function generateICS(event) {
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    const pad = (num) => (num < 10 ? '0' : '') + num;

    // Format date as YYYYMMDD for all-day events
    const formatDateOnly = (date) => {
        return date.getUTCFullYear() +
            pad(date.getUTCMonth() + 1) +
            pad(date.getUTCDate());
    };

    // Get formatted dates
    const startDateFormatted = formatDateOnly(startDate);
    const endDateFormatted = formatDateOnly(endDate);
    
    // For all-day events, the end date should be the day after 
    // the last day of the event in the iCalendar spec
    const endDateObj = new Date(endDate);
    endDateObj.setDate(endDateObj.getDate() + 1);
    const adjustedEndDate = formatDateOnly(endDateObj);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${event.id}@mileventos
DTSTAMP:${formatDateOnly(new Date())}
DTSTART;VALUE=DATE:${startDateFormatted}
DTEND;VALUE=DATE:${adjustedEndDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], {type: 'text/calendar'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title || 'event'}.ics`;
    
    return icsContent;
}