"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  User, MapPin, Briefcase, Phone, Mail, GraduationCap, Globe, Sparkles, 
  Lock, ShieldAlert, FileText, CreditCard, ChevronDown, ChevronUp, Target, AlertTriangle, Star, CheckCircle, RefreshCcw, Mic, Video, Monitor, Building, TrendingUp, TrendingDown, Award, Users
} from "lucide-react";

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
      <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-slate-100 border-4 border-white flex items-center justify-center overflow-hidden shadow-lg shrink-0">
            {candidate.photoURL && !isCompany ? <img src={candidate.photoURL} className="w-full h-full object-cover"/> : <User size={64} className="text-slate-400"/>}
        </div>
        
        <div className="relative z-10 text-center md:text-left flex-1 mt-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
             <div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">{candidate.fullName || "Name Not Set"}</h2>
                <p className="text-[#0f947e] font-bold tracking-wider uppercase text-sm mb-6 bg-teal-50 inline-block px-4 py-1.5 rounded-xl border border-teal-200">
                   {smartTitle}
                </p>
             </div>

             {(isAdmin || isCompany) && (
                <div className="text-right bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm min-w-[180px]">
                   {isDisqualified ? (
                       <div className="text-2xl font-extrabold text-red-600 flex items-center gap-2 justify-end mb-1"><ShieldAlert size={24}/> Banned</div>
                   ) : (
                       <div className="text-4xl font-extrabold text-teal-600 mb-1">{metaObj.totalScore !== undefined ? `${metaObj.totalScore}` : "N/A"}</div>
                   )}
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">AI Verified Score</p>
                </div>
             )}
          </div>
          
          <div className={`flex flex-wrap justify-center md:justify-start gap-3 text-sm font-bold ${isCompany ? 'blur-[4px] select-none opacity-50' : ''}`}>
            <span className="flex items-center gap-2 text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm"><MapPin size={16} className="text-blue-500"/> {candidate.city || "City"}</span>
            <span className="flex items-center gap-2 text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm"><Phone size={16} className="text-green-500"/> {phoneToDisplay}</span>
            <span className="flex items-center gap-2 text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm"><Mail size={16} className="text-amber-500"/> {emailToDisplay}</span>
          </div>

          {isCompany && (
             <div className="mt-4 inline-flex bg-white px-5 py-2 rounded-xl border border-amber-300 text-amber-600 text-xs font-bold items-center gap-2 shadow-md">
                <Lock size={16}/> CONTACT INFO LOCKED BY ADMIN
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
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1 flex items-center gap-2">Verified Corporate Experience <CheckCircle className="text-teal-500" size={18}/></h3>
                  <p className="text-slate-600 mb-3 font-medium">Hired by <strong className="text-slate-900">{candidate.hired_company_name}</strong> through Resourcemania</p>
                  <div className="flex gap-1 mb-3">
                     {[1,2,3,4,5].map(star => <Star key={star} size={18} fill={star <= candidate.company_rating ? "#D97706" : "none"} className={star <= candidate.company_rating ? "text-amber-600" : "text-slate-300"}/>)}
                  </div>
                  {candidate.company_review && <p className="text-slate-700 italic text-lg leading-relaxed">"{candidate.company_review}"</p>}
               </div>
            </div>
         </div>
      )}

      {candidate.bio && (
         <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#0f947e]"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Sparkles className="text-teal-500" size={20}/> Professional Summary</h3>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg italic">"{candidate.bio}"</p>
         </div>
      )}

      {/* PAST WORK EXPERIENCE - ULTRA THIN COMPACT VIEW */}
      {workExpList.length > 0 && (
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[2rem] shadow-lg mb-8">
             <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3"><Building className="text-teal-600"/> Past Work Experience</h3>
             <div className="flex flex-col">
                {displayedWorkExp.map((work:any, i:number) => (
                   <div key={i} className="py-3 border-b border-slate-100 last:border-0 flex flex-col justify-center">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                         {/* Left Side: Company, Role, Designation */}
                         <div className="flex items-center flex-wrap gap-2">
                            <h4 className="font-bold text-base text-slate-900">{work.company}</h4>
                            <span className="hidden md:inline-block text-slate-300">•</span>
                            <span className="text-sm font-bold text-teal-600">{work.role}</span>
                            {work.designation && (
                               <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap">
                                  {work.designation}
                               </span>
                            )}
                         </div>
                         {/* Right Side: Duration */}
                         <div className="shrink-0">
                            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{work.duration}</span>
                         </div>
                      </div>
                      {/* Ultra Thin Summary (1 Line, expands on hover) */}
                      {work.summary && (
                         <p className="text-xs text-slate-500 mt-1.5 line-clamp-1 hover:line-clamp-none cursor-pointer transition-all w-full" title="Hover to read full summary">
                            <span className="font-semibold text-slate-400 mr-1">Summary:</span>{work.summary}
                         </p>
                      )}
                   </div>
                ))}
                
                {extraWorkCount > 0 && (
                   <button onClick={() => setShowAllWork(!showAllWork)} className="w-full mt-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors text-xs font-bold flex items-center justify-center gap-2">
                      {showAllWork ? <><ChevronUp size={14}/> Show Less</> : <><ChevronDown size={14}/> View {extraWorkCount} More</>}
                   </button>
                )}
             </div>
          </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
         <div className="md:col-span-1 space-y-8">
             <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3"><Briefcase className="text-indigo-500"/> Career & Salary</h3>
                <div className="space-y-4 text-sm font-bold text-slate-600">
                   <div className="flex justify-between border-b border-slate-100 pb-3"><span className="text-slate-500">Total Exp.</span><span className="text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 shadow-sm">{candidate.experience}</span></div>
                   <div className="flex justify-between border-b border-slate-100 pb-3"><span className="text-slate-500">Notice Period</span><span className="text-slate-900">{candidate.noticePeriod || "N/A"}</span></div>
                   <div className="flex justify-between border-b border-slate-100 pb-3"><span className="text-slate-500">Expected Salary</span><span className="text-teal-600 font-extrabold">{candidate.expectedSalary || "N/A"}</span></div>
                   {candidate.currentSalary && <div className="flex justify-between border-b border-slate-100 pb-3"><span className="text-slate-500">Current Salary</span><span className="text-slate-900">{candidate.currentSalary}</span></div>}
                   <div className="flex justify-between pb-1"><span className="text-slate-500">Open to Contract</span><span className={candidate.openToContractRoles ? "text-teal-600" : "text-slate-500"}>{candidate.openToContractRoles ? "Yes" : "No"}</span></div>
                </div>
             </div>

             <div className={`bg-white border border-slate-200 p-8 rounded-[2rem] shadow-lg relative ${isCompany ? 'overflow-hidden group' : ''}`}>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3"><User className="text-indigo-500"/> Personal Details</h3>
                <div className={`space-y-4 text-sm font-bold text-slate-600 ${isCompany ? 'blur-[4px] opacity-40 select-none' : ''}`}>
                   <div className="flex justify-between border-b border-slate-100 pb-3"><span className="text-slate-500">DOB</span><span className="text-slate-900">{dobToDisplay}</span></div>
                   <div className="flex justify-between border-b border-slate-100 pb-3"><span className="text-slate-500">Work Mode</span><span className="text-slate-900">{candidate.workMode || "On-site"}</span></div>
                   <div className="flex justify-between border-b border-slate-100 pb-3"><span className="text-slate-500">Relocate?</span><span className="text-slate-900">{candidate.willingToRelocate || "No"}</span></div>
                   <div className="flex justify-between pb-1"><span className="text-slate-500 flex items-center gap-1"><CreditCard size={14}/> PAN</span><span className="text-slate-900 tracking-widest uppercase">{panToDisplay}</span></div>
                </div>
                {isCompany && (
                   <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                      <Lock size={32} className="text-amber-500/80"/>
                   </div>
                )}
             </div>

             {candidate.languages && candidate.languages.length > 0 && (
                <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-lg">
                   <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3"><Globe className="text-indigo-500"/> Languages Known</h3>
                   <div className="flex flex-wrap gap-3">
                      {candidate.languages.map((lang: any, idx: number) => (
                         <div key={idx} className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 w-full justify-between shadow-sm">
                            <span className="font-bold text-slate-900 text-sm">{lang.language}</span>
                            <span className="text-xs font-bold bg-teal-50 text-teal-600 border border-teal-200 px-2 py-1 rounded-lg">{lang.proficiency}</span>
                         </div>
                      ))}
                   </div>
                </div>
             )}
          </div>
          
         <div className="md:col-span-2 space-y-8">
            {/* EDUCATION SECTION */}
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-lg">
               <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><GraduationCap className="text-indigo-500"/> Education & Certifications</h3>
               <div className="space-y-4">
                   {displayedEducations.map((edu:any, i:number) => {
                      const isSchoolLevel = /(10th|12th|class 10|class 12|high school|secondary|intermediate|puc|matric|board|ssc|hsc|cbse|icse|\b10\b|\b12\b|^10$|^12$|x|xii)/i.test((edu.qualification || '').toLowerCase());
                      return (
                      <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-300 transition-colors shadow-sm">
                         <div>
                            <p className="font-bold text-lg text-slate-900 flex items-center gap-2 flex-wrap">
                               {edu.qualification} 
                               {edu.stageCleared && <span className="text-[10px] bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded uppercase font-bold">{edu.stageCleared}</span>}
                               {isSchoolLevel && edu.mathsIncluded && edu.mathsIncluded !== "" && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${edu.mathsIncluded === 'Yes' ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
                                      Maths: {edu.mathsIncluded} {edu.mathsIncluded === 'Yes' && edu.mathsScore ? `(${edu.mathsScore}%)` : ''}
                                  </span>
                               )}
                            </p>
                            <p className="text-sm font-medium text-slate-500 mt-1">{edu.collegeName || "Institution not specified"}</p>
                         </div>
                         <div className="text-left sm:text-right">
                            <p className="text-slate-700 font-bold bg-white border border-slate-200 shadow-sm px-3 py-1 rounded-lg inline-block">{edu.passingYear || "N/A"}</p>
                         </div>
                      </div>
                   )})}
                   {extraEduCount > 0 && (
                      <button onClick={() => setShowAllEdu(!showAllEdu)} className="w-full mt-2 py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors text-sm font-bold flex items-center justify-center gap-2">
                         {showAllEdu ? <><ChevronUp size={16}/> Show Less</> : <><ChevronDown size={16}/> View {extraEduCount} More Qualifications</>}
                      </button>
                   )}
               </div>
            </div>

            {/* ACHIEVEMENTS SECTION */}
            {candidate.achievements && candidate.achievements.length > 0 && (
                <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-lg">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"><Award className="text-amber-500"/> Achievements & Certifications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {candidate.achievements.map((ach: any, i: number) => (
                            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-4 hover:border-slate-300 transition-colors items-start shadow-sm">
                                {ach.imageURL ? (
                                    <a href={ach.imageURL} target="_blank" rel="noreferrer" className="shrink-0">
                                        <img src={ach.imageURL} alt="Achievement" className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-xl border border-slate-200 shadow-sm hover:opacity-80 transition-opacity cursor-pointer"/>
                                    </a>
                                ) : (
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-200 shadow-sm">
                                        <Award size={24} className="text-amber-500"/>
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-slate-900 font-bold text-sm md:text-base leading-tight mb-1">{ach.title || "Untitled Achievement"}</h4>
                                    <p className="text-slate-600 font-medium text-xs leading-relaxed line-clamp-2" title={ach.description}>{ach.description || "No description provided."}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-lg">
               <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3"><Sparkles className="text-teal-500"/> Technical Skills & Expertise</h3>
               {candidateSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                     {candidateSkills.map((skill:string, i:number) => (
                        <span key={i} className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-sm font-bold border border-teal-200 hover:bg-teal-100 transition-all shadow-sm">{skill}</span>
                     ))}
                  </div>
               ) : <span className="text-slate-500 font-medium text-sm italic">No skills selected yet.</span>}
               
               {/* BEHAVIORAL SKILLS */}
               <div className="mt-8 pt-8 border-t border-slate-100">
                   <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3"><Users className="text-indigo-500"/> Behavioral & Soft Skills</h3>
                   {candidateBehavioralSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5">
                         {candidateBehavioralSkills.map((skill:string, i:number) => (
                            <span key={i} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-200 hover:bg-indigo-100 transition-all shadow-sm">{skill}</span>
                         ))}
                      </div>
                   ) : <span className="text-slate-500 font-medium text-sm italic">No behavioral skills selected.</span>}
               </div>

               {/* TECHNOLOGICAL SKILLS */}
               <div className="mt-8 pt-8 border-t border-slate-100">
                   <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3"><Monitor className="text-blue-500"/> Technological Tools & Software</h3>
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
                   ) : <span className="text-slate-500 font-medium text-sm italic">No tools selected.</span>}
               </div>

               {(candidateStrengths.length > 0 || candidateWeaknesses.length > 0) && (
                   <div className="mt-8 pt-8 border-t border-slate-100 grid md:grid-cols-2 gap-6">
                      {candidateStrengths.length > 0 && (
                         <div>
                            <h4 className="text-teal-600 font-bold mb-3 flex items-center gap-2"><TrendingUp size={18}/> Strengths</h4>
                            <div className="flex flex-wrap gap-2">
                               {candidateStrengths.map((str:string, i:number) => <span key={i} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-lg text-xs font-bold border border-teal-200 shadow-sm">{str}</span>)}
                            </div>
                         </div>
                      )}
                      {candidateWeaknesses.length > 0 && (
                         <div>
                            <h4 className="text-red-500 font-bold mb-3 flex items-center gap-2"><TrendingDown size={18}/> Areas of Growth</h4>
                            <div className="flex flex-wrap gap-2">
                               {candidateWeaknesses.map((wk:string, i:number) => <span key={i} className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold border border-red-200 shadow-sm">{wk}</span>)}
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
         <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] shadow-xl mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px]"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 border-b border-slate-100 pb-6">
               <div>
                  <h3 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3"><Target className="text-[#0f947e]" size={32}/> AI Executive Analysis</h3>
                  <p className="text-slate-500 font-medium mt-2">Comprehensive Performance & Integrity Report</p>
               </div>
               
               <div className="mt-4 md:mt-0 flex gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 flex items-center gap-1"><AlertTriangle size={12}/> Trust Alerts</p>
                     <div className="flex gap-4">
                        <div className="text-center">
                           <span className={`text-lg font-bold flex items-center gap-1 ${warns.tab > 0 ? 'text-red-500' : 'text-slate-700'}`}><Monitor size={14}/> {warns.tab}</span>
                           <span className="text-[9px] text-slate-500 uppercase font-bold">Tab Switch</span>
                        </div>
                        <div className="text-center">
                           <span className={`text-lg font-bold flex items-center gap-1 ${warns.cam > 0 ? 'text-amber-500' : 'text-slate-700'}`}><Video size={14}/> {warns.cam}</span>
                           <span className="text-[9px] text-slate-500 uppercase font-bold">Camera</span>
                        </div>
                        <div className="text-center">
                           <span className={`text-lg font-bold flex items-center gap-1 ${warns.mic > 0 ? 'text-amber-500' : 'text-slate-700'}`}><Mic size={14}/> {warns.mic}</span>
                           <span className="text-[9px] text-slate-500 uppercase font-bold">Audio</span>
                        </div>
                     </div>
                     {isAdmin && hasMediaWarnings && (
                        <button disabled={isResetting} onClick={handleResetMediaWarnings} className="w-full mt-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-colors shadow-sm">
                           {isResetting ? <RefreshCcw className="animate-spin" size={12}/> : <RefreshCcw size={12}/>} Forgive Alerts
                        </button>
                     )}
                  </div>
                  <div className="bg-[#0f947e] p-4 rounded-xl border border-teal-600 flex flex-col justify-center text-center px-8 shadow-lg text-white">
                     <p className="text-[10px] text-teal-100 uppercase font-black tracking-widest mb-1">Total Score</p>
                     <p className="text-4xl font-extrabold leading-none">{metaObj.totalScore}</p>
                  </div>
               </div>
            </div>

            {metaObj.ai_detailed_report && (
               <div className="bg-teal-50/50 p-6 rounded-2xl border-l-4 border-[#0f947e] mb-8 relative z-10 text-slate-700 text-sm md:text-base font-medium leading-relaxed space-y-4 shadow-sm">
                  <p className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Sparkles className="text-[#0f947e]" size={18}/> AI Review</p>
                  {metaObj.ai_detailed_report.split('\n').map((para:string, index:number) => (
                     <p key={index} className="text-justify">{para.replace(/\*\*/g, '')}</p>
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

                  // Colors mapped for Light Theme
                  const colorClass = isPsycho ? 'bg-indigo-500' : isTechSkill ? 'bg-blue-500' : (percentage >= 80 ? 'bg-teal-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500');
                  const textClass = isPsycho ? 'text-indigo-600' : isTechSkill ? 'text-blue-600' : (percentage >= 80 ? 'text-teal-600' : percentage >= 50 ? 'text-amber-600' : 'text-red-600');
                  const borderClass = isPsycho ? 'border-indigo-200 bg-indigo-50' : isTechSkill ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50';

                  return (
                     <div key={skillName} className={`p-5 rounded-2xl border shadow-sm ${borderClass}`}>
                        <div className="flex justify-between items-center mb-4">
                           <span className={`font-bold text-sm ${isPsycho ? 'text-indigo-800' : isTechSkill ? 'text-blue-800' : 'text-slate-800'}`}>
                               {isPsycho ? "🧠 Behavioral & Culture Fit" : isTechSkill ? `💻 ${skillName}` : skillName}
                           </span>
                           <span className={`font-bold ${textClass}`}>{data.correct} / {data.total}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
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