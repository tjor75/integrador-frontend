import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSerialOrDefault } from "../../helpers/validator-helper";
import * as eventService from "../../services/event-service.js";
import NoEncontradoPage from "../NoEncontradoPage";
import SpinnerPage from "../SpinnerPage";

import EventEnrollmentCard from "../../components/EventEnrollmentCard";
import EventDescriptionCard from "../../components/EventDescriptionCard";
import EventHeaderSection from "../../components/EventHeaderSection";
import EventDateSection from "../../components/EventDateSection";

import EventLocationCard from "../../components/LocationCard";
import EventTagsCard from "../../components/EventTagsCard";

import "./EventPage.css";
import EventAddToCalendarSection from "../../components/EventAddToCalendarSection/index.jsx";


export default function EventPage() {
    const params = useParams();
    const id = params.id;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (id) {
                setLoading(true);
                try {
                    const eventData = await eventService.getByIdAsync(id);
                    setEvent(eventData);
                    console.log(eventData)
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
                    <EventHeaderSection event={event} />

                    <div className="columns mt-2">
                        <div className="column col-8 col-md-12">
                            <EventDateSection event={event} />
                            <EventDescriptionCard description={event.description} />
                            {event.event_location.latitude && event.event_location.longitude && (
                                <EventLocationCard event={event} />
                            )}
                            {event.tags && event.tags.length > 0 && <EventTagsCard tags={event.tags} />}
                        </div>
                        
                        <div className="column col-4 col-md-12">
                            <div className="mb-2">
                                <EventEnrollmentCard event={event} />
                                <EventAddToCalendarSection event={event} />
                            </div>
                        </div>
                    </div>
                </main>
            ) : (
                <NoEncontradoPage />
            )
        ) : (
            <SpinnerPage />
        )
    );
}