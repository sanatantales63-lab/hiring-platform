"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { 
  User, MapPin, Briefcase, Phone, Mail, GraduationCap, Globe, Sparkles, 
  Lock, ShieldAlert, FileText, CreditCard, ChevronDown, ChevronUp, Target, PlusCircle, AlertTriangle, Star, CheckCircle, RefreshCcw, Mic, Video, Monitor, Building
} from "lucide-react";

export default function CandidateProfileView({ candidate, role }: { candidate: any, role: 'student' | 'company' | 'admin' }) {
  const [showAllEdu, setShowAllEdu] = useState(false);
  const [showAllWork, setShowAllWork] = useState(false); // 🔥 WORK EXP TOGGLE STATE 🔥
  const [isResetting, setIsResetting] = useState(false);

  if (!candidate) return null;

  const isCompany = role === 'company';
  const isAdmin = role === 'admin';
  const isDisqualified = candidate.examAccess === 'disqualified';
  
  const emailToDisplay = isCompany ? "hidden@candidate.com" : (candidate.email || "Email Not Added");
  const phoneToDisplay = isCompany ? "+91 98XXXXXX00" : (candidate.phone || "Phone Not Added");
  const panToDisplay = isCompany ? "XXXXX1234X" : (candidate.panCard || "Not Provided");
  const dobToDisplay = isCompany ? "XX/XX/XXXX" : (candidate.dob || "Not Provided");

  // 🎓 🔥 THE SUPER-SMART BADGE LOGIC 🔥 🎓
  let smartTitle = candidate.educations?.[0]?.qualification || candidate.qualification || "Candidate";
  const topEdu = candidate.educations?.[0];
  
  if (topEdu && topEdu.qualification) {
     const q = topEdu.qualification.toLowerCase();
     // Use regex to catch CA, CA-Final, CA-Inter, etc. properly
     if (/\bca\b/.test(q) || q.includes('ca-') || q.includes('chartered accountant')) {
         smartTitle = 'Chartered Accountant (CA)';
     }
     else if (/\bcma\b/.test(q) || q.includes('cma-') || q.includes('cost & management')) {
         smartTitle = 'Cost & Management Accountant (CMA)';
     }
     else if (/\bcs\b/.test(q) || q.includes('cs-') || q.includes('company secretary')) {
         smartTitle = 'Company Secretary (CS)';
     }
     else if (q.includes('acca')) smartTitle = 'ACCA Professional';
     else if (q.includes('mba')) smartTitle = 'MBA Professional';
     else if (q.includes('b.com') || q.includes('bcom') || q.includes('bachelor of commerce')) {
         smartTitle = 'Commerce Graduate (B.Com)';
     }
     else smartTitle = topEdu.qualification;
  }

  // Arrays Setup
  const educationsList = Array.isArray(candidate.educations) ? candidate.educations : [];
  const workExpList = Array.isArray(candidate.workExperience) ? candidate.workExperience : [];
  
  const displayedEducations = showAllEdu ? educationsList : educationsList.slice(0, 3);
  const extraEduCount = educationsList.length > 3 ? educationsList.length - 3 : 0;

  // 🔥 WORK EXP LIMITER LOGIC 🔥
  const displayedWorkExp = showAllWork ? workExpList : workExpList.slice(0, 2);
  const extraWorkCount = workExpList.length > 2 ? workExpList.length - 2 : 0;

  const safeLanguages = Array.isArray(candidate.languages) ? candidate.languages.filter((l:any) => typeof l === 'object' && l !== null && l.language) : [];

  const PREDEFINED_SKILLS = ["Journal Entry", "Book Closure", "Financial Statements", "Ind-AS", "Accounting Standards", "Tally ERP", "SAP", "TDS Return", "GST Return", "Income Tax", "Corporate Tax", "Excel Beginner", "Excel Intermediate", "Excel Advanced", "VLOOKUP", "Macros"];
  const allSkills = Array.isArray(candidate.skills) ? candidate.skills.filter((skill: any) => typeof skill === 'string') : [];
  const verifiedSkills = allSkills.filter((skill: string) => PREDEFINED_SKILLS.includes(skill));
  const additionalSkills = allSkills.filter((skill: string) => !PREDEFINED_SKILLS.includes(skill));

  const showReview = candidate.hired_status === 'hired' && candidate.company_rating && (candidate.company_rating >= 3 || isAdmin);

  const metaObj = candidate.meta || {};
  const warns = metaObj.warnings || { tab: metaObj.warningsCount || 0, mic: 0, cam: 0 };
  const hasMediaWarnings = warns.mic > 0 || warns.cam > 0;

  const handleResetMediaWarnings = async () => {
     if(!confirm("Are you sure you want to forgive this candidate and clear their Mic/Camera warnings?")) return;
     setIsResetting(true);
     try {
         const newMeta = { ...metaObj, warnings: { tab: warns.tab, mic: 0, cam: 0 }, warningsCount: warns.tab, status: "Passed" };
         let newAccess = candidate.examAccess;
         if (isDisqualified && warns.tab < 2) newAccess = 'granted'; 

         await supabase.from("profiles").update({ meta: newMeta, examAccess: newAccess }).eq("id", candidate.id);
         alert("Warnings Cleared! Test access re-granted if applicable.");
         window.location.reload(); 
     } catch (e) { alert("Error resetting warnings"); }
     setIsResetting(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER CARD */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-slate-800 border-4 border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl shrink-0">
          {candidate.photoURL && !isCompany ? <img src={candidate.photoURL} className="w-full h-full object-cover"/> : <User size={64} className="text-slate-500"/>}
        </div>
        
        <div className="relative z-10 text-center md:text-left flex-1 mt-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
             <div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-2 tracking-tight">{candidate.fullName || "Name Not Set"}</h2>
                <p className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-6 bg-blue-500/10 inline-block px-4 py-1.5 rounded-xl border border-blue-500/20">
                   {smartTitle}
                </p>
             </div>

             {(isAdmin || isCompany) && (
                <div className="text-right bg-slate-950/80 p-5 rounded-2xl border border-slate-800 shadow-inner min-w-[180px]">
                   {isDisqualified ? (
                       <div className="text-2xl font-extrabold text-red-500 flex items-center gap-2 justify-end mb-1"><ShieldAlert size={24}/> Banned</div>
                   ) : (
                       <div className="text-4xl font-extrabold text-green-400 mb-1">{metaObj.totalScore !== undefined ? `${metaObj.totalScore}` : "N/A"}</div>
                   )}
                   <p className="text-slate-400 text-xs">AI Verified Score</p>
                </div>
             )}
          </div>
          
          <div className={`flex flex-wrap justify-center md:justify-start gap-3 text-sm font-medium ${isCompany ? 'blur-[4px] select-none opacity-50' : ''}`}>
            <span className="flex items-center gap-2 text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 shadow-inner"><MapPin size={16} className="text-blue-500"/> {candidate.city || "City"}</span>
            <span className="flex items-center gap-2 text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 shadow-inner"><Phone size={16} className="text-green-500"/> {phoneToDisplay}</span>
            <span className="flex items-center gap-2 text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 shadow-inner"><Mail size={16} className="text-yellow-500"/> {emailToDisplay}</span>
          </div>

          {isCompany && (
             <div className="mt-4 inline-flex bg-slate-900/90 backdrop-blur-xl px-5 py-2 rounded-xl border border-yellow-500/50 text-yellow-500 text-xs font-bold items-center gap-2 shadow-lg">
                <Lock size={16}/> CONTACT INFO LOCKED BY ADMIN
             </div>
          )}
        </div>
      </div>

      {showReview && (
         <div className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 p-8 rounded-[2rem] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Star size={100}/></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
               <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Briefcase className="text-yellow-500" size={32}/>
               </div>
               <div>
                  <h3 className="text-xl font-extrabold text-white mb-1 flex items-center gap-2">Verified Corporate Experience <CheckCircle className="text-green-400" size={18}/></h3>
                  <p className="text-slate-300 mb-3 font-medium">Hired by <strong className="text-white">{candidate.hired_company_name}</strong> through Talexo</p>
                  <div className="flex gap-1 mb-3">
                     {[1,2,3,4,5].map(star => <Star key={star} size={18} fill={star <= candidate.company_rating ? "#EAB308" : "none"} className={star <= candidate.company_rating ? "text-yellow-500" : "text-slate-600"}/>)}
                  </div>
                  {candidate.company_review && <p className="text-slate-400 italic text-lg leading-relaxed">"{candidate.company_review}"</p>}
               </div>
            </div>
         </div>
      )}

      {candidate.bio && (
         <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Sparkles className="text-blue-400" size={20}/> Professional Summary</h3>
            <p className="text-slate-300 leading-relaxed text-base md:text-lg italic">"{candidate.bio}"</p>
         </div>
      )}

      {/* 🏢 PAST WORK EXPERIENCE SECTION 🏢 */}
      {workExpList.length > 0 && (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg">
             <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Building className="text-green-400"/> Past Work Experience</h3>
             <div className="space-y-4">
                 {displayedWorkExp.map((work:any, i:number) => (
                    <div key={i} className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-700 transition-colors">
                       <div>
                          <p className="font-bold text-lg text-white">{work.company}</p>
                          <p className="text-sm text-blue-400 font-bold mt-1">{work.role}</p>
                       </div>
                       <div className="text-left sm:text-right">
                          <p className="text-slate-400 text-sm font-medium bg-slate-800 px-3 py-1 rounded-lg inline-block">{work.duration}</p>
                       </div>
                    </div>
                 ))}

                 {/* 🔥 SHOW MORE BUTTON FOR WORK EXP 🔥 */}
                 {extraWorkCount > 0 && (
                    <button onClick={() => setShowAllWork(!showAllWork)} className="w-full mt-2 py-3 border border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-bold flex items-center justify-center gap-2">
                       {showAllWork ? <><ChevronUp size={16}/> Show Less</> : <><ChevronDown size={16}/> View {extraWorkCount} More Experiences</>}
                    </button>
                 )}
             </div>
          </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
         <div className="md:col-span-1 space-y-8">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Briefcase className="text-purple-400"/> Career Status</h3>
               <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between border-b border-slate-800/80 pb-3"><span className="text-slate-400">Total Exp.</span><span className="text-white font-bold bg-slate-800 px-3 py-1 rounded-lg">{candidate.experience}</span></div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-3"><span className="text-slate-400">Current Status</span><span className="text-white">{candidate.currentStatus}</span></div>
               </div>
            </div>

            <div className={`bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg relative ${isCompany ? 'overflow-hidden group' : ''}`}>
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><User className="text-purple-400"/> Personal Details</h3>
               <div className={`space-y-4 text-sm font-medium ${isCompany ? 'blur-[4px] opacity-40 select-none' : ''}`}>
                  <div className="flex justify-between border-b border-slate-800/80 pb-3"><span className="text-slate-400">DOB</span><span className="text-white">{dobToDisplay}</span></div>
                  <div className="flex justify-between pb-1"><span className="text-slate-400 flex items-center gap-1"><CreditCard size={14}/> PAN</span><span className="text-yellow-400 font-bold tracking-widest uppercase">{panToDisplay}</span></div>
               </div>
               {isCompany && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                     <Lock size={32} className="text-yellow-500/50"/>
                  </div>
               )}
            </div>
         </div>

         <div className="md:col-span-2 space-y-8">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg">
               <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><GraduationCap className="text-purple-400"/> Education & Certifications</h3>
               <div className="space-y-4">
                   {displayedEducations.map((edu:any, i:number) => (
                      <div key={i} className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-700 transition-colors">
                         <div>
                            <p className="font-bold text-lg text-white">
                               {edu.qualification} 
                               {edu.stageCleared && <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded ml-2 uppercase font-bold">{edu.stageCleared}</span>}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">{edu.collegeName || "Institution not specified"}</p>
                         </div>
                         <div className="text-left sm:text-right">
                            <p className="text-white font-bold bg-slate-800 px-3 py-1 rounded-lg inline-block">{edu.passingYear || "N/A"}</p>
                         </div>
                      </div>
                   ))}

                   {extraEduCount > 0 && (
                      <button onClick={() => setShowAllEdu(!showAllEdu)} className="w-full mt-2 py-3 border border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-bold flex items-center justify-center gap-2">
                         {showAllEdu ? <><ChevronUp size={16}/> Show Less</> : <><ChevronDown size={16}/> View {extraEduCount} More Qualifications</>}
                      </button>
                   )}
               </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Sparkles className="text-blue-400"/> Skills & Expertise</h3>
               <div className="flex flex-wrap gap-2.5">
                  {verifiedSkills.map((skill:string, i:number) => (
                     <span key={`v-${i}`} title="AI Testable Skill" className="bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-500/20 flex items-center gap-1.5">
                        <CheckCircle size={14}/> {skill}
                     </span>
                  ))}

                  {additionalSkills.map((skill:string, i:number) => (
                     <span key={`a-${i}`} className="bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-700/80">
                        {skill}
                     </span>
                  ))}

                  {allSkills.length === 0 && <span className="text-slate-500 text-sm italic">No skills selected.</span>}
               </div>
            </div>
         </div>
      </div>

      {metaObj.skillScores && Object.keys(metaObj.skillScores).length > 0 && (
         <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 md:p-10 rounded-[2.5rem] shadow-2xl mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 border-b border-slate-800/80 pb-6">
               <div>
                  <h3 className="text-3xl font-extrabold text-white flex items-center gap-3"><Target className="text-green-400" size={32}/> Detailed Assessment Report</h3>
                  <p className="text-slate-400 mt-2">Verified Skill-by-Skill AI Analytics</p>
                  
                  {metaObj.status && metaObj.status.includes('Auto-Submitted') && (
                     <div className="mt-4 bg-orange-500/10 border border-orange-500/30 text-orange-400 p-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                        <AlertTriangle size={18} className="shrink-0"/> 
                        Test was Auto-Submitted early due to multiple Media/Proctoring Violations.
                     </div>
                  )}
               </div>
               
               <div className="mt-4 md:mt-0 flex gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                     <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 flex items-center gap-1"><AlertTriangle size={12}/> Trust Alerts</p>
                     <div className="flex gap-4">
                        <div className="text-center">
                           <span className={`text-lg font-bold flex items-center gap-1 ${warns.tab > 0 ? 'text-red-400' : 'text-slate-300'}`}><Monitor size={14}/> {warns.tab}</span>
                           <span className="text-[9px] text-slate-500 uppercase">Tab Switch</span>
                        </div>
                        <div className="text-center">
                           <span className={`text-lg font-bold flex items-center gap-1 ${warns.cam > 0 ? 'text-orange-400' : 'text-slate-300'}`}><Video size={14}/> {warns.cam}</span>
                           <span className="text-[9px] text-slate-500 uppercase">Camera</span>
                        </div>
                        <div className="text-center">
                           <span className={`text-lg font-bold flex items-center gap-1 ${warns.mic > 0 ? 'text-orange-400' : 'text-slate-300'}`}><Mic size={14}/> {warns.mic}</span>
                           <span className="text-[9px] text-slate-500 uppercase">Audio</span>
                        </div>
                     </div>
                     
                     {isAdmin && hasMediaWarnings && (
                        <button disabled={isResetting} onClick={handleResetMediaWarnings} className="w-full mt-3 bg-red-900/40 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/50 px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-colors">
                           {isResetting ? <RefreshCcw className="animate-spin" size={12}/> : <RefreshCcw size={12}/>} Forgive Media Alerts
                        </button>
                     )}
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-center text-center px-6">
                     <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Total Score</p>
                     <p className="text-3xl font-extrabold text-white leading-none">{metaObj.totalScore}</p>
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
               {Object.keys(metaObj.skillScores).map((skillName) => {
                  const data = metaObj.skillScores[skillName];
                  const percentage = (data.correct / data.total) * 100;
                  const colorClass = percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';
                  const textClass = percentage >= 80 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400';

                  return (
                     <div key={skillName} className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80">
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-slate-200 font-bold">{skillName}</span>
                           <span className={`font-bold ${textClass}`}>{data.correct} / {data.total}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                           <div className={`h-full ${colorClass} transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      )}

    </div>
  );
}