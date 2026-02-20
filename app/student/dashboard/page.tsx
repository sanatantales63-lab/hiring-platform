"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion } from "framer-motion";
import { 
  LayoutDashboard, UserCircle, LogOut, 
  ShieldCheck, CheckCircle, Clock, Lock, PlayCircle, Loader2, AlertTriangle 
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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
          if (data.fullName && data.phone && data.skills && data.skills.length > 0) {
            setProfileComplete(true);
          }
          if (data.examAccess) setExamStatus(data.examAccess);
          else setExamStatus("none");

          if (data.meta?.totalScore !== undefined) setLastScore(data.meta.totalScore);
        }
      } catch (e) {
        console.log("Error fetching profile", e);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const requestReTestAccess = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from("profiles").update({ examAccess: "pending" }).eq("id", user.id);
      if (error) throw error;
      setExamStatus("pending");
      alert("Re-test request sent to Admin! Please wait for approval.");
    } catch (e) {
      alert("Error sending request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0A0F1F] text-white flex flex-col gap-4 items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-slate-400 animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex font-sans">
      <motion.aside initial={{ x: -100 }} animate={{ x: 0 }} className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col p-6 fixed h-full">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-10">Talexo</h2>
        <nav className="space-y-4 flex-1">
          <div onClick={() => router.push('/student/dashboard')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer bg-blue-600 text-white shadow-lg shadow-blue-900/20">
             <LayoutDashboard size={20}/> <span className="font-medium">Dashboard</span>
          </div>
          <div onClick={() => router.push('/student/profile')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
             <UserCircle size={20}/> <span className="font-medium">My Profile</span>
          </div>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors mt-auto"><LogOut size={20} /> Logout</button>
      </motion.aside>

      <main className="flex-1 p-8 overflow-y-auto ml-0 md:ml-64">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.name?.split(' ')[0] || "Candidate"}! 👋</h1>
            <p className="text-slate-400">Manage your profile and assessment status.</p>
          </div>
          <button onClick={handleLogout} className="md:hidden text-red-400 text-sm">Logout</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Profile Status" 
            value={profileComplete ? "Complete" : "Incomplete"} 
            sub={profileComplete ? "Ready for Jobs" : "Update Required"} 
            color={profileComplete ? "text-green-400" : "text-yellow-400"} 
            borderColor={profileComplete ? "border-green-500/30" : "border-yellow-500/30"} 
          />
          <StatCard 
            title="Assessment Status" 
            value={
              examStatus === "granted" || examStatus === "none" ? "Ready" : 
              examStatus === "pending" ? "Pending Approval" : 
              examStatus === "completed" ? "Completed" : "Disqualified"
            }
            sub={examStatus === "granted" || examStatus === "none" ? "Start Test Now" : "Action Required"} 
            color="text-blue-400" 
            borderColor="border-blue-500/30"
          />
          <StatCard 
            title="Skill Score" 
            value={lastScore !== null ? lastScore : "N/A"} 
            sub="Latest Result" 
            color="text-purple-400" 
            borderColor="border-purple-500/30"
          />
        </div>

        <h3 className="text-xl font-semibold mb-6">Your Actions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          
          <motion.div onClick={() => router.push('/student/profile')} whileHover={{ scale: 1.02 }} className={`p-6 rounded-2xl flex items-start gap-4 cursor-pointer border transition-colors ${profileComplete ? 'bg-green-900/20 border-green-500/50' : 'bg-slate-900/50 border-slate-800'}`}>
            <div className={`p-3 rounded-lg ${profileComplete ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
              {profileComplete ? <CheckCircle className="text-green-500" size={24} /> : <UserCircle className="text-blue-500" size={24} />}
            </div>
            <div>
              <h4 className="text-lg font-bold mb-1">{profileComplete ? "Edit Profile" : "Complete Profile"}</h4>
              <p className="text-slate-400 text-sm mb-4">Add your skills and experience to get hired.</p>
              <span className="text-blue-400 text-sm font-medium">{profileComplete ? "Update Details" : "Complete Now"} &rarr;</span>
            </div>
          </motion.div>

          {/* 🔥 THE SMART EXAM CARD 🔥 */}
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            className={`p-6 rounded-2xl flex items-start gap-4 border transition-colors ${
              (examStatus === "none" || examStatus === "granted") ? "bg-purple-900/20 border-purple-500/50" : 
              examStatus === "pending" ? "bg-yellow-900/10 border-yellow-500/30" :
              examStatus === "disqualified" ? "bg-red-900/10 border-red-500/30" :
              "bg-slate-900/50 border-slate-800"
            }`}
          >
            <div className="p-3 bg-purple-500/20 rounded-lg">
              {(examStatus === "none" || examStatus === "granted") ? <ShieldCheck className="text-purple-500" size={24} /> : 
               examStatus === "pending" ? <Clock className="text-yellow-500" size={24} /> : 
               examStatus === "disqualified" ? <AlertTriangle className="text-red-500" size={24} /> :
               <Lock className="text-slate-500" size={24} />}
            </div>
            
            <div className="flex-1">
              <h4 className="text-lg font-bold mb-1">Final Skill Assessment</h4>
              
              {/* Scenario 1: First time or Re-test Approved */}
              {(examStatus === "none" || !examStatus || examStatus === "granted") && (
                <>
                  <p className="text-purple-300 text-sm mb-4">You have 1 attempt available. Take the test securely.</p>
                  <button onClick={() => {
                      if (!profileComplete) return alert("Complete your profile first!");
                      router.push('/student/test');
                    }} 
                    className="bg-purple-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 shadow-lg shadow-purple-900/20 transition-all"
                  >
                    Start Assessment &rarr;
                  </button>
                </>
              )}

              {/* Scenario 2: Waiting for Owner's Approval */}
              {examStatus === "pending" && (
                <>
                  <p className="text-yellow-400 text-sm mb-4">Re-test request sent to Admin. Waiting for approval.</p>
                  <button disabled className="bg-slate-800 text-slate-500 px-4 py-2 rounded-lg text-sm font-bold cursor-not-allowed border border-slate-700">
                    Approval Pending...
                  </button>
                </>
              )}

               {/* Scenario 3: Test Already Taken Safely */}
               {examStatus === "completed" && (
                <>
                  <p className="text-green-400 text-sm mb-4">Test Completed! Check profile for detailed analytics.</p>
                  <button onClick={requestReTestAccess} className="bg-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-600 transition-all">
                    Request Re-test
                  </button>
                </>
              )}

              {/* Scenario 4: Disqualified for Cheating */}
              {examStatus === "disqualified" && (
                <>
                  <p className="text-red-400 text-sm mb-4">Test Locked. Terminated for Anti-Cheat violations.</p>
                  <button onClick={requestReTestAccess} className="bg-red-900/40 text-red-400 hover:bg-red-900/60 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-bold border border-red-900/50 transition-colors">
                      Request Re-test
                  </button>
                </>
              )}
            </div>
          </motion.div>

          <motion.div onClick={() => router.push('/student/demo-test')} whileHover={{ scale: 1.02 }} className="p-6 rounded-2xl flex items-start gap-4 cursor-pointer bg-slate-800/50 border border-slate-700 hover:border-blue-400 transition-colors md:col-span-2">
            <div className="p-3 bg-blue-500/20 rounded-lg"><PlayCircle className="text-blue-400" size={24} /></div>
            <div>
              <h4 className="text-lg font-bold mb-1 text-blue-300">Try Practice Mode (Tutorial)</h4>
              <p className="text-slate-400 text-sm mb-4">Take a dummy test to understand the secure exam interface.</p>
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
      <h3 className="text-slate-400 text-sm font-medium mb-2">{title}</h3>
      <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
      <p className="text-slate-500 text-xs">{sub}</p>
    </motion.div>
  );
}