"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function CandidateLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // 🔥 FETCH IP & BROWSER DETAILS FOR LEGAL PROOF 🔥
  const fetchLegalProof = async () => {
    let ip = "Unknown IP";
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ip = data.ip;
    } catch (err) {
      console.warn("Could not fetch IP", err);
    }
    return {
      consent_timestamp: new Date().toISOString(),
      consent_ip: ip,
      consent_browser: typeof navigator !== 'undefined' ? navigator.userAgent : "Unknown Browser",
      agreed_to_terms: true
    };
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛑 Strict Consent Check ONLY for Sign Up 🛑
    if (isSignUp && !agreedToTerms) {
        return alert("🛑 Legal Requirement: Please read and tick the Terms & Conditions box to proceed.");
    }

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
      let authUserId = null;

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        authUserId = data.user?.id;
        alert("Success! Please check your email for the confirmation link.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        authUserId = data.user?.id;
        router.push("/student/dashboard");
      }

      // 🔥 SAVE LEGAL PROOF TO DATABASE (Only on Sign Up) 🔥
      if (isSignUp && authUserId) {
         const legalData = await fetchLegalProof();
         await supabase.from("profiles").upsert({ 
             id: authUserId, 
             email: email,
             ...legalData 
         }, { onConflict: 'id' });
      }

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500/20 p-4 rounded-2xl">
             <Briefcase className="w-10 h-10 text-blue-400" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2">Candidate Portal</h2>
        <p className="text-slate-400 text-center mb-8">
            {isSignUp ? "Create your candidate account." : "Prove your skills. Get hired."}
        </p>

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-500" size={20} />
            <input 
              type="email" required placeholder="Candidate Email" 
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                required placeholder="Password (Min 6 chars)" minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-slate-500 focus:border-blue-500 outline-none transition-all"
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

          {/* 🔥 SMART CONDITIONAL CONSENT 🔥 */}
          {isSignUp ? (
            <div className="flex items-start gap-3 mt-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
               <input 
                  type="checkbox" 
                  id="terms" 
                  checked={agreedToTerms} 
                  onChange={(e) => setAgreedToTerms(e.target.checked)} 
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500 cursor-pointer"
               />
               <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                  By creating an account, I confirm that I agree to be legally bound by Talexo's <Link href="/terms-of-service" className="text-blue-400 hover:underline font-bold" target="_blank">Terms & Conditions</Link>, and I authorise Talexo to securely store my profile data.
               </label>
            </div>
          ) : (
            <div className="mt-4 text-center">
               <p className="text-xs text-slate-500">
                  By logging in, you agree to our <Link href="/terms-of-service" className="text-blue-400 hover:underline" target="_blank">Terms & Conditions</Link>.
               </p>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-2">
            {loading ? <><Loader2 className="animate-spin" size={20}/> Processing...</> : (isSignUp ? "Sign Up" : "Login")}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400 mb-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"} 
          <button onClick={() => { setIsSignUp(!isSignUp); setAgreedToTerms(false); }} className="text-blue-400 font-bold ml-2 hover:underline transition-colors">
            {isSignUp ? "Login here" : "Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}