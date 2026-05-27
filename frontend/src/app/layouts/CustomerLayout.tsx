import { Outlet, useNavigate } from 'react-router';
import { Wrench, LogOut } from 'lucide-react';

export function CustomerLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-600/20">
              <Wrench className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 font-display">MacMAc Shop</h1>
              <p className="text-xxs uppercase tracking-wider text-orange-500 font-semibold">Customer Portal</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-500 hover:bg-red-500/5 border border-slate-200 hover:border-red-500/10 rounded-xl transition-all duration-200 font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
