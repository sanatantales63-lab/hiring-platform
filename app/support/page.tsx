"use client";
import { ArrowLeft, HeadphonesIcon, Mail, MessageCircle, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="fixed top-[-20%] left-[20%] w-[50%] h-[50%] bg-green-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-semibold mb-8">
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <HeadphonesIcon size={40} className="text-green-400"/>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">How can we help?</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Having trouble with your assessment or profile? Our support team is here to help you out.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] hover:border-blue-500/50 transition-colors">
             <Mail className="text-blue-400 mb-4" size={32}/>
             <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
             <p className="text-slate-400 text-sm mb-4">Drop us an email anytime. We usually reply within 24 hours.</p>
             <a href="mailto:support@talexo.com" className="text-blue-400 font-bold hover:underline">support@talexo.com</a>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] hover:border-green-500/50 transition-colors">
             <MessageCircle className="text-green-400 mb-4" size={32}/>
             <h3 className="text-xl font-bold text-white mb-2">Live Chat / WhatsApp</h3>
             <p className="text-slate-400 text-sm mb-4">Urgent issue during an exam? Message our technical team directly.</p>
             <a href="#" onClick={() => alert("WhatsApp Support coming soon!")} className="text-green-400 font-bold hover:underline">+91 98XXX XXXXX</a>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
           <h3 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h3>
           
           <div className="space-y-6">
              <div className="border-b border-slate-800 pb-6">
                 <h4 className="text-white font-bold mb-2">My test got terminated. What should I do?</h4>
                 <p className="text-sm text-slate-400">If your test was terminated due to tab-switching or right-clicking, you will need to request a re-test from your dashboard. Admin approval is required to unlock your profile.</p>
              </div>
              <div className="border-b border-slate-800 pb-6">
                 <h4 className="text-white font-bold mb-2">How does the AI Salary Calculator work?</h4>
                 <p className="text-sm text-slate-400">Our AI analyzes your exact qualification (e.g., CA 1st attempt vs Multiple attempts) and aligns it with current Indian market standards to suggest a realistic Expected CTC.</p>
              </div>
              <div>
                 <h4 className="text-white font-bold mb-2">I am an employer. How do I unlock candidate details?</h4>
                 <p className="text-sm text-slate-400">Employers need an approved company account to view full contact details. Please register via the 'For Companies' portal and await admin verification.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}