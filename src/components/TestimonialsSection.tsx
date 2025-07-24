import React from 'react';
import { TestimonialCarousel } from './TestimonialCarousel';
import { SimpleTestimonialCarousel } from './SimpleTestimonialCarousel';

interface TestimonialsSectionProps {
  className?: string;
  useSimpleVersion?: boolean;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  className = '',
  useSimpleVersion = true
}) => {
  return (
    <section className={`py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What My Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say about 
            working with me for their financial and compliance needs.
          </p>
        </div>

        {/* Testimonial carousel */}
        {useSimpleVersion ? (
          <SimpleTestimonialCarousel />
        ) : (
          <TestimonialCarousel
            autoPlay={true}
            autoPlayInterval={6000}
            showDots={true}
            showArrows={true}
          />
        )}

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Ready to join these satisfied clients?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Get Started Today
            </button>
            <button 
              onClick={() => {
                const servicesSection = document.getElementById('services');
                servicesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
            >
              View Services
            </button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Tax Returns Filed</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
