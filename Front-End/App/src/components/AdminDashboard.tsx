import { useState } from 'react';
import { useAuth } from './AuthContext';
import { LogOut, User, LayoutDashboard, LayoutGrid } from 'lucide-react';
import AdminSchedule from './AdminSchedule';
import AdminOverview from './AdminOverview';
import Logo from './Logo';

type Page = 'dashboard' | 'schedule';

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#023EBA] via-blue-700 to-gray-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo tone="reversed" size={26} />
              <div className="h-6 w-px bg-white/30" />
              <div>
                <p className="text-sm leading-tight">Admin</p>
                <p className="text-xs text-indigo-100 leading-tight">Dashboard Administrator</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <User className="w-5 h-5" />
                <span>{user?.name || 'Admin'}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
              >
                <LogOut className="w-5 h-5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                currentPage === 'dashboard'
                  ? 'border-[#023EBA] text-[#023EBA]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentPage('schedule')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                currentPage === 'schedule'
                  ? 'border-[#023EBA] text-[#023EBA]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              <span>Jadwal</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <AdminOverview />}
        {currentPage === 'schedule' && <AdminSchedule />}
      </main>
    </div>
  );
}