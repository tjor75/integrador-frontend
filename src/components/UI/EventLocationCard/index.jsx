export default function EventLocationCard({ it, setViewTarget, setEditTarget, handleDelete }) {
    return (
        <div className="tile tile-centered mb-2">
            <div className="tile-icon"><i className="icon icon-location" /></div>
            <div className="tile-content">
                <div className="tile-title text-bold">{it.name}</div>
                <div className="tile-subtitle text-gray">{it.full_address}</div>
            </div>
            <div className="tile-action">
                <div className="btn-group">
                    <button className="btn btn-sm" onClick={() => setViewTarget(it)}>
                        Ver
                    </button>
                    <button className="btn btn-sm" title="Editar" onClick={() => setEditTarget(it)}>
                        <i className="icon icon-edit" />
                    </button>
                    <button className="btn btn-sm btn-error" title="Eliminar" onClick={() => handleDelete(it.id)}>
                        <i className="icon icon-delete" />
                    </button>
                </div>
            </div>
        </div>
    );
}