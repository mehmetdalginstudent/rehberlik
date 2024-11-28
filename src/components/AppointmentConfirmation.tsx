import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAppointmentStore } from '../store/appointmentStore';

export const AppointmentConfirmation: React.FC = () => {
  const appointments = useAppointmentStore((state) => state.appointments);
  const lastAppointment = appointments[appointments.length - 1];

  if (!lastAppointment) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Randevunuz Başarıyla Oluşturuldu!</h2>
        <div className="space-y-4 mb-8">
          <p className="text-gray-600">
            <span className="font-semibold">Tarih:</span>{' '}
            {new Date(lastAppointment.date).toLocaleDateString('tr-TR')}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Saat:</span> {lastAppointment.time}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Ad Soyad:</span> {lastAppointment.clientName}
          </p>
        </div>
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            to="/randevularim"
            className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Randevularımı Görüntüle
          </Link>
        </div>
      </div>
    </div>
  );
};