"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  User, Users, Building2, CreditCard, LogOut, Upload, Bell, 
  UserPlus, X, ChevronDown, ChevronUp, MapPin, Briefcase, GraduationCap, CheckCircle, Search, AlertTriangle, ShieldAlert, ShieldCheck, ExternalLink, Sparkles, Loader2, AlertCircle, Star, Globe, Video
} from "lucide-react";
import CandidateProfileView from "@/app/components/CandidateProfileView";
import CompanyProfileView from "@/app/components/CompanyProfileView";
import { motion } from "framer-motion";

// 🔥 Naye Master Components 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import * as XLSX from 'xlsx'; // 🔥 EXCEL EXPORT LOGIC 🔥

export default function AdminDashboard() {
  const router = useRouter();
  const ADMIN_EMAIL = "admin@talexo.in"; 

  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  
 const [examRequests, setExamRequests] = useState<any[]>([]);
  const [shortlistedProfiles, setShortlistedProfiles] = useState<any[]>([]);
  const [hireRequests, setHireRequests] = useState<any[]>([]);
  const [interviewRequests, setInterviewRequests] = useState<any[]>([]); // 🔥 NAYA STATE
  const [meetLinks, setMeetLinks] = useState<{ [key: string]: string }>({}); // Meet Link save karne ke liye
  
  const [loading, setLoading] = useState(true);

  // MODAL STATES
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [assignedStudentIds, setAssignedStudentIds] = useState<string[]>([]);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState("");
  const [filterCityModal, setFilterCityModal] = useState("");
  const [filterQualModal, setFilterQualModal] = useState("");

  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);

  const [advCity, setAdvCity] = useState("");
  const [advQual, setAdvQual] = useState("");
  const [advExp, setAdvExp] = useState("");
  const [advMinScore, setAdvMinScore] = useState<number | "">("");
  const [advStatus, setAdvStatus] = useState("");
  const [aiSkills, setAiSkills] = useState<string[]>([]);
  const [viewingStudent, setViewingStudent] = useState<any>(null);
  const [viewingCompany, setViewingCompany] = useState<any>(null);

  // 🔥 EXCEL EXPORT STATES & LOGIC 🔥
  const [selectedForExcel, setSelectedForExcel] = useState<string[]>([]);

  const toggleExcelSelection = (id: string) => {
      setSelectedForExcel(prev => prev.includes(id) ? prev.filter(studentId => studentId !== id) : [...prev, id]);
  };

  const handleExportExcel = () => {
      if (selectedForExcel.length === 0) return alert("Please select at least one candidate!");

      const selectedData = filteredMainStudents.filter(s => selectedForExcel.includes(s.id));
      
      const excelData = selectedData.map(s => {
          const baseData: any = {
              "Name": s.fullName || "N/A",
              "Phone no": s.phone || "N/A",
              "Email ID": s.email || "N/A",
              "Highest Qual.": s.highestQualification || "N/A",
              "Passing Year": s.educations?.[0]?.passingYear || "N/A",
              "Experience": s.experience || "N/A",
              "Location": s.city || "N/A",
              "Notice Period": s.noticePeriod || "N/A",
              "Current Salary": s.currentSalary || "N/A",
              "Expected Salary": s.expectedSalary || "N/A",
              "Rating": s.company_rating || "N/A",
              "Relocate": s.willingToRelocate || "N/A",
              "Contract Ready": s.openToContractRoles ? "Yes" : "No"
          };

          // 🔥 PRO FORMAT: Combine all scores into one clean readable column
          let skillsText = "Not Assessed";
          if (s.meta?.skillScores) {
              const skillEntries = Object.keys(s.meta.skillScores).map(skillName => {
                  const score = Math.max(0, s.meta.skillScores[skillName].scoreCount);
                  const total = s.meta.skillScores[skillName].total;
                  return `${skillName} (${score}/${total})`;
              });
              if (skillEntries.length > 0) {
                  skillsText = skillEntries.join("  |  ");
              }
          }
          baseData["Assessed Skills & Scores"] = skillsText;

          return baseData;
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // 🔥 FIX: Auto-adjust column widths so text doesn't get cut 🔥
      const colWidths = [
          { wch: 25 }, // Name
          { wch: 15 }, // Phone
          { wch: 35 }, // Email ID (Lamba rakha taaki cut na ho)
          { wch: 25 }, // Highest Qual
          { wch: 15 }, // Year
          { wch: 15 }, // Experience
          { wch: 18 }, // Location
          { wch: 15 }, // Notice
          { wch: 15 }, // Curr Salary
          { wch: 15 }, // Exp Salary
          { wch: 10 }, // Rating
          { wch: 12 }, // Relocate
          { wch: 15 }, // Contract
          { wch: 80 }  // Assessed Skills (Bahut lamba rakha taaki sab ek line me aaye)
      ];
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
      XLSX.writeFile(workbook, "Talent_Pool_Export.xlsx");
      setSelectedForExcel([]); 
  };

  useEffect(() => {
    let sub1: any;
    let sub2: any;

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
          setShortlistedProfiles(allStudents.filter((s: any) => s.hired_status === "shortlisted"));
          setHireRequests(allStudents.filter((s: any) => s.hired_status === "hire_requested"));
          setInterviewRequests(allStudents.filter((s: any) => s.hired_status === "interview_requested")); // 🔥 NAYA FILTER
        }
        
        const { data: allCompanies } = await supabase.from("companies").select("*");
        if (allCompanies) setCompanies(allCompanies);
      } catch (e) { console.error("Error:", e); } 
      finally { setLoading(false); }
    };
    
    fetchSessionAndData();

    sub1 = supabase.channel('admin_profiles_live').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => { fetchSessionAndData(); }).subscribe();
    sub2 = supabase.channel('admin_companies_live').on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, () => { fetchSessionAndData(); }).subscribe();

    return () => {
      if(sub1) supabase.removeChannel(sub1);
      if(sub2) supabase.removeChannel(sub2);
    };
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

  const clearShortlist = async (id: string) => {
    if(!confirm("Clear Shortlist? This returns the candidate to the available talent pool.")) return;
    try {
      const { error } = await supabase.from("profiles").update({ hired_status: "none", hired_company_id: null, hired_company_name: null }).eq("id", id);
      if (error) throw error;
      setShortlistedProfiles(prev => prev.filter(r => r.id !== id));
      setStudents(prev => prev.map(s => s.id === id ? {...s, hired_status: "none", hired_company_id: null, hired_company_name: null} : s));
      alert("Candidate returned to pool.");
    } catch (error) { alert("Action failed."); }
  };

  const sendMeetLink = async (id: string) => {
    const link = meetLinks[id];
    if(!link) return alert("Pehle Google Meet ka link daalo!");
    try {
      const { error } = await supabase.from("profiles").update({ 
        hired_status: "shortlisted", // Status update ho gaya "Meet Link Ready" par
        meet_link: link
      }).eq("id", id);
      if (error) throw error;
      
      alert("Meet Link sent to Company successfully!");
      setInterviewRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) { alert("Failed to send link."); }
  };

  const approveHire = async (id: string) => {
    if(!confirm("Approve Hire? This will officially lock the candidate's profile and start their review timer.")) return;
    try {
      const currentDate = new Date().toISOString();
      const { error } = await supabase.from("profiles").update({ hired_status: "hired", hire_date: currentDate }).eq("id", id);
      if (error) throw error;
      setHireRequests(prev => prev.filter(r => r.id !== id)); 
      setStudents(prev => prev.map(s => s.id === id ? {...s, hired_status: "hired", hire_date: currentDate} : s));
      alert("Hire Approved! Profile is now locked.");
    } catch (error) { alert("Failed to approve hire."); }
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
      setAdvCity(""); setAdvQual("");
      setAdvExp(""); setAdvMinScore(""); setAdvStatus(""); setAiSkills([]);
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
       if (advStatus === "none" && (s.hired_status === "hired" || s.hired_status === "disputed" || s.hired_status === "pending" || s.hired_status === "hire_requested" || s.hired_status === "shortlisted")) match = false;
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

  if (loading) return <div className="min-h-screen bg-transparent text-slate-900 flex items-center justify-center font-bold text-xl tracking-widest animate-pulse">VERIFYING ADMIN...</div>;
  
  const totalAlerts = examRequests.length + shortlistedProfiles.length + hireRequests.length + interviewRequests.length;

  return (
    <div className="min-h-screen bg-transparent text-slate-900 flex font-sans relative">
     <aside className="w-64 bg-[var(--background)]/80 backdrop-blur-xl border-r border-[var(--border)] p-6 hidden md:flex flex-col fixed h-full z-10 shadow-soft">
        <h2 className="font-display text-2xl font-black text-[var(--foreground)] mb-10 tracking-tight">Owner Panel</h2>
        <nav className="space-y-3 flex-1">
          <button onClick={() => setActiveTab("requests")} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'requests' ? 'bg-[var(--destructive)] text-[var(--destructive-foreground)] shadow-md' : 'hover:bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-transparent hover:border-[var(--border)]'}`}>
            <div className="flex items-center gap-3"><Bell size={20} /> Alerts</div>
            {totalAlerts > 0 && <span className="bg-[var(--background)] text-[var(--destructive)] text-xs font-black px-2 py-1 rounded-lg animate-pulse">{totalAlerts}</span>}
          </button>
          
          <button onClick={() => setActiveTab("companies")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'companies' ? 'bg-gradient-primary text-[var(--primary-foreground)] shadow-glow' : 'hover:bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-transparent hover:border-[var(--border)]'}`}>
            <Building2 size={20} /> Companies
          </button>
          
          <button onClick={() => setActiveTab("students")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'students' ? 'bg-gradient-primary text-[var(--primary-foreground)] shadow-glow' : 'hover:bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-transparent hover:border-[var(--border)]'}`}>
            <Users size={20} /> Candidates
          </button>
          
          <button onClick={() => setActiveTab("billing")} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${activeTab === 'billing' ? 'bg-gradient-primary text-[var(--primary-foreground)] shadow-glow' : 'hover:bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-transparent hover:border-[var(--border)]'}`}>
            <CreditCard size={20} /> Billing
          </button>
          
          <div className="pt-6 mt-6 border-t border-[var(--border)]">
            <Button variant="secondary" onClick={() => router.push('/admin/upload-questions')} className="w-full text-sm">
              <Upload size={18} /> Upload Q-Bank
            </Button>
          </div>
       </nav>
        <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }} className="flex items-center gap-3 text-[var(--muted-foreground)] mt-auto hover:text-[var(--destructive)] font-bold transition-colors px-4">
          <LogOut size={20} /> Exit Admin
        </button>
      </aside>

      <main className="flex-1 p-5 md:p-10 ml-0 md:ml-64 pb-24 md:pb-10 overflow-y-auto min-h-screen relative z-10">
        
        {activeTab === "students" && (
           <div className="animate-in fade-in duration-300">
             <div className="flex justify-between items-end mb-8">
                <div>
                   <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Talent Pool</h2>
                   <p className="text-slate-500 font-medium mb-4">Search with AI or use manual filters to find exact matches.</p>
                   
                   {/* 🔥 EXCEL BUTTONS 🔥 */}
                   <div className="flex items-center gap-3">
                      <button onClick={() => setSelectedForExcel(selectedForExcel.length === filteredMainStudents.length ? [] : filteredMainStudents.map(s => s.id))} className="text-sm font-bold text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                          {selectedForExcel.length > 0 && selectedForExcel.length === filteredMainStudents.length ? "Deselect All" : "Select All"}
                      </button>
                      {selectedForExcel.length > 0 && (
                          <Button variant="primary" onClick={handleExportExcel} className="text-sm py-2 px-5 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20">
                              <Upload size={16}/> Export {selectedForExcel.length} to Excel
                          </Button>
                      )}
                   </div>
                </div>
                <div className="bg-white/80 backdrop-blur-md border border-slate-200 px-5 py-2 rounded-xl text-center shadow-sm">
                   <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Found</p>
                   <p className="text-3xl font-black text-[#0f947e]">{filteredMainStudents.length}</p>
                </div>
             </div>

             <Card className="mb-10">
                <div className="relative mb-6 flex gap-3">
                   <div className="relative flex-1 group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                         {isAILoading ? <Loader2 className="text-teal-500 animate-spin" size={24}/> : <Sparkles className="text-teal-500 group-focus-within:text-teal-600 transition-colors" size={24}/>}
                      </div>
                      <input type="text" value={aiSearchQuery} onChange={(e) => setAiSearchQuery(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') handleAISearch(); }} placeholder="Ask AI: 'Show me Hired CA in Kolkata with score 15+'..." className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-2xl py-4 pl-14 pr-6 text-lg placeholder:text-slate-400 focus:border-teal-500 focus:bg-white transition-all outline-none shadow-sm" disabled={isAILoading} />
                   </div>
                   <Button variant="primary" onClick={handleAISearch} disabled={isAILoading} className="px-8 min-w-[120px]">
                       {isAILoading ? "Thinking..." : "Search"}
                   </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                   <select value={advStatus} onChange={(e)=>setAdvStatus(e.target.value)} className="bg-white border border-slate-200 rounded-xl py-3 px-4 font-medium text-sm focus:border-teal-500 outline-none text-slate-700 shadow-sm">
                      <option value="">🟢 All Status</option>
                      <option value="none">✨ Available Talent</option>
                      <option value="hired">💼 Hired / Locked</option>
                   </select>
                   <select value={advCity} onChange={(e)=>setAdvCity(e.target.value)} className="bg-white border border-slate-200 rounded-xl py-3 px-4 font-medium text-sm focus:border-teal-500 outline-none text-slate-700 shadow-sm">
                      <option value="">🗺️ Any City</option>
                      {uniqueCities.map((city:any, i) => <option key={i} value={city}>{city}</option>)}
                   </select>
                   <select value={advQual} onChange={(e)=>setAdvQual(e.target.value)} className="bg-white border border-slate-200 rounded-xl py-3 px-4 font-medium text-sm focus:border-teal-500 outline-none text-slate-700 shadow-sm">
                      <option value="">🎓 Any Qualification</option>
                      {uniqueQuals.map((q:any, i) => <option key={i} value={q}>{q}</option>)}
                   </select>
                   <select value={advExp} onChange={(e)=>setAdvExp(e.target.value)} className="bg-white border border-slate-200 rounded-xl py-3 px-4 font-medium text-sm focus:border-teal-500 outline-none text-slate-700 shadow-sm">
                      <option value="">💼 Any Experience</option>
                      {uniqueExps.map((e:any, i) => <option key={i} value={e}>{e}</option>)}
                   </select>
                   <select value={advMinScore} onChange={(e)=>setAdvMinScore(e.target.value ? Number(e.target.value) : "")} className="bg-white border border-slate-200 rounded-xl py-3 px-4 font-medium text-sm focus:border-teal-500 outline-none text-slate-700 shadow-sm">
                      <option value="">🎯 Minimum Score</option>
                      <option value="5">Score 5+</option>
                      <option value="10">Score 10+</option>
                      <option value="15">Score 15+</option>
                      <option value="20">Score 20+</option>
                   </select>
                </div>

                {aiSkills.length > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                     <span className="text-xs text-slate-500 font-bold uppercase">AI Filters Active:</span>
                     {aiSkills.map((sk, i) => <span key={i} className="bg-teal-50 text-teal-700 border border-teal-200 px-2 py-1 rounded-md text-xs font-bold">{sk}</span>)}
                     <button onClick={() => { setAiSkills([]); setAiSearchQuery(""); }} className="text-xs text-red-500 hover:text-red-600 ml-2 font-bold">Clear</button>
                  </div>
                )}
             </Card>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
               {filteredMainStudents.map(s => {
                 const score = s.meta?.totalScore || 0;
                 const isDisqualified = s.examAccess === 'disqualified';
                 const scoreColorClass = score >= 15 ? 'text-teal-700 bg-teal-50 border-teal-200' : score > 5 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-red-700 bg-red-50 border-red-200';
                 
                 // 🔥 Admin Talent Pool Professional ID 🔥
                 let qualPrefix = "PR"; 
                 if (s.highestQualification) {
                     const hq = s.highestQualification.toLowerCase();
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
                     else qualPrefix = "GD";
                 }
                 const displayId = s.id ? `RM-${qualPrefix}-${s.id.substring(0, 8).toUpperCase()}` : "N/A";

                 return (
                   <div key={s.id} className={`relative flex flex-col bg-white/80 backdrop-blur-md border rounded-[1.5rem] p-6 transition-all hover:-translate-y-1 shadow-sm hover:shadow-lg h-full ${selectedForExcel.includes(s.id) ? 'border-emerald-400 shadow-emerald-500/10' : isDisqualified ? 'border-red-200 opacity-70' : 'border-slate-200 hover:border-teal-300'}`}>
                     
                     {/* 🔥 EXCEL CHECKBOX 🔥 */}
                     <div className="absolute top-5 right-5 z-10">
                         <input 
                             type="checkbox" 
                             checked={selectedForExcel.includes(s.id)}
                             onChange={() => toggleExcelSelection(s.id)}
                             className="w-5 h-5 cursor-pointer accent-emerald-600 rounded border-slate-300"
                         />
                     </div>

                     <div className="flex justify-between items-start mb-4 mt-2">
                        <div className="flex-1 pr-10">
                           <h3 className="text-xl font-extrabold text-slate-900 flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="truncate max-w-[150px] xl:max-w-[180px]">{s.fullName}</span>
                              <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-mono font-bold">{displayId}</span>
                              {isDisqualified && <span className="text-[9px] bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full uppercase font-black tracking-wider">Banned</span>}
                           </h3>
                           <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5"><MapPin size={14} className="text-blue-500"/> {s.city || "Location not set"}</p>
                           
                           {s.hired_status === 'hired' && (
                              <p className="text-[10px] text-emerald-700 font-bold mt-2 flex items-center gap-1 bg-emerald-50 inline-flex px-2 py-1 rounded-md border border-emerald-200">
                                 <CheckCircle size={12}/> HIRED BY {s.hired_company_name?.toUpperCase() || "COMPANY"}
                              </p>
                           )}
                           {s.hired_status === 'shortlisted' && (
                              <p className="text-[10px] text-blue-700 font-bold mt-2 flex items-center gap-1 bg-blue-50 inline-flex px-2 py-1 rounded-md border border-blue-200">
                                 <UserPlus size={12}/> SHORTLISTED
                              </p>
                           )}
                        </div>
                        
                        <div className="shrink-0">
                           <span className={`text-sm font-black px-3 py-2 rounded-xl border flex flex-col items-center justify-center min-w-[60px] ${isDisqualified ? 'bg-red-50 text-red-600 border-red-200' : scoreColorClass}`}>
                              <span className="text-[9px] uppercase tracking-widest opacity-80 mb-0.5">Score</span>
                              <span className="text-lg leading-none">{score}</span>
                           </span>
                        </div>
                     </div>
                     
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                        <div className="flex items-center gap-3 mb-2.5">
                           <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                              <GraduationCap size={16} className="text-indigo-600"/>
                           </div>
                           <div className="flex-1 truncate">
                              <p className="text-sm font-bold text-slate-900 truncate">{s.qualification || "N/A"}</p>
                              {s.professionalDetails && <p className="text-[10px] text-amber-600 mt-0.5 uppercase font-bold truncate">{s.professionalDetails}</p>}
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                              <Briefcase size={16} className="text-blue-600"/>
                           </div>
                           <p className="text-sm font-bold text-slate-600">{s.experience || "Fresher"}</p>
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-1.5 mb-4 h-[44px] overflow-hidden">
                        {s.skills?.map((skill:string, idx:number) => (
                           <span key={idx} className="bg-white text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200 shadow-sm truncate max-w-[120px]">{skill}</span>
                        ))}
                     </div>

                    <div className="mt-auto">
                        {s.hired_status === 'hired' && s.company_rating && (
                           <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-3 flex items-center justify-between">
                              <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Company Rating</span>
                              <div className="flex gap-0.5">
                                 {[1,2,3,4,5].map(star => (
                                    <Star key={star} size={12} fill={star <= s.company_rating ? "#D97706" : "none"} className={star <= s.company_rating ? "text-amber-600" : "text-slate-300"}/>
                                 ))}
                              </div>
                           </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                           {/* 🔥 NEW: Chota Share Icon Button for Admin 🔥 */}
                           <button 
                              onClick={(e) => { 
                                  e.stopPropagation(); 
                                  const profileLink = `${window.location.origin}/p/${s.id}`;
                                  navigator.clipboard.writeText(profileLink);
                                  alert(`Public Link Copied for ${s.fullName}!`);
                              }} 
                              className="p-3 bg-white border border-slate-200 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors shadow-sm shrink-0"
                              title="Copy Public Link"
                           >
                              <Globe size={18} />
                           </button>
                           
                           {/* Original View Full Profile Button */}
                           <Button variant="secondary" onClick={() => setViewingStudent(s)} className="flex-1 text-sm py-3 flex justify-center group">
                              <ExternalLink size={18} className="group-hover:scale-110 transition-transform"/> View Full Profile
                           </Button>
                        </div>
                     </div>
                   </div>
                 )
               })}
               
               {filteredMainStudents.length === 0 && (
                 <div className="col-span-full bg-white/60 backdrop-blur-md border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                    <Search className="text-slate-400 mx-auto mb-4" size={48}/>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No Talent Found</h3>
                    <p className="text-slate-500 font-medium">Try tweaking your search or dropdown filters.</p>
                 </div>
               )}
             </div>
           </div>
        )}

        {activeTab === "companies" && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Registered Companies</h2>
            <p className="text-slate-500 font-medium mb-8">Manage approvals and assign candidates.</p>
            <div className="grid gap-6">
              {companies.map((c) => (
                <Card key={c.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">{c.name} {c.status === 'approved' && <CheckCircle size={16} className="text-emerald-500"/>}</h3>
                    <p className="text-slate-500 font-medium text-sm mb-3">{c.email}</p>
                    <div className="flex flex-wrap gap-2">
                       {c.requirements?.map((req:string, k:number) => (
                           <span key={k} className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded border border-indigo-200">{req}</span>
                       ))}
                    </div>
                    <p className="text-[#0f947e] text-xs mt-3 font-bold bg-teal-50 border border-teal-100 inline-block px-3 py-1 rounded-full">
                       Assigned Candidates: {c.allowedStudents?.length || 0}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <Button variant="secondary" onClick={() => setViewingCompany(c)} className="flex-1 md:flex-none py-2.5 text-sm">
                       <ExternalLink size={18}/> View Profile
                    </Button>

                    {c.status === 'approved' && (
                       <Button variant="primary" onClick={() => openAccessModal(c)} className="flex-1 md:flex-none py-2.5 text-sm">
                          <UserPlus size={18}/> Assign Candidates
                       </Button>
                    )}
                    
                    <Button 
                       variant={c.status === 'pending' ? "primary" : "danger"} 
                       onClick={() => toggleCompanyStatus(c.id, c.status)} 
                       className={`flex-1 md:flex-none py-2.5 text-sm ${c.status === 'pending' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    >
                      {c.status === 'pending' ? "Approve" : "Revoke"}
                    </Button>
                  </div>
                </Card>
              ))}
              {companies.length === 0 && <div className="text-slate-500 font-medium">No companies found.</div>}
            </div>
          </div>
        )}

        {activeTab === "requests" && (
           <div className="animate-in fade-in duration-300 grid gap-8">
             <div>
               <h2 className="text-3xl font-extrabold text-emerald-600 tracking-tight mb-2 flex items-center gap-2"><CheckCircle/> Hire Requests</h2>
               <p className="text-slate-500 font-medium mb-6">Companies requesting to officially hire these candidates. Verify offline, then approve to lock their profiles.</p>
               <div className="space-y-4">
                 {hireRequests.map((s) => (
                    <Card key={s.id} className="bg-emerald-50/50 border-emerald-200 flex flex-col sm:flex-row justify-between items-center">
                       <div className="mb-4 sm:mb-0">
                          <h3 className="font-extrabold text-xl text-slate-900">{s.fullName}</h3>
                          <p className="text-emerald-700 text-sm mt-1 font-medium">Requested by: <strong>{s.hired_company_name}</strong></p>
                       </div>
                       <Button variant="primary" onClick={() => approveHire(s.id)} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">Approve Hire</Button>
                    </Card>
                 ))}
                 {hireRequests.length === 0 && (
                    <div className="text-center p-8 bg-white/60 rounded-2xl border border-slate-200 text-slate-500 font-medium shadow-sm">
                       <p>No new hire requests.</p>
                    </div>
                 )}
               </div>
             </div>

             <div className="border-t border-slate-200 my-4"></div>

             {/* 🔥 NAYA MEET LINK REQUESTS SECTION 🔥 */}
             <div>
               <h2 className="text-3xl font-extrabold text-indigo-600 tracking-tight mb-2 flex items-center gap-2"><Video/> Meet Link Requests</h2>
               <p className="text-slate-500 font-medium mb-6">Companies requested interviews. Generate a Google Meet link and send it to them below.</p>
               <div className="space-y-4">
                 {interviewRequests.map((s) => (
                    <Card key={s.id} className="bg-indigo-50/50 border-indigo-200 flex flex-col lg:flex-row justify-between items-center gap-4">
                       <div className="mb-2 lg:mb-0 w-full lg:w-auto">
                          <h3 className="font-extrabold text-xl text-slate-900">{s.fullName}</h3>
                          <p className="text-indigo-700 text-sm mt-1 font-medium">Req by: <strong>{s.hired_company_name}</strong></p>
                          <p className="text-indigo-600/80 text-xs mt-0.5 font-bold">📅 {s.interview_date} | ⏰ {s.interview_time}</p>
                       </div>
                       <div className="flex w-full lg:w-auto gap-2">
                          <input 
                            type="text" 
                            placeholder="Paste Google Meet Link..." 
                            value={meetLinks[s.id] || ""}
                            onChange={(e) => setMeetLinks({...meetLinks, [s.id]: e.target.value})}
                            className="flex-1 lg:w-64 bg-white border border-indigo-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                          />
                          <Button variant="primary" onClick={() => sendMeetLink(s.id)} className="bg-indigo-600 hover:bg-indigo-700 shrink-0">Send Link</Button>
                       </div>
                    </Card>
                 ))}
                 {interviewRequests.length === 0 && (
                    <div className="text-center p-8 bg-white/60 rounded-2xl border border-slate-200 text-slate-500 font-medium shadow-sm">
                       <p>No pending meet link requests.</p>
                    </div>
                 )}
               </div>
             </div>

             <div className="border-t border-slate-200 my-4"></div>
             {/* -------------------------------------- */}

             <div>
               <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight mb-2 flex items-center gap-2"><UserPlus/> Interview Shortlists</h2>
               <p className="text-slate-500 font-medium mb-6">Call the students and arrange offline interviews with the companies.</p>
               <div className="space-y-4">
                 {shortlistedProfiles.map((s) => (
                    <Card key={s.id} className="bg-blue-50/50 border-blue-200 flex flex-col sm:flex-row justify-between items-center">
                       <div className="mb-4 sm:mb-0">
                          <h3 className="font-extrabold text-xl text-slate-900">{s.fullName}</h3>
                          <p className="text-blue-700 text-sm mt-1 font-medium">Company: <strong>{s.hired_company_name}</strong> | Phone: {s.phone}</p>
                       </div>
                       <Button variant="danger" onClick={() => clearShortlist(s.id)} className="w-full sm:w-auto">Clear / Reject</Button>
                    </Card>
                 ))}
                 {shortlistedProfiles.length === 0 && (
                    <div className="text-center p-8 bg-white/60 rounded-2xl border border-slate-200 text-slate-500 font-medium shadow-sm">
                       <p>No pending interview shortlists.</p>
                    </div>
                 )}
               </div>
             </div>

             <div className="border-t border-slate-200 my-4"></div>

             <div>
               <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Re-Test Requests</h2>
               <p className="text-slate-500 font-medium mb-6">Approve locked candidates to retake the final assessment.</p>
               <div className="space-y-4">
                 {examRequests.map((s) => (
                    <Card key={s.id} className="flex flex-col sm:flex-row justify-between items-center">
                       <div className="mb-4 sm:mb-0">
                          <h3 className="font-extrabold text-xl text-slate-900">{s.fullName}</h3>
                          <p className="text-slate-500 font-medium text-sm">{s.email}</p>
                       </div>
                       <Button variant="secondary" onClick={() => grantExamAccess(s.id)} className="w-full sm:w-auto">Allow Re-Test</Button>
                    </Card>
                 ))}
                 {examRequests.length === 0 && (
                    <div className="text-center p-8 bg-white/60 rounded-2xl border border-slate-200 text-slate-500 font-medium shadow-sm">
                       <p>No re-test requests pending right now.</p>
                    </div>
                 )}
               </div>
             </div>
           </div>
        )}

        {activeTab === "billing" && (
           <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                 <CreditCard size={40} className="text-[#0f947e]"/>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Billing Dashboard</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto">Payment integration and analytics will be activated once the platform generates its first revenue.</p>
           </div>
        )}

      </main>

      {/* VIEW STUDENT PROFILE MODAL */}
      {viewingStudent && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] overflow-y-auto p-4 md:p-8 animate-in zoom-in-95 duration-200 custom-scrollbar">
            <div className="max-w-5xl mx-auto relative mt-4 md:mt-10 mb-10">
               <div className="sticky top-0 z-50 mb-8 flex justify-between items-center bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 shadow-lg">
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><User size={20} className="text-[#0f947e]"/> Detailed Report</h3>
                  <Button variant="danger" onClick={() => setViewingStudent(null)} className="py-2 text-sm shadow-none">
                     <X size={18}/> Close Profile
                  </Button>
               </div>
               <div className="shadow-2xl rounded-[2.5rem]">
                  <CandidateProfileView candidate={viewingStudent} role="admin" />
               </div>
            </div>
         </div>
      )}

      {/* VIEW COMPANY PROFILE MODAL */}
      {viewingCompany && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] overflow-y-auto p-4 md:p-8 animate-in zoom-in-95 duration-200 custom-scrollbar">
            <div className="max-w-5xl mx-auto relative mt-4 md:mt-10 mb-10">
               <div className="sticky top-0 z-50 mb-8 flex justify-between items-center bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 shadow-lg">
                  <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><Building2 size={20} className="text-indigo-600"/> Company Details</h3>
                  <Button variant="danger" onClick={() => setViewingCompany(null)} className="py-2 text-sm shadow-none">
                     <X size={18}/> Close Profile
                  </Button>
               </div>
               <div className="shadow-2xl rounded-[2.5rem]">
                  <CompanyProfileView company={viewingCompany} isAdminView={true} />
               </div>
            </div>
         </div>
      )}

      {/* ASSIGN TALENT MODAL */}
      {showAccessModal && selectedCompany && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[90] p-4 animate-in fade-in duration-200">
             <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-[2rem] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50/80 sticky top-0 z-10 backdrop-blur-md">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <h3 className="text-2xl font-extrabold text-slate-900">Assign Talent</h3>
                         <p className="text-slate-500 font-medium text-sm">Select candidates for <span className="text-[#0f947e] font-bold">{selectedCompany.name}</span></p>
                      </div>
                      <button onClick={() => setShowAccessModal(false)} className="bg-white border border-slate-200 p-2 rounded-full hover:bg-slate-100 transition-colors shadow-sm"><X size={20} className="text-slate-600"/></button>
                   </div>
                   
                   <div className="flex flex-col md:flex-row gap-3">
                      <div className="relative flex-1">
                         <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
                         <input type="text" placeholder="Search by name or skill..." value={modalSearch} onChange={(e) => setModalSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-teal-500 outline-none transition-colors shadow-sm text-slate-900 placeholder:text-slate-400" />
                      </div>
                      <select value={filterCityModal} onChange={(e)=>setFilterCityModal(e.target.value)} className="bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:border-teal-500 outline-none w-full md:w-36 text-slate-700 shadow-sm font-medium">
                         <option value="">All Cities</option>
                         {uniqueCities.map((city:any, i) => <option key={i} value={city}>{city}</option>)}
                      </select>
                      <select value={filterQualModal} onChange={(e)=>setFilterQualModal(e.target.value)} className="bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:border-teal-500 outline-none w-full md:w-48 text-slate-700 shadow-sm font-medium">
                         <option value="">All Degrees</option>
                         {uniqueQuals.map((q:any, i) => <option key={i} value={q}>{q}</option>)}
                      </select>
                   </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-3 custom-scrollbar bg-slate-50/50">
                   {filteredStudentsForModal.map((s) => {
                      const isSelected = assignedStudentIds.includes(s.id);
                      const isExpanded = expandedStudentId === s.id;
                      const score = s.meta?.totalScore || 0;
                      const warnings = s.meta?.warningsCount || 0;
                      const isDisqualified = s.examAccess === 'disqualified';
                      return (
                        <div key={s.id} className={`border rounded-2xl transition-all duration-200 shadow-sm bg-white ${isSelected ? 'border-[#0f947e] shadow-teal-500/10' : isDisqualified ? 'border-red-200 opacity-70 bg-red-50/50' : 'border-slate-200 hover:border-teal-300'}`}>
                           <div className="flex items-center p-5 gap-5 cursor-pointer" onClick={(e) => { if((e.target as HTMLElement).closest('button')) return; toggleAssignment(s.id); }}>
                              <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'bg-[#0f947e] border-[#0f947e]' : 'border-slate-300 hover:border-[#0f947e]'}`}>
                                 {isSelected && <CheckCircle size={16} className="text-white"/>}
                              </div>
                              <div className="flex-1">
                                 <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-extrabold text-lg flex items-center gap-2 text-slate-900">
                                      {s.fullName}
                                      {isDisqualified && <span className="text-[10px] bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Disqualified</span>}
                                      {s.professionalDetails && <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{s.professionalDetails}</span>}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      {!isDisqualified && warnings > 0 && (
                                         <span title={`${warnings} Warnings during test`} className="flex items-center gap-1 text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-lg border border-amber-200 font-bold">
                                          <AlertTriangle size={12}/> {warnings}
                                         </span>
                                      )}
                                      <span className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${isDisqualified ? 'bg-red-50 text-red-600 border-red-200' : score >= 15 ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                        Score: {score}
                                      </span>
                                    </div>
                                 </div>
                                 <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                    <span className="flex items-center gap-1"><MapPin size={12}/> {s.city || "Remote"}</span> | 
                                    <span className="flex items-center gap-1"><GraduationCap size={12}/> {s.qualification || "N/A"}</span> |
                                    <span>{s.skills?.slice(0, 3).join(", ")}...</span>
                                 </p>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); toggleBio(s.id); }} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors shrink-0">
                                {isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                              </button>
                           </div>

                           {isExpanded && (
                             <div className="px-5 pb-5 pt-0 border-t border-slate-100 mt-2">
                                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                      <p className="text-slate-500 font-bold flex items-center gap-2 mb-1"><GraduationCap size={14}/> Qualification</p>
                                      <p className="text-slate-900 font-bold">{s.qualification || "N/A"}</p>
                                   </div>
                                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                      <p className="text-slate-500 font-bold flex items-center gap-2 mb-1"><Briefcase size={14}/> Experience</p>
                                      <p className="text-slate-900 font-bold">{s.experience || "Fresher"}</p>
                                   </div>
                                   <Button variant="secondary" onClick={(e) => { e.stopPropagation(); setViewingStudent(s); setShowAccessModal(false); }} className="col-span-2 mt-2 py-3 text-sm">
                                     <ExternalLink size={16}/> Open Full Detailed Report
                                   </Button>
                                </div>
                             </div>
                           )}
                        </div>
                      );
                   })}
                   {filteredStudentsForModal.length === 0 && <div className="text-center py-10 text-slate-500 font-medium">No candidates found for these filters.</div>}
                </div>

                <div className="p-5 border-t border-slate-200 bg-white rounded-b-[2rem] flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-20">
                   <p className="text-sm text-slate-500 font-medium"><span className="text-slate-900 font-black">{assignedStudentIds.length}</span> candidates selected</p>
                   <Button variant="primary" onClick={() => setShowAccessModal(false)}>Done Assigning</Button>
                </div>
             </div>
          </div>
        )}

      {/* 📱 PREMIUM MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-t border-slate-200/50 pb-[env(safe-area-inset-bottom)] z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="flex justify-evenly items-center px-1 py-2">
          <div onClick={() => setActiveTab("requests")} className={`flex flex-col items-center gap-1 p-2 w-16 cursor-pointer ${activeTab === 'requests' ? 'text-[#0f947e]' : 'text-slate-400 hover:text-slate-900'}`}>
            <div className={`relative p-2 rounded-2xl ${activeTab === 'requests' ? 'bg-teal-50' : 'hover:bg-slate-50'}`}>
               <Bell size={20} />
               {totalAlerts > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>}
            </div>
            <span className="text-[10px] font-bold mt-0.5 truncate">Alerts</span>
          </div>
          
          <div onClick={() => setActiveTab("students")} className={`flex flex-col items-center gap-1 p-2 w-16 cursor-pointer ${activeTab === 'students' ? 'text-[#0f947e]' : 'text-slate-400 hover:text-slate-900'}`}>
            <div className={`p-2 rounded-2xl ${activeTab === 'students' ? 'bg-teal-50' : 'hover:bg-slate-50'}`}><Users size={20} /></div>
            <span className="text-[10px] font-bold mt-0.5 truncate">Talent</span>
          </div>

          <div onClick={() => setActiveTab("companies")} className={`flex flex-col items-center gap-1 p-2 w-16 cursor-pointer ${activeTab === 'companies' ? 'text-[#0f947e]' : 'text-slate-400 hover:text-slate-900'}`}>
            <div className={`p-2 rounded-2xl ${activeTab === 'companies' ? 'bg-teal-50' : 'hover:bg-slate-50'}`}><Building2 size={20} /></div>
            <span className="text-[10px] font-bold mt-0.5 truncate">Firms</span>
          </div>

          <div onClick={async () => { await supabase.auth.signOut(); router.push("/"); }} className="flex flex-col items-center gap-1 p-2 w-16 cursor-pointer text-slate-400 hover:text-red-500">
            <div className="p-2 rounded-2xl hover:bg-red-50"><LogOut size={20} /></div>
            <span className="text-[10px] font-bold mt-0.5 truncate">Exit</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}