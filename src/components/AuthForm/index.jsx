import Form from "../Form";
import "./AuthForm.css";

export default function AuthForm({ title, error, onSubmit, setValidInputs, children }) {    
    
    return (
        <main className="auth">
            <Form
                className="card"
                title={title}
                error={error}
                onSubmit={onSubmit}
                setValidInputs={setValidInputs}
            >
                {children}
            </Form>
        </main>
    );
}