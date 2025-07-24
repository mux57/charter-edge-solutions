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
  Crown
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
      rating: 5
    },
    {
      quote: "Led our IPO process flawlessly, ensuring 100% compliance and optimal valuation. A true professional who delivers beyond expectations.",
      author: "Priya Sharma",
      position: "CFO, GreenEnergy Corp",
      company: "Renewable Energy Sector",
      rating: 5
    },
    {
      quote: "His innovative tax structures for our M&A deals resulted in significant savings. Highly recommend for complex financial advisory needs.",
      author: "Michael Chen",
      position: "Managing Director",
      company: "Global Investment Fund",
      rating: 5
    }
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
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground leading-tight">
              About <span className="gradient-text">Me</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Dedicated Chartered Accountant with 15+ years of experience serving
              <span className="font-semibold text-blue-600">500+ clients</span> across various industries.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Enhanced Professional Card */}
            <div className={`relative ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-3xl p-6 border-2 border-blue-100 shadow-lg professional-card">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 to-purple-600/3 rounded-3xl"></div>

                {/* Professional Avatar */}
                <div className="relative text-center mb-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-full shadow-2xl flex items-center justify-center mb-4 relative overflow-hidden animate-pulse-gentle">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <Users className="w-16 h-16 text-white relative z-10" />

                    {/* Floating badges */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 leading-tight">CA Professional</h3>
                  <p className="text-blue-600 font-normal">Elite Financial Strategist</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-white/70 rounded-xl border border-blue-200 hover:translate-y-[-2px] transition-transform duration-200">
                    <div className="text-2xl font-bold text-blue-600 stat-counter leading-tight">500+</div>
                    <div className="text-xs text-gray-600 font-normal">Clients</div>
                  </div>
                  <div className="text-center p-3 bg-white/70 rounded-xl border border-green-200 hover:translate-y-[-2px] transition-transform duration-200">
                    <div className="text-2xl font-bold text-green-600 stat-counter leading-tight">15+</div>
                    <div className="text-xs text-gray-600 font-normal">Years</div>
                  </div>
                  <div className="text-center p-3 bg-white/70 rounded-xl border border-purple-200 hover:translate-y-[-2px] transition-transform duration-200">
                    <div className="text-2xl font-bold text-purple-600 stat-counter leading-tight">₹125Cr+</div>
                    <div className="text-xs text-gray-600 font-normal">Saved</div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-200/20 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-purple-200/20 rounded-full"></div>
              </div>
            </div>

            <div className={`${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-4 text-foreground leading-tight">
                    Professional <span className="gradient-text">Excellence</span>
                  </h3>

                  <p className="text-gray-700 text-lg leading-relaxed mb-4 font-normal">
                    As a distinguished Chartered Accountant with over <span className="font-semibold text-blue-600">15 years of elite experience</span>,
                    I specialize in providing comprehensive financial services to businesses and high-net-worth individuals.
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-6 font-normal">
                    My expertise spans <span className="font-semibold text-purple-600">tax optimization</span>,
                    <span className="font-semibold text-green-600"> IPO consulting</span>,
                    <span className="font-semibold text-orange-600"> M&A advisory</span>, and strategic financial planning.
                    I've helped clients save over <span className="font-semibold text-green-600">₹125 crores in taxes</span> while maintaining
                    <span className="font-semibold text-blue-600">100% compliance</span> across all engagements.
                  </p>
                </div>

                {/* Enhanced Achievement Cards */}
                <div className="grid gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`group relative overflow-hidden bg-gradient-to-r from-white to-gray-50/50 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md hover:translate-y-[-3px] transition-all duration-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex items-center gap-4 p-4">
                        <div className={`relative p-3 rounded-xl bg-gradient-to-r ${achievement.gradient} text-white shadow-md group-hover:scale-105 transition-all duration-200`}>
                          <achievement.icon className="w-5 h-5 relative z-10" />
                          <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-base mb-1 leading-tight">{achievement.text}</h4>
                          <p className="text-sm text-gray-600 font-normal leading-relaxed">{achievement.subtitle}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  ))}
                </div>
              </div>
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

          {/* Enhanced Motto & Goals Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4 text-foreground leading-tight">
                Our <span className="gradient-text">Motto & Goals</span>
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg font-normal leading-relaxed">
                The core values that guide our professional practice and client relationships
              </p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className={`group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-lg hover:translate-y-[-3px] transition-all duration-200 min-h-[180px] ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="p-6 text-center relative overflow-hidden h-full flex flex-col justify-between">
                      {/* Background gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"></div>

                      <div className="relative z-10 flex flex-col items-center">
                        <div className="flex justify-center mb-4">
                          <div className={`p-3 rounded-2xl bg-gradient-to-r ${value.gradient} text-white shadow-md group-hover:scale-105 transition-transform duration-200`}>
                            <value.icon className="w-6 h-6" />
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

          {/* Enhanced Professional History Timeline */}
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

          {/* Client Testimonials */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-4 text-foreground leading-tight">
                Client <span className="gradient-text">Testimonials</span>
              </h3>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg font-normal leading-relaxed">
                What our clients say about our professional excellence and results
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 testimonial-grid">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:translate-y-[-3px] transition-all duration-200 border-2 border-gray-100 hover:border-blue-200 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${(index + 10) * 200}ms` }}
                >
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-700 mb-4 leading-relaxed font-normal italic">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900 leading-tight">{testimonial.author}</div>
                    <div className="text-sm text-blue-600 font-medium">{testimonial.position}</div>
                    <div className="text-xs text-gray-500 mt-1">{testimonial.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Certifications */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
              Professional Credentials
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "ICAI", full: "Chartered Accountant", badge: "Member" },
                { name: "ICSI", full: "Company Secretary", badge: "Associate" },
                { name: "CPA", full: "Public Accountant", badge: "Global" },
                { name: "ACCA", full: "Certified Accountant", badge: "Fellow" }
              ].map((cert, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-sm">
                    {cert.name}
                  </div>
                  <div className="text-xs font-semibold text-gray-900 mb-1">{cert.full}</div>
                  <div className="text-xs text-blue-600 font-medium">{cert.badge}</div>
                </div>
              ))}
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
      `}</style>
    </section>
  );
};

export default About;