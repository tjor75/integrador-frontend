import { getDateOrDefault } from "../../helpers/validator-helper.js";
import { generateGoogleCalendarUrl, generateOutlookCalendarUrl, generateYahooCalendarUrl } from "../../utils/calendar.js";

export default function AddToCalendar({ event }) {
    const startDate = getDateOrDefault(event.start_date, null);
    const googleCalendarUrl     = generateGoogleCalendarUrl(event, startDate);
    const outlookCalendarUrl    = generateOutlookCalendarUrl(event, startDate);
    const yahooCalendarUrl      = generateYahooCalendarUrl(event, startDate);

    return (
        <div>
            <a className="btn btn-link" href={googleCalendarUrl} target="_blank">
                Google
            </a>
            <a className="btn btn-link" href={outlookCalendarUrl} target="_blank">
                Outlook
            </a>
            <a className="btn btn-link" href={yahooCalendarUrl} target="_blank">
                Yahoo
            </a>
        </div>
    );
}