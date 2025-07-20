import "./GoUpButton.css";

export default function GoUpButton() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button className="btn btn-action s-circle go-up-button" onClick={scrollToTop}>
            <i className="icon icon-arrow-up"></i>
        </button>
    );
}