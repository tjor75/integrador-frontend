import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalContext } from "./context/GlobalContext";
import * as userService from "./services/user-service";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventPage from "./pages/EventPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import NoEncontradoPage from "./pages/NoEncontradoPage";
import EventLocationsPage from "./pages/EventLocationsPage";
import "./App.css";

function App() {
    const [jwtToken, setJwtToken] = useState(userService.getSavedJwtToken());
    const [currentUser, setCurrentUser] = useState(userService.getSavedCurrentUser());
    const [title, setTitle] = useState("Eventos para hacer");

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

    useEffect(() => {
        document.title = `${title} - Mileventos`;
    }, [title]);

    return (
        <GlobalContext.Provider value={{ jwtToken, setJwtToken, currentUser, setCurrentUser, title, setTitle }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index                    element={<HomePage />} />
                        <Route path="/events"           element={<EventsPage />} />
                        <Route path="/login"            element={<LoginPage />} />
                        <Route path="/register"         element={<RegisterPage />} />
                        <Route path="/event/:id"        element={<EventPage />} />
                        <Route path="/event/create"     element={<CreateEventPage />} />
                        <Route path="/event/:id/edit"   element={<EditEventPage />} />
                        <Route path="/event-locations"  element={<EventLocationsPage />} />
                        <Route path="*"                 element={<NoEncontradoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </GlobalContext.Provider>
    )
}

export default App
