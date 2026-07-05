"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, UserCheck, Sparkles } from "lucide-react";
import Link from "next/link";

// Master UI Components
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function CandidateLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // FETCH IP & BROWSER DETAILS FOR LEGAL PROOF
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
    
    // Strict Consent Check ONLY for Sign Up
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
          options: {
            emailRedirectTo: `${window.location.origin}/student/login?verified=true`,
          }
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

      // SAVE LEGAL PROOF TO DATABASE (Only on Sign Up)
      if (isSignUp && authUserId) {
         const legalData = await fetchLegalProof();
         await supabase.from("profiles").upsert({ 
             id: authUserId, 
             email: email,
             ...legalData 
         }, { onConflict: 'id' });

         // BREVO ALERT: New Signup
         try {
             await fetch('/api/send-admin-alert', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                     type: "signup",
                     candidateName: email.split('@')[0], 
                     candidateEmail: email
                 })
             });
         } catch (e) { console.error("Email alert failed", e); }
      }

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 relative font-sans text-white">
      
      {/* Background Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--primary)]/15 blur-[120px] rounded-full pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-200/80 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Resourcemania Home
        </Link>

        <Card className="bg-white/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-7 sm:p-9 text-[var(--foreground)]">
          
          {/* Header Icon */}
          <div className="flex justify-center mb-5">
            <div className="bg-gradient-to-br from-[var(--primary)] to-indigo-600 p-3.5 rounded-2xl text-white shadow-primary">
               <UserCheck className="w-8 h-8 stroke-[2.2]" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black font-display text-center text-[var(--foreground)] tracking-tight">
            Candidate Portal
          </h2>
          <p className="text-[var(--muted-foreground)] text-xs font-medium text-center mt-1 mb-6">
              {isSignUp ? "Create your candidate account to take AI assessments." : "Prove your skills. Get matched with top companies."}
          </p>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <label className="text-[11px] font-bold text-[var(--foreground)] uppercase tracking-wider block mb-1.5">Candidate Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-[var(--muted-foreground)]" size={17} />
                <input 
                  type="email" required placeholder="name@domain.com" 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 outline-none transition-all bg-white"
                />
              </div>
            </div>
            
            <div>
              <label className="text-[11px] font-bold text-[var(--foreground)] uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-[var(--muted-foreground)]" size={17} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required placeholder="Min 6 characters" minLength={6}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-xl py-3 pl-10 pr-11 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 outline-none transition-all bg-white"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {!isSignUp && (
                <div className="flex justify-end w-full mt-2">
                   <Link href="/forgot-password" className="text-xs text-[var(--primary)] font-bold hover:underline">
                    Forgot Password?
                   </Link>
                </div>
              )}
            </div>

            {/* SMART CONDITIONAL CONSENT */}
            {isSignUp ? (
              <div className="flex items-start gap-3 mt-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3.5">
                 <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreedToTerms} 
                    onChange={(e) => setAgreedToTerms(e.target.checked)} 
                    className="mt-0.5 w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                 />
                 <label htmlFor="terms" className="text-[11px] text-[var(--muted-foreground)] font-medium leading-relaxed cursor-pointer select-none">
                    I agree to be legally bound by Resourcemania&apos;s <Link href="/terms-of-service" className="text-[var(--primary)] font-bold hover:underline" target="_blank">Terms & Conditions</Link>, and authorize secure storage of my profile data.
                 </label>
              </div>
            ) : (
              <div className="mt-3 text-center">
                 <p className="text-[11px] text-[var(--muted-foreground)] font-medium">
                    By logging in, you agree to our <Link href="/terms-of-service" className="text-[var(--primary)] font-bold hover:underline" target="_blank">Terms & Conditions</Link>.
                 </p>
              </div>
            )}

            <Button 
               type="submit" 
               disabled={loading} 
               variant="primary"
               className="w-full mt-3 py-3.5 text-sm font-bold shadow-primary rounded-xl"
            >
              {loading ? <><Loader2 className="animate-spin" size={18}/> Processing...</> : (isSignUp ? "Create Candidate Account" : "Sign In to Candidate Portal")}
            </Button>
          </form>

          <div className="text-center text-xs font-semibold text-[var(--muted-foreground)] pt-3 border-t border-[var(--border)]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"} 
            <button onClick={() => { setIsSignUp(!isSignUp); setAgreedToTerms(false); }} className="text-[var(--primary)] font-extrabold ml-1.5 hover:underline transition-colors">
              {isSignUp ? "Sign In here" : "Sign Up now"}
            </button>
          </div>
        </Card>
        
      </motion.div>
    </div>
  );
}