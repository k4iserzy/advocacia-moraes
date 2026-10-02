import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LawyersSection } from './components/LawyersSection';
import { ServicesSection } from './components/ServicesSection';
import { OfficeAndContactSection } from './components/OfficeAndContactSection';
import { BookingModal } from './components/BookingModal';
import { ClientPortal } from './components/ClientPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { LegalAssistantModal } from './components/LegalAssistantModal';
import { Footer } from './components/Footer';
import { storage } from './services/storage';
import { User, Lawyer, Service, Appointment, SiteAnalytics, NotificationItem } from './types';
import { INITIAL_ANALYTICS } from './data/initialData';

export default function App() {
  // Navigation View State
  const [activeView, setActiveView] = useState<'home' | 'client-portal' | 'admin'>('home');

  // Core Data States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<SiteAnalytics>(INITIAL_ANALYTICS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [connectionError, setConnectionError] = useState('');

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreselectedLawyer, setBookingPreselectedLawyer] = useState<Lawyer | null>(null);
  const [bookingPreselectedService, setBookingPreselectedService] = useState<string | undefined>(undefined);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const load = async () => {
      try {
        await storage.init();
        await refreshAllData();
      } catch (error) {
        setConnectionError(error instanceof Error ? error.message : 'Não foi possível conectar ao banco de dados.');
      }
    };
    load();
  }, []);

  const refreshAllData = async () => {
    const user = storage.getCurrentUser();
    setCurrentUser(user);
    const [loadedUsers, loadedLawyers, loadedServices, loadedAppointments, loadedAnalytics, loadedNotifications] = await Promise.all([
      storage.getUsers(), storage.getLawyers(), storage.getServices(), storage.getAppointments(), storage.getAnalytics(), storage.getNotifications(user?.id)
    ]);
    setUsers(loadedUsers);
    setLawyers(loadedLawyers);
    setServices(loadedServices);
    setAppointments(loadedAppointments);
    setAnalytics(loadedAnalytics);
    setNotifications(loadedNotifications);
    setConnectionError('');
  };

  // Handlers
  const handleOpenBooking = (lawyer?: Lawyer, serviceName?: string) => {
    setBookingPreselectedLawyer(lawyer || null);
    setBookingPreselectedService(serviceName);
    setIsBookingOpen(true);
  };

  const handleOpenAuth = () => {
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user);
    await refreshAllData();
    if (user.role === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('client-portal');
    }
  };

  const handleLogout = async () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setActiveView('home');
    await refreshAllData();
  };

  const handleAppointmentCreated = (newApt: Appointment) => {
    void refreshAllData();
  };

  const handleAssistantSchedule = (lawyer: Lawyer, area: string) => {
    handleOpenBooking(lawyer, area);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-600 selection:text-white">
      {connectionError && <div className="bg-red-900/80 px-4 py-2 text-center text-xs text-red-100">Banco de dados indisponível: {connectionError}</div>}
      {/* Top Main Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={handleOpenAuth}
        onOpenAdmin={() => {
          if (currentUser?.role === 'admin') {
            setActiveView('admin');
          } else {
            // Auto open auth or login demo
            setIsAuthOpen(true);
          }
        }}
        onOpenClientPortal={() => {
          if (currentUser) {
            setActiveView('client-portal');
          } else {
            setIsAuthOpen(true);
          }
        }}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onLogout={handleLogout}
        activeView={activeView}
        onNavigateHome={() => setActiveView('home')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onOpenBooking={() => handleOpenBooking()}
              onExploreServices={() => {
                const el = document.getElementById('servicos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenAssistant={() => setIsAssistantOpen(true)}
            />

            {/* Services / Áreas de Atuação */}
            <ServicesSection
              services={services}
              onSelectServiceForBooking={(serviceTitle) => handleOpenBooking(undefined, serviceTitle)}
            />

            {/* Lawyers / Corpo Jurídico */}
            <LawyersSection
              lawyers={lawyers}
              onSelectLawyerForBooking={(lawyer) => handleOpenBooking(lawyer)}
            />

            {/* Contact, Address & Instagram Section */}
            <OfficeAndContactSection />
          </>
        )}

        {activeView === 'client-portal' && (
          currentUser ? (
            <ClientPortal
              currentUser={currentUser}
              appointments={appointments}
              notifications={notifications}
              onOpenBooking={() => handleOpenBooking()}
              onNavigateHome={() => setActiveView('home')}
              onRefreshData={refreshAllData}
            />
          ) : (
            <div className="py-24 text-center space-y-4">
              <h2 className="text-xl font-bold font-['Cinzel'] text-white">Acesso Restrito ao Cliente</h2>
              <p className="text-xs text-slate-400">Por favor, entre em sua conta para visualizar suas consultas.</p>
              <button
                onClick={handleOpenAuth}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
              >
                Acessar Minha Conta
              </button>
            </div>
          )
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            analytics={analytics}
            appointments={appointments}
            users={users}
            lawyers={lawyers}
            onNavigateHome={() => setActiveView('home')}
            onRefreshData={refreshAllData}
          />
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        lawyers={lawyers}
        initialLawyer={bookingPreselectedLawyer}
        initialServiceName={bookingPreselectedService}
        currentUser={currentUser}
        onAppointmentCreated={handleAppointmentCreated}
        onOpenClientPortal={() => {
          setIsBookingOpen(false);
          setActiveView('client-portal');
        }}
      />

      {/* Auth Modal (Login / Register / Fast Demo switcher) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* AI Pre-Triagem Modal */}
      <LegalAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        lawyers={lawyers}
        services={services}
        onScheduleWithRecommendation={handleAssistantSchedule}
      />

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={handleOpenAuth}
        onOpenAdmin={() => {
          if (currentUser?.role === 'admin') {
            setActiveView('admin');
          } else {
            setIsAuthOpen(true);
          }
        }}
        onOpenClientPortal={() => {
          if (currentUser) {
            setActiveView('client-portal');
          } else {
            setIsAuthOpen(true);
          }
        }}
      />
    </div>
  );
}
