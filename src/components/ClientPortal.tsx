import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User as UserIcon, 
  MapPin, 
  Video, 
  Building, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  FileText, 
  ArrowLeft, 
  Bell, 
  ShieldCheck, 
  RotateCcw,
  Info
} from 'lucide-react';
import { Appointment, User, NotificationItem } from '../types';
import { storage } from '../services/storage';

interface ClientPortalProps {
  currentUser: User;
  appointments: Appointment[];
  notifications: NotificationItem[];
  onOpenBooking: () => void;
  onNavigateHome: () => void;
  onRefreshData: () => Promise<void>;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  currentUser,
  appointments,
  notifications,
  onOpenBooking,
  onNavigateHome,
  onRefreshData
}) => {
  const [cancelModalAppointment, setCancelModalAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todas');

  // Filter client's own appointments
  const myAppointments = appointments.filter(
    a => a.userId === currentUser.id || a.clientEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const filteredList = myAppointments.filter(apt => {
    if (filterStatus === 'todas') return true;
    return apt.status === filterStatus;
  });

  const handleCancelByClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalAppointment || !cancelReason.trim()) return;

    await storage.cancelAppointment(cancelModalAppointment.id, cancelReason, `Cliente (${currentUser.name})`);
    setCancelModalAppointment(null);
    setCancelReason('');
    await onRefreshData();
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmada
          </span>
        );
      case 'reagendada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <RotateCcw className="w-3.5 h-3.5" />
            Reagendada
          </span>
        );
      case 'pendente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            Em Análise
          </span>
        );
      case 'cancelada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            Cancelada
          </span>
        );
      case 'concluida':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Concluída
          </span>
        );
    }
  };

  return (
    <div className="py-10 bg-slate-950 text-slate-100 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Site Principal</span>
            </button>
            <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-white">
              Área do Cliente & Consultas
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Olá, <strong className="text-slate-200">{currentUser.name}</strong>. Gerencie seus agendamentos e acompanhe seus protocolos jurídicos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-amber-950/40 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-amber-200" />
              <span>Marcar Nova Consulta</span>
            </button>
          </div>
        </div>

        {/* Client Details Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          
          {/* User Profile Card */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white truncate">{currentUser.name}</h3>
                <span className="text-[11px] text-amber-400">Cliente Cadastrado</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
              <p><strong className="text-slate-300">E-mail:</strong> {currentUser.email}</p>
              <p><strong className="text-slate-300">Telefone:</strong> {currentUser.phone || 'Não informado'}</p>
              <p><strong className="text-slate-300">CPF:</strong> {currentUser.cpf || 'Não informado'}</p>
            </div>
          </div>

          {/* Appointments Count Overview */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Histórico de Atendimento</span>
              <div className="text-3xl font-bold font-['Cinzel'] text-white mt-2">
                {myAppointments.length}
              </div>
              <p className="text-xs text-slate-400 mt-1">Consultas registradas em sua conta</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <span className="text-emerald-400 font-medium">
                {myAppointments.filter(a => a.status === 'confirmada' || a.status === 'reagendada').length} Ativas
              </span>
              <span>&bull;</span>
              <span className="text-slate-400">
                {myAppointments.filter(a => a.status === 'concluida').length} Concluídas
              </span>
            </div>
          </div>

          {/* Help / Guidance Card */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Instruções da Consulta</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Para consultas <strong>presenciais</strong>, dirija-se à Av. Paulista, 1842 - 14º Andar com 10 min de antecedência. Para <strong>online</strong>, o link seguro será enviado ao seu e-mail e WhatsApp.
              </p>
            </div>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              Dúvidas urgentes? Ligue: (11) 3456-7890
            </div>
          </div>

        </div>

        {/* Notifications Bar if any */}
        {notifications.length > 0 && (
          <div className="mb-8 space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Avisos e Notificações Recentes</span>
            </h3>
            {notifications.slice(0, 3).map(notif => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border text-xs flex items-start gap-3 ${
                  notif.type === 'rescheduled'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : notif.type === 'cancelled'
                    ? 'bg-red-950/30 border-red-500/40 text-red-200'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="block font-semibold">{notif.title}</strong>
                  <p className="text-slate-300 mt-0.5">{notif.message}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(notif.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Section: List of Appointments */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-['Cinzel'] text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Minhas Consultas Marcadas</span>
            </h2>

            {/* Filter Pill */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Filtrar:</span>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="todas">Todas as Consultas</option>
                <option value="confirmada">Confirmadas</option>
                <option value="reagendada">Reagendadas</option>
                <option value="pendente">Em Análise</option>
                <option value="concluida">Concluídas</option>
                <option value="cancelada">Canceladas</option>
              </select>
            </div>
          </div>

          {filteredList.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="max-w-sm mx-auto">
                <h3 className="text-base font-bold text-white">Nenhuma consulta encontrada</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Você ainda não possui consultas com o filtro selecionado. Agende sua primeira consulta jurídica agora mesmo.
                </p>
              </div>
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all"
              >
                Marcar Consulta Agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredList.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all space-y-4 shadow-lg"
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                        {apt.protocolNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">{apt.practiceArea}</span>
                    </div>
                    <div>{getStatusBadge(apt.status)}</div>
                  </div>

                  {/* Body Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Advogado Responsável:</span>
                      <strong className="text-white text-sm">{apt.lawyerName}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Data e Horário:</span>
                      <div className="text-amber-300 font-bold text-sm flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{apt.date.split('-').reverse().join('/')} às {apt.time}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Modalidade:</span>
                      <div className="flex items-center gap-1.5 text-slate-200 mt-0.5 font-medium">
                        {apt.format === 'presencial' ? (
                          <>
                            <Building className="w-3.5 h-3.5 text-amber-400" />
                            <span>Presencial (Sede Paulista)</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-3.5 h-3.5 text-blue-400" />
                            <span>Online (Vídeo Chamada)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes / Reschedule Reason / Cancel Reason Boxes */}
                  {apt.notes && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <span className="font-semibold text-slate-400 block text-[10px] uppercase">Seu Resumo / Observações:</span>
                      {apt.notes}
                    </div>
                  )}

                  {apt.rescheduleReason && (
                    <div className="bg-amber-950/40 p-3.5 rounded-xl border border-amber-500/40 text-xs text-amber-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Motivo do Reagendamento pela Administração:</span>
                      </div>
                      <p className="text-amber-100">{apt.rescheduleReason}</p>
                    </div>
                  )}

                  {apt.cancelReason && (
                    <div className="bg-red-950/40 p-3.5 rounded-xl border border-red-500/40 text-xs text-red-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-red-300">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Motivo do Cancelamento:</span>
                      </div>
                      <p className="text-red-100">{apt.cancelReason}</p>
                    </div>
                  )}

                  {/* Bottom Actions for Active Appointments */}
                  {(apt.status === 'confirmada' || apt.status === 'reagendada' || apt.status === 'pendente') && (
                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => setCancelModalAppointment(apt)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-300 border border-red-900/40 text-xs font-medium transition-colors"
                      >
                        Solicitar Cancelamento
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Cancel Modal by Client */}
      {cancelModalAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
            <h3 className="font-['Cinzel'] text-lg font-bold text-white mb-1">
              Confirmar Cancelamento de Consulta
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Protocolo: <strong className="text-amber-400">{cancelModalAppointment.protocolNumber}</strong> ({cancelModalAppointment.date.split('-').reverse().join('/')} às {cancelModalAppointment.time})
            </p>

            <form onSubmit={handleCancelByClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Por favor, informe o motivo do cancelamento *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Imprevisto de agenda pessoal / Necessito reagendar para outro mês..."
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setCancelModalAppointment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
