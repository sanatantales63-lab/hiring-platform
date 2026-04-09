"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle } from "lucide-react";

// 🔥 Naye Master Components 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

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
    <div className="min-h-screen bg-transparent text-slate-900 flex items-center justify-center p-4 relative z-10 font-sans">
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        
        <Card className="p-8 md:p-12 relative overflow-hidden border-t-4 border-t-emerald-500 shadow-2xl">
          
          <div className="flex justify-center mb-6 relative z-10">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl shadow-sm">
               <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-center mb-2 text-slate-900 relative z-10">Set New Password</h2>
          <p className="text-slate-500 font-medium text-center mb-8 relative z-10">Your identity has been verified. Please enter your new password below.</p>

          <form onSubmit={handleUpdate} className="space-y-4 mb-2 relative z-10">
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="password" required placeholder="New Password (Min 6 chars)" minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-sm"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="password" required placeholder="Confirm New Password" minLength={6}
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-sm"
              />
            </div>
            
            <Button 
               type="submit" 
               disabled={loading} 
               className="w-full mt-6 py-4 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 text-white"
            >
              {loading ? <><Loader2 className="animate-spin" size={20}/> Updating...</> : "Save New Password"}
            </Button>
          </form>
          
        </Card>
      </motion.div>
    </div>
  );
}