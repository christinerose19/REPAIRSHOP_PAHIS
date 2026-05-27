import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Wrench, Package, ShoppingCart, Users, LogOut } from 'lucide-react';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  useEffect(() => {
    const checkBookings = () => {
      try {
        const savedBookings = localStorage.getItem('macmac_bookings');
        if (savedBookings) {
          const bookings = JSON.parse(savedBookings);
          const count = bookings.filter((b: any) => b.status === 'Pending').length;
          setPendingBookingsCount(count);
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkBookings();

    window.addEventListener('storage', checkBookings);
    const interval = setInterval(checkBookings, 2000);

    return () => {
      window.removeEventListener('storage', checkBookings);
      clearInterval(interval);
    };
  }, []);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/repair-jobs', icon: Wrench, label: 'Repair Jobs' },
    { path: '/admin/inventory', icon: Package, label: 'Inventory' },
    { path: '/admin/pos', icon: ShoppingCart, label: 'POS' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-68 bg-[#090D16] border-r border-[#1E293B]/60 text-slate-200 flex flex-col shadow-2xl relative z-10">
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-[#1E293B]/60 bg-[#070A10]/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-600/20">
              <Wrench className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white font-display">MacMAc Shop</h1>
              <p className="text-xxs uppercase tracking-wider text-orange-500 font-semibold">Admin Command</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative ${active
                    ? 'bg-gradient-to-r from-orange-600/15 to-red-600/5 text-orange-500 font-semibold border border-orange-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#111827]/60 border border-transparent'
                  }`}
              >
                {/* Active Indicator Bar */}
                {active && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-orange-500 to-red-600 rounded-r-full" />
                )}

                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                <span className="text-sm font-medium tracking-wide flex-1 text-left">{item.label}</span>
                {item.label === 'Dashboard' && pendingBookingsCount > 0 && (
                  <span className="bg-amber-500 text-white font-bold font-mono px-2.5 py-0.5 text-[10px] rounded-full shadow-sm animate-pulse">
                    {pendingBookingsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-[#1E293B]/60 bg-[#070A10]/30 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-[#F8FAFC]">
        <Outlet />
      </main>
    </div>
  );
}
