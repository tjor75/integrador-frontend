export default function DateTimeInput({ 
    name, 
    title, 
    validInputs, 
    setValidInputs, 
    required = false,
    defaultValue = ""
}) {
    const validateDateTime = (value) => {
        let isValid = true;
        
        if (required && value === "") {
            isValid = false;
        }
        
        setValidInputs(prevValidInputs => {
            const newValidInputs = { ...prevValidInputs };
            newValidInputs[name] = isValid;
            return newValidInputs;
        });
        return isValid;
    };

    const handleDateTimeChange = async (event) => {
        const value = event.target.value;
        validateDateTime(value);
    };
    
    return (
        <div className={validInputs[name] === false ? "form-group has-error" : "form-group"}>
            <label className="form-label" htmlFor={name}>
                {title} {required && <span className="text-error">*</span>}
            </label>
            <input
                className="form-input"
                type="datetime-local"
                id={name}
                name={name}
                defaultValue={defaultValue}
                onChange={handleDateTimeChange}
                required={required} />
            {validInputs[name] === false && (
                <p className="form-input-hint text-error">
                    Este campo es requerido
                </p>
            )}
        </div>
    );
}
