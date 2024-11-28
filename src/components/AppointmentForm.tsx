import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppointmentStore } from '../store/appointmentStore';
import { generateTimeSlots, isDateSelectable } from '../utils/timeSlots';
import { APPOINTMENT_TYPES, AppointmentType } from '../types';
import { sanitizeInput } from '../utils/security';

export const AppointmentForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentType = searchParams.get('type') as AppointmentType;
  const selectedSlot = useAppointmentStore((state) => state.selectedSlot);
  const clearSelectedSlot = useAppointmentStore((state) => state.clearSelectedSlot);

  const [formData, setFormData] = useState({
    date: selectedSlot?.date || '',
    time: selectedSlot?.time || '',
    clientName: '',
    type: appointmentType,
    summary: ''
  });

  useEffect(() => {
    if (!appointmentType) {
      navigate('/');
      return;
    }

    // Form doldurulduğunda seçili slot'u temizle
    return () => clearSelectedSlot();
  }, [appointmentType, navigate, clearSelectedSlot]);

  const addAppointment = useAppointmentStore((state) => state.addAppointment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedSummary = sanitizeInput(formData.summary);
    
    addAppointment({
      id: Date.now().toString(),
      ...formData,
      summary: sanitizedSummary,
      date: new Date(formData.date),
      status: 'pending',
    });
    navigate('/randevu-onay');
  };

  const selectedType = APPOINTMENT_TYPES.find(type => type.id === appointmentType);
  const today = new Date().toISOString().split('T')[0];

  if (!selectedType) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-lg shadow">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">{selectedType.label}</h2>
        <p className="text-gray-600 text-sm">{selectedType.description}</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
        <input
          type="date"
          value={formData.date}
          min={today}
          onChange={(e) => {
            const selectedDate = new Date(e.target.value);
            if (isDateSelectable(selectedDate)) {
              setFormData({ ...formData, date: e.target.value });
            } else {
              alert('Bu tarih için randevu alınamaz. Lütfen başka bir tarih seçin.');
            }
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Saat</label>
        <select
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Saat seçiniz</option>
          {generateTimeSlots().map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
        <input
          type="text"
          value={formData.clientName}
          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Randevu konusunu kısaca özetleyin
          <span className="text-gray-500 text-xs ml-1">
            (Maksimum 200 karakter)
          </span>
        </label>
        <textarea
          value={formData.summary}
          onChange={(e) => {
            const text = e.target.value;
            if (text.length <= 200) {
              setFormData({ ...formData, summary: text });
            }
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          required
          maxLength={200}
        />
        <div className="text-right text-sm text-gray-500">
          {formData.summary.length}/200
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Randevu Oluştur
      </button>
    </form>
  );
};