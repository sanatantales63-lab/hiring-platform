"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Users, Building2, CreditCard, LogOut, Upload, Bell, 
  UserPlus, X, ChevronDown, ChevronUp, MapPin, Briefcase, GraduationCap, CheckCircle, Search, AlertTriangle, ShieldAlert, ExternalLink
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  
  // 🔥 THE MASTER LOCK 🔥
  const ADMIN_EMAIL = "karushhofficial@gmail.com"; 

  const [activeTab, setActiveTab] = useState("requests"); 
  const [students, setStudents] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [examRequests, setExamRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MODAL STATES
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [assignedStudentIds, setAssignedStudentIds] = useState<string[]>([]);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // FILTER STATES
  const [modalSearch, setModalSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterQual, setFilterQual] = useState("");

  useEffect(() => {
    const fetchSessionAndData = async () => {
      // 1. CHOWKIDAAR (Security Guard) - Sabse pehle ID card check karo
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) { 
        router.push("/admin/login"); 
        return; 
      }

      // 2. THE STRICT LOCK
      if (session.user.email !== ADMIN_EMAIL) {
        alert("ACCESS DENIED: You are not the Owner!");
        await supabase.auth.signOut();
        router.push("/");
        return;
      }

      // 3. Agar owner hai, tabhi data fetch karo
      try {
        const { data: allStudents } = await supabase.from("profiles").select("*");
    
        if (allStudents) {
          setStudents(allStudents);
          setExamRequests(allStudents.filter((s: any) => s.examAccess === "pending"));
        }
        const { data: allCompanies } = await supabase.from("companies").select("*");
        if (allCompanies) setCompanies(allCompanies);
      } catch (e) { 
        console.error("Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndData();
  }, [activeTab, router]);

  const openAccessModal = (company: any) => {
    setSelectedCompany(company);
    setAssignedStudentIds(company.allowedStudents || []);
    setShowAccessModal(true);
    setModalSearch(""); setFilterCity(""); setFilterQual("");
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

  const filteredStudentsForModal = students.filter(s => {
    const matchSearch = s.fullName?.toLowerCase().includes(modalSearch.toLowerCase()) || s.skills?.some((sk: string) => sk.toLowerCase().includes(modalSearch.toLowerCase()));
    const matchCity = filterCity ? s.city?.toLowerCase() === filterCity.toLowerCase() : true;
    const matchQual = filterQual ? s.qualification?.includes(filterQual) : true;
    return matchSearch && matchCity && matchQual;
  });

  const uniqueCities = Array.from(new Set(students.map(s => s.city).filter(Boolean)));
  const uniqueQuals = Array.from(new Set(students.map(s => s.qualification).filter(Boolean)));

  const grantExamAccess = async (id: string) => { 
    try {
      const { error } = await supabase.from("profiles").update({ examAccess: "granted" }).eq("id", id);
      if (error) throw error;
      setExamRequests(prev => prev.filter(r => r.id !== id)); 
      alert("Permission Granted for Re-Test!");
    } catch (error) { alert("Failed to grant access."); }
  };

  const toggleCompanyStatus = async (id: string, status: string) => {
    const newStatus = status === "pending" ? "approved" : "pending";
    try {
      const { error } = await supabase.from("companies").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setCompanies(prev => prev.map(c => c.id === id ? {...c, status: newStatus} : c));
    } catch (error) { alert("Error updating status"); }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center font-bold text-xl tracking-widest animate-pulse">VERIFYING ADMIN...</div>;

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col fixed h-full z-10">
        <h2 className="text-2xl font-bold text-red-500 mb-10">Owner Panel</h2>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab("requests")} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${activeTab === 'requests' ? 'bg-red-600 shadow-lg shadow-red-900/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <div className="flex items-center gap-3"><Bell size={20} /> Requests</div>
            {examRequests.length > 0 && <span className="bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse">{examRequests.length}</span>}
          </button>
          <button onClick={() => setActiveTab("companies")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'companies' ? 'bg-red-600 shadow-lg shadow-red-900/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}><Building2 size={20} /> Companies</button>
          <button onClick={() => setActiveTab("students")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'students' ? 'bg-red-600 shadow-lg shadow-red-900/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}><Users size={20} /> Candidates</button>
          <button onClick={() => setActiveTab("billing")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'billing' ? 'bg-red-600 shadow-lg shadow-red-900/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}><CreditCard size={20} /> Billing</button>
          <div className="pt-4 mt-4 border-t border-slate-800">
            <button onClick={() => router.push('/admin/upload-questions')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-400 hover:bg-blue-600/20 transition-all"><Upload size={20} /> Upload Questions</button>
          </div>
        </nav>
        <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }} className="flex items-center gap-2 text-slate-400 mt-auto hover:text-white"><LogOut size={18} /> Exit</button>
      </aside>

      <main className="flex-1 p-8 ml-64 overflow-y-auto min-h-screen">
        
        {activeTab === "companies" && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Registered Companies</h2>
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

        {showAccessModal && selectedCompany && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
             <div className="bg-[#0f172a] border border-slate-700 w-full max-w-3xl rounded-3xl max-h-[90vh] flex flex-col shadow-2xl">
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
                         <Search className="absolute left-3 top-2.5 text-slate-500" size={18}/>
                         <input type="text" placeholder="Search by name or skill..." value={modalSearch} onChange={(e) => setModalSearch(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-blue-500 outline-none transition-colors" />
                      </div>
                      <select value={filterCity} onChange={(e)=>setFilterCity(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-sm focus:border-blue-500 outline-none w-full md:w-36 text-slate-300">
                         <option value="">All Cities</option>
                         {uniqueCities.map((city:any, i) => <option key={i} value={city}>{city}</option>)}
                      </select>
                      <select value={filterQual} onChange={(e)=>setFilterQual(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-sm focus:border-blue-500 outline-none w-full md:w-40 text-slate-300">
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
                        <div key={s.id} className={`border rounded-xl transition-all duration-200 ${isSelected ? 'bg-blue-900/20 border-blue-500/50' : isDisqualified ? 'bg-red-950/20 border-red-900/30 opacity-70' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}>
                           <div className="flex items-center p-4 gap-4 cursor-pointer" onClick={(e) => { if((e.target as HTMLElement).closest('button')) return; toggleAssignment(s.id); }}>
                              <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-600 hover:border-blue-500'}`}>
                                 {isSelected && <CheckCircle size={14} className="text-white"/>}
                              </div>
                              <div className="flex-1">
                                 <div className="flex justify-between items-center">
                                    <h4 className={`font-bold text-lg flex items-center gap-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                      {s.fullName}
                                      {isDisqualified && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Disqualified</span>}
                                      {s.professionalDetails && <span className="text-[10px] bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">{s.qualification}</span>}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                      {!isDisqualified && warnings > 0 && (
                                         <span title={`${warnings} Warnings during test`} className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-lg border border-yellow-500/20">
                                          <AlertTriangle size={12}/> {warnings}
                                         </span>
                                      )}
                                      <span className={`text-sm font-bold px-2 py-1 rounded-lg ${isDisqualified ? 'bg-red-500/20 text-red-400' : score >= 15 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        Score: {score}
                                      </span>
                                    </div>
                                 </div>
                                 <p className="text-xs text-slate-500 mt-1 truncate max-w-[300px] flex gap-2">
                                    <span><MapPin size={12} className="inline mr-1"/>{s.city || "Remote"}</span> | 
                                    <span>{s.skills?.slice(0, 3).join(", ")}...</span>
                                 </p>
                              </div>
                              <button onClick={() => toggleBio(s.id)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 transition-colors">
                                {isExpanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                              </button>
                           </div>

                           {isExpanded && (
                             <div className="px-4 pb-4 pt-0 border-t border-slate-800/50 mt-2">
                                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                   <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                                      <p className="text-slate-500 flex items-center gap-2 mb-1"><GraduationCap size={14}/> Qualification</p>
                                      <p className="text-white font-medium">{s.qualification || "N/A"}</p>
                                      {s.professionalDetails && <p className="text-xs text-yellow-400 font-bold mt-1">{s.professionalDetails}</p>}
                                   </div>
                                   <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                                      <p className="text-slate-500 flex items-center gap-2 mb-1"><Briefcase size={14}/> Experience</p>
                                      <p className="text-white font-medium">{s.experience || "Fresher"}</p>
                                   </div>
                                   <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/student/${s.id}`); }} className="col-span-2 mt-2 bg-slate-800 hover:bg-blue-600 hover:border-blue-500 border border-slate-700 text-slate-300 hover:text-white py-2.5 rounded-lg transition-all text-sm font-bold flex items-center justify-center gap-2">
                                     <ExternalLink size={16}/> View Full Detailed Report
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
                   <button onClick={() => setShowAccessModal(false)} className="bg-green-600 px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-900/20 transition-all">Done</button>
                </div>
             </div>
          </div>
        )}

        {/* 🔥 THE NEW RE-TEST APPROVAL SECTION 🔥 */}
        {activeTab === "requests" && (
           <div className="grid gap-4">
             <h2 className="text-3xl font-bold mb-2">Re-Test Requests</h2>
             <p className="text-slate-400 mb-8">Approve locked candidates to retake the final assessment.</p>
             {examRequests.map((s) => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-lg">
                   <div>
                      <h3 className="font-bold text-xl">{s.fullName}</h3>
                      <p className="text-slate-400 text-sm">{s.email}</p>
                   </div>
                   <button onClick={() => grantExamAccess(s.id)} className="bg-green-600 px-5 py-2 rounded-xl font-bold shadow-lg shadow-green-900/20 hover:bg-green-700 transition-all">Allow Re-Test</button>
                </div>
             ))}
             {examRequests.length === 0 && <div className="text-center p-12 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-500">No re-test requests pending right now.</div>}
           </div>
        )}

        {activeTab === "students" && (
           <div>
             <h2 className="text-3xl font-bold mb-2">All Candidates</h2>
             <p className="text-slate-400 mb-8">View and manage all registered talent.</p>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {students.map(s => {
                 const score = s.meta?.totalScore || 0;
                 const isDisqualified = s.examAccess === 'disqualified';
                 
                 return (
                   <div key={s.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <h3 className="text-xl font-bold flex items-center gap-2">
                           {s.fullName}
                           {isDisqualified && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Banned</span>}
                         </h3>
                         <p className="text-slate-400 text-sm flex items-center gap-1 mt-1"><MapPin size={14}/> {s.city || "Location not set"}</p>
                       </div>
                       <span className={`text-sm font-bold px-2 py-1 rounded-lg ${isDisqualified ? 'bg-red-500/20 text-red-400' : score >= 15 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          Score: {score}
                       </span>
                     </div>
                     
                     <div className="space-y-2 mb-4">
                       <p className="text-sm text-slate-300"><GraduationCap size={14} className="inline mr-2 text-purple-400"/>{s.qualification || "N/A"}</p>
                       {s.professionalDetails && <p className="text-xs text-yellow-400 font-bold ml-6 uppercase">{s.professionalDetails}</p>}
                       <p className="text-sm text-slate-300"><Briefcase size={14} className="inline mr-2 text-blue-400"/>{s.experience || "Fresher"}</p>
                     </div>

                     <div className="flex flex-wrap gap-2 mb-6 h-12 overflow-hidden">
                       {s.skills?.map((skill:string, idx:number) => (
                         <span key={idx} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700">{skill}</span>
                       ))}
                     </div>

                     <button onClick={() => router.push(`/admin/student/${s.id}`)} className="w-full bg-slate-800 hover:bg-blue-600 hover:text-white border border-slate-700 hover:border-blue-500 text-slate-300 py-2.5 rounded-xl transition-all text-sm font-bold flex items-center justify-center gap-2">
                         <ExternalLink size={16}/> View Full Profile
                     </button>
                   </div>
                 )
               })}
               {students.length === 0 && <div className="col-span-full text-center text-slate-500 py-10">No candidates registered yet.</div>}
             </div>
           </div>
        )}
      </main>
    </div>
  );
}