import { NavLink } from "react-router-dom";
import Navbar from "../UI/Navbar";
import SearchBar from "../UI/SearchBar";

export default function Header() {
    return (
        <header className="navbar">
            <section className="navbar-section">
                <NavLink target="/" className="navbar-brand mr-2">Eventos</NavLink>
                <Navbar />
            </section>
            <section className="navbar-section">
                <SearchBar />
            </section>
        </header>
    )
}