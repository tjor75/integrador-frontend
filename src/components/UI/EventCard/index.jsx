import { Link } from "react-router-dom";
import { formatDateSmall, formatDuration } from "../../../helpers/date-helper.js";
import "./EventCard.css";
import Gravatar from "../Gravatar/index.jsx";

export default function EventCard({ event }) {
    const getEventStatus = () => {
        const now = new Date();
        const eventDate = new Date(event.start_date);
        const diffTime = eventDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return { text: "Finalizado", class: "label-error" };
        } else if (diffDays === 0) {
            return { text: "Hoy", class: "label-warning" };
        } else if (diffDays === 1) {
            return { text: "Mañana", class: "label-primary" };
        } else if (diffDays <= 7) {
            return { text: "Esta semana", class: "label-success" };
        } else {
            return { text: "Próximamente", class: "label" };
        }
    };

    const truncateText = (text, maxLength = 120) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const status = getEventStatus();

    return (
        <Link to={`/event/${event.id}`}>
            <div className="card event-card">
                <div className="card-header">
                    <h4 className="card-title">{event.name}</h4>
                    <span className={`label ${status.class} float-right`}>
                        {status.text}
                    </span>
                </div>
                
                <div className="card-body">
                    <p className="card-description">
                        {truncateText(event.description)}
                    </p>
                    
                    <div className="divider"></div>
                    
                    <div className="columns">
                        <div className="column col-6">
                            <div className="event-info">
                                <i className="icon icon-time text-primary"></i>
                                <span className="text-small">
                                    {formatDateSmall(event.start_date)}
                                </span>
                            </div>
                        </div>
                        <div className="column col-6">
                            <div className="event-info">
                                <i className="icon icon-arrow-right text-primary"></i>
                                <span className="text-small">
                                    {formatDuration(event.duration_minutes)}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="columns">
                        <div className="column col-6">
                            <div className="event-info">
                                <i className="icon icon-location text-primary"></i>
                                <span className="text-small">
                                    {event.event_location?.name || event.location?.name || "Ubicación no especificada"}
                                </span>
                            </div>
                        </div>
                        <div className="column col-6">
                            <div className="event-info">
                                <i className="icon icon-people text-primary"></i>
                                <span className="text-small">
                                    {event.max_attendees ? `${event.enrolled_users?.length || 0}/${event.max_attendees}` : "Sin límite"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="card-footer">
                    <div className="columns">
                        <div className="column col-8">
                            <div className="event-creator">
                                <Gravatar
                                    firstName={event.creator_user.first_name}
                                    lastName={event.creator_user.last_name}
                                    username={event.creator_user.username}
                                />
                                <span className="text-small text-gray">
                                    {event.creator_user.first_name} {event.creator_user.last_name}
                                </span>
                            </div>
                        </div>
                        <div className="column col-4 text-right">
                            {event.tags && event.tags.length > 0 && (
                                <span className="label label-rounded label-primary">
                                    {event.tags[0].name}
                                    {event.tags.length > 1 && ` +${event.tags.length - 1}`}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}