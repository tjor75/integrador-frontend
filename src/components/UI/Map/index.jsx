import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ position, zoom=14, scrollWheelZoom=true, popup, width="100%", height="400px" }) {
    return (
        <MapContainer
            center={position}
            zoom={zoom}
            scrollWheelZoom={scrollWheelZoom}
            style={{ width: width, height: height }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    {popup}
                </Popup>
            </Marker>
        </MapContainer>
    );
}