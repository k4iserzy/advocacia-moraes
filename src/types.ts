export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: UserRole;
  createdAt: string;
  avatar?: string;
  city?: string;
}

export interface Lawyer {
  id: string;
  name: string;
  oab: string;
  title: string;
  specialty: string;
  bio: string;
  experienceYears: number;
  education: string[];
  photo: string;
  email: string;
  instagram: string;
  phone: string;
  availableDays: string[];
  availableHours: string[];
}

export interface Service {
  id: string;
  title: string;
  iconName: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  highlights: string[];
}

export type AppointmentStatus = 'pendente' | 'confirmada' | 'reagendada' | 'cancelada' | 'concluida';
export type AppointmentFormat = 'presencial' | 'online';

export interface AppointmentLog {
  action: string;
  date: string;
  by: string;
  reason?: string;
}

export interface Appointment {
  id: string;
  protocolNumber: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCpf: string;
  lawyerId: string;
  lawyerName: string;
  practiceArea: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  format: AppointmentFormat;
  status: AppointmentStatus;
  notes?: string;
  cancelReason?: string;
  rescheduleReason?: string;
  historyLog: AppointmentLog[];
  createdAt: string;
}

export interface DailyVisitStat {
  date: string;
  visits: number;
  bookings: number;
}

export interface SiteAnalytics {
  totalVisits: number;
  pageViews: number;
  uniqueVisitors: number;
  registeredUsersCount: number;
  totalAppointmentsCount: number;
  confirmedAppointmentsCount: number;
  cancelledAppointmentsCount: number;
  visitsByDay: DailyVisitStat[];
  popularAreas: { area: string; count: number }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'rescheduled' | 'cancelled';
}
