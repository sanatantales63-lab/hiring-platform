"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// 🔥 Naye Master Components 🔥
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

      // 🔥 SAVE LEGAL PROOF TO DATABASE (Only on Sign Up) 🔥
      if (isSignUp && authUserId) {
         const legalData = await fetchLegalProof();
         await supabase.from("profiles").upsert({ 
             id: authUserId, 
             email: email,
             ...legalData 
         }, { onConflict: 'id' });

         // 🚀 BREVO ALERT: New Signup
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
    <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center p-4 relative z-10 font-sans">
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        
        <Card className="bg-white border border-[var(--border)] rounded-xl shadow-modal p-8 md:p-10 w-full">
          
          <div className="flex justify-center mb-6">
            <div className="bg-[var(--accent)] border border-[var(--border)] p-3.5 rounded-xl">
               <Briefcase className="w-9 h-9 text-[var(--primary)]" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold font-display text-center text-[var(--foreground)] mb-1">Candidate Portal</h2>
          <p className="text-[var(--muted-foreground)] text-sm text-center mb-6">
              {isSignUp ? "Create your candidate account." : "Prove your skills. Get hired."}
          </p>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-[var(--muted-foreground)]" size={18} />
              <input 
                type="email" required placeholder="Candidate Email" 
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg py-3 pl-11 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all bg-white text-sm"
              />
            </div>
            
            <div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-[var(--muted-foreground)]" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required placeholder="Password (Min 6 chars)" minLength={6}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-lg py-3 pl-11 pr-12 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all bg-white text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isSignUp && (
                <div className="flex justify-end w-full mt-2 mb-1">
                   <Link href="/forgot-password" className="text-xs text-[var(--primary)] font-medium hover:underline">
                    Forgot Password?
                   </Link>
                </div>
              )}
            </div>

            {/* 🔥 SMART CONDITIONAL CONSENT 🔥 */}
            {isSignUp ? (
              <div className="flex items-start gap-3 mt-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3.5">
                 <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreedToTerms} 
                    onChange={(e) => setAgreedToTerms(e.target.checked)} 
                    className="mt-1 w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                 />
                 <label htmlFor="terms" className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed cursor-pointer select-none">
                    By creating an account, I confirm that I agree to be legally bound by Resourcemania's <Link href="/terms-of-service" className="text-[var(--primary)] font-semibold hover:underline" target="_blank">Terms & Conditions</Link>, and I authorise Resourcemania to securely store my profile data.
                 </label>
              </div>
            ) : (
              <div className="mt-4 text-center">
                 <p className="text-xs text-[var(--muted-foreground)] font-medium">
                    By logging in, you agree to our <Link href="/terms-of-service" className="text-[var(--primary)] font-bold hover:underline" target="_blank">Terms & Conditions</Link>.
                 </p>
              </div>
            )}

            <Button 
               type="submit" 
               disabled={loading} 
               variant="primary"
               className="w-full mt-2 py-4 text-lg"
            >
              {loading ? <><Loader2 className="animate-spin" size={20}/> Processing...</> : (isSignUp ? "Sign Up" : "Login")}
            </Button>
          </form>

          <div className="text-center text-sm font-medium text-[var(--muted-foreground)] mb-2">
            {isSignUp ? "Already have an account?" : "Don't have an account?"} 
            <button onClick={() => { setIsSignUp(!isSignUp); setAgreedToTerms(false); }} className="text-[var(--primary)] font-semibold ml-2 hover:underline transition-colors">
              {isSignUp ? "Login here" : "Sign Up"}
            </button>
          </div>
        </Card>
        
      </motion.div>
    </div>
  );
}