"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, MapPin, Briefcase, GraduationCap, 
  Lock, Loader2, LayoutDashboard, LogOut, Briefcase as BriefcaseIcon, Star, AlertCircle, CheckCircle, Clock, UserPlus
} from "lucide-react";

export default function CompanyDashboard() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<string>("pending");
  const [activeTab, setActiveTab] = useState("assigned"); 

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStudent, setReviewStudent] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    let subscription: any; // 🔥 Realtime connection save karne ke liye

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
               const visibleCandidates = allProfiles.filter((student: any) => 
                 allowedIDs.includes(student.id) || student.hired_company_id === companyData.id
               );
               setCandidates(visibleCandidates);
            }
          }

          // 🔥 THE REALTIME MAGIC (WALKIE-TALKIE) 🔥
          // Yeh background mein chupke se dekhta rahega ki Admin ne status change kiya ya nahi
          subscription = supabase
            .channel('company_status_updates')
            .on('postgres_changes', 
               { event: 'UPDATE', schema: 'public', table: 'companies', filter: `id=eq.${session.user.id}` }, 
               (payload: any) => {
                  console.log("Live Update Received!", payload.new.status);
                  setApprovalStatus(payload.new.status);
                  
                  // Agar live approve ho gaya, toh automatically bachho ki list mangwa lo
                  if (payload.new.status === "approved") {
                     fetchDashboard();
                  }
               }
            ).subscribe();
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    
    fetchDashboard();

    // 🔥 CLEANUP: Jab tab band ho, toh Realtime connection disconnect kar do
    return () => {
       if (subscription) {
          supabase.removeChannel(subscription);
       }
    };
  }, [router]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/"); };

  // 🔥 SHORTLIST ACTION 🔥
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

  // 🔥 HIRE REQUEST ACTION 🔥
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

  const filteredCandidates = candidates.filter(c => 
    (c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || c.skills?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const assignedList = filteredCandidates.filter(c => c.hired_status !== "hired" && c.hired_status !== "shortlisted" && c.hired_status !== "hire_requested");
  const hiredList = filteredCandidates.filter(c => c.hired_company_id === companyId && (c.hired_status === "hired" || c.hired_status === "shortlisted" || c.hired_status === "hire_requested"));

  // 🔥 SMART REVIEW TIMER LOGIC 🔥
  const pendingReviews = hiredList.filter(c => {
     if(c.hired_status !== "hired" || c.company_rating) return false;
     if(!c.hire_date) return false;
     const daysSinceHire = Math.floor((new Date().getTime() - new Date(c.hire_date).getTime()) / (1000 * 60 * 60 * 24));
     const requiredDays = c.jobType === '3-Month Contract' ? 90 : 60; // Dynamic check based on role type
     return daysSinceHire >= requiredDays; // change to 0 for instant testing
  });

  if (loading) return <div className="h-screen bg-[#0A0F1F] flex items-center justify-center"><Loader2 className="animate-spin text-purple-500 w-10 h-10" /></div>;

  if (approvalStatus !== "approved") {
    return (
      <div className="min-h-screen bg-[#0A0F1F] text-white flex flex-col items-center justify-center text-center p-6">
        <Lock className="w-16 h-16 text-yellow-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Account Pending Approval</h1>
        <p className="text-slate-400">Please wait for the owner to verify your company account.</p>
        <button onClick={handleLogout} className="mt-8 px-6 py-3 bg-slate-800 rounded-xl">Logout</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col p-6 fixed h-full z-10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-10">Recruiter Panel</h2>
        <nav className="space-y-4 flex-1">
          <div onClick={() => setActiveTab('assigned')} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab === 'assigned' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><LayoutDashboard size={20}/> <span className="font-medium">Talent Pool</span></div>
         
          <div onClick={() => setActiveTab('hired')} className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${activeTab === 'hired' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
             <div className="flex items-center gap-3"><BriefcaseIcon size={20}/> <span className="font-medium">My Pipeline</span></div>
             {pendingReviews.length > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">{pendingReviews.length}</span>}
          </div>
          <div onClick={() => router.push('/company/profile')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-400 hover:bg-slate-800 hover:text-white transition-all border border-slate-800 mt-4">
             <BriefcaseIcon size={20}/> <span className="font-medium">My Requirements</span>
          </div>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-400 mt-auto font-bold"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="flex-1 p-8 md:p-12 ml-64 overflow-y-auto">
        
        {pendingReviews.length > 0 && (
           <div className="mb-8 bg-red-950/40 border border-red-500/50 p-6 rounded-2xl flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-4">
                 <div className="bg-red-500/20 p-3 rounded-full"><AlertCircle className="text-red-500" size={28}/></div>
                 <div>
                    <h3 className="text-xl font-bold text-red-400">Action Required: Leave a Review!</h3>
                    <p className="text-red-200/70 text-sm">You have candidates who completed their timeline. Please rate their performance.</p>
                 </div>
              </div>
              <button onClick={() => setActiveTab('hired')} className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-colors">Review Now</button>
           </div>
        )}

        <header className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-4xl font-extrabold">{activeTab === 'assigned' ? 'Assigned Talent' : 'My Pipeline & Hires'}</h1>
             <p className="text-slate-400 mt-2">{activeTab === 'assigned' ? 'Candidates verified by Talexo AI matching your needs.' : 'Manage your shortlisted candidates and team.'}</p>
          </div>
        </header>

        <div className="relative max-w-2xl mb-12">
          <Search className="absolute left-4 top-4 text-slate-500" />
          <input type="text" placeholder="Search by Name, Skill..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-purple-500 outline-none"/>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'assigned' ? assignedList : hiredList).map((candidate) => (
             <motion.div key={candidate.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{candidate.fullName}</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-1 mt-1"><MapPin size={14} /> {candidate.city || "Remote"}</p>
                  </div>
                  <div className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/20">{candidate.experience}</div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6 h-[55px] overflow-hidden">
                  {candidate.skills?.map((skill: string, index: number) => <span key={index} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">{skill}</span>)}
                </div>

                {activeTab === 'assigned' && (
                  <div className="mt-auto flex gap-3">
                     <button onClick={() => router.push(`/company/student/${candidate.id}`)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700">View Profile</button>
                     <button onClick={() => shortlistCandidate(candidate)} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2">Shortlist</button>
                  </div>
                )}

                {activeTab === 'hired' && (
                   <div className="mt-auto border-t border-slate-800 pt-4 space-y-3">
                      
                      {/* STATUS: SHORTLISTED */}
                      {candidate.hired_status === 'shortlisted' && (
                         <>
                            <p className="text-blue-400 text-sm font-bold flex items-center gap-2"><UserPlus size={16}/> Shortlisted for Interview</p>
                            <div className="flex gap-2">
                               <button onClick={() => router.push(`/company/student/${candidate.id}`)} className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold border border-slate-700">Profile</button>
                               <button onClick={() => requestHire(candidate)} className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-900/20">Request Hire</button>
                            </div>
                         </>
                      )}

                      {/* STATUS: HIRE REQUESTED */}
                      {candidate.hired_status === 'hire_requested' && (
                         <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded-xl">
                            <p className="text-yellow-500 text-sm font-bold flex items-center gap-2"><Clock size={16}/> Hire Request Sent</p>
                            <p className="text-xs text-yellow-500/70 mt-1">Admin is verifying offline.</p>
                         </div>
                      )}
                      
                      {/* STATUS: HIRED (REVIEW SYSTEM) */}
                      {candidate.hired_status === 'hired' && !candidate.company_rating && (
                         <div className="space-y-3">
                            <p className="text-green-500 text-sm font-bold flex items-center gap-2"><CheckCircle size={16}/> Officially Hired</p>
                            {pendingReviews.find(c => c.id === candidate.id) ? (
                               <button onClick={() => {setReviewStudent(candidate); setShowReviewModal(true);}} className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"><Star size={18}/> Leave Review Now</button>
                            ) : (
                               <button disabled className="w-full py-2.5 bg-slate-800 text-slate-500 rounded-xl text-sm font-bold border border-slate-700 flex items-center justify-center gap-2"><Lock size={14}/> Review locked (Time pending)</button>
                            )}
                         </div>
                      )}

                      {candidate.hired_status === 'hired' && candidate.company_rating && (
                         <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                            <div className="flex text-yellow-500 mb-1">
                               {[1,2,3,4,5].map(star => <Star key={star} size={14} fill={star <= candidate.company_rating ? "currentColor" : "none"} className={star <= candidate.company_rating ? "text-yellow-500" : "text-slate-600"}/>)}
                            </div>
                            <p className="text-xs text-slate-400 italic line-clamp-2">"{candidate.company_review}"</p>
                         </div>
                      )}
                   </div>
                )}
             </motion.div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
           <div className="text-center p-12 bg-slate-900/50 border border-slate-800 rounded-2xl mt-10">
              <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="text-slate-500" size={32}/></div>
              <h3 className="text-xl font-bold text-slate-400">No candidates found</h3>
           </div>
        )}
      </main>

      {/* REVIEW MODAL */}
      {showReviewModal && reviewStudent && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-3xl p-8 shadow-2xl">
               <h3 className="text-2xl font-extrabold text-white mb-2">Rate {reviewStudent.fullName}</h3>
               <p className="text-slate-400 text-sm mb-6">Your honest review helps Talexo maintain quality. Positive reviews (3+ stars) will be shown on their profile.</p>
               
               <div className="flex justify-center gap-2 mb-6">
                  {[1,2,3,4,5].map(star => (
                     <Star key={star} size={40} onClick={() => setRating(star)} className={`cursor-pointer transition-all hover:scale-110 ${rating >= star ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-slate-600'}`} />
                  ))}
               </div>

               <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write a brief professional feedback (Optional but recommended)..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder:text-slate-500 focus:border-purple-500 outline-none min-h-[120px] mb-6"/>

               <div className="flex gap-4">
                  <button onClick={() => {setShowReviewModal(false); setRating(0);}} className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800">Cancel</button>
                  <button onClick={submitReview} className="flex-1 py-3 rounded-xl font-bold text-black bg-yellow-500 hover:bg-yellow-400 shadow-lg">Submit Review</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}