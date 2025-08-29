import MapViewer from "../UI/MapViewer";

export default function LocationCard({ event }) {
    const latitude  = event.event_location.latitude ??
                      event.event_location.location.latitude ??
                      event.event_location.location.province.latitude;
    const longitude = event.event_location.longitude ??
                      event.event_location.location.longitude ??
                      event.event_location.location.province.longitude;

    return (
        <div className="card date-place-card">
            <div className="card-header">
                <div className="card-title h5">
                    <i className="icon icon-location mr-2"></i>
                    {event.event_location.name}
                </div>
            </div>
            <div className="card-body">
                <a href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(event.event_location.full_address)}`}>
                    {event.event_location.full_address}
                </a>
            </div>
            {latitude && longitude && (
                <div className="card-image">
                    <MapViewer
                        position={[latitude, longitude]}
                        name={event.event_location.name}
                        zoom={18}
                        popup={<b>{event.event_location.name}</b>}
                    />
                </div>
            )}
        </div>
    );
}