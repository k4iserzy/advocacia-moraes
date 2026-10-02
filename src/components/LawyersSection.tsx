import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  Mail, 
  Instagram, 
  Phone, 
  Scale, 
  CheckCircle2, 
  ChevronRight, 
  UserCheck 
} from 'lucide-react';
import { Lawyer } from '../types';

interface LawyersSectionProps {
  lawyers: Lawyer[];
  onSelectLawyerForBooking: (lawyer: Lawyer) => void;
}

export const LawyersSection: React.FC<LawyersSectionProps> = ({
  lawyers,
  onSelectLawyerForBooking
}) => {
  const [selectedLawyerDetail, setSelectedLawyerDetail] = useState<Lawyer | null>(null);

  return (
    <section id="advogados" className="py-20 bg-slate-900/50 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5" />
            <span>Corpo Jurídico & Sócios</span>
          </div>
          
          <h2 className="font-['Cinzel'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Advogados Especialistas e Sócios
          </h2>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Nossa equipe combina décadas de experiência nos principais tribunais do país, 
            sólida formação acadêmica nas mais prestigiadas universidades e dedicação irrestrita aos interesses de nossos clientes.
          </p>
        </div>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="group bg-slate-950 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-950/20"
            >
              {/* Photo Banner with Badges */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
                <img
                  src={lawyer.photo}
                  alt={lawyer.name}
                  className="w-full h-full object-cover object-top filter grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
                
                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* OAB Floating Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-500/30 text-[11px] font-semibold text-amber-300 shadow-md">
                  {lawyer.oab}
                </div>

                {/* Experience Badge */}
                <div className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shadow">
                  {lawyer.experienceYears} anos exp.
                </div>

                {/* Bottom Photo Title */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-['Cinzel'] text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {lawyer.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium">
                    {lawyer.title}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Specialty */}
                  <div className="text-xs font-semibold text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 block text-[10px] uppercase tracking-wider mb-0.5">Especialidade Principal</span>
                    {lawyer.specialty}
                  </div>

                  {/* Bio Excerpt */}
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {lawyer.bio}
                  </p>

                  {/* Academic Highlights */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{lawyer.education[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions & Socials */}
                <div className="space-y-2 pt-3 border-t border-slate-800/80">
                  {/* Social and Quick Contact */}
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <a
                      href={`https://instagram.com/${lawyer.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-pink-400 transition-colors"
                      title="Instagram Profissional"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-[11px]">{lawyer.instagram}</span>
                    </a>
                    
                    <button
                      onClick={() => setSelectedLawyerDetail(lawyer)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-0.5"
                    >
                      <span>Ver currículo</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Booking CTA Button */}
                  <button
                    onClick={() => onSelectLawyerForBooking(lawyer)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-amber-950/40 transition-all active:scale-95"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-200" />
                    <span>Agendar com {lawyer.name.split(' ')[0]} {lawyer.name.split(' ')[1]}</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Credential Modal when clicking "Ver currículo" */}
        {selectedLawyerDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
              <button
                onClick={() => setSelectedLawyerDetail(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-5">
                <img
                  src={selectedLawyerDetail.photo}
                  alt={selectedLawyerDetail.name}
                  className="w-16 h-16 rounded-xl object-cover border border-amber-500/40"
                />
                <div>
                  <h3 className="font-['Cinzel'] text-xl font-bold text-white">
                    {selectedLawyerDetail.name}
                  </h3>
                  <div className="text-xs text-amber-400 font-medium">{selectedLawyerDetail.title}</div>
                  <div className="text-xs text-slate-400">{selectedLawyerDetail.oab} &bull; {selectedLawyerDetail.experienceYears} anos de advocacia</div>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div>
                  <h4 className="font-semibold text-slate-100 uppercase tracking-wider text-[11px] mb-1 text-amber-300">
                    Biografia & Trajetória
                  </h4>
                  <p className="leading-relaxed text-slate-300">
                    {selectedLawyerDetail.bio}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-100 uppercase tracking-wider text-[11px] mb-2 text-amber-300">
                    Formação Acadêmica & Títulos
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedLawyerDetail.education.map((edu, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    <span className="block font-medium text-slate-300">Dias de Atendimento:</span>
                    {selectedLawyerDetail.availableDays.join(', ')}
                  </div>
                  <a
                    href={`mailto:${selectedLawyerDetail.email}`}
                    className="flex items-center gap-1.5 text-amber-400 hover:underline text-xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>E-mail Direto</span>
                  </a>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    const l = selectedLawyerDetail;
                    setSelectedLawyerDetail(null);
                    onSelectLawyerForBooking(l);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Marcar Consulta com {selectedLawyerDetail.name}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
