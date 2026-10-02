import React, { useState } from 'react';
import { 
  Scale, 
  User as UserIcon, 
  Calendar, 
  ShieldCheck, 
  Menu, 
  X, 
  Phone, 
  LogIn, 
  LogOut, 
  Instagram, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { User, Lawyer } from '../types';
import { OFFICE_INFO } from '../data/initialData';

interface NavbarProps {
  currentUser: User | null;
  onOpenBooking: (lawyer?: Lawyer, serviceName?: string) => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenClientPortal: () => void;
  onOpenAssistant: () => void;
  onLogout: () => void;
  activeView: 'home' | 'client-portal' | 'admin';
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenBooking,
  onOpenAuth,
  onOpenAdmin,
  onOpenClientPortal,
  onOpenAssistant,
  onLogout,
  activeView,
  onNavigateHome
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-900/20 text-slate-100 transition-all duration-300">
      {/* Top Banner with Quick Contact, Instagram and Office Status */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
              <Scale className="w-3.5 h-3.5 text-amber-500" />
              {OFFICE_INFO.oabNumber}
            </span>
            <span className="hidden sm:inline-block text-slate-700">|</span>
            <span className="hidden sm:flex items-center gap-1 hover:text-slate-200 transition-colors">
              <MapPin className="w-3 h-3 text-slate-400" />
              Av. Paulista, 1842 - 14º Andar, SP
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href={OFFICE_INFO.contact.instagramUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
              title="Instagram Oficial Moraes & Associados"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>{OFFICE_INFO.contact.instagram}</span>
            </a>
            <span className="text-slate-700">|</span>
            <a 
              href={`tel:${OFFICE_INFO.contact.phone.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{OFFICE_INFO.contact.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Identity / Logo */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3.5 text-left group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-0.5 shadow-lg shadow-amber-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="font-['Cinzel'] tracking-wider text-xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              MORAES & ASSOCIADOS
            </div>
            <div className="text-[10px] tracking-[0.25em] text-slate-400 uppercase font-medium">
              Sociedade de Advogados
            </div>
          </div>
        </button>

        {/* Desktop Menu Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              onNavigateHome();
              const el = document.getElementById('servicos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Áreas de Atuação
          </button>
          
          <button
            onClick={() => {
              onNavigateHome();
              const el = document.getElementById('advogados');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Corpo Jurídico
          </button>

          <button
            onClick={() => {
              onNavigateHome();
              const el = document.getElementById('contato');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Contato & Endereço
          </button>

          {/* AI Pre-Triagem Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Triagem de Caso</span>
          </button>
        </nav>

        {/* Action Controls & Auth Area */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Consultation CTA */}
          <button
            id="btn-nav-schedule"
            onClick={() => onOpenBooking()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 hover:from-amber-500 to-amber-700 text-white font-medium text-sm shadow-md shadow-amber-900/30 hover:shadow-amber-900/50 transition-all transform active:scale-95"
          >
            <Calendar className="w-4 h-4 text-amber-200" />
            <span>Marcar Consulta</span>
          </button>

          {/* User / Admin State Pill */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              {currentUser.role === 'admin' ? (
                <button
                  id="btn-nav-admin"
                  onClick={onOpenAdmin}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    activeView === 'admin' 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-inner'
                      : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-slate-700'
                  }`}
                  title="Acessar Painel de Controle de Administrador"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Painel Admin</span>
                </button>
              ) : (
                <button
                  id="btn-nav-client"
                  onClick={onOpenClientPortal}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    activeView === 'client-portal'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-inner'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                  title="Minhas Consultas e Perfil"
                >
                  <UserIcon className="w-4 h-4 text-amber-400" />
                  <span className="max-w-[110px] truncate">{currentUser.name.split(' ')[0]}</span>
                </button>
              )}

              <button
                id="btn-nav-logout"
                onClick={onLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
                title="Encerrar Sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-nav-login"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-medium transition-all"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>Entrar / Acesso</span>
            </button>
          )}
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => onOpenBooking()}
            className="p-2 rounded-md bg-amber-600 text-white"
            title="Marcar Consulta"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
                const el = document.getElementById('servicos');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left px-3 py-2 text-slate-300 hover:bg-slate-900 rounded-md font-medium"
            >
              Áreas de Atuação
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
                const el = document.getElementById('advogados');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left px-3 py-2 text-slate-300 hover:bg-slate-900 rounded-md font-medium"
            >
              Nossos Advogados
            </button>
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
                const el = document.getElementById('contato');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left px-3 py-2 text-slate-300 hover:bg-slate-900 rounded-md font-medium"
            >
              Contato & Instagram
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssistant();
              }}
              className="flex items-center gap-2 text-left px-3 py-2 text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-md font-medium"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Triagem de Caso Virtual
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-600 text-white font-medium text-sm"
            >
              <Calendar className="w-4 h-4" />
              Marcar Consulta Agora
            </button>

            {currentUser ? (
              <div className="space-y-2">
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 font-medium text-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Painel do Administrador
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenClientPortal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-medium text-sm"
                  >
                    <UserIcon className="w-4 h-4 text-amber-400" />
                    Área do Cliente ({currentUser.name.split(' ')[0]})
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-950/40 text-red-300 text-xs font-medium border border-red-900/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair da Conta
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-medium text-sm"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                Acessar Conta / Admin
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
