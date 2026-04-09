"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, Search, ShieldCheck, Users, Building2, User, Linkedin, Twitter, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans flex flex-col relative overflow-hidden selection:bg-teal-500/30">
      
      {/* NAVBAR */}
      <nav className="w-full bg-white/60 backdrop-blur-xl sticky top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black text-slate-900 flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
             Talexo
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
             <span className="cursor-pointer hover:text-teal-600 transition-colors">How it Works</span>
             <span className="cursor-pointer hover:text-teal-600 transition-colors">Features</span>
             <span className="cursor-pointer hover:text-teal-600 transition-colors">Pricing</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/admin/login")} 
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors bg-white/50 px-3 py-1.5 rounded-lg border border-slate-200"
            >
              <ShieldCheck size={16} /> Admin
            </button>
            <button 
              onClick={() => router.push("/student/login")} 
              className="bg-[#0f947e] hover:bg-[#0c7a68] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-teal-500/30"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center pt-16 md:pt-24 pb-20 gap-12 z-10">
        
        {/* Left Content */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1 text-center lg:text-left">
          <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.1] tracking-tight mb-4 text-slate-900 drop-shadow-sm">
            Unlock <br/> Your Career
          </h1>
          <p className="text-2xl md:text-3xl text-slate-500 font-medium mb-10">
            The Future of Hiring
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button 
                onClick={() => router.push("/student/login")} 
                className="w-full sm:w-auto bg-[#0f947e] hover:bg-[#0c7a68] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 border border-teal-400"
            >
                For Candidates
            </button>
            <button 
                onClick={() => router.push("/company/login")} 
                className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border-2 border-[#0f947e] text-[#0f947e] hover:bg-teal-50 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200/50"
            >
                For Companies
            </button>
          </div>
        </motion.div>

        {/* Right Content (Floating UI Mockup) */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex-1 relative w-full max-w-lg lg:max-w-none h-[400px] md:h-[500px]">
           {/* Abstract Green Lines */}
           <svg className="absolute inset-0 w-full h-full text-teal-500/20" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 250 C 150 50, 350 450, 450 250" stroke="currentColor" strokeWidth="3" strokeDasharray="8 8" />
              <path d="M100 100 Q 250 50, 400 150 T 450 400" stroke="currentColor" strokeWidth="2" />
           </svg>

           {/* Floating Cards simulating the image */}
           <div className="absolute top-[10%] left-[5%] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex gap-4 items-center transform -rotate-2 hover:scale-105 transition-transform duration-500">
              <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden flex items-center justify-center border border-slate-200"><User size={24} className="text-slate-400"/></div>
              <div>
                 <p className="font-bold text-slate-900">Roisan Smith</p>
                 <p className="text-xs text-teal-600 font-bold mb-1">Senior Developer</p>
                 <div className="flex gap-2 text-[10px]"><span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">React</span><span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">Node.js</span></div>
              </div>
              <div className="ml-4 text-right">
                 <CheckCircle2 size={16} className="text-blue-500 ml-auto mb-1"/>
                 <span className="text-xs font-bold text-slate-500">Match 80%</span>
              </div>
           </div>

           <div className="absolute top-[40%] right-[0%] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex gap-4 items-center transform rotate-2 hover:scale-105 transition-transform duration-500 z-10">
              <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden flex items-center justify-center border border-slate-200"><User size={24} className="text-slate-400"/></div>
              <div>
                 <p className="font-bold text-slate-900">Maria Via</p>
                 <p className="text-xs text-teal-600 font-bold mb-1">Senior Developer</p>
                 <div className="flex gap-2 text-[10px]"><span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">React</span><span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">Node.js</span></div>
              </div>
              <div className="ml-4 text-right">
                 <CheckCircle2 size={16} className="text-blue-500 ml-auto mb-1"/>
                 <span className="text-xs font-bold text-slate-500">Match 98%</span>
              </div>
           </div>

           <div className="absolute bottom-[10%] left-[20%] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex gap-4 items-center hover:scale-105 transition-transform duration-500">
              <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden flex items-center justify-center border border-slate-200"><User size={24} className="text-slate-400"/></div>
              <div>
                 <p className="font-bold text-slate-900">Jamer Snuth</p>
                 <p className="text-xs text-teal-600 font-bold mb-1">Senior Developer</p>
                 <div className="flex gap-2 text-[10px]"><span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">React</span><span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">Node.js</span></div>
              </div>
              <div className="ml-4 text-right">
                 <CheckCircle2 size={16} className="text-blue-500 ml-auto mb-1"/>
                 <span className="text-xs font-bold text-slate-500">Match 70%</span>
              </div>
           </div>
           
           {/* Decorative Icons */}
           <div className="absolute top-[5%] right-[20%] w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white"><Search size={20}/></div>
           <div className="absolute bottom-[30%] right-[10%] w-10 h-10 bg-[#0f947e] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white"><Briefcase size={20}/></div>
           <div className="absolute bottom-[0%] left-[5%] w-10 h-10 bg-[#0f947e] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white"><Users size={20}/></div>
        </motion.div>
      </main>

      {/* STATS & LOGOS */}
      <div className="max-w-7xl mx-auto px-6 w-full border-t border-slate-200/50 pt-10 pb-12">
         <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-12 mb-10 text-center md:text-left">
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 shadow-sm">
               <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600"><ShieldCheck size={24}/></div>
               <div className="pr-4">
                  <p className="text-xl font-black text-slate-900">10,000+</p>
                  <p className="text-sm font-medium text-slate-500">Verified Candidates</p>
               </div>
            </div>
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 shadow-sm">
               <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600"><Building2 size={24}/></div>
               <div className="pr-4">
                  <p className="text-xl font-black text-slate-900">500+</p>
                  <p className="text-sm font-medium text-slate-500">Premium Companies</p>
               </div>
            </div>
         </div>
      </div>

      {/* 🔥 NAYA PREMIUM FOOTER 🔥 */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="md:col-span-1">
              <Link href="/" className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-4">
                 Talexo
              </Link>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                Revolutionizing hiring with AI-driven skill assessments and verified profiles.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-colors shadow-sm">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-700 hover:border-blue-300 transition-colors shadow-sm">
                  <Linkedin size={18} />
             </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-colors shadow-sm">
                  <Github size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-slate-900 font-extrabold mb-6">For Candidates</h4>
              <ul className="space-y-4">
                <li><Link href="/student/login" className="text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium">Create Profile</Link></li>
                <li><Link href="/student/login" className="text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium">Take Assessment</Link></li>
                <li><Link href="/student/dashboard" className="text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium">My Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-extrabold mb-6">For Companies</h4>
              <ul className="space-y-4">
                <li><Link href="/company/login" className="text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium">Hire Talent</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium">Pricing Plans</Link></li>
                <li><Link href="/company/login" className="text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium">Recruiter Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-extrabold mb-6">Support & Legal</h4>
              <ul className="space-y-4">
                <li><Link href="/support" className="text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium flex items-center gap-2"><Mail size={14}/> Help Center</Link></li>
                <li><Link href="/privacy-policy" className="text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium">Terms of Service</Link></li>
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