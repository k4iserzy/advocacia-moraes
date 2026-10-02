import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Send, 
  CheckCircle2, 
  Car, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { OFFICE_INFO } from '../data/initialData';

export const OfficeAndContactSection: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Dúvida Geral / Primeiro Contato',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      // Keep state or reset
    }, 4000);
  };

  return (
    <section id="contato" className="py-20 bg-slate-900/40 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>Sede Corporativa & Contato</span>
          </div>

          <h2 className="font-['Cinzel'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Localização & Canais de Atendimento
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Estamos estrategicamente sediados no coração financeiro de São Paulo, na Avenida Paulista, prontos para atender com conforto, segurança e total confidencialidade.
          </p>
        </div>

        {/* Top Feature: Highlighted Instagram Integration */}
        <div className="mb-12 bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900 border border-pink-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Instagram className="w-7 h-7 text-pink-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Instagram da Agência</h3>
                <span className="bg-pink-500/20 text-pink-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-pink-500/30">
                  Canal Oficial
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Acompanhe atualizações jurisprudenciais, teses tributárias, notícias do STF/STJ e o dia a dia de nossa equipe no <strong className="text-pink-300 font-semibold">{OFFICE_INFO.contact.instagram}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href={OFFICE_INFO.contact.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-600 text-white text-xs font-semibold shadow-lg shadow-pink-950/50 hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-4 h-4" />
              <span>Seguir {OFFICE_INFO.contact.instagram}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>

        {/* Main Content Grid: Address + Info & Map (Left) + Contact Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Office Address Details & Map */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Address & Working Hours Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Physical Address */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Endereço Sede</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white text-sm">{OFFICE_INFO.address.street}</p>
                  <p>{OFFICE_INFO.address.complement}</p>
                  <p>{OFFICE_INFO.address.neighborhood}</p>
                  <p>{OFFICE_INFO.address.city} - {OFFICE_INFO.address.state} &bull; CEP {OFFICE_INFO.address.cep}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
                  <Car className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{OFFICE_INFO.address.parking}</span>
                </div>
              </div>

              {/* Business Hours & Phones */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>Horários & Contato</span>
                </div>
                <div className="text-xs text-slate-300 space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Expediente de Atendimento:</span>
                    <p className="font-medium text-slate-200">{OFFICE_INFO.contact.hours}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Telefone Principal:</span>
                    <a href={`tel:${OFFICE_INFO.contact.phone.replace(/[^0-9]/g, '')}`} className="font-semibold text-white hover:text-amber-400">
                      {OFFICE_INFO.contact.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">E-mail Institucional:</span>
                    <a href={`mailto:${OFFICE_INFO.contact.email}`} className="font-medium text-amber-400 hover:underline">
                      {OFFICE_INFO.contact.email}
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Interactive Google Map Embed */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-lg h-72 relative">
              <iframe
                title="Mapa de Localização Moraes & Associados"
                src={OFFICE_INFO.address.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter invert-[90%] hue-rotate-180 contrast-[120%]"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Próximo à Estação Consolação / Trianon-Masp</span>
              </div>
            </div>

            {/* WhatsApp Quick CTA Bar */}
            <a
              href={OFFICE_INFO.contact.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between p-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Atendimento Imediato via WhatsApp</div>
                  <div className="text-xs text-slate-300">Fale diretamente com nossa triagem jurídica: {OFFICE_INFO.contact.whatsapp}</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </a>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Mail className="w-4 h-4" />
                <span>Envie sua Mensagem</span>
              </div>
              <h3 className="font-['Cinzel'] text-xl font-bold text-white mb-2">
                Fale com a Moraes & Associados
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Preencha os campos abaixo com o resumo de sua necessidade. Nossa equipe retornará em até 2 horas úteis.
              </p>

              {formSubmitted ? (
                <div className="bg-emerald-950/50 border border-emerald-500/50 p-6 rounded-xl text-center space-y-3 my-6 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Mensagem Enviada com Sucesso!</h4>
                  <p className="text-xs text-slate-300">
                    Agradecemos seu contato. Um de nossos advogados especialistas entrará em contato pelo telefone ou e-mail informado.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: 'Dúvida Geral / Primeiro Contato', message: '' });
                    }}
                    className="text-xs text-amber-400 underline font-medium hover:text-amber-300"
                  >
                    Enviar nova mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo Silveira"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">E-mail Corporativo/Pessoal *</label>
                      <input
                        type="email"
                        required
                        placeholder="nome@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Telefone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Assunto de Interesse</label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option>Direito Empresarial & Societário</option>
                      <option>Planejamento Sucessório & Família</option>
                      <option>Direito Tributário & Defesa Fiscal</option>
                      <option>Direito do Trabalho Estratégico</option>
                      <option>Direito Civil & Imobiliário</option>
                      <option>Dúvida Geral / Primeiro Contato</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Mensagem / Resumo do Caso *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Descreva resumidamente sua dúvida ou situação jurídica..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-amber-950/50 transition-all active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Mensagem com Sigilo Profissional</span>
                  </button>
                </form>
              )}
            </div>

            <div className="pt-4 mt-6 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
              Todos os dados e comunicações são protegidos pelo sigilo profissional da OAB e pela LGPD (Lei 13.709/18).
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
