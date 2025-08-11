import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { API_PAGE_LIMIT } from "../../config/api-config.js";
import * as eventService from "../../services/event-service.js";
import EventList from "../../components/EventList";
import EventListSkeleton from "../../components/EventListSkeleton";
import SearchBar from "../../components/SearchBar";
import GoUpButton from "../../components/UI/GoUpButton";
import Loading from "../../components/UI/Loading";
import EmptyEventList from "../../components/UI/EmptyEventList/index.jsx";

export default function EventsPage() {
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState({});
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [nextPage, setNextPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMoreEvents, setHasMoreEvents] = useState(true);

    const fetchNewEvents = async (filters, reload = false) => {
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

    const getActiveFiltersCount = () => {
        return Object.values(filters).filter(filter => filter !== null).length;
    };

    const clearAllFilters = () => {
        const url = new URL(window.location);
        url.search = '';
        window.history.pushState({}, '', url);
        window.location.reload();
    };

    useEffect(() => {
        const filters = getFilters();
        setError(null);
        setHasMoreEvents(true);
        fetchNewEvents(filters, true);
    }, [searchParams]);

    /*useEffect(() => {
        if (events.length > 0) {
            setStats(calculateStats(events));
        }
    }, [events]);*/

    return (
        <main className="container">
            {/* Error Toast */}
            {error && (
                <div className="toast toast-error">
                    <button className="btn btn-clear float-right" onClick={() => setError(null)}></button>
                    <i className="icon icon-stop"></i>
                    <strong>Error:</strong> {error.message}
                </div>
            )}
            
            {/* Header Section */}
            <div className="section">
                <div className="hero hero-sm">
                    <div className="hero-body">
                        <h1 className="hero-title">
                            🎉 Eventos
                            {filters.name && (
                                <span className="text-primary"> "{filters.name}"</span>
                            )}
                            {filters.startDate && (
                                <span className="text-primary"> desde {filters.startDate}</span>
                            )}
                            {filters.tag && (
                                <span className="text-primary"> #{filters.tag}</span>
                            )}
                        </h1>
                        <p className="hero-subtitle">
                            Descubre eventos increíbles y únete a la diversión
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filters Section */}
            <div className="section">
                <div className="card">
                    <div className="card-header">
                        <div className="columns">
                            <div className="column col-8 col-md-12">
                                <h4 className="card-title">
                                    <i className="icon icon-search"></i>
                                    Buscar y Filtrar
                                </h4>
                            </div>
                            <div className="column col-4 col-md-12 text-right">
                                {getActiveFiltersCount() > 0 && (
                                    <button 
                                        className="btn btn-sm btn-outline" 
                                        onClick={clearAllFilters}
                                    >
                                        <i className="icon icon-delete"></i>
                                        Limpiar filtros ({getActiveFiltersCount()})
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <SearchBar />
                    </div>
                </div>
            </div>
            
            {/* Events List Section */}
            <div className="section">
                {loading && events.length <= 0 || <EventList events={events} />}
                {loading && <EventListSkeleton />}

                {!loading && hasMoreEvents && (
                    <div className="text-center">
                        <button 
                            className="btn btn-primary btn-lg" 
                            onClick={() => fetchNewEvents(filters, false)}
                        >
                            <i className="icon icon-download"></i>
                            Cargar más eventos
                        </button>
                    </div>
                )}

                {!loading && !hasMoreEvents && events.length > 0 && (
                    <div className="card bg-gray">
                        <div className="card-body text-center">
                            <i className="icon icon-check text-success" style={{fontSize: '2rem'}}></i>
                            <h4>¡Has visto todos los eventos!</h4>
                            <p className="text-gray">No hay más eventos para mostrar.</p>
                        </div>
                    </div>
                )}
            </div>
            
            <GoUpButton />
        </main>
    );
}
