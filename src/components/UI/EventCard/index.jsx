import { Link } from "react-router-dom";
import { formatDatePeriodFromDateDuration } from "../../../helpers/date-helper.js";
import "./EventCard.css";

export default function EventCard({ event }) {
    return (
        <Link to={`/event/${event.id}`} className="text-dark">
            <div className="card event-card">
                <div className="card-header">
                    <p className="card-title h4">{event.name}</p>
                </div>
                <div className="card-body">
                    <div className="columns">
                        <p className="column col-auto">
                            <i className="icon icon-time"></i>
                            {formatDatePeriodFromDateDuration(event.start_date, event.duration_in_minutes)}
                        </p>
                        <p className="column col-auto">
                            <i className="icon icon-people"></i>
                            {event.creator_user.first_name} {event.creator_user.last_name}
                        </p>
                        <p className="column col-auto">
                            <i className="icon icon-location"></i>
                            {event.location.name}
                        </p>
                    </div>
                    <p
                        className="card-short-description"
                        title={event.description}
                    >
                        {event.description}
                    </p>
                </div>
            </div>
        </Link>
    );
}