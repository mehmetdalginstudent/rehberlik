import { create } from 'zustand';
import { Appointment } from '../types';
import { storageCache } from '../utils/storage';

interface AppointmentStore {
  appointments: Appointment[];
  blockedSlots: { date: string; time: string }[];
  selectedSlot: { date: string; time: string } | null;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  blockTimeSlot: (date: string, time: string) => void;
  unblockTimeSlot: (date: string, time: string) => void;
  isSlotBlocked: (date: string, time: string) => boolean;
  setSelectedSlot: (date: string, time: string) => void;
  clearSelectedSlot: () => void;
  loadInitialData: () => void;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  blockedSlots: [],
  selectedSlot: null,
  
  loadInitialData: () => {
    const appointments = storageCache.getAppointments();
    const blockedSlots = storageCache.getBlockedSlots();
    set({ appointments, blockedSlots });
  },

  addAppointment: (appointment) => {
    const newAppointments = [...get().appointments, appointment];
    set({ appointments: newAppointments });
    storageCache.setAppointments(newAppointments);
  },

  updateAppointment: (id, updatedAppointment) => {
    const newAppointments = get().appointments.map((app) =>
      app.id === id ? { ...app, ...updatedAppointment } : app
    );
    set({ appointments: newAppointments });
    storageCache.setAppointments(newAppointments);
  },

  deleteAppointment: (id) => {
    const newAppointments = get().appointments.filter((app) => app.id !== id);
    set({ appointments: newAppointments });
    storageCache.setAppointments(newAppointments);
  },

  blockTimeSlot: (date: string, time: string) => {
    const newBlockedSlots = [...get().blockedSlots, { date, time }];
    set({ blockedSlots: newBlockedSlots });
    storageCache.setBlockedSlots(newBlockedSlots);
  },

  unblockTimeSlot: (date: string, time: string) => {
    const newBlockedSlots = get().blockedSlots.filter(
      (slot) => !(slot.date === date && slot.time === time)
    );
    set({ blockedSlots: newBlockedSlots });
    storageCache.setBlockedSlots(newBlockedSlots);
  },

  isSlotBlocked: (date: string, time: string) => {
    return get().blockedSlots.some(
      (slot) => slot.date === date && slot.time === time
    );
  },

  setSelectedSlot: (date: string, time: string) => {
    set({ selectedSlot: { date, time } });
  },

  clearSelectedSlot: () => {
    set({ selectedSlot: null });
  },
}));

// İlk yüklemede verileri localStorage'dan al
useAppointmentStore.getState().loadInitialData();