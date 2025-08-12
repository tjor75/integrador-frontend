import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icons for bundlers
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const defaultCenter = { lat: -34.6037, lng: -58.3816 }; // Buenos Aires

function ClickHandler({ onClick }) {
    useMapEvents({
        click(e) {
            onClick?.(e.latlng);
        },
    });
    return null;
}

export default function MapPicker({ value, onChange, height = 300, zoom = 13 }) {
    const [markerPosition, setMarkerPosition] = useState(value ?? defaultCenter);

    useEffect(() => {
        if (value && (value.lat !== markerPosition.lat || value.lng !== markerPosition.lng)) {
            setMarkerPosition(value);
        }
    }, [value]);

    const handleSetPosition = (pos) => {
        setMarkerPosition(pos);
        onChange?.(pos);
    };

    const mapStyle = useMemo(() => ({ height, width: "100%", borderRadius: 6, overflow: "hidden" }), [height]);

    return (
        <div>
            <div style={mapStyle}>
                <MapContainer center={markerPosition} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ClickHandler onClick={handleSetPosition} />
                    <Marker
                        position={markerPosition}
                        draggable
                        eventHandlers={{
                            dragend: (e) => {
                                const latlng = e.target.getLatLng();
                                handleSetPosition({ lat: latlng.lat, lng: latlng.lng });
                            },
                        }}
                    />
                </MapContainer>
            </div>
            <div className="text-small text-gray mt-1">
                Lat: {markerPosition.lat.toFixed(6)} | Lng: {markerPosition.lng.toFixed(6)}
            </div>
        </div>
    );
}


