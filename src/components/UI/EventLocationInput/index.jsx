import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import * as eventLocationService from "../../../services/event-location-service.js";

export default function EventLocationInput({ 
    name, 
    title, 
    validInputs, 
    setValidInputs, 
    defaultValue = "",
    placeholder = "Selecciona una ubicación de evento o crea una nueva",
    required = false
}) {
    const { jwtToken, validateSession } = useAuth();
    const [selectedEventLocation, setSelectedEventLocation] = useState(defaultValue);
    const [showNewEventLocationInput, setShowNewEventLocationInput] = useState(false);
    const [newEventLocation, setNewEventLocation] = useState({
        name: "",
        full_address: "",
        id_location: 1, // Valor por defecto
        max_capacity: 50
    });
    const [eventLocations, setEventLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (jwtToken) {
            fetchEventLocations();
        }
    }, [jwtToken]);

    useEffect(() => {
        if (defaultValue && !eventLocations.find(loc => loc.name === defaultValue)) {
            setShowNewEventLocationInput(true);
            setNewEventLocation(prev => ({ ...prev, name: defaultValue }));
        }
    }, [defaultValue, eventLocations]);

    const fetchEventLocations = async () => {
        try {
            setLoading(true);
            const eventLocationsData = await eventLocationService.getAllAsync(jwtToken);
            setEventLocations(eventLocationsData);
        } catch (error) {
            if (validateSession(error)) {
                console.error("Error fetching event locations:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEventLocationChange = (value) => {
        if (value === "new") {
            setShowNewEventLocationInput(true);
            setSelectedEventLocation("");
            setValidInputs(prev => ({ ...prev, [name]: null }));
        } else {
            setShowNewEventLocationInput(false);
            setSelectedEventLocation(value);
            setNewEventLocation({
                name: "",
                full_address: "",
                id_location: 1,
                max_capacity: 50
            });
            setValidInputs(prev => ({ ...prev, [name]: value.trim() !== "" }));
        }
    };

    const handleNewEventLocationChange = (field, value) => {
        setNewEventLocation(prev => ({ ...prev, [field]: value }));
        
        // Validar que los campos requeridos estén completos
        const updatedLocation = { ...newEventLocation, [field]: value };
        const isValid = updatedLocation.name.trim() !== "" && 
                       updatedLocation.full_address.trim() !== "" && 
                       updatedLocation.max_capacity > 0;
        
        setValidInputs(prev => ({ ...prev, [name]: isValid }));
    };

    const handleCreateEventLocation = async () => {
        try {
            const createdEventLocation = await eventLocationService.createAsync(newEventLocation, jwtToken);
            setEventLocations(prev => [...prev, createdEventLocation]);
            setSelectedEventLocation(createdEventLocation.name);
            setShowNewEventLocationInput(false);
            setValidInputs(prev => ({ ...prev, [name]: true }));
        } catch (error) {
            if (validateSession(error))
                console.error("Error creating event location:", error);
        }
    };

    return (
        <div className="form-group">
            <label className="form-label" htmlFor={name}>
                {title} {required && <span className="text-error">*</span>}
            </label>
            
            {!showNewEventLocationInput ? (
                <select 
                    className="form-select" 
                    id={name}
                    name={name}
                    value={selectedEventLocation}
                    onChange={(e) => handleEventLocationChange(e.target.value)}
                    disabled={loading}
                >
                    <option value="">{loading ? "Cargando ubicaciones..." : placeholder}</option>
                    {eventLocations.map((eventLocation) => (
                        <option key={eventLocation.id} value={eventLocation.name}>
                            {eventLocation.name} - {eventLocation.full_address}
                        </option>
                    ))}
                    <option value="new">➕ Crear nueva ubicación de evento</option>
                </select>
            ) : (
                <div>
                    <div className="columns">
                        <div className="column col-6 col-md-12">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Nombre de la ubicación"
                                value={newEventLocation.name}
                                onChange={(e) => handleNewEventLocationChange("name", e.target.value)}
                                //required={required}
                            />
                        </div>
                        <div className="column col-6 col-md-12">
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Capacidad máxima"
                                min="1"
                                value={newEventLocation.max_capacity}
                                onChange={(e) => handleNewEventLocationChange("max_capacity", parseInt(e.target.value))}
                                //required={required}
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Dirección completa"
                        value={newEventLocation.full_address}
                        onChange={(e) => handleNewEventLocationChange("full_address", e.target.value)}
                        //required={required}
                    />
                    <div className="btn-group">
                        <button 
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={handleCreateEventLocation}
                        >
                            Crear Ubicación
                        </button>
                        <button 
                            type="button"
                            className="btn btn-link btn-sm"
                            onClick={() => {
                                setShowNewEventLocationInput(false);
                                setNewEventLocation({
                                    name: "",
                                    full_address: "",
                                    id_location: 1,
                                    max_capacity: 50
                                });
                                setSelectedEventLocation("");
                                setValidInputs(prev => ({ ...prev, [name]: null }));
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
            
            {validInputs[name] === false && (
                <div className="form-input-hint text-error">
                    Este campo es requerido
                </div>
            )}
        </div>
    );
}
