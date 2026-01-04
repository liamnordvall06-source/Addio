import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConfigurePage from './pages/configurePage';
import MainPage from './pages/mainPage';

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
