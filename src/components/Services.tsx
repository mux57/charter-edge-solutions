import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Building2, 
  Calculator, 
  TrendingUp, 
  Shield, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Services = () => {
  const serviceCategories = [
    {
      icon: FileText,
      title: "Tax & Compliance Services",
      description: "Complete tax solutions for individuals and businesses",
      services: [
        "ITR Filing (Individuals, Firms, Companies)",
        "GST Registration & Filing",
        "TDS Return Filing",
        "Advance Tax Calculation & Payment",
        "Income Tax Notice Handling",
        "PAN & TAN Application",
        "Form 15CA/CB for Foreign Remittance"
      ],
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Building2,
      title: "Business & Audit Services", 
      description: "Professional business setup and audit solutions",
      services: [
        "Company Incorporation (Pvt Ltd, LLP, OPC)",
        "Partnership Firm Registration",
        "ROC Compliance & Annual Returns",
        "Accounting & Bookkeeping Services",
        "Statutory Audits",
        "Internal Audit",
        "GST Audit",
        "MIS Reporting"
      ],
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: TrendingUp,
      title: "Consulting & Advisory",
      description: "Strategic financial guidance for growth",
      services: [
        "Business Setup Advisory",
        "Tax Planning for HNIs",
        "Virtual CFO Services",
        "Investment Declarations & Payroll",
        "Financial Projections & Budgeting",
        "NRI Tax Services",
        "Trust & Society Registration",
        "Loan & Project Report Preparation"
      ],
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Professional Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive financial and business services tailored to meet your specific needs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth group">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-smooth`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2 text-foreground">
                    {category.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{service}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="professional" 
                    className="w-full mt-6 group/btn"
                    onClick={scrollToContact}
                  >
                    Get Quote
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Why Choose Us */}
          <Card className="bg-gradient-primary text-white shadow-elegant">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-6">Why Choose Our Services?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                  <Shield className="w-12 h-12 mb-3 text-yellow-300" />
                  <h4 className="font-semibold mb-2">100% Compliance</h4>
                  <p className="text-white/90 text-sm">
                    Ensuring complete adherence to all regulations and deadlines
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="w-12 h-12 mb-3 text-yellow-300" />
                  <h4 className="font-semibold mb-2">Personal Attention</h4>
                  <p className="text-white/90 text-sm">
                    Dedicated support and customized solutions for each client
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <Calculator className="w-12 h-12 mb-3 text-yellow-300" />
                  <h4 className="font-semibold mb-2">Expert Knowledge</h4>
                  <p className="text-white/90 text-sm">
                    Stay updated with latest tax laws and business regulations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;