import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, User, X, BookOpen, Share2 } from 'lucide-react';
import { BLOG_POSTS } from '../data/hospitalData';
import { BlogPost } from '../types/hospital';

export const BlogSection: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-widest mb-3">
            Health Insights & Education
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Latest Medical Advice & <span className="text-teal-600">Health Tips</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Evidence-based wellness guidance authored by WeCare Hospital clinicians to help you and your family live healthier.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              id={`blog-card-${post.id}`}
              className="bg-white rounded-3xl border border-slate-200/70 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 backdrop-blur-md text-sky-700 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom: Author & Read More */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px]">
                    <span className="block font-bold text-slate-800">{post.author}</span>
                    <span className="text-slate-400">{post.authorRole}</span>
                  </div>

                  <button
                    id={`read-more-btn-${post.id}`}
                    onClick={() => setActiveArticle(post)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group/btn"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Read Article Modal */}
        {activeArticle && (
          <div
            id="blog-detail-modal"
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setActiveArticle(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
                  {activeArticle.category}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 leading-tight">
                  {activeArticle.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span>By {activeArticle.author}, {activeArticle.authorRole}</span>
                  <span>•</span>
                  <span>{activeArticle.date}</span>
                  <span>•</span>
                  <span>{activeArticle.readTime}</span>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden mb-6 h-56">
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3.5 text-sm text-slate-700 leading-relaxed">
                {activeArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Published for community health education by WeCare Hospital Clinical Staff.
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
