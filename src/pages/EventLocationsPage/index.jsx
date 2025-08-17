import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth.js";
import * as eventLocationService from "../../services/event-location-service.js";
import CreateEventLocationModal from "../../components/EventLocations/CreateEventLocationModal";
import ViewEventLocationModal from "../../components/EventLocations/ViewEventLocationModal";
import Loading from "../../components/UI/Loading";
import RedirectLogin from "../../components/RedirectLogin";
import EventLocationCard from "../../components/UI/EventLocationCard/index.jsx";

export default function EventLocationsPage() {
    const { jwtToken, currentUser, validateSession } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [viewTarget, setViewTarget] = useState(null);

    const fetchItems = async () => {
        if (!jwtToken) return;

        try {
            setLoading(true);
            const all = await eventLocationService.getAllAsync(jwtToken);
            setItems(all);
        } catch (err) {
            if (validateSession(err)) {
                console.error("Error fetching event locations:", err);
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [jwtToken]);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar esta ubicación?")) return;
        try {
            await eventLocationService.deleteAsync(id, jwtToken);
            setItems((prev) => prev.filter((x) => x.id !== id));
        } catch (err) {
            if (validateSession(err)) {
                console.error("Error deleting event location:", err);
                setError(err.message);
            }
        }
    };

    if (!currentUser) {
        return <RedirectLogin />;
    }

    return (
        <main className="container">
            <div className="columns">
                <div className="column col-10 col-md-12 col-mx-auto">
                    <div className="d-flex justify-content-between align-center mb-2">
                        <h1>Mis ubicaciones de evento</h1>
                        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                            <i className="icon icon-plus mr-1" />
                            Nueva ubicación
                        </button>
                    </div>

                    {error && (
                        <div className="toast toast-error mb-2">
                            <b>Error:</b> {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="card">
                            <div className="card-body"><Loading /></div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="card">
                            <div className="card-body">
                                <div className="empty">
                                    <div className="empty-icon"><i className="icon icon-location" /></div>
                                    <p className="empty-title h5">No tienes ubicaciones creadas</p>
                                    <p className="empty-subtitle">Crea tu primera ubicación para organizar tus eventos</p>
                                    <div className="empty-action">
                                        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Crear ubicación</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-body">
                                {items.map((it) => (
                                    <EventLocationCard
                                        key={it.id}
                                        it={it}
                                        setViewTarget={setViewTarget}
                                        handleDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CreateEventLocationModal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                onCreated={(created) => {
                    // backend puede devolver solo id; si es así, refrescamos
                    if (created && created.id) {
                        setItems((prev) => [...prev, created]);
                    } else {
                        fetchItems();
                    }
                }}
            />

            <ViewEventLocationModal
                isOpen={!!viewTarget}
                onClose={() => setViewTarget(null)}
                data={viewTarget}
            />
        </main>
    );
}


