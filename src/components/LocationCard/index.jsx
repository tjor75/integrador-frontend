import Map from "../UI/Map";

export default function LocationCard({ event }) {
    return (
        <div className="card date-place-card">
            <div className="card-header">
                <div className="card-title h5">
                    <i className="icon icon-location mr-2"></i>
                    {event.event_location.name}
                </div>
            </div>
            <div className="card-body">
                <a href={`https://www.openstreetmap.org/search?lat=${event.event_location.latitude}&lon=${event.event_location.longitude}&zoom=18`}>
                    {event.event_location.full_address}
                </a>
            </div>
            <div className="card-image">
                <Map
                    position={[event.event_location.latitude, event.event_location.longitude]}
                    name={event.event_location.name}
                    zoom={18}
                    popup={<b>{event.event_location.name}</b>}
                />
            </div>
        </div>
    );
}