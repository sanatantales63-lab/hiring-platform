"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Users, ArrowRight, ShieldCheck, Briefcase, Linkedin, Twitter, Github } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 font-sans flex flex-col relative overflow-hidden">
      
      {/* BACKGROUND GLOWS (Pointer events none zaroori hai taaki click block na kare) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* NAVBAR */}
      <nav className="w-full border-b border-white/5 bg-[#020617]/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <Briefcase className="text-blue-500" strokeWidth={2.5} /> Talexo
          </div>
          <div className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-400">
            <button className="hover:text-white transition-colors">Find Jobs</button>
            <button className="hover:text-white transition-colors">For Companies</button>
            <button onClick={() => router.push("/student/login")} className="px-5 py-2 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-white hover:text-black transition-all font-semibold">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-16 md:mt-24 mb-24 z-10">
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-wider mb-8 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
             🚀 The Future of Hiring
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Unlock Your Career with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
              Talexo
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Connect top candidates with premium companies. Verified skills, real opportunities.
            Stop searching, start working.
          </p>
        </motion.div>

        {/* CARDS SECTION - Fixed Clicks */}
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 w-full">
          
          {/* CANDIDATE CARD */}
          <motion.div whileHover={{ y: -10 }} className="bg-slate-900/40 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:border-blue-500/50 transition-all group shadow-2xl relative overflow-hidden flex flex-col">
            {/* Background Overlay ko pointer-events-none diya hai taaki wo click na roke */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                   <Users size={28} />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">I am a Candidate</h2>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed text-center">
                   Take skill assessments, build a professional profile, and get matched with top companies directly.
                </p>
                <button 
                  onClick={() => router.push("/student/login")} 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 mt-auto cursor-pointer relative z-20"
                >
                  Login as Candidate <ArrowRight size={18} />
                </button>
            </div>
          </motion.div>

          {/* COMPANY CARD */}
          <motion.div whileHover={{ y: -10 }} className="bg-slate-900/40 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:border-purple-500/50 transition-all group shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                   <Building2 size={28} />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">I am a Company</h2>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed text-center">
                   Hire pre-verified talent. Filter candidates by skills, experience, and assessment scores effortlessly.
                </p>
                <button 
                  onClick={() => router.push("/company/login")} 
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20 mt-auto cursor-pointer relative z-20"
                >
                  Login as Company <ArrowRight size={18} />
                </button>
            </div>
          </motion.div>

          {/* OWNER CARD */}
          <motion.div whileHover={{ y: -10 }} className="bg-slate-900/40 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:border-red-500/50 transition-all group shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center flex-1">
                <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 text-red-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                   <ShieldCheck size={28} />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">I am the Owner</h2>
                <p className="text-slate-400 mb-8 text-sm leading-relaxed text-center">
                   Admin dashboard access to manage users, approve companies, and oversee Talexo analytics.
                </p>
                <button 
                  onClick={() => router.push("/admin/login")} 
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20 mt-auto cursor-pointer relative z-20"
                >
                  Owner Login <ArrowRight size={18} />
                </button>
            </div>
          </motion.div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/5 bg-[#020617]/80 backdrop-blur-md py-8 mt-auto z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
               <Briefcase size={18} className="text-blue-500"/> Talexo
            </h3>
            <p className="text-slate-500 text-xs mt-1">© 2026 Talexo Inc. All rights reserved.</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors transform hover:scale-110"><Linkedin size={20}/></a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors transform hover:scale-110"><Twitter size={20}/></a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors transform hover:scale-110"><Github size={20}/></a>
          </div>

          <div className="flex gap-6 text-xs text-slate-500 font-medium">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}