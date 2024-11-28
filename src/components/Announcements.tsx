import React from 'react';
import { useAnnouncementStore } from '../store/announcementStore';
import { Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export const Announcements: React.FC = () => {
  const activeAnnouncements = useAnnouncementStore(state => state.getActiveAnnouncements());

  if (activeAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-blue-500" />
        Duyurular
      </h2>
      <div className="space-y-4">
        {activeAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg"
          >
            <h3 className="font-medium text-lg text-blue-900 mb-2">
              {announcement.title}
            </h3>
            <p className="text-blue-800 mb-2">{announcement.content}</p>
            <div className="text-sm text-blue-600">
              {format(new Date(announcement.createdAt), 'd MMMM yyyy', { locale: tr })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};