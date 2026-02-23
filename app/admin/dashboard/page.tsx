"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  User, Users, Building2, CreditCard, LogOut, Upload, Bell, 
  UserPlus, X, ChevronDown, ChevronUp, MapPin, Briefcase, GraduationCap, CheckCircle, Search, AlertTriangle, ShieldAlert, ShieldCheck, ExternalLink, Sparkles, Loader2, AlertCircle, Star
} from "lucide-react";
import CandidateProfileView from "@/app/components/CandidateProfileView";

export default function AdminDashboard() {
  const router = useRouter();
  const ADMIN_EMAIL = "karushhofficial@gmail.com"; 

  const [activeTab, setActiveTab] = useState("students"); 
  const [students, setStudents] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  
  // Requests & Disputes
  const [examRequests, setExamRequests] = useState<any[]>([]);
  const [disputedProfiles, setDisputedProfiles] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  // COMPANY MODAL STATES
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [assignedStudentIds, setAssignedStudentIds] = useState<string[]>([]);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState("");
  const [filterCityModal, setFilterCityModal] = useState("");
  const [filterQualModal, setFilterQualModal] = useState("");

  // AI SEARCH & FILTER STATES 
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const [advCity, setAdvCity] = useState("");
  const [advQual, setAdvQual] = useState("");
  const [advExp, setAdvExp] = useState("");
  const [advMinScore, setAdvMinScore] = useState<number | "">("");
  const [advStatus, setAdvStatus] = useState("");
  const [aiSkills, setAiSkills] = useState<string[]>([]);
  
  const [viewingStudent, setViewingStudent] = useState<any>(null);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/admin/login"); return; }
      if (session.user.email !== ADMIN_EMAIL) {
        alert("ACCESS DENIED: You are not the Owner!");
        await supabase.auth.signOut();
        router.push("/");
        return;
      }

      try {
        const { data: allStudents } = await supabase.from("profiles").select("*");
        if (allStudents) {
          setStudents(allStudents);
          setExamRequests(allStudents.filter((s: any) => s.examAccess === "pending"));
          setDisputedProfiles(allStudents.filter((s: any) => s.hired_status === "disputed"));
        }
        const { data: allCompanies } = await supabase.from("companies").select("*");
        if (allCompanies) setCompanies(allCompanies);
      } catch (e) { console.error("Error:", e); } 
      finally { setLoading(false); }
    };
    fetchSessionAndData();
  }, [router]);

  const openAccessModal = (company: any) => {
    setSelectedCompany(company);
    setAssignedStudentIds(company.allowedStudents || []);
    setShowAccessModal(true);
    setModalSearch(""); setFilterCityModal(""); setFilterQualModal("");
  };

  const toggleAssignment = async (studentId: string) => {
    if (!selectedCompany) return;
    const isAlreadyAssigned = assignedStudentIds.includes(studentId);
    const newAssignedList = isAlreadyAssigned ? assignedStudentIds.filter(id => id !== studentId) : [...assignedStudentIds, studentId];
    try {
      const { error } = await supabase.from("companies").update({ allowedStudents: newAssignedList }).eq("id", selectedCompany.id);
      if (error) throw error;
      setAssignedStudentIds(newAssignedList);
      setCompanies(prev => prev.map(c => c.id === selectedCompany.id ? { ...c, allowedStudents: newAssignedList } : c));
    } catch (e) { alert("Error updating assignment"); }
  };

  const toggleBio = (id: string) => setExpandedStudentId(expandedStudentId === id ? null : id);

  const grantExamAccess = async (id: string) => { 
    try {
      const { error } = await supabase.from("profiles").update({ examAccess: "granted" }).eq("id", id);
      if (error) throw error;
      setExamRequests(prev => prev.filter(r => r.id !== id)); 
      alert("Permission Granted for Re-Test!");
    } catch (error) { alert("Failed to grant access."); }
  };

  const resolveDispute = async (id: string) => {
    if(!confirm("Are you sure you want to resolve this dispute and set the candidate's status back to Normal?")) return;
    try {
      const { error } = await supabase.from("profiles").update({ hired_status: "none", hired_company_id: null, hired_company_name: null }).eq("id", id);
      if (error) throw error;
      setDisputedProfiles(prev => prev.filter(r => r.id !== id)); 
      alert("Dispute Resolved. Profile is back to normal.");
    } catch (error) { alert("Failed to resolve dispute."); }
  };

  const toggleCompanyStatus = async (id: string, status: string) => {
    const newStatus = status === "pending" ? "approved" : "pending";
    try {
      const { error } = await supabase.from("companies").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setCompanies(prev => prev.map(c => c.id === id ? {...c, status: newStatus} : c));
    } catch (error) { alert("Error updating status"); }
  };

  const uniqueCities = Array.from(new Set(students.map(s => s.city).filter(Boolean)));
  const uniqueQuals = Array.from(new Set(students.map(s => s.qualification).filter(Boolean)));
  const uniqueExps = Array.from(new Set(students.map(s => s.experience).filter(Boolean)));

  const filteredStudentsForModal = students.filter(s => {
    const matchSearch = s.fullName?.toLowerCase().includes(modalSearch.toLowerCase()) || s.skills?.some((sk: string) => sk.toLowerCase().includes(modalSearch.toLowerCase()));
    const matchCity = filterCityModal ? s.city?.toLowerCase() === filterCityModal.toLowerCase() : true;
    const matchQual = filterQualModal ? s.qualification?.includes(filterQualModal) : true;
    return matchSearch && matchCity && matchQual;
  });

  const handleAISearch = async () => {
    if (!aiSearchQuery.trim()) {
      setAdvCity(""); setAdvQual(""); setAdvExp(""); setAdvMinScore(""); setAdvStatus(""); setAiSkills([]);
      return;
    }
    setIsAILoading(true);
    try {
      const response = await fetch('/api/ai-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiSearchQuery })
      });
      const data = await response.json();
      if (data.city) setAdvCity(data.city);
      if (data.qualification) setAdvQual(data.qualification);
      if (data.experience) setAdvExp(data.experience);
      if (data.minScore) setAdvMinScore(data.minScore);
      if (data.hiringStatus) setAdvStatus(data.hiringStatus); 
      if (data.skills && data.skills.length > 0) setAiSkills(data.skills);
    } catch (error) {
      alert("AI failed to process the request. Try manual filters.");
    } finally { setIsAILoading(false); }
  };

  const filteredMainStudents = students.filter(s => {
    let match = true;
    const sScore = s.meta?.totalScore || 0;
    
    if (advCity && s.city?.toLowerCase() !== advCity.toLowerCase()) match = false;
    if (advQual && !s.qualification?.toLowerCase().includes(advQual.toLowerCase())) match = false;
    if (advExp && s.experience !== advExp) match = false;
    if (advMinScore !== "" && sScore < Number(advMinScore)) match = false;
    
    if (advStatus) {
       if (advStatus === "none" && (s.hired_status === "hired" || s.hired_status === "disputed" || s.hired_status === "pending")) match = false;
       else if (advStatus === "hired" && s.hired_status !== "hired") match = false;
       else if (advStatus === "disputed" && s.hired_status !== "disputed") match = false;
    }

    if (aiSkills.length > 0) {
       const candidateSkillsString = (s.skills || []).join(' ').toLowerCase();
       const hasAllRequiredSkills = aiSkills.every(skill => candidateSkillsString.includes(skill.toLowerCase()));
       if (!hasAllRequiredSkills) match = false;
    }
    return match;
  });

  if (loading) return <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center font-bold text-xl tracking-widest animate-pulse">VERIFYING ADMIN...</div>;

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col fixed h-full z-10 shadow-2xl">
        <h2 className="text-2xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-10 tracking-tight">Owner Panel</h2>
        <nav className="space-y-3 flex-1">
          <button onClick={() => setActiveTab("requests")} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'requests' ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/20 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <div className="flex items-center gap-3"><Bell size={20} /> Alerts</div>
            {(examRequests.length > 0 || disputedProfiles.length > 0) && <span className="bg-white text-red-600 text-xs font-black px-2 py-1 rounded-lg animate-pulse">{examRequests.length + disputedProfiles.length}</span>}
          </button>
          
          <button onClick={() => setActiveTab("companies")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'companies' ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/20 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <Building2 size={20} /> Companies
          </button>
          
          <button onClick={() => setActiveTab("students")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'students' ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/20 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <Users size={20} /> Candidates
          </button>
          
          <button onClick={() => setActiveTab("billing")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'billing' ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/20 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <CreditCard size={20} /> Billing
          </button>
          
          <div className="pt-6 mt-6 border-t border-slate-800">
            <button onClick={() => router.push('/admin/upload-questions')} className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl font-bold bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all shadow-lg">
              <Upload size={20} /> Upload Q-Bank
            </button>
          </div>
        </nav>
        <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }} className="flex items-center gap-3 text-slate-500 mt-auto hover:text-red-400 font-bold transition-colors">
          <LogOut size={20} /> Exit Admin
        </button>
      </aside>

      <main className="flex-1 p-8 md:p-10 ml-64 overflow-y-auto min-h-screen relative">
        
        {activeTab === "students" && (
           <div className="animate-in fade-in duration-300">
             <div className="flex justify-between items-end mb-8">
                <div>
                   <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Talent Pool</h2>
                   <p className="text-slate-400">Search with AI or use manual filters to find exact matches.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 px-5 py-2 rounded-xl text-center shadow-lg shadow-slate-900/50">
                   <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Found</p>
                   <p className="text-3xl font-black text-blue-400">{filteredMainStudents.length}</p>
                </div>
             </div>

             <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 rounded-[2rem] shadow-2xl mb-10">
                <div className="relative mb-6 flex gap-3">
                   <div className="relative flex-1 group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                         {isAILoading ? <Loader2 className="text-blue-400 animate-spin" size={24}/> : <Sparkles className="text-blue-400 group-focus-within:text-blue-300 transition-colors" size={24}/>}
                      </div>
                      <input type="text" value={aiSearchQuery} onChange={(e) => setAiSearchQuery(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') handleAISearch(); }} placeholder="Ask AI: 'Show me Hired CA in Kolkata with score 15+'..." className="w-full bg-slate-950/80 border-2 border-slate-700/50 text-white rounded-2xl py-4 pl-14 pr-6 text-lg placeholder:text-slate-500 focus:border-blue-500 focus:bg-[#020617] transition-all outline-none shadow-inner" disabled={isAILoading} />
                   </div>
                   <button onClick={handleAISearch} disabled={isAILoading} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 rounded-2xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center min-w-[120px]">
                      {isAILoading ? "Thinking..." : "Search"}
                   </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                   <select value={advStatus} onChange={(e)=>setAdvStatus(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 font-medium text-sm focus:border-blue-500 outline-none text-slate-300 [color-scheme:dark]">
                      <option value="">🟢 All Status</option>
                      <option value="none">✨ Available Talent</option>
                      <option value="hired">💼 Hired / Locked</option>
                      <option value="disputed">🚨 Disputed</option>
                   </select>
                   <select value={advCity} onChange={(e)=>setAdvCity(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 font-medium text-sm focus:border-blue-500 outline-none text-slate-300 [color-scheme:dark]">
                      <option value="">🗺️ Any City</option>
                      {uniqueCities.map((city:any, i) => <option key={i} value={city}>{city}</option>)}
                   </select>
                   <select value={advQual} onChange={(e)=>setAdvQual(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 font-medium text-sm focus:border-blue-500 outline-none text-slate-300 [color-scheme:dark]">
                      <option value="">🎓 Any Qualification</option>
                      {uniqueQuals.map((q:any, i) => <option key={i} value={q}>{q}</option>)}
                   </select>
                   <select value={advExp} onChange={(e)=>setAdvExp(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 font-medium text-sm focus:border-blue-500 outline-none text-slate-300 [color-scheme:dark]">
                      <option value="">💼 Any Experience</option>
                      {uniqueExps.map((e:any, i) => <option key={i} value={e}>{e}</option>)}
                   </select>
                   <select value={advMinScore} onChange={(e)=>setAdvMinScore(e.target.value ? Number(e.target.value) : "")} className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 font-medium text-sm focus:border-blue-500 outline-none text-slate-300 [color-scheme:dark]">
                      <option value="">🎯 Minimum Score</option>
                      <option value="5">Score 5+</option>
                      <option value="10">Score 10+</option>
                      <option value="15">Score 15+</option>
                      <option value="20">Score 20+</option>
                   </select>
                </div>

                {aiSkills.length > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                     <span className="text-xs text-slate-400 font-bold uppercase">AI Filters Active:</span>
                     {aiSkills.map((sk, i) => <span key={i} className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-md text-xs font-bold">{sk}</span>)}
                     <button onClick={() => { setAiSkills([]); setAiSearchQuery(""); }} className="text-xs text-red-400 hover:text-red-300 ml-2">Clear</button>
                  </div>
                )}
             </div>
             
             {/* 🚀 REVAMPED UNIFORM GRID DESIGN 🚀 */}
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
               {filteredMainStudents.map(s => {
                 const score = s.meta?.totalScore || 0;
                 const isDisqualified = s.examAccess === 'disqualified';
                 const scoreColorClass = score >= 15 ? 'text-green-400 bg-green-500/10 border-green-500/20' : score > 5 ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20';
                 
                 return (
                   <div key={s.id} className={`flex flex-col bg-[#0f172a] border rounded-[1.5rem] p-6 transition-all hover:-translate-y-1 hover:shadow-2xl h-full ${isDisqualified ? 'border-red-900/50 opacity-70' : 'border-slate-800 hover:border-blue-500/50'}`}>
                     
                     {/* CARD HEADER */}
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-2">
                           <h3 className="text-xl font-extrabold text-white flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="truncate max-w-[150px] xl:max-w-[180px]">{s.fullName}</span>
                              {isDisqualified && <span className="text-[9px] bg-red-600/20 text-red-500 border border-red-500/30 px-2 py-0.5 rounded-full uppercase font-black tracking-wider">Banned</span>}
                           </h3>
                           <p className="text-slate-400 text-sm font-medium flex items-center gap-1.5"><MapPin size={14} className="text-blue-500"/> {s.city || "Location not set"}</p>
                           
                           {/* SLEEK HIRED BADGE */}
                           {s.hired_status === 'hired' && (
                              <p className="text-[10px] text-green-400 font-bold mt-2 flex items-center gap-1 bg-green-500/10 inline-flex px-2 py-1 rounded-md border border-green-500/20">
                                 <CheckCircle size={12}/> HIRED BY {s.hired_company_name?.toUpperCase() || "COMPANY"}
                              </p>
                           )}
                        </div>
                        
                        <div className="shrink-0">
                           <span className={`text-sm font-black px-3 py-2 rounded-xl border flex flex-col items-center justify-center shadow-inner min-w-[60px] ${isDisqualified ? 'bg-red-500/20 text-red-500 border-red-500/30' : scoreColorClass}`}>
                              <span className="text-[9px] uppercase tracking-widest opacity-80 mb-0.5">Score</span>
                              <span className="text-lg leading-none">{score}</span>
                           </span>
                        </div>
                     </div>
                     
                     {/* DEGREE & EXP BOX */}
                     <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 mb-4">
                        <div className="flex items-center gap-3 mb-2.5">
                           <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                              <GraduationCap size={16} className="text-purple-400"/>
                           </div>
                           <div className="flex-1 truncate">
                              <p className="text-sm font-bold text-white truncate">{s.qualification || "N/A"}</p>
                              {s.professionalDetails && <p className="text-[10px] text-yellow-500 mt-0.5 uppercase font-bold truncate">{s.professionalDetails}</p>}
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                              <Briefcase size={16} className="text-blue-400"/>
                           </div>
                           <p className="text-sm font-bold text-slate-300">{s.experience || "Fresher"}</p>
                        </div>
                     </div>

                     {/* SKILLS TAGS */}
                     <div className="flex flex-wrap gap-1.5 mb-4 h-[44px] overflow-hidden">
                        {s.skills?.map((skill:string, idx:number) => (
                           <span key={idx} className="bg-slate-800/50 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-700/50 truncate max-w-[120px]">{skill}</span>
                        ))}
                     </div>

                     {/* 🚀 THE MAGIC "MT-AUTO" WRAPPER PUSHES BUTTON TO BOTTOM 🚀 */}
                     <div className="mt-auto">
                        
                        {/* REFINED RATING BAR */}
                        {s.hired_status === 'hired' && s.company_rating && (
                           <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2.5 mb-3 flex items-center justify-between">
                              <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Company Rating</span>
                              <div className="flex gap-0.5">
                                 {[1,2,3,4,5].map(star => (
                                    <Star key={star} size={12} fill={star <= s.company_rating ? "#EAB308" : "none"} className={star <= s.company_rating ? "text-yellow-500" : "text-slate-600"}/>
                                 ))}
                              </div>
                           </div>
                        )}
                        
                        {/* VIEW PROFILE BUTTON */}
                        <button onClick={() => setViewingStudent(s)} className="w-full bg-slate-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 border border-slate-700 hover:border-transparent text-slate-300 hover:text-white py-3.5 rounded-xl transition-all text-sm font-bold flex items-center justify-center gap-2 shadow-lg group">
                           <ExternalLink size={18} className="group-hover:scale-110 transition-transform"/> View Full Profile
                        </button>
                     </div>
                   </div>
                 )
               })}
               
               {filteredMainStudents.length === 0 && (
                 <div className="col-span-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-lg">
                    <Search className="text-slate-600 mx-auto mb-4" size={48}/>
                    <h3 className="text-2xl font-bold text-white mb-2">No Talent Found</h3>
                    <p className="text-slate-400">Try tweaking your search or dropdown filters.</p>
                 </div>
               )}
             </div>
           </div>
        )}

        {activeTab === "companies" && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">Registered Companies</h2>
            <p className="text-slate-400 mb-8">Manage approvals and assign candidates.</p>
            <div className="grid gap-6">
              {companies.map((c) => (
                <div key={c.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-lg hover:border-slate-700 transition-all">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">{c.name} {c.status === 'approved' && <CheckCircle size={16} className="text-green-500"/>}</h3>
                    <p className="text-slate-400 text-sm mb-3">{c.email}</p>
                    <div className="flex gap-2">
                       {c.requirements?.map((req:string, k:number) => (
                          <span key={k} className="bg-purple-900/20 text-purple-300 text-xs px-2 py-1 rounded border border-purple-500/10">{req}</span>
                       ))}
                    </div>
                    <p className="text-blue-400 text-xs mt-3 font-semibold bg-blue-500/10 inline-block px-3 py-1 rounded-full">
                      Assigned Candidates: {c.allowedStudents?.length || 0}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {c.status === 'approved' && (
                       <button onClick={() => openAccessModal(c)} className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all">
                          <UserPlus size={18}/> Assign Candidates
                       </button>
                    )}
                    <button onClick={() => toggleCompanyStatus(c.id, c.status)} className={`px-5 py-2.5 rounded-xl font-bold border transition-all ${c.status === 'pending' ? 'bg-green-600/10 text-green-400 border-green-500 hover:bg-green-600 hover:text-white' : 'bg-red-600/10 text-red-400 border-red-500 hover:bg-red-600 hover:text-white'}`}>
                      {c.status === 'pending' ? "Approve" : "Revoke"}
                    </button>
                  </div>
                </div>
              ))}
              {companies.length === 0 && <div className="text-slate-500">No companies found.</div>}
            </div>
          </div>
        )}

        {activeTab === "requests" && (
           <div className="animate-in fade-in duration-300 grid gap-8">
             
             <div>
               <h2 className="text-3xl font-extrabold text-red-400 tracking-tight mb-2 flex items-center gap-2"><AlertCircle/> Fake Hire Reports</h2>
               <p className="text-slate-400 mb-6">Candidates who reported a false hiring update from a company.</p>
               <div className="space-y-4">
                 {disputedProfiles.map((s) => (
                    <div key={s.id} className="bg-red-950/20 border border-red-900/50 p-6 rounded-2xl flex justify-between items-center shadow-lg">
                       <div>
                          <h3 className="font-bold text-xl text-white">{s.fullName}</h3>
                          <p className="text-red-300 text-sm mt-1">Reported Company: <strong>{s.hired_company_name}</strong></p>
                       </div>
                       <button onClick={() => resolveDispute(s.id)} className="bg-slate-800 border border-slate-700 hover:border-red-500 px-6 py-3 rounded-xl font-bold shadow-lg transition-all text-white">Resolve Dispute</button>
                    </div>
                 ))}
                 {disputedProfiles.length === 0 && (
                    <div className="text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-500">
                       <ShieldCheck size={48} className="mx-auto mb-2 text-slate-600 opacity-50"/>
                       <p>No fake hire reports. The platform is secure.</p>
                    </div>
                 )}
               </div>
             </div>

             <div className="border-t border-slate-800 my-4"></div>

             <div>
               <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Re-Test Requests</h2>
               <p className="text-slate-400 mb-6">Approve locked candidates to retake the final assessment.</p>
               <div className="space-y-4">
                 {examRequests.map((s) => (
                    <div key={s.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-lg">
                       <div>
                          <h3 className="font-bold text-xl text-white">{s.fullName}</h3>
                          <p className="text-slate-400 text-sm">{s.email}</p>
                       </div>
                       <button onClick={() => grantExamAccess(s.id)} className="bg-green-600 px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 hover:bg-green-700 transition-all">Allow Re-Test</button>
                    </div>
                 ))}
                 {examRequests.length === 0 && (
                    <div className="text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-500">
                       <p>No re-test requests pending right now.</p>
                    </div>
                 )}
               </div>
             </div>

           </div>
        )}

        {activeTab === "billing" && (
           <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                 <CreditCard size={40} className="text-blue-400"/>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3">Billing Dashboard</h2>
              <p className="text-slate-400 max-w-md mx-auto">Payment integration and analytics will be activated once the platform generates its first revenue.</p>
           </div>
        )}

      </main>

      {viewingStudent && (
         <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-md z-[100] overflow-y-auto p-4 md:p-8 animate-in zoom-in-95 duration-200 custom-scrollbar">
            <div className="max-w-5xl mx-auto relative mt-4 md:mt-10 mb-10">
               <div className="sticky top-0 z-50 mb-8 flex justify-between items-center bg-[#020617]/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 shadow-2xl">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><User size={20} className="text-blue-400"/> Detailed Report</h3>
                  <button onClick={() => setViewingStudent(null)} className="flex items-center gap-2 text-white font-bold bg-slate-800 hover:bg-red-600 px-5 py-2.5 rounded-xl transition-colors shadow-lg">
                     <X size={18}/> Close Profile
                  </button>
               </div>
               <div className="shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem]">
                  <CandidateProfileView candidate={viewingStudent} role="admin" />
               </div>
            </div>
         </div>
      )}

      {showAccessModal && selectedCompany && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[90] p-4 animate-in fade-in duration-200">
             <div className="bg-[#0f172a] border border-slate-700 w-full max-w-4xl rounded-3xl max-h-[90vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50 rounded-t-3xl sticky top-0 z-10 backdrop-blur-md">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Assign Talent</h3>
                         <p className="text-slate-400 text-sm">Select candidates for <span className="text-white font-semibold">{selectedCompany.name}</span></p>
                      </div>
                      <button onClick={() => setShowAccessModal(false)} className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition-colors"><X size={20}/></button>
                   </div>
                   
                   <div className="flex flex-col md:flex-row gap-3">
                      <div className="relative flex-1">
                         <Search className="absolute left-3 top-3 text-slate-500" size={18}/>
                         <input type="text" placeholder="Search by name or skill..." value={modalSearch} onChange={(e) => setModalSearch(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 outline-none transition-colors" />
                      </div>
                      <select value={filterCityModal} onChange={(e)=>setFilterCityModal(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm focus:border-blue-500 outline-none w-full md:w-36 text-slate-300">
                         <option value="">All Cities</option>
                         {uniqueCities.map((city:any, i) => <option key={i} value={city}>{city}</option>)}
                      </select>
                      <select value={filterQualModal} onChange={(e)=>setFilterQualModal(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-sm focus:border-blue-500 outline-none w-full md:w-48 text-slate-300">
                         <option value="">All Degrees</option>
                         {uniqueQuals.map((q:any, i) => <option key={i} value={q}>{q}</option>)}
                      </select>
                   </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                   {filteredStudentsForModal.map((s) => {
                      const isSelected = assignedStudentIds.includes(s.id);
                      const isExpanded = expandedStudentId === s.id;
                      const score = s.meta?.totalScore || 0;
                      const warnings = s.meta?.warningsCount || 0;
                      const isDisqualified = s.examAccess === 'disqualified';

                      return (
                        <div key={s.id} className={`border rounded-2xl transition-all duration-200 ${isSelected ? 'bg-blue-900/20 border-blue-500/50' : isDisqualified ? 'bg-red-950/20 border-red-900/30 opacity-70' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}>
                           <div className="flex items-center p-5 gap-5 cursor-pointer" onClick={(e) => { if((e.target as HTMLElement).closest('button')) return; toggleAssignment(s.id); }}>
                              <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-600 hover:border-blue-500'}`}>
                                 {isSelected && <CheckCircle size={16} className="text-white"/>}
                              </div>
                              <div className="flex-1">
                                 <div className="flex justify-between items-center mb-1">
                                    <h4 className={`font-bold text-lg flex items-center gap-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                      {s.fullName}
                                      {isDisqualified && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Disqualified</span>}
                                      {s.professionalDetails && <span className="text-[10px] bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{s.professionalDetails}</span>}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      {!isDisqualified && warnings > 0 && (
                                         <span title={`${warnings} Warnings during test`} className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg border border-yellow-500/20">
                                          <AlertTriangle size={12}/> {warnings}
                                         </span>
                                      )}
                                      <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${isDisqualified ? 'bg-red-500/20 text-red-400' : score >= 15 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        Score: {score}
                                      </span>
                                    </div>
                                 </div>
                                 <p className="text-xs text-slate-500 flex items-center gap-2">
                                    <span className="flex items-center gap-1"><MapPin size={12}/> {s.city || "Remote"}</span> | 
                                    <span className="flex items-center gap-1"><GraduationCap size={12}/> {s.qualification || "N/A"}</span> | 
                                    <span>{s.skills?.slice(0, 3).join(", ")}...</span>
                                 </p>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); toggleBio(s.id); }} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 text-slate-400 transition-colors shrink-0">
                                {isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                              </button>
                           </div>

                           {isExpanded && (
                             <div className="px-5 pb-5 pt-0 border-t border-slate-800/50 mt-2">
                                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                   <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                      <p className="text-slate-500 flex items-center gap-2 mb-1"><GraduationCap size={14}/> Qualification</p>
                                      <p className="text-white font-medium">{s.qualification || "N/A"}</p>
                                   </div>
                                   <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                      <p className="text-slate-500 flex items-center gap-2 mb-1"><Briefcase size={14}/> Experience</p>
                                      <p className="text-white font-medium">{s.experience || "Fresher"}</p>
                                   </div>
                                   <button onClick={(e) => { e.stopPropagation(); setViewingStudent(s); setShowAccessModal(false); }} className="col-span-2 mt-2 bg-slate-800 hover:bg-blue-600 hover:border-blue-500 border border-slate-700 text-slate-300 hover:text-white py-3 rounded-xl transition-all text-sm font-bold flex items-center justify-center gap-2">
                                     <ExternalLink size={16}/> Open Full Detailed Report
                                   </button>
                                </div>
                             </div>
                           )}
                        </div>
                      );
                   })}
                   {filteredStudentsForModal.length === 0 && <div className="text-center py-10 text-slate-500">No candidates found for these filters.</div>}
                </div>

                <div className="p-5 border-t border-slate-800 bg-slate-900/50 rounded-b-3xl flex justify-between items-center backdrop-blur-md">
                   <p className="text-sm text-slate-400"><span className="text-white font-bold">{assignedStudentIds.length}</span> candidates selected</p>
                   <button onClick={() => setShowAccessModal(false)} className="bg-green-600 px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-900/20 transition-all">Done Assigning</button>
                </div>
             </div>
          </div>
        )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}