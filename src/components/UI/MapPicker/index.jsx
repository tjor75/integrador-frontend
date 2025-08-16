import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = { lat: -34.6037, lng: -58.3816 };

function MapClicks({ onPick }) {
    useMapEvents({
        click(e) {
            onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
    });
    return null;
}

// Recentrar el mapa cuando cambie la posición externa
function RecenterOnChange({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position?.lat != null && position?.lng != null) {
            map.setView(position);
        }
    }, [position?.lat, position?.lng, map]);
    return null;
}

export default function MapPicker({ value, onChange, height = 300, zoom = 13 }) {
    //const [pos, setPos] = useState(value || DEFAULT_CENTER);
    const [pos, setPos] = useState(value);

    useEffect(() => {
        if (value && (value.lat !== pos.lat || value.lng !== pos.lng)) {
            setPos(value);
        }
        //if (!value && !pos) setPos(DEFAULT_CENTER);
    }, [value]);

    const setPosition = (p) => {
        setPos(p);
        onChange?.(p);
    };

    return (
        <div>
            <div style={{ height, width: "100%", borderRadius: 6, overflow: "hidden" }}>
                <MapContainer center={pos} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClicks onPick={setPosition} />
                    {pos && (
                        <Marker
                            position={pos}
                            draggable
                            eventHandlers={{
                                dragend: (e) => {
                                    const m = e.target.getLatLng();
                                    setPosition({ lat: m.lat, lng: m.lng });
                                }
                            }}
                        />
                    )}
                    <RecenterOnChange position={pos} />
                </MapContainer>
            </div>
            <div className="text-small text-gray mt-1">
                Lat: {pos.lat.toFixed(6)} | Lng: {pos.lng.toFixed(6)}
            </div>
        </div>
    );
}