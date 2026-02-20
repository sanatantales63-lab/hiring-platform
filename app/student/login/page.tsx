"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase"; // Humari nayi Supabase file
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export default function CandidateLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Supabase Google Login (Redirect Method)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Login hone ke baad kahan jana hai
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error(error);
      alert("Login Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden text-white p-4 font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/50 border border-slate-800 p-8 md:p-12 rounded-3xl backdrop-blur-xl max-w-md w-full shadow-2xl relative z-10">
        
        <div className="text-center mb-10">
          <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 transform rotate-3 border border-blue-500/20">
             <Briefcase size={32} className="text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Candidate Portal</h1>
          <p className="text-slate-400">Join professionals getting hired.</p>
        </div>

        {/* Benefits List */}
        <div className="space-y-3 mb-8">
           <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <CheckCircle size={16} className="text-green-500"/> Verified Skill Assessments
           </div>
           <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <CheckCircle size={16} className="text-green-500"/> Direct Offers from Companies
           </div>
        </div>

        <button 
          onClick={handleLogin} 
          disabled={loading}
          className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all shadow-xl shadow-white/5 hover:scale-[1.02] active:scale-[0.98] group"
        >
          {loading ? (
             <><Loader2 className="animate-spin" size={20}/> Connecting...</>
          ) : (
             <>
               <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
               Continue with Google
               <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0"/>
             </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500 mt-6">
           By continuing, you agree to our Terms & Privacy Policy.
        </p>

      </motion.div>
    </div>
  );
}