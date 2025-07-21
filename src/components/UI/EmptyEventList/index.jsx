import { Link } from "react-router-dom";

export default function EmptyEventList() {
    return (
        <div className="empty">
            <div className="empty-icon">
                <i className="icon icon-2x icon-time"></i>
            </div>
            <p className="empty-title h4">No se encontraron eventos</p>
            <p className="empty-subtitle">&iquest;Por qu&eacute; no creas uno propio?</p>
            <div className="empty-action">
                <Link className="btn btn-primary" to="/event/create">Crear evento</Link>
            </div>
        </div>
    );
}