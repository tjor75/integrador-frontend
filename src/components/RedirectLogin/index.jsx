import { useEffect } from "react";
import useLoginRedirect from "../../hooks/useLoginRedirect";

export default function RedirectLogin() {
    const loginRedirect = useLoginRedirect();
    useEffect(() => {
        loginRedirect();
    }, [loginRedirect]);
    return <></>;
}