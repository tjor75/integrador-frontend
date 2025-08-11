import ErrorGuy from "../../components/UI/ErrorGuy";

export default function NoEncontradoPage() {
    return (
        <main>
            <div className="center-page-container">
                <ErrorGuy />
                <h1>404</h1>
                <p>Page not found</p>
            </div>
        </main>
    )
}