import { API_BASE_URL } from "../config/api-config";

export const getSavedJwtToken = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    return jwtToken;
};
export const saveJwtToken = (jwtToken) => {
    localStorage.setItem("jwtToken", jwtToken);
};
const removeSavedJwtToken = () => {
    localStorage.removeItem("jwtToken");
};


export const getSavedCurrentUser = () => {
    const currentUserString = localStorage.getItem("currentUser");
    let currentUser = null;

    if (!currentUserString)
        try {
            currentUser = JSON.parse(currentUserString);
        } catch (error) {
            console.error("Error parsing current user:", error);
        }

    return currentUser;
};
export const saveCurrentUser = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
};
const removeSavedCurrentUser = () => {
    localStorage.removeItem("currentUser");
};


export const loginAsync = async (username, password) => {
    const requestBody = { username, password };
    let response;
    let data;
    let jwtToken = null;

    response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });

    data = await response.json();

    console.log(data.message)

    if (response.ok && data.success)
        jwtToken = data.token;
    else
        throw new Error(data.message);

    return jwtToken;
};
export const logoutAsync = async () => {
    removeSavedJwtToken();
    removeSavedCurrentUser();
};