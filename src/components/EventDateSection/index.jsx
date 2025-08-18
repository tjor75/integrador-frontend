import { formatDateTime, formatDuration } from "../../helpers/date-helper";

export default function EventDateSection({ event }) {
    return (
        <section className="card mb-2">
            <div className="card-header">
                <div className="card-title h5">
                    <i className="icon icon-time mr-2"></i>
                    Fecha y Hora
                </div>
            </div>
            <div className="card-body">
                {event.start_date && (
                    <>
                        {formatDateTime(event.start_date).date}
                        {event.duration_in_minutes && (
                            <span className="label label-rounded label-secondary ml-2">
                                {formatDuration(parseInt(event.duration_in_minutes))}
                            </span>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}