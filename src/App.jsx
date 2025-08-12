import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
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
    return (
        <GlobalProvider>
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
        </GlobalProvider>
    )
}

export default App
