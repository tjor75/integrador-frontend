import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSerialOrDefault } from "../../helpers/validator-helper";
import * as eventService from "../../services/event-service.js";
import EnrollmentCard from "../../components/UI/EnrollmentCard";
import NoEncontradoPage from "../NoEncontradoPage";
import PageSpinner from "../../components/PageSpinner/index.jsx";
import DatePlaceCard from "../../components/UI/DatePlaceCard/index.jsx";

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
                            <div>
                                <h1>{event.name}</h1>
                                <p className="text-gray strong">Organizado por: {event.creator_user.first_name} {event.creator_user.last_name}</p>
                            </div>
                            <div className="show-md">
                                <EnrollmentCard event={event} />
                            </div>
                            <div>
                                <h2>Descripci&oacute;n</h2>
                                <p>{event.description}</p>
                            </div>
                            <p>
                                {event.tags.map((tag, index) => (
                                    <Link key={"tag" + index} className="label label-rounded label-primary" to={"/?tag=" + tag.name}>
                                        {tag.name}
                                    </Link>
                                ))}
                            </p>
                            <div id="comments">
                                <h2>Comentarios</h2>
                                <p>Aquí irían los comentarios del evento.</p>
                                {
                                    event.comments && event.comments.length > 0 ? (
                                        <ul>
                                            {event.comments.map((comment, index) => (
                                                <li key={"comment" + index}>
                                                    <strong>{comment.user.username}:</strong> {comment.text}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No hay comentarios para este evento.</p>
                                    )
                                }
                            </div>
                        </div>
                        <div className="column col-4 col-md-12">
                            <div className="hide-md">
                                <EnrollmentCard event={event} />
                            </div>
                            <DatePlaceCard event={event} />
                        </div>
                    </div>
                </main>
            ) : (
                <NoEncontradoPage />
            )
        ) : (
            <PageSpinner />
        )
    );
}