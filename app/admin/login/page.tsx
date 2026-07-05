"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, Lock, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";
import Link from "next/link";

// Master UI Components
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

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
      
      // Redirect to Admin Owner Panel
      window.location.href = '/admin/dashboard';
      
    } catch (error: any) {
      alert("Admin Login Failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6 relative font-sans text-white">
      
      {/* Red Ambient Glow for Admin Security Portal */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-600/10 blur-[130px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Resourcemania Home
        </Link>

        <Card className="bg-white/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-7 sm:p-9 text-[var(--foreground)] border-t-4 border-t-rose-600">
          
          <div className="flex justify-center mb-5">
            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl text-rose-600 shadow-soft">
              <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
            </div>
          </div>

          <h2 className="text-2xl font-black font-display text-center text-[var(--foreground)] tracking-tight">
            Owner Portal
          </h2>
          <p className="text-[var(--muted-foreground)] text-xs font-medium text-center mt-1 mb-6">
            Restricted security access to platform controls.
          </p>

          <form onSubmit={handleEmailLogin} className="space-y-4 mb-2">
            <div>
              <label className="text-[11px] font-bold text-[var(--foreground)] uppercase tracking-wider block mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-[var(--muted-foreground)]" size={17} />
                <input 
                  type="email" required placeholder="admin@resourcemania.com" 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 focus:border-rose-600 focus:ring-2 focus:ring-rose-600/15 outline-none transition-all bg-white"
                />
              </div>
            </div>
            
            <div>
              <label className="text-[11px] font-bold text-[var(--foreground)] uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-[var(--muted-foreground)]" size={17} />
                <input 
                  type="password" required placeholder="••••••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 focus:border-rose-600 focus:ring-2 focus:ring-rose-600/15 outline-none transition-all bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 text-sm font-bold shadow-soft rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={18}/> Authenticating...</>
              ) : (
                <><Lock size={16}/> Secure Authenticate</>
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}