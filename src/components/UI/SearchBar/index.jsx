import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchBar() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const nameParam = searchParams.get("name") || "";
        setName(nameParam);
    }, [searchParams]);

    const handleSearch = (event) => {
        const startDate = searchParams.get("start_date") || null;
        const tag = searchParams.get("tag") || null;
        event.preventDefault();
        navigate("/");
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams);
            newParams.set("name", name);

            if (startDate)  newParams.set("start_date", startDate);
            else            newParams.delete("start_date");

            if (tag)    newParams.set("tag", tag);
            else        newParams.delete("tag");

            return newParams;
        });
    }


    return (
        <form className="input-group input-inline" onSubmit={handleSearch}>
            <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Buscar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            {/*<button className="btn btn-primary input-group-btn">Search</button>*/}
        </form>
    )
}