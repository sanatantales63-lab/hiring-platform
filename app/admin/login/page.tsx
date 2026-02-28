"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Login hone ke baad direct Owner Panel pe bhejega
      window.location.href = '/admin/dashboard';
      
    } catch (error: any) {
      alert("Admin Login Failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-red-500/20 p-4 rounded-2xl">
            <ShieldCheck className="w-10 h-10 text-red-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">Owner Portal</h2>
        <p className="text-slate-400 text-center mb-8">Secure access to admin controls.</p>

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-500" size={20} />
            <input 
              type="email" required placeholder="Admin Email" 
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-red-500 outline-none transition-colors"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-500" size={20} />
            <input 
              type="password" required placeholder="Admin Password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-red-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-900 font-bold py-4 mt-4 rounded-xl shadow-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={20}/> Authenticating...</>
            ) : (
              <><Lock size={20}/> Admin Login</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}