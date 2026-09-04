import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { DepartmentsSection } from './components/DepartmentsSection';
import { DoctorsSection } from './components/DoctorsSection';
import { ServicesSection } from './components/ServicesSection';
import { AppointmentSection } from './components/AppointmentSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TestimonialsSection } from './components/TestimonialsSection';
import { GallerySection } from './components/GallerySection';
import { BlogSection } from './components/BlogSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingEmergencyButton } from './components/FloatingEmergencyButton';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminPanel } from './components/AdminPanel';
import { Doctor } from './types/hospital';
import { getCurrentAdminSession, AdminUser } from './lib/adminAuth';

export default function App() {
  // Navigation view: 'website' | 'admin'
  const [currentView, setCurrentView] = useState<'website' | 'admin'>('website');
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Check for existing valid admin session
    const sessionUser = getCurrentAdminSession();
    if (sessionUser) {
      setCurrentAdminUser(sessionUser);
    }
  }, []);

  // Appointment form pre-selection state
  const [appointmentDepartment, setAppointmentDepartment] = useState<string>('');
  const [appointmentDoctorId, setAppointmentDoctorId] = useState<string>('');

  // Doctor section filter state
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');

  const scrollToAppointment = () => {
    const el = document.getElementById('appointment');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDepartments = () => {
    const el = document.getElementById('departments');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDoctors = () => {
    const el = document.getElementById('doctors');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // From Department Card: "View Doctors"
  const handleSelectDepartmentForDoctors = (deptId: string) => {
    setSelectedDeptFilter(deptId);
    scrollToDoctors();
  };

  // From Department Card: "Book"
  const handleBookInDepartment = (deptId: string) => {
    setAppointmentDepartment(deptId);
    setAppointmentDoctorId('');
    scrollToAppointment();
  };

  // From Doctor Card: "Book Visit"
  const handleBookWithDoctor = (doc: Doctor) => {
    setAppointmentDepartment(doc.departmentId);
    setAppointmentDoctorId(doc.id);
    scrollToAppointment();
  };

  const handleClearPreselections = () => {
    setAppointmentDepartment('');
    setAppointmentDoctorId('');
  };

  const handleOpenAdminPortal = () => {
    const session = getCurrentAdminSession();
    if (session) {
      setCurrentAdminUser(session);
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setCurrentAdminUser(user);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin view is active and user is authenticated, render the dedicated Admin Console
  if (currentView === 'admin' && currentAdminUser) {
    return (
      <AdminPanel
        adminUser={currentAdminUser}
        onLogout={() => {
          setCurrentAdminUser(null);
          setCurrentView('website');
        }}
        onBackToWebsite={() => {
          setCurrentView('website');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-sky-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Top Announcement Bar */}
      <TopBar />

      {/* 2. Sticky Navbar */}
      <Navbar onBookAppointmentClick={scrollToAppointment} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 3. Hero Section */}
        <Hero
          onBookClick={scrollToAppointment}
          onExploreDepartmentsClick={scrollToDepartments}
        />

        {/* 4. About Us Section */}
        <AboutSection />

        {/* 5. Departments Section */}
        <DepartmentsSection
          onSelectDepartmentForDoctors={handleSelectDepartmentForDoctors}
          onBookInDepartment={handleBookInDepartment}
        />

        {/* 6. Doctors Section */}
        <DoctorsSection
          selectedDeptFilter={selectedDeptFilter}
          onFilterChange={(deptId) => setSelectedDeptFilter(deptId)}
          onBookWithDoctor={handleBookWithDoctor}
        />

        {/* 7. Services Section */}
        <ServicesSection onBookService={scrollToAppointment} />

        {/* 8. Book Appointment Section (Functional Form) */}
        <AppointmentSection
          preselectedDepartment={appointmentDepartment}
          preselectedDoctorId={appointmentDoctorId}
          onClearPreselections={handleClearPreselections}
        />

        {/* 9. Why Choose Us Section */}
        <WhyChooseUs />

        {/* 10. Patient Testimonials Section */}
        <TestimonialsSection />

        {/* 11. Hospital Facilities Gallery */}
        <GallerySection />

        {/* 12. Medical Blog & Health Tips */}
        <BlogSection />

        {/* 13. Frequently Asked Questions */}
        <FaqSection />

        {/* 14. Contact & Location Section */}
        <ContactSection />
      </main>

      {/* 15. Comprehensive Footer with Staff / Admin Portal Link */}
      <Footer onOpenAdminPortal={handleOpenAdminPortal} />

      {/* 16. Floating Emergency & Booking Widget */}
      <FloatingEmergencyButton onBookClick={scrollToAppointment} />

      {/* 17. Single-Slot Admin Login & Sign Up Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
