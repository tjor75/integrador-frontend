import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import Form from "../../components/Form";
import TextInput from "../../components/UI/TextInput";
import TextAreaInput from "../../components/UI/TextAreaInput";

export default function CreateEventPage() {
    const { jwtToken } = useContext(GlobalContext);
    const [error, setError] = useState(null);
    const [validInputs, setValidInputs] = useState({
        username: null,
        password: null
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    return (
        <main>
            <Form title="Crear evento" onSubmit={handleSubmit}>
                <TextInput
                    name="name"
                    title="Nombre del evento"
                    placeholder="Festival de rock"
                    validInputs={validInputs}
                    setValidInputs={setValidInputs} />

                <TextAreaInput
                    name="description"
                    title="Descripción"
                    placeholder="Un festival de rock con las mejores bandas del momento."
                    validInputs={validInputs}
                    setValidInputs={setValidInputs} />

                
            </Form>
        </main>
    );
}