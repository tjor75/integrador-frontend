export default function TextAreaInput({
    name,
    title,
    placeholder,
    validInputs,
    setValidInputs,
    min = 3,
    required = false
}) {
    const validateTextArea = (text) => {
        const isValid = !(required && text === "" || text !== "" && text.length < min);
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
            <label className="form-label" htmlFor={name}>
                {title} {required && <span className="text-error">*</span>}
            </label>
            <textarea
                className="form-input"
                id={name}
                name={name}
                placeholder={placeholder}
                onChange={handleTextChange} />
            {validInputs[name] === false && (
                <p className="form-input-hint text-error">
                    {required && "Este campo es requerido. "}
                    Debe tener al menos {min} caracteres
                </p>
            )}
        </div>
    );
}