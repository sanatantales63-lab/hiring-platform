"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion } from "framer-motion";
import { 
  LayoutDashboard, UserCircle, LogOut, 
  ShieldCheck, CheckCircle, Clock, Lock, PlayCircle, Loader2, AlertTriangle, PartyPopper, ArrowRight
} from "lucide-react";
import DownloadReportButton from "@/app/components/DownloadReportButton";

// 🔥 Naye Master Components Import kar liye 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

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

  if (loading) return <div className="h-screen bg-transparent flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-transparent text-slate-900 flex font-sans relative">
      
      {/* 🚀 THE FULL-SCREEN BLUR GATEKEEPER 🚀 */}
      {!profileComplete && (
         <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full">
               <Card className="text-center p-10 shadow-2xl">
                 <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-teal-100">
                    <UserCircle size={48} className="text-teal-600" />
                 </div>
                 <h2 className="text-3xl font-extrabold mb-3 text-slate-900">Profile Incomplete 🚨</h2>
                 <p className="text-slate-500 mb-8 font-medium">You need to complete your profile with your skills, education, and experience to unlock the dashboard and assessments.</p>
                 
                 <Button variant="primary" onClick={() => router.push('/student/profile')} className="w-full text-lg">
                    Complete Profile Now <ArrowRight size={20}/>
                 </Button>
                 
                 <Button variant="ghost" onClick={handleLogout} className="mt-4 mx-auto text-sm">
                   Logout
                 </Button>
               </Card>
            </motion.div>
         </div>
      )}

      {/* PREMIUM GLASS SIDEBAR */}
      <aside className="w-64 bg-white/60 backdrop-blur-xl border-r border-slate-200/50 hidden md:flex flex-col p-6 fixed h-full z-10 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Talexo</h2>
        <nav className="space-y-4 flex-1">
          <div onClick={() => router.push('/student/dashboard')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer bg-[#0f947e] text-white shadow-md shadow-teal-500/20"><LayoutDashboard size={20}/> <span className="font-bold">Dashboard</span></div>
          <div onClick={() => router.push('/student/profile')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-500 hover:bg-white hover:text-slate-900 transition-all font-bold shadow-sm border border-transparent hover:border-slate-200"><UserCircle size={20}/> <span>My Profile</span></div>
        </nav>
        <Button variant="ghost" onClick={handleLogout} className="mt-auto justify-start px-4 text-slate-500 hover:text-red-500"><LogOut size={20} /> Logout</Button>
      </aside>

      {/* DASHBOARD CONTENT */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto ml-0 md:ml-64 relative z-10">
        
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 text-slate-900">Welcome, {user?.user_metadata?.name?.split(' ')[0] || "Candidate"}! 👋</h1>
            <p className="text-slate-500 font-medium">Manage your profile and assessment status.</p>
          </div>
          <Button variant="danger" onClick={handleLogout} className="md:hidden text-sm px-4 py-2">Logout</Button>
        </header>

        {profileData?.hired_status === 'hired' && (
           <Card className="mb-10 bg-emerald-50/80 border-emerald-200 flex items-center gap-4">
              <PartyPopper className="text-emerald-500" size={32}/>
              <div>
                 <h3 className="text-xl font-extrabold text-emerald-700">You are Hired!</h3>
                 <p className="text-emerald-600/80 text-sm font-medium">Your profile is now locked and hidden from other recruiters. Keep up the great work at <strong className="text-emerald-800">{profileData.hired_company_name}</strong>!</p>
              </div>
           </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Profile Status" value="Complete" sub="Ready for Jobs" color="text-emerald-600" />
          <StatCard title="Assessment Status" value={examStatus === "granted" || examStatus === "none" ? "Ready" : examStatus === "pending" ? "Pending Approval" : examStatus === "completed" ? "Completed" : "Disqualified"} sub={examStatus === "granted" || examStatus === "none" ? "Start Test Now" : "Action Required"} color="text-blue-600" />
          <StatCard title="Skill Score" value={lastScore !== null ? lastScore : "N/A"} sub="Latest Result" color="text-purple-600" />
        </div>

        <h3 className="text-xl font-extrabold mb-6 text-slate-900">Your Actions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          
          <motion.div onClick={() => router.push('/student/profile')} whileHover={{ scale: 1.02 }} className="cursor-pointer h-full">
            <Card className="flex flex-col sm:flex-row items-start gap-5 h-full hover:border-emerald-300">
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-200"><CheckCircle className="text-emerald-600" size={28} /></div>
              <div>
                <h4 className="text-xl font-extrabold mb-1 text-emerald-900">Edit Profile</h4>
                <p className="text-slate-500 text-sm mb-4 font-medium leading-relaxed">Keep your skills and experience updated to match with the best companies.</p>
                <span className="text-emerald-600 text-sm font-bold flex items-center gap-1">Update Details <ArrowRight size={16}/></span>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="h-full">
            <Card className={`flex flex-col sm:flex-row items-start gap-5 h-full ${examStatus === "pending" ? "border-amber-200 bg-amber-50/50" : examStatus === "disqualified" ? "border-red-200 bg-red-50/50" : ""}`}>
              <div className={`p-3 rounded-xl border ${ (examStatus === "none" || examStatus === "granted") ? "bg-teal-50 border-teal-100" : examStatus === "pending" ? "bg-amber-100 border-amber-200" : examStatus === "disqualified" ? "bg-red-100 border-red-200" : "bg-slate-100 border-slate-200"}`}>
                {(examStatus === "none" || examStatus === "granted") ? <ShieldCheck className="text-teal-600" size={28} /> : examStatus === "pending" ? <Clock className="text-amber-600" size={28} /> : examStatus === "disqualified" ? <AlertTriangle className="text-red-500" size={28} /> : <Lock className="text-slate-500" size={28} />}
              </div>
              <div className="flex-1 w-full">
                <h4 className="text-xl font-extrabold mb-1 text-slate-900">Final Skill Assessment</h4>
                
                {(examStatus === "none" || !examStatus || examStatus === "granted") && (
                  <>
                    <p className="text-slate-500 text-sm mb-5 font-medium leading-relaxed">You have 1 attempt available. Take the test securely to verify your profile.</p>
                    <Button variant="primary" onClick={() => router.push('/student/test')}>Start Assessment <ArrowRight size={16}/></Button>
                  </>
                )}
                
                {examStatus === "pending" && (
                  <>
                    <p className="text-amber-700 text-sm mb-5 font-medium">Re-test request sent to Admin. Waiting for approval.</p>
                    <Button variant="secondary" disabled className="w-full">Approval Pending...</Button>
                  </>
                )}
                
                {examStatus === "completed" && (
                  <>
                    <p className="text-green-600 text-sm mb-5 font-medium">Test Completed! Check profile for detailed analytics.</p>
                    <div className="flex flex-col gap-3">
                       <DownloadReportButton candidate={profileData} />
                       <Button variant="secondary" onClick={requestReTestAccess} className="w-full">Request Re-test</Button>
                    </div>
                  </>
                )}
                
                {examStatus === "disqualified" && (
                  <>
                    <p className="text-red-600 text-sm mb-5 font-medium">Test Locked. Terminated for Anti-Cheat violations.</p>
                    <Button variant="danger" onClick={requestReTestAccess} className="w-full">Request Re-test</Button>
                  </>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div onClick={() => router.push('/student/demo-test')} whileHover={{ scale: 1.02 }} className="cursor-pointer md:col-span-2">
            <Card className="flex flex-col sm:flex-row items-start gap-5 hover:border-blue-300">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100"><PlayCircle className="text-blue-500" size={28} /></div>
              <div>
                <h4 className="text-xl font-extrabold mb-1 text-slate-900">Try Practice Mode (Tutorial)</h4>
                <p className="text-slate-500 text-sm mb-5 font-medium leading-relaxed">Take a dummy test to understand the secure exam interface before taking the real one.</p>
                <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 shadow-blue-500/20">Start Demo <ArrowRight size={16}/></Button>
              </div>
            </Card>
          </motion.div>
        </div>

      </main>
    </div>
  );
}

function StatCard({ title, value, sub, color }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <h3 className="text-slate-500 text-sm font-bold mb-2">{title}</h3>
        <div className={`text-4xl font-black mb-1 ${color}`}>{value}</div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{sub}</p>
      </Card>
    </motion.div>
  );
}