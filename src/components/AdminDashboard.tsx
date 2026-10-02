import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Eye, 
  Activity, 
  TrendingUp, 
  Search, 
  Filter, 
  RotateCcw, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Building, 
  Video, 
  BarChart3, 
  AlertCircle,
  Download,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { Appointment, User, SiteAnalytics, Lawyer, AppointmentStatus } from '../types';
import { storage } from '../services/storage';

interface AdminDashboardProps {
  analytics: SiteAnalytics;
  appointments: Appointment[];
  users: User[];
  lawyers: Lawyer[];
  onNavigateHome: () => void;
  onRefreshData: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  analytics,
  appointments,
  users,
  lawyers,
  onNavigateHome,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'consultas' | 'metricas' | 'usuarios'>('consultas');
  
  // Search & Filter for Appointments
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todas');
  const [lawyerFilter, setLawyerFilter] = useState<string>('todos');

  // Search for Users
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);

  // Modal States for Actions
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:30');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const [historyModalApt, setHistoryModalApt] = useState<Appointment | null>(null);

  // Filtering appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.protocolNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.practiceArea.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todas' || apt.status === statusFilter;
    const matchesLawyer = lawyerFilter === 'todos' || apt.lawyerId === lawyerFilter;

    return matchesSearch && matchesStatus && matchesLawyer;
  });

  // Filtering users
  const clientUsers = users.filter(u => u.role === 'client');
  const filteredUsers = clientUsers.filter(u => 
    u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (u.phone && u.phone.includes(userSearchTerm)) ||
    (u.cpf && u.cpf.includes(userSearchTerm))
  );

  // Handlers
  const handleExecuteReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalApt || !newDate || !newTime || !rescheduleReason.trim()) return;

    await storage.rescheduleAppointment(
      rescheduleModalApt.id,
      newDate,
      newTime,
      rescheduleReason.trim(),
      'Admin Moraes & Associados'
    );

    setRescheduleModalApt(null);
    setRescheduleReason('');
    await onRefreshData();
  };

  const handleExecuteCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalApt || !cancelReason.trim()) return;

    await storage.cancelAppointment(
      cancelModalApt.id,
      cancelReason.trim(),
      'Admin Moraes & Associados'
    );

    setCancelModalApt(null);
    setCancelReason('');
    await onRefreshData();
  };

  const handleMarkConcluded = async (apt: Appointment) => {
    await storage.updateAppointmentStatus(apt.id, 'concluida', 'Admin Moraes & Associados');
    await onRefreshData();
  };

  const handleMarkConfirmed = async (apt: Appointment) => {
    await storage.updateAppointmentStatus(apt.id, 'confirmada', 'Admin Moraes & Associados');
    await onRefreshData();
  };

  const handleExportCSV = () => {
    const headerStr = 'Protocolo,Data,Horario,Cliente,Email,Telefone,CPF,Advogado,Area,Modalidade,Status\n';
    const rowsStr = appointments.map(a => 
      `"${a.protocolNumber}","${a.date}","${a.time}","${a.clientName}","${a.clientEmail}","${a.clientPhone}","${a.clientCpf}","${a.lawyerName}","${a.practiceArea}","${a.format}","${a.status}"`
    ).join('\n');
    const blob = new Blob([headerStr + rowsStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_consultas_moraes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmada':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Confirmada</span>;
      case 'reagendada':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Reagendada</span>;
      case 'pendente':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">Pendente</span>;
      case 'cancelada':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">Cancelada</span>;
      case 'concluida':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">Concluída</span>;
    }
  };

  return (
    <div className="py-8 bg-slate-950 text-slate-100 min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Site Institucional</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-bold text-white">
                Painel Administrativo & Gestão
              </h1>
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                Moraes Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Controle de acessos, reagendamentos/cancelamentos com justificativa e base de clientes cadastrados.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              title="Exportar dados de consultas em planilha CSV"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={onRefreshData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              title="Recarregar dados"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          
          {/* KPI 1: Site Visitors (Quantos usuários entraram no site) */}
          <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Acessos no Site</span>
              <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-['Cinzel'] text-white">
                {analytics.totalVisits.toLocaleString('pt-BR')}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                <span className="text-emerald-400 font-medium">{analytics.pageViews.toLocaleString('pt-BR')} views</span>
                <span>&bull;</span>
                <span>{analytics.uniqueVisitors.toLocaleString('pt-BR')} únicos</span>
              </div>
            </div>
          </div>

          {/* KPI 2: Total Consultas Marcadas */}
          <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Consultas Marcadas</span>
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-['Cinzel'] text-amber-300">
                {appointments.length}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                <span className="text-emerald-400 font-medium">
                  {appointments.filter(a => a.status === 'confirmada' || a.status === 'reagendada').length} ativas
                </span>
                <span>&bull;</span>
                <span className="text-red-400 font-medium">
                  {appointments.filter(a => a.status === 'cancelada').length} canceladas
                </span>
              </div>
            </div>
          </div>

          {/* KPI 3: Registered Clients */}
          <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clientes Cadastrados</span>
              <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-['Cinzel'] text-white">
                {clientUsers.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Base de dados de contatos e CPFs</p>
            </div>
          </div>

          {/* KPI 4: Conversion / Activity */}
          <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Advogados em Pauta</span>
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold font-['Cinzel'] text-white">
                {lawyers.length} Sócios
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Disponíveis para agendamentos</p>
            </div>
          </div>

        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('consultas')}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'consultas'
                ? 'border-amber-500 text-amber-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Consultas Marcadas ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('metricas')}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'metricas'
                ? 'border-amber-500 text-amber-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Métricas de Acessos & Tráfego</span>
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'usuarios'
                ? 'border-amber-500 text-amber-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Informações dos Usuários ({clientUsers.length})</span>
          </button>
        </div>

        {/* TAB 1: CONSULTAS MARCADAS */}
        {activeTab === 'consultas' && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, e-mail, protocolo ou área jurídica..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="todas">Todos os Status</option>
                  <option value="confirmada">Confirmadas</option>
                  <option value="reagendada">Reagendadas</option>
                  <option value="pendente">Pendentes</option>
                  <option value="concluida">Concluídas</option>
                  <option value="cancelada">Canceladas</option>
                </select>

                <select
                  value={lawyerFilter}
                  onChange={e => setLawyerFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="todos">Todos os Advogados</option>
                  {lawyers.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table of Appointments */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Protocolo / Data / Hora</th>
                      <th className="py-3.5 px-4">Cliente & Contato</th>
                      <th className="py-3.5 px-4">Advogado / Área</th>
                      <th className="py-3.5 px-4">Modalidade</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Ações Administrativas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-500">
                          Nenhuma consulta encontrada para os critérios selecionados.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-900/90 transition-colors">
                          
                          {/* Protocol & Date */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-amber-400 block">{apt.protocolNumber}</span>
                            <div className="text-white font-medium flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{apt.date.split('-').reverse().join('/')} às {apt.time}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              Criado em {new Date(apt.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </td>

                          {/* Client */}
                          <td className="py-4 px-4">
                            <strong className="text-white block font-semibold">{apt.clientName}</strong>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              <span>{apt.clientEmail}</span>
                            </div>
                            {apt.clientPhone && (
                              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{apt.clientPhone}</span>
                              </div>
                            )}
                            {apt.clientCpf && (
                              <span className="text-[10px] text-slate-500 block">CPF: {apt.clientCpf}</span>
                            )}
                          </td>

                          {/* Lawyer & Area */}
                          <td className="py-4 px-4">
                            <span className="text-amber-200 font-medium block">{apt.lawyerName}</span>
                            <span className="text-[11px] text-slate-400">{apt.practiceArea}</span>
                          </td>

                          {/* Format */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              {apt.format === 'presencial' ? (
                                <>
                                  <Building className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Presencial (Paulista)</span>
                                </>
                              ) : (
                                <>
                                  <Video className="w-3.5 h-3.5 text-blue-400" />
                                  <span>Online (Vídeo)</span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div>{getStatusBadge(apt.status)}</div>
                            {apt.rescheduleReason && (
                              <span className="text-[10px] text-amber-400 block mt-1 line-clamp-1" title={apt.rescheduleReason}>
                                Reagendado: {apt.rescheduleReason}
                              </span>
                            )}
                            {apt.cancelReason && (
                              <span className="text-[10px] text-red-400 block mt-1 line-clamp-1" title={apt.cancelReason}>
                                Cancelado: {apt.cancelReason}
                              </span>
                            )}
                          </td>

                          {/* Admin Action Buttons */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* Reschedule Button */}
                              <button
                                onClick={() => {
                                  setRescheduleModalApt(apt);
                                  setNewDate(apt.date);
                                  setNewTime(apt.time);
                                  setRescheduleReason('');
                                }}
                                className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1"
                                title="Reagendar consulta com justificativa obrigatória"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reagendar</span>
                              </button>

                              {/* Cancel Button */}
                              {apt.status !== 'cancelada' && (
                                <button
                                  onClick={() => {
                                    setCancelModalApt(apt);
                                    setCancelReason('');
                                  }}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1"
                                  title="Cancelar consulta com justificativa obrigatória"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Cancelar</span>
                                </button>
                              )}

                              {/* Confirm / Conclude */}
                              {apt.status === 'pendente' && (
                                <button
                                  onClick={() => handleMarkConfirmed(apt)}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
                                  title="Aprovar e Confirmar"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Aprovar</span>
                                </button>
                              )}

                              {apt.status === 'confirmada' && (
                                <button
                                  onClick={() => handleMarkConcluded(apt)}
                                  className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1"
                                  title="Marcar como Concluída"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Concluir</span>
                                </button>
                              )}

                              {/* History Log Viewer */}
                              <button
                                onClick={() => setHistoryModalApt(apt)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                                title="Ver histórico de alterações e auditoria"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MÉTRICAS DE ACESSOS (Quantos usuários entraram no site) */}
        {activeTab === 'metricas' && (
          <div className="space-y-6">
            
            {/* Visitors Analytics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Daily Traffic Visualizer */}
              <div className="lg:col-span-8 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-['Cinzel'] text-lg font-bold text-white">
                      Evolução de Acessos ao Site & Agendamentos
                    </h3>
                    <p className="text-xs text-slate-400">
                      Relação de visitantes diários que navegaram pelo portal vs consultas realizadas
                    </p>
                  </div>
                  <span className="text-xs bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-amber-400 font-semibold">
                    Últimos 7 dias
                  </span>
                </div>

                {/* Custom Bar Graph */}
                <div className="pt-6 space-y-3">
                  {analytics.visitsByDay.map((day, idx) => {
                    const maxVisits = 1200;
                    const percent = Math.min(100, Math.round((day.visits / maxVisits) * 100));
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-300">{day.date}</span>
                          <span className="text-slate-400">
                            <strong className="text-white">{day.visits} acessos</strong> ({day.bookings} consultas marcadas)
                          </span>
                        </div>
                        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                          <div
                            style={{ width: `${percent}%` }}
                            className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                  <span>Média diária: ~780 acessos únicos</span>
                  <span className="text-emerald-400 font-semibold">Taxa de conversão: ~3.8%</span>
                </div>
              </div>

              {/* Demand by Practice Area */}
              <div className="lg:col-span-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div>
                  <h3 className="font-['Cinzel'] text-lg font-bold text-white">
                    Áreas Mais Procuradas
                  </h3>
                  <p className="text-xs text-slate-400">
                    Distribuição das consultas por especialidade
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {analytics.popularAreas.map((area, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-200">{area.area}</span>
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {area.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-slate-500 text-center">
                  Dados atualizados em tempo real a cada novo agendamento.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: INFORMAÇÕES DOS USUÁRIOS */}
        {activeTab === 'usuarios' && (
          <div className="space-y-4">
            
            {/* User Search */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar usuário por nome, e-mail, telefone ou CPF..."
                  value={userSearchTerm}
                  onChange={e => setUserSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-xs text-slate-400 shrink-0">
                Total: <strong className="text-white">{filteredUsers.length}</strong> clientes
              </span>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Nome do Cliente</th>
                      <th className="py-3.5 px-4">E-mail</th>
                      <th className="py-3.5 px-4">Telefone</th>
                      <th className="py-3.5 px-4">CPF / Documento</th>
                      <th className="py-3.5 px-4">Data de Cadastro</th>
                      <th className="py-3.5 px-4">Consultas Realizadas</th>
                      <th className="py-3.5 px-4 text-right">Ficha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-500">
                          Nenhum usuário cadastrado encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const userApts = appointments.filter(
                          a => a.userId === u.id || a.clientEmail.toLowerCase() === u.email.toLowerCase()
                        );
                        return (
                          <tr key={u.id} className="hover:bg-slate-900/90 transition-colors">
                            <td className="py-4 px-4 font-semibold text-white">
                              {u.name}
                            </td>
                            <td className="py-4 px-4 text-slate-300">
                              {u.email}
                            </td>
                            <td className="py-4 px-4 text-slate-300">
                              {u.phone || '—'}
                            </td>
                            <td className="py-4 px-4 text-slate-400 font-mono">
                              {u.cpf || '—'}
                            </td>
                            <td className="py-4 px-4 text-slate-400">
                              {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300 font-bold">
                                {userApts.length} consultas
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => setSelectedUserDetail(u)}
                                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                              >
                                Ver Detalhes
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL 1: REAGENDAMENTO COM MOTIVO OBRIGATÓRIO */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setRescheduleModalApt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <RotateCcw className="w-4 h-4" />
              <span>Ação de Reagendamento</span>
            </div>

            <h3 className="font-['Cinzel'] text-xl font-bold text-white mb-1">
              Reagendar Consulta Jurídica
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Protocolo: <strong className="text-white">{rescheduleModalApt.protocolNumber}</strong> &bull; Cliente: <strong className="text-white">{rescheduleModalApt.clientName}</strong>
            </p>

            <form onSubmit={handleExecuteReschedule} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nova Data *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Novo Horário *</label>
                  <select
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {['09:00', '09:30', '10:30', '11:30', '14:00', '14:30', '15:30', '16:30', '17:30'].map((h, i) => (
                      <option key={i} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">
                  Justificativa / Motivo do Reagendamento (Obrigatório) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Conflito de pauta de audiência no Tribunal de Justiça do advogado responsável. Reagendado para a data mais próxima..."
                  value={rescheduleReason}
                  onChange={e => setRescheduleReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Este motivo será exibido ao cliente na Área do Cliente e arquivado no histórico de auditoria.
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalApt(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors"
                >
                  Confirmar Reagendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CANCELAMENTO COM MOTIVO OBRIGATÓRIO */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setCancelModalApt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <XCircle className="w-4 h-4" />
              <span>Cancelamento de Consulta</span>
            </div>

            <h3 className="font-['Cinzel'] text-xl font-bold text-white mb-1">
              Cancelar Consulta Jurídica
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Protocolo: <strong className="text-white">{cancelModalApt.protocolNumber}</strong> ({cancelModalApt.date.split('-').reverse().join('/')} às {cancelModalApt.time})
            </p>

            <form onSubmit={handleExecuteCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-red-300 mb-1">
                  Justificativa / Motivo do Cancelamento (Obrigatório) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Impedimento ético de representação / Desistência formal do solicitante / Caso fora da competência do escritório..."
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalApt(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: AUDITORIA / HISTÓRICO DA CONSULTA */}
      {historyModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setHistoryModalApt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              ✕
            </button>

            <h3 className="font-['Cinzel'] text-lg font-bold text-white mb-1">
              Histórico & Auditoria do Protocolo
            </h3>
            <p className="text-xs text-amber-400 font-mono mb-4">
              {historyModalApt.protocolNumber} &bull; {historyModalApt.clientName}
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {historyModalApt.historyLog.map((log, index) => (
                <div key={index} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span className="font-semibold text-amber-400">{log.by}</span>
                    <span>{new Date(log.date).toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="font-medium text-slate-200">{log.action}</p>
                  {log.reason && (
                    <p className="text-slate-400 text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                      <strong>Motivo:</strong> {log.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setHistoryModalApt(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FICHA DO CLIENTE */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setSelectedUserDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-lg">
                {selectedUserDetail.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-['Cinzel'] text-lg font-bold text-white">
                  {selectedUserDetail.name}
                </h3>
                <span className="text-xs text-slate-400">{selectedUserDetail.city || 'São Paulo - SP'}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">E-mail:</span>
                <span className="font-medium text-white">{selectedUserDetail.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telefone:</span>
                <span className="font-medium text-white">{selectedUserDetail.phone || 'Não cadastrado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CPF:</span>
                <span className="font-mono text-white">{selectedUserDetail.cpf || 'Não cadastrado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cadastro em:</span>
                <span className="text-slate-300">{new Date(selectedUserDetail.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Histórico de Consultas Deste Cliente:
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {appointments
                .filter(a => a.userId === selectedUserDetail.id || a.clientEmail.toLowerCase() === selectedUserDetail.email.toLowerCase())
                .map(apt => (
                  <div key={apt.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">{apt.practiceArea}</span>
                      <span className="text-[11px] text-slate-400 block">{apt.date.split('-').reverse().join('/')} com {apt.lawyerName}</span>
                    </div>
                    <div>{getStatusBadge(apt.status)}</div>
                  </div>
                ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
