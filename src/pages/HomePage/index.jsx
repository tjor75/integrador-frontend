import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_PAGE_LIMIT } from "../../config/api-config.js";
import * as eventService from "../../services/event-service.js";
import EventListSkeleton from "../../components/EventListSkeleton";
import EventList from "../../components/EventList";
import GoUpButton from "../../components/UI/GoUpButton";

export default function HomePage() {
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState({});
    const [error, setError]                 = useState(null);
    const [events, setEvents]               = useState([]);
    const [nextPage, setNextPage]           = useState(1);
    const [loading, setLoading]             = useState(true);
    const [hasMoreEvents, setHasMoreEvents] = useState(true);

    const fetchNewEvents = async (filters, reload=false) => {
        let newEvents;
        setLoading(true);
        try {
            if (reload) {
                newEvents = await eventService.getAllAsync(1, filters);
                setEvents(newEvents);
                setNextPage(2);
            } else {
                newEvents = await eventService.getAllAsync(nextPage, filters);
                setEvents(prevEvents => [...prevEvents, ...newEvents]);
                setNextPage(prevNextPage => prevNextPage + 1);
            }

            if (newEvents.length < API_PAGE_LIMIT)
                setHasMoreEvents(false);
        } catch (error) {
            console.error("Error fetching events:", error);
            setError(error);
            setHasMoreEvents(false);
        } finally {
            setLoading(false);
        }
    };

    const getFilters = () => {
        const newFilters = {
            name: searchParams.get("name") || null,
            startDate: searchParams.get("start_date") || null,
            tag: searchParams.get("tag") || null
        };
        setFilters(newFilters);
        return newFilters;
    };

    useEffect(() => {
        const filters = getFilters();
        setError(null);
        setHasMoreEvents(true);
        fetchNewEvents(filters, true);
    }, [searchParams]);

    return (
        <main className="container">
            {error && (
                <div className="toast toast-error text-center">
                    <b>Error:</b> {error.message}
                </div>
            )}
            
            <h1>
                Eventos
                {filters.name && ` con nombre "${filters.name}"`}
                {filters.startDate && ` desde ${filters.startDate}`}
                {filters.tag && ` con etiqueta "${filters.tag}"`}
            </h1>
            
            {loading && events.length === 0 || <EventList events={events} />}

            {loading ? (
                <EventListSkeleton />
            ) : (
                hasMoreEvents && <button className="btn btn-primary col-12" onClick={() => fetchNewEvents(filters, false)}>Fetch more!</button>
            )}
            
            <GoUpButton />
        </main>
    );
}