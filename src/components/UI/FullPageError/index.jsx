import "./FullPageError.css";
import ErrorGuy from "../../../assets/img/error-guy.png";

export default function FullPageError({ title, children }) {
    return (
        <div className="center-page-container">
            <img className="error-guy" src={ErrorGuy} />
            <h1>{title}</h1>
            {children}
        </div>
    )
}