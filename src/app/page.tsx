import HeroSection from "@/components/layout/HeroSection";
import Navbar from "@/components/layout/Navbar";


export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />

      {/* Placeholder for remaining sections */}
      <div className="h-[200vh] bg-linear-to-b from-[#F7FCF9] to-white" />
    </main>
  );
}