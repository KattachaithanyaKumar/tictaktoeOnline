import { BrowserRouter, Route, Routes } from "react-router-dom"
import Auth from "./Pages/Auth"
import Game from "./Pages/Game"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App