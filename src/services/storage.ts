import {
  User, Lawyer, Service, Appointment, SiteAnalytics,
  AppointmentStatus, AppointmentFormat, NotificationItem, AppointmentLog
} from '../types';
import { supabase } from './supabase';
import { INITIAL_LAWYERS, INITIAL_SERVICES } from '../data/initialData';

const CURRENT_USER_KEY = 'moraes_current_user_v1';
const VISITED_SESSION_KEY = 'moraes_session_counted_v1';
const createId = (): string => {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID();
  if (cryptoApi?.getRandomValues) {
    const bytes = new Uint8Array(16);
    cryptoApi.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return [...bytes].map((byte, index) => {
      const hex = byte.toString(16).padStart(2, '0');
      return [4, 6, 8, 10].includes(index) ? `-${hex}` : hex;
    }).join('');
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const toUser = (row: any): User => ({ id: row.id, name: row.name, email: row.email, phone: row.phone, cpf: row.cpf || '', role: row.role, city: row.city || undefined, avatar: row.avatar || undefined, createdAt: row.created_at });
const toLawyer = (row: any): Lawyer => ({ id: row.id, name: row.name, oab: row.oab, title: row.title, specialty: row.specialty, bio: row.bio, experienceYears: row.experience_years, education: row.education || [], photo: row.photo, email: row.email, instagram: row.instagram, phone: row.phone, availableDays: row.available_days || [], availableHours: row.available_hours || [] });
const toService = (row: any): Service => ({ id: row.id, title: row.title, iconName: row.icon_name, category: row.category, shortDesc: row.short_desc, fullDesc: row.full_desc, highlights: row.highlights || [] });
const toLog = (row: any): AppointmentLog => ({ action: row.action, date: row.logged_at, by: row.actor, reason: row.reason || undefined });
const toAppointment = (row: any, logs: any[] = []): Appointment => ({ id: row.id, protocolNumber: row.protocol_number, userId: row.user_id, clientName: row.client_name, clientEmail: row.client_email, clientPhone: row.client_phone, clientCpf: row.client_cpf, lawyerId: row.lawyer_id, lawyerName: row.lawyer_name, practiceArea: row.practice_area, date: row.appointment_date, time: row.appointment_time.slice(0, 5), format: row.format, status: row.status, notes: row.notes || undefined, cancelReason: row.cancel_reason || undefined, rescheduleReason: row.reschedule_reason || undefined, historyLog: logs.map(toLog), createdAt: row.created_at });

class StorageService {
  public async init() {
    await this.recordPageVisit();
  }

  public async recordPageVisit() {
    const isNewSession = !sessionStorage.getItem(VISITED_SESSION_KEY);
    const today = new Date().toISOString().slice(0, 10);
    const { data: current, error: currentError } = await supabase.from('site_analytics').select('*').eq('id', true).maybeSingle();
    if (currentError) throw currentError;
    const analytics = current || { id: true, total_visits: 0, page_views: 0, unique_visitors: 0, registered_users_count: 0, total_appointments_count: 0, confirmed_appointments_count: 0, cancelled_appointments_count: 0 };
    analytics.page_views += 1;
    if (isNewSession) {
      analytics.total_visits += 1;
      analytics.unique_visitors += 1;
      sessionStorage.setItem(VISITED_SESSION_KEY, 'true');
      const { data: day } = await supabase.from('analytics_daily_visits').select('*').eq('visit_date', today).maybeSingle();
      const { error: dayError } = await supabase.from('analytics_daily_visits').upsert({ visit_date: today, visits: (day?.visits || 0) + 1, bookings: day?.bookings || 0 });
      if (dayError) throw dayError;
    }
    const { error } = await supabase.from('site_analytics').upsert(analytics);
    if (error) throw error;
  }

  public getCurrentUser(): User | null {
    try { const data = localStorage.getItem(CURRENT_USER_KEY); return data ? JSON.parse(data) : null; } catch { return null; }
  }

  public setCurrentUser(user: User | null) {
    if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(CURRENT_USER_KEY);
  }

  public async getUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('id,name,email,phone,cpf,role,city,avatar,created_at').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(toUser);
  }

  public async registerUser(name: string, email: string, phone: string, cpf: string, password: string, city?: string): Promise<User> {
    const { data, error } = await supabase.rpc('register_public_user', {
      p_id: `user-${createId()}`,
      p_name: name,
      p_email: email,
      p_phone: phone,
      p_cpf: cpf || null,
      p_password: password,
      p_city: city || 'São Paulo - SP'
    });
    if (error) throw error;
    const user = toUser(Array.isArray(data) ? data[0] : data);
    this.setCurrentUser(user);
    return user;
  }

  public async loginUser(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.rpc('authenticate_public_user', {
      p_email: email,
      p_password: password
    });
    if (error) throw error;
    if (!data?.length) return null;
    const user = toUser(data[0]);
    this.setCurrentUser(user);
    return user;
  }

  public async getLawyers(): Promise<Lawyer[]> {
    const { data, error } = await supabase.from('lawyers').select('*').order('name');
    if (error) throw error;
    if (data?.length) return data.map(toLawyer);

    const rows = INITIAL_LAWYERS.map(lawyer => ({
      id: lawyer.id,
      name: lawyer.name,
      oab: lawyer.oab,
      title: lawyer.title,
      specialty: lawyer.specialty,
      bio: lawyer.bio,
      experience_years: lawyer.experienceYears,
      education: lawyer.education,
      photo: lawyer.photo,
      email: lawyer.email,
      instagram: lawyer.instagram,
      phone: lawyer.phone,
      available_days: lawyer.availableDays,
      available_hours: lawyer.availableHours
    }));
    const { error: seedError } = await supabase.from('lawyers').upsert(rows);
    if (seedError) throw seedError;
    return INITIAL_LAWYERS;
  }

  public async getServices(): Promise<Service[]> {
    const { data, error } = await supabase.from('services').select('*').order('title');
    if (error) throw error;
    return data?.length ? data.map(toService) : INITIAL_SERVICES;
  }

  public async getAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase.from('appointments').select('*').order('appointment_date', { ascending: false }).order('appointment_time', { ascending: false });
    if (error) throw error;
    const rows = data || [];
    if (!rows.length) return [];
    const { data: logs, error: logsError } = await supabase.from('appointment_logs').select('*').in('appointment_id', rows.map(row => row.id)).order('logged_at');
    if (logsError) throw logsError;
    return rows.map(row => toAppointment(row, (logs || []).filter(log => log.appointment_id === row.id)));
  }

  public async createAppointment(params: { userId: string; clientName: string; clientEmail: string; clientPhone: string; clientCpf: string; lawyerId: string; lawyerName: string; practiceArea: string; date: string; time: string; format: AppointmentFormat; notes?: string }): Promise<Appointment> {
    const now = new Date().toISOString();
    const row = { id: `apt-${createId()}`, protocol_number: `MA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, user_id: params.userId, client_name: params.clientName, client_email: params.clientEmail, client_phone: params.clientPhone, client_cpf: params.clientCpf, lawyer_id: params.lawyerId, lawyer_name: params.lawyerName, practice_area: params.practiceArea, appointment_date: params.date, appointment_time: params.time, format: params.format, status: 'confirmada', notes: params.notes || null, created_at: now };
    const { data, error } = await supabase.from('appointments').insert(row).select().single();
    if (error) throw new Error(error.code === '23505' ? 'Este horário não está mais disponível.' : error.message);
    const { error: logsError } = await supabase.from('appointment_logs').insert([{ appointment_id: row.id, action: 'Consulta agendada pelo cliente', actor: params.clientName, reason: 'Agendamento inicial via plataforma online', logged_at: now }, { appointment_id: row.id, action: 'Confirmação automática de protocolo', actor: 'Sistema Moraes & Associados', logged_at: now }]);
    if (logsError) throw logsError;
    await this.addNotification({ userId: params.userId, title: `Consulta Confirmada (${row.protocol_number})`, message: `Sua consulta de ${params.practiceArea} com ${params.lawyerName} foi agendada para ${params.date} às ${params.time} (${params.format}).`, type: 'success' });
    return toAppointment(data, []);
  }

  private async updateAppointment(appointmentId: string, values: Record<string, any>, action: string, actor: string, reason?: string) {
    const { data, error } = await supabase.from('appointments').update(values).eq('id', appointmentId).select().single();
    if (error) throw error;
    const { error: logError } = await supabase.from('appointment_logs').insert({ appointment_id: appointmentId, action, actor, reason });
    if (logError) throw logError;
    return toAppointment(data);
  }

  public async rescheduleAppointment(appointmentId: string, newDate: string, newTime: string, reason: string, adminName: string): Promise<Appointment | null> {
    const appointment = await this.updateAppointment(appointmentId, { appointment_date: newDate, appointment_time: newTime, status: 'reagendada', reschedule_reason: reason }, `Consulta reagendada para ${newDate} às ${newTime}`, adminName || 'Administrador', reason);
    await this.addNotification({ userId: appointment.userId, title: `Consulta Reagendada (${appointment.protocolNumber})`, message: `Sua consulta foi reagendada para ${newDate} às ${newTime}. Motivo: "${reason}".`, type: 'rescheduled' });
    return appointment;
  }

  public async cancelAppointment(appointmentId: string, reason: string, actorName: string): Promise<Appointment | null> {
    const appointment = await this.updateAppointment(appointmentId, { status: 'cancelada', cancel_reason: reason }, 'Consulta cancelada', actorName || 'Administrador', reason);
    await this.addNotification({ userId: appointment.userId, title: `Consulta Cancelada (${appointment.protocolNumber})`, message: `A consulta do dia ${appointment.date} foi cancelada. Motivo: "${reason}".`, type: 'cancelled' });
    return appointment;
  }

  public async updateAppointmentStatus(appointmentId: string, newStatus: AppointmentStatus, actorName: string): Promise<Appointment | null> {
    return this.updateAppointment(appointmentId, { status: newStatus }, `Status alterado para ${newStatus.toUpperCase()}`, actorName);
  }

  public async getAnalytics(): Promise<SiteAnalytics> {
    const [{ data: summary, error: summaryError }, { data: daily, error: dailyError }, { data: popular, error: popularError }] = await Promise.all([supabase.from('site_analytics').select('*').eq('id', true).maybeSingle(), supabase.from('analytics_daily_visits').select('*').order('visit_date', { ascending: true }).limit(7), supabase.from('analytics_popular_areas').select('*').order('count', { ascending: false })]);
    if (summaryError || dailyError || popularError) throw summaryError || dailyError || popularError;
    const base = summary || {};
    return { totalVisits: base.total_visits || 0, pageViews: base.page_views || 0, uniqueVisitors: base.unique_visitors || 0, registeredUsersCount: base.registered_users_count || 0, totalAppointmentsCount: base.total_appointments_count || 0, confirmedAppointmentsCount: base.confirmed_appointments_count || 0, cancelledAppointmentsCount: base.cancelled_appointments_count || 0, visitsByDay: (daily || []).map(item => ({ date: new Date(`${item.visit_date}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), visits: item.visits, bookings: item.bookings })), popularAreas: (popular || []).map(item => ({ area: item.area, count: item.count })) };
  }

  public async getNotifications(userId?: string): Promise<NotificationItem[]> {
    let query = supabase.from('notifications').select('*').order('notification_date', { ascending: false });
    if (userId) query = query.or(`user_id.eq.${userId},user_id.eq.all`);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(item => ({ id: item.id, userId: item.user_id, title: item.title, message: item.message, date: item.notification_date, read: item.is_read, type: item.type }));
  }

  public async addNotification(item: Omit<NotificationItem, 'id' | 'date' | 'read'>) {
    const { error } = await supabase.from('notifications').insert({ id: `notif-${createId()}`, user_id: item.userId, title: item.title, message: item.message, type: item.type });
    if (error) throw error;
  }

  public async markNotificationAsRead(id: string) {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    if (error) throw error;
  }
}

export const storage = new StorageService();
