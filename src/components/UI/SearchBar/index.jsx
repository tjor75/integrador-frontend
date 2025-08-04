import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./SearchBar.css";

export default function SearchBar() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const nameParam = searchParams.get("name") || "";
        setName(nameParam);
    }, [searchParams]);

    const handleSearch = (event) => {
        event.preventDefault();
        const startDate = searchParams.get("start_date") || null;
        const tag = searchParams.get("tag") || null;

        const newParams = new URLSearchParams(searchParams);
        newParams.set("name", name);

        if (startDate)  newParams.set("start_date", startDate);
        else            newParams.delete("start_date");

        if (tag)        newParams.set("tag", tag);
        else            newParams.delete("tag");

        navigate("/?" + newParams.toString());
    }


    return (
        <div className="search-bar">
            <button className="btn btn-primary">
                <i className="icon icon-search" />
            </button>
            <form className="input-group" onSubmit={handleSearch}>
                <input
                    className="form-input"
                    type="text"
                    name="name"
                    placeholder="Buscar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                <button className="btn btn-primary input-group-btn">Search</button>
            </form>
        </div>
    )
}