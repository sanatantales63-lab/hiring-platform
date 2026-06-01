"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  User, MapPin, Briefcase, Phone, Mail, GraduationCap, Globe, Sparkles, 
  Lock, ShieldAlert, FileText, CreditCard, ChevronDown, ChevronUp, Target, AlertTriangle, Star, CheckCircle, RefreshCcw, Mic, Video, Monitor, Building, TrendingUp, TrendingDown, Award, Users, MessageCircle
} from "lucide-react";
import dynamic from "next/dynamic";
const DownloadReportButton = dynamic(
  () => import("@/app/components/DownloadReportButton").then((mod: any) => mod.default || mod.DownloadReportButton), 
  { ssr: false }
);
export default function CandidateProfileView({ candidate, role }: { candidate: any, role: 'student' | 'company' | 'admin' }) {
  const [showAllEdu, setShowAllEdu] = useState(false);
  const [showAllWork, setShowAllWork] = useState(false); 
  const [isResetting, setIsResetting] = useState(false);

  if (!candidate) return null;

  const isCompany = role === 'company';
  const isAdmin = role === 'admin';
  const isDisqualified = candidate.examAccess === 'disqualified';
  
  const emailToDisplay = isCompany ? "hidden@candidate.com" : (candidate.email || "Email Not Added");
  const phoneToDisplay = isCompany ? "+91 98XXXXXX00" : (candidate.phone || "Phone Not Added");
  const whatsappToDisplay = isCompany ? "+91 98XXXXXX00" : (candidate.whatsappNumber || "Not Added");
  const panToDisplay = isCompany ? "XXXXX1234X" : (candidate.panCard || "Not Provided");
  const dobToDisplay = isCompany ? "XX/XX/XXXX" : (candidate.dob || "Not Provided");

 let smartTitle = candidate.educations?.[0]?.qualification || candidate.qualification || "Candidate";
  const topEdu = candidate.educations?.[0];
  if (topEdu && topEdu.qualification) {
     const q = topEdu.qualification.toLowerCase();
     if (/\bca\b/.test(q) || q.includes('ca-') || q.includes('chartered accountant')) smartTitle = 'Chartered Accountant (CA)';
     else if (/\bcma\b/.test(q) || q.includes('cma-') || q.includes('cost & management')) smartTitle = 'Cost & Management Accountant (CMA)';
     else if (/\bcs\b/.test(q) || q.includes('cs-') || q.includes('company secretary')) smartTitle = 'Company Secretary (CS)';
     else if (q.includes('acca')) smartTitle = 'ACCA Professional';
     else if (q.includes('mba')) smartTitle = 'MBA Professional';
     else if (q.includes('b.com') || q.includes('bcom') || q.includes('bachelor of commerce')) smartTitle = 'Commerce Graduate (B.Com)';
     else smartTitle = topEdu.qualification;
  }

  // 🔥 DYNAMIC PROFESSIONAL ID LOGIC 🔥
  let qualPrefix = "PR"; 
  if (candidate.highestQualification) {
      const hq = candidate.highestQualification.toLowerCase();
      if (hq.includes('ca ') || hq.includes('ca-') || hq === 'ca' || hq.includes('chartered accountant')) qualPrefix = "CA";
      else if (hq.includes('cma') || hq.includes('cost & management')) qualPrefix = "CM";
      else if (hq.includes('cs ') || hq.includes('cs-') || hq === 'cs' || hq.includes('company secretary')) qualPrefix = "CS";
      else if (hq.includes('acca')) qualPrefix = "AC";
      else if (hq.includes('mba') || hq.includes('pgdm')) qualPrefix = "MB";
      else if (hq.includes('b.tech') || hq.includes('btech') || hq.includes('b.e.')) qualPrefix = "BT";
      else if (hq.includes('m.com') || hq.includes('mcom')) qualPrefix = "MC";
      else if (hq.includes('b.com') || hq.includes('bcom') || hq.includes('bba')) qualPrefix = "BC";
      else if (hq.includes('diploma') || hq.includes('polytechnic')) qualPrefix = "DP";
      else if (hq.includes('high school') || hq.includes('12th') || hq.includes('puc')) qualPrefix = "HS";
      else qualPrefix = "GD"; // General Graduate
  }
  const displayId = candidate.id ? `RM-${qualPrefix}-${candidate.id.substring(0, 8).toUpperCase()}` : "N/A";

  const educationsList = Array.isArray(candidate.educations) ? candidate.educations : [];
  const workExpList = Array.isArray(candidate.workExperience) ? candidate.workExperience : [];
  
  const displayedEducations = showAllEdu ? educationsList : educationsList.slice(0, 3);
  const extraEduCount = educationsList.length > 3 ? educationsList.length - 3 : 0;

  const displayedWorkExp = showAllWork ? workExpList : workExpList.slice(0, 2);
  const extraWorkCount = workExpList.length > 2 ? workExpList.length - 2 : 0;
  
  const candidateSkills = Array.isArray(candidate.skills) ? candidate.skills.filter((s:any) => typeof s === 'string') : [];
  const candidateBehavioralSkills = Array.isArray(candidate.behavioralSkills) ? candidate.behavioralSkills.filter((s:any) => typeof s === 'string') : [];
  const candidateTechnologicalSkills = Array.isArray(candidate.technologicalSkills) ? candidate.technologicalSkills : [];
  const candidateStrengths = Array.isArray(candidate.strengths) ? candidate.strengths : [];
  const candidateWeaknesses = Array.isArray(candidate.weaknesses) ? candidate.weaknesses : [];
  const showReview = candidate.hired_status === 'hired' && candidate.company_rating && (candidate.company_rating >= 3 || isAdmin);
  const metaObj = candidate.meta || {};
  const warns = metaObj.warnings || { tab: metaObj.warningsCount || 0, mic: 0, cam: 0 };
  const hasMediaWarnings = warns.mic > 0 || warns.cam > 0;

  // 🔥 SALARY DISPLAY LOGIC: Company sees +25%, Admin sees both, Candidate sees original
  let displayExpectedSalary = candidate.expectedSalary || "N/A";
  let adminBumpedSalary = null;
  if (candidate.expectedSalary) {
      const numMatch = candidate.expectedSalary.replace(/[^0-9]/g, '');
      if (numMatch) {
          const baseNum = parseInt(numMatch, 10);
          const bumpedNum = Math.round(baseNum * 1.25);
          const bumpedStr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(bumpedNum);
          
          if (isCompany) {
              displayExpectedSalary = bumpedStr; 
          } else if (isAdmin) {
              adminBumpedSalary = bumpedStr; 
          }
      }
  }

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
    <div suppressHydrationWarning className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER CARD */}
      <div className="bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] p-8 md:p-12 rounded-[2.5rem] shadow-elevated flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-[var(--surface)] border-4 border-[var(--background)] flex items-center justify-center overflow-hidden shadow-lg shrink-0">
            {candidate.photoURL && !isCompany ? <img src={candidate.photoURL} className="w-full h-full object-cover"/> : <User size={64} className="text-[var(--muted-foreground)]"/>}
        </div>
        
        <div className="relative z-10 text-center md:text-left flex-1 mt-2">
          {/* 🔥 FIX: Changed 'md:justify-between' to simple flex with gap, taaki photo aur text paas-paas rahein */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full">
             <div className="flex-1">
               <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-2 tracking-tight">
  {isCompany ? displayId : (candidate.fullName || "Name Not Set")}
</h2>
                <p className="text-[var(--primary)] font-bold tracking-wider uppercase text-sm mb-6 bg-[var(--primary)]/10 inline-block px-4 py-1.5 rounded-xl border border-[var(--primary)]/20">
                   {smartTitle}
                </p>
             </div>

             {(isAdmin || isCompany) && (
                <div className="text-right bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm min-w-[180px] shrink-0 mt-4 md:mt-0">
                   {isDisqualified ? (
                       <div className="text-2xl font-extrabold text-[var(--destructive)] flex items-center gap-2 justify-end mb-1"><ShieldAlert size={24}/> Banned</div>
                   ) : (
                       <div className="font-display text-4xl font-extrabold text-[var(--primary)] mb-1">{metaObj.totalScore !== undefined ? `${metaObj.totalScore}` : "N/A"}</div>
                   )}
                   <p className="text-[var(--muted-foreground)] text-xs font-bold uppercase tracking-wide">AI Verified Score</p>
                </div>
             )}
          </div>
          
         {/* 🔥 FIX: Grouped beautifully into two aligned rows to look premium */}
          <div className={`flex flex-col items-center md:items-start gap-3 mt-4 ${isCompany ? 'blur-[4px] select-none opacity-50' : ''}`}>
             <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-bold">
                <span className="flex items-center gap-2 text-[var(--foreground)] bg-[var(--surface)] px-4 py-2 rounded-xl border border-[var(--border)] shadow-sm"><MapPin size={16} className="text-blue-500"/> {candidate.city || "City"}</span>
                <span className="flex items-center gap-2 text-[var(--foreground)] bg-[var(--surface)] px-4 py-2 rounded-xl border border-[var(--border)] shadow-sm"><Phone size={16} className="text-[var(--primary)]"/> {phoneToDisplay}</span>
             </div>
             <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-bold">
                {candidate.whatsappNumber && (
                   <span className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm"><MessageCircle size={16} className="text-emerald-500"/> {whatsappToDisplay}</span>
                )}
                <span className="flex items-center gap-2 text-[var(--foreground)] bg-[var(--surface)] px-4 py-2 rounded-xl border border-[var(--border)] shadow-sm"><Mail size={16} className="text-amber-500"/> {emailToDisplay}</span>
             </div>
          </div>

          {isCompany && (
             <div className="mt-4 inline-flex bg-[var(--card)] px-5 py-2 rounded-xl border border-amber-300 text-amber-600 text-xs font-bold items-center gap-2 shadow-md">
                <Lock size={16}/> CONTACT INFO LOCKED BY ADMIN
             </div>
          )}

          {/* ADMIN ONLY: RESUME & REPORT BUTTONS DIRECTLY IN PROFILE */}
          {isAdmin && (
             <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6 pt-5 border-t border-[var(--border)]">
                {candidate.resumeURL ? (
                    <a href={candidate.resumeURL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-[var(--background)] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm">
                        <FileText size={16} /> View Resume
                    </a>
                ) : (
                    <button disabled className="flex items-center gap-2 bg-[var(--surface)] text-[var(--muted-foreground)] px-5 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed border border-[var(--border)]">
                        <FileText size={16} /> No Resume Uploaded
                    </button>
                )}

                {(candidate.examAccess === 'completed' || metaObj.totalScore !== undefined) ? (
                    <DownloadReportButton candidate={candidate} buttonStyle="admin" />
                ) : (
                    <button disabled className="flex items-center gap-2 bg-[var(--surface)] text-[var(--muted-foreground)] px-5 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed border border-[var(--border)]">
                        Test Not Completed
                    </button>
                )}
             </div>
          )}
        </div>
      </div>

      {showReview && (
         <div className="bg-amber-50 border border-amber-200 p-8 rounded-[2rem] shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Star size={100}/></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
               <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0"><Briefcase className="text-amber-600" size={32}/></div>
               <div>
                  <h3 className="font-display text-xl font-extrabold text-amber-900 mb-1 flex items-center gap-2">Verified Corporate Experience <CheckCircle className="text-[var(--primary)]" size={18}/></h3>
                  <p className="text-amber-700/80 mb-3 font-medium">Hired by <strong className="text-amber-900">{candidate.hired_company_name}</strong> through Resourcemania</p>
                  <div className="flex gap-1 mb-3">
                     {[1,2,3,4,5].map(star => <Star key={star} size={18} fill={star <= candidate.company_rating ? "#D97706" : "none"} className={star <= candidate.company_rating ? "text-amber-600" : "text-amber-200"}/>)}
                  </div>
                  {candidate.company_review && <p className="text-amber-800 italic text-lg leading-relaxed">"{candidate.company_review}"</p>}
               </div>
            </div>
         </div>
      )}

      {/* 🔥 NEW: Highest Qualification Badge displayed prominently above Bio */}
      {candidate.highestQualification && (
         <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3 shadow-sm">
            <div className="bg-indigo-100 p-2 rounded-lg"><GraduationCap size={20} className="text-indigo-600"/></div>
            <div>
               <p className="text-[10px] uppercase tracking-widest font-black text-indigo-500 mb-0.5">Highest Qualification Level</p>
               <p className="font-bold text-indigo-900 text-sm">{candidate.highestQualification}</p>
            </div>
         </div>
      )}

      {candidate.bio && (
         <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[2rem] shadow-soft relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-primary"></div>
            <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2"><Sparkles className="text-[var(--primary)]" size={20}/> Professional Summary</h3>
            <p className="text-[var(--muted-foreground)] leading-relaxed text-base md:text-lg italic font-medium">"{candidate.bio}"</p>
         </div>
      )}

      {/* PAST WORK EXPERIENCE */}
      {workExpList.length > 0 && (
          <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-soft mb-8">
             <h3 className="font-display text-xl md:text-2xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-3"><Building className="text-[var(--primary)]"/> Past Work Experience</h3>
             <div className="flex flex-col">
                {displayedWorkExp.map((work:any, i:number) => (
                   <div key={i} className="py-3 border-b border-[var(--border)] last:border-0 flex flex-col justify-center">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                         <div className="flex items-center flex-wrap gap-2">
                            <h4 className="font-bold text-base text-[var(--foreground)]">{work.company}</h4>
                            <span className="hidden md:inline-block text-[var(--border)]">•</span>
                            <span className="text-sm font-bold text-[var(--primary)]">{work.role}</span>
                            {work.designation && (
                               <span className="text-[10px] bg-[var(--surface)] border border-[var(--border)] text-[var(--muted-foreground)] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap">
                                  {work.designation}
                               </span>
                            )}
                         </div>
                         <div className="shrink-0">
                            <span className="text-xs font-bold text-[var(--muted-foreground)] whitespace-nowrap">{work.duration}</span>
                         </div>
                      </div>
                      {work.summary && (
                         <p className="text-xs text-[var(--muted-foreground)] mt-1.5 line-clamp-1 hover:line-clamp-none cursor-pointer transition-all w-full" title="Hover to read full summary">
                            <span className="font-semibold text-[var(--ink-soft)] mr-1">Summary:</span>{work.summary}
                         </p>
                      )}
                   </div>
                ))}
                
                {extraWorkCount > 0 && (
                   <button onClick={() => setShowAllWork(!showAllWork)} className="w-full mt-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors text-xs font-bold flex items-center justify-center gap-2">
                      {showAllWork ? <><ChevronUp size={14}/> Show Less</> : <><ChevronDown size={14}/> View {extraWorkCount} More</>}
                   </button>
                )}
             </div>
          </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
         <div className="md:col-span-1 space-y-8">
             <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[2rem] shadow-soft">
                <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-3"><Briefcase className="text-[var(--primary)]"/> Career & Salary</h3>
                <div className="space-y-4 text-sm font-bold text-[var(--ink-soft)]">
                   <div className="flex justify-between border-b border-[var(--border)] pb-3"><span className="text-[var(--muted-foreground)]">Total Exp.</span><span className="text-[var(--foreground)] bg-[var(--surface)] px-3 py-1 rounded-lg border border-[var(--border)] shadow-sm">{candidate.experience}</span></div>
                   <div className="flex justify-between border-b border-[var(--border)] pb-3"><span className="text-[var(--muted-foreground)]">Notice Period</span><span className="text-[var(--foreground)]">{candidate.noticePeriod || "N/A"}</span></div>
                   <div className="flex justify-between border-b border-[var(--border)] pb-3 items-center">
                      <span className="text-[var(--muted-foreground)]">Expected Salary</span>
                      <div className="text-right">
                         <span className="text-[var(--primary)] font-extrabold text-lg">{displayExpectedSalary}</span>
                         {adminBumpedSalary && (
                            <div className="text-[10px] text-amber-700 mt-1 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                               Company Sees: {adminBumpedSalary}
                            </div>
                         )}
                      </div>
                   </div>
                   {candidate.currentSalary && !isCompany && <div className="flex justify-between border-b border-[var(--border)] pb-3"><span className="text-[var(--muted-foreground)]">Current Salary</span><span className="text-[var(--foreground)]">{candidate.currentSalary}</span></div>}
                   <div className="flex justify-between pb-1"><span className="text-[var(--muted-foreground)]">Open to Contract</span><span className={candidate.openToContractRoles ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}>{candidate.openToContractRoles ? "Yes" : "No"}</span></div>
                </div>
             </div>

             <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[2rem] shadow-soft">
                <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-3"><User className="text-[var(--primary)]"/> Personal Details</h3>
                
                <div className="space-y-4 text-sm font-bold text-[var(--ink-soft)]">
                   {/* 🔥 ID ALWAYS VISIBLE 🔥 */}
                   {candidate.id && (
                      <div className="flex justify-between border-b border-[var(--border)] pb-4 mb-4">
                         <span className="text-[var(--muted-foreground)]">Profile ID</span>
                         <span className="text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-0.5 rounded border border-[var(--primary)]/20 tracking-widest font-mono font-bold uppercase text-xs">{displayId}</span>
                      </div>
                   )}
                   
                   {/* SENSITIVE INFO - ONLY THIS BLURS FOR COMPANY */}
                  <div className="relative">
                     <div className={`space-y-4 ${isCompany ? 'blur-[4px] opacity-40 select-none' : ''}`}>
                        <div className="flex justify-between border-b border-[var(--border)] pb-3"><span className="text-[var(--muted-foreground)]">DOB</span><span className="text-[var(--foreground)]">{dobToDisplay}</span></div>
                        <div className="flex justify-between border-b border-[var(--border)] pb-3"><span className="text-[var(--muted-foreground)]">Work Mode</span><span className="text-[var(--foreground)]">{candidate.workMode || "On-site"}</span></div>
                        <div className="flex justify-between border-b border-[var(--border)] pb-3"><span className="text-[var(--muted-foreground)]">Relocate?</span><span className="text-[var(--foreground)]">{candidate.willingToRelocate || "No"}</span></div>
                        <div className="flex justify-between pb-1"><span className="text-[var(--muted-foreground)] flex items-center gap-1"><CreditCard size={14}/> PAN</span><span className="text-[var(--foreground)] tracking-widest uppercase">{panToDisplay}</span></div>
                     </div>
                     
                     {isCompany && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                           <Lock size={32} className="text-amber-500 drop-shadow-md"/>
                        </div>
                     )}
                  </div>

                  {/* 🔥 UNLOCKED FOR COMPANY: Laptop Owner status extracted outside overlay */}
                  <div className="flex justify-between pt-3 border-t border-[var(--border)]">
                     <span className="text-[var(--muted-foreground)]">Laptop Owner</span>
                     <span className="text-[var(--foreground)] font-bold text-teal-600">{candidate.hasLaptop || "No"}</span>
                  </div>
                </div>
             </div>

             {candidate.languages && candidate.languages.length > 0 && (
                <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[2rem] shadow-soft">
                   <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-3"><Globe className="text-[var(--primary)]"/> Languages Known</h3>
                   <div className="flex flex-wrap gap-3">
                      {candidate.languages.map((lang: any, idx: number) => (
                         <div key={idx} className="bg-[var(--surface)] px-4 py-2.5 rounded-xl border border-[var(--border)] flex items-center gap-2 w-full justify-between shadow-sm">
                            <span className="font-bold text-[var(--foreground)] text-sm">{lang.language}</span>
                            <span className="text-xs font-bold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 px-2 py-1 rounded-lg">{lang.proficiency}</span>
                         </div>
                      ))}
                   </div>
                </div>
             )}
          </div>
          
         <div className="md:col-span-2 space-y-8">
            {/* EDUCATION SECTION */}
            <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[2rem] shadow-soft">
               <h3 className="font-display text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-3"><GraduationCap className="text-[var(--primary)]"/> Education & Certifications</h3>
               <div className="space-y-4">
                   {displayedEducations.map((edu:any, i:number) => {
                      const isSchoolLevel = /(10th|12th|class 10|class 12|high school|secondary|intermediate|puc|matric|board|ssc|hsc|cbse|icse|\b10\b|\b12\b|^10$|^12$|x|xii)/i.test((edu.qualification || '').toLowerCase());
                      return (
                      <div key={i} className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-[var(--primary)]/30 transition-colors shadow-sm">
                         <div>
                            <p className="font-bold text-lg text-[var(--foreground)] flex items-center gap-2 flex-wrap">
                               {edu.qualification} 
                               {edu.stageCleared && <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded uppercase font-bold">{edu.stageCleared}</span>}
                               {isSchoolLevel && edu.mathsIncluded && edu.mathsIncluded !== "" && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${edu.mathsIncluded === 'Yes' ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20' : 'bg-[var(--destructive)]/10 text-[var(--destructive)] border-[var(--destructive)]/20'}`}>
                                      Maths: {edu.mathsIncluded} {edu.mathsIncluded === 'Yes' && edu.mathsScore ? `(${edu.mathsScore}%)` : ''}
                                  </span>
                               )}
                            </p>
                            <p className="text-sm font-medium text-[var(--muted-foreground)] mt-1">{edu.collegeName || "Institution not specified"}</p>
                         </div>
                         <div className="text-left sm:text-right">
                            <p className="text-[var(--foreground)] font-bold bg-[var(--card)] border border-[var(--border)] shadow-sm px-3 py-1 rounded-lg inline-block">{edu.passingYear || "N/A"}</p>
                         </div>
                      </div>
                   )})}
                   {extraEduCount > 0 && (
                      <button onClick={() => setShowAllEdu(!showAllEdu)} className="w-full mt-2 py-3 border border-dashed border-[var(--border)] rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors text-sm font-bold flex items-center justify-center gap-2">
                         {showAllEdu ? <><ChevronUp size={16}/> Show Less</> : <><ChevronDown size={16}/> View {extraEduCount} More Qualifications</>}
                      </button>
                   )}
               </div>
            </div>

            {/* ACHIEVEMENTS SECTION */}
            {candidate.achievements && candidate.achievements.length > 0 && (
                <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[2rem] shadow-soft">
                    <h3 className="font-display text-2xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-3"><Award className="text-amber-500"/> Achievements & Certifications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {candidate.achievements.map((ach: any, i: number) => (
                            <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex gap-4 hover:border-[var(--primary)]/30 transition-colors items-start shadow-sm">
                                {ach.imageURL ? (
                                    <a href={ach.imageURL} target="_blank" rel="noreferrer" className="shrink-0">
                                        <img src={ach.imageURL} alt="Achievement" className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-xl border border-[var(--border)] shadow-sm hover:opacity-80 transition-opacity cursor-pointer"/>
                                    </a>
                                ) : (
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-50/50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100 shadow-sm">
                                        <Award size={24} className="text-amber-500"/>
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-[var(--foreground)] font-bold text-sm md:text-base leading-tight mb-1">{ach.title || "Untitled Achievement"}</h4>
                                    <p className="text-[var(--muted-foreground)] font-medium text-xs leading-relaxed line-clamp-2" title={ach.description}>{ach.description || "No description provided."}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[2rem] shadow-soft">
               <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-3"><Sparkles className="text-[var(--primary)]"/> Technical Skills & Expertise</h3>
               {candidateSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                     {candidateSkills.map((skill:string, i:number) => (
                        <span key={i} className="bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2 rounded-xl text-sm font-bold border border-[var(--primary)]/20 hover:bg-[var(--primary)]/20 transition-all shadow-sm">{skill}</span>
                     ))}
                  </div>
               ) : <span className="text-[var(--muted-foreground)] font-medium text-sm italic">No skills selected yet.</span>}
               
               {/* BEHAVIORAL SKILLS */}
               <div className="mt-8 pt-8 border-t border-[var(--border)]">
                   <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-3"><Users className="text-indigo-500"/> Behavioral & Soft Skills</h3>
                   {candidateBehavioralSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5">
                         {candidateBehavioralSkills.map((skill:string, i:number) => (
                            <span key={i} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-200 hover:bg-indigo-100 transition-all shadow-sm">{skill}</span>
                         ))}
                      </div>
                   ) : <span className="text-[var(--muted-foreground)] font-medium text-sm italic">No behavioral skills selected.</span>}
               </div>

               {/* TECHNOLOGICAL SKILLS */}
               <div className="mt-8 pt-8 border-t border-[var(--border)]">
                   <h3 className="font-display text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-3"><Monitor className="text-blue-500"/> Technological Tools & Software</h3>
                   {candidateTechnologicalSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5">
                         {candidateTechnologicalSkills.map((skill:any, i:number) => {
                            const skillName = typeof skill === 'string' ? skill : skill.name;
                            const skillLevel = typeof skill === 'object' && skill.level ? skill.level : 'Beginner';
                            return (
                               <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-200 hover:bg-blue-100 transition-all shadow-sm">
                                   {skillName} <span className="text-[10px] text-blue-500 ml-1 uppercase tracking-wider">({skillLevel})</span>
                               </span>
                            );
                         })}
                      </div>
                   ) : <span className="text-[var(--muted-foreground)] font-medium text-sm italic">No tools selected.</span>}
               </div>

               {(candidateStrengths.length > 0 || candidateWeaknesses.length > 0) && (
                   <div className="mt-8 pt-8 border-t border-[var(--border)] grid md:grid-cols-2 gap-6">
                      {candidateStrengths.length > 0 && (
                         <div>
                            <h4 className="text-[var(--primary)] font-bold mb-3 flex items-center gap-2"><TrendingUp size={18}/> Strengths</h4>
                            <div className="flex flex-wrap gap-2">
                               {candidateStrengths.map((str:string, i:number) => <span key={i} className="bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-lg text-xs font-bold border border-[var(--primary)]/20 shadow-sm">{str}</span>)}
                            </div>
                         </div>
                      )}
                      {candidateWeaknesses.length > 0 && (
                         <div>
                            <h4 className="text-[var(--destructive)] font-bold mb-3 flex items-center gap-2"><TrendingDown size={18}/> Areas of Growth</h4>
                            <div className="flex flex-wrap gap-2">
                               {candidateWeaknesses.map((wk:string, i:number) => <span key={i} className="bg-[var(--destructive)]/10 text-[var(--destructive)] px-3 py-1 rounded-lg text-xs font-bold border border-[var(--destructive)]/20 shadow-sm">{wk}</span>)}
                            </div>
                         </div>
                      )}
                   </div>
               )}
            </div>
         </div>
      </div>

      {/* THE AI ASSESSMENT REPORT */}
      {metaObj.skillScores && Object.keys(metaObj.skillScores).length > 0 && (
         <div className="bg-[var(--card)] border border-[var(--border)] p-8 md:p-10 rounded-[2.5rem] shadow-elevated mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px]"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 border-b border-[var(--border)] pb-6">
               <div>
                  <h3 className="font-display text-3xl font-extrabold text-[var(--foreground)] flex items-center gap-3"><Target className="text-[var(--primary)]" size={32}/> AI Executive Analysis</h3>
                  <p className="text-[var(--muted-foreground)] font-medium mt-2">Comprehensive Performance & Integrity Report</p>
               </div>
               
               <div className="mt-4 md:mt-0 flex gap-4">
                  <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
                     <p className="text-[10px] text-[var(--muted-foreground)] uppercase font-black tracking-widest mb-2 flex items-center gap-1"><AlertTriangle size={12}/> Trust Alerts</p>
                     <div className="flex gap-4">
                        <div className="text-center">
                           <span className={`text-lg font-bold flex items-center gap-1 ${warns.tab > 0 ? 'text-[var(--destructive)]' : 'text-[var(--foreground)]'}`}><Monitor size={14}/> {warns.tab}</span>
                           <span className="text-[9px] text-[var(--muted-foreground)] uppercase font-bold">Tab Switch</span>
                        </div>
                        <div className="text-center">
                           <span className={`text-lg font-bold flex items-center gap-1 ${warns.cam > 0 ? 'text-amber-500' : 'text-[var(--foreground)]'}`}><Video size={14}/> {warns.cam}</span>
                           <span className="text-[9px] text-[var(--muted-foreground)] uppercase font-bold">Camera</span>
                        </div>
                        <div className="text-center">
                           <span className={`text-lg font-bold flex items-center gap-1 ${warns.mic > 0 ? 'text-amber-500' : 'text-[var(--foreground)]'}`}><Mic size={14}/> {warns.mic}</span>
                           <span className="text-[9px] text-[var(--muted-foreground)] uppercase font-bold">Audio</span>
                        </div>
                     </div>
                     {isAdmin && hasMediaWarnings && (
                        <button disabled={isResetting} onClick={handleResetMediaWarnings} className="w-full mt-3 bg-[var(--destructive)]/10 hover:bg-[var(--destructive)]/20 text-[var(--destructive)] border border-[var(--destructive)]/20 px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-colors shadow-sm">
                           {isResetting ? <RefreshCcw className="animate-spin" size={12}/> : <RefreshCcw size={12}/>} Forgive Alerts
                        </button>
                     )}
                  </div>
                  <div className="bg-gradient-primary p-4 rounded-xl flex flex-col justify-center text-center px-8 shadow-glow text-[var(--primary-foreground)]">
                     <p className="text-[10px] opacity-90 uppercase font-black tracking-widest mb-1">Total Score</p>
                     <p className="font-display text-4xl font-extrabold leading-none">{metaObj.totalScore}</p>
                  </div>
               </div>
            </div>

            {metaObj.ai_detailed_report && (
               <div className="bg-[var(--primary)]/5 p-6 rounded-2xl border-l-4 border-[var(--primary)] mb-8 relative z-10 text-[var(--ink-soft)] text-sm md:text-base font-medium leading-relaxed space-y-4 shadow-sm">
                  <p className="font-bold text-[var(--foreground)] mb-2 flex items-center gap-2"><Sparkles className="text-[var(--primary)]" size={18}/> AI Review</p>
                 {metaObj.ai_detailed_report.split('\n').map((para:string, index:number) => (
         <p key={index} className="text-justify">
           {(isCompany && candidate.fullName
             ? para.replace(new RegExp(candidate.fullName, 'gi'), displayId)
             : para).replace(/\*\*/g, '')}
         </p>
      ))}
               </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
               {Object.keys(metaObj.skillScores).map((skillName) => {
                  const data = metaObj.skillScores[skillName];
                  const percentage = (data.correct / data.total) * 100;
                  
                  const isPsycho = skillName.includes('Psychometric');
                  const techSkillNames = candidateTechnologicalSkills.map((s:any) => typeof s === 'string' ? s : s.name);
                  const isTechSkill = techSkillNames.includes(skillName);

                  const colorClass = isPsycho ? 'bg-indigo-500' : isTechSkill ? 'bg-blue-500' : (percentage >= 80 ? 'bg-[var(--primary)]' : percentage >= 50 ? 'bg-amber-500' : 'bg-[var(--destructive)]');
                  const textClass = isPsycho ? 'text-indigo-600' : isTechSkill ? 'text-blue-600' : (percentage >= 80 ? 'text-[var(--primary)]' : percentage >= 50 ? 'text-amber-600' : 'text-[var(--destructive)]');
                  const borderClass = isPsycho ? 'border-indigo-200 bg-indigo-50' : isTechSkill ? 'border-blue-200 bg-blue-50' : 'border-[var(--border)] bg-[var(--surface)]';

                 return (
                     <div key={skillName} className={`p-5 rounded-2xl border shadow-sm ${borderClass}`}>
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex flex-col gap-1.5 pr-3">
                               <span className={`font-bold text-sm leading-tight ${isPsycho ? 'text-indigo-800' : isTechSkill ? 'text-blue-800' : 'text-[var(--foreground)]'}`}>
                                   {isPsycho ? "🧠 Behavioral & Culture Fit" : isTechSkill ? `💻 ${skillName}` : skillName}
                               </span>
                               {/* 🔥 SMART UI TRICK: Explain why it's > 6 without touching Test Engine 🔥 */}
                               {data.total > 6 && (
                                   <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md w-max shadow-sm">
                                      ✨ Includes Bonus Round
                                   </span>
                               )}
                           </div>
                           <span className={`font-bold text-lg shrink-0 ${textClass}`}>{data.correct} / {data.total}</span>
                        </div>
                        <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden shadow-inner">
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