export default function EventDescriptionCard({ description }) {
    return (
        <section className="card mb-2">
            <div className="card-header">
                <div className="card-title h5">
                    <i className="icon icon-message mr-2"></i>
                    Descripción
                </div>
            </div>
            <div className="card-body">
                <p className="text-justify">{description}</p>
            </div>
        </section>
    );
}