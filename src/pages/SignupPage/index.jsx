import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import * as userService from "../../services/user-service";

export default function SignupPage() {
    const { setJwtToken, currentUser, setCurrentUser } = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async (event) => {
        //if (error.username || error.password) {
            const username = event.target.username.value.trim().toLowerCase();
            const password = event.target.password.value;

            event.preventDefault();
            setLoading(true);

            try {
                const newJwtToken = await userService.signupAsync(firstName, lastName, username, password);
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
            <main className="auth">
                <form className="card" onSubmit={handleSignup}>
                    <h1 className="text-center">Registrar</h1>
                    {error && (
                        <div className="toast toast-error text-center">
                            <b>Error:</b> {error}
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label" htmlFor="first_name">Nombre(s)</label>
                        <input
                            className="form-input"
                            type="text"
                            id="first_name"
                            name="first_name"
                            placeholder="John"
                            minLength={3}
                            required />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="last_name">Apellido(s)</label>
                        <input
                            className="form-input"
                            type="text"
                            id="last_name"
                            name="last_name"
                            placeholder="Doe"
                            minLength={3}
                            required />
                    </div>
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
                            minLength={3}
                            required />
                    </div>
                    <div className="text-center">
                        <button
                            className={loading ? "btn btn-primary col-12 loading" : "btn btn-primary col-12"}
                            type="submit"
                            disabled={loading}>
                            Registrar
                        </button>
                        <p className="form-text">&iquest;Ya tienes cuenta? <Link to="/login">Ingresa</Link></p>
                    </div>
                </form>
            </main>
        )
    );
}