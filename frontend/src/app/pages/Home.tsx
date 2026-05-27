import { useNavigate } from 'react-router';
import { 
  Wrench, Cpu, ShoppingCart, Users, Package, ArrowRight, 
  ShieldCheck, HelpCircle, Phone, Mail, MapPin, Clock, 
  Award, Compass, Sparkles, Activity 
} from 'lucide-react';
import heroImage from '../../assets/motorcycle_parts_hero.png';

export function Home() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('hero');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white">
      
      {/* 1. Header/Navigation Bar */}
      <header className="border-b border-[#1E293B] bg-[#090D16]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo with hover scaling animation and cursor pointer */}
          <div 
            onClick={handleLogoClick} 
            className="flex items-center gap-3 cursor-pointer select-none group active:scale-95 transition-all duration-200"
          >
            <div className="p-2.5 bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-600/10 group-hover:shadow-orange-500/20 group-hover:from-orange-400 group-hover:to-red-500 transition-all duration-200">
              <Wrench className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white font-display group-hover:text-orange-400 transition-colors duration-200">MacMAc Shop</span>
              <span className="text-[10px] ml-2 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono">v1.2.0</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#about" onClick={scrollToSection('about')} className="hover:text-orange-500 transition-colors">About</a>
            <a href="#features" onClick={scrollToSection('features')} className="hover:text-orange-500 transition-colors">Features</a>
            <a href="#workflow" onClick={scrollToSection('workflow')} className="hover:text-orange-500 transition-colors">Workflow</a>
          </nav>

          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-600/20 text-sm font-medium transition-all duration-200 active:scale-95"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* 2. Hero Section - Inspired by the precision layout of engine parts */}
      <section id="hero" className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#090D16] to-[#0F172A] border-b border-[#1E293B]">
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-semibold tracking-wide uppercase">
              <Cpu className="w-3.5 h-3.5" /> High-Performance Shop Systems
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none font-display">
              Precision System <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                For Machine Experts
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl">
              An all-in-one management layout engineered specifically for professional motorcycle repair shops. Coordinate job orders, optimize parts inventory, and invoice customers with technical accuracy.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-xl transition-all duration-200 text-sm font-semibold active:scale-95 cursor-pointer shadow-lg hover:border-orange-500/40"
              >
                Launch Dashboard <ArrowRight className="w-4 h-4 text-orange-500" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            {/* Blueprint styling frame around image */}
            <div className="border border-slate-700/80 bg-slate-900/60 p-2 rounded-2xl shadow-2xl shadow-black/60 relative overflow-hidden group">
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded bg-[#090D16] border border-slate-800 text-[10px] font-mono text-orange-500 tracking-wider">
                REF_IMG: PART_LAYOUT_0091
              </div>
              <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded bg-[#090D16] border border-slate-800 text-[10px] font-mono text-slate-400 tracking-wider">
                SCALE: 1.0 // P-150
              </div>
              <img
                src={heroImage}
                alt="Motorcycle Parts Layout"
                className="w-full h-auto rounded-xl object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-500 ease-out"
              />
            </div>
            {/* Background design accents */}
            <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-orange-500/20 pointer-events-none rounded-tl-xl" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-2 border-r-2 border-orange-500/20 pointer-events-none rounded-br-xl" />
          </div>
        </div>
      </section>

      {/* Section Separator A */}
      <div className="bg-[#090D16] border-y border-[#1E293B] py-3.5 px-6 flex justify-between items-center text-[10px] font-mono tracking-widest text-[#64748B] select-none">
        <span>[WORKSHOP_METRICS] // SECTION_BREAK_01</span>
        <span className="hidden md:inline text-slate-700">----------------- DETAILED_WORKSHOP_ABOUT -----------------</span>
        <span>EXPERIENCE: 10_YEARS // DIAG_OK</span>
      </div>

      {/* 3. About the Workshop Section (Real Shop Info) */}
      <section id="about" className="py-20 lg:py-24 bg-[#0F172A] relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-semibold tracking-wide uppercase">
              <Compass className="w-3.5 h-3.5" /> [ABOUT_US] // THE WORKSHOP
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-display uppercase">
              Who We Are & What We Do
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Workshop Story & Mission */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              {/* Background & Stats */}
              <div className="bg-[#090D16]/60 border border-[#1E293B] rounded-2xl p-8 relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300 flex-1 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/5 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-orange-500 rounded-tl" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-orange-500 rounded-tr" />
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-display flex items-center gap-2.5">
                    <span className="text-orange-500">//</span> MacMAc Shop
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    MacMAc Shop is a professional motorcycle repair and maintenance shop focused on high-quality service, precision diagnostics, and reliable performance upgrades. We specialize in engine repair, tune-ups, oil changes, electrical troubleshooting, and custom motorcycle modifications.
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-orange-500">
                      <Award className="w-4 h-4" />
                      <span className="text-lg font-extrabold text-white font-display">10+ Years</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Experience</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-orange-500">
                      <Wrench className="w-4 h-4" />
                      <span className="text-lg font-extrabold text-white font-display">15k+ Bikes</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Repaired</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-orange-500">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-lg font-extrabold text-white font-display">100%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Precision</p>
                  </div>
                </div>
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Mission */}
                <div className="bg-[#090D16]/40 border border-[#1E293B] hover:border-orange-500/20 p-6 rounded-2xl relative transition-all duration-300 group">
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-orange-500 rounded-tl" />
                  <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest block mb-2">// Mission</span>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    To deliver ultimate mechanical precision, rapid turnaround times, and total safety to keep your ride running at peak performance.
                  </p>
                </div>

                {/* Vision */}
                <div className="bg-[#090D16]/40 border border-[#1E293B] hover:border-orange-500/20 p-6 rounded-2xl relative transition-all duration-300 group">
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-orange-500 rounded-tl" />
                  <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest block mb-2">// Vision</span>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    To be the state-of-the-art tech hub of choice for motorcycle tuning, repairs, and custom setups in the region.
                  </p>
                </div>

              </div>

            </div>

            {/* Right Column: Services Offered */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              
              <div className="bg-[#090D16]/60 border border-[#1E293B] rounded-2xl p-8 relative flex-1 flex flex-col justify-between hover:border-orange-500/30 transition-all duration-300">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-orange-500 rounded-tl" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-orange-500 rounded-tr" />
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-6 font-display flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-500" />
                    <span>Specialized Workshop Services</span>
                  </h3>

                  <div className="space-y-4">
                    
                    {/* Service 1 */}
                    <div className="flex gap-4 p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl hover:border-orange-500/25 transition-all group/s flex-1">
                      <div className="p-2 bg-slate-800 rounded-lg text-orange-500 group-hover/s:bg-orange-500 group-hover/s:text-white transition-all h-fit shadow">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Engine Calibration & Overhauls</h4>
                        <p className="text-slate-400 text-[11px] mt-0.5 leading-normal">Full engine rebuilds, cylinder compression optimization, and valve adjustments.</p>
                      </div>
                    </div>

                    {/* Service 2 */}
                    <div className="flex gap-4 p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl hover:border-orange-500/25 transition-all group/s flex-1">
                      <div className="p-2 bg-slate-800 rounded-lg text-orange-500 group-hover/s:bg-orange-500 group-hover/s:text-white transition-all h-fit shadow">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Precision Electronics & Diagnostics</h4>
                        <p className="text-slate-400 text-[11px] mt-0.5 leading-normal">Solving complex wiring faults, electrical systems, and ignition issues with state-of-the-art tools.</p>
                      </div>
                    </div>

                    {/* Service 3 */}
                    <div className="flex gap-4 p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl hover:border-orange-500/25 transition-all group/s flex-1">
                      <div className="p-2 bg-slate-800 rounded-lg text-orange-500 group-hover/s:bg-orange-500 group-hover/s:text-white transition-all h-fit shadow">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Tuning & Custom Modifications</h4>
                        <p className="text-slate-400 text-[11px] mt-0.5 leading-normal">Exhaust kit installations, high-performance tuning maps, and suspension modifications.</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            
            {/* Info Card 1 - Address */}
            <div className="bg-[#090D16]/50 border border-[#1E293B] p-5 rounded-2xl flex items-center gap-4 hover:border-orange-500/35 transition-all duration-300 group">
              <div className="p-3 bg-slate-800/80 border border-slate-700 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">// Location</h4>
                <p className="text-sm font-semibold text-white mt-0.5">Zone 2, San Isidro, Balingasag, Misamis Oriental</p>
              </div>
            </div>

            {/* Info Card 2 - Contact */}
            <div className="bg-[#090D16]/50 border border-[#1E293B] p-5 rounded-2xl flex items-center gap-4 hover:border-orange-500/35 transition-all duration-300 group">
              <div className="p-3 bg-slate-800/80 border border-slate-700 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
                <Phone className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">// Get In Touch</h4>
                <p className="text-xs font-semibold text-white mt-0.5 truncate">09489647334 // FB: MacMac Pahis</p>
                <p className="text-[10px] text-slate-400 truncate">contact@macmacshop.com</p>
              </div>
            </div>

            {/* Info Card 3 - Operating Hours */}
            <div className="bg-[#090D16]/50 border border-[#1E293B] p-5 rounded-2xl flex items-center gap-4 hover:border-orange-500/35 transition-all duration-300 group">
              <div className="p-3 bg-slate-800/80 border border-slate-700 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">// Operating Hours</h4>
                <p className="text-xs font-semibold text-white mt-0.5">Mon, Tue, Thu, Fri: 8AM - 6PM // Wed, Sat, Sun: Closed</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Section Separator B */}
      <div className="bg-[#090D16] border-y border-[#1E293B] py-3.5 px-6 flex justify-between items-center text-[10px] font-mono tracking-widest text-[#64748B] select-none">
        <span>[SYSTEM_PIPELINE] // SECTION_BREAK_02</span>
        <span className="hidden md:inline text-slate-700">----------------- MECHANICAL_INDEXING_INIT -----------------</span>
        <span>GEAR_RATIO: 1.625 // MOTOR_CYL: V4</span>
      </div>

      {/* 4. Features Section - Technical specifications representation */}
      <section id="features" className="py-20 lg:py-24 bg-[#0F172A] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-display uppercase">
              System Core Modules
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full" />
            <p className="text-slate-400">
              Machined modules built to handle all workshop dependencies efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-[#090D16]/50 border border-[#1E293B] hover:border-orange-500/40 p-6 rounded-2xl transition-all duration-300 group">
              <div className="p-3 bg-slate-800/80 border border-slate-700 text-orange-500 w-fit rounded-xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">Job Pipeline</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Log mechanical diagnostics, update stages (Pending, In Progress, Complete), and notify mechanics dynamically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#090D16]/50 border border-[#1E293B] hover:border-orange-500/40 p-6 rounded-2xl transition-all duration-300 group">
              <div className="p-3 bg-slate-800/80 border border-slate-700 text-orange-500 w-fit rounded-xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">Smarter Stock</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Track cylinder units, tires, chains, and spark plugs. Get instantaneous alerts when components drop to low levels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#090D16]/50 border border-[#1E293B] hover:border-orange-500/40 p-6 rounded-2xl transition-all duration-300 group">
              <div className="p-3 bg-slate-800/80 border border-slate-700 text-orange-500 w-fit rounded-xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">Point of Sale</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Check out parts and labor directly. Auto-computes subtotal, taxes, and outputs neat, printable receipts for audits.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#090D16]/50 border border-[#1E293B] hover:border-orange-500/40 p-6 rounded-2xl transition-all duration-300 group">
              <div className="p-3 bg-slate-800/80 border border-slate-700 text-orange-500 w-fit rounded-xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">Customer Logs</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Index customer contacts, registered motorcycle models, and detailed historical logs of all repairs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section Separator C */}
      <div className="bg-[#090D16] border-y border-[#1E293B] py-3.5 px-6 flex justify-between items-center text-[10px] font-mono tracking-widest text-[#64748B] select-none">
        <span>[WORKFLOW_ENGINE] // SECTION_BREAK_03</span>
        <span className="hidden md:inline text-slate-700">----------------- PIPELINE_FLOW_CHECK -----------------</span>
        <span>TORQUE_RATIO: 240NM // REPAIR_REF_OK</span>
      </div>

      {/* 5. How it Works Section (Sleek Flowchart styling) */}
      <section id="workflow" className="py-20 lg:py-24 bg-[#090D16]/40 relative border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-display uppercase">
              Operational Sequence
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full" />
            <p className="text-slate-400">
              How the system streamlines processing from intake to checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#0F172A] border border-[#1E293B] p-8 rounded-2xl relative shadow-xl">
              <span className="absolute top-6 right-6 text-3xl font-black text-orange-500/10 font-mono">01</span>
              <h4 className="text-lg font-bold text-white mb-3 font-display">Intake & Setup</h4>
              <p className="text-slate-400 text-sm">
                Register customer records and create new repair jobs listing specific bike problems and preliminary cost estimates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0F172A] border border-[#1E293B] p-8 rounded-2xl relative shadow-xl">
              <span className="absolute top-6 right-6 text-3xl font-black text-orange-500/10 font-mono">02</span>
              <h4 className="text-lg font-bold text-white mb-3 font-display">Execution & Update</h4>
              <p className="text-slate-400 text-sm">
                Mechanics update task pipelines. Stock rooms are crosschecked, flagging low quantities of parts automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0F172A] border border-[#1E293B] p-8 rounded-2xl relative shadow-xl">
              <span className="absolute top-6 right-6 text-3xl font-black text-orange-500/10 font-mono">03</span>
              <h4 className="text-lg font-bold text-white mb-3 font-display">Auditing & POS</h4>
              <p className="text-slate-400 text-sm">
                Invoice parts and labor with computed tax values. Generate printable receipts and log complete visit records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Comprehensive Footer */}
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
                <a href="#about" onClick={scrollToSection('about')} className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> About The Workshop
                </a>
              </li>
              <li>
                <a href="#features" onClick={scrollToSection('features')} className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> System Features
                </a>
              </li>
              <li>
                <a href="#workflow" onClick={scrollToSection('workflow')} className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
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
