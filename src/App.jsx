import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GlobalContext } from './context/GlobalContext'
import { getSavedJwtToken, saveJwtToken, getSavedCurrentUser, saveCurrentUser } from './services/user-service'
import Layout from './pages/Layout'
import HomePage from './pages/HomePage'
import NoEncontradoPage from './pages/NoEncontradoPage'
import LoginPage from './pages/LoginPage'
import './App.css'

function App() {
    const [jwtToken, setJwtToken] = useState(getSavedJwtToken());
    const [currentUser, setCurrentUser] = useState(getSavedCurrentUser());
    
    useEffect(() => saveJwtToken(jwtToken), [jwtToken]);
    useEffect(() => saveCurrentUser(currentUser), [currentUser]);
    
    return (
        <GlobalContext.Provider value={{ jwtToken, setJwtToken, currentUser, setCurrentUser }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index          element={<HomePage />} />
                        <Route path="/login"  element={<LoginPage />} />
                        <Route path="*"       element={<NoEncontradoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </GlobalContext.Provider>
    )
}

export default App
