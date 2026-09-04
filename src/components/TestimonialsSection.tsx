import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/hospitalData';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const current = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-widest mb-3">
            Real Patient Experiences
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Stories of Recovery & <span className="text-teal-600">Renewed Hope</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Read heartfelt reflections from patients whose lives were transformed by the medical staff at WeCare Hospital.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          <div className="relative bg-slate-50/80 rounded-3xl p-8 sm:p-12 border border-slate-200/70 shadow-xl">
            {/* Quote Icon watermark */}
            <Quote className="w-20 h-20 text-teal-200/40 absolute top-6 right-8 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Patient Photo & Info */}
              <div className="text-center md:text-left shrink-0">
                <div className="relative inline-block">
                  <img
                    src={current.avatarUrl}
                    alt={current.patientName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-lg border-2 border-white"
                  />
                  {current.verified && (
                    <div
                      title="Verified Patient"
                      className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-3">{current.patientName}</h3>
                <p className="text-xs font-semibold text-teal-600">{current.treatment}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{current.department} • {current.date}</p>
              </div>

              {/* Feedback Content */}
              <div className="space-y-4 text-center md:text-left flex-1">
                {/* Rating stars */}
                <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-700">5.0 / 5.0 Rating</span>
                </div>

                {/* Quote Text */}
                <p className="text-base sm:text-lg text-slate-700 font-medium italic leading-relaxed">
                  "{current.quote}"
                </p>

                <div className="pt-2 flex items-center justify-center md:justify-start gap-2 text-xs text-slate-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Verified Inpatient Review</span>
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between">
              {/* Indicators */}
              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === currentIndex ? 'w-8 bg-teal-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-3">
                <button
                  id="testimonial-prev-btn"
                  onClick={prevTestimonial}
                  aria-label="Previous patient story"
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  id="testimonial-next-btn"
                  onClick={nextTestimonial}
                  aria-label="Next patient story"
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
