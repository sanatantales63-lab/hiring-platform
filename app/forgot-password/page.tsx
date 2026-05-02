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
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 relative z-10 font-sans text-[var(--foreground)]">
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        
        <Card className="p-8 md:p-12 relative overflow-hidden border-t-4 border-t-[var(--primary)] shadow-elevated">
          
          <div className="flex justify-center mb-6 relative z-10">
            <div className="bg-[var(--accent)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
               <KeyRound className="w-10 h-10 text-[var(--primary)]" />
            </div>
          </div>
          
          <h2 className="font-display text-3xl font-extrabold text-center mb-2 text-[var(--foreground)] relative z-10">Reset Password</h2>
          
          {success ? (
            <div className="text-center relative z-10">
              <p className="text-[var(--primary)] font-medium mb-6 bg-[var(--primary)]/10 p-4 rounded-xl border border-[var(--primary)]/20 shadow-sm">
                Recovery link sent! Please check your email inbox (and spam folder) to reset your password.
              </p>
              <Link href="/" className="text-[var(--primary)] hover:text-[var(--primary-glow)] flex items-center justify-center gap-2 font-bold transition-colors">
                <ArrowLeft size={16} /> Back to Home
              </Link>
            </div>
          ) : (
            <div className="relative z-10">
              <p className="text-[var(--muted-foreground)] font-medium text-center mb-8">Enter your registered email address and we'll send you a link to reset your password.</p>
              <form onSubmit={handleReset} className="space-y-4 mb-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-[var(--muted-foreground)]" size={20} />
                  <input 
                    type="email" required placeholder="Enter your Email" 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[var(--input)]/50 border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:bg-[var(--surface)] outline-none transition-all shadow-sm"
                  />
                </div>
                
                <Button 
                   type="submit" 
                   disabled={loading} 
                   variant="primary"
                   className="w-full py-4 text-lg"
                >
                  {loading ? <><Loader2 className="animate-spin" size={20}/> Sending...</> : "Send Reset Link"}
                </Button>
              </form>
              
              <div className="text-center">
                <button onClick={() => window.history.back()} className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-2 mx-auto text-sm font-bold">
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