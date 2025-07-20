import { useContext } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../UI/Navbar";
import SearchBar from "../UI/SearchBar";
import HeaderUser from "../UI/HeaderUser";
import { GlobalContext } from "../../context/GlobalContext";

export default function Header() {
    const { user } = useContext(GlobalContext);

    return (
        <header className="navbar bg-secondary container">
            <section className="navbar-section">
                <NavLink className="navbar-brand mr-2" to="/">Eventos</NavLink>
                <Navbar />
            </section>
            <section className="navbar-section">
                <SearchBar />
                {
                    user ?
                    <HeaderUser user={user} />
                    :
                    <>
                        <NavLink className="btn btn-primary" to="/signup">
                            Sign up
                        </NavLink>
                        <NavLink className="btn btn-link" to="/login">
                            Log in
                        </NavLink>
                    </>
                }
            </section>
        </header>
    )
}