import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useAnnouncementStore } from '../store/announcementStore';
import { Calendar } from './Calendar';
import { Trash2, LogOut, FileText, Plus, Megaphone } from 'lucide-react';
import { APPOINTMENT_TYPES } from '../types';
import { format, addDays } from 'date-fns';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { appointments, deleteAppointment } = useAppointmentStore();
  const { announcements, addAnnouncement, removeAnnouncement } = useAnnouncementStore();
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    expiresAt: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
  });

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
      deleteAppointment(id);
    }
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      ...newAnnouncement,
      expiresAt: new Date(newAnnouncement.expiresAt)
    });
    setNewAnnouncement({
      title: '',
      content: '',
      expiresAt: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    });
    setShowAnnouncementForm(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (window.confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
      removeAnnouncement(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Yönetim Paneli</h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış Yap
          </button>
        </div>

        <div className="grid gap-6">
          {/* Duyuru Yönetimi */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                Duyurular
              </h2>
              <button
                onClick={() => setShowAnnouncementForm(true)}
                className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Duyuru
              </button>
            </div>

            {showAnnouncementForm && (
              <form onSubmit={handleAnnouncementSubmit} className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İçerik
                  </label>
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Geçerlilik Süresi
                  </label>
                  <input
                    type="date"
                    value={newAnnouncement.expiresAt}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiresAt: e.target.value })}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementForm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Duyuru Ekle
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-blue-900 mb-2">
                        {announcement.title}
                      </h3>
                      <p className="text-blue-800 mb-2">{announcement.content}</p>
                      <div className="text-sm text-blue-600">
                        Oluşturulma: {format(new Date(announcement.createdAt), 'dd.MM.yyyy')}
                        <br />
                        Son Geçerlilik: {format(new Date(announcement.expiresAt), 'dd.MM.yyyy')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Calendar />
          
          {/* Randevular */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tüm Randevular</h2>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{appointment.clientName}</p>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {APPOINTMENT_TYPES.find(type => type.id === appointment.type)?.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {format(new Date(appointment.date), 'dd.MM.yyyy')} - {appointment.time}
                    </p>
                    {appointment.summary && (
                      <div className="mt-2 flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{appointment.summary}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};