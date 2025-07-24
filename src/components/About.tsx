import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfessionalAvatar } from "@/components/ProfessionalAvatar";
import {
  CheckCircle,
  Briefcase,
  GraduationCap,
  Star,
  TrendingUp,
  Shield,
  Award,
  Users,
  Building,
  Calculator,
  FileText,
  Target,
  Zap,
  Crown
} from "lucide-react";
import { useState, useEffect } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    clients: 0,
    savings: 0,
    experience: 0,
    success: 0
  });

  useEffect(() => {
    setIsVisible(true);

    // Animate statistics
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      const targets = {
        clients: 500,
        savings: 50,
        experience: 15,
        success: 98
      };

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        setAnimatedStats({
          clients: Math.floor(targets.clients * progress),
          savings: Math.floor(targets.savings * progress),
          experience: Math.floor(targets.experience * progress),
          success: Math.floor(targets.success * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setAnimatedStats(targets);
        }
      }, stepDuration);
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  const achievements = [
    { icon: Crown, text: "Chartered Accountant (ICAI)", color: "text-yellow-600" },
    { icon: Award, text: "15+ Years Elite Experience", color: "text-blue-600" },
    { icon: Shield, text: "Tax Optimization Expert", color: "text-green-600" },
    { icon: TrendingUp, text: "Business Growth Strategist", color: "text-purple-600" },
    { icon: Building, text: "Corporate Finance Specialist", color: "text-indigo-600" },
    { icon: Target, text: "IPO & M&A Advisor", color: "text-red-600" }
  ];

  const professionalHistory = [
    {
      year: "2024",
      title: "Managing Partner & Senior Financial Strategist",
      company: "Elite CA Practice",
      description: "Leading a premium practice serving 500+ high-net-worth clients and Fortune 500 companies. Specialized in complex tax structuring, international compliance, and strategic financial planning.",
      achievements: ["₹50+ Crore tax savings for clients", "15+ successful IPO consultations", "200+ business restructuring projects"],
      icon: Crown,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      year: "2020",
      title: "Founder & Principal Consultant",
      company: "Independent Practice",
      description: "Established boutique CA firm focusing on high-value clients in technology, manufacturing, and real estate sectors. Built reputation for innovative tax strategies and regulatory expertise.",
      achievements: ["300% client growth in 4 years", "₹25+ Crore in client tax optimization", "100% audit success rate"],
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      year: "2018",
      title: "Senior Manager - Big 4 Consulting",
      company: "Global Accounting Firm",
      description: "Led high-stakes audit and advisory teams for multinational corporations, IPO preparations, and complex M&A transactions. Specialized in regulatory compliance and risk management.",
      achievements: ["Led 50+ major audits", "₹500+ Crore transaction advisory", "Zero compliance violations"],
      icon: Building,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      year: "2014",
      title: "Chartered Accountant Qualification",
      company: "Institute of Chartered Accountants of India",
      description: "Qualified as CA with All India Rank in Advanced Auditing and Assurance. Specialized in international taxation, corporate law, and financial management.",
      achievements: ["All India Rank holder", "Gold medalist in taxation", "Research publication in ICAI journal"],
      icon: GraduationCap,
      gradient: "from-green-500 to-teal-500"
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
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200">
                Elite Financial Expertise
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Your Trusted <span className="gradient-text">Financial Strategist</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Transforming businesses through strategic financial planning, tax optimization, and regulatory excellence.
              <span className="font-semibold text-blue-600">Trusted by 500+ clients</span> to maximize wealth and ensure compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Professional Image */}
            <div className={`flex justify-center ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <ProfessionalAvatar size="xl" showBadges={true} className="animate-float" />
            </div>

            <div className={`${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <h3 className="text-3xl font-bold mb-6 text-foreground gradient-text">
                Elite Financial Expertise
              </h3>

              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                As a distinguished Chartered Accountant with over 15 years of elite experience, I specialize in
                high-value financial strategies, complex tax optimization, and strategic business consulting for
                Fortune 500 companies and high-net-worth individuals.
              </p>

              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                My mission is to maximize your wealth through innovative financial structures while ensuring
                complete regulatory compliance. I've helped clients save over ₹50 crores in taxes and
                successfully guided 15+ companies through IPO processes.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-white to-gray-50 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover-lift ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md">
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-800">{achievement.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">{animatedStats.clients}+</div>
                <div className="text-sm font-medium text-blue-700">Happy Clients</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">₹{animatedStats.savings}Cr+</div>
                <div className="text-sm font-medium text-green-700">Tax Savings</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">{animatedStats.experience}+</div>
                <div className="text-sm font-medium text-purple-700">Years Experience</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-2">{animatedStats.success}%</div>
                <div className="text-sm font-medium text-orange-700">Success Rate</div>
              </div>
            </div>

            {/* Values Section */}
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
            <h3 className="text-3xl font-bold mb-12 text-center text-foreground">
              Elite Professional Journey
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>

              <div className="space-y-8">
                {professionalHistory.map((item, index) => (
                  <div
                    key={index}
                    className={`relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${(index + 6) * 200}ms` }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-6 w-4 h-4 rounded-full bg-white border-4 border-blue-500 shadow-lg"></div>

                    <Card className="ml-16 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${item.gradient}`}></div>
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${item.gradient} text-white shadow-lg`}>
                              <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-blue-600 mb-1">{item.year}</div>
                              <h4 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h4>
                              <div className="text-sm font-medium text-gray-600">{item.company}</div>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed">{item.description}</p>

                        <div className="space-y-2">
                          <h5 className="font-semibold text-gray-900 mb-3">Key Achievements:</h5>
                          <div className="grid gap-2">
                            {item.achievements.map((achievement, achIndex) => (
                              <div key={achIndex} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Optimize Your Financial Future?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join 500+ successful clients who trust me with their financial growth.
              Let's discuss how I can help maximize your wealth and ensure complete compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Schedule Free Consultation
              </button>
              <button
                onClick={() => {
                  const servicesSection = document.getElementById('services');
                  servicesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold"
              >
                View Services
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-pulse-gentle {
          animation: pulse 3s ease-in-out infinite;
        }

        /* Hover effects */
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Timeline animations */
        .timeline-item {
          opacity: 0;
          transform: translateX(-50px);
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .timeline-item:nth-child(even) {
          transform: translateX(50px);
          animation: slideInRight 0.8s ease-out forwards;
        }

        /* Statistics counter animation */
        .stat-counter {
          font-variant-numeric: tabular-nums;
        }

        /* Professional card hover effects */
        .professional-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .professional-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .professional-card:hover::before {
          left: 100%;
        }

        .professional-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .timeline-item {
            transform: translateY(30px);
            animation: fadeInUp 0.8s ease-out forwards;
          }

          .timeline-item:nth-child(even) {
            transform: translateY(30px);
            animation: fadeInUp 0.8s ease-out forwards;
          }
        }
      `}</style>
    </section>
  );
};

export default About;