import type { Appointment, Announcement } from '../types';

const STORAGE_KEYS = {
  APPOINTMENTS: 'appointments',
  BLOCKED_SLOTS: 'blocked_slots',
  ANNOUNCEMENTS: 'announcements',
};

export const storageCache = {
  getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Storage getAppointments error:', error);
      return [];
    }
  },

  setAppointments(appointments: Appointment[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (error) {
      console.error('Storage setAppointments error:', error);
    }
  },

  getBlockedSlots(): { date: string; time: string }[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BLOCKED_SLOTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Storage getBlockedSlots error:', error);
      return [];
    }
  },

  setBlockedSlots(slots: { date: string; time: string }[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_SLOTS, JSON.stringify(slots));
    } catch (error) {
      console.error('Storage setBlockedSlots error:', error);
    }
  },

  getAnnouncements(): Announcement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Storage getAnnouncements error:', error);
      return [];
    }
  },

  setAnnouncements(announcements: Announcement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
    } catch (error) {
      console.error('Storage setAnnouncements error:', error);
    }
  },

  clearStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
      localStorage.removeItem(STORAGE_KEYS.BLOCKED_SLOTS);
      localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    } catch (error) {
      console.error('Storage clearStorage error:', error);
    }
  }
};