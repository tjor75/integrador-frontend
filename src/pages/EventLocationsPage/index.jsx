import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { globalContext } from "../../context/GlobalContext";
import * as eventLocationService from "../../services/event-location-service.js";
import CreateEventLocationModal from "../../components/EventLocations/CreateEventLocationModal";
import EditEventLocationModal from "../../components/EventLocations/EditEventLocationModal";
import ViewEventLocationModal from "../../components/EventLocations/ViewEventLocationModal";

export default function EventLocationsPage() {
    const { jwtToken, currentUser } = useContext(globalContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [viewTarget, setViewTarget] = useState(null);

    const fetchItems = async () => {
        if (!jwtToken) return;
        try {
            setLoading(true);
            const all = await eventLocationService.getAllAsync(jwtToken);
            setItems(all);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jwtToken]);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar esta ubicación?")) return;
        try {
            await eventLocationService.deleteAsync(id, jwtToken);
            setItems((prev) => prev.filter((x) => x.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return (
        <main className="container">
            <div className="columns">
                <div className="column col-10 col-md-12 col-mx-auto">
                    <div className="d-flex justify-content-between align-center mb-2">
                        <h1>Mis ubicaciones de evento</h1>
                        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                            <i className="icon icon-plus mr-1"></i>
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
                            <div className="card-body">Cargando...</div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="card">
                            <div className="card-body">
                                <div className="empty">
                                    <div className="empty-icon"><i className="icon icon-location"></i></div>
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
                            <div className="card-header">
                                <div className="card-title">Listado</div>
                            </div>
                            <div className="card-body">
                                {items.map((it) => (
                                    <div key={it.id} className="tile tile-centered mb-2">
                                        <div className="tile-icon"><i className="icon icon-location"></i></div>
                                        <div className="tile-content">
                                            <div className="tile-title text-bold">{it.name}</div>
                                            <div className="tile-subtitle text-gray">{it.full_address}</div>
                                        </div>
                                        <div className="tile-action">
                                            <div className="btn-group">
                                                <button className="btn btn-sm" onClick={() => setViewTarget(it)}>Ver</button>
                                                <button className="btn btn-sm" onClick={() => setEditTarget(it)}>Editar</button>
                                                <button className="btn btn-sm btn-error" onClick={() => handleDelete(it.id)}>Eliminar</button>
                                            </div>
                                        </div>
                                    </div>
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

            <EditEventLocationModal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                id={editTarget?.id}
                initialData={editTarget}
                onUpdated={() => fetchItems()}
            />

            <ViewEventLocationModal
                isOpen={!!viewTarget}
                onClose={() => setViewTarget(null)}
                data={viewTarget}
            />
        </main>
    );
}


