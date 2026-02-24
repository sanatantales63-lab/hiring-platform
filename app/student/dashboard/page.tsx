"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion } from "framer-motion";
import { 
  LayoutDashboard, UserCircle, LogOut, 
  ShieldCheck, CheckCircle, Clock, Lock, PlayCircle, Loader2, AlertTriangle, PartyPopper
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [examStatus, setExamStatus] = useState("none"); 
  const [lastScore, setLastScore] = useState<number | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.replace("/student/login"); return; }
        setUser(session.user);

        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();

        if (data) {
          setProfileData(data);
          // Strict Profile Check
          if (data.fullName && data.phone && data.skills && data.skills.length > 0 && data.educations && data.experience) {
             setProfileComplete(true);
          }
          if (data.examAccess) setExamStatus(data.examAccess);
          else setExamStatus("none");
          if (data.meta?.totalScore !== undefined) setLastScore(data.meta.totalScore);
        }
      } catch (e) { console.log("Error fetching profile", e); } 
      finally { setLoading(false); }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => { await supabase.auth.signOut(); router.replace("/"); };

  const requestReTestAccess = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from("profiles").update({ examAccess: "pending" }).eq("id", user.id);
      if (error) throw error;
      setExamStatus("pending");
      alert("Re-test request sent to Admin! Please wait for approval.");
    } catch (e) { alert("Error sending request."); }
  };

  if (loading) return <div className="h-screen bg-[#0A0F1F] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex font-sans relative">
      
      {/* 🔥 THE FULL-SCREEN BLUR GATEKEEPER 🔥 */}
      {!profileComplete && (
         <div className="fixed inset-0 z-[100] bg-[#0A0F1F]/70 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-blue-500/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] text-center max-w-lg w-full">
               <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserCircle size={48} className="text-blue-400" />
               </div>
               <h2 className="text-3xl font-extrabold mb-3 text-white">Profile Incomplete 🚧</h2>
               <p className="text-slate-400 mb-8">You need to complete your profile with your skills, education, and experience to unlock the dashboard and assessments.</p>
               <button onClick={() => router.push('/student/profile')} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 transition-all text-lg flex items-center justify-center gap-2">
                  Complete Profile Now &rarr;
               </button>
               <button onClick={handleLogout} className="mt-6 text-slate-500 hover:text-red-400 text-sm font-bold transition-colors">
                 Logout
               </button>
            </motion.div>
         </div>
      )}

      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col p-6 fixed h-full z-10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-10">Talexo</h2>
        <nav className="space-y-4 flex-1">
          <div onClick={() => router.push('/student/dashboard')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer bg-blue-600 text-white shadow-lg shadow-blue-900/20"><LayoutDashboard size={20}/> <span className="font-medium">Dashboard</span></div>
          <div onClick={() => router.push('/student/profile')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-400 hover:bg-slate-800 hover:text-white transition-all"><UserCircle size={20}/> <span className="font-medium">My Profile</span></div>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors mt-auto font-bold"><LogOut size={20} /> Logout</button>
      </aside>

      {/* DASHBOARD CONTENT (Will be blurred out if profile is not complete) */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto ml-0 md:ml-64">
        
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Welcome, {user?.user_metadata?.name?.split(' ')[0] || "Candidate"}! 👋</h1>
            <p className="text-slate-400">Manage your profile and assessment status.</p>
          </div>
          <button onClick={handleLogout} className="md:hidden text-red-400 text-sm font-bold">Logout</button>
        </header>

        {profileData?.hired_status === 'hired' && (
           <div className="mb-10 bg-green-900/30 border border-green-500/50 p-6 rounded-2xl flex items-center gap-4">
              <PartyPopper className="text-green-400" size={32}/>
              <div>
                 <h3 className="text-xl font-bold text-green-400">You are Hired!</h3>
                 <p className="text-green-200/70 text-sm">Your profile is now locked and hidden from other recruiters. Keep up the great work at {profileData.hired_company_name}!</p>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Profile Status" value="Complete" sub="Ready for Jobs" color="text-green-400" borderColor="border-green-500/30" />
          <StatCard title="Assessment Status" value={examStatus === "granted" || examStatus === "none" ? "Ready" : examStatus === "pending" ? "Pending Approval" : examStatus === "completed" ? "Completed" : "Disqualified"} sub={examStatus === "granted" || examStatus === "none" ? "Start Test Now" : "Action Required"} color="text-blue-400" borderColor="border-blue-500/30" />
          <StatCard title="Skill Score" value={lastScore !== null ? lastScore : "N/A"} sub="Latest Result" color="text-purple-400" borderColor="border-purple-500/30" />
        </div>

        <h3 className="text-xl font-bold mb-6">Your Actions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div onClick={() => router.push('/student/profile')} whileHover={{ scale: 1.02 }} className={`p-6 rounded-2xl flex items-start gap-4 cursor-pointer border transition-colors bg-green-900/20 border-green-500/50`}>
            <div className="p-3 rounded-lg bg-green-500/20"><CheckCircle className="text-green-500" size={24} /></div>
            <div>
              <h4 className="text-lg font-bold mb-1">Edit Profile</h4>
              <p className="text-slate-400 text-sm mb-4">Keep your skills and experience updated.</p>
              <span className="text-blue-400 text-sm font-bold">Update Details &rarr;</span>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className={`p-6 rounded-2xl flex items-start gap-4 border transition-colors ${ (examStatus === "none" || examStatus === "granted") ? "bg-purple-900/20 border-purple-500/50" : examStatus === "pending" ? "bg-yellow-900/10 border-yellow-500/30" : examStatus === "disqualified" ? "bg-red-900/10 border-red-500/30" : "bg-slate-900/50 border-slate-800"}`}>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              {(examStatus === "none" || examStatus === "granted") ? <ShieldCheck className="text-purple-500" size={24} /> : examStatus === "pending" ? <Clock className="text-yellow-500" size={24} /> : examStatus === "disqualified" ? <AlertTriangle className="text-red-500" size={24} /> : <Lock className="text-slate-500" size={24} />}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold mb-1">Final Skill Assessment</h4>
              {(examStatus === "none" || !examStatus || examStatus === "granted") && (
                <><p className="text-purple-300 text-sm mb-4">You have 1 attempt available. Take the test securely.</p><button onClick={() => router.push('/student/test')} className="bg-purple-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 shadow-lg shadow-purple-900/20 transition-all">Start Assessment &rarr;</button></>
              )}
              {examStatus === "pending" && (
                <><p className="text-yellow-400 text-sm mb-4">Re-test request sent to Admin. Waiting for approval.</p><button disabled className="bg-slate-800 text-slate-500 px-4 py-2 rounded-lg text-sm font-bold cursor-not-allowed border border-slate-700">Approval Pending...</button></>
              )}
               {examStatus === "completed" && (
                <><p className="text-green-400 text-sm mb-4">Test Completed! Check profile for detailed analytics.</p><button onClick={requestReTestAccess} className="bg-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-600 transition-all">Request Re-test</button></>
              )}
              {examStatus === "disqualified" && (
                <><p className="text-red-400 text-sm mb-4">Test Locked. Terminated for Anti-Cheat violations.</p><button onClick={requestReTestAccess} className="bg-red-900/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-bold border border-red-900/50 transition-colors">Request Re-test</button></>
              )}
            </div>
          </motion.div>

          <motion.div onClick={() => router.push('/student/demo-test')} whileHover={{ scale: 1.02 }} className="p-6 rounded-2xl flex items-start gap-4 cursor-pointer bg-slate-800/50 border border-slate-700 hover:border-blue-400 transition-colors md:col-span-2">
            <div className="p-3 bg-blue-500/20 rounded-lg"><PlayCircle className="text-blue-400" size={24} /></div>
            <div>
              <h4 className="text-lg font-bold mb-1 text-blue-300">Try Practice Mode (Tutorial)</h4>
              <p className="text-slate-400 text-sm mb-4">Take a dummy test to understand the secure exam interface before taking the real one.</p>
              <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all">Start Demo &rarr;</span>
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}

function StatCard({ title, value, sub, color, borderColor }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-slate-900/50 backdrop-blur-xl border ${borderColor} p-6 rounded-2xl shadow-lg`}>
      <h3 className="text-slate-400 text-sm font-bold mb-2">{title}</h3>
      <div className={`text-4xl font-extrabold mb-1 ${color}`}>{value}</div>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{sub}</p>
    </motion.div>
  );
}