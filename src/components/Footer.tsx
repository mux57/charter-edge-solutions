import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin,
  Instagram
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    "ITR Filing",
    "GST Registration", 
    "Company Incorporation",
    "Tax Planning",
    "Business Audit",
    "NRI Services"
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">CA Professional</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Your trusted partner for all tax, compliance, and business advisory needs. 
              Ensuring financial success through expert guidance.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <Button key={index} variant="ghost" size="icon" className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  <Icon size={18} />
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Popular Services</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-smooth"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Navigation</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", id: "home" },
                { label: "About", id: "about" },
                { label: "Services", id: "services" },
                { label: "Contact", id: "contact" }
              ].map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={() => scrollToSection(item.id)}
                    className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-smooth"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Get In Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone size={16} className="text-primary-foreground/60" />
                <span className="text-primary-foreground/80">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail size={16} className="text-primary-foreground/60" />
                <span className="text-primary-foreground/80">contact@caprofessional.com</span>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin size={16} className="text-primary-foreground/60 mt-0.5" />
                <span className="text-primary-foreground/80">
                  Business District<br />
                  Your City, State 000000
                </span>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => scrollToSection('contact')}
              className="mt-4"
            >
              Book Consultation
            </Button>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/60 text-sm">
              © {currentYear} CA Professional. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-smooth">
                Privacy Policy
              </button>
              <button className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-smooth">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;