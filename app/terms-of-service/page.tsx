"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, ArrowLeft, ShieldCheck, Info, FileText, 
  UserCheck, Laptop, Lock, AlertTriangle, XOctagon, Scale, Mail
} from "lucide-react";

export default function TermsOfService() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("about");

  const sections = [
    { id: "about", title: "1. About Talexo", icon: <Info size={16} /> },
    { id: "definitions", title: "2. Definitions", icon: <FileText size={16} /> },
    { id: "eligibility", title: "3. Eligibility", icon: <UserCheck size={16} /> },
    { id: "assessments", title: "4. Assessments", icon: <Laptop size={16} /> },
    { id: "privacy", title: "5. Data Privacy", icon: <Lock size={16} /> },
    { id: "guarantee", title: "6. No Guarantee", icon: <AlertTriangle size={16} /> },
    { id: "termination", title: "7. Termination", icon: <XOctagon size={16} /> },
    { id: "legal", title: "8. Legal & Notices", icon: <Scale size={16} /> },
    { id: "contact", title: "9. Contact Us", icon: <Mail size={16} /> },
  ];

  // Optional: Scrollspy to highlight active section (simple version)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* NAVBAR */}
      <nav className="w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <Briefcase className="text-blue-500" strokeWidth={2.5} /> Talexo
          </div>
          <button onClick={() => router.back()} className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg border border-slate-800">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </nav>

      {/* HEADER SECTION */}
      <div className="bg-slate-900/50 border-b border-slate-800/50 relative overflow-hidden">
        <div className="absolute top-[-50%] left-[20%] w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
             <ShieldCheck size={16} /> Legal Documentation
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Candidate Terms & Conditions
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            Please read these terms carefully. By registering and using the Talexo platform, you agree to be bound by the rules and policies outlined below.
          </p>
          <div className="flex gap-6 mt-8 text-sm font-bold text-slate-500">
             <span>Effective Date: March 2026</span>
             <span>•</span>
             <span>Version 1.0</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT WITH SIDEBAR */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 relative">
        
        {/* STICKY SIDEBAR (Hidden on mobile) */}
        <div className="hidden lg:block w-1/4 shrink-0">
           <div className="sticky top-32 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Table of Contents</h3>
              <ul className="space-y-2">
                 {sections.map((section) => (
                    <li key={section.id}>
                       <button 
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                             ${activeSection === section.id 
                                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"}`}
                       >
                          {section.icon} {section.title}
                       </button>
                    </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* CONTENT AREA */}
        <div className="w-full lg:w-3/4 space-y-16">
          
          <div className="bg-blue-950/20 border-l-4 border-blue-500 p-6 rounded-r-2xl">
             <h3 className="text-lg font-bold text-white mb-2">Important Notice</h3>
             <p className="text-slate-300 leading-relaxed text-sm">
               These Terms and Conditions govern your use of the Talexo platform as a candidate. 
               <strong className="text-blue-300"> By registering on Talexo, you confirm that you have read, understood, and agree to be bound by this Agreement. </strong> 
               If you do not agree, please do not register or use the platform.
             </p>
          </div>

          <section id="about" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><Info className="text-blue-500"/> 1. About Talexo</h2>
            <div className="text-slate-300 leading-relaxed space-y-4 text-sm md:text-base">
               <p>Talexo is an online hiring platform that connects verified, skill-tested candidates with organisations seeking short-term, contractual, or project-based professionals. Talexo's core differentiator is its rigorous, domain-specific assessment process that verifies each candidate's competency before listing them on the platform.</p>
               <p>Talexo is operated by Talexo Technologies Private Limited, a company incorporated under the Companies Act 2013 and registered in India ('Talexo', 'we', 'us', 'our').</p>
            </div>
          </section>

          <section id="definitions" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><FileText className="text-blue-500"/> 2. Definitions</h2>
            <div className="grid gap-4">
              <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800"><strong className="text-white text-base">Candidate / You:</strong> <span className="text-slate-400 block mt-1 text-sm">Any individual who registers on the Talexo platform with the intent to be listed for professional opportunities.</span></div>
              <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800"><strong className="text-white text-base">Platform:</strong> <span className="text-slate-400 block mt-1 text-sm">The Talexo website, mobile application, and any related digital services operated by Talexo.</span></div>
              <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800"><strong className="text-white text-base">Client:</strong> <span className="text-slate-400 block mt-1 text-sm">Any company, firm, or individual that accesses Talexo to identify and engage candidates.</span></div>
              <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800"><strong className="text-white text-base">Assessment:</strong> <span className="text-slate-400 block mt-1 text-sm">The skill-testing process administered by Talexo to verify a candidate's professional competency.</span></div>
              <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800"><strong className="text-white text-base">Profile:</strong> <span className="text-slate-400 block mt-1 text-sm">The candidate's information, including test scores, education, and professional history, visible to Clients.</span></div>
            </div>
          </section>

          <section id="eligibility" className="scroll-mt-32">
             <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><UserCheck className="text-blue-500"/> 3. Eligibility and Registration</h2>
             <p className="text-slate-300 mb-4">To register as a Candidate on Talexo, you must:</p>
             <ul className="space-y-3">
               <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div><span className="text-slate-400">Be at least 18 years of age.</span></li>
               <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div><span className="text-slate-400">Provide accurate, current, and complete information during registration.</span></li>
               <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div><span className="text-slate-400">Maintain the security of your account credentials. You are solely responsible for all activities that occur under your account.</span></li>
             </ul>
          </section>

          <section id="assessments" className="scroll-mt-32">
             <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><Laptop className="text-blue-500"/> 4. Assessments and Verification</h2>
             <p className="text-slate-300 mb-4 leading-relaxed">Talexo requires candidates to pass domain-specific Assessments. By taking an Assessment, you agree that:</p>
             <ul className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800 space-y-4">
               <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div><span className="text-slate-400">You will complete the test independently without assistance from individuals, AI tools, or unauthorised materials.</span></li>
               <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div><span className="text-slate-400">You consent to Talexo's proctoring measures (which may include camera, microphone, and screen monitoring) to ensure integrity.</span></li>
               <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div><span className="text-slate-400">Violation of test integrity rules will result in immediate disqualification and a permanent ban from the Platform.</span></li>
               <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div><span className="text-slate-400">Talexo's AI assessment scoring is final and cannot be challenged manually.</span></li>
             </ul>
          </section>

          <section id="privacy" className="scroll-mt-32">
             <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><Lock className="text-blue-500"/> 5. Data Privacy and Profile Sharing</h2>
             <p className="text-slate-300 mb-4 leading-relaxed">By registering, you explicitly authorise Talexo to:</p>
             <ul className="space-y-3 mb-6">
               <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div><span className="text-slate-400">Store your personal, educational, and professional data securely.</span></li>
               <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div><span className="text-slate-400">Display your Profile, including your Assessment scores and analytics, to verified Clients on the Platform.</span></li>
               <li className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div><span className="text-slate-400">Market your anonymised or public profile to prospective Clients to facilitate hiring.</span></li>
             </ul>
             <div className="bg-green-950/20 border border-green-900/50 p-4 rounded-xl text-green-400 text-sm font-medium">
                🛡️ Note: Talexo does not sell candidate data to third-party marketing agencies. Data is strictly used for recruitment facilitation.
             </div>
          </section>

          <section id="guarantee" className="scroll-mt-32">
             <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><AlertTriangle className="text-blue-500"/> 6. No Guarantee of Employment</h2>
             <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
               While Talexo strives to connect top talent with premium companies, you acknowledge and agree that:
               <strong className="text-white block mt-2"> Registering on the Platform, creating a Profile, and passing Assessments do not guarantee employment, job offers, or project assignments. </strong>
               The final hiring decision rests solely with the Client.
             </p>
          </section>

          <section id="termination" className="scroll-mt-32">
             <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><XOctagon className="text-blue-500"/> 7. Termination</h2>
             <p className="text-slate-300 mb-4">Talexo administrators reserve the right to suspend or terminate your account at any time, without prior notice, for:</p>
             <ul className="grid md:grid-cols-3 gap-4">
               <li className="bg-red-950/10 border border-red-900/30 p-4 rounded-xl text-slate-400 text-sm">Violations of this Agreement.</li>
               <li className="bg-red-950/10 border border-red-900/30 p-4 rounded-xl text-slate-400 text-sm">Suspected fraud, misrepresentation of identity, or cheating.</li>
               <li className="bg-red-950/10 border border-red-900/30 p-4 rounded-xl text-slate-400 text-sm">Unprofessional conduct towards Clients or Talexo staff.</li>
             </ul>
          </section>

          <section id="legal" className="scroll-mt-32">
             <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><Scale className="text-blue-500"/> 8. Force Majeure & Notices</h2>
             <div className="space-y-6">
                <div>
                   <h4 className="text-white font-bold mb-1">Force Majeure</h4>
                   <p className="text-slate-400 text-sm leading-relaxed">Neither party shall be liable for any failure or delay in performance resulting from causes beyond their reasonable control, including natural disasters, governmental actions, network failures, or pandemic-related disruptions.</p>
                </div>
                <div>
                   <h4 className="text-white font-bold mb-1">Notices</h4>
                   <p className="text-slate-400 text-sm leading-relaxed">All notices from you to Talexo must be sent to support@talexo.in. Notices from Talexo to you will be sent to your registered email address.</p>
                </div>
             </div>
          </section>

          <section id="contact" className="scroll-mt-32 border-t border-slate-800 pt-12 pb-8">
             <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-8 rounded-3xl text-center">
                <h2 className="text-2xl font-bold mb-4 text-white">Have questions?</h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">If you have any questions or concerns regarding these Terms and Conditions, please reach out to us before using the platform.</p>
                
                <div className="flex flex-wrap justify-center gap-6">
                   <div className="text-left">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Us</span>
                      <a href="mailto:support@talexo.in" className="text-blue-400 font-medium hover:text-blue-300">support@talexo.in</a>
                   </div>
                   <div className="w-px bg-slate-800 hidden md:block"></div>
                   <div className="text-left">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Grievance Officer</span>
                      <a href="mailto:grievance@talexo.in" className="text-blue-400 font-medium hover:text-blue-300">grievance@talexo.in</a>
                   </div>
                   <div className="w-px bg-slate-800 hidden md:block"></div>
                   <div className="text-left">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company</span>
                      <span className="text-slate-300 font-medium">Talexo Technologies Pvt. Ltd.</span>
                   </div>
                </div>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}