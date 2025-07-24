import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Professional Chartered Accountant Office" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Helping You Stay{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100">
              Tax Compliant
            </span>{" "}
            and Financially Sound
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Professional Chartered Accountant services for individuals and businesses. 
            Expert guidance for tax filing, GST compliance, business setup, and financial consulting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="text-lg px-8 py-6"
            >
              Book Free Consultation
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button 
              variant="professional" 
              size="lg"
              onClick={() => scrollToSection('services')}
              className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
            >
              View Services
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center space-x-2">
              <Award size={20} className="text-yellow-300" />
              <span>Chartered Accountant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={20} className="text-yellow-300" />
              <span>500+ Satisfied Clients</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-yellow-300" />
              <span>100% Compliance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;