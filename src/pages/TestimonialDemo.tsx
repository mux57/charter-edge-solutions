import React, { useState } from 'react';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import { SimpleTestimonialCarousel } from '@/components/SimpleTestimonialCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Zap, Smartphone, Globe, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TestimonialDemo: React.FC = () => {
  const [activeVersion, setActiveVersion] = useState<'simple' | 'advanced'>('simple');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Testimonial Carousel Demo</h1>
                <p className="text-muted-foreground">Lightweight, animated testimonials that work everywhere</p>
              </div>
            </div>
            <Badge variant="secondary">GitHub Pages Ready</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Version Selector */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant={activeVersion === 'simple' ? 'default' : 'outline'}
              onClick={() => setActiveVersion('simple')}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Simple Version
            </Button>
            <Button
              variant={activeVersion === 'advanced' ? 'default' : 'outline'}
              onClick={() => setActiveVersion('advanced')}
              className="flex items-center gap-2"
            >
              <Code className="h-4 w-4" />
              Advanced Version
            </Button>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              {activeVersion === 'simple' ? 'Simple Testimonial Carousel' : 'Advanced Testimonial Carousel'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {activeVersion === 'simple' 
                ? 'Ultra-lightweight version with pure CSS animations. Perfect for GitHub Pages and static hosting.'
                : 'Feature-rich version with touch support, advanced animations, and interactive controls.'
              }
            </p>
          </div>

          {/* Testimonial Display */}
          <div className="max-w-5xl mx-auto">
            {activeVersion === 'simple' ? (
              <SimpleTestimonialCarousel />
            ) : (
              <TestimonialCarousel 
                autoPlay={true}
                autoPlayInterval={6000}
                showDots={true}
                showArrows={true}
              />
            )}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Simple Version Features */}
          <Card className={activeVersion === 'simple' ? 'ring-2 ring-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Simple Version
              </CardTitle>
              <CardDescription>
                Minimal, fast, and works everywhere
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="text-sm">GitHub Pages Compatible</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Ultra Lightweight (~2KB)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Pure CSS Animations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Mobile Responsive</span>
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  <strong>Features:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Auto-advancing slides</li>
                    <li>Smooth fade transitions</li>
                    <li>Click navigation dots</li>
                    <li>Progress indicator</li>
                    <li>Star ratings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Version Features */}
          <Card className={activeVersion === 'advanced' ? 'ring-2 ring-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Advanced Version
              </CardTitle>
              <CardDescription>
                Feature-rich with enhanced interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="text-sm">GitHub Pages Compatible</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Touch/Swipe Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Advanced Animations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Interactive Controls</span>
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  <strong>Features:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Touch/swipe navigation</li>
                    <li>Arrow button controls</li>
                    <li>Pause on hover</li>
                    <li>Advanced animations</li>
                    <li>Configurable timing</li>
                    <li>Event callbacks</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Guide</CardTitle>
            <CardDescription>
              How to use these testimonial carousels in your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">1. Basic Usage</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    {activeVersion === 'simple' ? (
                      `import { SimpleTestimonialCarousel } from './components/SimpleTestimonialCarousel';

// Use in your component
<SimpleTestimonialCarousel />`
                    ) : (
                      `import { TestimonialCarousel } from './components/TestimonialCarousel';

// Use in your component
<TestimonialCarousel 
  autoPlay={true}
  autoPlayInterval={5000}
  showDots={true}
  showArrows={true}
/>`
                    )}
                  </code>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Customization</h4>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Both versions support:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Custom testimonial data</li>
                    <li>Styling via CSS classes</li>
                    <li>Responsive design</li>
                    <li>Theme integration</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. GitHub Pages Deployment</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Both versions work perfectly on GitHub Pages with no additional configuration needed. 
                  They use only standard web technologies that are supported everywhere.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">Ready to Add Testimonials?</h3>
          <p className="text-muted-foreground mb-6">
            Choose the version that best fits your needs and start showcasing your client feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/')}>
              View Live Example
            </Button>
            <Button variant="outline" onClick={() => navigate('/meetings')}>
              Try Meeting Scheduler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialDemo;
