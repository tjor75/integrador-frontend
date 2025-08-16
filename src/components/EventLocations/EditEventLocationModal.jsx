import { useContext, useEffect, useState } from "react";
import Modal from "../UI/Modal";
import Form from "../Form";
import TextInput from "../UI/TextInput";
import NumberInput from "../UI/NumberInput";
import MapPicker from "../UI/MapPicker";
import LocationSelector from "../UI/LocationSelector";
import { GlobalContext } from "../../context/GlobalContext";
import * as eventLocationService from "../../services/event-location-service.js";

export default function EditEventLocationModal({ isOpen, onClose, id, initialData, onUpdated }) {
    const { jwtToken } = useContext(GlobalContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validInputs, setValidInputs] = useState({
        name: null,
        full_address: null,
        max_capacity: null,
        id_location: null
    });

    const [values, setValues] = useState({ 
        name: "", 
        full_address: "", 
        max_capacity: 50, 
        latitude: null, 
        longitude: null,
        id_location: null,
        location_name: "",
        province_name: ""
    });

    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        if (initialData) {
            setValues({
                name: initialData.name ?? "",
                full_address: initialData.full_address ?? "",
                max_capacity: initialData.max_capacity ?? 50,
                latitude: initialData.latitude ?? null,
                longitude: initialData.longitude ?? null,
                id_location: initialData.id_location ?? null,
                location_name: initialData.location_name ?? "",
                province_name: initialData.province_name ?? ""
            });
            
            // Set selected location if available
            if (initialData.id_location && initialData.location_name && initialData.province_name) {
                setSelectedLocation({
                    id: initialData.id_location,
                    location_name: initialData.location_name,
                    province_name: initialData.province_name
                });
            }
        }
    }, [initialData]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        /* const allValid = Object.values(validInputs).every((v) => v === true);
        if (!allValid) {
            setError("Por favor, completa todos los campos correctamente.");
            return;
        } */

        if (!selectedLocation?.id) {
            setError("Por favor, selecciona una localidad y provincia.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const formData = new FormData(event.target);
            const update = {
                name: formData.get("name").trim(),
                full_address: formData.get("full_address").trim(),
                max_capacity: parseInt(formData.get("max_capacity"), 10),
                id_location: selectedLocation.id,
                latitude: marker?.lat ?? values.latitude ?? null,
                longitude: marker?.lng ?? values.longitude ?? null
            };
            await eventLocationService.updateAsync(id, update, jwtToken);
            onUpdated?.(update);
            onClose?.();
        } catch (err) {
            if (validateSession(err)) {
                console.error("Error updating event location:", err);
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const [marker, setMarker] = useState(values.latitude && values.longitude ? { lat: values.latitude, lng: values.longitude } : null);

    return (
        <Modal isOpen={isOpen} title="Editar ubicación de evento" onClose={onClose}
            footer={(
                <div className="btn-group btn-group-block">
                    <button type="submit" form="edit-eventlocation-form" className={loading ? "btn btn-primary loading" : "btn btn-primary"} disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button className="btn" onClick={onClose} disabled={loading}>Cancelar</button>
                </div>
            )}
        >
            <Form id="edit-eventlocation-form" error={error} onSubmit={handleSubmit} setValidInputs={setValidInputs}>
                <TextInput name="name" title="Nombre" required validInputs={validInputs} setValidInputs={setValidInputs} defaultValue={values.name} />
                <TextInput name="full_address" title="Dirección" required validInputs={validInputs} setValidInputs={setValidInputs} defaultValue={values.full_address} />
                <NumberInput name="max_capacity" title="Capacidad máxima" required min={1} validInputs={validInputs} setValidInputs={setValidInputs} defaultValue={values.max_capacity} />
                <LocationSelector
                    value={selectedLocation}
                    onError={setError}
                    onChange={(loc) => {
                        setSelectedLocation(loc);
                    }}
                    helperText="Filtrá por nombre de localidad o provincia"
                    validInputs={validInputs}
                    setValidInputs={setValidInputs}
                    required
                />
                {selectedLocation && (
                    <div className="form-group">
                        <label className="form-label">Coordenadas</label>
                        <MapPicker value={marker} onChange={setMarker} />
                    </div>
                )}
            </Form>
        </Modal>
    );
}


