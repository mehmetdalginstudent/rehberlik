import { create } from 'zustand';
import { Announcement } from '../types';
import { storageCache } from '../utils/storage';

interface AnnouncementStore {
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'isActive'>) => void;
  removeAnnouncement: (id: string) => void;
  getActiveAnnouncements: () => Announcement[];
  loadAnnouncements: () => void;
}

export const useAnnouncementStore = create<AnnouncementStore>((set, get) => ({
  announcements: [],

  loadAnnouncements: () => {
    const announcements = storageCache.getAnnouncements();
    // Süresi geçmiş duyuruları filtrele
    const currentAnnouncements = announcements.filter(announcement => 
      new Date(announcement.expiresAt) > new Date()
    );
    set({ announcements: currentAnnouncements });
  },

  addAnnouncement: (announcement) => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      createdAt: new Date(),
      isActive: true,
      ...announcement,
    };

    const updatedAnnouncements = [...get().announcements, newAnnouncement];
    set({ announcements: updatedAnnouncements });
    storageCache.setAnnouncements(updatedAnnouncements);
  },

  removeAnnouncement: (id) => {
    const updatedAnnouncements = get().announcements.filter(a => a.id !== id);
    set({ announcements: updatedAnnouncements });
    storageCache.setAnnouncements(updatedAnnouncements);
  },

  getActiveAnnouncements: () => {
    const now = new Date();
    return get().announcements.filter(
      announcement => 
        announcement.isActive && 
        new Date(announcement.expiresAt) > now
    );
  },
}));