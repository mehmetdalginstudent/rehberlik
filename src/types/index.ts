export type AppointmentType = 'student' | 'teacher' | 'parent';

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  clientName: string;
  type: AppointmentType;
  summary: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  role: 'client' | 'counselor';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export const APPOINTMENT_TYPES = [
  { id: 'student', label: 'Öğrenci Görüşmesi', description: 'Akademik başarı ve kişisel gelişim danışmanlığı' },
  { id: 'teacher', label: 'Öğretmen Görüşmesi', description: 'Mesleki gelişim ve öğrenci değerlendirme görüşmesi' },
  { id: 'parent', label: 'Veli Görüşmesi', description: 'Öğrenci gelişimi ve aile danışmanlığı hizmeti' }
] as const;