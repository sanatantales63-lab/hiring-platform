"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function CandidateLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const blockedDomains = ["@tempmail.com", "@yopmail.com", "@10minutemail.com", "@guerrillamail.com"];
      const isFakeEmail = blockedDomains.some(domain => email.toLowerCase().endsWith(domain));
      
      if (isFakeEmail || email.toLowerCase().endsWith(".xyz")) {
        setLoading(false);
        return alert("Temporary or disposable emails are not allowed. Please use a valid email.");
      }
    }

    try {
      if (isSignUp) {
        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });
        if (error) throw error;

        // 🔥 FIX 1: Auto-create student row 
        if (authData?.user) {
            await supabase.from('profiles').upsert({
                id: authData.user.id,
                email: email,
                fullName: ""
            });
        }

        alert("Registration successful! Please check your email to verify your account.");
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        if (data?.session) {
          // 🔥 FIX 2: ROLE GUARD - Check if this user is a Company
          const { data: companyData } = await supabase.from('companies').select('id').eq('id', data.session.user.id).maybeSingle();
           
          if (companyData) {
              await supabase.auth.signOut(); 
              return alert("🛑 Access Denied: This email is registered as a Company. Please use the Company Portal to login.");
          }

          console.log("Login Successful! Redirecting to dashboard...");
          window.location.href = '/student/dashboard';
        } else {
          alert("Login successful, but session not found. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Auth Error:", error.message);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden text-white p-4 font-sans">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/50 border border-slate-800 p-8 md:p-12 rounded-3xl backdrop-blur-xl max-w-md w-full shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 transform rotate-3 border border-blue-500/20">
             <Briefcase size={32} className="text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Candidate Portal</h1>
          <p className="text-slate-400">{isSignUp ? "Create your profile to get hired." : "Join professionals getting hired."}</p>
        </div>

        {isSignUp && (
          <div className="space-y-3 mb-6">
             <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <CheckCircle size={16} className="text-green-500"/> Verified Skill Assessments
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <CheckCircle size={16} className="text-green-500"/> Direct Offers from Companies
             </div>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-500" size={20} />
            <input 
              type="email" required placeholder="Your Email" 
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                required placeholder="Password (Min 6 chars)" minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
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
                <a href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">
                  Forgot Password?
                </a>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3">
            {loading ? <><Loader2 className="animate-spin" size={20}/> Processing...</> : (isSignUp ? "Create Account" : "Login")}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400 mb-6">
          {isSignUp ? "Already have an account?" : "New to the platform?"} 
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-400 font-bold ml-2 hover:underline">
            {isSignUp ? "Login here" : "Sign Up"}
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
           By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}