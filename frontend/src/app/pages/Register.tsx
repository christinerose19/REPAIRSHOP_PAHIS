import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Wrench, Cpu, User, Mail, Lock, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { jsonRequest } from '../api';

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const data = await jsonRequest('register.php', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (!data.success) {
        toast.error(data.message || 'Registration failed.');
        return;
      }

      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Registration backend error:', error);
      toast.error('Unable to connect to backend.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans antialiased flex items-center justify-center p-8 relative overflow-hidden">
      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#090D16] border border-[#1E293B] rounded-2xl shadow-2xl p-8 relative">
          {/* Design accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-orange-500 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-orange-500 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-orange-500 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-orange-500 rounded-br-lg" />

          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-slate-800 border border-slate-700 text-orange-500 rounded-xl mb-4 shadow-lg shadow-black/40">
              <Wrench className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wider">CREATE ACCOUNT</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">// SYSTEM REGISTRATION</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-sans text-sm"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-sans text-sm"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-sans text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-sans text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-600/10 font-bold transition-all duration-200 text-sm tracking-wider uppercase"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-orange-500 hover:text-orange-400 hover:underline font-semibold"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
