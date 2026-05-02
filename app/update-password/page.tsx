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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-4 relative z-10 font-sans">
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        
        <Card className="p-8 md:p-12 relative overflow-hidden border-t-4 border-t-[var(--primary)] shadow-elevated">
          
          <div className="flex justify-center mb-6 relative z-10">
            <div className="bg-[var(--accent)] border border-[var(--border)] p-4 rounded-2xl shadow-sm">
               <CheckCircle className="w-10 h-10 text-[var(--primary)]" />
            </div>
          </div>
          
          <h2 className="font-display text-3xl font-extrabold text-center mb-2 text-[var(--foreground)] relative z-10">Set New Password</h2>
          <p className="text-[var(--muted-foreground)] font-medium text-center mb-8 relative z-10">Your identity has been verified. Please enter your new password below.</p>

          <form onSubmit={handleUpdate} className="space-y-4 mb-2 relative z-10">
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-[var(--muted-foreground)]" size={20} />
              <input 
                type="password" required placeholder="New Password (Min 6 chars)" minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--input)]/50 border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:bg-[var(--surface)] outline-none transition-all shadow-sm"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-[var(--muted-foreground)]" size={20} />
              <input 
                type="password" required placeholder="Confirm New Password" minLength={6}
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[var(--input)]/50 border border-[var(--border)] rounded-xl py-3 pl-12 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:bg-[var(--surface)] outline-none transition-all shadow-sm"
              />
            </div>
            
            <Button 
               type="submit" 
               disabled={loading} 
               variant="primary"
               className="w-full mt-6 py-4 text-lg"
            >
              {loading ? <><Loader2 className="animate-spin" size={20}/> Updating...</> : "Save New Password"}
            </Button>
          </form>
          
        </Card>
      </motion.div>
    </div>
  );
}