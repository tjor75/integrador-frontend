import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalContext } from "./context/GlobalContext";
import * as userService from "./services/user-service";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventPage from "./pages/EventPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import NoEncontradoPage from "./pages/NoEncontradoPage";
import "./App.css";

function App() {
    const [jwtToken, setJwtToken] = useState(userService.getSavedJwtToken());
    const [currentUser, setCurrentUser] = useState(userService.getSavedCurrentUser());
    const [goBackAfterLogin, setGoBackAfterLogin] = useState(false);
    
    useEffect(() => {
        if (jwtToken)
            userService.getSavedJwtToken(jwtToken);
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
        <GlobalContext.Provider value={{ jwtToken, setJwtToken, currentUser, setCurrentUser, goBackAfterLogin, setGoBackAfterLogin }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index                    element={<HomePage />} />
                        <Route path="/login"            element={<LoginPage />} />
                        <Route path="/register"         element={<RegisterPage />} />
                        <Route path="/event/:id"        element={<EventPage />} />
                        <Route path="/event/:id/create" element={<CreateEventPage />} />
                        <Route path="/event/:id/edit"   element={<EditEventPage />} />
                        <Route path="*"                 element={<NoEncontradoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </GlobalContext.Provider>
    )
}

export default App
