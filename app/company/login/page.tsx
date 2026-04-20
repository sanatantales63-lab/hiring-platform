"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 🔥 Naye Master Components 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function CompanyLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
        return alert("Temporary or disposable emails are not allowed for recruiters.");
      }
    }

    try {
      let authUserId = null;

      if (isSignUp) {
        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/company/auth/callback`,
          }
        });
        if (error) throw error;
        
        authUserId = authData?.user?.id;

        // 🔥 Auto-create company row with Legal Proof
        if (authUserId) {
            const legalData = await fetchLegalProof();
            await supabase.from('companies').upsert({
                id: authUserId,
                email: email,
                name: "New Company", 
                status: "pending",
                ...legalData
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
           authUserId = data.session.user.id;

           const { data: studentData } = await supabase.from('profiles').select('id').eq('id', authUserId).maybeSingle();
           
           if (studentData) {
               await supabase.auth.signOut(); 
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
    <div className="min-h-screen bg-transparent text-slate-900 flex items-center justify-center p-4 relative z-10 font-sans">
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        
        <Card className="p-8 md:p-12 relative overflow-hidden border-t-4 border-t-indigo-600 shadow-2xl">
          
          <div className="flex justify-center mb-6 relative z-10">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl shadow-sm">
               <Briefcase className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-center mb-2 text-slate-900 relative z-10">Company Portal</h2>
          <p className="text-slate-500 font-medium text-center mb-8 relative z-10">
            {isSignUp ? "Create a recruiter account." : "Hire top 1% talent verified by AI."}
          </p>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6 relative z-10">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="email" required placeholder="Company Email" 
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
              />
            </div>
            
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required placeholder="Password (Min 6 chars)" minLength={6}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white outline-none transition-all shadow-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {!isSignUp && (
                <div className="flex justify-end w-full mt-2 mb-1">
                   <Link href="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                    Forgot Password?
                   </Link>
                </div>
              )}
            </div>

            {/* 🔥 SMART CONDITIONAL CONSENT 🔥 */}
            {isSignUp ? (
              <div className="flex items-start gap-3 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                 <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreedToTerms} 
                    onChange={(e) => setAgreedToTerms(e.target.checked)} 
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                 />
                 <label htmlFor="terms" className="text-xs text-slate-600 font-medium leading-relaxed cursor-pointer select-none">
                    By creating an account, I confirm that I have read, understood, and agree to be legally bound by Resourcemania's <Link href="/terms-of-service" className="text-indigo-600 hover:underline font-bold" target="_blank">Terms & Conditions</Link>, and I authorise Resourcemania to securely store my access logs.
                 </label>
              </div>
            ) : (
              <div className="mt-4 text-center">
                 <p className="text-xs text-slate-500 font-medium">
                    By logging in, you agree to our <Link href="/terms-of-service" className="text-indigo-600 font-bold hover:underline" target="_blank">Terms & Conditions</Link>.
                 </p>
              </div>
            )}

            <Button 
               type="submit" 
               disabled={loading} 
               className="w-full mt-2 py-4 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 text-white border-none"
            >
              {loading ? <><Loader2 className="animate-spin" size={20}/> Processing...</> : (isSignUp ? "Sign Up" : "Login")}
            </Button>
          </form>

          <div className="text-center text-sm font-medium text-slate-500 mb-2 relative z-10">
            {isSignUp ? "Already have an account?" : "Don't have an account?"} 
            <button onClick={() => { setIsSignUp(!isSignUp); setAgreedToTerms(false); }} className="text-indigo-600 font-extrabold ml-2 hover:underline transition-colors">
              {isSignUp ? "Login here" : "Sign Up"}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}