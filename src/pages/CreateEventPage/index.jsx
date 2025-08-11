import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import Form from "../../components/Form";
import TextInput from "../../components/UI/TextInput";
import TextAreaInput from "../../components/UI/TextAreaInput";
import NumberInput from "../../components/UI/NumberInput";
import DateTimeInput from "../../components/UI/DateTimeInput";
import EventLocationInput from "../../components/UI/EventLocationInput";
import * as eventService from "../../services/event-service.js";

export default function CreateEventPage() {
    const { currentUser } = useContext(GlobalContext);
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Verificar que todos los campos requeridos estén válidos
        const allValid = Object.values(validInputs).every(valid => valid === true);
        if (!allValid) {
            setError("Por favor, completa todos los campos correctamente.");
            return;
        }

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

            const createdEvent = await eventService.createAsync(eventData);
            navigate(`/event/${createdEvent.id}`);
        } catch (error) {
            console.error("Error creating event:", error);
            setError("Error al crear el evento. Por favor, intenta de nuevo.");
        } finally {
            setLoading(false);
        }
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
                                placeholder="Ej: Festival de Rock 2024"
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
                                    <DateTimeInput
                                        name="startDate"
                                        title="Fecha y hora de inicio"
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

                            <EventLocationInput
                                name="eventLocation"
                                title="Ubicación del evento"
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
            </main>
        ) : (
            <Navigate to="/login" />
        )
    );
}