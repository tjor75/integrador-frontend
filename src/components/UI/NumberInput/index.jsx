export default function NumberInput({ 
    name, 
    title, 
    placeholder, 
    validInputs, 
    setValidInputs, 
    required = false,
    defaultValue = "",
    min,
    max
}) {
    const validateNumber = (value) => {
        let isValid = true;
        
        if (required && value === "") {
            isValid = false;
        } else if (value !== "") {
            const numValue = parseInt(value);
            if (isNaN(numValue) || (min !== undefined && numValue < min) || (max !== undefined && numValue > max)) {
                isValid = false;
            }
        }
        
        setValidInputs(prevValidInputs => {
            const newValidInputs = { ...prevValidInputs };
            newValidInputs[name] = isValid;
            return newValidInputs;
        });
        return isValid;
    };

    const handleNumberChange = async (event) => {
        const value = event.target.value;
        validateNumber(value);
    };
    
    const getErrorMessage = () => {
        if (min !== undefined && max !== undefined) {
            return `Debe ser un número entre ${min} y ${max}`;
        } else if (min !== undefined) {
            return `Debe ser un número mayor o igual a ${min}`;
        } else if (max !== undefined) {
            return `Debe ser un número menor o igual a ${max}`;
        }
        return "Debe ser un número válido";
    };
    
    return (
        <div className={validInputs[name] === false ? "form-group has-error" : "form-group"}>
            <label className="form-label" htmlFor={name}>
                {title} {required && <span className="text-error">*</span>}
            </label>
            <input
                className="form-input"
                type="number"
                id={name}
                name={name}
                placeholder={placeholder}
                defaultValue={defaultValue}
                min={min}
                max={max}
                onChange={handleNumberChange}
            />
            {validInputs[name] === false && (
                <p className="form-input-hint text-error">{getErrorMessage()}</p>
            )}
        </div>
    );
}
