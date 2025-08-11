import { Link } from "react-router-dom";
import { formatDatePeriodFromDateDuration } from "../../helpers/date-helper";
import Map from "../UI/Map";

export default function EventDetailsSection({ event }) {
    /*
    <div className="card mb-2">
                                    <div className="card-header">
                                        <div className="card-title h5">
                                            <i className="icon icon-time mr-2"></i>
                                            Detalles del Evento
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="tile tile-centered mb-2">
                                            <div className="tile-icon">
                                                <div className="example-tile-icon">
                                                    <i className="icon icon-time"></i>
                                                </div>
                                            </div>
                                            <div className="tile-content">
                                                <div className="tile-title text-bold">Fecha y Hora</div>
                                                <div className="tile-subtitle text-gray">
                                                    {event.start_date && (
                                                        <>
                                                            {formatDateTime(event.start_date).date}
                                                            <br />
                                                            <strong>{formatDateTime(event.start_date).time}</strong>
                                                            {event.duration_in_minutes && (
                                                                <span className="label label-rounded label-secondary ml-2">
                                                                    {formatDuration(parseInt(event.duration_in_minutes))}
                                                                </span>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
    */
    return (
        <section className="card date-place-card">
            <div className="card-header">
                <div>
                    <i className="icon icon-time"></i>
                    <p>
                        {formatDatePeriodFromDateDuration(event.start_date, event.duration_in_minutes)}
                    </p>
                </div>
                <Link to={"/event-location/" + event.event_location.id}>
                    <div>
                        <i className="icon icon-location"></i>
                        <h2 className="card-title h4">{event.event_location.name}</h2>
                        <p className="card-subtitle text-gray">{event.event_location.full_address}</p>
                    </div>
                </Link>
            </div>
            <div className="card-image">
                <Map
                    position={[event.event_location.latitude, event.event_location.longitude]}
                    name={event.event_location.name}
                    zoom={14}
                    popup={<b>{event.event_location.name}</b>}
                />
            </div>
        </section>
    );
}