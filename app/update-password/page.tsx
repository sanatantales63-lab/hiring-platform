"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle } from "lucide-react";

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }
    
    setLoading(true);
    try {
      // 🔥 Supabase ko naya password save karne ka command
      const { error } = await supabase.auth.updateUser({ password: password });
      
      if (error) throw error;
      
      alert("Password updated successfully! You can now log in with your new password.");
      router.push("/"); // Update hone ke baad home ya login par bhej do
      
    } catch (error: any) {
      alert("Error updating password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-green-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/20 p-4 rounded-2xl">
             <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2">Set New Password</h2>
        <p className="text-slate-400 text-center mb-8">Your identity has been verified. Please enter your new password below.</p>

        <form onSubmit={handleUpdate} className="space-y-4 mb-6">
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-500" size={20} />
            <input 
              type="password" required placeholder="New Password (Min 6 chars)" minLength={6}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-green-500 outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-500" size={20} />
            <input 
              type="password" required placeholder="Confirm New Password" minLength={6}
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-green-500 outline-none"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3">
            {loading ? <><Loader2 className="animate-spin" size={20}/> Updating...</> : "Save New Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}