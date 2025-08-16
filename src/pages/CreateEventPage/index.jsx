import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as eventService from "../../services/event-service.js";
import * as eventLocationService from "../../services/event-location-service.js";
import useAuth from "../../hooks/useAuth.js";
import Form from "../../components/Form";
import TextInput from "../../components/UI/TextInput";
import TextAreaInput from "../../components/UI/TextAreaInput";
import NumberInput from "../../components/UI/NumberInput";
import DateInput from "../../components/UI/DateInput";
// import EventLocationInput from "../../components/UI/EventLocationInput"; // replaced by modal-based solution
import RedirectLogin from "../../components/RedirectLogin/index.jsx";
import CreateEventLocationModal from "../../components/EventLocations/CreateEventLocationModal.jsx";

export default function CreateEventPage() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validInputs, setValidInputs] = useState({
        name: null,
        description: null,
        startDate: null,
        duration: null,
        eventLocation: null,
        maxAttendees: null
    });
    const { jwtToken, currentUser, validateSession } = useAuth();

    // Event locations state (modal-based approach)
    const [eventLocations, setEventLocations] = useState([]);
    const [eventLocationsLoading, setEventLocationsLoading] = useState(false);
    const [selectedEventLocationId, setSelectedEventLocationId] = useState("");
    const [showCreateLocationModal, setShowCreateLocationModal] = useState(false);
    const NEW_OPTION_VALUE = "__new__";

    const fetchEventLocations = async () => {
        if (!jwtToken) return;
        try {
            setEventLocationsLoading(true);
            const data = await eventLocationService.getAllAsync(jwtToken);
            setEventLocations(data || []);
        } catch (err) {
            console.error("Error fetching event locations", err);
        } finally {
            setEventLocationsLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) fetchEventLocations();
    }, [currentUser, jwtToken]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Verificar que todos los campos requeridos estén válidos
        /* const allValid = Object.values(validInputs).every(valid => valid === true);
        if (!allValid) {
            setError("Por favor, completa todos los campos correctamente.");
            return;
        } */

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData(event.target);
            const eventData = {
                name: formData.get("name"),
                description: formData.get("description"),
                start_date: formData.get("startDate"),
                duration_minutes: parseInt(formData.get("duration")),
                id_event_location: parseInt(formData.get("eventLocation")),
                max_attendees: parseInt(formData.get("maxAttendees")) || null,
                tags: formData.get("tags") ? formData.get("tags").split(",").map(tag => tag.trim()) : []
            };

            const createdEvent = await eventService.createAsync(jwtToken, eventData);
            navigate(`/event/${createdEvent.id}`);
        } catch (error) {
            if (validateSession(error)) {
                console.error("Error creating event:", error);
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateEventLocationValidity = (value) => {
        setValidInputs(prev => ({ ...prev, eventLocation: !!value }));
    };

    return (
        currentUser ? (
            <main className="container">
                <div className="columns">
                    <div className="column col-8 col-md-12 col-mx-auto">
                        <Form 
                            title="Crear Nuevo Evento" 
                            error={error} 
                            onSubmit={handleSubmit}
                            setValidInputs={setValidInputs}
                        >
                            <TextInput
                                name="name"
                                title="Nombre del evento"
                                placeholder="Ej: Festival de Rock"
                                validInputs={validInputs}
                                setValidInputs={setValidInputs}
                                required
                            />

                            <TextAreaInput
                                name="description"
                                title="Descripción"
                                placeholder="Describe tu evento. ¿Qué harás? ¿Por qué deberían asistir?"
                                validInputs={validInputs}
                                setValidInputs={setValidInputs}
                                required
                            />

                            <div className="columns">
                                <div className="column col-6 col-md-12">
                                    <DateInput
                                        name="startDate"
                                        title="Fecha"
                                        validInputs={validInputs}
                                        setValidInputs={setValidInputs}
                                        required
                                    />
                                </div>
                                <div className="column col-6 col-md-12">
                                    <NumberInput
                                        name="duration"
                                        title="Duración (minutos)"
                                        placeholder="120"
                                        min={1}
                                        validInputs={validInputs}
                                        setValidInputs={setValidInputs}
                                    />
                                </div>
                            </div>

                            {/* Selector con opción "+" */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="eventLocation">Ubicación del evento <span className="text-error">*</span></label>
                                <select
                                    id="eventLocation"
                                    name="eventLocation"
                                    className="form-select"
                                    required
                                    disabled={eventLocationsLoading}
                                    value={selectedEventLocationId}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === NEW_OPTION_VALUE) {
                                            // Abrir modal y volver a dejar seleccionado valor previo (vacío si no había)
                                            setShowCreateLocationModal(true);
                                            // Reset a vacío para no marcar válido todavía
                                            setSelectedEventLocationId("");
                                            updateEventLocationValidity("");
                                            return;
                                        }
                                        setSelectedEventLocationId(val);
                                        updateEventLocationValidity(val);
                                    }}
                                >
                                    <option value="">{eventLocationsLoading ? "Cargando ubicaciones..." : "Seleccioná una ubicación"}</option>
                                    {eventLocations.map(loc => (
                                        <option key={loc.id} value={loc.id}>
                                            {loc.name} - {loc.full_address}
                                        </option>
                                    ))}
                                    <option value={NEW_OPTION_VALUE}>➕ Crear nueva ubicación...</option>
                                </select>
                                {validInputs.eventLocation === false && (
                                    <div className="form-input-hint text-error">Seleccioná una ubicación</div>
                                )}
                            </div>

                            <div className="columns">
                                <div className="column col-6 col-md-12">
                                    <NumberInput
                                        name="maxAttendees"
                                        title="Máximo de asistentes"
                                        placeholder="50"
                                        min={1}
                                        max={1000}
                                        validInputs={validInputs}
                                        setValidInputs={setValidInputs}
                                    />
                                </div>
                                <div className="column col-6 col-md-12">
                                    <TextInput
                                        name="tags"
                                        title="Etiquetas (separadas por comas)"
                                        placeholder="música, rock, festival, al aire libre"
                                        validInputs={validInputs}
                                        setValidInputs={setValidInputs}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg col-12"
                                    disabled={loading}
                                >
                                    {loading ? "Creando evento..." : "Crear Evento"}
                                </button>
                            </div>

                            <div className="text-center">
                                <small className="text-gray">
                                    * Campos obligatorios
                                </small>
                            </div>
                        </Form>
                    </div>
                </div>
                <CreateEventLocationModal
                    isOpen={showCreateLocationModal}
                    onClose={() => setShowCreateLocationModal(false)}
                    onCreated={(created) => {
                        // Refrescar lista y si hay creado seleccionarlo
                        fetchEventLocations().then(() => {
                            if (created?.id) {
                                setSelectedEventLocationId(String(created.id));
                                updateEventLocationValidity(created.id);
                            }
                            setShowCreateLocationModal(false);
                        });
                    }}
                />
            </main>
        ) : (
            <RedirectLogin />
        )
    );
}