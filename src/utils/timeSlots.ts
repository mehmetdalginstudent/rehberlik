import { isAfter, isBefore, setHours, setMinutes, format, isWeekend } from 'date-fns';

export const generateTimeSlots = () => {
  const slots: string[] = [];
  let hour = 12;
  let minute = 40;

  while (hour < 17 || (hour === 17 && minute === 0)) {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    slots.push(timeString);
    
    minute += 30;
    if (minute >= 60) {
      minute = minute - 60;
      hour += 1;
    }
  }

  return slots;
};

export const isDateSelectable = (date: Date) => {
  const now = new Date();
  const lastAppointmentTime = setMinutes(setHours(date, 17), 0);
  
  // Hafta sonu kontrolü
  if (isWeekend(date)) {
    return false;
  }
  
  // Eğer seçilen gün bugünse ve şu anki saat son randevu saatini geçmişse
  if (date.toDateString() === now.toDateString() && isAfter(now, lastAppointmentTime)) {
    return false;
  }
  
  // Geçmiş günleri seçilemez yap
  if (isBefore(date, setHours(now, 0))) {
    return false;
  }

  return true;
};