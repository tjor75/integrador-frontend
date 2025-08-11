import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { globalContext } from "../../context/GlobalContext.jsx";
import * as userService from "../../services/user-service.js";
import { getEmailOrDefault } from "../../helpers/validator-helper.js";

export default function LoginPage() {
    const { setJwtToken, currentUser, setCurrentUser } = useContext(globalContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validInputs, setValidInputs] = useState({
        username: true,
        password: true
    });

    const validateUsername = (text) => {
        const username = getEmailOrDefault(text, null);
        const isValid = username !== null;
        setValidInputs(prevValidInputs => {
            const newValidInputs = { ...prevValidInputs };
            newValidInputs.username = isValid;
            return newValidInputs;
        });
        return isValid;
    };

    const handleUsernameChange = async (event) => {
        const username = event.target.value.trim().toLowerCase();
        validateUsername(username);
    };

    const validatePassword = (password) => {
        const isValid = password !== "" && password.length >= 3;
        setValidInputs(prevValidInputs => {
            const newValidInputs = { ...prevValidInputs };
            newValidInputs.password = isValid;
            return newValidInputs;
        });
        return isValid;
    };

    const handlePasswordChange = async (event) => {
        const password = event.target.value;
        validatePassword(password);
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        const username = event.target.username.value;
        const password = event.target.password.value;

        const validUsername = validateUsername(username);
        const validPassword = validatePassword(password);

        if (validUsername && validPassword) {
            setLoading(true);

            try {
                const newJwtToken = await userService.loginAsync(username, password);
                setJwtToken(newJwtToken);
                setCurrentUser({ username });
                event.target.reset();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        currentUser ? (
            <Navigate to="/" replace />
        ) : (
            <main className="auth">
                <form className="card" onSubmit={handleLogin}>
                    <h1 className="text-center">Ingresar</h1>
                    {error && (
                        <div className="toast toast-error text-center">
                            <b>Error:</b> {error}
                        </div>
                    )}
                    <div className={validInputs.username ? "form-group" : "form-group has-error"}>
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                            className="form-input"
                            type="email"
                            id="username"
                            name="username"
                            placeholder="john.doe@example.com"
                            onChange={handleUsernameChange} />
                        {validInputs.username || <p className="form-input-hint">Debe ser un correo v&aacute;lido</p>}
                    </div>
                    <div className={validInputs.password ? "form-group" : "form-group has-error"}>
                        <label className="form-label" htmlFor="password">Contrase&ntilde;a</label>
                        <input
                            className="form-input"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            onChange={handlePasswordChange} />
                        {validInputs.password || <p className="form-input-hint">Debe tener al menos 3 caracteres</p>}
                    </div>
                    <div className="text-center">
                        <button
                            className={loading ? "btn btn-primary col-12 loading" : "btn btn-primary col-12"}
                            type="submit"
                            disabled={loading}>
                            Ingresar
                        </button>
                        <p className="form-text">&iquest;No tienes cuenta? <Link to="/signup">Reg&iacute;strate</Link></p>
                    </div>
                </form>
            </main>
        )
    );
}