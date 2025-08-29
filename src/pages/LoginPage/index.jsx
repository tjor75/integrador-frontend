import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import AuthForm from "../../components/AuthForm";
import EmailInput from "../../components/UI/EmailInput";
import PasswordInput from "../../components/UI/PasswordInput";
import useAuth from "../../hooks/useAuth";

export default function LoginPage() {
    const { currentUser, setTitle } = useContext(GlobalContext);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validInputs, setValidInputs] = useState({
        username: null,
        password: null
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        setTitle("Ingresar");
    }, [setTitle]);

    const getRedirectTo = () => {
        const raw = searchParams.get("redirect_to");
        if (!raw) return "/";
        let decoded = raw;
        try { decoded = decodeURIComponent(raw); } catch (_) { /* ignore */ }
        // Must be a same-origin relative path (no protocol, no //) to be safe
        if (decoded.startsWith("/") && !decoded.startsWith("//")) {
            // Avoid redirect loop back to login
            if (decoded === "/login") return "/";
            return decoded;
        }
        return "/";
    };

    const handleLogin = async (event) => {
        const username = event.target.username.value.trim();
        const password = event.target.password.value;

        if (validInputs.username && validInputs.password) {
            setLoading(true);
            try {
                await login(username, password);
                event.target.reset();
                navigate(getRedirectTo(), { replace: true });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };
    
    return (
        currentUser ? (
            <Navigate to={getRedirectTo()} replace />
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
                        disabled={loading}
                    >
                        Ingresar
                    </button>
                    <p className="form-text">
                        &iquest;No tienes cuenta?
                        <Link to={"/register" + (
                            getRedirectTo() !== "/" ? `?redirect_to=${encodeURIComponent(getRedirectTo())}` : ""
                        )}>Reg&iacute;strate</Link>
                    </p>
                </div>
            </AuthForm>
        )
    );
}