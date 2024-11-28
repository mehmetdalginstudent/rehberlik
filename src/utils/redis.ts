import Redis from 'ioredis';
import type { Appointment } from '../types';

// Redis bağlantısı
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
});

// Cache anahtarları
const CACHE_KEYS = {
  APPOINTMENTS: 'appointments',
  BLOCKED_SLOTS: 'blocked_slots',
  APPOINTMENT_TYPES: 'appointment_types',
};

// Cache süresi (24 saat)
const CACHE_TTL = 60 * 60 * 24;

export const redisCache = {
  // Randevuları önbellekten al
  async getAppointments(): Promise<Appointment[]> {
    try {
      const cached = await redis.get(CACHE_KEYS.APPOINTMENTS);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Redis getAppointments error:', error);
      return [];
    }
  },

  // Randevuları önbelleğe kaydet
  async setAppointments(appointments: Appointment[]): Promise<void> {
    try {
      await redis.setex(
        CACHE_KEYS.APPOINTMENTS,
        CACHE_TTL,
        JSON.stringify(appointments)
      );
    } catch (error) {
      console.error('Redis setAppointments error:', error);
    }
  },

  // Bloke edilmiş slotları önbellekten al
  async getBlockedSlots(): Promise<{ date: string; time: string }[]> {
    try {
      const cached = await redis.get(CACHE_KEYS.BLOCKED_SLOTS);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Redis getBlockedSlots error:', error);
      return [];
    }
  },

  // Bloke edilmiş slotları önbelleğe kaydet
  async setBlockedSlots(slots: { date: string; time: string }[]): Promise<void> {
    try {
      await redis.setex(
        CACHE_KEYS.BLOCKED_SLOTS,
        CACHE_TTL,
        JSON.stringify(slots)
      );
    } catch (error) {
      console.error('Redis setBlockedSlots error:', error);
    }
  },

  // Önbelleği temizle
  async clearCache(): Promise<void> {
    try {
      await redis.del(CACHE_KEYS.APPOINTMENTS, CACHE_KEYS.BLOCKED_SLOTS);
    } catch (error) {
      console.error('Redis clearCache error:', error);
    }
  }
};