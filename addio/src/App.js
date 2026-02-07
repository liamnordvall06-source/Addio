import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuotationPage from "./pages/quotationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuotationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
