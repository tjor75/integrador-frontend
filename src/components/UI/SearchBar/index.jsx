import { Form } from "react-router-dom";

export default function SearchBar() {
    return (
        <form className="input-group input-inline" action="/events" method="get">
            <input className="form-input" type="text" name="name" placeholder="Teatro..." />
            <button className="btn btn-primary input-group-btn">Search</button>
        </form>
    )
}