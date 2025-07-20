export function formatDatePeriodFromDateDuration(dateString, addedMinsString) {
    const startDate = new Date(dateString);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + Number(addedMinsString));

    return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}