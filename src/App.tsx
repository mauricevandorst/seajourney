import React, { useState, useEffect } from 'react';
import { Mail, Facebook, Instagram, Youtube, Timer, ChevronLeft, ChevronRight } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './lib/supabase';

function App() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80',
      caption: 'Crystal clear waters of Thailand',
    },
    {
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
      caption: 'Temples of Bali',
    },
    {
      image: 'https://images.unsplash.com/photo-1512553353614-82a7370096dc?auto=format&fit=crop&w=400&q=80',
      caption: 'Beaches of Vietnam',
    },
    {
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80',
      caption: 'Crystal clear waters of Thailand',
    },
    {
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
      caption: 'Temples of Bali',
    },
    {
      image: 'https://images.unsplash.com/photo-1512553353614-82a7370096dc?auto=format&fit=crop&w=400&q=80',
      caption: 'Beaches of Vietnam',
    },
  ];

  useEffect(() => {
    const launchDate = new Date('2025-09-18T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }

      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.error('This email is already subscribed!');
        } else {
          throw error;
        }
      } else {
        toast.success('Thanks for subscribing!');
        setEmail('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  // Calculate visible slides for desktop view
  const getVisibleSlides = (count: number) => {
    const start = currentSlide;
    const visibleSlides = [];
    for (let i = 0; i < count; i++) {
      const index = (start + i) % slides.length;
      visibleSlides.push(slides[index]);
    }
    return visibleSlides;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Hero Video/Image Section */}
      <div className="absolute inset-0 -z-10">
        <picture>
          <source
            media="(min-width: 768px)"
            srcSet="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1920&q=80"
          />
          <img
            src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=768&q=80"
            alt="Beautiful beach in Thailand"
            className="object-cover w-full h-full"
          />
        </picture>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-between p-6 text-white">
        {/* Header */}
        <div className="w-full text-center mt-12 md:mt-24">
          <div className="flex items-center justify-center mb-4">
            <Timer className="w-12 h-12 md:w-16 md:h-16" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Sea Journey
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto px-4">
            Your Gateway to Breathtaking South-East Asian Adventures
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 md:gap-8 text-center my-8">
          {[
            { label: 'Days', value: days },
            { label: 'Hours', value: hours },
            { label: 'Minutes', value: minutes },
            { label: 'Seconds', value: seconds },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-bold">{value}</span>
              <span className="text-sm md:text-base opacity-80">{label}</span>
            </div>
          ))}
        </div>

        {/* Email Signup */}
        <div className="w-full max-w-md mx-auto px-4 mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Get Notified'}
            </button>
          </form>
        </div>

        {/* Image Slider */}
        <div className="w-full mx-auto relative my-8 px-4">
          {/* Desktop Multi-Slide View */}
          <div className="hidden md:block relative">
            {/* Medium screens (2 slides) */}
            <div className="hidden md:block lg:hidden">
              <div className="grid grid-cols-2 gap-8 mx-auto container">
                {getVisibleSlides(2).map((slide, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden aspect-[4/3] max-w-[400px] w-full mx-auto">
                    <img
                      src={slide.image}
                      alt={slide.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                      <p className="text-sm">{slide.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Large screens (3 slides) */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-3 gap-8 mx-auto container">
                {getVisibleSlides(3).map((slide, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden aspect-[4/3] max-w-[400px] w-full mx-auto">
                    <img
                      src={slide.image}
                      alt={slide.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                      <p className="text-sm">{slide.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Desktop Slide Indicators */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Mobile Single Slide View */}
          <div className="md:hidden relative aspect-[4/3] max-w-[400px] w-full mx-auto rounded-lg overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
                  <p className="text-sm md:text-base">{slide.caption}</p>
                </div>
              </div>
            ))}

            {/* Mobile Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Mobile Slide Indicators */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm opacity-80">
              © 2024 Sea Journey. All rights reserved.
            </div>
            <div className="flex gap-6">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Youtube, href: '#' },
                { Icon: Mail, href: 'mailto:info@seajourney.com' },
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="text-white hover:text-white/80 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;