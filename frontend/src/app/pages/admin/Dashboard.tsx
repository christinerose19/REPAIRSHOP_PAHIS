import { useState, useEffect } from 'react';
import { Wrench, Clock, CheckCircle, AlertTriangle, Package, Calendar, CheckCircle2, XCircle, Bell, Phone, Mail, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatusBadge } from '../../components/StatusBadge';
import { toast } from 'sonner';

// Define structures for Bookings
interface Booking {
  id: string;
  customerName: string;
  motorcycleModel: string;
  serviceType: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  contactNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  dateCreated: string;
}

const statsDataTemplate = [
  { label: 'Total Repair Jobs', value: '156', icon: Wrench, color: 'bg-blue-500', borderColor: 'border-l-blue-500' },
  { label: 'Pending Repairs', value: '23', icon: Clock, color: 'bg-orange-500', borderColor: 'border-l-orange-500' },
  { label: 'Completed Repairs', value: '98', icon: CheckCircle, color: 'bg-green-500', borderColor: 'border-l-green-500' },
  { label: 'Low Stock Items', value: '8', icon: AlertTriangle, color: 'bg-red-500', borderColor: 'border-l-red-500' },
];

const monthlyData = [
  { month: 'Jan', jobs: 45 },
  { month: 'Feb', jobs: 52 },
  { month: 'Mar', jobs: 48 },
  { month: 'Apr', jobs: 61 },
  { month: 'May', jobs: 55 },
  { month: 'Jun', jobs: 68 },
];

const statusData = [
  { name: 'Pending', value: 23, color: '#f97316' }, 
  { name: 'In Progress', value: 35, color: '#3b82f6' }, 
  { name: 'Completed', value: 98, color: '#10b981' }, 
];

const recentRepairs = [
  { id: 'R-1045', customer: 'John Smith', model: 'XRM 125', status: 'In Progress' as const, date: '2026-05-18' },
  { id: 'R-1044', customer: 'Sarah Johnson', model: 'Raider fi 150', status: 'Pending' as const, date: '2026-05-17' },
  { id: 'R-1043', customer: 'Mike Williams', model: 'Rusi 150', status: 'Completed' as const, date: '2026-05-16' },
  { id: 'R-1042', customer: 'Emma Davis', model: 'Honda Click', status: 'Completed' as const, date: '2026-05-15' },
];

const lowStockItems = [
  { name: 'Engine Oil', quantity: 5, status: 'Low Stock' as const },
  { name: 'Brake Pads', quantity: 3, status: 'Low Stock' as const },
  { name: 'Chain Lubricant', quantity: 7, status: 'Low Stock' as const },
];

export function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load bookings from localStorage
  useEffect(() => {
    const savedBookings = localStorage.getItem('macmac_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const saveBookings = (updatedBookings: Booking[]) => {
    localStorage.setItem('macmac_bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  };

  // Heuristic 1: Visibility of System Status (Actions immediately feedback and update lists)
  const handleApproveBooking = (bookingId: string) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'Approved' as const } : b
    );
    saveBookings(updated);
    toast.success(`Booking ${bookingId} approved and scheduled successfully!`);
  };

  // Heuristic 3: User Control & Freedom (Confirmation for Rejection/Declining to prevent mistakes)
  const handleRejectBooking = (bookingId: string) => {
    if (window.confirm(`Are you sure you want to decline booking request ${bookingId}?`)) {
      const updated = bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'Rejected' as const } : b
      );
      saveBookings(updated);
      toast.success(`Booking request ${bookingId} has been declined.`);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === 'Pending');
  const totalBookingsCount = bookings.length;

  return (
    <div className="p-8 space-y-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Dashboard</h1>
        <p className="text-slate-500 mt-1">Real-time status overview and operational telemetry.</p>
      </div>

      {/* Heuristic 1: Visibility of System Status (Notification Banner) */}
      {pendingBookings.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden animate-pulse">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 text-white p-3 rounded-xl shadow-md shadow-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                New Booking Notifications
                <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-xxs font-mono font-bold">
                  {pendingBookings.length}
                </span>
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Customers have requested {pendingBookings.length} new booking slots. Please review and confirm scheduling slots.
              </p>
            </div>
          </div>
          <a
            href="#booking-appointments-section"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all duration-150 shadow shadow-amber-600/15"
          >
            Review Appointments
          </a>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDataTemplate.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label} 
              className={`bg-white rounded-2xl p-6 border border-slate-200/80 border-l-4 ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase font-mono">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2 font-display">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl shadow-lg shadow-black/5`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Repairs Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-display uppercase">Monthly Repair Jobs</h3>
            <p className="text-slate-400 text-xs mt-0.5">Quantity of bikes serviced over time</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090D16', border: '1px solid #1E293B', borderRadius: '8px', color: '#F1F5F9' }}
                itemStyle={{ color: '#F97316' }}
              />
              <Bar dataKey="jobs" fill="#F97316" radius={[4, 4, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-display uppercase">Repair Status Distribution</h3>
            <p className="text-slate-400 text-xs mt-0.5">Ratio of active tasks vs complete jobs</p>
          </div>
          <div className="flex-1 flex flex-col justify-center py-2">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090D16', border: '1px solid #1E293B', borderRadius: '8px', color: '#F1F5F9' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center flex-wrap gap-5 mt-2">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600 font-medium font-mono">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Appointment Requests Manager (Heuristic 8: Aesthetic and Minimalist Design) */}
      <section id="booking-appointments-section" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden scroll-mt-24">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight font-display uppercase flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-slate-700" />
              Customer Booking Requests Queue
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">Review, confirm, or decline scheduling slots submitted by clients</p>
          </div>
          <span className="text-xxs font-mono bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">
            PENDING: {pendingBookings.length}
          </span>
        </div>

        <div className="p-6">
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const isPending = booking.status === 'Pending';
                return (
                  <div 
                    key={booking.id}
                    className={`p-5 border rounded-2xl transition-all shadow-sm ${
                      isPending ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold text-sm text-slate-900 font-mono">{booking.id}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-semibold border ${
                            booking.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            booking.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            booking.status === 'Rejected' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                            'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mt-1">{booking.customerName}</h4>
                      </div>

                      {/* Booking actions (Heuristic 1: Immediate visibility, Heuristic 3: Declining has verification confirmation) */}
                      {isPending && (
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleRejectBooking(booking.id)}
                            className="px-3.5 py-2 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Decline Request
                          </button>
                          <button
                            onClick={() => handleApproveBooking(booking.id)}
                            className="px-3.5 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow shadow-blue-900/10"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirm Appointment
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-500 leading-normal mb-3">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">// Motorcycle Model</span>
                        <span className="font-semibold text-slate-700 text-sm font-sans">{booking.motorcycleModel}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">// Service Requested</span>
                        <span className="font-semibold text-slate-700 text-sm font-sans">{booking.serviceType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">// Preferred Appointment Date</span>
                        <span className="font-semibold text-[#1e3a8a] text-sm font-sans">
                          {booking.preferredDate} ({booking.preferredTime.includes('Morning') ? 'Morning' : 'Afternoon'})
                        </span>
                      </div>
                    </div>

                    {booking.description && (
                      <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-slate-600 text-xs leading-relaxed mb-3">
                        <span className="text-[10px] text-slate-400 font-mono block uppercase mb-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-slate-400" />
                          Client Symptoms Description
                        </span>
                        {booking.description}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        CONTACT: {booking.contactNumber}
                      </span>
                      <span>RECEIVED: {booking.dateCreated}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-medium">No booking requests available.</p>
              <p className="text-slate-400 text-xs mt-1">Bookings submitted by clients will appear here in real-time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Repairs */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-display uppercase">Recent Repairs</h3>
            <p className="text-slate-400 text-xs mt-0.5">Log of latest repair orders</p>
          </div>
          <div className="space-y-3.5">
            {recentRepairs.map((repair) => (
              <div 
                key={repair.id} 
                className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all duration-150"
              >
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 font-mono">{repair.id}</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{repair.customer}</p>
                  <p className="text-xxs uppercase tracking-wider text-slate-400 mt-1 font-mono">{repair.model}</p>
                </div>
                <div className="text-right flex flex-col items-end justify-between h-full">
                  <StatusBadge status={repair.status} />
                  <p className="text-xxs text-slate-400 mt-2 font-mono">{repair.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight font-display uppercase flex items-center gap-2">
                <Package className="w-4 h-4 text-red-500" />
                Low Stock Alerts
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">Parts requiring immediate replenish</p>
            </div>
          </div>
          <div className="space-y-3.5">
            {lowStockItems.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-red-50/20 border border-red-100/60 rounded-xl"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Quantity: {item.quantity}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
