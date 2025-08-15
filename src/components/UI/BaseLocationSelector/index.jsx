import { useEffect, useMemo, useRef, useState } from "react";
import { getLocationsAsync } from "../../../services/event-location-service.js";

export default function LocationSelector({
    name = "id_location",
    title = "Localidad / Provincia",
    placeholder = "Escribe para filtrar y seleccionar",
    value,
    onChange,
    required = false,
    disabled = false,
    helperText
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allLocations, setAllLocations] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const listRef = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const list = await getLocationsAsync();
                setAllLocations(list);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const selectedLabel = useMemo(() => {
        const found = allLocations.find((x) => String(x.id) === String(value ?? ""));
        return found ? `${found.location_name} · ${found.province_name}` : "";
    }, [allLocations, value]);

    // Mantener inputText sincronizado con selección actual
    useEffect(() => {
        if (value && selectedLabel && inputText !== selectedLabel) {
            setInputText(selectedLabel);
        }
        if (!value && inputText && !isFocused) {
            // si no hay valor seleccionado y se perdió el foco, limpiamos
            setInputText("")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, selectedLabel]);

    const normalizeText = (text) =>
        text
            ?.toString()
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    const filtered = useMemo(() => {
        const q = normalizeText(inputText);
        const selected = normalizeText(selectedLabel);
        if (!q || (value && q === selected)) return [];
        return allLocations.filter((row) => {
            const ln = normalizeText(row.location_name);
            const pn = normalizeText(row.province_name);
            return ln.includes(q) || pn.includes(q);
        }).slice(0, 50);
    }, [inputText, allLocations, selectedLabel, value]);

    const grouped = useMemo(() => {
        const map = new Map();
        for (const row of filtered) {
            const province = row.province_name;
            if (!map.has(province)) map.set(province, []);
            map.get(province).push(row);
        }
        return Array.from(map.entries()).map(([province, items]) => ({ province, items }));
    }, [filtered]);

    const handleInputChange = (text) => {
        setInputText(text);
        if (value) {
            // Si el usuario empieza a editar, limpiar selección
            onChange?.("");
        }
    };

    const handleSelectItem = (item) => {
        onChange?.(String(item.id));
        setInputText(`${item.location_name} · ${item.province_name}`);
        setIsFocused(false);
    };

    return (
        <div className="form-group">
            <label className="form-label">
                {title} {required && <span className="text-error">*</span>}
            </label>

            {/* Campo visible que sirve como filtro y muestra la selección */}
            <input
                type="text"
                className="form-input"
                placeholder={placeholder}
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                    // cerrar lista al perder foco si el blur no va hacia la lista
                    if (!listRef.current || !listRef.current.contains(e.relatedTarget)) {
                        setIsFocused(false);
                    }
                }}
                disabled={disabled}
                autoComplete="off"
            />

            {/* Campo oculto que envía el id seleccionado en el form */}
            <input type="hidden" name={name} value={value ?? ""} />
            {helperText && <p className="form-input-hint">{helperText}</p>}
            {error && (
                <div className="toast toast-error mt-1">
                    <b>Error:</b> {error}
                </div>
            )}

            {/* Lista de sugerencias */}
            {isFocused && filtered.length > 0 && (
                <div
                    className="card mt-1"
                    tabIndex={-1}
                    ref={listRef}
                    onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) setIsFocused(false);
                    }}
                >
                    <div className="card-body" style={{ maxHeight: 260, overflowY: "auto" }}>
                        {grouped.map((group) => (
                            <div key={group.province} className="mb-1">
                                <div className="text-bold text-small mb-1">{group.province}</div>
                                {group.items.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="btn btn-link btn-sm"
                                        onClick={() => handleSelectItem(item)}
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


