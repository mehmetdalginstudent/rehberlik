import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, UserRound } from 'lucide-react';
import { APPOINTMENT_TYPES, AppointmentType } from '../types';

interface AppointmentTypeSelectorProps {
  onSelect: (type: AppointmentType) => void;
}

export const AppointmentTypeSelector: React.FC<AppointmentTypeSelectorProps> = ({ onSelect }) => {
  const navigate = useNavigate();

  const handleSelect = (type: AppointmentType) => {
    onSelect(type);
    navigate(`/randevu?type=${type}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Randevu Türünü Seçin</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {APPOINTMENT_TYPES.map((type) => {
          const Icon = type.id === 'student' ? GraduationCap :
                      type.id === 'teacher' ? Users : UserRound;
          
          const colors = type.id === 'student' ? 'bg-blue-50 text-blue-500 hover:bg-blue-100' :
                        type.id === 'teacher' ? 'bg-green-50 text-green-500 hover:bg-green-100' :
                        'bg-purple-50 text-purple-500 hover:bg-purple-100';

          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id as AppointmentType)}
              className={`flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group`}
            >
              <div className={`p-4 rounded-full ${colors} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{type.label}</h3>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                {type.description}
              </p>
              <span className={`mt-6 font-medium text-sm flex items-center gap-2
                ${type.id === 'student' ? 'text-blue-500' :
                  type.id === 'teacher' ? 'text-green-500' :
                  'text-purple-500'}`}
              >
                Randevu Al
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};