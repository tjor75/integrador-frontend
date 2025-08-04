export default function TextAreaInput({ name, title, placeholder, validInputs, setValidInputs }) {
    const validateTextArea = (text) => {
        const isValid = text !== "" && text.length >= 3;
        setValidInputs(prevValidInputs => {
            const newValidInputs = { ...prevValidInputs };
            newValidInputs[name] = isValid;
            return newValidInputs;
        });
        return isValid;
    };

    const handleTextChange = (event) => {
        const text = event.target.value;
        validateTextArea(text);
    };
    
    return (
        <div className={validInputs[name] === false ? "form-group has-error" : "form-group"}>
            <label className="form-label" htmlFor={name}>{title}</label>
            <textarea
                className="form-input"
                id={name}
                name={name}
                placeholder={placeholder}
                onChange={handleTextChange} />
            {validInputs[name] === false && <p className="form-input-hint">Debe tener al menos 3 caracteres</p>}
        </div>
    );
}