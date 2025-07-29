import { getEmailOrDefault } from "../../../helpers/validator-helper";

export default function EmailInput({ name, title, placeholder="john.doe@example.com", validInputs, setValidInputs }) {
    const validateEmail = (text) => {
        const email = getEmailOrDefault(text, null);
        const isValid = email !== null;
        setValidInputs(prevValidInputs => {
            const newValidInputs = { ...prevValidInputs };
            newValidInputs[name] = isValid;
            return newValidInputs;
        });
        return isValid;
    };
    
    const handleEmailChange = async (event) => {
        const email = event.target.value.trim().toLowerCase();
        validateEmail(email);
    };

    return (
        <div className={validInputs[name] === false ? "form-group has-error" : "form-group"}>
            <label className="form-label" htmlFor={name}>{title}</label>
            <input
                className="form-input"
                type="email"
                id={name}
                name={name}
                placeholder={placeholder}
                onChange={handleEmailChange} />
            {validInputs[name] === false && <p className="form-input-hint">Debe ser un correo v&aacute;lido</p>}
        </div>
    );
}