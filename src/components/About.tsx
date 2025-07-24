import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Briefcase, GraduationCap, Star } from "lucide-react";

const About = () => {
  const achievements = [
    "Chartered Accountant (ICAI)",
    "10+ Years Experience",
    "Tax & Audit Specialist",
    "Business Consultant"
  ];

  const values = [
    {
      icon: CheckCircle,
      title: "Transparency",
      description: "Clear communication and honest advice in all our dealings"
    },
    {
      icon: Briefcase,
      title: "Reliability", 
      description: "Timely delivery and consistent quality in every service"
    },
    {
      icon: Star,
      title: "Excellence",
      description: "Committed to delivering the highest standard of professional service"
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              About Me
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dedicated to providing expert financial guidance and ensuring complete compliance for your business success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">
                Professional Background
              </h3>
              
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                As a qualified Chartered Accountant with over a decade of experience, I specialize in 
                providing comprehensive financial services to individuals and businesses across various industries.
              </p>
              
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                My mission is to simplify complex financial matters and ensure that my clients remain 
                compliant while maximizing their financial potential. I believe in building long-term 
                relationships based on trust, transparency, and exceptional service delivery.
              </p>

              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {achievement}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {values.map((value, index) => (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <value.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2 text-foreground">
                          {value.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Client Testimonial */}
          <Card className="bg-accent border-2 border-primary/20 shadow-elegant">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg italic text-foreground mb-4">
                  "Professional, reliable, and always available when needed. The best CA I've worked with 
                  for my business compliance and tax planning needs."
                </blockquote>
                <cite className="text-muted-foreground font-medium">
                  — Satisfied Business Client
                </cite>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;