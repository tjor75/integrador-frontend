import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext.jsx";
import * as userService from "../../services/user-service.js";
import AuthForm from "../../components/AuthForm/index.jsx";
import TextInput from "../../components/UI/TextInput/index.jsx";
import EmailInput from "../../components/UI/EmailInput/index.jsx";
import PasswordInput from "../../components/UI/PasswordInput/index.jsx";
import { getEmailOrDefault } from "../../helpers/validator-helper.js";

export default function RegisterPage() {
    const { setJwtToken, currentUser, setCurrentUser } = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validInputs, setValidInputs] = useState({
        first_name: null,
        last_name: null,
        username: null,
        password: null
    });

    const handleRegister = async (event) => {
        const firstName = event.target.first_name.value.trim();
        const lastName  = event.target.last_name.value.trim();
        const username  = getEmailOrDefault(event.target.username.value, null);
        const password  = event.target.password.value;
    
        if (validInputs.first_name && validInputs.last_name && validInputs.username && validInputs.password) {
            setLoading(true);
            try {
                await userService.registerAsync(firstName, lastName, username, password);
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
            <AuthForm title="Registrar" error={error} onSubmit={handleRegister} setValidInputs={setValidInputs}>
                <TextInput
                    name="first_name"
                    title="Nombre(s)"
                    placeholder="John"
                    validInputs={validInputs}
                    setValidInputs={setValidInputs} />

                <TextInput
                    name="last_name"
                    title="Apellido(s)"
                    placeholder="Doe"
                    validInputs={validInputs}
                    setValidInputs={setValidInputs} />
                
                <EmailInput
                    name="username"
                    title="Username"
                    placeholder="john.doe@example.com"
                    validInputs={validInputs}
                    setValidInputs={setValidInputs} />

                <PasswordInput
                    name="password"
                    title="Contrase&ntilde;a"
                    placeholder="********"
                    validInputs={validInputs}
                    setValidInputs={setValidInputs} />
                
                <div className="text-center">
                    <button
                        className={loading ? "btn btn-primary col-12 loading" : "btn btn-primary col-12"}
                        type="submit"
                        disabled={loading}>
                        Registrar
                    </button>
                    <p className="form-text">&iquest;Ya tienes cuenta? <Link to="/login">Ingresa</Link></p>
                </div>
            </AuthForm>
        )
    );
}