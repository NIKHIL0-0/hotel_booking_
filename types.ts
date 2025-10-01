export enum ReservationStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  Completed = 'Completed',
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  guests: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  status: ReservationStatus;
}

export type UserRole = 'admin' | 'superadmin';

export interface AdminUser {
  username: string;
  passwordHash: string; // In a real app, never store plain text passwords
  role: UserRole;
}
