import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "Professional, reliable, and always available when needed. The best CA I've worked with for my business compliance and tax planning needs.",
    author: "Rajesh Kumar",
    role: "Business Owner",
    rating: 5,
  },
  {
    id: 2,
    text: "Exceptional service in handling our company's IPO preparation. Their attention to detail and regulatory knowledge was invaluable.",
    author: "Priya Sharma",
    role: "Tech Startup Founder",
    rating: 5,
  },
  {
    id: 3,
    text: "Helped save our company significant tax liabilities through strategic planning. Highly recommend their expertise.",
    author: "Amit Patel",
    role: "Manufacturing Business Owner",
    rating: 5,
  },
  {
    id: 4,
    text: "Outstanding support during our audit process. Made what could have been a stressful experience completely smooth and professional.",
    author: "Sneha Reddy",
    role: "Finance Director",
    rating: 5,
  },
  {
    id: 5,
    text: "Their GST compliance services have been a game-changer for our retail business. Always up-to-date with the latest regulations.",
    author: "Vikram Singh",
    role: "Retail Chain Owner",
    rating: 5,
  },
  {
    id: 6,
    text: "Excellent financial advisory services. Helped us restructure our business for better profitability and growth.",
    author: "Meera Joshi",
    role: "Restaurant Owner",
    rating: 5,
  },
];

export const SimpleTestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Testimonial Card */}
      <div 
        className="relative bg-white rounded-lg shadow-lg p-8 md:p-12 border border-gray-100"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          transition: 'all 0.5s ease-in-out',
        }}
      >
        {/* Quote Mark */}
        <div className="text-center mb-6">
          <div 
            className="inline-block text-6xl text-blue-200 leading-none"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            "
          </div>
        </div>

        {/* Testimonial Content */}
        <div 
          key={currentIndex}
          className="text-center"
          style={{
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          {/* Stars */}
          <div className="flex justify-center space-x-1 mb-6">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className="h-5 w-5 text-yellow-400"
                style={{ fill: 'currentColor' }}
              />
            ))}
          </div>

          {/* Testimonial Text */}
          <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic font-medium">
            {currentTestimonial.text}
          </blockquote>

          {/* Author */}
          <div className="space-y-1">
            <cite className="text-lg font-semibold text-gray-900 not-italic">
              — {currentTestimonial.author}
            </cite>
            <p className="text-gray-600">{currentTestimonial.role}</p>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              style={{
                transform: index === currentIndex ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-100 ease-linear"
            style={{
              width: `${((currentIndex + 1) / testimonials.length) * 100}%`,
              animation: 'progress 5s linear infinite',
            }}
          />
        </div>
      </div>

      {/* Inline Styles for Animations */}
      <style jsx>{`
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

        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }

        /* Hover effects */
        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .testimonial-card {
            margin: 0 1rem;
          }
        }

        /* Smooth transitions for all elements */
        * {
          transition: all 0.3s ease;
        }

        /* Custom button hover effects */
        button:hover {
          transform: scale(1.1);
        }

        button:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};
