import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuotationPage from "./pages/quotationPage";
import SuccessPage from "./pages/successPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuotationPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
