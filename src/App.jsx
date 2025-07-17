import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GlobalContext } from './context/GlobalContext'
import Layout from './pages/Layout'
import HomePage from './pages/HomePage'
import NoEncontradoPage from './pages/NoEncontradoPage'
import './App.css'
import LoginPage from './pages/LoginPage'

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <GlobalContext.Provider value={{ currentUser, setCurrentUser }}>
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
