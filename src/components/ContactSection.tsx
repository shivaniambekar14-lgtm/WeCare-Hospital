import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Ambulance,
  Building2,
} from 'lucide-react';
import { HOSPITAL_INFO } from '../data/hospitalData';

export const ContactSection: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof contactForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof contactForm]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const errors: Partial<Record<keyof typeof contactForm, string>> = {};
    if (!contactForm.name.trim()) errors.name = 'Please enter your name';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactForm.email.trim() || !emailRegex.test(contactForm.email.trim())) {
      errors.email = 'Please provide a valid email address';
    }
    if (!contactForm.message.trim()) errors.message = 'Please type your message';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 600);
  };

  return (
    <section id="contact" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-widest mb-3">
            Reach Out to Us
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact & <span className="text-teal-600">Location Details</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Conveniently situated in the central medical district. Our concierge and patient liaison teams are standing by
            to answer your inquiries.
          </p>
        </div>

        {/* Contact Info & Map Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Info Details Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hospital Location</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {HOSPITAL_INFO.address.street} <br />
                  {HOSPITAL_INFO.address.city}, {HOSPITAL_INFO.address.state} {HOSPITAL_INFO.address.zip}
                </p>
                <span className="inline-block mt-2 text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/80">
                  Dedicated Visitor Parking On-Site (P1 & P2)
                </span>
              </div>
            </div>

            {/* Phone Hotlines Card */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Telephone Hotlines</h3>
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-rose-600">24/7 Emergency:</span>{' '}
                  <a href={`tel:${HOSPITAL_INFO.emergencyPhone}`} className="hover:underline font-bold text-slate-900">
                    {HOSPITAL_INFO.emergencyPhone}
                  </a>
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-amber-600">Ambulance Dispatch:</span>{' '}
                  <a href={`tel:${HOSPITAL_INFO.ambulancePhone}`} className="hover:underline font-semibold text-slate-900">
                    {HOSPITAL_INFO.ambulancePhone}
                  </a>
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Scheduling Desk:</span>{' '}
                  <a href={`tel:${HOSPITAL_INFO.generalPhone}`} className="hover:underline text-slate-900">
                    {HOSPITAL_INFO.generalPhone}
                  </a>
                </p>
              </div>
            </div>

            {/* Email & Hours Card */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/70 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Operating Timings</h3>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Emergency & ICU:</span> 24 Hours / 7 Days
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Outpatient (OPD):</span> Mon – Sat: 7:30 AM – 8:30 PM
                </p>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Patient Visiting:</span> 10:00 AM – 1:00 PM & 4:30 PM – 7:30 PM
                </p>
                <p className="text-xs text-teal-800 pt-1">
                  Email: <a href={`mailto:${HOSPITAL_INFO.email}`} className="underline font-semibold">{HOSPITAL_INFO.email}</a>
                </p>
              </div>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="lg:col-span-7 h-[390px] rounded-3xl overflow-hidden border border-slate-200/70 shadow-md relative bg-slate-100">
            <iframe
              id="google-maps-embed"
              title="WeCare Hospital Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.4285098748366!2d-73.97867362354593!3d40.75268393512903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25901a4127927%3A0x9d54e4c297c11f7!2sChrysler%20Building!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            {/* Map Overlay Badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block">WeCare Hospital Medical Campus</span>
              <span className="text-slate-500 text-[11px]">742 Healthcare Blvd • Easy Highway & Metro Access</span>
            </div>
          </div>
        </div>

        {/* Contact Form Container */}
        <div className="max-w-4xl mx-auto bg-slate-50/80 rounded-3xl p-6 sm:p-10 border border-slate-200/70 shadow-xl">
          <div className="max-w-xl mx-auto text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900">Send an Inquiry or Feedback</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Have questions about treatments, corporate tie-ups, or medical records? Send us a message and our coordinator
              will get back to you within 4 business hours.
            </p>
          </div>

          {isSuccess ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-emerald-900">Message Dispatched!</h4>
              <p className="text-sm text-emerald-800 max-w-md mx-auto">
                Thank you for contacting WeCare Hospital. Our patient relations representative will respond to your email shortly.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleChange}
                    placeholder="e.g. Marcus Thorne"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      formErrors.name
                        ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                        : 'border-slate-200 bg-white focus:ring-teal-500'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleChange}
                    placeholder="e.g. marcus@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      formErrors.email
                        ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                        : 'border-slate-200 bg-white focus:ring-teal-500'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{formErrors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleChange}
                    placeholder="e.g. +1 (555) 234-8900"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject / Concern
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleChange}
                    placeholder="e.g. Insurance authorization or second opinion"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={contactForm.message}
                  onChange={handleChange}
                  placeholder="How can our clinical or administrative team help you?"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    formErrors.message
                      ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-400'
                      : 'border-slate-200 bg-white focus:ring-teal-500'
                  }`}
                />
                {formErrors.message && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{formErrors.message}</span>
                  </p>
                )}
              </div>

              <div className="text-center pt-2">
                <button
                  id="submit-contact-form-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all inline-flex items-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
