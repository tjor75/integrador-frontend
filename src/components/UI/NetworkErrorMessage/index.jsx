export default function NetworkErrorMessage() {
    return (
        <div className="network-error-message">
            <i className="icon icon-2x icon-flag"></i>
            <h2>Error de red</h2>
            <p>Hubo un problema al intentar conectarse al servidor. Por favor, verifica tu conexión a Internet o intenta más tarde.</p>
        </div>
    );
}