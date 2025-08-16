import { useEffect, useRef, useState } from "react";
import { getLocationsAsync } from "../../../services/event-location-service.js";

export default function LocationSelector({
    name = "id_location",
    title = "Localidad / Provincia",
    placeholder = "Escribe para filtrar y seleccionar",
    validInputs,
    setValidInputs,
    value,
    onError,
    onChange,
    required = false,
    disabled = false,
    helperText
}) {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const listRef = useRef(null);

    // Cargar localidades
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const list = await getLocationsAsync();
                setLocations(list);
            } catch (e) {
                onError?.(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Sincronizar texto cuando cambie selección externa
    useEffect(() => {
        if (value?.id) {
            const label = `${value.location_name} · ${value.province_name}`;
            if (text !== label) setText(label);
        } else if (!value?.id && !open && text) {
            setText("");
        }
    }, [value?.id, value?.location_name, value?.province_name, open, text]);

    const norm = (s) =>
        (s || "")
            .toString()
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const q = norm(text);
    const selectedLabel = value ? `${value.location_name} · ${value.province_name}` : "";

    // Si está escribiendo exactamente el label seleccionado, no mostrar lista
    let filtered = [];
    if (q && norm(selectedLabel) !== q) {
        filtered = locations
            .filter(l => {
                const ln = norm(l.location_name);
                const pn = norm(l.province_name);
                return ln.includes(q) || pn.includes(q);
            })
            .slice(0, 50);
    }

    // Agrupar por provincia (simple)
    const grouped = [];
    const groupMap = {};
    for (const row of filtered) {
        if (!groupMap[row.province_name]) {
            groupMap[row.province_name] = [];
            grouped.push({ province: row.province_name, items: groupMap[row.province_name] });
        }
        groupMap[row.province_name].push(row);
    }

    const handleChange = (v) => {
        setText(v);
        if (value) {
            onChange?.(null); // si edita, limpia selección
            setValidInputs(prev => ({ ...prev, [name]: false }));
        }
    };

    const handleSelect = (item) => {
        onChange?.(item);
        setText(`${item.location_name} · ${item.province_name}`);
        setOpen(false);
    };

    return (
        <div className="form-group">
            <label className="form-label">
                {title} {required && <span className="text-error">*</span>}
            </label>
            <input
                type="text"
                className="form-input"
                placeholder={loading ? "Cargando..." : placeholder}
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setOpen(true)}
                onBlur={(e) => {
                    if (!listRef.current || !listRef.current.contains(e.relatedTarget)) {
                        setOpen(false);
                    }
                }}
                disabled={disabled || loading}
                autoComplete="off"
            />
            <input type="hidden" name={name} value={value?.id ?? ""} />
            {helperText && <p className="form-input-hint">{helperText}</p>}
            {validInputs[name] === false && (
                <p className="form-input-hint text-error">No se ha seleccionado una localizaci&oacute;n v&aacute;lida</p>
            )}
            {open && filtered.length > 0 && (
                <div
                    className="card mt-1"
                    tabIndex={-1}
                    ref={listRef}
                    onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
                    }}
                >
                    <div className="card-body" style={{ maxHeight: 260, overflowY: "auto" }}>
                        {grouped.map(g => (
                            <div key={g.province} className="mb-1">
                                <div className="text-bold text-small mb-1">{g.province}</div>
                                {g.items.map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="btn btn-link btn-sm"
                                        onClick={() => handleSelect(item)}
                                    >
                                        {item.location_name}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}