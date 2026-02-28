"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CompanyLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🛡️ Security Guard: Temp mails blocked
    if (isSignUp) {
      const blockedDomains = ["@tempmail.com", "@yopmail.com", "@10minutemail.com", "@guerrillamail.com"];
      const isFakeEmail = blockedDomains.some(domain => email.toLowerCase().endsWith(domain));
      
      if (isFakeEmail || email.toLowerCase().endsWith(".xyz")) {
        setLoading(false);
        return alert("Temporary or disposable emails are not allowed for recruiters.");
      }
    }

    try {
      if (isSignUp) {
        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/company/auth/callback`,
          }
        });
        if (error) throw error;

        // 🔥 FIX 1: Auto-create company row so Admin can see it immediately
        if (authData?.user) {
            await supabase.from('companies').upsert({
                id: authData.user.id,
                email: email,
                name: "New Company", 
                status: "pending" 
            });
        }

        alert("Success! Please check your email for the verification link.");
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        if (data?.session) {
           // 🔥 FIX 2: ROLE GUARD - Check if this user is actually a Student
           const { data: studentData } = await supabase.from('profiles').select('id').eq('id', data.session.user.id).maybeSingle();
           
           if (studentData) {
               await supabase.auth.signOut(); // Turant bahar nikalo
               return alert("🛑 Access Denied: This email is registered as a Candidate. Please use the Candidate Portal to login.");
           }

           console.log("Company Login Successful! Redirecting to dashboard...");
           window.location.href = '/company/dashboard';
        } else {
           alert("Login successful, but session not found. Please try again.");
        }
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-500/20 p-4 rounded-2xl">
             <Briefcase className="w-10 h-10 text-purple-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2">Company Portal</h2>
        <p className="text-slate-400 text-center mb-8">{isSignUp ? "Create a recruiter account." : "Hire top 1% talent verified by AI."}</p>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-500" size={20} />
            <input 
              type="email" required placeholder="Company Email" 
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-purple-500 outline-none"
            />
          </div>
          
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                required placeholder="Password (Min 6 chars)" minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-slate-500 focus:border-purple-500 outline-none"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {!isSignUp && (
              <div className="flex justify-end w-full mt-2 mb-1">
                 <a href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 hover:underline">
                  Forgot Password?
                 </a>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3">
            {loading ? <><Loader2 className="animate-spin" size={20}/> Processing...</> : (isSignUp ? "Sign Up" : "Login")}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400 mb-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"} 
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-purple-400 font-bold ml-2 hover:underline">
            {isSignUp ? "Login here" : "Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}