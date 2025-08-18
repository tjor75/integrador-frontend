import { useContext, useState, useEffect } from "react";
import Modal from "../UI/Modal";
import Form from "../Form";
import TextInput from "../UI/TextInput";
import NumberInput from "../UI/NumberInput";
import MapPicker from "../UI/MapPicker";
import LocationSelector from "../UI/LocationSelector";
import { GlobalContext } from "../../context/GlobalContext";
import * as eventLocationService from "../../services/event-location-service.js";
import useAuth from "../../hooks/useAuth.js"; // agregar para validateSession

export default function CreateEventLocationModal({ isOpen, onClose, onCreated }) {
    const { jwtToken } = useContext(GlobalContext);
    const { validateSession } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validInputs, setValidInputs] = useState({
        name: null,
        full_address: null,
        max_capacity: null,
        latlng: true,
        id_location: null
    });
    const [latlng, setLatlng] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const reset = () => {
        setError(null);
        setSelectedLocation(null);
        setLatlng(null);
        setValidInputs({
            name: null,
            full_address: null,
            max_capacity: null,
            latlng: true,
            id_location: null
        });
    };

    // limpiar al abrir/cerrar
    useEffect(() => {
        if (!isOpen) return; // al abrir
        reset();
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!Object.values(validInputs).every(v => v === true)) {
            setError("Completá todos los campos.");
            return;
        }
        const fd = new FormData(e.target);
        const id_location = Number(fd.get("id_location") || 0);
        if (!id_location) {
            setError("Seleccioná una localidad y provincia");
            return;
        }
        const payload = {
            name: (fd.get("name") || "").trim(),
            full_address: (fd.get("full_address") || "").trim(),
            id_location,
            max_capacity: Number(fd.get("max_capacity") || 0),
            latitude: latlng?.lat ?? null,
            longitude: latlng?.lng ?? null
        };

        setLoading(true);
        setError(null);
        try {
            const created = await eventLocationService.createAsync(payload, jwtToken);
            onCreated?.(created || payload); // si API no devuelve objeto, pasar payload
            reset();
            onClose?.();
        } catch (err) {
            if (validateSession(err)) {
                console.error("Error creating event location:", err);
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            title="Crear ubicación de evento"
            onClose={() => { if (!loading) { reset(); onClose?.(); } }}
            footer={
                <div className="btn-group btn-group-block">
                    <button
                        type="submit"
                        form="create-eventlocation-form"
                        className={loading ? "btn btn-primary loading" : "btn btn-primary"}
                        disabled={loading}
                    >
                        Crear
                    </button>
                    <button className={loading ? "btn disabled" : "btn"} onClick={() => { if (!loading) { reset(); onClose?.(); } }} disabled={loading}>Cancelar</button>
                </div>
            }
        >
            <Form
                id="create-eventlocation-form"
                error={error}
                onSubmit={handleSubmit}
                setValidInputs={setValidInputs}
            >
                <TextInput
                    name="name"
                    title="Nombre"
                    placeholder="Ej: Auditorio Central"
                    validInputs={validInputs}
                    setValidInputs={setValidInputs}
                    required
                />
                <TextInput
                    name="full_address"
                    title="Dirección"
                    placeholder="Calle 123, Ciudad"
                    validInputs={validInputs}
                    setValidInputs={setValidInputs}
                    required
                />
                <NumberInput
                    name="max_capacity"
                    title="Capacidad máxima"
                    placeholder="50"
                    min={1}
                    validInputs={validInputs}
                    setValidInputs={setValidInputs}
                    required
                />
                <LocationSelector
                    name="id_location"
                    title="Localidad / Provincia"
                    value={selectedLocation}
                    onError={setError}
                    onChange={(loc) => {
                        setSelectedLocation(loc);
                        if (loc) {
                            setLatlng({
                                lat: Number(loc.latitude),
                                lng: Number(loc.longitude)
                            });
                        } else {
                            setLatlng(null);
                        }
                    }}
                    helperText="Filtrá por nombre de localidad o provincia"
                    validInputs={validInputs}
                    setValidInputs={setValidInputs}
                    required
                />
                {selectedLocation && latlng && (
                    <div className="form-group">
                        <label className="form-label">Coordenadas</label>
                        <MapPicker value={latlng} onChange={setLatlng} />
                    </div>
                )}
            </Form>
        </Modal>
    );
}