"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";

// 🔥 Naye Master Components 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

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
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative z-10">
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        
        <Card className="p-8 md:p-12 relative overflow-hidden border-t-4 border-t-blue-500 shadow-2xl">
          
          <div className="flex justify-center mb-6 relative z-10">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl shadow-sm">
               <KeyRound className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-center mb-2 text-slate-900 relative z-10">Reset Password</h2>
          
          {success ? (
            <div className="text-center relative z-10">
              <p className="text-emerald-700 font-medium mb-6 bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm">
                Recovery link sent! Please check your email inbox (and spam folder) to reset your password.
              </p>
              <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2 font-bold transition-colors">
                <ArrowLeft size={16} /> Back to Home
              </Link>
            </div>
          ) : (
            <div className="relative z-10">
              <p className="text-slate-500 font-medium text-center mb-8">Enter your registered email address and we'll send you a link to reset your password.</p>
              <form onSubmit={handleReset} className="space-y-4 mb-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                  <input 
                    type="email" required placeholder="Enter your Email" 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-sm"
                  />
                </div>
                
                <Button 
                   type="submit" 
                   disabled={loading} 
                   className="w-full py-4 text-lg bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 text-white"
                >
                  {loading ? <><Loader2 className="animate-spin" size={20}/> Sending...</> : "Send Reset Link"}
                </Button>
              </form>
              
              <div className="text-center">
                <button onClick={() => window.history.back()} className="text-slate-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto text-sm font-bold">
                  <ArrowLeft size={16} /> Back to Login
                </button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}