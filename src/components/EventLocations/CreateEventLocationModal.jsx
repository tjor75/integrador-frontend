import { useContext, useState } from "react";
import Modal from "../UI/Modal";
import Form from "../Form";
import TextInput from "../UI/TextInput";
import NumberInput from "../UI/NumberInput";
import MapPicker from "../UI/MapPicker";
import { useEffect } from "react";
import BaseLocationSelector from "../UI/BaseLocationSelector";
import { GlobalContext } from "../../context/GlobalContext";
import * as eventLocationService from "../../services/event-location-service.js";

export default function CreateEventLocationModal({ isOpen, onClose, onCreated }) {
    const { jwtToken } = useContext(GlobalContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validInputs, setValidInputs] = useState({
        name: null,
        full_address: null,
        max_capacity: null,
        latlng: true
    });
    const [latlng, setLatlng] = useState(null);
    const [selectedBaseLocationId, setSelectedBaseLocationId] = useState("");

    const groupByProvince = (list) => {
        const map = new Map();
        list.forEach((row) => {
            const province = row.province_name;
            if (!map.has(province)) map.set(province, []);
            map.get(province).push(row);
        });
        return Array.from(map.entries()).map(([province, items]) => ({ province, items }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const allValid = Object.values(validInputs).every((v) => v === true);
        if (!allValid) {
            setError("Por favor, completa todos los campos correctamente.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const formData = new FormData(event.target);
            const payload = {
                name: formData.get("name").trim(),
                full_address: formData.get("full_address").trim(),
                id_location: parseInt((new FormData(event.target).get("id_location") || "0"), 10),
                max_capacity: parseInt(formData.get("max_capacity"), 10),
                latitude: latlng?.lat ?? null,
                longitude: latlng?.lng ?? null,
            };
            if (!payload.id_location || payload.id_location <= 0) {
                setError("Seleccioná una localidad y provincia");
                setLoading(false);
                return;
            }
            const created = await eventLocationService.createAsync(payload, jwtToken);
            onCreated?.(created);
            onClose?.();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} title="Crear ubicación de evento" onClose={onClose}
            footer={(
                <div className="btn-group btn-group-block">
                    <button type="submit" form="create-eventlocation-form" className={loading ? "btn btn-primary loading" : "btn btn-primary"} disabled={loading}>
                        {loading ? "Creando..." : "Crear"}
                    </button>
                    <button className="btn" onClick={onClose} disabled={loading}>Cancelar</button>
                </div>
            )}
        >
            <Form id="create-eventlocation-form" error={error} onSubmit={handleSubmit} setValidInputs={setValidInputs}>
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title m-0">Nueva ubicación</h4>
                    </div>
                    <div className="card-body">
                        <TextInput name="name" title="Nombre" placeholder="Ej: Auditorio Central" required validInputs={validInputs} setValidInputs={setValidInputs} />
                        <TextInput name="full_address" title="Dirección" placeholder="Calle 123, Ciudad" required validInputs={validInputs} setValidInputs={setValidInputs} />
                        <NumberInput name="max_capacity" title="Capacidad máxima" placeholder="50" required min={1} validInputs={validInputs} setValidInputs={setValidInputs} />
                        <BaseLocationSelector
                            value={selectedBaseLocationId}
                            onChange={setSelectedBaseLocationId}
                            required
                            helperText="Filtrá por nombre de localidad o provincia"
                        />
                        <div className="form-group">
                            <label className="form-label">Coordenadas</label>
                            <MapPicker value={latlng} onChange={setLatlng} />
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}


