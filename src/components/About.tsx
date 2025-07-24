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

  const professionalHistory = [
    {
      year: "2024",
      title: "Senior Financial Consultant",
      description: "Expanded practice to serve 200+ clients across multiple industries"
    },
    {
      year: "2020",
      title: "Established Independent Practice",
      description: "Founded comprehensive CA practice specializing in SME sector"
    },
    {
      year: "2018",
      title: "Senior Associate - Big 4 Firm",
      description: "Led audit teams for multinational corporations and IPO preparations"
    },
    {
      year: "2014",
      title: "Chartered Accountant Qualification",
      description: "Qualified as CA from ICAI with distinction in advanced auditing"
    }
  ];

  const testimonials = [
    {
      text: "Professional, reliable, and always available when needed. The best CA I've worked with for my business compliance and tax planning needs.",
      author: "Satisfied Business Client",
      rating: 5
    },
    {
      text: "Exceptional service in handling our company's IPO preparation. Their attention to detail and regulatory knowledge was invaluable.",
      author: "Tech Startup Founder",
      rating: 5
    },
    {
      text: "Helped save our company significant tax liabilities through strategic planning. Highly recommend their expertise.",
      author: "Manufacturing Business Owner",
      rating: 5
    }
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

          {/* Professional History Timeline */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 text-center text-foreground">
              Professional Journey
            </h3>
            <div className="grid gap-6">
              {professionalHistory.map((item, index) => (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">{item.year}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2 text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Client Testimonials */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-center text-foreground">
              What My Clients Say
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-accent border-2 border-primary/20 shadow-elegant">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-sm italic text-foreground mb-4">
                        "{testimonial.text}"
                      </blockquote>
                      <cite className="text-muted-foreground font-medium text-sm">
                        — {testimonial.author}
                      </cite>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;