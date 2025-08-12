import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function HeaderUser({ user, setJwtToken, setCurrentUser }) {
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        await setJwtToken(null);
        await setCurrentUser(null);
        setLoggingOut(false);
    };

    return (
        <div className="dropdown dropdown-right">
            <button className="btn btn-primary dropdown-toggle" tabIndex="0">
                <i className="icon icon-people" />
            </button>
            <ul className="menu">
                <li className="menu-item">{user.username}</li>
                <li className="divider" />
                <li className="menu-item">
                    <NavLink to="/event/new" className="menu-link">
                        <i className="icon icon-time" /> Nuevo evento
                    </NavLink>
                </li>
                <li className="menu-item">
                    <a className="text-error" onClick={handleLogout} disabled={loggingOut} href="#">
                        {loggingOut ? (
                            <>
                                <i className="icon icon-spinner icon-spin" /> Logging out...
                            </>
                        ) : (
                            <>
                                <i className="icon icon-shutdown" /> Logout
                            </>
                        )}
                    </a>
                </li>
            </ul>
        </div>
    );
}