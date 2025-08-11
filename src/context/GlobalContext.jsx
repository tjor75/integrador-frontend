import { useEffect, useState, createContext } from "react";
import * as userService from "../services/user-service";

export const globalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [jwtToken, setJwtToken] = useState(userService.getSavedJwtToken());
    const [currentUser, setCurrentUser] = useState(userService.getSavedCurrentUser());
    const [goBackAfterLogin, setGoBackAfterLogin] = useState(false);

    useEffect(() => {
        if (jwtToken)
            userService.saveJwtToken(jwtToken);
        else
            userService.removeSavedJwtToken();
    }, [jwtToken]);

    useEffect(() => {
        if (currentUser)
            userService.saveCurrentUser(currentUser);
        else
            userService.removeSavedCurrentUser();
    }, [currentUser]);

    return (
        <globalContext.Provider value={{ jwtToken, setJwtToken, currentUser, setCurrentUser, goBackAfterLogin, setGoBackAfterLogin }}>
            {children}
        </globalContext.Provider>
    );
};