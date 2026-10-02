import React, { useState } from 'react';
import { 
  Building2, 
  Scale, 
  Users, 
  Landmark, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { Service } from '../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectServiceForBooking: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForBooking
}) => {
  const [activeServiceId, setActiveServiceId] = useState<string>(services[0]?.id || '');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-6 h-6 text-amber-400" />;
      case 'Scale': return <Scale className="w-6 h-6 text-amber-400" />;
      case 'Users': return <Users className="w-6 h-6 text-amber-400" />;
      case 'Landmark': return <Landmark className="w-6 h-6 text-amber-400" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-amber-400" />;
      default: return <Scale className="w-6 h-6 text-amber-400" />;
    }
  };

  const selectedService = services.find(s => s.id === activeServiceId) || services[0];

  return (
    <section id="servicos" className="py-20 bg-slate-950 text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Áreas de Atuação Jurídica</span>
          </div>

          <h2 className="font-['Cinzel'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Especialidades Estratégicas
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Oferecemos suporte consultivo preventivo e contencioso em matérias de alta complexidade para pessoas físicas, empresários e grupos corporativos.
          </p>
        </div>

        {/* Desktop Interactive Layout (Tabs + Detail Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Services List / Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {services.map((service) => {
              const isSelected = service.id === activeServiceId;
              return (
                <div
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-950/30'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                    isSelected ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-slate-800'
                  }`}>
                    {getIcon(service.iconName)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                        {service.title}
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Service Display Card */}
          {selectedService && (
            <div className="lg:col-span-7 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              
              {/* Category pill */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
                  {selectedService.category}
                </span>
                <span className="text-xs text-slate-400">Atuação Consultiva & Contenciosa</span>
              </div>

              {/* Title & Description */}
              <h3 className="font-['Cinzel'] text-2xl font-bold text-white mb-3">
                {selectedService.title}
              </h3>
              
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {selectedService.fullDesc}
              </p>

              {/* Key Deliverables / Highlights */}
              <div className="space-y-3 mb-8 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Destaques da Nossa Atuação:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => onSelectServiceForBooking(selectedService.title)}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm shadow-lg shadow-amber-950/50 transition-all active:scale-98"
                >
                  <Calendar className="w-4 h-4 text-amber-200" />
                  <span>Agendar Consulta em {selectedService.title.split('&')[0]}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
