import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import Form from "../../components/Form";
import TextInput from "../../components/UI/TextInput";
import TextAreaInput from "../../components/UI/TextAreaInput";
import NumberInput from "../../components/UI/NumberInput";
import DateTimeInput from "../../components/UI/DateTimeInput";
import EventLocationInput from "../../components/UI/EventLocationInput";
import * as eventService from "../../services/event-service.js";
import Loading from "../../components/UI/Loading";
import NoEncontradoPage from "../NoEncontradoPage";

export default function EditEventPage() {
    const { currentUser } = useContext(GlobalContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [validInputs, setValidInputs] = useState({
        name: null,
        description: null,
        startDate: null,
        duration: null,
        eventLocation: null,
        maxAttendees: null
    });

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const eventData = await eventService.getByIdAsync(id);
            setEvent(eventData);
            
            // Pre-llenar los inputs válidos
            setValidInputs({
                name: true,
                description: true,
                startDate: true,
                duration: true,
                eventLocation: true,
                maxAttendees: true
            });
        } catch (error) {
            console.error("Error fetching event:", error);
            setError("Error al cargar el evento.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Verificar que todos los campos requeridos estén válidos
        const allValid = Object.values(validInputs).every(valid => valid === true);
        if (!allValid) {
            setError("Por favor, completa todos los campos correctamente.");
            return;
        }

        setSaving(true);
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

            await eventService.updateByIdAsync(id, eventData);
            navigate(`/event/${id}`);
        } catch (error) {
            console.error("Error updating event:", error);
            setError("Error al actualizar el evento. Por favor, intenta de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    if (loading) {
        return <Loading />;
    }

    if (!event) {
        return <NoEncontradoPage />;
    }

    return (
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
                            title="Nombre del evento *"
                            placeholder="Ej: Festival de Rock 2024"
                            defaultValue={event.name}
                            validInputs={validInputs}
                            setValidInputs={setValidInputs}
                            required
                        />

                        <TextAreaInput
                            name="description"
                            title="Descripción *"
                            placeholder="Describe tu evento. ¿Qué harás? ¿Por qué deberían asistir?"
                            defaultValue={event.description}
                            validInputs={validInputs}
                            setValidInputs={setValidInputs}
                            required
                        />

                        <div className="columns">
                            <div className="column col-6 col-md-12">
                                <DateTimeInput
                                    name="startDate"
                                    title="Fecha y hora de inicio *"
                                    defaultValue={formatDateForInput(event.start_date)}
                                    validInputs={validInputs}
                                    setValidInputs={setValidInputs}
                                    required
                                />
                            </div>
                            <div className="column col-6 col-md-12">
                                <NumberInput
                                    name="duration"
                                    title="Duración (minutos) *"
                                    placeholder="120"
                                    min={15}
                                    max={1}
                                    defaultValue={event.duration_minutes}
                                    validInputs={validInputs}
                                    setValidInputs={setValidInputs}
                                    required
                                />
                            </div>
                        </div>

                        <EventLocationInput
                            name="eventLocation"
                            title="Ubicación del evento *"
                            defaultValue={event.event_location ? event.event_location.name : ""}
                            validInputs={validInputs}
                            setValidInputs={setValidInputs}
                            required
                        />

                        <div className="columns">
                            <div className="column col-6 col-md-12">
                                <NumberInput
                                    name="maxAttendees"
                                    title="Máximo de asistentes"
                                    placeholder="50"
                                    min={1}
                                    max={1000}
                                    defaultValue={event.max_attendees || ""}
                                    validInputs={validInputs}
                                    setValidInputs={setValidInputs}
                                />
                            </div>
                            <div className="column col-6 col-md-12">
                                <TextInput
                                    name="tags"
                                    title="Etiquetas (separadas por comas)"
                                    placeholder="música, rock, festival, al aire libre"
                                    defaultValue={event.tags ? event.tags.map(tag => tag.name).join(", ") : ""}
                                    validInputs={validInputs}
                                    setValidInputs={setValidInputs}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="columns">
                                <div className="column col-6 col-md-12">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline btn-lg col-12"
                                        onClick={() => navigate(`/event/${id}`)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                                <div className="column col-6 col-md-12">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg col-12"
                                        disabled={saving}
                                    >
                                        {saving ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <small className="text-gray">
                                * Campos obligatorios
                            </small>
                        </div>
                    </Form>
                </div>
            </div>
        </main>
    );
}