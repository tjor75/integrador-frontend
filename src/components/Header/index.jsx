import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import Navbar from "../UI/Navbar";
import SearchBar from "../UI/SearchBar";
import HeaderUser from "../UI/HeaderUser";
import "./Header.css";

export default function Header() {
    const { jwtToken, setJwtToken, currentUser, setCurrentUser } = useContext(GlobalContext);

    return (
        <header className="navbar bg-secondary container">
            <section className="navbar-section">
                <NavLink className="navbar-brand mr-2" to="/">Eventos</NavLink>
                <Navbar />
            </section>
            <section className="navbar-section">
                <SearchBar />
                {
                    currentUser ?
                    <HeaderUser
                        user={currentUser}
                        setJwtToken={setJwtToken}
                        setCurrentUser={setCurrentUser} />
                    :
                    <>
                        <NavLink className="btn btn-primary" to="/signup">
                            Registrar
                        </NavLink>
                        <NavLink className="btn btn-link" to="/login">
                            Ingresar
                        </NavLink>
                    </>
                }
            </section>
        </header>
    );
}