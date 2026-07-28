"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion } from "framer-motion";
import { 
  LayoutDashboard, UserCircle, LogOut, 
  ShieldCheck, CheckCircle, Clock, Lock, PlayCircle, Loader2, AlertTriangle, PartyPopper, ArrowRight, Globe,
  IndianRupee, Receipt, Download, Send, FileText, X
} from "lucide-react";
import DownloadReportButton from "@/app/components/DownloadReportButton";

// 🔥 Naye Master Components Import kar liye 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

// 🔥 STAT CARD COMPONENT MOVED TO TOP 🔥
function StatCard({ title, value, sub, color }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full">
      <Card className="h-full overflow-hidden flex flex-col justify-center">
        <h3 className="text-[var(--muted-foreground)] text-xs font-semibold uppercase tracking-wider mb-2 truncate">{title}</h3>
        <div className={`text-2xl lg:text-3xl font-bold mb-1 truncate ${color}`} title={String(value)}>{value}</div>
        <p className="text-[var(--muted-foreground)] text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">{sub}</p>
      </Card>
    </motion.div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  
  // 🔥 HYDRATION ERROR FIX 🔥
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [examStatus, setExamStatus] = useState("none"); 
  const [lastScore, setLastScore] = useState<number | null>(null);

  // 🔥 EARNINGS MODULE STATES 🔥
  const [activeView, setActiveView] = useState("overview"); // 'overview' ya 'earnings'
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);
  
  // 🔥 NEW: Extended Invoicing Engine Dynamic State Architecture Engine
  const [invoiceType, setInvoiceType] = useState<"fixed" | "days" | "monthly">("fixed");
  const [ratePerDay, setRatePerDay] = useState<number>(0);
  const [monthlyBaseRate, setMonthlyBaseRate] = useState<number>(0);
  const [monthsCount, setMonthsCount] = useState<number>(1);

  // 🔥 NEW: Calendar date pickers and leaves calculation state hooks
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
          
          // 🔥 FIX: Non-Technical (Operations) aur General Track ko bhi complete profile consider karega
          const hasSkills = (Array.isArray(data.skills) && data.skills.length > 0) || 
                            (Array.isArray(data.operationsSkills) && data.operationsSkills.length > 0) || 
                            !!data.selectsGeneralTrack;

          if (data.fullName && data.phone && hasSkills && data.educations && data.experience) {
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

      // 🚀 BREVO ALERT: Re-test Request
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

  // 🔥 INVOICE SUBMIT & DOWNLOAD LOGIC 🔥
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

if (!isMounted || loading) return <div className="h-screen bg-[var(--surface)] flex items-center justify-center"><Loader2 className="animate-spin text-[var(--primary)]" size={40} /></div>;
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--foreground)] flex font-sans relative">
      
      {/* 🚀 THE FULL-SCREEN BLUR GATEKEEPER 🚀 */}
      {!profileComplete && (
         <div className="fixed inset-0 z-[100] bg-[var(--foreground)]/30 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full">
               <Card className="text-center p-8 shadow-modal">
                 <div className="w-20 h-20 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--border)]">
                    <UserCircle size={40} className="text-[var(--primary)]" />
                 </div>
                 <h2 className="text-2xl font-bold mb-3 text-[var(--foreground)]">Profile Incomplete</h2>
                 <p className="text-[var(--muted-foreground)] mb-8 font-medium">You need to complete your profile with your skills, education, and experience to unlock the dashboard and assessments.</p>
                 
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
      <aside className="w-64 bg-white border-r border-[var(--border)] hidden md:flex flex-col p-5 fixed h-full z-10 shadow-soft print:hidden">
        <h2 className="font-display text-base font-bold text-[var(--foreground)] mb-8">Resource<span className="text-[var(--primary)]">mania</span></h2>
        <nav className="space-y-1 flex-1">
          <div onClick={() => setActiveView('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-semibold transition-all ${activeView === 'overview' ? 'bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20' : 'text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'}`}><LayoutDashboard size={20}/> <span>Dashboard</span></div>
          <div onClick={() => setActiveView('earnings')} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer font-semibold transition-all ${activeView === 'earnings' ? 'bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20' : 'text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'}`}><IndianRupee size={20}/> <span>Earnings & Invoices</span></div>
          <div onClick={() => router.push('/student/profile')} className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-all font-semibold"><UserCircle size={20}/> <span>My Profile</span></div>
        </nav>
        <Button variant="ghost" onClick={handleLogout} className="mt-auto justify-start px-4 text-[var(--muted-foreground)] hover:text-[#c53030] hover:bg-[oklch(0.98_0.015_15)]"><LogOut size={20} /> Logout</Button>
      </aside>

{/* DASHBOARD CONTENT */}
      <main className="flex-1 p-5 md:p-12 pb-24 md:pb-12 overflow-y-auto ml-0 md:ml-64 relative z-10 print:m-0 print:p-0">
        
        {/* VIEW 1: OLD DASHBOARD OVERVIEW */}
        {activeView === 'overview' && (
          <div className="animate-in fade-in duration-300 print:hidden">
            <header className="flex justify-between items-start md:items-center mb-8 md:mb-12 gap-2">
              <div className="pr-2 sm:pr-4 flex-1 overflow-hidden">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 text-[var(--foreground)] leading-tight truncate">Welcome, {profileData?.fullName?.split(' ')[0] || "Candidate"}! 👋</h1>
                <p className="text-[var(--muted-foreground)] text-xs sm:text-sm md:text-base truncate">Manage your profile and assessment status.</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                 <button onClick={handleLogout} className="md:hidden flex items-center justify-center p-3 bg-[var(--surface)] text-[var(--muted-foreground)] rounded-xl hover:bg-[oklch(0.98_0.015_15)] hover:text-[#c53030] transition-colors shadow-sm border border-[var(--border)]"><LogOut size={20} /></button>
                 <Button variant="danger" onClick={handleLogout} className="hidden md:flex text-sm px-4 py-2 shadow-sm">Logout</Button>
              </div>
            </header>

            {profileData?.hired_status === 'hired' && (
               <Card className="mb-10 bg-[var(--success-bg)] border-[var(--success)]/30 flex items-center gap-4">
                  <PartyPopper className="text-[var(--success)]" size={32}/>
                  <div>
                     <h3 className="text-xl font-bold text-[var(--success)]">You are Hired!</h3>
                     <p className="text-[var(--success)]/80 text-sm font-medium">Your profile is now locked. Keep up the great work at <strong className="text-[var(--success)]">{profileData.hired_company_name}</strong>!</p>
                  </div>
               </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
               <StatCard title="Profile Status" value="Complete" sub="Ready for Jobs" color="text-[var(--success)]" />
               <StatCard title="Assessment Status" value={examStatus === "granted" || examStatus === "none" ? "Ready" : examStatus === "pending" ? "Pending Approval" : examStatus === "completed" ? "Completed" : "Disqualified"} sub={examStatus === "granted" || examStatus === "none" ? "Start Test Now" : "Action Required"} color="text-[var(--info)]" />
               <StatCard title="Skill Score" value={lastScore !== null ? lastScore : "N/A"} sub="Latest Result" color="text-[oklch(0.55_0.18_290)]" />
            </div>

            <h3 className="text-xl font-bold mb-6 text-[var(--foreground)]">Your Actions</h3>
            <div className="grid md:grid-cols-2 gap-6">
              
              <motion.div onClick={() => router.push('/student/profile')} whileHover={{ scale: 1.02 }} className="cursor-pointer h-full">
                <Card className="flex flex-col sm:flex-row items-start gap-5 h-full hover:border-[var(--primary)]/30">
                  <div className="p-3 rounded-xl bg-[var(--accent)] border border-[var(--primary)]/20"><CheckCircle className="text-[var(--primary)]" size={28} /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-1 text-[var(--foreground)]">Edit Profile</h4>
                    <p className="text-[var(--muted-foreground)] text-sm mb-4 font-medium leading-relaxed">Keep your skills and experience updated.</p>
                    <span className="text-[var(--primary)] text-sm font-semibold flex items-center gap-1">Update Details <ArrowRight size={16}/></span>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="h-full">
                <Card className={`flex flex-col sm:flex-row items-start gap-5 h-full ${examStatus === "pending" ? "border-amber-200 bg-amber-50/50" : examStatus === "disqualified" ? "border-red-200 bg-red-50/50" : ""}`}>
                  <div className={`p-3 rounded-xl border ${ (examStatus === "none" || examStatus === "granted") ? "bg-[var(--accent)] border-[var(--primary)]/20" : examStatus === "pending" ? "bg-amber-100 border-amber-200" : examStatus === "disqualified" ? "bg-red-100 border-red-200" : "bg-slate-100 border-slate-200"}`}>
                    {(examStatus === "none" || examStatus === "granted") ? <ShieldCheck className="text-[var(--primary)]" size={28} /> : examStatus === "pending" ? <Clock className="text-amber-600" size={28} /> : examStatus === "disqualified" ? <AlertTriangle className="text-red-500" size={28} /> : <Lock className="text-slate-500" size={28} />}
                  </div>
                  <div className="flex-1 w-full">
                    <h4 className="text-xl font-bold mb-1 text-[var(--foreground)]">Final Skill Assessment</h4>
                    
                    {(examStatus === "none" || !examStatus || examStatus === "granted") && (
                      <>
                        <p className="text-slate-500 text-sm mb-5 font-medium leading-relaxed">You have 1 attempt available.</p>
                        <Button variant="primary" onClick={() => router.push('/student/test')}>Start Assessment <ArrowRight size={16}/></Button>
                      </>
                    )}
                    
                    {examStatus === "pending" && (
                      <>
                        <p className="text-amber-700 text-sm mb-5 font-medium">Re-test request sent. Waiting for approval.</p>
                        <Button variant="secondary" disabled className="w-full">Approval Pending...</Button>
                      </>
                    )}
                    
                    {examStatus === "completed" && (
                      <>
                        <p className="text-green-600 text-sm mb-5 font-medium">Test Completed!</p>
                        <div className="flex flex-col gap-3">
                           <DownloadReportButton candidate={profileData} />
                           <Button variant="secondary" onClick={requestReTestAccess} className="w-full">Request Re-test</Button>
                        </div>
                      </>
                    )}
                    
                    {examStatus === "disqualified" && (
                      <>
                        <p className="text-red-600 text-sm mb-5 font-medium">Locked for Anti-Cheat violations.</p>
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
                    <h4 className="text-xl font-bold mb-1 text-[var(--foreground)]">Try Practice Mode (Tutorial)</h4>
                    <p className="text-[var(--muted-foreground)] text-sm mb-5 font-medium leading-relaxed">Understand the secure interface before the real exam.</p>
                    <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 shadow-blue-500/20">Start Demo <ArrowRight size={16}/></Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        )}

        {/* 🔥 VIEW 2: EARNINGS & INVOICE MODULE 🔥 */}
        {activeView === 'earnings' && (
           <div className="animate-in fade-in duration-300">
              <header className="mb-8 print:hidden">
                 <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2 flex items-center gap-3"><IndianRupee className="text-[var(--primary)]" size={32}/> Earnings & Invoices</h1>
                 <p className="text-[var(--muted-foreground)] font-medium">Track your completed freelance assignments, check TDS, and generate official invoices.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 print:hidden">
                 <Card className="bg-white shadow-sm border border-[var(--border)]">
                    <p className="text-[var(--muted-foreground)] font-semibold text-xs mb-1 uppercase tracking-wider">Gross Earnings</p>
                    <p className="text-3xl font-bold text-[var(--foreground)]">₹ {totalGross.toLocaleString('en-IN')}</p>
                 </Card>
                 <Card className="bg-[oklch(0.97_0.015_15)] shadow-sm border border-[oklch(0.88_0.02_15)]">
                    <p className="text-[oklch(0.52_0.16_20)] font-semibold text-xs mb-1 uppercase tracking-wider">TDS Deducted (10%)</p>
                    <p className="text-3xl font-bold text-[oklch(0.52_0.16_20)]">- ₹ {totalTDS.toLocaleString('en-IN')}</p>
                 </Card>
                 <Card className="bg-[var(--success-bg)] shadow-sm border border-[var(--success)]/30">
                    <p className="text-[var(--success)] font-semibold text-xs mb-1 uppercase tracking-wider">Net Payable Amount</p>
                    <p className="text-4xl font-bold text-[var(--success)]">₹ {totalNet.toLocaleString('en-IN')}</p>
                 </Card>
              </div>

              <div className="print:hidden">
                 <h3 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2"><Receipt size={20} className="text-[var(--primary)]"/> Assignment History</h3>
                 <div className="space-y-4">
                    {assignments.length === 0 && (
                       <div className="p-8 text-center bg-white border border-dashed rounded-xl text-[var(--muted-foreground)] font-semibold text-xs leading-relaxed">
                          ₹ 0 Active Accruals. Your real-time freelance timeline breakdown logging meters will initialize automatically here once Admin activates your payout contract from the Hired Talent panel.
                       </div>
                    )}
                    {assignments.map(assign => (
                       <Card key={assign.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors shadow-sm">
                          <div>
                             <h4 className="text-lg font-bold text-[var(--foreground)]">{assign.title}</h4>
                             <p className="text-sm text-[var(--muted-foreground)] font-medium mt-1">Assignment ID: <span className="font-mono text-[var(--foreground)] bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border)]">{assign.id}</span> • Completed: {assign.date}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 shrink-0">
                             <div className="text-left sm:text-right border-l-4 border-[var(--primary)] pl-4 sm:border-l-0 sm:pl-0">
                                <p className="text-xl font-bold text-[var(--foreground)] leading-none">₹ {(assign.gross * 0.9).toLocaleString('en-IN')}</p>
                                <p className="text-[10px] text-[var(--muted-foreground)] font-semibold uppercase tracking-widest mt-1">Net Payable</p>
                             </div>
                             {assign.invoiceSubmitted ? (
                                <span className="flex items-center justify-center gap-1.5 bg-[var(--success-bg)] text-[var(--success)] px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--success)]/25 w-full sm:w-auto">
                                   <CheckCircle size={16}/> Sent to Admin
                                </span>
                             ) : (
                                <Button variant="primary" onClick={() => setSelectedAssignment(assign)} className="px-5 py-2.5 flex items-center justify-center gap-2 w-full sm:w-auto">
                                   <FileText size={16}/> Create Invoice
                                </Button>
                             )}
                          </div>
                       </Card>
                    ))}
                 </div>
              </div>

              {/* 🔥 INVOICE MODAL & PRINT FORMAT — UPGRADED FUNCTIONAL COMPONENT ENGINE FIXED */}
              {selectedAssignment && (() => {
                 let computedGross = selectedAssignment.gross;
                 let dynamicDescription = selectedAssignment.title;

                 if (invoiceType === "days") {
                    computedGross = numberOfDays * ratePerDay;
                    dynamicDescription = `${selectedAssignment.title} — Day-Rate Assignment (${numberOfDays} Days @ ₹${ratePerDay.toLocaleString('en-IN')}/day)`;
                 } else if (invoiceType === "monthly") {
                    computedGross = monthlyBaseRate * monthsCount;
                    dynamicDescription = `${selectedAssignment.title} — Retainer Retrospective Service (${monthsCount} Month(s) @ ₹${monthlyBaseRate.toLocaleString('en-IN')}/month)`;
                 }

                 const computedTDS = computedGross * 0.10;
                 const computedNet = computedGross - computedTDS;

                 return (
                 <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4 md:p-8 print:static print:bg-white print:p-0">
                    <div className="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl relative print:shadow-none print:w-full overflow-hidden">
                       
                       <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 print:hidden sticky top-0 z-10">
                          <h3 className="font-extrabold text-slate-800 flex items-center gap-2"><Receipt size={18}/> Custom Invoice Engine</h3>
                          <button onClick={() => { setSelectedAssignment(null); setInvoiceType("fixed"); setStartDate(""); setEndDate(""); setLeavesCount(0); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
                       </div>

                       {/* 🔥 INTERACTIVE BILLING METRICS CONTROL STRIP — HIDDEN IN PRINT MODE */}
                       <div className="p-6 bg-slate-50/80 border-b border-slate-100 print:hidden grid grid-cols-1 md:grid-cols-3 gap-6 items-end relative z-20">
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Invoice Calculation Framework</label>
                             <div className="flex gap-1.5 p-1 bg-white border rounded-xl shadow-sm">
                                {[
                                   { id: "fixed", label: "Fixed Flat" },
                                   { id: "days", label: "No. of Days" },
                                   { id: "monthly", label: "Monthly Base" }
                                ].map(btn => (
                                   <button 
                                      key={btn.id}
                                      type="button" 
                                      onClick={() => setInvoiceType(btn.id as any)} 
                                      className={`flex-1 py-1.5 text-[11px] font-black rounded-lg transition-all ${invoiceType === btn.id ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                                   >
                                      {btn.label}
                                   </button>
                                ))}
                             </div>
                          </div>

                          {invoiceType === "days" && (
                             <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in duration-200">
                                <div className="space-y-1">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Start Date</label>
                                   <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-[11px] font-bold outline-none focus:border-[var(--primary)] [color-scheme:light]" />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">End Date</label>
                                   <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-[11px] font-bold outline-none focus:border-[var(--primary)] [color-scheme:light]" />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">No. of Leave</label>
                                   <input type="number" min={0} value={leavesCount} onChange={(e) => setLeavesCount(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-[11px] font-bold outline-none focus:border-[var(--primary)]" />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Day Rate (₹)</label>
                                   <input type="number" min={0} value={ratePerDay} onChange={(e) => setRatePerDay(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-[11px] font-bold outline-none focus:border-[var(--primary)]" placeholder="Charges/day" />
                                </div>
                             </div>
                          )}

                          {invoiceType === "monthly" && (
                             <div className="md:col-span-2 grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Monthly Base Retainer (₹)</label>
                                   <input type="number" min={0} value={monthlyBaseRate} onChange={(e) => setMonthlyBaseRate(Math.max(0, parseInt(e.target.value) || 0))} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-xs font-bold outline-none focus:border-[var(--primary)]" placeholder="Fixed amount per month" />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Duration (Months)</label>
                                   <input type="number" min={1} value={monthsCount} onChange={(e) => setMonthsCount(Math.max(1, parseInt(e.target.value) || 0))} className="w-full bg-white border border-[var(--border)] rounded-lg p-2 text-xs font-bold outline-none focus:border-[var(--primary)]" />
                                </div>
                             </div>
                          )}

                          {invoiceType === "fixed" && (
                             <div className="md:col-span-2 p-3 bg-[var(--accent)] border border-[var(--primary)]/20 rounded-xl text-[11px] font-bold text-[var(--primary)] leading-normal">
                                💡 Processing fixed contractual payout parameters. Values are automatically structural mapped from target task logs.
                             </div>
                          )}
                       </div>

                       {/* PROFESSIONAL INVOICE PAPER */}
                       <div className="p-8 md:p-14 text-slate-800 bg-white">
                          <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-end mb-12 border-b-2 border-[var(--border)] pb-8 gap-6">
                             <div>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">INVOICE</h1>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                   <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Invoice No.</p>
                                   <p className="font-mono font-bold text-slate-800">RM-INV-{selectedAssignment.id}</p>
                                   <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Date Issued</p>
                                   <p className="font-bold text-slate-800">{new Date().toLocaleDateString()}</p>
                                </div>
                             </div>
                             <div className="text-left md:text-right">
                                <h2 className="text-3xl font-black text-[var(--primary)] mb-1 tracking-tight">Resource<span className="text-[var(--foreground)]">mania</span></h2>
                                <p className="text-sm font-bold text-slate-600">Resource Mania Private Ltd.</p>
                                <p className="text-sm font-medium text-slate-500">Corporate HQ, Kolkata, WB, India</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Bill To (Client)</p>
                                <h3 className="text-lg font-extrabold text-slate-900">Resource Mania Private Ltd.</h3>
                                <p className="text-sm font-medium text-slate-600 mt-1">accounts@resourcemania.com</p>
                                <p className="text-sm font-medium text-slate-600 mt-1">GSTIN: 19AAAAA0000A1Z5</p>
                             </div>
                             <div className="bg-[var(--accent)] p-6 rounded-xl border border-[var(--primary)]/20 text-left md:text-right">
                                <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest mb-3">From (Contractor)</p>
                                <h3 className="text-lg font-extrabold text-slate-900">{profileData?.fullName || "Candidate Name"}</h3>
                                <p className="text-sm font-medium text-slate-600 mt-1">{user?.email}</p>
                                <p className="text-sm font-medium text-slate-600 mt-1">{profileData?.phone || "Phone Not Provided"}</p>
                             </div>
                          </div>

                          <table className="w-full text-left border-collapse mb-10">
                             <thead>
                                <tr className="bg-[var(--primary)] text-white uppercase tracking-widest text-[10px] font-black">
                                   <th className="p-4 rounded-tl-xl">Description of Assignment</th>
                                   <th className="p-4 text-right rounded-tr-xl">Gross Amount</th>
                                </tr>
                             </thead>
                             <tbody>
                                <tr className="border-b-2 border-slate-100 bg-slate-50">
                                   <td className="p-4 font-bold text-slate-800 text-base">{dynamicDescription} <span className="block text-xs font-medium text-slate-500 mt-1 font-mono">Ref ID: {selectedAssignment.id}</span></td>
                                   <td className="p-4 text-right font-black text-lg">₹ {computedGross.toLocaleString('en-IN')}</td>
                                </tr>
                             </tbody>
                          </table>

                          <div className="flex justify-end w-full mb-12">
                             <div className="w-full md:w-3/5 space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <div className="flex justify-between text-slate-600 font-bold text-sm">
                                   <span>Subtotal (Gross)</span>
                                   <span>₹ {computedGross.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-[oklch(0.52_0.16_20)] font-bold text-sm border-b border-slate-200 pb-4">
                                   <span>TDS Deduction (10% u/s 194J)</span>
                                   <span>- ₹ {computedTDS.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                   <span className="text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Net Payable</span>
                                   <span className="text-3xl font-bold text-[var(--success)]">₹ {computedNet.toLocaleString('en-IN')}</span>
                                </div>
                             </div>
                          </div>

                          <div className="border-t-2 border-dashed border-slate-200 pt-8 text-center text-xs font-medium text-slate-400">
                             <p>This is a system-generated electronic invoice. No physical signature is required.</p>
                             <p className="mt-1">For any payment disputes, contact accounts@resourcemania.com within 7 days.</p>
                          </div>
                       </div>

                       {/* Action Buttons (Hidden in print) */}
                       <div className="p-6 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3 print:hidden">
                          <Button variant="secondary" onClick={handleDownloadInvoice} className="flex items-center justify-center gap-2 bg-white w-full sm:w-auto"><Download size={16}/> Download PDF Invoice</Button>
                          <Button 
                             variant="primary" 
                             onClick={() => handleGenerateAndSubmitInvoice({ ...selectedAssignment, gross: computedGross, title: dynamicDescription })} 
                             disabled={isSubmittingInvoice} 
                             className="flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-glow)] w-full sm:w-auto"
                          >
                             {isSubmittingInvoice ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>} 
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

      {/* 📱 PREMIUM MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[var(--border)] shadow-[0_-2px_12px_oklch(0.20_0.025_245/0.06)] pb-[env(safe-area-inset-bottom)] z-50 print:hidden">
        <div className="flex justify-evenly items-center px-2 py-2">
          <div onClick={() => setActiveView('overview')} className={`flex flex-col items-center gap-1 p-2 cursor-pointer w-20 ${activeView === 'overview' ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <div className={`p-2 rounded-xl ${activeView === 'overview' ? 'bg-[var(--accent)]' : 'hover:bg-[var(--surface)]'}`}><LayoutDashboard size={22} /></div>
            <span className="text-[10px] font-bold mt-0.5">Overview</span>
          </div>
          <div onClick={() => setActiveView('earnings')} className={`flex flex-col items-center gap-1 p-2 cursor-pointer w-20 ${activeView === 'earnings' ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>
            <div className={`p-2 rounded-xl ${activeView === 'earnings' ? 'bg-[var(--accent)]' : 'hover:bg-[var(--surface)]'}`}><IndianRupee size={22} /></div>
            <span className="text-[10px] font-bold mt-0.5">Earnings</span>
          </div>
          <div onClick={() => router.push('/student/profile')} className="flex flex-col items-center gap-1 p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer w-20">
            <div className="p-2 rounded-xl hover:bg-[var(--surface)]"><UserCircle size={22} /></div>
            <span className="text-[10px] font-bold mt-0.5">Profile</span>
          </div>
        </div>
      </div>

    </div>
  );
}