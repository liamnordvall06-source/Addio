import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainPage";
import ConfigurePage from "./pages/configurePage";
import QuotationPage from "./pages/quotationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/configure" element={<ConfigurePage />} />
        <Route path="/quote" element={<QuotationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
