"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🔥 Supabase ko reset link bhejne ka command
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Email link click karne ke baad yahan aayega
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500/20 p-4 rounded-2xl">
             <KeyRound className="w-10 h-10 text-blue-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2">Reset Password</h2>
        
        {success ? (
          <div className="text-center">
            <p className="text-green-400 mb-6 bg-green-500/10 p-4 rounded-xl border border-green-500/20">
              Recovery link sent! Please check your email inbox (and spam folder) to reset your password.
            </p>
            <Link href="/" className="text-blue-400 hover:underline flex items-center justify-center gap-2 font-bold">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>
        ) : (
          <>
            <p className="text-slate-400 text-center mb-8">Enter your registered email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleReset} className="space-y-4 mb-6">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500" size={20} />
                <input 
                  type="email" required placeholder="Enter your Email" 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3">
                {loading ? <><Loader2 className="animate-spin" size={20}/> Sending...</> : "Send Reset Link"}
              </button>
            </form>
            <div className="text-center">
              <button onClick={() => window.history.back()} className="text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto text-sm">
                <ArrowLeft size={16} /> Back to Login
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}