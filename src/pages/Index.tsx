import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Services />
      <TestimonialsSection />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
