export function formatDateSmall(dateString) {
    const date = new Date(dateString);
    return `${date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    })}`;
}

export function formatDatePeriodFromDateDuration(dateString, addedMinsString) {
    const startDate = new Date(dateString);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + Number(addedMinsString));

    return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

export function formatDateTime(dateString) {
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        time: date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    };
}

export function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    } else if (minutes === 60) {
        return "1 hora";
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
    }
}

export function formatGoogleCalendarDate(date) {
    // YYYYMMDD
    return date?.toISOString().replace(/[-:]/g, '').split('.')[0];
}
export function formatDigitalDate(date) {
    return date?.toISOString().replace(/[-:]/g, '').split('.')[0]
}