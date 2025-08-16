import { Link } from "react-router-dom";
import FullPageError from "../../components/UI/FullPageError";

export default function NoEncontradoPage() {
    return (
        <main>
            <FullPageError title="404">
                <p>P&aacute;gina no encontrada... No hay mucho m&aacute;s que hacer aqu&iacute;</p>
                <Link to="/" className="btn btn-primary">
                    Ir a la p&aacute;gina principal
                </Link>
            </FullPageError>
        </main>
    )
}