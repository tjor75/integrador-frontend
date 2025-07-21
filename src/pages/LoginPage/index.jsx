import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import "./LoginPage.css";

export default function LoginPage() {
    const { currentUser, setCurrentUser } = useContext(GlobalContext);

    useEffect(() => {
        window.title = "Ingresar";
    }, []);
    
    return (
        currentUser ? (
            <Navigate to="/" replace />
        ) : (
            <main className="login">
                <div className="card">
                    <h1 className="text-center">Ingresar</h1>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">E-mail</label>
                        <input className="form-input" type="email" id="email" placeholder="john.doe@example.com" />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Contrase&ntilde;a</label>
                        <input className="form-input" type="password" id="password" placeholder="********" />
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary col-12">Ingresar</button>
                        <p className="form-text">¿No tienes cuenta? <a href="/signup">Regístrate</a></p>
                    </div>
                </div>
            </main>
        )
    );
}