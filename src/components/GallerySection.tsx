import React, { useState } from 'react';
import { Maximize2, X, Sparkles } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/hospitalData';
import { GalleryItem } from '../types/hospital';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Surgery', 'Diagnostics', 'Patient Rooms', 'Facilities', 'Technology'];

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-widest mb-3">
            Campus & Technology Tour
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our World-Class <span className="text-teal-600">Hospital Facilities</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Take a visual walkthrough of our cutting-edge robotic operating theaters, patient suites, high-field MRI suites,
            and welcoming healing environments.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-slate-200/70 cursor-pointer bg-slate-900 h-72 transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Top Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {item.category}
                </span>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold drop-shadow-sm group-hover:text-teal-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-1">{item.caption}</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-teal-600/80 backdrop-blur-xs flex items-center justify-center shrink-0 group-hover:bg-teal-600 transition-colors">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxItem && (
          <div
            id="gallery-lightbox-modal"
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setLightboxItem(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  {lightboxItem.category}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{lightboxItem.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{lightboxItem.caption}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
