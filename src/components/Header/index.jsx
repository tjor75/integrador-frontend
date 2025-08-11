import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { globalContext } from "../../context/GlobalContext";
import SearchBar from "../SearchBar";
import HeaderUser from "../UI/HeaderUser";
import "./Header.css";

export default function Header() {
    const { setJwtToken, currentUser, setCurrentUser } = useContext(globalContext);

    return (
        <header className="navbar bg-secondary container">
            <section className="navbar-section">
                <NavLink className="navbar-brand mr-2" to="/">Eventos</NavLink>
                <SearchBar />
            </section>
            <section className="navbar-section">
                {
                    currentUser ?
                    <>
                        <NavLink className="btn btn-primary mr-2" to="/event/create">
                            ➕ Crear Evento
                        </NavLink>
                        <HeaderUser
                            user={currentUser}
                            setJwtToken={setJwtToken}
                            setCurrentUser={setCurrentUser} />
                    </>
                    :
                    <>
                        <NavLink className="btn btn-link" to="/login">
                            Ingresar
                        </NavLink>
                        <NavLink className="btn btn-primary" to="/register">
                            Registrar
                        </NavLink>
                    </>
                }
            </section>
        </header>
    );
}