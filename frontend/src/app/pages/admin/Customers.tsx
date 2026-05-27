import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { fetchJson } from '../../api';

interface Customer {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchJson('customers.php');
      setCustomers(data.data.customers || []);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load customer records.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toString().includes(searchQuery) ||
      customer.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Customers</h1>
        <p className="text-slate-500 mt-1">View and manage customer service indexing registry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 border-l-4 border-l-blue-500 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase font-mono">Total Customers</p>
          <p className="text-3xl font-bold text-slate-900 mt-2 font-display">{customers.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 border-l-4 border-l-emerald-500 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase font-mono">Active This Month</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2 font-display">{customers.filter((customer) => new Date(customer.createdAt) > new Date(new Date().setMonth(new Date().getMonth() - 1))).length}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 border-l-4 border-l-slate-700 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase font-mono">Customer Records</p>
          <p className="text-3xl font-bold text-slate-900 mt-2 font-display">{customers.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search indexing registry by name, email, role, or customer ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800 transition-all text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-all duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 font-mono">C-{String(customer.id).padStart(3, '0')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{customer.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold">{customer.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{new Date(customer.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {isLoading && (
            <div className="text-center py-12">
              <p className="text-slate-400">Loading customers...</p>
            </div>
          )}

          {!isLoading && filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm font-mono">// No customer indexing matches found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
