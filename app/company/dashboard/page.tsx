"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, MapPin, IndianRupee, Briefcase, GraduationCap, 
  Lock, Loader2, LayoutDashboard, LogOut, Briefcase as BriefcaseIcon
} from "lucide-react";

export default function CompanyDashboard() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<string>("pending");

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/company/login"); return; }
      
      try {
        const { data: companyData } = await supabase.from("companies").select("*").eq("id", session.user.id).single();
        
        if (companyData) {
          setApprovalStatus(companyData.status);

          if (companyData.status === "approved") {
            const { data: allProfiles } = await supabase.from("profiles").select("*");
            
            if (allProfiles) {
               const allowedIDs = companyData.allowedStudents || [];
               const visibleCandidates = allProfiles.filter((student: any) => allowedIDs.includes(student.id));
               setCandidates(visibleCandidates);
            }
          }
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchDashboard();
  }, [router]);

  const filteredCandidates = candidates.filter(c => 
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/"); };

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
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-10">Recruiter Panel</h2>
        <nav className="space-y-4 flex-1">
          <div onClick={() => router.push('/company/dashboard')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer bg-purple-600 text-white shadow-lg"><LayoutDashboard size={20}/> <span className="font-medium">Dashboard</span></div>
          <div onClick={() => router.push('/company/profile')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-400 hover:bg-slate-800 hover:text-white transition-all"><BriefcaseIcon size={20}/> <span className="font-medium">My Requirements</span></div>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-400 mt-auto"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
             <h1 className="text-3xl font-bold">Assigned Talent Pool</h1>
             <p className="text-slate-400">Candidates selected specifically for your requirements.</p>
          </div>
        </header>

        <div className="relative max-w-2xl mb-12">
          <Search className="absolute left-4 top-4 text-slate-500" />
          <input type="text" placeholder="Search by Name, Skill..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-purple-500 outline-none"/>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => <CandidateCard key={candidate.id} data={candidate} />)}
        </div>

        {filteredCandidates.length === 0 && (
           <div className="text-center p-12 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="text-slate-500" size={32}/></div>
              <h3 className="text-xl font-bold text-slate-400">No Candidates Assigned</h3>
              <p className="text-slate-500">The Admin has not assigned any candidates to your dashboard yet.<br/>Please update your requirements.</p>
           </div>
        )}
      </main>
    </div>
  );
}

function CandidateCard({ data }: { data: any }) {
  const router = useRouter();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{data.fullName}</h3>
          <p className="text-slate-400 text-sm flex items-center gap-1 mt-1"><MapPin size={14} /> {data.city || "Remote"}</p>
        </div>
        <div className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/20">{data.experience}</div>
      </div>
      
      <div className="space-y-3 mb-6 bg-slate-900 p-3 rounded-lg border border-slate-800/50">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Lock size={14} className="text-yellow-500"/> Contact Info Locked
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {data.skills?.slice(0, 4).map((skill: string, index: number) => <span key={index} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">{skill}</span>)}
      </div>

      <button onClick={() => router.push(`/company/student/${data.id}`)} className="w-full py-3 rounded-lg bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 font-medium transition-all border border-slate-700 hover:border-purple-500">View Profile</button>
    </motion.div>
  );
}