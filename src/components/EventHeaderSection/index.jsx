import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Gravatar from "../UI/Gravatar";
import "./EventHeaderSection.css";

export default function EventHeaderSection({ event }) {
    /*
    <header className="event-header">
            <h1 className="event-title">{event.title}</h1>
            <div className="event-details">
                <span className="event-date">
                    {formatDatePeriodFromDateDuration(event.start_date, event.duration_in_minutes)}
                </span>
                <span className="event-location">
                    {event.event_location ? event.event_location.name : "Ubicación no disponible"}
                </span>
            </div>
        </header>
    */

    const { currentUser } = useContext(GlobalContext);
    const isEventCreator = currentUser && event && currentUser.id === event.creator_user.id;

    // Format price
    const formatPrice = (price) => {
        return price === 0 ? 'Gratuito' : `$${price.toLocaleString('es-ES')}`;
    };

    return (
        <section className="hero hero-sm bg-gray event-header">
            <div className="hero-body">
                <div className="text-center">
                    <h1 className="hero-title h2 mb-2">{event.name}</h1>
                    <div className="d-flex flex-wrap mb-2 event-header-details">
                        <div className="chip mr-2 mb-1">
                            <Gravatar
                                firstName={event.creator_user.first_name}
                                lastName={event.creator_user.last_name}
                                username={event.creator_user.username}
                            />
                            <span className="ml-1">
                                Organizado por {event.creator_user.first_name} {event.creator_user.last_name}
                            </span>
                        </div>
                        {event.price !== undefined && (
                            <div className="chip bg-success text-light mr-2 mb-1">
                                <i className="icon icon-bookmark mr-1"></i>
                                {formatPrice(event.price)}
                            </div>
                        )}
                        {!event.enabled_for_enrollment && (
                            <div className="chip bg-error text-light mr-2 mb-1">
                                <i className="icon icon-cross mr-1"></i>
                                Inscripciones cerradas
                            </div>
                        )}
                    </div>
                                    
                    {isEventCreator && (
                        <div className="btn-group mt-2">
                            <Link to={`/event/${event.id}/edit`} className="btn btn-primary btn-sm">
                                <i className="icon icon-edit mr-1"></i>
                                Editar Evento
                            </Link>
                            <button className="btn btn-error btn-sm">
                                <i className="icon icon-delete mr-1"></i>
                                Eliminar Evento
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}