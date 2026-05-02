"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, MapPin, Briefcase, GraduationCap, 
  Lock, Loader2, LayoutDashboard, LogOut, Briefcase as BriefcaseIcon, Star, AlertCircle, CheckCircle, Clock, UserPlus, Filter
} from "lucide-react";

// 🔥 Naye Master Components 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function CompanyDashboard() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 SEARCH & NEW FILTERS STATES 🔥
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterExp, setFilterExp] = useState("");
  const [filterLoc, setFilterLoc] = useState("");
  const [filterNotice, setFilterNotice] = useState("");

  const [approvalStatus, setApprovalStatus] = useState<string>("pending");
  const [activeTab, setActiveTab] = useState("assigned"); 

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStudent, setReviewStudent] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    let subscription: any;

    const fetchDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/company/login"); return; }
      
      try {
        const { data: companyData } = await supabase.from("companies").select("*").eq("id", session.user.id).single();
        
        if (companyData) {
          setApprovalStatus(companyData.status);
          setCompanyId(companyData.id);
          setCompanyName(companyData.name);

          if (companyData.status === "approved") {
            const { data: allProfiles } = await supabase.from("profiles").select("*");
            if (allProfiles) {
               const allowedIDs = companyData.allowedStudents || [];
               
               const visibleCandidates = allProfiles.filter((student: any) => {
                 if (student.hired_company_id === companyData.id) return true;
                 if (student.hired_status === 'hired') return false;
                 return allowedIDs.includes(student.id);
               });
               
               setCandidates(visibleCandidates);
            }
          }

          subscription = supabase
            .channel('company_status_updates')
            .on('postgres_changes', 
               { event: 'UPDATE', schema: 'public', table: 'companies', filter: `id=eq.${session.user.id}` }, 
               (payload: any) => {
                  console.log("Live Update Received!", payload.new.status);
                  setApprovalStatus(payload.new.status);
                  if (payload.new.status === "approved") {
                     fetchDashboard();
                  }
               }
            ).subscribe();
        }
      } catch (error) { 
        console.error(error);
      } finally { 
        setLoading(false); 
      }
    };
    
    fetchDashboard();

    return () => {
       if (subscription) supabase.removeChannel(subscription);
    };
  }, [router]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/"); };

  const shortlistCandidate = async (student: any) => {
    if(!confirm(`Shortlist ${student.fullName} for an interview? The Admin will be notified to arrange it.`)) return;
    try {
      const { error } = await supabase.from("profiles").update({ 
        hired_status: "shortlisted", 
        hired_company_id: companyId,
        hired_company_name: companyName
      }).eq("id", student.id);
      if (error) throw error;
      alert("Shortlisted! Admin has been notified.");
      setCandidates(candidates.map(c => c.id === student.id ? {...c, hired_status: "shortlisted", hired_company_id: companyId} : c));
    } catch (e) { alert("Error sending request."); }
  };

  const requestHire = async (student: any) => {
    if(!confirm(`Send official Hire request for ${student.fullName}? Admin will verify and finalize this offline.`)) return;
    try {
      const { error } = await supabase.from("profiles").update({ 
        hired_status: "hire_requested",
        hired_company_id: companyId,
        hired_company_name: companyName
      }).eq("id", student.id);
      if (error) throw error;
      alert("Hire Request sent to Admin!");
      setCandidates(candidates.map(c => c.id === student.id ? {...c, hired_status: "hire_requested", hired_company_id: companyId} : c));
    } catch (e) { alert("Error sending request."); }
  };

  const submitReview = async () => {
    if(rating === 0) return alert("Please select a star rating!");
    try {
      const { error } = await supabase.from("profiles").update({ 
        company_rating: rating,
        company_review: reviewText
      }).eq("id", reviewStudent.id);
      if (error) throw error;
      alert("Review submitted successfully!");
      setCandidates(candidates.map(c => c.id === reviewStudent.id ? {...c, company_rating: rating, company_review: reviewText} : c));
      setShowReviewModal(false);
      setRating(0); setReviewText("");
    } catch (e) { alert("Error submitting review."); }
  };

  // 🔥 DYNAMIC FILTER OPTIONS MAKER 🔥
  const uniqueLocations = Array.from(new Set(candidates.map(c => c.city).filter(Boolean)));
  const uniqueExp = Array.from(new Set(candidates.map(c => c.experience).filter(Boolean)));
  const uniqueNotice = Array.from(new Set(candidates.map(c => c.noticePeriod).filter(Boolean)));

  // 🔥 APPLY ALL FILTERS 🔥
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || c.skills?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesType = true;
    if (filterType === "Permanent") matchesType = c.jobType === "Permanent Role";
    if (filterType === "Contract") matchesType = c.jobType !== "Permanent Role" || c.openToContractRoles === true;

    const matchesExp = filterExp ? c.experience === filterExp : true;
    const matchesLoc = filterLoc ? c.city === filterLoc : true;
    const matchesNotice = filterNotice ? c.noticePeriod === filterNotice : true;

    return matchesSearch && matchesType && matchesExp && matchesLoc && matchesNotice;
  });

  const assignedList = filteredCandidates.filter(c => c.hired_status !== "hired" && c.hired_status !== "shortlisted" && c.hired_status !== "hire_requested");
  const hiredList = filteredCandidates.filter(c => c.hired_company_id === companyId && (c.hired_status === "hired" || c.hired_status === "shortlisted" || c.hired_status === "hire_requested"));

  const pendingReviews = hiredList.filter(c => {
     if(c.hired_status !== "hired" || c.company_rating) return false;
     if(!c.hire_date) return false;
     const daysSinceHire = Math.floor((new Date().getTime() - new Date(c.hire_date).getTime()) / (1000 * 60 * 60 * 24));
     const requiredDays = c.jobType === '3-Month Contract' ? 90 : 60; 
     return daysSinceHire >= requiredDays; 
  });

  if (loading) return <div className="h-screen bg-transparent flex items-center justify-center relative z-10"><Loader2 className="animate-spin text-[#0f947e] w-12 h-12" /></div>;

  if (approvalStatus !== "approved") {
    return (
      <div className="min-h-screen bg-transparent text-slate-900 flex flex-col items-center justify-center text-center p-6 relative z-10">
        <Card className="max-w-lg w-full flex flex-col items-center p-12 shadow-2xl">
          <div className="w-24 h-24 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
             <Lock className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="text-3xl font-extrabold mb-4 text-slate-900">Account Pending Approval</h1>
          <p className="text-slate-500 font-medium mb-8">Please wait for the Resourcemania admin team to verify and approve your company account.</p>
          <Button variant="secondary" onClick={handleLogout} className="w-full">Logout</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900 flex relative z-10">
      
      {/* PREMIUM GLASS SIDEBAR */}
      <aside className="w-64 bg-white/60 backdrop-blur-xl border-r border-slate-200/50 hidden md:flex flex-col p-6 fixed h-full z-10 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Recruiter Panel</h2>
        <nav className="space-y-3 flex-1">
          <div onClick={() => setActiveTab('assigned')} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all font-bold ${activeTab === 'assigned' ? 'bg-[#0f947e] text-white shadow-md' : 'hover:bg-white text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200'}`}>
             <LayoutDashboard size={20}/> <span>Talent Pool</span>
          </div>
          <div onClick={() => setActiveTab('hired')} className={`flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all font-bold ${activeTab === 'hired' ? 'bg-[#0f947e] text-white shadow-md' : 'hover:bg-white text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200'}`}>
             <div className="flex items-center gap-3"><BriefcaseIcon size={20}/> <span>My Pipeline</span></div>
             {pendingReviews.length > 0 && <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-0.5 rounded-lg animate-pulse">{pendingReviews.length}</span>}
          </div>
          <div className="pt-6 mt-6 border-t border-slate-200/50">
             <div onClick={() => router.push('/company/profile')} className="flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer bg-slate-50 text-slate-600 hover:bg-white hover:text-slate-900 transition-all border border-slate-200 shadow-sm font-bold">
                <BriefcaseIcon size={20}/> <span>My Requirements</span>
             </div>
          </div>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-500 hover:text-red-500 mt-auto font-bold px-4 py-3 transition-colors"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="flex-1 p-8 md:p-10 ml-0 md:ml-64 overflow-y-auto">
        
        {/* REVIEW ALERTS */}
        {pendingReviews.length > 0 && (
           <Card className="mb-8 bg-amber-50/80 border-amber-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="bg-amber-100 p-3 rounded-xl border border-amber-200"><AlertCircle className="text-amber-600" size={28}/></div>
                 <div>
                    <h3 className="text-xl font-extrabold text-amber-800">Action Required: Leave a Review!</h3>
                    <p className="text-amber-700/80 text-sm font-medium">You have candidates who completed their timeline. Please rate their performance.</p>
                 </div>
              </div>
              <Button variant="primary" onClick={() => setActiveTab('hired')} className="bg-amber-500 hover:bg-amber-600 text-white w-full sm:w-auto">Review Now</Button>
           </Card>
        )}

        <header className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{activeTab === 'assigned' ? 'Assigned Talent' : 'My Pipeline & Hires'}</h1>
             <p className="text-slate-500 mt-2 font-medium">{activeTab === 'assigned' ? 'Candidates verified by Resourcemania AI matching your needs.' : 'Manage your shortlisted candidates and team.'}</p>
          </div>
        </header>

       {/* 🔥 SMART FILTERS SECTION 🔥 */}
        <Card className="mb-10 p-6 md:p-8 border border-[var(--border)] bg-[var(--card)] shadow-soft">
           <div className="relative mb-5">
             <Search className="absolute left-4 top-4 text-[var(--muted-foreground)]" />
             <input type="text" placeholder="Search by Name, Skill (e.g. GST, Excel)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[var(--input)]/50 border border-[var(--border)] rounded-xl py-4 pl-12 pr-4 text-[var(--foreground)] focus:border-[var(--primary)] focus:bg-[var(--surface)] outline-none transition-all shadow-sm placeholder:text-[var(--muted-foreground)] font-medium"/>
           </div>
           
           <div className="flex items-center gap-2 mb-4 text-sm font-extrabold text-[var(--ink-soft)] uppercase tracking-wider">
              <Filter size={16}/> Advanced Filters
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <select value={filterType} onChange={(e)=>setFilterType(e.target.value)} className="bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm font-bold shadow-sm">
                 <option value="">Any Role Type</option>
                 <option value="Permanent">Permanent Roles</option>
                 <option value="Contract">Contract / Temp Roles</option>
              </select>

              <select value={filterExp} onChange={(e)=>setFilterExp(e.target.value)} className="bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm font-bold shadow-sm">
                 <option value="">Any Experience</option>
                 {uniqueExp.map((exp:any, i) => <option key={i} value={exp}>{exp}</option>)}
              </select>

              <select value={filterLoc} onChange={(e)=>setFilterLoc(e.target.value)} className="bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm font-bold shadow-sm">
                 <option value="">Any Location</option>
                 {uniqueLocations.map((loc:any, i) => <option key={i} value={loc}>{loc}</option>)}
              </select>

              <select value={filterNotice} onChange={(e)=>setFilterNotice(e.target.value)} className="bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] rounded-xl px-4 py-3 outline-none focus:border-[var(--primary)] text-sm font-bold shadow-sm">
                 <option value="">Notice Period</option>
                 {uniqueNotice.map((np:any, i) => <option key={i} value={np}>{np}</option>)}
              </select>
           </div>
        </Card>

        {/* CANDIDATES GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'assigned' ? assignedList : hiredList).map((candidate) => (
             <motion.div key={candidate.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full">
               <Card className="h-full flex flex-col group hover:border-teal-300 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="pr-2">
                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#0f947e] transition-colors truncate">{candidate.fullName}</h3>
                      <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5 mt-1"><MapPin size={14} className="text-blue-500" /> {candidate.city || "Remote"}</p>
                    </div>
                    <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-lg text-xs font-black border border-teal-200 shadow-sm shrink-0 whitespace-nowrap">{candidate.experience}</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6 h-[55px] overflow-hidden">
                    {candidate.skills?.map((skill: string, index: number) => (
                        <span key={index} className="px-2.5 py-1 bg-slate-50 rounded-md text-xs font-bold text-slate-600 border border-slate-200 shadow-sm truncate max-w-[120px]">{skill}</span>
                    ))}
                  </div>

                  {activeTab === 'assigned' && (
                    <div className="mt-auto flex gap-3">
                       <Button variant="secondary" onClick={() => router.push(`/company/student/${candidate.id}`)} className="flex-1 py-2.5 text-sm">Profile</Button>
                       <Button variant="primary" onClick={() => shortlistCandidate(candidate)} className="flex-1 py-2.5 text-sm shadow-teal-500/20">Shortlist</Button>
                    </div>
                  )}

                  {activeTab === 'hired' && (
                     <div className="mt-auto border-t border-slate-100 pt-4 space-y-3">
                        {candidate.hired_status === 'shortlisted' && (
                           <>
                              <p className="text-blue-600 text-sm font-extrabold flex items-center gap-2"><UserPlus size={16}/> Shortlisted for Interview</p>
                              <div className="flex gap-2">
                                 <Button variant="secondary" onClick={() => router.push(`/company/student/${candidate.id}`)} className="flex-1 py-2 text-sm">Profile</Button>
                                 <Button variant="primary" onClick={() => requestHire(candidate)} className="flex-1 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20">Request Hire</Button>
                              </div>
                           </>
                        )}

                        {candidate.hired_status === 'hire_requested' && (
                           <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl shadow-sm">
                              <p className="text-amber-700 text-sm font-extrabold flex items-center gap-2"><Clock size={16}/> Hire Request Sent</p>
                              <p className="text-xs font-medium text-amber-600/80 mt-1">Admin is verifying offline.</p>
                           </div>
                        )}
                        
                        {candidate.hired_status === 'hired' && !candidate.company_rating && (
                           <div className="space-y-3">
                              <p className="text-emerald-600 text-sm font-extrabold flex items-center gap-2"><CheckCircle size={16}/> Officially Hired</p>
                              {pendingReviews.find(c => c.id === candidate.id) ? (
                                 <Button variant="primary" onClick={() => {setReviewStudent(candidate); setShowReviewModal(true);}} className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"><Star size={16}/> Leave Review</Button>
                              ) : (
                                 <Button variant="secondary" disabled className="w-full py-2.5 text-xs"><Lock size={14}/> Review locked (Time pending)</Button>
                              )}
                           </div>
                        )}

                        {candidate.hired_status === 'hired' && candidate.company_rating && (
                           <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-inner">
                              <div className="flex text-amber-500 mb-1">
                                 {[1,2,3,4,5].map(star => <Star key={star} size={14} fill={star <= candidate.company_rating ? "currentColor" : "none"} className={star <= candidate.company_rating ? "text-amber-500" : "text-slate-300"}/>)}
                              </div>
                              <p className="text-xs text-slate-600 italic font-medium line-clamp-2">"{candidate.company_review}"</p>
                           </div>
                        )}
                     </div>
                  )}
               </Card>
             </motion.div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredCandidates.length === 0 && (
           <div className="text-center p-12 bg-white/60 backdrop-blur-md border border-slate-200 rounded-[2rem] mt-10 shadow-sm">
              <div className="bg-slate-50 border border-slate-200 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"><Search className="text-slate-400" size={32}/></div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">No candidates found</h3>
              <p className="text-slate-500 font-medium">Try clearing or changing your filters.</p>
              <Button variant="secondary" onClick={()=>{setSearchTerm(""); setFilterType(""); setFilterExp(""); setFilterLoc(""); setFilterNotice("");}} className="mt-6 mx-auto px-6">Clear All Filters</Button>
           </div>
        )}
      </main>

      {/* REVIEW MODAL */}
      {showReviewModal && reviewStudent && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 md:p-10 shadow-2xl">
               <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Rate {reviewStudent.fullName}</h3>
               <p className="text-slate-500 font-medium text-sm mb-6 leading-relaxed">Your honest review helps Resourcemania maintain quality. Positive reviews (3+ stars) will be shown on their profile.</p>
               
               <div className="flex justify-center gap-2 mb-6">
                  {[1,2,3,4,5].map(star => (
                     <Star key={star} size={40} onClick={() => setRating(star)} className={`cursor-pointer transition-all hover:scale-110 ${rating >= star ? 'text-amber-400 fill-amber-400 drop-shadow-md' : 'text-slate-200'}`} />
                  ))}
               </div>

               <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write a brief professional feedback (Optional but recommended)..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder:text-slate-400 focus:border-[#0f947e] focus:bg-white outline-none min-h-[120px] mb-6 shadow-sm font-medium"/>

               <div className="flex gap-4">
                  <Button variant="secondary" onClick={() => {setShowReviewModal(false); setRating(0);}} className="flex-1 py-3">Cancel</Button>
                  <Button variant="primary" onClick={submitReview} className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white">Submit Review</Button>
               </div>
            </Card>
         </div>
      )}
    </div>
  );
}