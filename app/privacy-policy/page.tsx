"use client";
import { ArrowLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-semibold mb-8">
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <Shield size={32} className="text-blue-400"/>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">Privacy Policy</h1>
              <p className="text-slate-400 mt-2">Last updated: February 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-sm md:text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
              <p>When you use Talexo, we collect information that you provide directly to us, such as when you create an account, update your profile, upload a resume, or contact customer support. This includes your name, email address, phone number, educational background, and employment history.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. How We Use AI and Data</h2>
              <p>Talexo utilizes advanced Artificial Intelligence (AI) to parse resumes and accurately assess skills. By uploading your resume, you consent to our AI processing your document to extract professional details and calculate market-standard salary expectations. We do not use your personal data to train public AI models.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Data Sharing with Employers</h2>
              <p>For candidates, your profile information and assessment scores are shared with registered recruiters and companies on Talexo to facilitate hiring. Sensitive contact information (like phone and email) may be locked and only revealed to verified employers at our discretion or upon your approval.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Proctoring and Anti-Cheat Data</h2>
              <p>During skill assessments, our platform monitors tab-switching, right-clicks, and screen activity to ensure fairness. This activity is logged temporarily to generate a proctoring trust score but is not sold to any third-party analytics firms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Data Security</h2>
              <p>We use industry-standard database security (including Row Level Security) to protect your personal information from unauthorized access. However, no internet transmission is 100% secure.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}