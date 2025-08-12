import { formatDigitalDate, formatGoogleCalendarDate } from "../helpers/date-helper";

export function generateGoogleCalendarUrl(event, startDate) {
    const startDateFormatted = formatGoogleCalendarDate(startDate);
    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const params = new URLSearchParams({
        text: event.name,
        dates: `${startDateFormatted}/${startDateFormatted}`,
        details: event.description || '',
        location: event.event_location.full_address || ''
    });

    return `${baseUrl}&${params.toString()}`;
}

export function generateOutlookCalendarUrl(event, startDate) {
    const startDateFormatted = formatDigitalDate(startDate);
    const baseUrl = "https://outlook.live.com/owa/?path=/calendar/action/compose&rru=addevent";
    const params = new URLSearchParams({
        subject: event.name,
        body: event.description || '',
        location: event.location || '',
        startdt: startDateFormatted,
        enddt: startDateFormatted
    });

    return `${baseUrl}&${params.toString()}`;
}

export function generateYahooCalendarUrl(event, startDate) {
    const startDateFormatted = formatDigitalDate(startDate);
    const baseUrl = "https://calendar.yahoo.com/?v=60&view=d&type=20";
    const params = new URLSearchParams({
        title: event.name,
        st: startDateFormatted,
        et: startDateFormatted,
        desc: event.description || '',
        in_loc: event.event_location.full_address || ''
    });

    return `${baseUrl}&${params.toString()}`;
}