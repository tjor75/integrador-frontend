export default function Form({ className, title=null, error, onSubmit, setValidInputs, children, ...rest }) {    
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
        <form className={className} onSubmit={handleSubmit} {...rest}>
            {title && <h1>{title}</h1>}
            {error && (
                <div className="bg-error text-center">
                    <b>Error:</b> {error}
                </div>
            )}
            {children}
        </form>
    );
}