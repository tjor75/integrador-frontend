import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import * as userService from "../../services/user-service.js";
import "./LoginPage.css";
//import { getEmailOrDefault } from "../../helpers/validator-helper.js";

export default function LoginPage() {
    const { setJwtToken, currentUser, setCurrentUser } = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /* const handleUsernameChange = async (event) => {
        const username = getEmailOrDefault(event.target.value.trim().toLowerCase());
        

        setError(prevError => {
            if (username) {
                const newError = { ...prevError };
                newError.username = username ? undefined : "Username is required";
                return newError;
            }
        });
    };

    const handlePasswordChange = async (event) => {
        const password = event.target.value;
        setError(prevError => {
            const newError = { ...prevError };
            newError.password = password ? undefined : "Password is required";
            return newError;
        });
    }; */

    const handleLogin = async (event) => {
        //if (error.username || error.password) {
            const username = event.target.username.value.trim().toLowerCase();
            const password = event.target.password.value;

            event.preventDefault();
            setLoading(true);

            try {
                const newJwtToken = await userService.loginAsync(username, password);
                setJwtToken(newJwtToken);
                setCurrentUser({ username });
                event.target.reset();
            } catch (err) {
                setError(err.message);
                /*setError(prevError => {
                    const newError = { ...prevError };
                    newError.message = err.message;
                    return newError;
                });*/
            } finally {
                setLoading(false);
            }
        //}
    };


    
    return (
        currentUser ? (
            <Navigate to="/" replace />
        ) : (
            <main className="login">
                <form className="card" onSubmit={handleLogin}>
                    <h1 className="text-center">Ingresar</h1>
                    {error && (
                        <div className="toast toast-error text-center">
                            <b>Error:</b> {error}
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            className="form-input"
                            type="email"
                            id="username"
                            name="username"
                            placeholder="john.doe@example.com"
                            required />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Contrase&ntilde;a</label>
                        <input
                            className="form-input"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            required />
                    </div>
                    <div className="text-center">
                        <button
                            className={loading ? "btn btn-primary col-12 loading" : "btn btn-primary col-12"}
                            type="submit"
                            disabled={loading}>
                            Ingresar
                        </button>
                        <p className="form-text">¿No tienes cuenta? <a href="/signup">Regístrate</a></p>
                    </div>
                </form>
            </main>
        )
    );
}