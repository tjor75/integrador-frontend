import { useContext, useEffect, useState } from "react";
import * as eventService from "../../services/event-service.js";
import { GlobalContext } from "../../context/GlobalContext";
import useLoginRedirect from "../../hooks/useLoginRedirect.js";

export default function EventEnrollmentButton({ event, enabledForEnrollment }) {
    const { jwtToken } = useContext(GlobalContext);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null); // null, "enrolled", "not_enrolled"
    const loginRedirect = useLoginRedirect();

    useEffect(() => {
        const checkEnrollment = async () => {
            if (jwtToken) {
                try {
                    const es = await eventService.checkEnrollmentAsync(event.id, jwtToken);
                    console.log("Enrollment status:", es);
                    setEnrollmentStatus(es);
                } catch (error) {
                    console.error("Error checking enrollment status:", error);
                    setEnrollmentStatus(false);
                }
            } else {
                setEnrollmentStatus(false);
            }
        };
        checkEnrollment();
    }, [event.id, jwtToken]);

    const enroll = async () => {
        if (!jwtToken) {
            loginRedirect();
            return;
        }

        try {
            await eventService.enrollAsync(event.id, jwtToken);
            setEnrollmentStatus(true);
        } catch (error) {
            console.error("Enrollment error:", error);
            alert(error.message || "No se pudo inscribir al evento.");
        }
    };

    const unenroll = async () => {
        if (!jwtToken) {
            loginRedirect();
            return;
        }
        try {
            await eventService.unenrollAsync(event.id, jwtToken);
            setEnrollmentStatus(false);
        } catch (error) {
            console.error("Unenrollment error:", error);
            alert(error.message || "No se pudo desinscribir del evento.");
        }
    };

    return (
        enrollmentStatus !== null ? (
            <button
                className={enrollmentStatus ? "btn btn-secondary" : "btn btn-primary"}
                onClick={enrollmentStatus ? unenroll : enroll}
                disabled={!enabledForEnrollment}
            >
                {enrollmentStatus ? "Desinscribirse" : "Inscribirse"}
            </button>
        ) : (
            <button className="btn loading"></button>
        )
    );
}