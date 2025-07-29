import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSerialOrDefault } from "../../helpers/validator-helper";
import * as eventService from "../../services/event-service.js";
import NoEncontradoPage from "../NoEncontradoPage";
import Map from "../../components/UI/Map";

export default function EventPage() {
    const params = useParams();
    const id = getSerialOrDefault(params.id, null);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            if (id) {
                setLoading(true);
                try {
                    const eventData = await eventService.getByIdAsync(id);
                    setEvent(eventData);
                } catch (error) {
                    console.error("Error fetching event:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchEvent();
    }, [id]);

    return (
        !loading ? (
            id && event ? (
                <main className="container">
                    <div className="columns">
                        <div className="column col-8 col-md-12">
                            <h1>{event.name}</h1>
                            <p>{event.description}</p>
                            <p>Date: {new Date(event.start_date).toLocaleDateString()}</p>
                            <p>Tags: {event.tags.join(", ")}</p>
                            <Map position={[event.event_location.latitude, event.event_location.longitude]} />
                        </div>
                        <div className="column col-4 col-md-12">
                            <div className="card">

                            </div>
                        </div>
                    </div>
                </main>
            ) : (
                <NoEncontradoPage />
            )
        ) : (
            <p>Loading...</p>
        )
    );
}