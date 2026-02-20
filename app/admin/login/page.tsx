"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Login hone ke baad direct Owner Panel pe bhejega
          redirectTo: `${window.location.origin}/admin/dashboard`, 
        },
      });
      if (error) throw error;
    } catch (error: any) {
      alert("Login Failed: " + error.message);
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

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl shadow-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20}/> Authenticating...</>
          ) : (
            <><Lock size={20}/> Admin Login</>
          )}
        </button>
      </motion.div>
    </div>
  );
}