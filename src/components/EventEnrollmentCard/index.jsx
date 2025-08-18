import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import * as eventService from "../../services/event-service.js";
import useAuth from "../../hooks/useAuth.js";
import EventEnrollmentButton from "../EventEnrollmentButton";
import "./EventEnrollment.css";

export default function EventEnrollmentCard({ event }) {
    const { currentUser } = useContext(GlobalContext);
    const { jwtToken, validateSession } = useAuth();
    const navigate = useNavigate();
    const enabledForEnrollment = event.enabled_for_enrollment === true || event.enabled_for_enrollment === "1" || event.enabled_for_enrollment === 1;

    const handleDelete = async (eventId) => {
        if (!window.confirm("¿Eliminar este evento?")) return;
        
        try {
            await eventService.deleteAsync(eventId, jwtToken);
            navigate("/events");
        } catch (err) {
            if (validateSession(err)) {
                console.error("Error deleting event:", err);
            }
        }
    };

    return (
        <section className={"card " + (enabledForEnrollment ? "bg-secondary" : "bg-error") + " event-enrollment-card"}>
            <div className="card-body">
                <p className="h3">{event.price === 0 ? "Gratis" : `$${event.price}`}</p>
            </div>
            <div className="card-footer">
                <div className="btn-group btn-group-block">
                    {
                        currentUser && currentUser.username === event.creator_user.username ? (
                            <>
                                <Link className="btn" to={`/event/${event.id}/edit`}>
                                    <i className="icon icon-edit" />
                                    Editar
                                </Link>
                                <button className="btn btn-error" onClick={() => handleDelete(event.id)}>
                                    <i className="icon icon-delete" />
                                    Eliminar
                                </button>
                            </>
                        ) : (
                            <EventEnrollmentButton
                                event={event}
                                enabledForEnrollment={enabledForEnrollment}
                            />
                        )
                    }
                </div>
            </div>
        </section>
    );
}