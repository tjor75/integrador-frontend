import { useEffect, useState } from "react";
import * as eventService from "../../services/event-service.js";
import useAuth from "../../hooks/useAuth.js";
import useLoginRedirect from "../../hooks/useLoginRedirect.js";

export default function EventEnrollmentButton({ event, enabledForEnrollment }) {
    const [loading, setLoading] = useState(false);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null); // null, "enrolled", "not_enrolled"
    const { jwtToken, validateSession } = useAuth();
    const loginRedirect = useLoginRedirect();

    useEffect(() => {
        const checkEnrollment = async () => {
            if (jwtToken) {
                try {
                    const es = await eventService.checkEnrollmentAsync(event.id, jwtToken);
                    setEnrollmentStatus(es);
                } catch (error) {
                    if (validateSession(error)) {
                        console.error("Error checking enrollment status:", error);
                        alert(error.message || "No se pudo verificar el estado de inscripción.");
                    }
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
            setLoading(true);
            await eventService.enrollAsync(event.id, jwtToken);
            setEnrollmentStatus(true);
        } catch (error) {
            if (validateSession(error)) {
                console.error("Enrollment error:", error);
                alert(error.message || "No se pudo inscribir al evento.");
            }
        } finally {
            setLoading(false);
        }
    };

    const unenroll = async () => {
        if (!jwtToken) {
            loginRedirect();
            return;
        }

        try {
            setLoading(true);
            await eventService.unenrollAsync(event.id, jwtToken);
            setEnrollmentStatus(false);
        } catch (error) {
            if (validateSession(error)) {
                console.error("Unenrollment error:", error);
                alert(error.message || "No se pudo desinscribir del evento.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        loading !== null ? (
            <button
                className={enrollmentStatus ? "btn btn-secondary" : "btn btn-primary"}
                onClick={enrollmentStatus ? unenroll : enroll}
                disabled={!(enabledForEnrollment || enrollmentStatus)}
            >
                {enrollmentStatus ? "Desinscribirse" : "Inscribirse"}
            </button>
        ) : (
            <button className="btn loading"></button>
        )
    );
}