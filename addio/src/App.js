import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainPage";
import AdminCreateMaterialPage from "./pages/AdminCreateMaterialPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/Admin" element={<AdminCreateMaterialPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
