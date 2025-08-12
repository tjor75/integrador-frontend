export default function Modal({ isOpen, title, onClose, children, footer }) {
    if (!isOpen) return null;

    return (
        <div className="modal active" role="dialog">
            <a className="modal-overlay" aria-label="Close" onClick={onClose}></a>
            <div className="modal-container">
                <div className="modal-header">
                    <a className="btn btn-clear float-right" aria-label="Close" onClick={onClose}></a>
                    <div className="modal-title h5">{title}</div>
                </div>
                <div className="modal-body">
                    <div className="content">
                        {children}
                    </div>
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}


