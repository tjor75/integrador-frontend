import { useEffect, useState } from "react";
import { getGravatarUrl } from "../../../utils/gravatar.js";

export default function Gravatar({ firstName, lastName, username }) {   
    const [gravatarUrl, setGravatarUrl] = useState(null);

    useEffect(() => {
        const fetchGravatar = async () => {
            try {
                setGravatarUrl(await getGravatarUrl(username));
            } catch (error) {
                console.error("Error fetching gravatar:", error);
            }
        };
        fetchGravatar();
    }, [username]);
    
    return (
        <div className="avatar avatar-sm" data-initial={firstName.charAt(0) + lastName.charAt(0)}>
            {gravatarUrl && <img src={gravatarUrl} alt="Gravatar" />}
        </div>
    );
}