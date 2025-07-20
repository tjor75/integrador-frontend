import { useEffect, useState } from "react";
import EventListSkeleton from "../../components/EventListSkeleton";
import EventList from "../../components/EventList";
import * as eventService from "../../services/event-service";
import GoUpButton from "../../components/UI/GoUpButton";

export default function HomePage() {
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventsPage, setEventsPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMoreEvents, setHasMoreEvents] = useState(true);

    const fetchNewEvents = async () => {
        try {
            setLoading(true);
            const newEvents = await eventService.getAllAsync(eventsPage);
            if (newEvents.length !== 0) {
                setEvents(events => [...events, ...newEvents]);
                setEventsPage(prevPage => prevPage + 1);
            } else {
                setHasMoreEvents(false);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => fetchNewEvents, []);

    return (
        <main className="container">
            {error && <p>{error}</p>}
            {(!loading || events.length > 0) && <EventList events={events} />}
            {loading ? (
                <EventListSkeleton />
            ) : (
                hasMoreEvents && <button className="btn btn-primary col-12" onClick={fetchNewEvents}>Fetch more!</button>
            )}
            <GoUpButton />
        </main>
    );
}