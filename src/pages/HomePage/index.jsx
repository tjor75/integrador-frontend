import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { globalContext } from "../../context/GlobalContext";
import * as eventService from "../../services/event-service.js";
import EventList from "../../components/EventList";
import Loading from "../../components/UI/Loading";
import "./HeroPage.css";

export default function HomePage() {
    const { currentUser } = useContext(globalContext);
    const navigate = useNavigate();
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Si el usuario está logueado, redirigir a eventos
        if (currentUser) {
            navigate('/events');
            return;
        }

        // Cargar eventos destacados para usuarios no logueados
        fetchFeaturedEvents();
    }, [currentUser, navigate]);

    const fetchFeaturedEvents = async () => {
        try {
            setLoading(true);
            const data = await eventService.getAllAsync(1, {});
            // Tomar solo los primeros 6 eventos como destacados
            setFeaturedEvents(data.slice(0, 6));
        } catch (error) {
            console.error("Error fetching featured events:", error);
        } finally {
            setLoading(false);
        }
    };

    // Si el usuario está logueado, no mostrar nada (se redirige)
    if (currentUser) {
        return null;
    }

    return (
        <main>
            <section className="hero hero-lg bg-primary">
                <img className="hero-people" src="/img/hero-people.png" />
                <div className="hero-body text-center">
                    <h1 className="hero-title">¡Encuentra y Crea Eventos Increíbles!</h1>
                    <p className="hero-subtitle">
                        Conecta con personas que comparten tus intereses. 
                        Descubre eventos únicos o crea el tuyo propio.
                    </p>
                    <div className="hero-actions">
                        <Link to="/event/create" className="btn btn-lg btn-primary">
                            Crear Evento
                        </Link>
                        <Link to="/events" className="btn btn-lg btn-outline">
                            Explorar Eventos
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column col-4 col-md-12">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h3>🎉 Descubre Eventos</h3>
                                    <p>Encuentra eventos emocionantes cerca de ti. Desde conciertos hasta talleres, hay algo para todos.</p>
                                </div>
                            </div>
                        </div>
                        <div className="column col-4 col-md-12">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h3>👥 Conecta</h3>
                                    <p>Únete a comunidades que comparten tus intereses. Haz nuevos amigos y expande tu red.</p>
                                </div>
                            </div>
                        </div>
                        <div className="column col-4 col-md-12">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h3>🚀 Crea</h3>
                                    <p>Organiza tu propio evento y comparte tu pasión con el mundo. Es fácil y rápido.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Events Section */}
            <section className="section bg-gray">
                <div className="container">
                    <div className="text-center">
                        <h2>Eventos Destacados</h2>
                        <p className="text-gray">Descubre algunos de los eventos más populares</p>
                    </div>
                    
                    {loading ? (
                        <div className="text-center">
                            <Loading />
                        </div>
                    ) : featuredEvents.length > 0 ? (
                        <div>
                            <EventList events={featuredEvents} />
                            <div className="text-center">
                                <Link to="/events" className="btn btn-primary btn-lg">
                                    Ver Todos los Eventos
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray">No hay eventos disponibles en este momento.</p>
                            <Link to="/event/create" className="btn btn-primary">
                                Crear el Primer Evento
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Quick Actions Section */}
            <section className="section">
                <div className="container">
                    <div className="text-center">
                        <h2>¿Qué quieres hacer hoy?</h2>
                        <p className="text-gray">Elige tu próxima aventura</p>
                    </div>
                    
                    <div className="columns">
                        <div className="column col-6 col-md-12">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h3>🔍 Buscar Eventos</h3>
                                    <p>Explora nuestra colección de eventos y encuentra algo que te interese.</p>
                                    <Link to="/events" className="btn btn-primary">
                                        Ver Todos los Eventos
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="column col-6 col-md-12">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h3>✨ Crear Evento</h3>
                                    <p>¿Tienes una idea genial? ¡Comparte tu pasión organizando un evento!</p>
                                    <Link to="/event/create" className="btn btn-primary">
                                        Crear Mi Evento
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section">
                <div className="container">
                    <div className="card bg-primary text-light">
                        <div className="card-body text-center">
                            <h2>¿Listo para crear algo increíble?</h2>
                            <p>Únete a nuestra comunidad y comienza a organizar eventos que inspiren.</p>
                            <Link to="/event/create" className="btn btn-lg btn-light">
                                Empezar Ahora
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}