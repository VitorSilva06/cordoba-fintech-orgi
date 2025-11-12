import { AboutCordobaSection } from "../components/landingpage/AboutCordobaSection";
import { AboutUsCordobaSection } from "../components/landingpage/AboutUsCordobaSection";
import { ComoFazemosSection } from "../components/landingpage/ComoFazemosSection";
import { ContatoSession } from "../components/landingpage/ContatoSession";
import { DadosContatoCircularSection } from "../components/landingpage/DadosContatoCircularSection";
import { FooterLP } from "../components/landingpage/FooterLP";
import { Header } from "../components/landingpage/Header";
import { HeroSection } from "../components/landingpage/HeroSection"; 
import { NichosSection } from "../components/landingpage/NichosSection";
import { PlataformaCordobaSection } from "../components/landingpage/PlataformaCordobaSection";
import { PorQueContarComCordobaSection } from "../components/landingpage/PorQueContarComCordobaSection";
import { PurposeSection } from "../components/landingpage/PurposeSection";
import { TecnologiaGovernancaSection } from "../components/landingpage/TecnologiaGovernancaSection";

export function LandingPage(){
    return(
        <div className="bg-primary-dark font-sans antialiased text-white">
            <Header /> 
            
            <HeroSection /> 
            <PurposeSection />
            <AboutCordobaSection />
            <AboutUsCordobaSection />
            <NichosSection />
            <ComoFazemosSection />
            <PlataformaCordobaSection />
            <TecnologiaGovernancaSection />
            <PorQueContarComCordobaSection />
            <ContatoSession />
            <FooterLP />
            <DadosContatoCircularSection />
        </div>
    );
}

export default LandingPage;