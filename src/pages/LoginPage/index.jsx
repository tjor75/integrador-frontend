import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import * as userService from "../../services/user-service";
import AuthForm from "../../components/AuthForm";
import EmailInput from "../../components/UI/EmailInput";
import PasswordInput from "../../components/UI/PasswordInput";

export default function LoginPage() {
    const { setJwtToken, currentUser, setCurrentUser, goBackAfterLogin, setGoBackAfterLogin } = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validInputs, setValidInputs] = useState({
        username: null,
        password: null
    });
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        const username = event.target.username.value.trim();
        const password = event.target.password.value;

        if (validInputs.username && validInputs.password) {
            setLoading(true);
            try {
                const newJwtToken = await userService.loginAsync(username, password);
                setJwtToken(newJwtToken);
                setCurrentUser({ username });
                await event.target.reset();
                if (goBackAfterLogin) {
                    navigate(-1);
                    setGoBackAfterLogin(false);
                } 
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
            <AuthForm title="Ingresar" error={error} onSubmit={handleLogin} setValidInputs={setValidInputs}>
                <EmailInput
                    name="username"
                    title="Username"
                    validInputs={validInputs}
                    setValidInputs={setValidInputs} />

                <PasswordInput
                    name="password"
                    title="Contrase&ntilde;a"
                    validInputs={validInputs}
                    setValidInputs={setValidInputs} />

                <div className="text-center">
                    <button
                        className={loading ? "btn btn-primary col-12 loading" : "btn btn-primary col-12"}
                        type="submit"
                        disabled={loading}>
                        Ingresar
                    </button>
                    <p className="form-text">&iquest;No tienes cuenta? <Link to="/register">Reg&iacute;strate</Link></p>
                </div>
            </AuthForm>
        )
    );
}