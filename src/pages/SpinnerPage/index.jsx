import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context/GlobalContext";

export default function SpinnerPage() {
    const { setTitle } = useContext(GlobalContext);

    useEffect(() => {
        setTitle("Loading...");
    }, []);

    return (
        <main>
            <div className="center-page-container">
                <div className="loading loading-lg" />
            </div>
        </main>
    );
}