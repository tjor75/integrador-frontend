export default function PasswordInput({ name, title, placeholder="********", validInputs, setValidInputs }) {
    const validatePassword = (text) => {
        const isValid = text !== "" && text.length >= 3;
        setValidInputs(prevValidInputs => {
            const newValidInputs = { ...prevValidInputs };
            newValidInputs[name] = isValid;
            return newValidInputs;
        });
        return isValid;
    };

    const handlePasswordChange = async (event) => {
        const text = event.target.value;
        validatePassword(text);
    };
    
    return (
        <div className={validInputs[name] === false ? "form-group has-error" : "form-group"}>
            <label className="form-label" htmlFor={name}>{title}</label>
            <input
                className="form-input"
                type="password"
                id={name}
                name={name}
                placeholder={placeholder}
                onChange={handlePasswordChange} />
            {validInputs[name] === false && <p className="form-input-hint">Debe tener al menos 3 caracteres</p>}
        </div>
    );
}