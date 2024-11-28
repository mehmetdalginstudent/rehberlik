import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Calendar } from './components/Calendar';
import { AppointmentForm } from './components/AppointmentForm';
import { AppointmentTypeSelector } from './components/AppointmentTypeSelector';
import { AppointmentConfirmation } from './components/AppointmentConfirmation';
import { AppointmentList } from './components/AppointmentList';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home, Calendar as CalendarIcon, UserCircle, Settings } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-500"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Ana Sayfa
                </Link>
                <Link
                  to="/randevu-turu"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-500"
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Randevu Al
                </Link>
                <Link
                  to="/randevularim"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-500"
                >
                  <UserCircle className="w-5 h-5 mr-2" />
                  Randevularım
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-500"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Yönetim Paneli
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/randevu-turu" element={<AppointmentTypeSelector onSelect={() => {}} />} />
            <Route path="/randevu" element={<AppointmentForm />} />
            <Route path="/randevu-onay" element={<AppointmentConfirmation />} />
            <Route path="/randevularim" element={<AppointmentList />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;