import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NoEncontradoPage from './pages/NoEncontradoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NoEncontradoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
