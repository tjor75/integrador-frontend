import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import "./LoginPage.css";

export default function LoginPage() {
    const { currentUser, setCurrentUser } = useContext(GlobalContext);
    
    return (
        currentUser ?
        <Navigate to="/" replace />
        :
        <main className="login">
            <div className="card">
                <h1>Ingresar</h1>
                <div className="form-group">
                    <label className="form-label" for="input-example-1">Name</label>
                    <input className="form-input" type="text" id="input-example-1" placeholder="Name" />
                </div>
            </div>
        </main>
    );
}