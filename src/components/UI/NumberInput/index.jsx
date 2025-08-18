import { useState, useEffect } from "react";

export default function NumberInput({ 
    name, 
    title, 
    placeholder, 
    validInputs, 
    setValidInputs, 
    required = false,
    defaultValue = "",
    min,
    max,
    value,              // nuevo: permite modo controlado
    onValueChange       // nuevo: callback al cambiar
}) {
    // estado interno solo si no es controlado
    const [internalValue, setInternalValue] = useState(defaultValue);

    // Si cambia defaultValue y el componente NO es controlado, sincronizar
    useEffect(() => {
        if (value === undefined) {
            setInternalValue(defaultValue);
        }
    }, [defaultValue, value]);

    const currentValue = value !== undefined ? value : internalValue;

    const validateNumber = (val) => {
        let isValid = true;
        if (required && val === "") {
            isValid = false;
        } else if (val !== "") {
            const numValue = parseInt(val);
            if (isNaN(numValue) || (min !== undefined && numValue < min) || (max !== undefined && numValue > max)) {
                isValid = false;
            }
        }
        setValidInputs(prevValidInputs => ({ ...prevValidInputs, [name]: isValid }));
        return isValid;
    };

    const handleNumberChange = (event) => {
        const val = event.target.value;
        validateNumber(val);
        if (value === undefined) setInternalValue(val); // sólo en modo no controlado
        if (onValueChange) onValueChange(val);
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
                value={currentValue}
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
