import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as eventService from "../../services/event-service.js";
import * as eventLocationService from "../../services/event-location-service.js";
import useAuth from "../../hooks/useAuth.js";
import Form from "../../components/Form";
import TextInput from "../../components/UI/TextInput";
import TextAreaInput from "../../components/UI/TextAreaInput";
import NumberInput from "../../components/UI/NumberInput";
import DateInput from "../../components/UI/DateInput";
import RedirectLogin from "../../components/RedirectLogin/index.jsx";
import CreateEventLocationModal from "../../components/EventLocations/CreateEventLocationModal.jsx";

export default function EditEventPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [validInputs, setValidInputs] = useState({
        name: null,
        description: null,
        startDate: null,
        eventLocation: null,
        duration: true,       // opcional
        maxAttendees: null    // ahora requerido
    });
    const REQUIRED_FIELDS = ["name", "description", "startDate", "eventLocation", "maxAttendees"];
    const { jwtToken, currentUser, validateSession } = useAuth();

    // Event data state
    const [eventData, setEventData] = useState({
        name: "",
        description: "",
        startDate: "",
        duration: "",
        eventLocation: "",
        maxAttendees: "",
        price: "",
        tags: "",
        enabled_for_enrollment: "1"
    });

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
            if (validateSession(err)) {
                console.error("Error fetching event locations", err);
            }
        } finally {
            setEventLocationsLoading(false);
        }
    };

    const fetchEventData = async () => {
        if (!id || !jwtToken) return;
        try {
            setInitialLoading(true);
            const event = await eventService.getByIdAsync(id);
            if (!event) {
                setError("Evento no encontrado");
                return;
            }

            // Format the event data for the form
            const formattedData = {
                name: event.name || "",
                description: event.description || "",
                startDate: event.start_date ? new Date(event.start_date).toISOString().split('T')[0] : "",
                duration: event.duration_in_minutes ? event.duration_in_minutes.toString() : "",
                eventLocation: event.event_location.id ? event.event_location.id.toString() : "",
                maxAttendees: event.max_assistance ? event.max_assistance.toString() : "",
                price: event.price ? event.price.toString() : "0",
                tags: event.tags ? event.tags.map(tag => tag.name).join(", ") : "",
                enabled_for_enrollment: event.enabled_for_enrollment ? "1" : "0"
            };

            setEventData(formattedData);
            setSelectedEventLocationId(formattedData.eventLocation);

            
            // Set initial validation state
            setValidInputs({
                name: !!formattedData.name,
                description: !!formattedData.description,
                startDate: !!formattedData.startDate,
                eventLocation: !!formattedData.eventLocation,
                duration: true,
                maxAttendees: !!formattedData.maxAttendees
            });
        } catch (err) {
            console.error("Error fetching event data:", err);
            setError("Error al cargar los datos del evento");
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            const loadData = async () => {
                // 1. Cargar primero los datos del evento para saber qué ubicación está seleccionada
                await fetchEventData();
                // 2. Luego, cargar todas las ubicaciones disponibles
                await fetchEventLocations();
            };
            loadData();
        }
    }, [currentUser, jwtToken, id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Calcular actualización de validez antes de setState
        const updated = { ...validInputs };
        for (const key of REQUIRED_FIELDS) {
            if (key !== "eventLocation" && updated[key] === null) updated[key] = false;
        }
        // Validar select ubicación requerida
        if (!selectedEventLocationId) updated.eventLocation = false; else updated.eventLocation = true;

        // Aplicar cambios
        setValidInputs(updated);

        const currentValid = Object.values(updated).every(v => v === true);
        if (!currentValid) {
            setError("Por favor, completá todos los campos obligatorios correctamente.");
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData(event.target);
            const updateData = {
                id,
                name: formData.get("name")?.trim(),
                description: formData.get("description")?.trim(),
                start_date: formData.get("startDate"),
                duration_in_minutes: formData.get("duration") ? parseInt(formData.get("duration")) : null,
                id_event_location: parseInt(selectedEventLocationId),
                max_assistance: formData.get("maxAttendees") ? parseInt(formData.get("maxAttendees")) : null,
                price: formData.get("price") ? parseFloat(formData.get("price")) : 0,
                tags: formData.get("tags") ? formData.get("tags").split(",").map(tag => tag.trim()).filter(Boolean) : [],
                enabled_for_enrollment: formData.get("enabled_for_enrollment") === "1" ? "1" : "0"
            };

            await eventService.updateAsync(jwtToken, updateData);
            navigate(`/event/${id}`);
        } catch (error) {
            if (validateSession(error)) {
                console.error("Error updating event:", error);
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateEventLocationValidity = (value) => {
        setValidInputs(prev => ({ ...prev, eventLocation: !!value }));
    };

    if (initialLoading) {
        return (
            <main className="container">
                <div className="columns">
                    <div className="column col-8 col-md-12 col-mx-auto">
                        <div className="text-center">
                            <div className="loading loading-lg"></div>
                            <p>Cargando evento...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        currentUser ? (
            <main className="container">
                <div className="columns">
                    <div className="column col-8 col-md-12 col-mx-auto">
                        <Form 
                            title="Editar Evento" 
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
                                defaultValue={eventData.name}
                            />

                            <TextAreaInput
                                name="description"
                                title="Descripción"
                                placeholder="Describe tu evento. ¿Qué harás? ¿Por qué deberían asistir?"
                                validInputs={validInputs}
                                setValidInputs={setValidInputs}
                                min={3}
                                defaultValue={eventData.description}
                            />

                            <div className="columns">
                                <div className="column col-6 col-md-12">
                                    <DateInput
                                        name="startDate"
                                        title="Fecha"
                                        validInputs={validInputs}
                                        setValidInputs={setValidInputs}
                                        required
                                        defaultValue={eventData.startDate}
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
                                        defaultValue={eventData.duration}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Selector con opción "+" */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="eventLocation">Ubicación del evento <span className="text-error">*</span></label>
                                <select
                                    id="eventLocation"
                                    name="eventLocation"
                                    className={"form-select" + (validInputs.eventLocation === false ? " is-error" : "")}
                                    disabled={eventLocationsLoading}
                                    value={selectedEventLocationId}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === NEW_OPTION_VALUE) {
                                            setShowCreateLocationModal(true);
                                            return; // No limpiar la selección para evitar el "salto"
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
                                        required
                                        defaultValue={eventData.maxAttendees}
                                    />
                                </div>
                                <div className="column col-6 col-md-12">
                                    <NumberInput
                                        name="price"
                                        title="Precio (pesos)"
                                        placeholder="0 (gratis)"
                                        min={0}
                                        step={0.01}
                                        validInputs={validInputs}
                                        setValidInputs={setValidInputs}
                                        defaultValue={eventData.price}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <TextInput
                                    name="tags"
                                    title="Etiquetas (separadas por comas)"
                                    placeholder="música, rock, festival, al aire libre"
                                    validInputs={validInputs}
                                    setValidInputs={setValidInputs}
                                    defaultValue={eventData.tags}
                                />
                            </div>

                            {/* Checkbox para enabled_for_enrollment */}
                            <div className="form-group">
                                <label className="form-checkbox">
                                    <input
                                        type="checkbox"
                                        name="enabled_for_enrollment"
                                        value="1"
                                        defaultChecked={eventData.enabled_for_enrollment === "1"}
                                    />
                                    <i className="form-icon"></i>
                                    Habilitar inscripciones
                                </label>
                                <div className="form-input-hint">
                                    Si está marcado, los usuarios podrán inscribirse al evento. Si no está marcado, las inscripciones estarán deshabilitadas.
                                </div>
                            </div>

                            <div className="form-group">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg col-12"
                                    disabled={loading}
                                >
                                    {loading ? "Actualizando evento..." : "Actualizar Evento"}
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
