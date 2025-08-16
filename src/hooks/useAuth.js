import { useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import * as userService from "../services/user-service.js";
import useLoginRedirect from "./useLoginRedirect.js";

const UNAUTHORIZED_STATUS_TEXT   = "Unauthorized";
const EXPIRED_ALERT              = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";

/**
 * Hook de autenticación centralizada.
 * Expone estado, helpers y acciones (login/logout).
 */
export default function useAuth() {
    const { jwtToken, setJwtToken, currentUser, setCurrentUser } = useContext(GlobalContext);
    const [authLoading, setAuthLoading] = useState(false);
    const isAuthenticated = !!currentUser;
    const loginRedirect = useLoginRedirect();

    const login = async (username, password) => {
        /* setAuthLoading(true);
        try { */
            const token = await userService.loginAsync(username, password);
            setJwtToken(token);
            setCurrentUser({ username });
        /*    return true;
        } finally {
            setAuthLoading(false);
        } */
    };

    const logout = async () => {
        /* setAuthLoading(true);
        try { */
            await userService.logoutAsync();
            setJwtToken(null);
            setCurrentUser(null);
        /* } finally {
            setAuthLoading(false);
        } */
    };

    const validateSession = (error) => {
        const result = error.message !== UNAUTHORIZED_STATUS_TEXT;
        if (!result) {
            alert(EXPIRED_ALERT);
            logout();
            loginRedirect();
        }
        return result;
    };

    //const currentUser = ()

    return {
        jwtToken,
        currentUser,
        isAuthenticated,
        authLoading,
        login,
        logout,
        validateSession
    };
}