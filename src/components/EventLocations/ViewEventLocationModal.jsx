import Modal from "../UI/Modal";
import MapPicker from "../UI/MapPicker";

export default function ViewEventLocationModal({ isOpen, onClose, data }) {
    const { name, full_address, max_capacity, id } = data || {};

    return (
        <Modal isOpen={isOpen} title="Detalle de ubicación" onClose={onClose}
            footer={(
                <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
            )}
        >
            {data ? (
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title m-0">{name}</h4>
                    </div>
                    <div className="card-body">
                        <div className="tile tile-centered mb-2">
                            <div className="tile-icon">
                                <i className="icon icon-location"></i>
                            </div>
                            <div className="tile-content">
                                <div className="tile-subtitle">
                                    <div className="mb-1">Dirección: {full_address}</div>
                                    <div className="mb-1">Capacidad máxima: <span className="label label-rounded label-secondary">{max_capacity}</span></div>
                                    <div className="text-gray text-small">ID: {id}</div>
                                </div>
                            </div>
                        </div>

                        {data && data.latitude && data.longitude && (
                            <div className="mt-2">
                                <MapPicker value={{ lat: data.latitude, lng: data.longitude }} onChange={() => {}} />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>Cargando...</div>
            )}
        </Modal>
    );
}


