import React from 'react';
import { 
  Scale, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  ShieldCheck, 
  Calendar,
  Lock,
  ChevronRight
} from 'lucide-react';
import { OFFICE_INFO } from '../data/initialData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenClientPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenAuth,
  onOpenAdmin,
  onOpenClientPortal
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Identity & OAB */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="font-['Cinzel'] text-base font-bold text-white block">
                  MORAES & ASSOCIADOS
                </span>
                <span className="text-[10px] text-amber-400 uppercase tracking-widest block font-medium">
                  Sociedade de Advogados
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Escritório de advocacia full-service com atuação de excelência estratégica, focado em consultoria e contencioso complexo para empresas e indivíduos.
            </p>

            <div className="text-[11px] text-slate-500 font-mono">
              Registro OAB/SP nº 14.892 &bull; CNPJ 24.189.412/0001-80
            </div>
          </div>

          {/* Col 2: Practice Areas Quick Links */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel'] text-sm font-bold text-white uppercase tracking-wider">
              Áreas de Atuação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#servicos" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Direito Empresarial & M&A</span>
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Planejamento Sucessório & Holdings</span>
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Direito Tributário & Fiscal</span>
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Direito Trabalhista Patronal</span>
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span>Direito Civil & Imobiliário</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Address & Instagram */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel'] text-sm font-bold text-white uppercase tracking-wider">
              Sede & Redes
            </h4>
            
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{OFFICE_INFO.address.street}, {OFFICE_INFO.address.complement} - SP</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${OFFICE_INFO.contact.phone.replace(/[^0-9]/g, '')}`} className="hover:text-white">
                  {OFFICE_INFO.contact.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <a 
                  href={OFFICE_INFO.contact.instagramUrl}
                  target="_blank" 
                  rel="noreferrer"
                  className="text-pink-300 hover:underline"
                >
                  {OFFICE_INFO.contact.instagram}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${OFFICE_INFO.contact.email}`} className="hover:text-white">
                  {OFFICE_INFO.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Platform & Portal Access */}
          <div className="space-y-3">
            <h4 className="font-['Cinzel'] text-sm font-bold text-white uppercase tracking-wider">
              Plataforma Digital
            </h4>
            
            <div className="space-y-2.5">
              <button
                onClick={onOpenBooking}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar Consulta</span>
              </button>

              <button
                onClick={onOpenClientPortal}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                <span>Acessar Área do Cliente</span>
              </button>

              <button
                onClick={onOpenAdmin}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-500 hover:text-amber-400 text-[11px] transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Acesso Painel de Gestão (Admin)</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar / OAB Legal Notice */}
      <div className="border-t border-slate-800/80 bg-slate-950/90 py-5 px-4 text-center text-[11px] text-slate-500 space-y-1">
        <p>
          &copy; {new Date().getFullYear()} Moraes & Associados Sociedade de Advogados. Todos os direitos reservados.
        </p>
        <p className="max-w-3xl mx-auto text-[10px] text-slate-600">
          Este website tem caráter estritamente informativo e institucional, em consonância com as diretrizes do Código de Ética e Disciplina da Ordem dos Advogados do Brasil (OAB) e o Provimento nº 205/2021 do Conselho Federal da OAB.
        </p>
      </div>
    </footer>
  );
};
