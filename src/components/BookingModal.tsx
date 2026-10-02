import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User as UserIcon, 
  CheckCircle2, 
  Video, 
  Building, 
  Scale, 
  ArrowLeft, 
  ArrowRight, 
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { Lawyer, User, Appointment, AppointmentFormat } from '../types';
import { storage } from '../services/storage';
import { OFFICE_INFO } from '../data/initialData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyers: Lawyer[];
  initialLawyer?: Lawyer | null;
  initialServiceName?: string;
  currentUser: User | null;
  onAppointmentCreated: (appointment: Appointment) => void;
  onOpenClientPortal: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  lawyers,
  initialLawyer,
  initialServiceName,
  currentUser,
  onAppointmentCreated,
  onOpenClientPortal
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>(initialLawyer?.id || lawyers[0]?.id || '');
  const [selectedArea, setSelectedArea] = useState<string>(
    initialServiceName || (initialLawyer ? initialLawyer.specialty.split(',')[0] : 'Direito Empresarial & Societário')
  );
  
  // Tomorrow's date default
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    // skip to monday if weekend
    if (d.getDay() === 6) d.setDate(d.getDate() + 2);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(getTomorrowDate());
  const [time, setTime] = useState<string>('10:30');
  const [format, setFormat] = useState<AppointmentFormat>('presencial');
  const [notes, setNotes] = useState<string>('');

  // User form details
  const [clientName, setClientName] = useState<string>(currentUser?.name || '');
  const [clientEmail, setClientEmail] = useState<string>(currentUser?.email || '');
  const [clientPhone, setClientPhone] = useState<string>(currentUser?.phone || '');
  const [clientCpf, setClientCpf] = useState<string>(currentUser?.cpf || '');
  const [clientPassword, setClientPassword] = useState('');

  // Result state
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [copiedProtocol, setCopiedProtocol] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialLawyer) {
      setSelectedLawyerId(initialLawyer.id);
      setSelectedArea(initialLawyer.specialty.split(',')[0]);
    }
  }, [initialLawyer]);

  useEffect(() => {
    if (initialServiceName) {
      setSelectedArea(initialServiceName);
    }
  }, [initialServiceName]);

  useEffect(() => {
    if (currentUser) {
      setClientName(currentUser.name);
      setClientEmail(currentUser.email);
      setClientPhone(currentUser.phone);
      setClientCpf(currentUser.cpf);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const currentSelectedLawyer = lawyers.find(l => l.id === selectedLawyerId) || lawyers[0];

  const availableTimeSlots = currentSelectedLawyer?.availableHours || [
    '09:00', '10:30', '11:30', '14:00', '15:30', '16:30', '17:30'
  ];

  const practiceAreasList = [
    'Direito Empresarial & Societário',
    'Direito Civil & Imobiliário',
    'Planejamento Sucessório & Família',
    'Direito Tributário & Contencioso Fiscal',
    'Direito do Trabalho & Compliance Trabalhista',
    'Direito Penal Econômico & Governança'
  ];

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !date || !time) return;
    if (!currentSelectedLawyer) {
      setBookingError('Nenhum advogado disponível no momento. Tente novamente em instantes.');
      return;
    }

    try {
      setBookingError('');
      setIsSubmitting(true);
      let user = currentUser;
      if (!user) user = await storage.registerUser(clientName, clientEmail, clientPhone, clientCpf, clientPassword);

      const apt = await storage.createAppointment({
        userId: user.id,
        clientName,
        clientEmail,
        clientPhone,
        clientCpf,
        lawyerId: currentSelectedLawyer.id,
        lawyerName: currentSelectedLawyer.name,
        practiceArea: selectedArea,
        date,
        time,
        format,
        notes
      });

      setConfirmedAppointment(apt);
      onAppointmentCreated(apt);
      setStep(4);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Não foi possível confirmar a consulta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyProtocol = () => {
    if (confirmedAppointment) {
      navigator.clipboard.writeText(confirmedAppointment.protocolNumber);
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative my-8 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Atendimento Jurídico Personalizado</span>
          </div>
          <h2 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-white mt-1">
            {step === 4 ? 'Agendamento Confirmado!' : 'Agendar Consulta Jurídica'}
          </h2>
          {step < 4 && (
            <p className="text-xs text-slate-400 mt-1">
              Etapa {step} de 3 &bull; Escolha com quem, quando e a modalidade de sua preferência.
            </p>
          )}
        </div>

        {/* Stepper Progress Bar */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-6 px-1">
            <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 1 ? 'text-amber-400' : 'text-slate-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                1
              </div>
              <span className="hidden sm:inline">Área & Advogado</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${step >= 2 ? 'bg-amber-500' : 'bg-slate-800'}`} />
            <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 2 ? 'text-amber-400' : 'text-slate-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                2
              </div>
              <span className="hidden sm:inline">Data & Horário</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${step >= 3 ? 'bg-amber-500' : 'bg-slate-800'}`} />
            <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 3 ? 'text-amber-400' : 'text-slate-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                3
              </div>
              <span className="hidden sm:inline">Seus Dados</span>
            </div>
          </div>
        )}

        {/* Step 1: Area & Lawyer */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                1. Selecione a Área Jurídica de Atuação:
              </label>
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              >
                {practiceAreasList.map((area, idx) => (
                  <option key={idx} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                2. Selecione o Advogado Responsável:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lawyers.map((lawyer) => {
                  const isSelected = lawyer.id === selectedLawyerId;
                  return (
                    <div
                      key={lawyer.id}
                      onClick={() => setSelectedLawyerId(lawyer.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected 
                          ? 'bg-amber-500/15 border-amber-500 shadow-md text-white' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <img
                        src={lawyer.photo}
                        alt={lawyer.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{lawyer.name}</div>
                        <div className="text-[10px] text-amber-400">{lawyer.oab}</div>
                        <div className="text-[10px] text-slate-400 truncate">{lawyer.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all"
              >
                <span>Avançar para Data e Horário</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date, Time & Format */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Format Selection (Presencial vs Online) */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2">
                1. Modalidade de Atendimento:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('presencial')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    format === 'presencial'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building className={`w-5 h-5 shrink-0 ${format === 'presencial' ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-xs font-bold">Presencial (Sede Paulista)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Av. Paulista, 1842 - 14º Andar</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('online')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    format === 'online'
                      ? 'bg-blue-500/15 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Video className={`w-5 h-5 shrink-0 ${format === 'online' ? 'text-blue-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-xs font-bold">Online (Vídeo Chamada)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Google Meet com Link Seguro</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                2. Escolha a Data:
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                3. Horários Disponíveis:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableTimeSlots.map((slot, idx) => {
                  const isSelected = slot === time;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all"
              >
                <span>Avançar para Dados do Cliente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Client Information & Summary */}
        {step === 3 && (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 block font-semibold uppercase">Resumo da Consulta</span>
                <strong>{selectedArea}</strong> com <strong>{currentSelectedLawyer.name}</strong>
              </div>

              {!currentUser && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Senha para acessar sua conta *</label>
                  <input type="password" required minLength={6} placeholder="Mínimo de 6 caracteres" value={clientPassword} onChange={e => setClientPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500" />
                </div>
              )}
              <div className="text-right">
                <span className="text-white font-bold block">{date.split('-').reverse().join('/')} às {time}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">{format}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">E-mail para Confirmação *</label>
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Telefone / WhatsApp (opcional)</label>
                <input
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CPF ou CNPJ (opcional)</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={clientCpf}
                  onChange={e => setClientCpf(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Resumo da Situação / Observações Prévias (opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Descreva brevemente o tema principal da consulta para que o advogado possa se preparar previamente..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {bookingError && (
              <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-900/40 leading-relaxed">
                {bookingError}
              </p>
            )}

            <div className="pt-3 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-amber-950/50 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Confirmando...' : 'Confirmar e Gerar Protocolo'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Success Screen */}
        {step === 4 && confirmedAppointment && (
          <div className="text-center space-y-5 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-['Cinzel'] text-xl font-bold text-white">
                Consulta Agendada com Sucesso!
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Seu agendamento foi registrado em nossa pauta e o advogado responsável já foi notificado.
              </p>
            </div>

            {/* Protocol Number Display */}
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 inline-flex flex-col items-center gap-2 max-w-sm w-full">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Número de Protocolo</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold text-white tracking-widest">
                  {confirmedAppointment.protocolNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyProtocol}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                  title="Copiar Protocolo"
                >
                  {copiedProtocol ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedProtocol ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-left text-xs text-slate-300 space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Advogado:</span>
                <span className="font-semibold text-white">{confirmedAppointment.lawyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Data e Horário:</span>
                <span className="font-semibold text-amber-300">{confirmedAppointment.date.split('-').reverse().join('/')} às {confirmedAppointment.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Modalidade:</span>
                <span className="font-semibold capitalize text-white">{confirmedAppointment.format} ({confirmedAppointment.format === 'presencial' ? 'Av. Paulista' : 'Google Meet'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cliente:</span>
                <span className="font-semibold text-white">{confirmedAppointment.clientName}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenClientPortal();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors"
              >
                Ver Minhas Consultas na Área do Cliente
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Fechar e Voltar ao Início
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
