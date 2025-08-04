export default function Form({ title, error, onSubmit, setValidInputs, children }) {    
    const handleSubmit = (event) => {
        event.preventDefault();

        setValidInputs(prevValidInputs => {
            const newValidInputs = { ...prevValidInputs };
            for (const key of Object.keys(newValidInputs)) {
                if (newValidInputs[key] === null)
                    newValidInputs[key] = false;
            }
            return newValidInputs;
        });

        onSubmit(event);
    };
    
    return (
        <form className="card" onSubmit={handleSubmit}>
            <h1>{title}</h1>
            {error && (
                <div className="toast toast-error text-center">
                    <b>Error:</b> {error}
                </div>
            )}
            {children}
        </form>
    );
}