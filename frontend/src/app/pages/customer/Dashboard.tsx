import { useState, useEffect } from 'react';
import { Search, Clock, Wrench, CheckCircle, Calendar, Plus, Trash2, ShieldCheck, ClipboardList, AlertCircle, Info } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { toast } from 'sonner';

// Define repair history (original static data)
const repairHistory = [
  {
    id: 'R-1045',
    model: 'Honda CBR 600',
    problem: 'Engine oil change and brake inspection',
    status: 'In Progress' as const,
    date: '2026-05-18',
    estimatedCost: '₱150',
  },
  {
    id: 'R-1038',
    model: 'Honda CBR 600',
    problem: 'Chain replacement and tire change',
    status: 'Completed' as const,
    date: '2026-04-22',
    estimatedCost: '₱280',
  },
  {
    id: 'R-1029',
    model: 'Honda CBR 600',
    problem: 'Battery replacement',
    status: 'Completed' as const,
    date: '2026-03-15',
    estimatedCost: '₱120',
  },
];

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

// Initial mock bookings to demonstrate systems status
const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'BK-9901',
    customerName: 'John Smith',
    motorcycleModel: 'Honda CBR 600',
    serviceType: 'Engine Tune-up (Service)',
    description: 'Tune up and engine calibration check.',
    preferredDate: '2026-06-02',
    preferredTime: 'Morning (8 AM - 12 PM)',
    contactNumber: '(555) 019-2834',
    status: 'Approved',
    dateCreated: '2026-05-24',
  },
  {
    id: 'BK-9902',
    customerName: 'John Smith',
    motorcycleModel: 'Honda CBR 600',
    serviceType: 'Oil Change Service',
    description: 'Engine oil and filter renewal.',
    preferredDate: '2026-06-10',
    preferredTime: 'Afternoon (1 PM - 5 PM)',
    contactNumber: '(555) 019-2834',
    status: 'Pending',
    dateCreated: '2026-05-25',
  }
];

export function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<'repairs' | 'bookings'>('repairs');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Form input state
  const [formModel, setFormModel] = useState('Honda CBR 600'); // Pre-filled for recognition rather than recall
  const [formService, setFormService] = useState('Oil Change Service');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('Morning (8 AM - 12 PM)');
  const [formContact, setFormContact] = useState('(555) 019-2834');
  
  // Validation errors state (Heuristic 9: Recognize and diagnose errors)
  const [errors, setErrors] = useState<{ model?: string; date?: string; contact?: string }>({});

  // Fetch bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('macmac_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      localStorage.setItem('macmac_bookings', JSON.stringify(DEFAULT_BOOKINGS));
      setBookings(DEFAULT_BOOKINGS);
    }
  }, []);

  // Sync state back to localStorage
  const saveBookings = (newBookings: Booking[]) => {
    localStorage.setItem('macmac_bookings', JSON.stringify(newBookings));
    setBookings(newBookings);
  };

  const handleQuickBook = (serviceType: string, packageName: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'John Smith',
      motorcycleModel: 'Honda CBR 600',
      serviceType: serviceType,
      description: `One-click quick book: ${packageName}`,
      preferredDate: tomorrowStr,
      preferredTime: 'Morning (8 AM - 12 PM)',
      contactNumber: '(555) 019-2834',
      status: 'Pending',
      dateCreated: new Date().toISOString().split('T')[0],
    };

    const updated = [newBooking, ...bookings];
    saveBookings(updated);

    toast.success(`⚡ Quick Book Successful! Booked ${packageName} for tomorrow morning.`);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors: typeof errors = {};

    // Heuristic 5: Error Prevention
    if (!formModel.trim()) {
      newErrors.model = 'Motorcycle model is required.';
    }
    if (!formDate) {
      newErrors.date = 'Preferred date is required.';
    } else {
      const selected = new Date(formDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.date = 'Date cannot be in the past.';
      }
    }
    if (!formContact.trim()) {
      newErrors.contact = 'Contact number is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please correct the validation errors before submitting.');
      return;
    }

    // Clear validation errors
    setErrors({});

    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'John Smith',
      motorcycleModel: formModel,
      serviceType: formService,
      description: formDesc,
      preferredDate: formDate,
      preferredTime: formTime,
      contactNumber: formContact,
      status: 'Pending',
      dateCreated: new Date().toISOString().split('T')[0],
    };

    const updated = [newBooking, ...bookings];
    saveBookings(updated);

    // Heuristic 1: Visibility of system status (Toast success feedback)
    toast.success('Your booking request has been submitted successfully! Check status below.');
    
    // Heuristic 8: Aesthetic and Minimalist Design (Clear form inputs on success)
    setFormDesc('');
    setFormDate('');
  };

  // Heuristic 3: User Control and Freedom (Cancel Booking)
  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking appointment?')) {
      const updated = bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
      );
      saveBookings(updated);
      toast.success('Booking cancelled successfully.');
    }
  };

  const filteredRepairs = repairHistory.filter(
    (repair) =>
      repair.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.problem.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRepairs = repairHistory.filter((r) => r.status === 'Pending' || r.status === 'In Progress');
  const completedRepairs = repairHistory.filter((r) => r.status === 'Completed');

  // Custom status component for bookings
  const BookingBadge = ({ status }: { status: Booking['status'] }) => {
    const getBadgeStyle = () => {
      switch (status) {
        case 'Pending':
          return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'Approved':
          return 'bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse';
        case 'Rejected':
          return 'bg-rose-100 text-rose-700 border-rose-200';
        case 'Cancelled':
          return 'bg-slate-100 text-slate-500 border-slate-200';
      }
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
        {status}
      </span>
    );
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Customer Center</h1>
          <p className="text-slate-500 mt-1">Manage repair jobs, book appointments, and view service metrics.</p>
        </div>

        {/* Tab Switcher (Heuristic 4: Consistency & Standards) */}
        <div className="inline-flex p-1 bg-slate-200/60 rounded-xl self-start sm:self-center border border-slate-300/40">
          <button
            onClick={() => setActiveTab('repairs')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'repairs'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Repairs & History
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'bookings'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Book a Service
          </button>
        </div>
      </div>

      {activeTab === 'repairs' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 border-l-4 border-l-orange-500 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase font-mono">Active Repairs</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2 font-display">{pendingRepairs.length}</p>
                </div>
                <div className="bg-orange-500 p-3 rounded-xl shadow-lg shadow-orange-500/10">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 border-l-4 border-l-emerald-500 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase font-mono">Completed</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2 font-display">{completedRepairs.length}</p>
                </div>
                <div className="bg-[#10b981] p-3 rounded-xl shadow-lg shadow-emerald-500/10">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 border-l-4 border-l-blue-500 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase font-mono">Total Repairs</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2 font-display">{repairHistory.length}</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-xl shadow-lg shadow-blue-500/10">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Current Repair Status Alert Panel */}
          {pendingRepairs.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2.5 h-full bg-gradient-to-b from-orange-500 to-red-600" />
              <h2 className="text-lg font-bold text-white tracking-tight font-display mb-4 uppercase ml-2">// Current Active Operations</h2>
              
              <div className="space-y-4">
                {pendingRepairs.map((repair) => (
                  <div key={repair.id} className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 ml-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                      <div>
                        <p className="font-bold text-white font-mono text-sm">{repair.id}</p>
                        <p className="text-xs text-orange-500 font-mono mt-0.5">{repair.model}</p>
                      </div>
                      <div>
                        <StatusBadge status={repair.status} />
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{repair.problem}</p>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-4 text-xs font-mono text-slate-500">
                      <span>ESTIMATED COST: <strong className="text-white">{repair.estimatedCost}</strong></span>
                      <span>DATE LOGGED: {repair.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Filter active or completed repair logs by model, job ID, or problem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800 transition-all text-sm"
              />
            </div>
          </div>

          {/* Repair History Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900 tracking-tight font-display uppercase">Service Log Archives</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredRepairs.map((repair) => (
                  <div
                    key={repair.id}
                    className="p-5 border border-slate-200 hover:border-orange-500/30 rounded-xl hover:shadow-sm transition-all duration-150 bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="font-bold text-slate-900 font-mono text-sm">{repair.id}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5 uppercase">{repair.model}</p>
                      </div>
                      <div>
                        <StatusBadge status={repair.status} />
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{repair.problem}</p>
                    <div className="flex items-center justify-between text-xs font-mono border-t border-slate-100 pt-3 text-slate-400">
                      <span className="font-semibold text-slate-700">SERVICE COST: {repair.estimatedCost}</span>
                      <span>{repair.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRepairs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-sm font-mono">// No records matching query found</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Booking Form Card (Heuristic 8: Aesthetic and Minimalist Design) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight font-display flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-500" />
                Book Service Appointment
              </h2>
              <p className="text-slate-500 text-xs mt-1">Submit your motorcycle details to request a repair time-slot.</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                  Motorcycle Model
                </label>
                <input
                  type="text"
                  value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                  placeholder="e.g. Honda CBR 600"
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm ${
                    errors.model ? 'border-red-500 bg-red-50/10' : 'border-slate-300'
                  }`}
                />
                {errors.model && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.model}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                  Service Category
                </label>
                <select
                  value={formService}
                  onChange={(e) => setFormService(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
                >
                  <option value="Oil Change Service">Oil Change Service</option>
                  <option value="Engine Tune-up (Service)">Engine Tune-up (Service)</option>
                  <option value="Brake Bleeding (Service)">Brake Bleeding (Service)</option>
                  <option value="Chain Adjustment & Cleaning">Chain Adjustment & Cleaning</option>
                  <option value="Electrical Troubleshooting (Service)">Electrical Troubleshooting (Service)</option>
                  <option value="Other / Custom Problem">Other / Custom Problem</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                  Issue Description (Optional)
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe what needs repair or any symptoms you notice..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    min={todayStr} // Heuristic 5: Error Prevention
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm ${
                      errors.date ? 'border-red-500 bg-red-50/10' : 'border-slate-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                    Time Slot
                  </label>
                  <select
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
                  >
                    <option value="Morning (8 AM - 12 PM)">Morning (8 AM - 12 PM)</option>
                    <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM - 5 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  placeholder="e.g. (555) 019-2834"
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm ${
                    errors.contact ? 'border-red-500 bg-red-50/10' : 'border-slate-300'
                  }`}
                />
                {errors.contact && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.contact}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-200 text-sm tracking-wide shadow-md active:scale-98"
              >
                Submit Booking Request
              </button>
            </form>

            {/* Heuristic 10: Help and documentation */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-500 leading-normal">
                <strong>Appointment Policy:</strong> Bookings require shop admin approval. Once approved, the status below will change to <strong>Approved</strong>. You can cancel requests at any time before they are completed.
              </p>
            </div>
          </div>

          {/* Active Bookings Status List (Heuristic 1: Visibility of system status) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900 tracking-tight font-display uppercase flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-slate-600" />
                My Service Bookings
              </h2>
              <span className="text-xxs font-mono bg-slate-200/80 px-2 py-0.5 text-slate-600 rounded">
                TOTAL: {bookings.length}
              </span>
            </div>

            <div className="p-6 space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 border border-slate-200 rounded-xl hover:border-slate-300 bg-white transition-all shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 font-mono">{booking.id}</span>
                          <BookingBadge status={booking.status} />
                        </div>
                        <span className="text-xs text-slate-400 mt-1 font-mono uppercase block">{booking.motorcycleModel}</span>
                      </div>
                      
                      {/* Heuristic 3: User Control & Cancel button */}
                      {booking.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Cancel Request
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-500 leading-normal">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">// Service Type</span>
                        <span className="font-semibold text-slate-700 text-sm font-sans">{booking.serviceType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">// Appointment Slot</span>
                        <span className="font-semibold text-slate-700 text-sm font-sans">
                          {booking.preferredDate} ({booking.preferredTime.includes('Morning') ? 'Morning' : 'Afternoon'})
                        </span>
                      </div>
                    </div>

                    {booking.description && (
                      <div className="mt-3 bg-slate-50 border border-slate-100 p-3 rounded-lg text-slate-600 text-xs leading-relaxed">
                        <span className="text-[10px] text-slate-400 font-mono block uppercase mb-1">// Customer Problem Description</span>
                        {booking.description}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-100">
                      <span>PHONE: {booking.contactNumber}</span>
                      <span>SUBMITTED: {booking.dateCreated}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-medium">No bookings logged yet.</p>
                  <p className="text-slate-400 text-xs mt-1">Submit the booking request form to schedule a slot.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
