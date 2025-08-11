import { useContext } from "react";
import { globalContext } from "../../context/GlobalContext";

export default function EventEnrollmentCard({ event }) {
    const { jwtToken, currentUser } = useContext(globalContext);
    const enabledForEnrollment = event.enabled_for_enrollment === "1";

    const enroll = async () => {
        /*if (!jwtToken) {
            alert("You must be logged in to enroll in an event.");
            return;
        }

        try {
            const data = await eventService.enrollAsync(event.id, jwtToken);
            alert("Successfully enrolled in the event!");
            // Optionally, update the UI or state here
        } catch (error) {
            console.error("Enrollment error:", error);
            alert("Failed to enroll in the event. Please try again later.");
        }*/
    };

    const unenroll = async () => {
    };

    return (
        <section className={"card " + (enabledForEnrollment || "bg-error")}>
            <div className="card-body">
                <p className="h3">${event.price}</p>
            </div>
            <div className="card-footer">
                <div className="btn-group btn-group-block">
                    {
                        currentUser && currentUser.username === event.creator_user.username ? (
                            <button className="btn btn-primary" disabled={!enabledForEnrollment}>Administrar</button>
                        ) : (
                            <button 
                                className={"btn " + (enabledForEnrollment || "btn-primary")}
                                onClick={enabledForEnrollment ? enroll : unenroll}
                                disabled={!enabledForEnrollment}
                            >
                                {enabledForEnrollment ? "Inscribirse" : "Desinscribirse"}
                            </button>
                        )
                    }
                </div>
            </div>
        </section>
    );
}