"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";

// 🔥 Apne naye Master Components import kar liye 🔥
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
      
      // Login hone ke baad direct Owner Panel pe bhejega
      window.location.href = '/admin/dashboard';
      
    } catch (error: any) {
      alert("Admin Login Failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Naya Master Card Component */}
        <Card className="p-8 md:p-12 relative overflow-hidden border-t-4 border-t-red-500">
          
          {/* Subtle Red Admin Glow inside the card */}
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="flex justify-center mb-8 relative z-10">
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl shadow-sm">
              <ShieldCheck className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-center mb-2 text-slate-900 relative z-10">Owner Portal</h2>
          <p className="text-slate-500 font-medium text-center mb-8 relative z-10">Secure access to admin controls.</p>

          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6 relative z-10">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="email" required placeholder="Admin Email" 
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-red-400 focus:bg-white outline-none transition-all shadow-sm"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="password" required placeholder="Admin Password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-red-400 focus:bg-white outline-none transition-all shadow-sm"
              />
            </div>

            {/* Naya Master Button Component */}
            <Button
              type="submit"
              variant="danger"
              disabled={loading}
              className="w-full mt-6 py-4 text-lg"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20}/> Authenticating...</>
              ) : (
                <><Lock size={20}/> Secure Login</>
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}