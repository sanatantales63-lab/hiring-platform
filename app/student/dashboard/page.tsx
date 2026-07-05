"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion } from "framer-motion";
import { 
  LayoutDashboard, UserCircle, LogOut, 
  ShieldCheck, CheckCircle, Clock, Lock, PlayCircle, Loader2, AlertTriangle, PartyPopper, ArrowRight, Globe,
  IndianRupee, Receipt, Download, Send, FileText, X, CheckCircle2, Award, Sparkles, ChevronRight, UserCheck
} from "lucide-react";
import DownloadReportButton from "@/app/components/DownloadReportButton";

// Master UI Components
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

// STAT CARD COMPONENT
function StatCard({ title, value, sub, color, icon: Icon }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="h-full">
      <Card className="h-full overflow-hidden flex flex-col justify-between p-6 bg-white border border-[var(--border)] shadow-soft hover:border-[var(--primary)]/30 transition-all">
        <div className="flex items-center justify-between">
          <h3 className="text-[var(--muted-foreground)] text-xs font-bold uppercase tracking-wider truncate">{title}</h3>
          {Icon && (
            <div className="p-2 rounded-xl bg-[var(--surface)] text-[var(--primary)]">
              <Icon size={18} />
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className={`text-2xl lg:text-3xl font-black font-display truncate ${color}`} title={String(value)}>{value}</div>
          <p className="text-[var(--muted-foreground)] text-xs font-semibold mt-1 truncate">{sub}</p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  
  // HYDRATION FIX
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [examStatus, setExamStatus] = useState("none"); 
  const [lastScore, setLastScore] = useState<number | null>(null);

  // EARNINGS MODULE STATES
  const [activeView, setActiveView] = useState("overview"); // 'overview' | 'earnings'
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);
  
  // Extended Invoicing Engine Dynamic State Architecture Engine
  const [invoiceType, setInvoiceType] = useState<"fixed" | "days" | "monthly">("fixed");
  const [ratePerDay, setRatePerDay] = useState<number>(0);
  const [monthlyBaseRate, setMonthlyBaseRate] = useState<number>(0);
  const [monthsCount, setMonthsCount] = useState<number>(1);

  // Calendar date pickers and leaves calculation state hooks
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [leavesCount, setLeavesCount] = useState<number>(0);

  // Automatically calculate functional days dynamically based on inputs
  let numberOfDays = 0;
  if (startDate && endDate) {
     const start = new Date(startDate);
     const end = new Date(endDate);
     const diffTime = end.getTime() - start.getTime();
     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive day count
     numberOfDays = Math.max(0, diffDays - leavesCount);
  }

  // Real data state logs management template mapping configuration
  const [assignments, setAssignments] = useState<any[]>([]);
  
  const totalGross = assignments.reduce((acc, curr) => acc + curr.gross, 0);
  const totalTDS = totalGross * 0.10; // 10% TDS Fixed
  const totalNet = totalGross - totalTDS;

  useEffect(() => {
    if (!profileData) return;
    const tempAssignments = [];

    // Calculate real-time payout based on original student expectedSalary
    if (profileData.contract_payout_active && profileData.contract_payout_start) {
       const salaryStr = profileData.expectedSalary || "0";
       const cleanNumericSalary = parseInt(salaryStr.replace(/[^0-9]/g, ""), 10) || 0;

       if (cleanNumericSalary > 0) {
          const startDate = new Date(profileData.contract_payout_start);
          const currentDate = new Date();
          
          const totalDiffInTime = currentDate.getTime() - startDate.getTime();
          const computedDays = Math.max(0, Math.floor(totalDiffInTime / (1000 * 60 * 60 * 24)));

          const perDayRate = cleanNumericSalary / 30;
          const computedGross = Math.round(computedDays * perDayRate);

          if (computedGross > 0) {
             tempAssignments.push({
                id: `RM-CON-${profileData.id?.substring(0, 5).toUpperCase()}`,
                title: `Active Deployment Project — ${profileData.hired_company_name || "Corporate Client"}`,
                date: new Date(profileData.contract_payout_start).toLocaleDateString('en-IN'),
                gross: computedGross,
                status: "completed",
                invoiceSubmitted: false
             });
          }
       }
    }
    setAssignments(tempAssignments);
  }, [profileData]);

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

      // BREVO ALERT: Re-test Request
      try {
          await fetch('/api/send-admin-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  type: "retest",
                  candidateName: profileData?.fullName || "Candidate",
                  candidateEmail: user.email
              })
          });
      } catch (e) { console.error("Email alert failed", e); }

   } catch (e) { alert("Error sending request."); }
  };

  // INVOICE SUBMIT & DOWNLOAD LOGIC
  const handleGenerateAndSubmitInvoice = async (assignment: any) => {
      setIsSubmittingInvoice(true);
      try {
          await fetch('/api/send-admin-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  type: "invoice_submitted",
                  candidateName: profileData?.fullName || "Candidate",
                  candidateEmail: user?.email,
                  extraInfo: `Invoice generated for ${assignment.title}. Net Amount payable: ₹${(assignment.gross * 0.9).toLocaleString('en-IN')}`
              })
          });

          setAssignments(prev => prev.map(a => a.id === assignment.id ? { ...a, invoiceSubmitted: true } : a));
          alert("Invoice Submitted to Resource Mania Pvt Ltd successfully!");
          setSelectedAssignment(null);
      } catch (error) { alert("Failed to submit invoice."); } 
      finally { setIsSubmittingInvoice(false); }
  };

  const handleDownloadInvoice = () => window.print(); // Simple Native PDF Export Trick

  if (!isMounted || loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-[var(--primary)] mb-3" size={36} />
      <p className="text-xs font-semibold text-indigo-200">Loading Candidate Dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex font-sans relative">
      
      {/* FULL-SCREEN BLUR GATEKEEPER FOR INCOMPLETE PROFILE */}
      {!profileComplete && (
         <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full">
               <Card className="text-center p-8 sm:p-10 shadow-2xl rounded-3xl bg-white border border-[var(--border)]">
                 <div className="w-16 h-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[var(--primary)]/20 shadow-soft">
                    <UserCircle size={36} className="text-[var(--primary)]" />
                 </div>
                 <h2 className="text-2xl font-black font-display mb-2 text-[var(--foreground)]">Profile Incomplete</h2>
                 <p className="text-[var(--muted-foreground)] text-xs sm:text-sm mb-6 font-medium leading-relaxed">
                   Please complete your candidate profile (skills, education & experience) to unlock your assessment portal and dashboard.
                 </p>
                 
                 <Button variant="primary" onClick={() => router.push('/student/profile')} className="w-full py-3.5 text-sm font-bold shadow-primary rounded-xl">
                    Complete Profile Now <ArrowRight size={18}/>
                 </Button>
                 
                 <button onClick={handleLogout} className="mt-4 text-xs font-bold text-[var(--muted-foreground)] hover:text-rose-600 transition-colors">
                    Logout of account
                 </button>
               </Card>
            </motion.div>
         </div>
      )}

      {/* PREMIUM GLASS SIDEBAR */}
      <aside className="w-64 bg-white border-r border-[var(--border)] hidden md:flex flex-col p-6 fixed h-full z-20 shadow-soft print:hidden">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--primary)] text-white shadow-soft">
            <UserCheck className="h-4 w-4 stroke-[2.4]" />
          </span>
          <span className="font-display text-lg font-black tracking-tight text-[var(--foreground)]">
            Resource<span className="text-[var(--primary)]">mania</span>
          </span>
        </div>

        <nav className="space-y-1.5 flex-1">
          <div 
            onClick={() => setActiveView('overview')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-xs font-bold transition-all ${
              activeView === 'overview' 
                ? 'bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 shadow-soft' 
                : 'text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
            }`}
          >
            <LayoutDashboard size={18}/> <span>Dashboard</span>
          </div>

          <div 
            onClick={() => setActiveView('earnings')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-xs font-bold transition-all ${
              activeView === 'earnings' 
                ? 'bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 shadow-soft' 
                : 'text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
            }`}
          >
            <IndianRupee size={18}/> <span>Earnings & Invoices</span>
          </div>

          <div 
            onClick={() => router.push('/student/profile')} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-all"
          >
            <UserCircle size={18}/> <span>My Profile</span>
          </div>
        </nav>

        <button 
          onClick={handleLogout} 
          className="mt-auto flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold text-[var(--muted-foreground)] hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>


      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-5 md:p-10 pb-24 md:pb-12 overflow-y-auto ml-0 md:ml-64 relative z-10 print:m-0 print:p-0">
        
        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {activeView === 'overview' && (
          <div className="animate-in fade-in duration-300 print:hidden space-y-8">
            
            {/* Header Banner */}
            <header className="flex justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--primary)] bg-[var(--accent)] px-2.5 py-0.5 rounded-full border border-[var(--primary)]/20">
                  Candidate Dashboard
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-[var(--foreground)]">
                  Welcome back, {profileData?.fullName?.split(' ')[0] || "Candidate"}! 👋
                </h1>
                <p className="text-[var(--muted-foreground)] text-xs font-medium mt-1">
                  Manage your verified profile, take AI assessments, and track job placements.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                 <button onClick={handleLogout} className="md:hidden flex items-center justify-center p-2.5 bg-white text-[var(--muted-foreground)] rounded-xl hover:bg-rose-50 hover:text-rose-600 border border-[var(--border)]">
                   <LogOut size={18} />
                 </button>
                 <Button variant="danger" onClick={handleLogout} className="hidden md:flex text-xs font-bold px-4 py-2 shadow-soft rounded-xl">
                   Logout
                 </Button>
              </div>
            </header>

            {/* Hired Banner */}
            {profileData?.hired_status === 'hired' && (
               <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none shadow-elevated p-6 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
                    <PartyPopper className="text-white" size={32}/>
                  </div>
                  <div>
                     <h3 className="text-xl font-black font-display text-white">Congratulations! You are Hired!</h3>
                     <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1">
                       Your profile is officially active with <strong className="text-white underline">{profileData.hired_company_name}</strong>.
                     </p>
                  </div>
               </Card>
            )}

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
               <StatCard 
                 title="Profile Status" 
                 value="Complete" 
                 sub="100% Ready for Matching" 
                 color="text-emerald-600"
                 icon={CheckCircle2} 
               />
               <StatCard 
                 title="Assessment Status" 
                 value={examStatus === "granted" || examStatus === "none" ? "Ready" : examStatus === "pending" ? "Pending Approval" : examStatus === "completed" ? "Completed" : "Disqualified"} 
                 sub={examStatus === "granted" || examStatus === "none" ? "Start Test Available" : "Action Required"} 
                 color="text-[var(--primary)]"
                 icon={ShieldCheck} 
               />
               <StatCard 
                 title="AI Skill Score" 
                 value={lastScore !== null ? `${lastScore}%` : "N/A"} 
                 sub="Signed Test Result" 
                 color="text-indigo-600"
                 icon={Award} 
               />
            </div>

            {/* Actions Grid */}
            <div>
              <h3 className="text-lg font-black tracking-tight text-[var(--foreground)] mb-5">Your Quick Actions</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Action 1: Edit Profile */}
                <motion.div onClick={() => router.push('/student/profile')} whileHover={{ y: -2 }} className="cursor-pointer h-full">
                  <Card className="flex flex-col sm:flex-row items-start gap-4 p-6 h-full bg-white border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-elevated transition-all rounded-2xl">
                    <div className="p-3 rounded-xl bg-[var(--accent)] text-[var(--primary)] shrink-0">
                      <UserCircle size={26} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[var(--foreground)]">Edit Candidate Profile</h4>
                      <p className="text-[var(--muted-foreground)] text-xs mt-1 mb-4 font-normal leading-relaxed">
                        Keep your skills, salary expectations, and work experience up to date.
                      </p>
                      <span className="text-[var(--primary)] text-xs font-bold flex items-center gap-1">
                        Update Profile Details <ArrowRight size={14}/>
                      </span>
                    </div>
                  </Card>
                </motion.div>

                {/* Action 2: Final Skill Assessment */}
                <motion.div whileHover={{ y: -2 }} className="h-full">
                  <Card className={`flex flex-col sm:flex-row items-start gap-4 p-6 h-full bg-white border rounded-2xl ${
                    examStatus === "pending" ? "border-amber-300 bg-amber-50/40" : examStatus === "disqualified" ? "border-rose-300 bg-rose-50/40" : "border-[var(--border)] hover:border-[var(--primary)]/40"
                  }`}>
                    <div className={`p-3 rounded-xl shrink-0 ${
                      (examStatus === "none" || examStatus === "granted") ? "bg-[var(--accent)] text-[var(--primary)]" : examStatus === "pending" ? "bg-amber-100 text-amber-700" : examStatus === "disqualified" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      {(examStatus === "none" || examStatus === "granted") ? <ShieldCheck size={26} /> : examStatus === "pending" ? <Clock size={26} /> : examStatus === "disqualified" ? <AlertTriangle size={26} /> : <Lock size={26} />}
                    </div>

                    <div className="flex-1 w-full">
                      <h4 className="text-base font-bold text-[var(--foreground)]">AI Skill Assessment</h4>
                      
                      {(examStatus === "none" || !examStatus || examStatus === "granted") && (
                        <>
                          <p className="text-[var(--muted-foreground)] text-xs mt-1 mb-4 font-normal">
                            Proctored assessment available. 1 attempt remaining.
                          </p>
                          <Button variant="primary" onClick={() => router.push('/student/test')} className="w-full text-xs font-bold py-2.5 shadow-primary rounded-xl">
                            Start Assessment <ArrowRight size={14}/>
                          </Button>
                        </>
                      )}
                      
                      {examStatus === "pending" && (
                        <>
                          <p className="text-amber-800 text-xs mt-1 mb-4 font-medium">Re-test request sent. Waiting for Admin approval.</p>
                          <Button variant="secondary" disabled className="w-full text-xs font-bold py-2.5">Approval Pending...</Button>
                        </>
                      )}
                      
                      {examStatus === "completed" && (
                        <>
                          <p className="text-emerald-700 text-xs mt-1 mb-4 font-bold">Assessment Completed!</p>
                          <div className="flex flex-col gap-2.5">
                             <DownloadReportButton candidate={profileData} />
                             <Button variant="secondary" onClick={requestReTestAccess} className="w-full text-xs font-bold py-2">Request Re-test</Button>
                          </div>
                        </>
                      )}
                      
                      {examStatus === "disqualified" && (
                        <>
                          <p className="text-rose-700 text-xs mt-1 mb-4 font-medium">Locked for Anti-Cheat violation.</p>
                          <Button variant="danger" onClick={requestReTestAccess} className="w-full text-xs font-bold py-2.5">Request Re-test</Button>
                        </>
                      )}
                    </div>
                  </Card>
                </motion.div>

                {/* Action 3: Practice Demo Mode */}
                <motion.div onClick={() => router.push('/student/demo-test')} whileHover={{ y: -2 }} className="cursor-pointer md:col-span-2">
                  <Card className="flex flex-col sm:flex-row items-start gap-4 p-6 bg-white border border-[var(--border)] hover:border-[var(--primary)]/40 hover:shadow-elevated transition-all rounded-2xl">
                    <div className="p-3 bg-indigo-50 text-[var(--primary)] rounded-xl shrink-0">
                      <PlayCircle size={26} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[var(--foreground)]">Practice Mode (Tutorial Demo)</h4>
                      <p className="text-[var(--muted-foreground)] text-xs mt-1 mb-4 font-normal leading-relaxed">
                        Understand the proctored test environment before taking your official evaluation.
                      </p>
                      <Button variant="primary" className="text-xs font-bold py-2.5 px-5 shadow-primary rounded-xl">
                        Start Demo Tutorial <ArrowRight size={14}/>
                      </Button>
                    </div>
                  </Card>
                </motion.div>

              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: EARNINGS & INVOICE MODULE */}
        {activeView === 'earnings' && (
           <div className="animate-in fade-in duration-300 space-y-8">
              <header className="pb-6 border-b border-[var(--border)] print:hidden">
                 <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--primary)] bg-[var(--accent)] px-2.5 py-0.5 rounded-full border border-[var(--primary)]/20">
                   Contractor Payouts
                 </span>
                 <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight mt-2 flex items-center gap-2.5">
                   <IndianRupee className="text-[var(--primary)]" size={28}/> Earnings & Invoices
                 </h1>
                 <p className="text-[var(--muted-foreground)] text-xs font-medium mt-1">
                   Track freelance contract payouts, calculate TDS deductions, and generate PDF invoices.
                 </p>
              </header>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print:hidden">
                 <Card className="bg-white border border-[var(--border)] p-6 rounded-2xl shadow-soft">
                    <p className="text-[var(--muted-foreground)] font-bold text-[10px] uppercase tracking-wider mb-1">Gross Earnings</p>
                    <p className="text-2xl sm:text-3xl font-black text-[var(--foreground)] font-display">₹ {totalGross.toLocaleString('en-IN')}</p>
                 </Card>
                 <Card className="bg-rose-50/50 border border-rose-200 p-6 rounded-2xl shadow-soft">
                    <p className="text-rose-700 font-bold text-[10px] uppercase tracking-wider mb-1">TDS Deducted (10%)</p>
                    <p className="text-2xl sm:text-3xl font-black text-rose-700 font-display">- ₹ {totalTDS.toLocaleString('en-IN')}</p>
                 </Card>
                 <Card className="bg-emerald-50/60 border border-emerald-200 p-6 rounded-2xl shadow-soft">
                    <p className="text-emerald-800 font-bold text-[10px] uppercase tracking-wider mb-1">Net Payable Amount</p>
                    <p className="text-3xl sm:text-4xl font-black text-emerald-700 font-display">₹ {totalNet.toLocaleString('en-IN')}</p>
                 </Card>
              </div>

              {/* Assignment List */}
              <div className="print:hidden">
                 <h3 className="text-lg font-black text-[var(--foreground)] mb-4 flex items-center gap-2">
                   <Receipt size={18} className="text-[var(--primary)]"/> Assignment Payout Logs
                 </h3>
                 <div className="space-y-4">
                    {assignments.length === 0 && (
                       <div className="p-8 text-center bg-white border border-dashed rounded-2xl text-[var(--muted-foreground)] font-medium text-xs leading-relaxed">
                          ₹ 0 Active Accruals. Contract payouts will appear here automatically once activated by the employer or admin.
                       </div>
                    )}
                    {assignments.map(assign => (
                       <Card key={assign.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 border border-[var(--border)] bg-white rounded-2xl shadow-soft">
                          <div>
                             <h4 className="text-base font-bold text-[var(--foreground)]">{assign.title}</h4>
                             <p className="text-xs text-[var(--muted-foreground)] font-medium mt-1">
                               Assignment ID: <span className="font-mono text-[var(--foreground)] bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">{assign.id}</span> • Date: {assign.date}
                             </p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 shrink-0">
                             <div className="text-left sm:text-right border-l-2 border-[var(--primary)] pl-3 sm:border-l-0 sm:pl-0">
                                <p className="text-lg font-black text-[var(--foreground)] font-display">₹ {(assign.gross * 0.9).toLocaleString('en-IN')}</p>
                                <p className="text-[9px] text-[var(--muted-foreground)] font-bold uppercase tracking-wider mt-0.5">Net Payable</p>
                             </div>
                             {assign.invoiceSubmitted ? (
                                <span className="flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200">
                                   <CheckCircle size={15}/> Sent to Admin
                                </span>
                             ) : (
                                <Button variant="primary" onClick={() => setSelectedAssignment(assign)} className="px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 rounded-xl shadow-primary">
                                   <FileText size={15}/> Create Invoice
                                </Button>
                             )}
                          </div>
                       </Card>
                    ))}
                 </div>
              </div>

              {/* INVOICE MODAL & PRINT FORMAT */}
              {selectedAssignment && (() => {
                 let computedGross = selectedAssignment.gross;
                 let dynamicDescription = selectedAssignment.title;

                 if (invoiceType === "days") {
                    computedGross = numberOfDays * ratePerDay;
                    dynamicDescription = `${selectedAssignment.title} — Day-Rate Assignment (${numberOfDays} Days @ ₹${ratePerDay.toLocaleString('en-IN')}/day)`;
                 } else if (invoiceType === "monthly") {
                    computedGross = monthlyBaseRate * monthsCount;
                    dynamicDescription = `${selectedAssignment.title} — Retainer Service (${monthsCount} Month(s) @ ₹${monthlyBaseRate.toLocaleString('en-IN')}/month)`;
                 }

                 const computedTDS = computedGross * 0.10;
                 const computedNet = computedGross - computedTDS;

                 return (
                 <div className="fixed inset-0 z-[200] bg-slate-950/70 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4 md:p-8 print:static print:bg-white print:p-0">
                    <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative print:shadow-none print:w-full overflow-hidden">
                       
                       <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 print:hidden sticky top-0 z-10">
                          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2"><Receipt size={16}/> Invoice Generator</h3>
                          <button onClick={() => { setSelectedAssignment(null); setInvoiceType("fixed"); setStartDate(""); setEndDate(""); setLeavesCount(0); }} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors"><X size={18}/></button>
                       </div>

                       {/* BILLING CONTROLS */}
                       <div className="p-6 bg-slate-50/80 border-b border-slate-100 print:hidden grid grid-cols-1 md:grid-cols-3 gap-6 items-end relative z-20">
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Billing Framework</label>
                             <div className="flex gap-1 p-1 bg-white border rounded-xl shadow-sm">
                                {[
                                   { id: "fixed", label: "Fixed Flat" },
                                   { id: "days", label: "No. of Days" },
                                   { id: "monthly", label: "Monthly Base" }
                                ].map(btn => (
                                   <button 
                                      key={btn.id}
                                      type="button" 
                                      onClick={() => setInvoiceType(btn.id as any)} 
                                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${invoiceType === btn.id ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                                   >
                                      {btn.label}
                                   </button>
                                ))}
                             </div>
                          </div>

                          {invoiceType === "days" && (
                             <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="space-y-1">
                                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Start Date</label>
                                   <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-[11px] font-bold outline-none [color-scheme:light]" />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">End Date</label>
                                   <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-[11px] font-bold outline-none [color-scheme:light]" />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Leaves</label>
                                   <input type="number" min={0} value={leavesCount} onChange={(e) => setLeavesCount(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-[11px] font-bold outline-none" />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Day Rate (₹)</label>
                                   <input type="number" min={0} value={ratePerDay} onChange={(e) => setRatePerDay(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-[11px] font-bold outline-none" placeholder="Rate/day" />
                                </div>
                             </div>
                          )}

                          {invoiceType === "monthly" && (
                             <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Monthly Retainer (₹)</label>
                                   <input type="number" min={0} value={monthlyBaseRate} onChange={(e) => setMonthlyBaseRate(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-xs font-bold outline-none" placeholder="Per month" />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Months</label>
                                   <input type="number" min={1} value={monthsCount} onChange={(e) => setMonthsCount(Math.max(1, parseInt(e.target.value) || 0))} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-xs font-bold outline-none" />
                                </div>
                             </div>
                          )}

                          {invoiceType === "fixed" && (
                             <div className="md:col-span-2 p-3 bg-[var(--accent)] border border-[var(--primary)]/20 rounded-xl text-[11px] font-bold text-[var(--primary)] leading-normal">
                                Processing fixed contractual payout parameters mapped from target task logs.
                             </div>
                          )}
                       </div>

                       {/* INVOICE PAPER */}
                       <div className="p-8 md:p-12 text-slate-800 bg-white">
                          <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-end mb-10 border-b-2 border-[var(--border)] pb-8 gap-6">
                             <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 font-display">INVOICE</h1>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                                   <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Invoice No.</p>
                                   <p className="font-mono font-bold text-slate-800">RM-INV-{selectedAssignment.id}</p>
                                   <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Date Issued</p>
                                   <p className="font-bold text-slate-800">{new Date().toLocaleDateString()}</p>
                                </div>
                             </div>
                             <div className="text-left md:text-right">
                                <h2 className="text-2xl font-black text-[var(--primary)] font-display mb-1">Resource<span className="text-[var(--foreground)]">mania</span></h2>
                                <p className="text-xs font-bold text-slate-600">Resource Mania Private Ltd.</p>
                                <p className="text-xs font-medium text-slate-500">Corporate HQ, Kolkata, WB, India</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                             <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Bill To (Client)</p>
                                <h3 className="text-base font-bold text-slate-900">Resource Mania Private Ltd.</h3>
                                <p className="text-xs font-medium text-slate-600 mt-0.5">accounts@resourcemania.com</p>
                             </div>
                             <div className="bg-[var(--accent)] p-5 rounded-2xl border border-[var(--primary)]/20 text-left md:text-right">
                                <p className="text-[9px] font-bold text-[var(--primary)] uppercase tracking-widest mb-2">From (Contractor)</p>
                                <h3 className="text-base font-bold text-slate-900">{profileData?.fullName || "Candidate Name"}</h3>
                                <p className="text-xs font-medium text-slate-600 mt-0.5">{user?.email}</p>
                             </div>
                          </div>

                          <table className="w-full text-left border-collapse mb-10">
                             <thead>
                                <tr className="bg-[var(--primary)] text-white uppercase tracking-widest text-[9px] font-black">
                                   <th className="p-3.5 rounded-tl-xl">Description</th>
                                   <th className="p-3.5 text-right rounded-tr-xl">Gross Amount</th>
                                </tr>
                             </thead>
                             <tbody>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                   <td className="p-3.5 font-bold text-slate-800 text-sm">{dynamicDescription} <span className="block text-[11px] font-medium text-slate-500 font-mono">Ref ID: {selectedAssignment.id}</span></td>
                                   <td className="p-3.5 text-right font-black text-base">₹ {computedGross.toLocaleString('en-IN')}</td>
                                </tr>
                             </tbody>
                          </table>

                          <div className="flex justify-end w-full mb-10">
                             <div className="w-full md:w-3/5 space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                <div className="flex justify-between text-slate-600 font-bold text-xs">
                                   <span>Subtotal (Gross)</span>
                                   <span>₹ {computedGross.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-rose-700 font-bold text-xs border-b border-slate-200 pb-3">
                                   <span>TDS Deduction (10%)</span>
                                   <span>- ₹ {computedTDS.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                   <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Net Payable</span>
                                   <span className="text-2xl font-black text-emerald-600 font-display">₹ {computedNet.toLocaleString('en-IN')}</span>
                                </div>
                             </div>
                          </div>

                          <div className="border-t border-dashed border-slate-200 pt-6 text-center text-[11px] font-medium text-slate-400">
                             <p>Electronic invoice generated via Resourcemania Platform. No physical signature required.</p>
                          </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="p-5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3 print:hidden">
                          <Button variant="secondary" onClick={handleDownloadInvoice} className="flex items-center justify-center gap-2 bg-white text-xs font-bold py-2.5 w-full sm:w-auto">
                            <Download size={15}/> Download PDF Invoice
                          </Button>
                          <Button 
                             variant="primary" 
                             onClick={() => handleGenerateAndSubmitInvoice({ ...selectedAssignment, gross: computedGross, title: dynamicDescription })} 
                             disabled={isSubmittingInvoice} 
                             className="flex items-center justify-center gap-2 bg-[var(--primary)] text-white text-xs font-bold py-2.5 w-full sm:w-auto shadow-primary"
                          >
                             {isSubmittingInvoice ? <Loader2 className="animate-spin" size={15}/> : <Send size={15}/>} 
                             Submit to Resource Mania
                          </Button>
                       </div>

                    </div>
                 </div>
              );
              })()}
           </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[var(--border)] shadow-[0_-2px_12px_oklch(0.20_0.025_245/0.06)] pb-[env(safe-area-inset-bottom)] z-50 print:hidden">
        <div className="flex justify-evenly items-center px-2 py-2">
          <div onClick={() => setActiveView('overview')} className={`flex flex-col items-center gap-1 p-2 cursor-pointer w-20 ${activeView === 'overview' ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
            <div className={`p-2 rounded-xl ${activeView === 'overview' ? 'bg-[var(--accent)]' : ''}`}><LayoutDashboard size={20} /></div>
            <span className="text-[10px] font-bold mt-0.5">Overview</span>
          </div>
          <div onClick={() => setActiveView('earnings')} className={`flex flex-col items-center gap-1 p-2 cursor-pointer w-20 ${activeView === 'earnings' ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
            <div className={`p-2 rounded-xl ${activeView === 'earnings' ? 'bg-[var(--accent)]' : ''}`}><IndianRupee size={20} /></div>
            <span className="text-[10px] font-bold mt-0.5">Earnings</span>
          </div>
          <div onClick={() => router.push('/student/profile')} className="flex flex-col items-center gap-1 p-2 text-[var(--muted-foreground)] cursor-pointer w-20">
            <div className="p-2 rounded-xl"><UserCircle size={20} /></div>
            <span className="text-[10px] font-bold mt-0.5">Profile</span>
          </div>
        </div>
      </div>

    </div>
  );
}