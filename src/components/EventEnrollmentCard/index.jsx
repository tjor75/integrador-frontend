import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import EventEnrollmentButton from "../EventEnrollmentButton";

export default function EventEnrollmentCard({ event }) {
    const { currentUser } = useContext(GlobalContext);
    const enabledForEnrollment = event.enabled_for_enrollment === true || event.enabled_for_enrollment === "1" || event.enabled_for_enrollment === 1;

    return (
        <section className={"card " + (enabledForEnrollment ? "bg-secondary" : "card bg-error") + " event-enrollment-card"}>
            <div className="card-body">
                <p className="h3">{event.price === 0 ? "Gratis" : `$${event.price}`}</p>
            </div>
            <div className="card-footer">
                <div className="btn-group btn-group-block">
                    {
                        currentUser && currentUser.username === event.creator_user.username ? (
                            <>
                                <NavLink className="btn">
                                    <i className="icon icon-edit" />
                                    Editar
                                </NavLink>
                                <NavLink className="btn btn-error">
                                    <i className="icon icon-delete" />
                                    Eliminar
                                </NavLink>
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