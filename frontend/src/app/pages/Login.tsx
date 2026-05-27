import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Wrench, ShieldCheck, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { jsonRequest } from '../api';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    try {
      const data = await jsonRequest('login.php', { email, password });

      toast.success('Login successful!');
      if (data.data.user?.role?.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/customer');
      }
    } catch (error) {
      console.error('Login backend error:', error);
      toast.error((error as any).message || 'Unable to connect to backend.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white flex flex-col justify-between">
      
      {/* 1. Header/Navigation Bar */}
      <header className="border-b border-[#1E293B] bg-[#090D16]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer select-none group active:scale-95 transition-all duration-200"
          >
            <div className="p-2.5 bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-600/10 group-hover:shadow-orange-600/20 group-hover:from-orange-400 group-hover:to-red-500 transition-all duration-200">
              <Wrench className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white font-display group-hover:text-orange-400 transition-colors duration-200">MacMAc Shop</span>
              <span className="text-[10px] ml-2 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono">v1.2.0</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="/#features" className="hover:text-orange-500 transition-colors">Features</a>
            <a href="/#workflow" className="hover:text-orange-500 transition-colors">Workflow</a>
            <a href="/#about" className="hover:text-orange-500 transition-colors">About</a>
          </nav>

          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-600/20 text-sm font-medium transition-all duration-200"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* 2. Login Panel Section */}
      <section className="py-12 lg:py-20 bg-[#0F172A] relative flex-1 flex justify-center items-center">
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="max-w-md w-full px-6 relative z-10">
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
              <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wider">MacMAc Shop Access</h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">// SECURE CLIENT LOGS</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-sans text-sm"
                  placeholder="your.email@example.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0F172A] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-sans text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-600/10 font-bold transition-all duration-200 text-sm tracking-wider uppercase"
              >
                Sign In System
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-orange-500 hover:text-orange-400 hover:underline font-semibold"
                >
                  Create Account
                </button>
              </p>
            </div>


          </div>
        </div>
      </section>

      {/* 3. Comprehensive Footer */}
      <footer className="bg-[#090D16] border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1 - Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-orange-500 text-white rounded-lg shadow-md shadow-orange-600/10">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-wider uppercase font-display">MacMAc Shop</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Industrial-grade management systems built to track, organize, and automate motorcycle repair operations. Engineered for speed and precision.
            </p>
            <div className="flex items-center gap-2.5 text-xs text-orange-500 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>SYSTEM ENCRYPTED // SSL SECURE</span>
            </div>
          </div>

          {/* Column 2 - Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">// Portal Links</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="/#features" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> System Features
                </a>
              </li>
              <li>
                <a href="/#workflow" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> System Workflow
                </a>
              </li>
              <li>
                <button onClick={() => navigate('/register')} className="hover:text-white hover:underline transition-colors flex items-center gap-1.5 text-left">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Register Client Account
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login')} className="hover:text-white hover:underline transition-colors flex items-center gap-1.5 text-left">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Operator Login Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">// Diagnostics</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Engine Calibration</li>
              <li>Brake Pad Replacement</li>
              <li>Electrical & Battery Systems</li>
              <li>Chain & Sprocket Maintenance</li>
            </ul>
          </div>

          {/* Column 4 - Contact info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">// Workshop Info</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Location: Zone 2, San Isidro, Balingasag, Misamis Oriental</li>
              <li>Phone: 09489647334</li>
              <li>Facebook: MacMac Pahis</li>
              <li>Email: contact@macmacshop.com</li>
              <li>Operational hours: Mon, Tue, Thu, Fri: 8AM - 6PM</li>
            </ul>
          </div>

        </div>

        {/* Bottom row */}
        <div className="border-t border-[#1E293B]/60 bg-[#070A10] py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
            <p>© {new Date().getFullYear()} MacMAc Shop Repair Management Systems. All rights reserved.</p>
            <p className="flex items-center gap-1.5 justify-center">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>v1.2.0-STABLE</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
