import { HashRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./utils/store.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import Curso from "./pages/Curso.jsx";
import Calculadora from "./pages/Calculadora.jsx";
import "./styles/index.css";

export default function App() {
  return (
    <DataProvider>
      <HashRouter>
        <div className="app-shell">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/curso/:cicloId/:cursoId" element={<Curso />} />
            <Route path="/calculadora/:cicloId/:cursoId" element={<Calculadora />} />
          </Routes>
        </div>
      </HashRouter>
    </DataProvider>
  );
}
