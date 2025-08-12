import { Link } from "react-router-dom";
import { formatDuration } from "../../../helpers/date-helper.js";
import "./EventCard.css";
import Gravatar from "../Gravatar/index.jsx";

export default function EventCard({ event }) {
    const formatPrice = (rawPrice) => {
        if (rawPrice === null || typeof rawPrice === "undefined") return null;
        const price = Number(rawPrice);
        if (!isFinite(price)) return null;
        return price === 0 ? "Gratuito" : `$${price.toLocaleString('es-ES')}`;
    };

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
    const priceLabel = formatPrice(event.price);
    const locationName = event.event_location?.name || event.location?.name;
    const enrolledCount = (event.enrolled_users?.length ?? event.enrolled_count ?? 0);
    const maxSeats = (event.max_assistance ?? event.max_attendees ?? null);
    const tags = Array.isArray(event.tags)
        ? (typeof event.tags[0] === 'string' ? event.tags : event.tags.map(t => t.name))
        : [];
    const eventDateText = new Date(event.start_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    const durationMins = (event.duration_in_minutes ?? event.duration_minutes ?? event.duration ?? null);

    return (
        <Link to={`/event/${event.id}`}>
            <div className="card event-card">
                <div className="card-header">
                    <h4 className="card-title m-0">{event.name}</h4>
                    <span className={`label ${status.class} status-badge`}>
                        {status.text}
                    </span>
                </div>
                
                <div className="card-body">
                    <div className="d-flex flex-wrap gap-1 mb-2">
                        {priceLabel && (
                            <span className={`chip ${event.price === 0 ? 'bg-success text-light' : 'bg-primary text-light'}`}>
                                <i className="icon icon-bookmark mr-1"></i>
                                {priceLabel}
                            </span>
                        )}
                        {locationName && (
                            <span className="chip">
                                <i className="icon icon-location mr-1"></i>
                                {locationName}
                            </span>
                        )}
                        {typeof event.enabled_for_enrollment === 'boolean' && !event.enabled_for_enrollment && (
                            <span className="chip bg-error text-light">
                                <i className="icon icon-cross mr-1"></i>
                                Inscripciones cerradas
                            </span>
                        )}
                    </div>

                    <p className="card-description">
                        {truncateText(event.description ?? "Sin descripción")}
                    </p>
                    
                    <div className="divider"></div>
                    
                    <div className="columns">
                        <div className="column col-6 col-sm-12">
                            <div className="event-info">
                                <i className="icon icon-time text-primary"></i>
                                <span className="text-small">
                                    {eventDateText}
                                </span>
                            </div>
                        </div>
                        {durationMins !== null && (
                            <div className="column col-6 col-sm-12">
                                <div className="event-info">
                                    <i className="icon icon-arrow-right text-primary"></i>
                                    <span className="text-small">
                                        {formatDuration(Number(durationMins))}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="columns">
                        <div className="column col-6 col-sm-12">
                            <div className="event-info">
                                <i className="icon icon-people text-primary"></i>
                                <span className="text-small">
                                    {maxSeats ? `${enrolledCount}/${maxSeats}` : "Sin límite"}
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
                                    firstName={event.creator_user?.first_name}
                                    lastName={event.creator_user?.last_name}
                                    username={event.creator_user?.username}
                                />
                                <span className="text-small text-gray">
                                    {event.creator_user?.first_name} {event.creator_user?.last_name}
                                </span>
                            </div>
                        </div>
                        <div className="column col-4 text-right">
                            {tags.length > 0 && (
                                <div className="d-inline-flex flex-wrap gap-1 justify-end">
                                    {tags.slice(0, 2).map((t, idx) => (
                                        <span key={idx} className="label label-rounded label-primary">{t}</span>
                                    ))}
                                    {tags.length > 2 && (
                                        <span className="label label-rounded">+{tags.length - 2}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}