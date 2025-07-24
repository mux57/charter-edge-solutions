import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  rating: number;
  company?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "Professional, reliable, and always available when needed. The best CA I've worked with for my business compliance and tax planning needs.",
    author: "Rajesh Kumar",
    role: "Business Owner",
    company: "Kumar Enterprises",
    rating: 5,
  },
  {
    id: 2,
    text: "Exceptional service in handling our company's IPO preparation. Their attention to detail and regulatory knowledge was invaluable.",
    author: "Priya Sharma",
    role: "Tech Startup Founder",
    company: "InnovateTech Solutions",
    rating: 5,
  },
  {
    id: 3,
    text: "Helped save our company significant tax liabilities through strategic planning. Highly recommend their expertise.",
    author: "Amit Patel",
    role: "Manufacturing Business Owner",
    company: "Patel Industries",
    rating: 5,
  },
  {
    id: 4,
    text: "Outstanding support during our audit process. Made what could have been a stressful experience completely smooth and professional.",
    author: "Sneha Reddy",
    role: "Finance Director",
    company: "Global Logistics Ltd",
    rating: 5,
  },
  {
    id: 5,
    text: "Their GST compliance services have been a game-changer for our retail business. Always up-to-date with the latest regulations.",
    author: "Vikram Singh",
    role: "Retail Chain Owner",
    company: "Singh Retail Group",
    rating: 5,
  },
  {
    id: 6,
    text: "Excellent financial advisory services. Helped us restructure our business for better profitability and growth.",
    author: "Meera Joshi",
    role: "Restaurant Owner",
    company: "Joshi Food Ventures",
    rating: 5,
  },
  {
    id: 7,
    text: "Professional handling of our company registration and all legal compliances. Saved us time and ensured everything was done correctly.",
    author: "Arjun Mehta",
    role: "E-commerce Entrepreneur",
    company: "Digital Marketplace",
    rating: 5,
  },
  {
    id: 8,
    text: "Their investment advisory services helped us make informed decisions. Great returns on our portfolio with minimal risk.",
    author: "Kavita Agarwal",
    role: "Investment Consultant",
    company: "Agarwal Financial Services",
    rating: 5,
  },
];

interface TestimonialCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, autoPlayInterval, isPaused]);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToTestimonial = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextTestimonial();
    } else if (isRightSwipe) {
      prevTestimonial();
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main testimonial card */}
      <Card className="testimonial-card relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 select-none">
        <CardContent className="p-8 md:p-12">
          <div className="text-center space-y-6">
            {/* Quote icon */}
            <div className="flex justify-center">
              <Quote className="h-8 w-8 text-primary/60" />
            </div>

            {/* Testimonial text with fade animation */}
            <div 
              className={`transition-all duration-300 ease-in-out ${
                isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
              }`}
            >
              <blockquote className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-6 italic">
                "{currentTestimonial.text}"
              </blockquote>

              {/* Rating stars */}
              <div className="flex justify-center space-x-1 mb-4">
                {renderStars(currentTestimonial.rating)}
              </div>

              {/* Author info */}
              <div className="space-y-1">
                <cite className="text-base font-semibold text-foreground not-italic">
                  — {currentTestimonial.author}
                </cite>
                <p className="text-sm text-muted-foreground">
                  {currentTestimonial.role}
                  {currentTestimonial.company && (
                    <span className="block">{currentTestimonial.company}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Navigation arrows */}
        {showArrows && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background shadow-md"
              onClick={prevTestimonial}
              disabled={isAnimating}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 hover:bg-background shadow-md"
              onClick={nextTestimonial}
              disabled={isAnimating}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </Card>

      {/* Dots indicator */}
      {showDots && (
        <div className="flex justify-center space-x-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-primary/30 hover:bg-primary/50'
              }`}
              onClick={() => goToTestimonial(index)}
              disabled={isAnimating}
            />
          ))}
        </div>
      )}

      {/* Progress bar (optional) */}
      {autoPlay && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{
              width: `${((Date.now() % autoPlayInterval) / autoPlayInterval) * 100}%`,
              animation: `progress ${autoPlayInterval}ms linear infinite`,
            }}
          />
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
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
          animation: fadeInUp 0.5s ease-out;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.4s ease-out;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.4s ease-out;
        }

        .animate-pulse-gentle {
          animation: pulse 2s ease-in-out infinite;
        }

        /* Smooth transitions for all interactive elements */
        .testimonial-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .testimonial-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        /* Custom scrollbar for better UX */
        .testimonial-container::-webkit-scrollbar {
          display: none;
        }

        .testimonial-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
