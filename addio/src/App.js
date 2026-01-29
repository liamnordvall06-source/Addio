import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainPage";
import ConfigurePage from "./pages/configurePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/configure" element={<ConfigurePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
