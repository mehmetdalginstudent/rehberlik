import React, { useState } from 'react';
import { useAppointmentStore } from '../store/appointmentStore';
import { Calendar, Clock, User, Edit2, X } from 'lucide-react';
import { generateTimeSlots, isDateSelectable } from '../utils/timeSlots';
import type { Appointment } from '../types';

export const AppointmentList: React.FC = () => {
  const { appointments, updateAppointment } = useAppointmentStore();
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  const handleDateChange = (date: string) => {
    const selectedDate = new Date(date);
    if (isDateSelectable(selectedDate)) {
      const slots = generateTimeSlots(selectedDate);
      setAvailableTimeSlots(slots);
      if (editingAppointment) {
        setEditingAppointment({
          ...editingAppointment,
          date: selectedDate,
          time: slots[0] || editingAppointment.time
        });
      }
    } else {
      alert('Bu tarih için randevu alınamaz. Lütfen başka bir tarih seçin.');
    }
  };

  const handleUpdate = () => {
    if (editingAppointment) {
      updateAppointment(editingAppointment.id, editingAppointment);
      setEditingAppointment(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Randevularım</h2>
      
      {appointments.length === 0 ? (
        <p className="text-gray-600 text-center py-8">Henüz randevunuz bulunmamaktadır.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">
                    {new Date(appointment.date).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-purple-500" />
                  <span>{appointment.clientName}</span>
                </div>
                <button
                  onClick={() => {
                    setEditingAppointment(appointment);
                    const slots = generateTimeSlots(new Date(appointment.date));
                    setAvailableTimeSlots(slots);
                  }}
                  className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Düzenleme Modalı */}
      {editingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Randevu Düzenle</h3>
              <button
                onClick={() => setEditingAppointment(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={editingAppointment.date.toISOString().split('T')[0]}
                  min={today}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saat
                </label>
                <select
                  value={editingAppointment.time}
                  onChange={(e) => setEditingAppointment({
                    ...editingAppointment,
                    time: e.target.value
                  })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {availableTimeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingAppointment(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};