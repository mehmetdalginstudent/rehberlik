import React, { useEffect } from 'react';
import { format, addDays, eachDayOfInterval, isWeekend } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Info, Lock } from 'lucide-react';
import { useAppointmentStore } from '../store/appointmentStore';
import { useAuthStore } from '../store/authStore';
import { generateTimeSlots, isDateSelectable } from '../utils/timeSlots';
import { useNavigate } from 'react-router-dom';
import { Announcements } from './Announcements';

export const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.isAuthenticated);
  const { appointments, blockedSlots, setSelectedSlot } = useAppointmentStore();
  const timeSlots = generateTimeSlots();

  // Sonraki 5 günü al (hafta sonları hariç)
  const nextDays = eachDayOfInterval({
    start: new Date(),
    end: addDays(new Date(), 14)
  }).filter(date => !isWeekend(date)).slice(0, 5);

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(appointment => 
      format(new Date(appointment.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const isSlotTaken = (date: Date, time: string) => {
    return appointments.some(appointment => 
      format(new Date(appointment.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      appointment.time === time
    );
  };

  const isSlotBlocked = (date: Date, time: string) => {
    return blockedSlots.some(slot => 
      slot.date === format(date, 'yyyy-MM-dd') && slot.time === time
    );
  };

  const handleSlotClick = (date: Date, time: string) => {
    if (!isDateSelectable(date) || isSlotTaken(date, time) || isSlotBlocked(date, time)) {
      return;
    }

    setSelectedSlot(format(date, 'yyyy-MM-dd'), time);
    navigate('/randevu-turu');
  };

  return (
    <div className="space-y-6">
      {/* Duyurular */}
      <Announcements />

      {/* Bilgilendirme Kartı */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Randevu Bilgilendirmesi</h3>
            <p className="text-sm text-blue-800 mt-1">
              Randevular hafta içi 12:40 - 17:00 saatleri arasında alınabilir.
              Yeşil kutucuklar müsait saatleri, kırmızı kutucuklar dolu saatleri,
              gri kutucuklar ise kapatılmış saatleri gösterir.
            </p>
          </div>
        </div>
      </div>

      {/* Takvim Grid */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-5 gap-4">
          {nextDays.map((day) => (
            <div key={day.toISOString()} className="space-y-2">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">
                  {format(day, 'EEEE', { locale: tr })}
                </div>
                <div className="text-sm text-gray-600">
                  {format(day, 'd MMMM', { locale: tr })}
                </div>
              </div>

              <div className="space-y-2">
                {timeSlots.map((time) => {
                  const isTaken = isSlotTaken(day, time);
                  const isBlocked = isSlotBlocked(day, time);
                  const isSelectable = isDateSelectable(day);

                  return (
                    <button
                      key={`${day.toISOString()}-${time}`}
                      onClick={() => handleSlotClick(day, time)}
                      disabled={!isSelectable || isTaken || isBlocked}
                      className={`
                        w-full p-2 rounded-lg text-sm flex items-center justify-center gap-2
                        transition-colors duration-200
                        ${!isSelectable
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isTaken
                            ? 'bg-red-100 text-red-800 cursor-not-allowed'
                            : isBlocked
                              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }
                      `}
                    >
                      <Clock className="w-4 h-4" />
                      {time}
                      {isBlocked && <Lock className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};