import EmptyEventList from "../UI/EmptyEventList";
import EventCard from "../UI/EventCard";

export default function EventList({ events }) {
    return (
        events.length > 0 ? (
            <div className="event-list">
                <div className="columns">
                    {events.map((event, index) => (
                        <div className="column col-4 col-md-6 col-sm-12" key={"event" + index}>
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <EmptyEventList />
        )
    );
}