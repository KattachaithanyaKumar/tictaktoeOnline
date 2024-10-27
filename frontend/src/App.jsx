import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./Pages/Auth";
import Game from "./Pages/Game";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/game/:roomId" element={<Game />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
};

export default App;
