import { Navbar } from '../components/newlanding/Navbar';
import { Hero } from '../components/newlanding/Hero';
import { MissionVision } from '../components/newlanding/MissionVision';
import { About } from '../components/newlanding/About';
import { AboutUs } from '../components/newlanding/AboutUs';
import { WhoWeServe } from '../components/newlanding/WhoWeServe';
import { HowWeDoIt } from '../components/newlanding/HowWeDoIt';
import { Platform } from '../components/newlanding/Platform';
import { Technology } from '../components/newlanding/Technology';
import { Solutions } from '../components/newlanding/Solutions';
import { WhyCordoba } from '../components/newlanding/WhyCordoba';
import { CTA } from '../components/newlanding/CTA';
import { Footer } from '../components/newlanding/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#BDDEEE]">
      <Navbar />
      <Hero />
      <MissionVision />
      <About />
      <AboutUs />
      <WhoWeServe />
      <HowWeDoIt />
      <Platform />
      <Technology />
      <Solutions />
      <WhyCordoba />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
