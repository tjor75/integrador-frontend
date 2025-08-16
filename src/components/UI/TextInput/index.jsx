export default function TextInput({ 
    name, 
    title, 
    placeholder, 
    validInputs, 
    setValidInputs, 
    defaultValue = "",
    min = 3,
    required = false
}) {
    const validateText = (text) => {
        let isValid = true;
        
        if (required && text === "") {
            isValid = false;
        } else if (text !== "" && text.length < min) {
            isValid = false;
        }
        
        setValidInputs(prevValidInputs => {
            const newValidInputs = { ...prevValidInputs };
            newValidInputs[name] = isValid;
            return newValidInputs;
        });
        return isValid;
    };

    const handleTextChange = async (event) => {
        const text = event.target.value;
        validateText(text);
    };
    
    return (
        <div className={validInputs[name] === false ? "form-group has-error" : "form-group"}>
            <label className="form-label" htmlFor={name}>
                {title} {required && <span className="text-error">*</span>}
            </label>
            <input
                className="form-input"
                type="text"
                id={name}
                name={name}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={handleTextChange}
            />
            {validInputs[name] === false && (
                <p className="form-input-hint text-error">
                    {required && "Este campo es requerido. "}
                    Debe tener al menos {min} caracteres
                </p>
            )}
        </div>
    );
}