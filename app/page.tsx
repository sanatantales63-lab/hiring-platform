"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, Search, ShieldCheck, Users, Building2, User, Linkedin, Twitter, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  // Floating animation variants for the cards
  const floatAnimation = {
    y: [0, -12, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col relative overflow-hidden selection:bg-teal-500/30">
      
      {/* NAVBAR */}
      <nav className="w-full bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black text-slate-900 flex items-center gap-2 cursor-pointer tracking-tight" onClick={() => router.push('/')}>
             <Briefcase className="text-[#0f947e]" size={28} strokeWidth={2.5}/> Talexo
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
             <span className="cursor-pointer hover:text-[#0f947e] transition-colors">How it Works</span>
             <span className="cursor-pointer hover:text-[#0f947e] transition-colors">Features</span>
             <span className="cursor-pointer hover:text-[#0f947e] transition-colors">Pricing</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/admin/login")} 
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white/80 px-3 py-2 rounded-lg border border-slate-200 shadow-sm"
            >
              <ShieldCheck size={16} /> Admin
            </button>
            <button 
              onClick={() => router.push("/student/login")} 
              className="bg-[#0f947e] hover:bg-[#0c7a68] text-white px-5 md:px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-teal-500/30 text-sm md:text-base active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center pt-10 md:pt-20 pb-16 md:pb-24 gap-12 lg:gap-8 z-10">
        
        {/* Left Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex-1 text-center lg:text-left w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-extrabold uppercase tracking-wider mb-6 mx-auto lg:mx-0 shadow-sm">
             <SparkleIcon /> The Future of Hiring
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tight mb-6 text-slate-900 drop-shadow-sm">
            Unlock <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f947e] to-emerald-400">Your Career</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 font-medium mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Connect with top companies through AI-verified skill assessments. No more resume black holes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button 
                onClick={() => router.push("/student/login")} 
                className="w-full sm:w-auto bg-[#0f947e] hover:bg-[#0c7a68] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-95"
            >
                For Candidates
            </button>
            <button 
                onClick={() => router.push("/company/login")} 
                className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 hover:border-[#0f947e] hover:text-[#0f947e] px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200/50 active:scale-95"
            >
                For Companies
            </button>
          </div>
        </motion.div>

        {/* Right Content (Floating UI Mockup) - ULTRA PREMIUM MOBILE FIX */}
        <div className="flex-1 relative w-full h-[450px] md:h-[550px] mt-8 lg:mt-0 flex justify-center lg:justify-end perspective-1000">
           
           {/* Ambient Glow behind cards */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-teal-400/20 blur-[80px] rounded-full pointer-events-none"></div>

           {/* Abstract Decorative Lines */}
           <svg className="absolute inset-0 w-full h-full text-slate-300/40 pointer-events-none" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50 250 C 150 50, 350 450, 550 250" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
              <circle cx="250" cy="250" r="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
           </svg>

           {/* CARD 1: Top Left */}
           <motion.div 
              initial={{ opacity: 0, x: 20, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute top-0 left-0 right-8 md:top-[10%] md:left-[10%] md:right-auto md:w-[360px] z-10"
           >
              <motion.div animate={floatAnimation} className="bg-white/80 backdrop-blur-2xl p-4 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60 flex gap-4 items-center transform md:-rotate-3">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 shrink-0 shadow-inner">
                   <User size={24} className="text-slate-400"/>
                </div>
                <div className="flex-1">
                   <p className="font-extrabold text-base text-slate-900 leading-tight">Roisan Smith</p>
                   <p className="text-xs text-[#0f947e] font-bold mb-1.5">Senior Developer</p>
                   <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <span className="bg-slate-100/80 px-2 py-1 rounded-md border border-slate-200/50 text-slate-600 font-bold">React</span>
                      <span className="bg-slate-100/80 px-2 py-1 rounded-md border border-slate-200/50 text-slate-600 font-bold">Node.js</span>
                   </div>
                </div>
                <div className="text-right shrink-0">
                   <CheckCircle2 size={18} className="text-emerald-500 ml-auto mb-1 drop-shadow-sm"/>
                   <span className="text-xs font-black text-slate-400 tracking-wider">80%</span>
                </div>
              </motion.div>
           </motion.div>

           {/* CARD 2: Middle Right (Overlaps Card 1) */}
           <motion.div 
              initial={{ opacity: 0, x: -20, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute top-[130px] left-8 right-0 md:top-[40%] md:right-[5%] md:left-auto md:w-[380px] z-20"
           >
              <motion.div animate={{...floatAnimation, transition: { ...floatAnimation.transition, delay: 1 }}} className="bg-white/90 backdrop-blur-2xl p-4 md:p-5 rounded-3xl shadow-2xl shadow-teal-900/10 border border-white/80 flex gap-4 items-center transform md:rotate-2">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl overflow-hidden flex items-center justify-center border border-teal-100 shrink-0 shadow-inner">
                   <User size={28} className="text-[#0f947e]"/>
                </div>
                <div className="flex-1">
                   <p className="font-extrabold text-lg text-slate-900 leading-tight">Maria Via</p>
                   <p className="text-xs text-[#0f947e] font-bold mb-1.5">Lead Architect</p>
                   <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <span className="bg-teal-50 px-2 py-1 rounded-md border border-teal-100 text-teal-700 font-bold">Next.js</span>
                      <span className="bg-teal-50 px-2 py-1 rounded-md border border-teal-100 text-teal-700 font-bold">AWS</span>
                   </div>
                </div>
                <div className="text-right shrink-0">
                   <CheckCircle2 size={22} className="text-[#0f947e] ml-auto mb-1 drop-shadow-sm"/>
                   <span className="text-sm font-black text-[#0f947e] tracking-wider">98%</span>
                </div>
              </motion.div>
           </motion.div>

           {/* CARD 3: Bottom Left */}
           <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute top-[260px] left-4 right-4 md:top-auto md:bottom-[5%] md:left-[15%] md:right-auto md:w-[340px] z-30"
           >
              <motion.div animate={{...floatAnimation, transition: { ...floatAnimation.transition, delay: 2 }}} className="bg-white/80 backdrop-blur-2xl p-4 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60 flex gap-4 items-center transform md:-rotate-1">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200 shrink-0 shadow-inner">
                   <User size={24} className="text-slate-400"/>
                </div>
                <div className="flex-1">
                   <p className="font-extrabold text-base text-slate-900 leading-tight">Jamer Snuth</p>
                   <p className="text-xs text-[#0f947e] font-bold mb-1.5">UI/UX Designer</p>
                   <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <span className="bg-slate-100/80 px-2 py-1 rounded-md border border-slate-200/50 text-slate-600 font-bold">Figma</span>
                      <span className="bg-slate-100/80 px-2 py-1 rounded-md border border-slate-200/50 text-slate-600 font-bold">Tailwind</span>
                   </div>
                </div>
                <div className="text-right shrink-0">
                   <CheckCircle2 size={18} className="text-emerald-500 ml-auto mb-1 drop-shadow-sm"/>
                   <span className="text-xs font-black text-slate-400 tracking-wider">75%</span>
                </div>
              </motion.div>
           </motion.div>
           
           {/* Decorative Floating Icons */}
           <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-[-10px] right-[15%] md:top-[5%] md:right-[20%] w-10 h-10 md:w-12 md:h-12 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-teal-500/30 border-2 border-white z-0"><Search size={18}/></motion.div>
           <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-[20%] right-[-5px] md:bottom-[25%] md:right-[10%] w-12 h-12 md:w-14 md:h-14 bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 border-2 border-white z-0"><Briefcase size={22}/></motion.div>
           <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-[0%] left-[-10px] md:bottom-[10%] md:left-[5%] w-10 h-10 md:w-12 md:h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30 border-2 border-white z-40"><Users size={18}/></motion.div>
        </div>
      </main>

      {/* STATS & LOGOS */}
      <div className="max-w-7xl mx-auto px-6 w-full border-t border-slate-200/60 pt-12 pb-14 mt-8 lg:mt-0">
         <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-6 md:gap-12 mb-10 text-center md:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-4 bg-white/60 backdrop-blur-xl p-4 md:p-5 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 w-full md:w-auto">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center text-[#0f947e] shrink-0 shadow-inner border border-teal-100"><ShieldCheck size={28}/></div>
               <div className="pr-4 text-left">
                  <p className="text-2xl font-black text-slate-900 tracking-tight">10,000+</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Verified Candidates</p>
               </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex items-center gap-4 bg-white/60 backdrop-blur-xl p-4 md:p-5 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 w-full md:w-auto">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 shrink-0 shadow-inner border border-blue-100"><Building2 size={28}/></div>
               <div className="pr-4 text-left">
                  <p className="text-2xl font-black text-slate-900 tracking-tight">500+</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Premium Companies</p>
               </div>
            </motion.div>
         </div>
      </div>

      {/* 🔥 NAYA PREMIUM FOOTER 🔥 */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="md:col-span-1">
              <Link href="/" className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-4">
                 <Briefcase className="text-[#0f947e]"/> Talexo
              </Link>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                Revolutionizing hiring with AI-driven skill assessments and verified profiles.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm">
                  <Linkedin size={18} />
             </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-400 transition-all shadow-sm">
                  <Github size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-slate-900 font-extrabold mb-6">For Candidates</h4>
              <ul className="space-y-4">
                <li><Link href="/student/login" className="text-slate-500 hover:text-[#0f947e] transition-colors text-sm font-medium">Create Profile</Link></li>
                <li><Link href="/student/login" className="text-slate-500 hover:text-[#0f947e] transition-colors text-sm font-medium">Take Assessment</Link></li>
                <li><Link href="/student/dashboard" className="text-slate-500 hover:text-[#0f947e] transition-colors text-sm font-medium">My Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-extrabold mb-6">For Companies</h4>
              <ul className="space-y-4">
                <li><Link href="/company/login" className="text-slate-500 hover:text-[#0f947e] transition-colors text-sm font-medium">Hire Talent</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-[#0f947e] transition-colors text-sm font-medium">Pricing Plans</Link></li>
                <li><Link href="/company/login" className="text-slate-500 hover:text-[#0f947e] transition-colors text-sm font-medium">Recruiter Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-extrabold mb-6">Support & Legal</h4>
              <ul className="space-y-4">
                <li><Link href="/support" className="text-slate-500 hover:text-[#0f947e] transition-colors text-sm font-medium flex items-center gap-2"><Mail size={14}/> Help Center</Link></li>
                <li><Link href="/privacy-policy" className="text-slate-500 hover:text-[#0f947e] transition-colors text-sm font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-slate-500 hover:text-[#0f947e] transition-colors text-sm font-medium">Terms of Service</Link></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm font-medium">
              © {new Date().getFullYear()} Talexo Technologies Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

// 🔥 FIX: Corrected strokeLinejoin spelling mistake here 🔥
function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M3 12h18M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" className="text-teal-500 opacity-50"/>
      <path d="M12 8l-1.5 2.5L8 12l2.5 1.5L12 16l1.5-2.5L16 12l-2.5-1.5z" className="fill-teal-600 text-teal-600"/>
    </svg>
  );
}