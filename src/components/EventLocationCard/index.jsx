export default function EventLocationCard({ event }) {
    return (
        <div className="tile tile-centered mb-2">
            <div className="tile-icon">
                <div className="example-tile-icon">
                    <i className="icon icon-location"></i>
                </div>
            </div>
            <div className="tile-content">
                <div className="tile-title text-bold">Ubicación</div>
                <div className="tile-subtitle text-gray">
                    <strong>{event.event_location.name}</strong>
                    <br />
                    {event.event_location.full_address}
                    {event.event_location.max_capacity && (
                        <span className="label label-rounded label-secondary ml-2">
                            Capacidad: {event.event_location.max_capacity}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}