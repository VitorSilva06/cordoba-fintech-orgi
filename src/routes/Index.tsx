import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
// Importe o componente LandingPage que contém o Header e o PurposeSection
import { LandingPage } from "../pages/LandingPage"; // Ajuste o caminho se necessário


export function AppRoutes(){
    return(
        <Routes>
            {/* Rota principal: A Landing Page deve carregar na raiz (/) */}
            <Route path="/" element={<LandingPage />} /> 
            
            {/* Outra opção para a Landing Page (se não quiser usar a raiz) */}
            <Route path="/landingPage" element={<LandingPage />} />
            
            {/* Páginas do Aplicativo Logado */}
            <Route path="/home" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
        </Routes>
    )
}