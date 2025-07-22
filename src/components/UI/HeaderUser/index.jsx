import { useState } from "react";

export default function HeaderUser({ user, setJwtToken, setCurrentUser }) {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await setJwtToken(null);
        await setCurrentUser(null);
        setLoading(false);
    };

    return (
        <>
            <p>{user.username}</p>
            <button
                className={loading ? "btn btn-primary loading" : "btn btn-primary"}
                onClick={handleLogout}
                disabled={loading}
            >
                <i className="icon icon-shutdown"></i>
            </button>
        </>
    );
}