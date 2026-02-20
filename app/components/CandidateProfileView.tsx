"use client";
import { useState } from "react";
import { 
  User, MapPin, Briefcase, Phone, Mail, GraduationCap, Globe, Sparkles, 
  Lock, ShieldAlert, FileText, CreditCard, ChevronDown, ChevronUp, Target, PlusCircle, AlertTriangle 
} from "lucide-react";

export default function CandidateProfileView({ candidate, role }: { candidate: any, role: 'student' | 'company' | 'admin' }) {
  const [showAllEdu, setShowAllEdu] = useState(false);

  if (!candidate) return null;

  const isCompany = role === 'company';
  const isAdmin = role === 'admin';
  const isDisqualified = candidate.examAccess === 'disqualified';
  
  const emailToDisplay = isCompany ? "hidden@candidate.com" : (candidate.email || "Email Not Added");
  const phoneToDisplay = isCompany ? "+91 98XXXXXX00" : (candidate.phone || "Phone Not Added");
  const panToDisplay = isCompany ? "XXXXX1234X" : (candidate.panCard || "Not Provided");
  const dobToDisplay = isCompany ? "XX/XX/XXXX" : (candidate.dob || "Not Provided");

  let smartTitle = candidate.educations?.[0]?.qualification || candidate.qualification || "Candidate";
  const topEdu = candidate.educations?.[0];
  if (topEdu) {
     if (topEdu.qualification === 'CA Final' && topEdu.stageCleared === 'Both Groups') smartTitle = 'Chartered Accountant (CA)';
     else if (topEdu.qualification === 'CMA Final' && topEdu.stageCleared === 'Both Groups') smartTitle = 'Cost & Management Accountant (CMA)';
     else if (topEdu.qualification === 'CS Professional' && topEdu.stageCleared === 'Both Groups') smartTitle = 'Company Secretary (CS)';
  }

  // 🔥 DATA FILTERS: Kachra (Corrupted Data) ko hataane ke liye 🔥
  const educationsList = Array.isArray(candidate.educations) ? candidate.educations : [];
  const displayedEducations = showAllEdu ? educationsList : educationsList.slice(0, 3);
  const extraEduCount = educationsList.length > 3 ? educationsList.length - 3 : 0;

  // Sirf asli language objects ko allow karo
  const safeLanguages = Array.isArray(candidate.languages) 
    ? candidate.languages.filter((l:any) => typeof l === 'object' && l !== null && l.language) 
    : [];

  const PREDEFINED_SKILLS = [
    "Journal Entry", "Book Closure", "Financial Statements", "Ind-AS", "Accounting Standards", "Tally ERP", "SAP",
    "TDS Return", "GST Return", "Income Tax", "Corporate Tax",
    "Excel Beginner", "Excel Intermediate", "Excel Advanced", "VLOOKUP", "Macros"
  ];
  
  // 🔥 FIX ERROR 31: Skills mein sirf 'string' (text) ko allow karo, objects ko hata do 🔥
  const allSkills = Array.isArray(candidate.skills) ? candidate.skills.filter((skill: any) => typeof skill === 'string') : [];
  const verifiedSkills = allSkills.filter((skill: string) => PREDEFINED_SKILLS.includes(skill));
  const additionalSkills = allSkills.filter((skill: string) => !PREDEFINED_SKILLS.includes(skill));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
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
                       <div className="text-4xl font-extrabold text-green-400 mb-1">{candidate.meta?.totalScore !== undefined ? `${candidate.meta.totalScore}` : "N/A"}</div>
                   )}
                   <p className="text-slate-400 text-xs">AI Verified Score</p>
                </div>
             )}
          </div>
          
          <div className={`flex flex-wrap justify-center md:justify-start gap-3 text-sm font-medium ${isCompany ? 'blur-[4px] select-none opacity-50' : ''}`}>
            <span className="flex items-center gap-2 text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 shadow-inner"><MapPin size={16} className="text-blue-500"/> {candidate.city || "City"}, {candidate.state || "State"}</span>
            <span className="flex items-center gap-2 text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 shadow-inner"><Phone size={16} className="text-green-500"/> {phoneToDisplay}</span>
            <span className="flex items-center gap-2 text-slate-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 shadow-inner"><Mail size={16} className="text-yellow-500"/> {emailToDisplay}</span>
          </div>

          {isCompany && (
             <div className="mt-4 inline-flex bg-slate-900/90 backdrop-blur-xl px-5 py-2 rounded-xl border border-yellow-500/50 text-yellow-500 text-xs font-bold items-center gap-2 shadow-lg">
                <Lock size={16}/> CONTACT INFO LOCKED BY ADMIN
             </div>
          )}

          {!isCompany && candidate.resumeURL && (
             <div className="mt-6">
                <a href={candidate.resumeURL} target="_blank" className="inline-flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-blue-300 hover:text-white px-5 py-2.5 rounded-xl font-bold transition-all">
                   <FileText size={18}/> View Full Original Resume
                </a>
             </div>
          )}
        </div>
      </div>

      {candidate.bio && (
         <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Sparkles className="text-blue-400" size={20}/> Professional Summary</h3>
            <p className="text-slate-300 leading-relaxed text-base md:text-lg italic">
              "{candidate.bio}"
            </p>
         </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
         <div className="md:col-span-1 space-y-8">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Briefcase className="text-purple-400"/> Career Status</h3>
               <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between border-b border-slate-800/80 pb-3"><span className="text-slate-400">Total Exp.</span><span className="text-white font-bold bg-slate-800 px-3 py-1 rounded-lg">{candidate.experience}</span></div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-3"><span className="text-slate-400">Current Status</span><span className="text-white">{candidate.currentStatus}</span></div>
                  
                  {candidate.experience !== "Fresher" && candidate.currentSalary && (
                     <div className="flex justify-between pb-1"><span className="text-slate-400">Current Salary</span><span className="text-white font-bold">{candidate.currentSalary}</span></div>
                  )}
               </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Target className="text-blue-400"/> Next Opportunity</h3>
               <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between border-b border-slate-800/80 pb-3"><span className="text-slate-400">Notice Period</span><span className="text-blue-400 font-bold">{candidate.noticePeriod}</span></div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-3"><span className="text-slate-400">Exp. Salary</span><span className="text-green-400 font-bold">{candidate.salaryMin || candidate.expectedSalary || "Negotiable"}</span></div>
                  <div className="flex justify-between pb-1"><span className="text-slate-400">Work Mode</span><span className="text-white">{candidate.workMode}</span></div>
               </div>
               
               {candidate.preferredLocations?.length > 0 && (
                   <div className="mt-6 pt-6 border-t border-slate-800">
                      <span className="text-slate-400 text-xs uppercase font-bold block mb-3">Preferred Locations</span>
                      <div className="flex flex-wrap gap-2">
                         {candidate.preferredLocations.map((loc:string, i:number) => <span key={i} className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-lg text-sm font-bold border border-blue-500/20">{loc}</span>)}
                      </div>
                   </div>
               )}
            </div>

            <div className={`bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg relative ${isCompany ? 'overflow-hidden group' : ''}`}>
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><User className="text-purple-400"/> Personal Details</h3>
               <div className={`space-y-4 text-sm font-medium ${isCompany ? 'blur-[4px] opacity-40 select-none' : ''}`}>
                  <div className="flex justify-between border-b border-slate-800/80 pb-3"><span className="text-slate-400">DOB</span><span className="text-white">{dobToDisplay}</span></div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-3"><span className="text-slate-400">Gender</span><span className="text-white">{candidate.gender || "Not Provided"}</span></div>
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
                            
                            {edu.attempts && (
                               <p className="text-xs text-red-400 font-bold mt-2 bg-red-500/10 inline-block px-2 py-1 rounded border border-red-500/20">Attempts: {edu.attempts}</p>
                            )}
                         </div>
                         <div className="text-left sm:text-right">
                            <p className="text-white font-bold bg-slate-800 px-3 py-1 rounded-lg inline-block">{edu.passingYear || "N/A"}</p>
                            {edu.percentage && <p className="text-sm text-blue-400 font-bold mt-2">Score: {edu.percentage}</p>}
                         </div>
                      </div>
                   ))}
               </div>
               
               {extraEduCount > 0 && (
                  <button onClick={() => setShowAllEdu(!showAllEdu)} className="mt-4 w-full py-3 border border-slate-700 hover:bg-slate-800 rounded-xl text-sm font-bold text-slate-300 flex items-center justify-center gap-2 transition-all">
                     {showAllEdu ? <><ChevronUp size={16}/> Show Less</> : <><ChevronDown size={16}/> Show {extraEduCount} More Qualifications</>}
                  </button>
               )}
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg">
                   <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Globe className="text-indigo-400"/> Languages</h3>
                   <div className="flex flex-wrap gap-2">
                      {/* 🔥 Safe Languages Rendering 🔥 */}
                      {safeLanguages.map((lang:any, i:number) => <span key={i} className="bg-slate-950 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold border border-slate-800">{lang.language} <span className="text-[10px] text-slate-500 uppercase ml-2 px-2 py-0.5 bg-slate-900 rounded">{lang.proficiency}</span></span>)}
                      {safeLanguages.length === 0 && <span className="text-slate-500 text-sm">No languages added.</span>}
                   </div>
                </div>

                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] shadow-lg">
                   
                   <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Sparkles className="text-green-400"/> AI Verified Skills</h3>
                   <div className="flex flex-wrap gap-2 mb-8">
                      {verifiedSkills.length > 0 ? verifiedSkills.map((skill:string, i:number) => (
                         <span key={i} className="bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-500/20">{skill}</span>
                      )) : <span className="text-slate-500 text-sm italic">No testable skills selected.</span>}
                   </div>

                   {additionalSkills.length > 0 && (
                      <div className="pt-6 border-t border-slate-800/80">
                         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><PlusCircle size={14}/> Additional / Custom Skills</h4>
                         <div className="flex flex-wrap gap-2">
                            {additionalSkills.map((skill:string, i:number) => (
                               <span key={i} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-700">{skill}</span>
                            ))}
                         </div>
                      </div>
                   )}

                </div>
            </div>
         </div>
      </div>

      {candidate.meta?.skillScores && Object.keys(candidate.meta.skillScores).length > 0 && (
         <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 md:p-10 rounded-[2.5rem] shadow-2xl mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 border-b border-slate-800/80 pb-6">
               <div>
                  <h3 className="text-3xl font-extrabold text-white flex items-center gap-3"><Target className="text-green-400" size={32}/> Detailed Assessment Report</h3>
                  <p className="text-slate-400 mt-2">Verified Skill-by-Skill AI Analytics</p>
               </div>
               <div className="mt-4 md:mt-0 text-right bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-6">
                  <div>
                     <p className="text-xs text-slate-500 uppercase font-bold mb-1">Warnings Triggered</p>
                     <p className={`text-xl font-bold flex items-center gap-2 ${(candidate.meta.warningsCount || 0) > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {candidate.meta.warningsCount || 0} / 3
                        {(candidate.meta.warningsCount || 0) > 0 && <AlertTriangle size={18}/>}
                     </p>
                  </div>
                  <div className="border-l border-slate-800 pl-6">
                     <p className="text-xs text-slate-500 uppercase font-bold mb-1">Final Total Score</p>
                     <p className="text-2xl font-extrabold text-white">{candidate.meta.totalScore}</p>
                  </div>
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
               {Object.keys(candidate.meta.skillScores).map((skillName) => {
                  const data = candidate.meta.skillScores[skillName];
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