import AddToCalendar from "../AddToCalendar";

export default function EventAddToCalendarSection({ event }) {
    return (
        <section className="card mb-2">
            <div className="card-header">
                <div className="card-title h5">
                    <i className="icon icon-share mr-2"></i>
                    Agregar al calendario
                </div>
            </div>
            <div className="card-body">
                <AddToCalendar event={event} />
            </div>
        </section>
    );
}