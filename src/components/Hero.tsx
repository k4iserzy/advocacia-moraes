import React from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Award, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Video, 
  Scale
} from 'lucide-react';
import { OFFICE_INFO } from '../data/initialData';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
  onOpenAssistant: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onExploreServices,
  onOpenAssistant
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Copy / Content */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Advocacia de Alta Performance &bull; OAB/SP</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-['Cinzel'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-100 leading-[1.15]">
              Defesa Jurídica Estratégica,{' '}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Segurança Patrimonial
              </span>{' '}
              e Excelência Consultiva.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Atuação combativa e preventiva com foco em Direito Empresarial, Civil, 
              Planejamento Sucessório, Tributário e Trabalhista. Atendimento presencial na Avenida Paulista ou por videoconferência com sigilo absoluto.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="btn-hero-schedule"
                onClick={onOpenBooking}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white font-semibold text-base shadow-xl shadow-amber-950/50 hover:shadow-amber-900/60 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Calendar className="w-5 h-5 text-amber-100" />
                <span>Agendar Consulta Jurídica</span>
              </button>

              <button
                id="btn-hero-services"
                onClick={onExploreServices}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-500/40 text-base font-medium transition-all"
              >
                <span>Nossas Especialidades</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Trust Badges / Quick USPs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-left">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Presencial & Online</div>
                  <div className="text-[11px] text-slate-400">Na Paulista ou via Vídeo</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Agendamento Ágil</div>
                  <div className="text-[11px] text-slate-400">Escolha dia e horário</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Sigilo Profissional</div>
                  <div className="text-[11px] text-slate-400">Em conformidade com OAB</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Card / Interactive Visual Element */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 border border-amber-500/30 shadow-2xl shadow-black/80">
              
              {/* Inner Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Atendimento Especializado</span>
                  <h3 className="font-['Cinzel'] text-lg font-bold text-white">Moraes & Associados</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Building className="w-5 h-5 text-amber-400" />
                </div>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-bold font-['Cinzel'] text-amber-300">25+</div>
                  <div className="text-xs text-slate-400 mt-0.5">Anos de Experiência</div>
                </div>
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-bold font-['Cinzel'] text-amber-300">R$ 500M+</div>
                  <div className="text-xs text-slate-400 mt-0.5">Em causas assessoradas</div>
                </div>
              </div>

              {/* Consultation Format Options Pill */}
              <div className="space-y-3 mb-6 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-amber-400" />
                    <span>Presencial na Sede Corporativa</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-slate-800 px-2 py-0.5 rounded text-amber-300">Av. Paulista</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-blue-400" />
                    <span>Consulta Virtual Segura</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-slate-800 px-2 py-0.5 rounded text-blue-300">Google Meet / Teams</span>
                </div>
              </div>

              {/* Fast Booking Shortcut */}
              <button
                onClick={onOpenBooking}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-sm font-semibold transition-all group"
              >
                <span>Solicitar Horário Imediato</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Quick AI Assist CTA */}
              <p className="text-[11px] text-center text-slate-500 mt-3">
                Dúvidas sobre qual área se encaixa no seu caso?{' '}
                <button 
                  onClick={onOpenAssistant}
                  className="text-amber-400 underline hover:text-amber-300 font-medium"
                >
                  Fazer triagem virtual gratuita
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
