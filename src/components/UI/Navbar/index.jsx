import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <>
            <NavLink className="btn btn-link" to="/">Home</NavLink>
            <NavLink className="btn btn-link" to="/events">Eventos</NavLink>
            <NavLink className="btn btn-link" to="/events/create">Eventos</NavLink>
        </>
    )
}