import { Link } from "react-router-dom";
import { formatDatePeriodFromDateDuration } from "../../helpers/date-helper";
import Map from "../UI/Map";

export default function LocationCard({ event }) {
    return (
        <div className="card date-place-card">
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
        </div>
    );
}