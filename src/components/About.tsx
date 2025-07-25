import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  GraduationCap,
  Star,
  TrendingUp,
  Shield,
  Award,
  Users,
  Building,
  Target,
  Zap,
  Crown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const achievements = [
    {
      icon: Crown,
      text: "Chartered Accountant (ICAI)",
      subtitle: "All India Rank Holder",
      color: "text-yellow-600",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Award,
      text: "15+ Years Elite Experience",
      subtitle: "Fortune 500 & HNI Clients",
      color: "text-blue-600",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: Shield,
      text: "Tax Optimization Expert",
      subtitle: "₹125Cr+ Client Savings",
      color: "text-green-600",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: TrendingUp,
      text: "M&A Transaction Advisor",
      subtitle: "₹5,000Cr+ Deal Value",
      color: "text-purple-600",
      gradient: "from-purple-400 to-purple-600"
    },
    {
      icon: Building,
      text: "Corporate Finance Specialist",
      subtitle: "Big Four Leadership",
      color: "text-indigo-600",
      gradient: "from-indigo-400 to-indigo-600"
    },
    {
      icon: Target,
      text: "IPO Readiness Consultant",
      subtitle: "25+ Successful Listings",
      color: "text-red-600",
      gradient: "from-red-400 to-red-600"
    }
  ];

  const professionalHistory = [
    {
      year: "2024",
      title: "Managing Partner & Chief Financial Strategist",
      company: "Elite Wealth Advisory Group",
      description: "Led a team of 20+ consultants to develop cross-border tax frameworks, reducing client liability by 18%. Spearheaded India's premier boutique financial advisory practice, exclusively serving ultra-high-net-worth individuals and Fortune 500 corporations.",
      achievements: [
        "Generated ₹125+ Crore in verified tax savings across client portfolio",
        "Successfully guided 25+ IPO processes worth ₹2,500+ Crore",
        "Structured 40+ M&A deals totaling ₹5,000+ Crore in transaction value",
        "Maintained 100% regulatory compliance across 500+ client audits"
      ],
      tools: "TaxTech Pro, SAP-FICO, Bloomberg Terminal, IFRS Analytics, AI Audit Tools",
      metrics: {
        clients: "500+",
        savings: "₹125Cr+",
        transactions: "₹5,000Cr+",
        success: "100%"
      },
      icon: Crown,
      gradient: "from-yellow-500 to-orange-500",
      prestigeLevel: "Elite",
      companyUrl: "#"
    },
    {
      year: "2020",
      title: "Founder & Principal Tax Strategist",
      company: "Strategic Financial Solutions",
      description: "Founded and scaled specialized consultancy, achieving 400% client growth in 4 years. Pioneered AI-powered tax optimization frameworks for technology unicorns, reducing their effective tax rates by 15-25%.",
      achievements: [
        "Built client base from 0 to 120+ with zero churn rate",
        "Delivered ₹75+ Crore in tax optimization for tech startups",
        "Structured tax-efficient exits for 15+ startup founders",
        "Developed proprietary tax modeling software adopted by 50+ firms"
      ],
      tools: "Python, TaxCalc AI, GSTN API, Advanced Excel, Power BI, Blockchain Analytics",
      metrics: {
        growth: "400%",
        optimization: "₹75Cr+",
        exits: "15+",
        record: "Perfect"
      },
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500",
      prestigeLevel: "Premium",
      companyUrl: "#"
    },
    {
      year: "2016",
      title: "Senior Director - Transaction Advisory",
      company: "Big Four Global Consulting",
      description: "Managed high-stakes M&A advisory for multinational corporations, leading due diligence teams of 15+ professionals. Structured complex cross-border transactions worth ₹1,500+ Crore with 35% faster completion rates.",
      achievements: [
        "Orchestrated 75+ major corporate audits for listed companies",
        "Advised on ₹1,500+ Crore in cross-border M&A transactions",
        "Led IPO preparations for 12 companies with 100% success rate",
        "Reduced transaction timelines by 35% through process innovation"
      ],
      tools: "VDR Systems, Merger Model Pro, Due Diligence AI, IFRS Suite, CaseWare",
      metrics: {
        audits: "75+",
        advisory: "₹1,500Cr+",
        ipos: "12",
        violations: "Zero"
      },
      icon: Building,
      gradient: "from-purple-500 to-pink-500",
      prestigeLevel: "Corporate",
      companyUrl: "#"
    },
    {
      year: "2014",
      title: "Chartered Accountant - All India Rank Holder",
      company: "Institute of Chartered Accountants of India",
      description: "Achieved All India Rank 15 in CA Final examinations, specializing in Advanced Auditing and International Taxation. Published groundbreaking research on cross-border tax optimization adopted by 25+ consulting firms.",
      achievements: [
        "Secured All India Rank 15 in CA Final examinations",
        "Earned Gold Medal in Advanced Auditing & Assurance",
        "Published research on 'Cross-border Tax Optimization'",
        "Selected for ICAI's prestigious Young Leaders Program"
      ],
      tools: "Advanced Auditing Standards, International Tax Codes, Research Analytics, Academic Publishing",
      metrics: {
        rank: "AIR 15",
        medal: "Gold",
        research: "Published",
        program: "Selected"
      },
      icon: GraduationCap,
      gradient: "from-green-500 to-teal-500",
      prestigeLevel: "Academic",
      companyUrl: "https://icai.org"
    }
  ];

  const testimonials = [
    {
      quote: "Exceptional strategic guidance that saved our company ₹15 crores in tax optimization. His expertise in cross-border transactions is unmatched.",
      author: "Rajesh Kumar",
      position: "CEO, TechVenture Solutions",
      company: "Fortune 500 Technology Company",
      rating: 5,
      featured: true
    },
    {
      quote: "Led our IPO process flawlessly, ensuring 100% compliance and optimal valuation. A true professional who delivers beyond expectations.",
      author: "Priya Sharma",
      position: "CFO, GreenEnergy Corp",
      company: "Renewable Energy Sector",
      rating: 5,
      featured: false
    },
    {
      quote: "His innovative tax structures for our M&A deals resulted in significant savings. Highly recommend for complex financial advisory needs.",
      author: "Michael Chen",
      position: "Managing Director",
      company: "Global Investment Fund",
      rating: 5,
      featured: false
    },
    {
      quote: "Transformed our compliance framework, reducing audit time by 60% while maintaining zero violations. Outstanding professional expertise.",
      author: "Dr. Anita Desai",
      position: "Board Member & Former CFO",
      company: "Healthcare Conglomerate",
      rating: 5,
      featured: false
    },
    {
      quote: "His cross-border structuring expertise helped us expand globally with optimal tax efficiency. Saved us millions in the process.",
      author: "James Wilson",
      position: "International Finance Director",
      company: "Manufacturing Giant",
      rating: 5,
      featured: false
    }
  ];

  // Carousel state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const clientLogos = [
    { name: "TechCorp", industry: "Technology" },
    { name: "FinanceMax", industry: "Banking" },
    { name: "GreenEnergy", industry: "Renewable" },
    { name: "MedTech", industry: "Healthcare" },
    { name: "AutoDrive", industry: "Automotive" },
    { name: "RetailPlus", industry: "E-commerce" },
    { name: "EduTech", industry: "Education" },
    { name: "RealEstate", industry: "Property" }
  ];

  const values = [
    {
      icon: CheckCircle,
      title: "Transparency",
      description: "Clear communication and honest advice",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Reliability",
      description: "Timely delivery and consistent quality",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Star,
      title: "Excellence",
      description: "Highest professional standards",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Integrity",
      description: "Ethical standards and conduct",
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="about" className="pt-12 pb-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 1. Introduction / About Me */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-6">
              Elite Chartered Accountant & Strategic Financial Advisor for HNIs & Corporates
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Delivering <span className="font-bold text-green-700">₹125 Cr+ in savings</span> & guiding
              <span className="font-bold text-blue-700"> 25+ IPOs</span> with 15+ years of experience serving
              <span className="font-bold text-purple-700"> 500+ clients</span> across various industries.
            </p>
          </div>

          {/* Quick Credentials Badge Panel */}
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: "ICAI Rank", value: "AIR 15", icon: GraduationCap, color: "from-green-500 to-emerald-600" },
                { label: "Clients Served", value: "500+", icon: Users, color: "from-blue-500 to-cyan-600" },
                { label: "Tax Savings", value: "₹125Cr+", icon: TrendingUp, color: "from-green-500 to-teal-600" },
                { label: "IPOs Guided", value: "25+", icon: Crown, color: "from-purple-500 to-pink-600" }
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`text-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl card-hover ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <badge.icon className="w-6 h-6 text-white card-icon" />
                  </div>
                  <div className="font-bold text-xl text-gray-900 mb-1">{badge.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{badge.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16"></div>

          {/* 2. Core Services / Expertise */}
          <div className="mb-16 bg-gray-50/50 rounded-3xl p-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4 text-foreground leading-tight">
                Core <span className="gradient-text">Expertise</span>
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg font-normal leading-relaxed">
                Specialized financial services designed for high-net-worth individuals and corporations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Tax Optimization",
                  description: "Strategic tax planning and compliance for maximum savings",
                  icon: Shield,
                  gradient: "from-blue-500 to-blue-600",
                  stats: "₹125Cr+ Saved"
                },
                {
                  title: "IPO Advisory",
                  description: "End-to-end IPO readiness and listing guidance",
                  icon: TrendingUp,
                  gradient: "from-green-500 to-green-600",
                  stats: "25+ IPOs Guided"
                },
                {
                  title: "M&A Advisory",
                  description: "Complex merger and acquisition transaction support",
                  icon: Building,
                  gradient: "from-purple-500 to-purple-600",
                  stats: "₹5,000Cr+ Deals"
                },
                {
                  title: "Financial Structuring",
                  description: "Cross-border and domestic financial structure optimization",
                  icon: Target,
                  gradient: "from-orange-500 to-orange-600",
                  stats: "500+ Structures"
                },
                {
                  title: "Regulatory Compliance",
                  description: "Comprehensive compliance management and risk mitigation",
                  icon: CheckCircle,
                  gradient: "from-teal-500 to-teal-600",
                  stats: "100% Compliance"
                },
                {
                  title: "Strategic Planning",
                  description: "Long-term financial strategy and business planning",
                  icon: Star,
                  gradient: "from-indigo-500 to-indigo-600",
                  stats: "15+ Years Experience"
                }
              ].map((service, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 shadow-lg card-hover service-card ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-4`}>
                    <service.icon className="w-7 h-7 text-white card-icon" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">{service.title}</h4>
                  <p className="text-gray-700 mb-3 leading-relaxed font-normal">{service.description}</p>
                  <div className="text-sm font-semibold text-blue-600">{service.stats}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16"></div>

          {/* 3. Why Work With Me / Differentiators */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4 text-foreground leading-tight">
                Why Choose <span className="gradient-text">Our Expertise</span>
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg font-normal leading-relaxed">
                Unique differentiators that set us apart in the financial advisory landscape
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "All-India Rank Excellence",
                  description: "AIR 15 in ICAI CA Final examinations with Gold Medal in Advanced Auditing",
                  icon: GraduationCap,
                  gradient: "from-yellow-500 to-orange-500",
                  highlight: "Academic Excellence"
                },
                {
                  title: "Zero Churn Consultancy",
                  description: "400% client growth with zero churn rate - testament to exceptional service quality",
                  icon: Users,
                  gradient: "from-green-500 to-emerald-500",
                  highlight: "Client Retention"
                },
                {
                  title: "Cross-Border Expertise",
                  description: "Specialized in complex international tax structures and multi-jurisdiction compliance",
                  icon: Building,
                  gradient: "from-blue-500 to-purple-500",
                  highlight: "Global Reach"
                }
              ].map((differentiator, index) => (
                <div
                  key={index}
                  className={`text-center p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 shadow-lg card-hover ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${differentiator.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <differentiator.icon className="w-8 h-8 text-white card-icon" />
                  </div>
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {differentiator.highlight}
                    </span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">{differentiator.title}</h4>
                  <p className="text-gray-700 leading-relaxed font-normal">{differentiator.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mb-16 py-8">
            <div className="max-w-2xl mx-auto">
              <h4 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                Ready to Optimize Your Financial Strategy?
              </h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get expert guidance tailored to your business needs. Book a free consultation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center cta-buttons">
                <button
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Book Free Consultation
                </button>
                <button
                  onClick={() => {
                    const servicesSection = document.getElementById('services');
                    servicesSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-semibold"
                >
                  View Services
                </button>
              </div>
            </div>
          </div>

          {/* Section Separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16"></div>

          {/* 4. Core Values / Motto & Goals */}
          <div className="mb-16 bg-gray-50/50 rounded-3xl p-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4 text-foreground leading-tight">
                Core <span className="gradient-text">Values</span>
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg font-normal leading-relaxed">
                The fundamental principles that guide our professional practice and client relationships
              </p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className={`group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 shadow-lg min-h-[180px] card-hover ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="p-6 text-center relative overflow-hidden h-full flex flex-col justify-between">
                      {/* Background gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"></div>

                      <div className="relative z-10 flex flex-col items-center">
                        <div className="flex justify-center mb-4">
                          <div className={`p-3 rounded-2xl bg-gradient-to-r ${value.gradient} text-white shadow-md group-hover:scale-105 transition-transform duration-200`}>
                            <value.icon className="w-6 h-6 card-icon" />
                          </div>
                        </div>
                        <h4 className="font-semibold text-lg mb-3 text-foreground group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                          {value.title}
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed font-normal">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>

          {/* Section Separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16"></div>

          {/* 5. Professional Journey / Experience Timeline */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4 text-foreground leading-tight">
                Professional <span className="gradient-text">Journey</span>
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg font-normal leading-relaxed">
                A decade-long journey of excellence, innovation, and transformational impact in financial advisory
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>

              <div className="space-y-6">
                {professionalHistory.map((item, index) => (
                  <div
                    key={index}
                    className={`relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${(index + 6) * 200}ms` }}
                  >
                    {/* Enhanced Timeline dot with year */}
                    <div className="absolute left-4 flex flex-col items-center timeline-dot">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${item.gradient} shadow-lg flex items-center justify-center border-2 border-white`}>
                        <item.icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="mt-2 px-2 py-1 bg-white rounded-lg shadow-md border">
                        <span className="text-xs font-bold text-gray-700">{item.year}</span>
                      </div>
                    </div>

                    <Card className="ml-20 shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-200 border-l-4 border-l-blue-500 overflow-hidden group timeline-card">
                      <div className={`h-3 bg-gradient-to-r ${item.gradient}`}></div>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors duration-200 timeline-title">{item.title}</h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-semibold text-gray-600 italic">{item.company}</span>
                                  {item.companyUrl && (
                                    <a href={item.companyUrl} className="text-blue-500 hover:text-blue-700 transition-colors duration-200">
                                      <Building className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Prestige Level Badge */}
                            <div className="mb-3">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                item.prestigeLevel === 'Elite' ? 'bg-yellow-100 text-yellow-800' :
                                item.prestigeLevel === 'Premium' ? 'bg-blue-100 text-blue-800' :
                                item.prestigeLevel === 'Corporate' ? 'bg-purple-100 text-purple-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {item.prestigeLevel} Level
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 leading-relaxed font-normal timeline-description">{item.description}</p>

                        {/* Tools & Expertise */}
                        {item.tools && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                            <h6 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-2">
                              <Target className="w-4 h-4 text-blue-500" />
                              Tools & Expertise:
                            </h6>
                            <p className="text-xs text-gray-600 leading-relaxed">{item.tools}</p>
                          </div>
                        )}

                        {/* Key achievements with icons */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                            <Award className="w-4 h-4 text-green-500" />
                            Key Achievements:
                          </h5>
                          <div className="grid gap-2">
                            {item.achievements.map((achievement, achIndex) => (
                              <div key={achIndex} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700 leading-relaxed">{achievement}</span>
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

          {/* Section Separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-16"></div>

          {/* 6. Client Success / Trust Builder - Rotating Carousel */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4 text-foreground leading-tight">
                What Our <span className="gradient-text">Clients Say</span>
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg font-normal leading-relaxed">
                Real results and testimonials from our satisfied clients across diverse industries
              </p>
            </div>

            {/* Testimonial Carousel */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-gray-100 min-h-[280px] flex items-center">
                <div className="w-full">
                  {/* Rating Stars */}
                  <div className="flex items-center justify-center gap-1 mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-800 text-xl md:text-2xl mb-8 leading-[1.5] font-normal italic text-center testimonial-quote">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="text-center border-t pt-6">
                    <div className="font-bold text-xl text-gray-900 mb-1 testimonial-author">{testimonials[currentTestimonial].author}</div>
                    <div className="text-lg text-blue-600 font-semibold mb-1">{testimonials[currentTestimonial].position}</div>
                    <div className="text-sm text-gray-500">{testimonials[currentTestimonial].company}</div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
              </button>
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-8 gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentTestimonial
                        ? 'bg-blue-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Professional Credentials & Values - Merged Section */}
          <div className="mb-16 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4 text-foreground leading-tight">
                Professional <span className="gradient-text">Foundation</span>
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg font-normal leading-relaxed">
                Our credentials and core values that ensure exceptional service delivery
              </p>
            </div>

            {/* Credentials Row */}
            <div className="mb-12">
              <h4 className="text-xl font-semibold text-center text-gray-900 mb-6">Professional Credentials</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                  { name: "ICAI", full: "Chartered Accountant", badge: "Member" },
                  { name: "ICSI", full: "Company Secretary", badge: "Associate" },
                  { name: "CPA", full: "Public Accountant", badge: "Global" },
                  { name: "ACCA", full: "Certified Accountant", badge: "Fellow" }
                ].map((cert, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-105 transition-all duration-200 card-hover credential-card"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-white font-bold text-sm shadow-md">
                      {cert.name}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mb-1 leading-tight">{cert.full}</div>
                    <div className="text-xs text-blue-600 font-medium">{cert.badge}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Values Row */}
            <div>
              <h4 className="text-xl font-semibold text-center text-gray-900 mb-6">Core Values</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="text-center p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-200 card-hover value-card flex flex-col justify-center"
                  >
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${value.gradient} text-white shadow-md`}>
                        <value.icon className="w-5 h-5 card-icon" />
                      </div>
                    </div>
                    <h5 className="font-semibold text-lg mb-2 text-foreground leading-tight">{value.title}</h5>
                    <p className="text-muted-foreground text-sm leading-relaxed font-normal">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trusted by Leading Companies - Right Before CTA */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                Trusted by <span className="text-blue-600">500+</span> Leading Companies
              </h4>
              <p className="text-gray-600">
                From startups to Fortune 500 companies across diverse industries
              </p>
            </div>

            <div className="relative overflow-hidden bg-gray-50 rounded-2xl py-8">
              <div className="flex animate-scroll space-x-6">
                {[...clientLogos, ...clientLogos].map((client, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 min-w-[140px] hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                        <span className="text-white font-bold text-sm">{client.name.slice(0, 2)}</span>
                      </div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">{client.name}</div>
                      <div className="text-xs text-gray-500">{client.industry}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Final Call to Action Section */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 border border-blue-200">
            <h3 className="text-3xl font-bold mb-4 text-foreground leading-tight">
              Let's Work <span className="gradient-text">Together</span>
            </h3>
            <p className="text-xl text-gray-700 mb-2 font-medium">
              Ready to Transform Your Financial Strategy?
            </p>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Join 500+ satisfied clients who have optimized their financial operations with our expert guidance.
              Schedule a consultation today and discover how we can help you achieve your financial goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center cta-buttons">
              <button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 text-lg"
              >
                📞 Book a Call
              </button>
              <button
                onClick={() => {
                  // This would trigger a PDF download in a real implementation
                  alert('Capabilities PDF download would be implemented here');
                }}
                className="px-10 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-semibold text-lg"
              >
                📄 Download Capabilities PDF
              </button>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>contact@charterexcellence.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💼</span>
                  <span>LinkedIn Profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style>{`
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

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

        /* Enhanced card hover animations */
        .card-hover {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: scale(1.02) translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }

        .card-hover:hover .card-icon {
          animation: iconBounce 0.3s ease-in-out;
        }

        /* Consistent card heights and spacing */
        .credential-card {
          min-height: 120px;
        }

        .value-card {
          min-height: 160px;
        }

        .service-card {
          min-height: 200px;
        }

        @keyframes iconBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        /* Client logos scrolling animation */
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        /* Optimized hover effects */
        .hover-lift {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
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
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.3s;
        }

        .professional-card:hover::before {
          left: 100%;
        }

        .professional-card:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        /* Enhanced responsive adjustments */
        @media (max-width: 768px) {
          .timeline-item {
            transform: translateY(30px);
            animation: fadeInUp 0.8s ease-out forwards;
          }

          .timeline-item:nth-child(even) {
            transform: translateY(30px);
            animation: fadeInUp 0.8s ease-out forwards;
          }

          /* Mobile timeline adjustments */
          .timeline-card {
            margin-left: 3rem !important;
          }

          .timeline-dot {
            left: 0.5rem !important;
          }

          /* Touch device optimizations */
          .professional-card:hover {
            transform: none;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }

          .hover-lift:hover {
            transform: translateY(-2px);
          }

          /* Disable complex animations on mobile for performance */
          .professional-card::before {
            display: none;
          }

          /* Mobile typography adjustments */
          .timeline-title {
            font-size: 1.125rem !important;
          }

          .timeline-description {
            font-size: 0.875rem !important;
          }

          /* Testimonial grid on mobile */
          .testimonial-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }

          /* Mobile card adjustments */
          .card-hover {
            padding: 1rem !important;
          }

          .card-hover .card-icon {
            width: 1.25rem !important;
            height: 1.25rem !important;
          }

          /* Mobile CTA buttons */
          .cta-buttons {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }

          .cta-buttons button {
            width: 100% !important;
            padding: 0.75rem 1.5rem !important;
          }

          /* Mobile typography improvements */
          .testimonial-quote {
            font-size: 1.125rem !important;
            line-height: 1.6 !important;
          }

          .testimonial-author {
            font-size: 1rem !important;
          }

          .card-title {
            font-size: 1rem !important;
          }

          .card-description {
            font-size: 0.875rem !important;
            line-height: 1.5 !important;
          }
        }

        /* Touch device support */
        @media (hover: none) and (pointer: coarse) {
          .group:active {
            transform: scale(0.98);
          }

          .professional-card:active {
            transform: scale(0.99);
          }
        }

        /* Mobile sticky CTA button */
        .mobile-sticky-cta {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 50;
          display: none;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          border: none;
          border-radius: 50px;
          padding: 12px 20px;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
          transition: all 0.3s ease;
          animation: pulse 2s infinite;
        }

        .mobile-sticky-cta:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 35px rgba(79, 70, 229, 0.4);
        }

        @media (max-width: 768px) {
          .mobile-sticky-cta {
            display: block;
          }
        }
      `}</style>

      {/* Mobile Sticky CTA */}
      <button
        onClick={() => {
          const contactSection = document.getElementById('contact');
          contactSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="mobile-sticky-cta"
      >
        📞 Schedule
      </button>
    </section>
  );
};

export default About;