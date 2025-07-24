import { Button } from "@/components/ui/button";
import { Menu, Phone, Mail, Calendar } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">CA Professional</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {isHomePage ? (
              <>
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-foreground hover:text-primary transition-smooth"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-foreground hover:text-primary transition-smooth"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-foreground hover:text-primary transition-smooth"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-foreground hover:text-primary transition-smooth"
                >
                  Contact
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="text-foreground hover:text-primary transition-smooth"
              >
                Home
              </button>
            )}
            <button
              onClick={() => navigate('/meetings')}
              className="text-foreground hover:text-primary transition-smooth flex items-center gap-2"
            >
              <Calendar size={16} />
              Meetings
            </button>
            <button
              onClick={() => navigate('/testimonial-demo')}
              className="text-foreground hover:text-primary transition-smooth"
            >
              Demo
            </button>
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </div>
            <Button
              variant="hero"
              size="sm"
              onClick={() => navigate('/meetings')}
            >
              Schedule Meeting
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;