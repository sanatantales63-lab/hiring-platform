"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Briefcase, GraduationCap, 
  Lock, Loader2, LayoutDashboard, LogOut, Briefcase as BriefcaseIcon, Star, AlertCircle, CheckCircle, Clock, UserPlus, Filter,
  ShieldCheck, BarChart3, Activity, Award, Video, Zap, FileText, UserCircle
} from "lucide-react";

// 🔥 Naye Master Components 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import * as XLSX from 'xlsx';

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

  // 🔥 NAYA: INTERVIEW MODAL STATES 🔥
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewStudent, setInterviewStudent] = useState<any>(null);

  // 🔥 NEW: Instant Direct Hire Custom Confirmation Pop-up states
  const [showHireConfirmModal, setShowHireConfirmModal] = useState(false);
  const [hireTargetStudent, setHireTargetStudent] = useState<any>(null);

  // Intercept original request layout and deploy interstitial verification popup alert
  const triggerHireVerificationPopup = (student: any) => {
     setHireTargetStudent(student);
     setShowHireConfirmModal(true);
  };
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [selectedForExcel, setSelectedForExcel] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  // 🔥 PREMIUM FILTER DRAWER STATES 🔥
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExps, setSelectedExps] = useState<string[]>([]);
  const [selectedLocs, setSelectedLocs] = useState<string[]>([]);
  const [selectedNotices, setSelectedNotices] = useState<string[]>([]);
  const [selectedQuals, setSelectedQuals] = useState<string[]>([]);
  // 🔥 NEW: State arrays to capture specific Student Profile Career Roles parameters
  const [selectedProfileJobTypes, setSelectedProfileJobTypes] = useState<string[]>([]);
  const [selectedContractOpenness, setSelectedContractOpenness] = useState<string[]>([]);
  // 🔥 Extended Elite Custom Search States Link Layer
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedBehavioral, setSelectedBehavioral] = useState<string[]>([]);
  const [selectedTechTools, setSelectedTechTools] = useState<string[]>([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([]);
  const [selectedRelocation, setSelectedRelocation] = useState<string[]>([]);
 const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedLaptops, setSelectedLaptops] = useState<string[]>([]); // 🔥 NEW: Laptop specification selection mapping state array
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]); // 🔥 NEW: Age range filter state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Unlocked Datasets direct from student page configuration schema mapping
  const MASTER_SKILLS_DATA: Record<string, string[]> = {
    "Financial Reporting & Accounting": ["Accounting & Bookkeeping", "Accounting Standards (AS)", "Accounts Payable Assistance", "Accounts Receivables Assistaance", "Business Combinations Accounting", "Consolidation of Accounts", "Ind AS Accounting", "US GAAP"],
    "Internal Audit & Risk Assessment": ["AML Investigation Techniques", "Contractual Compliance Testing", "Corporate governance framework assessment", "Digital Forensic Investigation", "Fraud Risk Assessment Models", "Internal Audit", "Internal Control Testing", "IT and Data Analytics", "Litigation Support Reporting", "RCM Prepration", "SOP Preparation & Implementation", "SOX Audit"],
    "Statutory Audit & Compliances": ["Audit Assistance for Companies", "Audit Documentation", "Audit Observations Correction", "Audit Reports Drafting", "Bank Audit", "Compliance & Legal Verifications", "Concurrent Audit", "Control Testing", "Financial Due Diligence Audit", "Group Audit", "NBFCs Audit", "Physical Verification"],
    "Direct & International Taxation": ["Cross-Border Structuring", "GAAR", "Income Tax Return Preparation and Filing", "MAT-AMT Calculation", "Permanent Establishment", "Tax Audit", "Tax Structuring Advisory", "Tax Treaty", "TDS-TCS Filling", "Transfer Pricing"],
    "Indirect Taxation & Transaction Taxes": ["Customs Valuation", "E-Invoicing Compliance", "E-Way Bill", "GST Audit", "GST Reconciliation", "GST Return Filing", "Input Tax Credit Optimisation", "M&A Tax Due Diligence", "Refund Claim Processing"],
    "Costing & Strategic Management": ["Break-Even Analysis & Optimization", "Job Costing", "Kaizen Costing", "Lean Accounting", "Life-Cycle Costing", "MIS For Cost Analysis", "MIS For Variance Analysis", "Process Costing", "Target Costing"],
    "Financial Modeling & Valuation": ["Three-Statement Integrated Modeling", "Dynamic Scenario Simulation", "Sensitivity Matrix Design", "DCF Valuation Construction", "Comparable Company Analysis", "Precedent Transaction Analysis", "Leveraged Buyout Modeling", "Project Finance Modeling", "Startup Valuation", "Model Audit"],
    "Investment & Portfolio Analytics": ["Equity Valuation Frameworks", "Fixed Income Duration Analysis", "Credit Spread Modeling", "Alternative Asset Evaluation", "Hedge Fund Performance", "Portfolio Optimisation (Markowitz)", "CAPM & Multifactor Modeling", "Derivatives Pricing Models"],
    "Treasury & Liquidity Management": ["Bank Reconcilations", "Treasury operation management", "Working Capital Structuring", "Cash Forecasting Architecture", "Bank Relationship Management", "Foreign Exchange Exposure Hedging", "Interest Rate Swap Structuring", "Debt Issuance Strategy"],
    "Corporate Law & Practice": ["Company Incorporation", "MCA filings", "MOA/AOA/Deeds drafting", "Compliance Checklist drafting", "Companies Act Compliance", "Board Process Advisory", "SEBI Listing Regulations", "Insider Trading Compliance", "Secretarial Audit Execution", "FEMA Compliance"]
  };

  const BEHAVIORAL_SKILLS_LIST = ["Leadership", "Team Management", "Communication Skills", "Problem Solving", "Critical Thinking", "Adaptability & Flexibility", "Time Management", "Work Ethic", "Conflict Resolution", "Emotional Intelligence", "Decision Making", "Client Relationship Management", "Strategic Planning"];
  const TECH_SKILLS_LIST = ["Excel", "Tally Prime", "SAP FICO", "MS Word", "MS PowerPoint", "Power BI", "Tableau", "Oracle ERP", "QuickBooks", "Zoho Books", "SQL", "Python for Finance", "Macros & VBA"];

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

          // 🔥 UNLOCKED: Bypassed admin manual assignment. All registered firms can see all available talent instantly.
          const { data: allProfiles } = await supabase.from("profiles").select("*");
          if (allProfiles) {
             const visibleCandidates = allProfiles.filter((student: any) => {
                if (student.hired_company_id === companyData.id) return true;
                if (student.hired_status === 'hired') return false;
                return true; // Saare available candidates access ho jayenge
             });
             setCandidates(visibleCandidates);
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

  const openInterviewModal = (student: any) => {
    setInterviewStudent(student);
    setInterviewDate("");
    setInterviewTime("");
    setShowInterviewModal(true);
  };

const submitInterviewRequest = async () => {
    // Collect all slots data object structure layers dynamically mapping nodes
    const slots = [
       { date: (document.getElementById("slot1_date") as HTMLInputElement)?.value, time: (document.getElementById("slot1_time") as HTMLInputElement)?.value },
       { date: (document.getElementById("slot2_date") as HTMLInputElement)?.value, time: (document.getElementById("slot2_time") as HTMLInputElement)?.value },
       { date: (document.getElementById("slot3_date") as HTMLInputElement)?.value, time: (document.getElementById("slot3_time") as HTMLInputElement)?.value }
    ].filter(s => s.date && s.time);

    if (slots.length === 0) return alert("🛑 Minimum ek Date aur Time slot bharna mandatory hai!");
    
    try {
      // Ensure slots is a valid JSON object/array
      const { error } = await supabase.from("profiles").update({ 
        hired_status: "interview_requested", 
        hired_company_id: companyId,
        hired_company_name: companyName,
        interview_slots: JSON.stringify(slots) 
      }).eq("id", interviewStudent.id);
      
      if (error) {
        console.error("Supabase Error:", error);
        throw new Error(error.message);
      }

      const emailRes = await fetch('/api/send-admin-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: "interview_request",
          candidateName: interviewStudent.fullName,
          companyName: companyName,
          extraInfo: slots.map((s, idx) => `Slot ${idx+1}: ${s.date} @ ${s.time}`).join(" | ")
        })
      });

      if (!emailRes.ok) {
         console.error("Email sending failed");
      }

      alert("Interview Request Sent! Admin will arrange the Google Meet.");
      setCandidates(candidates.map(c => c.id === interviewStudent.id ? {...c, hired_status: "interview_requested", hired_company_id: companyId, interview_date: interviewDate, interview_time: interviewTime} : c));
      setShowInterviewModal(false);
    } catch (e: any) { 
       alert(`Request Failed: ${e.message}`); 
       console.error("Full Error:", e);
    }
  };

  // Isko rakh lo taaki purana code fat na jaye
  const shortlistCandidate = async (student: any) => {};

  const requestHire = async (student: any) => {
    // Build unique ID same way as card display
    let qp = "PR";
    if (student.highestQualification) {
      const hq = student.highestQualification.toLowerCase();
      if (hq.includes('ca ') || hq.includes('ca-') || hq === 'ca' || hq.includes('chartered accountant')) qp = "CA";
      else if (hq.includes('cma') || hq.includes('cost & management')) qp = "CM";
      else if (hq.includes('cs ') || hq.includes('cs-') || hq === 'cs' || hq.includes('company secretary')) qp = "CS";
      else if (hq.includes('acca')) qp = "AC";
      else if (hq.includes('mba') || hq.includes('pgdm')) qp = "MB";
      else if (hq.includes('b.tech') || hq.includes('btech') || hq.includes('b.e.')) qp = "BT";
      else if (hq.includes('m.com') || hq.includes('mcom')) qp = "MC";
      else if (hq.includes('b.com') || hq.includes('bcom') || hq.includes('bba')) qp = "BC";
      else if (hq.includes('diploma') || hq.includes('polytechnic')) qp = "DP";
      else if (hq.includes('high school') || hq.includes('12th') || hq.includes('puc')) qp = "HS";
      else qp = "GD";
    }
    const studentUniqueId = student.id ? `RM-${qp}-${student.id.substring(0, 8).toUpperCase()}` : "N/A";
    if(!confirm(`Send official Hire request for ${studentUniqueId}? Admin will verify and finalize this offline.`)) return;
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

  // 🔥 COMPANY EXCEL EXPORT 🔥
  const toggleExcelSelection = (id: string) => {
    setSelectedForExcel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCompanyExportExcel = () => {
    const currentList = activeTab === 'assigned' ? assignedList : hiredList;
    const toExport = selectedForExcel.length > 0
      ? currentList.filter(c => selectedForExcel.includes(c.id))
      : currentList;
    if (toExport.length === 0) return alert("No candidates to export!");

    // Collect all unique skills across selected candidates
    const allSkills = new Set<string>();
    toExport.forEach(c => {
      const scores = c.meta?.skillScores || {};
      Object.keys(scores).forEach(s => allSkills.add(s));
    });

    const excelData = toExport.map(c => {
      let bumpedSalary = c.expectedSalary || "N/A";
      if (c.expectedSalary) {
        const numMatch = c.expectedSalary.replace(/[^0-9]/g, '');
        if (numMatch) {
          const bumpedNum = Math.round(parseInt(numMatch, 10) * 1.25);
          bumpedSalary = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(bumpedNum);
        }
      }

      const row: any = {
        "Resource ID":                 `RM-${c.id?.substring(0, 6).toUpperCase()}`,
        "Highest Qualification":       c.highestQualification || "N/A",
        "Year of Passing":             c.educations?.[0]?.passingYear || "N/A",
        "Total Experience (Years)":    c.experience || "N/A",
        "Location":                    c.city || "N/A",
        "Notice Period":               c.noticePeriod || "N/A",
        "Expected Salary (INR)":       bumpedSalary,
        "Rating (out of 5)":           c.company_rating || "N/A",
        "Ready to Relocate":           c.willingToRelocate || "No",
        "Open to Contract / Temp":     c.openToContractRoles ? "Yes" : "No",
      };

      allSkills.forEach(skill => {
        const scoreData = c.meta?.skillScores?.[skill];
        row[skill] = scoreData ? `${scoreData.correct} / ${scoreData.total}` : "N/A";
      });

      return row;
    });

    // 🔥 PROFESSIONAL EXCEL: Title rows + data + auto column widths 🔥
    const generatedOn = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const titleRows = [
      [`RESOURCEMANIA — Verified Candidate Export`],
      [`Generated: ${generatedOn}  |  Confidential — For Authorized Recruiters Only`],
      [`Total Candidates: ${toExport.length}  |  Platform: resourcemania.in`],
      [], // blank separator row
    ];

    const ws = XLSX.utils.aoa_to_sheet(titleRows);

    // Add candidate data starting from row 5
    XLSX.utils.sheet_add_json(ws, excelData, { origin: `A5`, skipHeader: false });

    // Auto column widths — no more cut-off text
    const allKeys = Object.keys(excelData[0] || {});
    const colWidths = allKeys.map(key => ({
      wch: Math.max(
        key.length,
        ...excelData.map(row => String(row[key] ?? '').length)
      ) + 4  // +4 padding on each column
    }));
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Candidates");
    XLSX.writeFile(wb, `Resourcemania_Candidates_${new Date().toISOString().split('T')[0]}.xlsx`);
    setSelectedForExcel([]);
  };

  // 🔥 DYNAMIC FILTER OPTIONS MAKER 🔥
  const uniqueLocations = Array.from(new Set(candidates.map(c => c.city).filter(Boolean)));
  const uniqueExp = Array.from(new Set(candidates.map(c => c.experience).filter(Boolean)));
  const uniqueNotice = Array.from(new Set(candidates.map(c => c.noticePeriod).filter(Boolean)));

  // 🔥 PREMIUM ADAPTIVE FILTERING LOGIC — COMPLETE GLOBAL DATA FIELD PARSER ENGINE 🔥
  const filteredCandidates = candidates.filter(c => {
    let matchesSearch = true;
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase().trim();
      let qualPrefix = "PR"; 
      if (c.highestQualification) {
         const hq = c.highestQualification.toLowerCase();
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
      const generatedId = c.id ? `RM-${qualPrefix}-${c.id.substring(0, 8).toUpperCase()}` : "";
      const matchId = generatedId.toLowerCase().includes(query) || (c.id && c.id.toLowerCase().includes(query));
      const matchName = c.fullName && c.fullName.toLowerCase().includes(query);
      const matchGlobalSkills = c.skills?.some((s: string) => s.toLowerCase().includes(query));
      if (!matchId && !matchName && !matchGlobalSkills) matchesSearch = false;
    }
    
    // 🔥 UPGRADED: Strict multi-node validator parsing row values matching student table schemas exactly
    const matchesProfileJobType = selectedProfileJobTypes.length > 0 ? selectedProfileJobTypes.includes(c.jobType) : true;
    
    let matchesContractOpenness = true;
    if (selectedContractOpenness.length > 0) {
       matchesContractOpenness = selectedContractOpenness.some(opt => {
          if (opt === "Yes") return c.openToContractRoles === true || (c.jobType && c.jobType.includes("Contract"));
          if (opt === "No") return c.openToContractRoles === false || c.jobType === "Permanent Role";
          return true;
       });
    }

    // Direct multi-array value checks matching keys
    const matchesSkills = selectedSkills.length > 0 ? selectedSkills.every(s => c.skills?.includes(s)) : true;
    const matchesBehavioral = selectedBehavioral.length > 0 ? selectedBehavioral.every(b => c.behavioralSkills?.includes(b)) : true;
    const candidateTools = c.technologicalSkills?.map((t: any) => typeof t === 'string' ? t : t.name) || [];
    const matchesTechTools = selectedTechTools.length > 0 ? selectedTechTools.every(t => candidateTools.includes(t)) : true;

    const matchesExp = selectedExps.length > 0 ? selectedExps.includes(c.experience) : true;
    const matchesLoc = selectedLocs.length > 0 ? selectedLocs.includes(c.city) : true;
    const matchesNotice = selectedNotices.length > 0 ? selectedNotices.includes(c.noticePeriod) : true;
    const matchesQual = selectedQuals.length > 0 ? selectedQuals.includes(c.highestQualification) : true;
   const matchesWorkMode = selectedWorkModes.length > 0 ? selectedWorkModes.includes(c.workMode) : true;
    const matchesRelocation = selectedRelocation.length > 0 ? selectedRelocation.includes(c.willingToRelocate) : true;
    const matchesGender = selectedGenders.length > 0 ? selectedGenders.includes(c.gender) : true;
    const matchesLaptop = selectedLaptops.length > 0 ? selectedLaptops.includes(c.hasLaptop) : true;

    // 🔥 NEW: Age filter — calculate from dob field
    let matchesAge = true;
    if (selectedAgeRanges.length > 0 && c.dob) {
      const birthYear = new Date(c.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      matchesAge = selectedAgeRanges.some(range => {
        if (range === "Under 22") return age < 22;
        if (range === "22–25") return age >= 22 && age <= 25;
        if (range === "26–30") return age >= 26 && age <= 30;
        if (range === "31–35") return age >= 31 && age <= 35;
        if (range === "36–40") return age >= 36 && age <= 40;
        if (range === "Above 40") return age > 40;
        return true;
      });
    } else if (selectedAgeRanges.length > 0) {
      matchesAge = true; // If no DOB, don't exclude
    }

    return matchesSearch && matchesProfileJobType && matchesContractOpenness && matchesSkills && matchesBehavioral && matchesTechTools && matchesExp && matchesLoc && matchesNotice && matchesQual && matchesWorkMode && matchesRelocation && matchesGender && matchesLaptop && matchesAge;
  });

  const uniqueQuals = Array.from(new Set(candidates.map(c => c.highestQualification).filter(Boolean)));
  const activeFiltersCount = selectedTypes.length + selectedExps.length + selectedLocs.length + selectedNotices.length + selectedQuals.length + selectedSkills.length + selectedBehavioral.length + selectedTechTools.length + selectedWorkModes.length + selectedRelocation.length + selectedGenders.length + selectedLaptops.length + selectedAgeRanges.length;

  const assignedList = filteredCandidates.filter(c => c.hired_status !== "hired" && c.hired_status !== "shortlisted" && c.hired_status !== "hire_requested" && c.hired_status !== "interview_requested");
  const hiredList = filteredCandidates.filter(c => c.hired_company_id === companyId && (c.hired_status === "hired" || c.hired_status === "shortlisted" || c.hired_status === "hire_requested" || c.hired_status === "interview_requested"));
  const pendingReviews = hiredList.filter(c => {
     if(c.hired_status !== "hired" || c.company_rating) return false;
     if(!c.hire_date) return false;
     const daysSinceHire = Math.floor((new Date().getTime() - new Date(c.hire_date).getTime()) / (1000 * 60 * 60 * 24));
     const requiredDays = c.jobType === '3-Month Contract' ? 90 : 60; 
     return daysSinceHire >= requiredDays; 
  });

  // 🔥 Normalize qualification display name — handles all variants consistently
  const normalizeQualification = (raw: string | undefined | null): string => {
    if (!raw) return "Not Specified";
    const q = raw.trim();
    const ql = q.toLowerCase();

    // ── Chartered Accountant (CA) ──
    // Final / Qualified / just "CA" or full name → canonical
    if (
      (ql.includes('ca') || ql.includes('chartered accountant')) &&
      !ql.includes('intermediate') && !ql.includes('inter') &&
      !ql.includes('foundation') && !ql.includes('ipcc') && !ql.includes('ipce') &&
      !ql.includes('cma') && !ql.includes('cost') && !ql.includes('acca')
    ) return "Chartered Accountant (CA)";

    // CA stages — keep as-is label but normalise text
    if (ql.includes('ca') && (ql.includes('intermediate') || ql.includes('inter') || ql.includes('ipcc') || ql.includes('ipce'))) return "CA Intermediate";
    if (ql.includes('ca') && (ql.includes('foundation') || ql.includes('cpt'))) return "CA Foundation";

    // ── Cost & Management Accountant (CMA) ──
    if (ql.includes('cma') && !ql.includes('intermediate') && !ql.includes('inter') && !ql.includes('foundation')) return "Cost & Management Accountant (CMA)";
    if (ql.includes('cma') && (ql.includes('intermediate') || ql.includes('inter'))) return "CMA Intermediate";
    if (ql.includes('cma') && ql.includes('foundation')) return "CMA Foundation";

    // ── Company Secretary (CS) ──
    if ((ql.includes('cs') || ql.includes('company secretary')) && !ql.includes('executive') && !ql.includes('foundation') && !ql.includes('acca')) return "Company Secretary (CS)";
    if ((ql.includes('cs') || ql.includes('company secretary')) && ql.includes('executive')) return "CS Executive";
    if ((ql.includes('cs') || ql.includes('company secretary')) && ql.includes('foundation')) return "CS Foundation";

    // ── ACCA ──
    if (ql.includes('acca')) return "ACCA";

    // ── MBA / PGDM ──
    if (ql.includes('mba') || ql.includes('pgdm')) return q; // keep as typed (MBA Finance etc)

    // ── M.Com ──
    if (ql.includes('m.com') || ql.includes('mcom')) return "Master of Commerce (M.Com)";

    // ── B.Com ──
    if (ql.includes('b.com') || ql.includes('bcom')) return "Bachelor of Commerce (B.Com)";

    // ── BBA ──
    if (ql.includes('bba')) return "Bachelor of Business Administration (BBA)";

    // ── B.Tech / BE ──
    if (ql.includes('b.tech') || ql.includes('btech') || ql.includes('b.e.')) return "Bachelor of Technology (B.Tech)";

    // ── Diploma ──
    if (ql.includes('diploma') || ql.includes('polytechnic')) return "Diploma";

    // ── 12th / High School ──
    if (ql.includes('12th') || ql.includes('hsc') || ql.includes('puc') || ql.includes('higher secondary') || ql.includes('intermediate') && !ql.includes('ca') && !ql.includes('cma') && !ql.includes('cs')) return "12th / Higher Secondary";

    // ── 10th ──
    if (ql.includes('10th') || ql.includes('ssc') || ql.includes('matriculation')) return "10th / Secondary";

    // Default — return as-is
    return q;
  };

  if (loading) return <div className="h-screen bg-transparent flex items-center justify-center relative z-10"><Loader2 className="animate-spin text-[var(--primary)] w-12 h-12" /></div>;

  // 🔥 BYPASSED: Removed manual admin lock block to allow direct recruiter access right after auth signup loops
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--foreground)] flex relative z-10">
      
      {/* PROFESSIONAL SIDEBAR */}
      <aside className="w-64 bg-white border-r border-[var(--border)] hidden md:flex flex-col p-5 fixed h-full z-10 shadow-soft">
        
        {/* Logo Header */}
        <div className="mb-8 px-1 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] text-white shadow-primary shrink-0">
            <Briefcase className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <div className="flex flex-col">
            <span className="font-display text-lg font-black tracking-tight text-[var(--foreground)] leading-none">
              Resource<span className="text-[var(--primary)]">mania</span>
            </span>
            <span className="text-[9px] font-extrabold tracking-widest uppercase text-[var(--primary)] mt-0.5">
              Recruiter Panel
            </span>
          </div>
        </div>
        
        <nav className="space-y-1 flex-1">
          {/* Profile */}
          <div className="pb-4 mb-4 border-b border-[var(--border)]">
             <div 
               onClick={() => router.push('/company/profile')} 
               className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg cursor-pointer text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-all text-sm font-semibold"
             >
                <BriefcaseIcon size={18}/> <span>Profile</span>
             </div>
          </div>

          {/* Talent Pool Tab */}
          <div 
            onClick={() => setActiveTab('assigned')} 
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all text-sm font-semibold ${
              activeTab === 'assigned' 
                ? 'bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20' 
                : 'text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
            }`}
          >
             <LayoutDashboard size={18}/> <span>Talent Pool</span>
          </div>

          {/* My Pipeline Tab */}
          <div 
            onClick={() => setActiveTab('hired')} 
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer transition-all text-sm font-semibold ${
              activeTab === 'hired' 
                ? 'bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20' 
                : 'text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
            }`}
          >
             <div className="flex items-center gap-3"><BriefcaseIcon size={18}/> <span>My Pipeline</span></div>
             {pendingReviews.length > 0 && <span className="bg-[var(--warning-bg)] text-[var(--warning)] text-xs font-bold px-2 py-0.5 rounded-full border border-[var(--warning)]/20">{pendingReviews.length}</span>}
          </div>
        </nav>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2.5 text-[var(--muted-foreground)] hover:text-[#c53030] mt-auto text-sm font-semibold px-3.5 py-2.5 rounded-lg hover:bg-[oklch(0.98_0.015_15)] transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-5 md:p-8 ml-0 md:ml-64 overflow-y-auto min-h-screen pb-24 md:pb-8">
        
        {/* REVIEW ALERTS */}
        {pendingReviews.length > 0 && (
           <Card className="mb-6 bg-[var(--warning-bg)] border-[var(--warning)]/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="bg-white/80 p-2.5 rounded-lg border border-[var(--warning)]/20"><AlertCircle className="text-[var(--warning)]" size={22}/></div>
                 <div>
                    <h3 className="text-base font-semibold text-[var(--foreground)]">Action Required: Leave a Review</h3>
                    <p className="text-[var(--muted-foreground)] text-sm">You have candidates who completed their timeline. Please rate their performance.</p>
                 </div>
              </div>
              <Button variant="secondary" onClick={() => setActiveTab('hired')} className="w-full sm:w-auto text-sm">Review Now</Button>
           </Card>
        )}

        <header className="flex justify-between items-start mb-6 gap-4 flex-wrap">
          <div>
             <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">{activeTab === 'assigned' ? 'Assigned Talent' : 'My Pipeline & Hires'}</h1>
             <p className="text-[var(--muted-foreground)] mt-1 text-sm">{activeTab === 'assigned' ? 'Candidates verified by Resourcemania AI matching your needs.' : 'Manage your shortlisted candidates and team.'}</p>
          </div>
         <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-end">
            {/* Grid / List Toggle */}
            <div className="flex items-center bg-white border border-[var(--border)] rounded-lg p-1 shadow-soft gap-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                title="Grid View"
              >
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1.2" fill="currentColor"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" fill="currentColor"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" fill="currentColor"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" fill="currentColor"/></svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                title="List View"
              >
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><rect x="1" y="1.5" width="13" height="2.2" rx="1.1" fill="currentColor"/><rect x="1" y="6.4" width="13" height="2.2" rx="1.1" fill="currentColor"/><rect x="1" y="11.3" width="13" height="2.2" rx="1.1" fill="currentColor"/></svg>
              </button>
            </div>
            {/* Select All / Deselect All */}
            {(() => {
              const currentList = activeTab === 'assigned' ? assignedList : hiredList;
              const allSelected = currentList.length > 0 && currentList.every(c => selectedForExcel.includes(c.id));
              return (
                <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
                  <div
                    onClick={() => {
                      if (allSelected) {
                        setSelectedForExcel([]);
                      } else {
                        setSelectedForExcel(currentList.map(c => c.id));
                      }
                    }}
                    className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                      allSelected
                        ? 'bg-[var(--primary)] border-[var(--primary)]'
                        : 'bg-white border-[var(--border)] hover:border-[var(--primary)]'
                    }`}
                  >
                    {allSelected && (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                   <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                     {allSelected ? 'Deselect All' : 'Select All'}
                   </span>
                </label>
              );
            })()}

            {/* Export Button */}
            <button
              onClick={handleCompanyExportExcel}
              className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-glow)] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-[var(--shadow-primary)] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              {selectedForExcel.length > 0 ? `Export ${selectedForExcel.length} Selected` : 'Export All (.xlsx)'}
            </button>
          </div>
        </header>

       {/* SEARCH BAR */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-[var(--border)] p-3.5 rounded-xl shadow-soft relative z-20">
          <div className="relative w-full sm:max-w-md flex items-center">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted-foreground)] flex items-center justify-center">
               <Search size={15} />
            </div>
            <input 
              type="text" 
              placeholder="Search by name, ID or skill (e.g. GST, Excel)..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] rounded-lg py-2.5 pl-10 pr-4 text-sm focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all placeholder:text-[var(--muted-foreground)]"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--primary-glow)] transition-all shadow-[var(--shadow-primary)] shrink-0 relative"
          >
            <Filter size={14} />
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[var(--primary)] text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-soft border border-[var(--border)]">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

       {/* 🔥 ZERO-CLIPPING LUXURY SEARCH DISCOVERY SIDE-OVER HUD FRAMEWORK */}
        <AnimatePresence>
          {isFilterDrawerOpen && (
            <>
              {/* Dark Glass Matte Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setIsFilterDrawerOpen(false); setActiveDropdown(null); }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              />

              {/* Drawer Container Panel — Fully Refactored with Fixed Relative Accenters */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 32, stiffness: 260 }}
                className="fixed right-0 top-0 bottom-0 w-full sm:max-w-xl bg-white border-l border-[var(--border)] shadow-modal z-50 flex flex-col overflow-hidden"
              >
                {/* Filter Drawer Header */}
                <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)] sticky top-0 z-30">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                      <Filter size={15} className="text-[var(--primary)]" /> Sourcing Filters
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Select criteria to filter candidates</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setIsFilterDrawerOpen(false); setActiveDropdown(null); }}
                    className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-white border border-[var(--border)] rounded-lg transition-all h-8 w-8 flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Filters Option Lists Box Container (No Overflow Issues) */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-none bg-white pb-32">
                  
                  {/* 🔥 NEW COMPONENT BLOCK: Looking For & Smart Tip Contract Openness Dropdowns Layer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                     {/* Column 1: Looking For (Role Type) */}
                     <div className={`space-y-1.5 relative ${activeDropdown === 'profileJobType' ? 'z-50' : 'z-10'}`}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Looking For (Role Type)</label>
                        <div 
                           onClick={() => setActiveDropdown(activeDropdown === 'profileJobType' ? null : 'profileJobType')}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-xs text-slate-800 flex justify-between items-center cursor-pointer shadow-sm hover:border-[var(--primary)]/40 transition-colors bg-white"
                        >
                           <span className="truncate text-slate-600 font-semibold">{selectedProfileJobTypes.length > 0 ? `Selected Payout Roles (${selectedProfileJobTypes.length})` : "Configure Role Targets..."}</span>
                           <span className="text-slate-400 text-[10px]">{activeDropdown === 'profileJobType' ? '▲' : '▼'}</span>
                        </div>
                        {activeDropdown === 'profileJobType' && (
                           <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] z-50 p-2 space-y-0.5 max-h-48 overflow-y-auto custom-scrollbar">
                              {[
                                 "Permanent Role",
                                 "1-3 Month Contract",
                                 "3-6 Month Contract",
                                 "6+ Month Contract",
                                 "Freelance/Project Basis",
                                 "Internship"
                              ].map(roleOpt => {
                                 const isSelected = selectedProfileJobTypes.includes(roleOpt);
                                 return (
                                    <div key={roleOpt} onClick={() => setSelectedProfileJobTypes(prev => isSelected ? prev.filter(x => x !== roleOpt) : [...prev, roleOpt])} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-bold text-slate-700 bg-white">
                                       <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white text-[9px] ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-slate-300 bg-white'}`}>{isSelected && "✓"}</div>
                                       <span className="truncate">{roleOpt}</span>
                                    </div>
                                 );
                              })}
                           </div>
                        )}
                     </div>

                     {/* Column 2: Smart Career Tip (Open to Contracts) */}
                     <div className={`space-y-1.5 relative ${activeDropdown === 'contractOpenness' ? 'z-50' : 'z-10'}`}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Open to Contract / Freelance</label>
                        <div 
                           onClick={() => setActiveDropdown(activeDropdown === 'contractOpenness' ? null : 'contractOpenness')}
                           className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-xs text-slate-800 flex justify-between items-center cursor-pointer shadow-sm hover:border-[var(--primary)]/40 transition-colors bg-white"
                        >
                           <span className="truncate text-slate-600 font-semibold">{selectedContractOpenness.length > 0 ? `Selection: ${selectedContractOpenness.join(', ')}` : "Configure Contract Settings..."}</span>
                           <span className="text-slate-400 text-[10px]">{activeDropdown === 'contractOpenness' ? '▲' : '▼'}</span>
                        </div>
                        {activeDropdown === 'contractOpenness' && (
                           <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] z-50 p-2.5 space-y-1">
                              {[
                                 { value: "Yes", display: "✅ Yes, Open to Contract Roles" },
                                 { value: "No", display: "❌ No, Permanent Mandates Only" }
                              ].map(opt => {
                                 const isSelected = selectedContractOpenness.includes(opt.value);
                                 return (
                                    <div key={opt.value} onClick={() => setSelectedContractOpenness(prev => isSelected ? prev.filter(x => x !== opt.value) : [...prev, opt.value])} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-[11px] font-bold text-slate-700 bg-white transition-colors ${isSelected ? 'bg-[var(--accent)] text-[var(--primary)]' : ''}`}>
                                       <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white text-[9px] ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-slate-300 bg-white'}`}>{isSelected && "✓"}</div>
                                       <span className="truncate">{opt.display}</span>
                                    </div>
                                 );
                              })}
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Part 1: Interactive Grid Accordions for Skills & Tools */}
                  <div className="space-y-4">
                    
                    {/* Block A: Technical Subskills Nested List Layer */}
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl relative z-20">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Technical Sub-Skills Framework</span>
                      <div 
                        onClick={() => setActiveDropdown(activeDropdown === 'skills' ? null : 'skills')}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 flex justify-between items-center cursor-pointer shadow-sm hover:border-[var(--primary)]/40 transition-colors bg-white"
                      >
                        <span className="truncate text-slate-600 font-semibold">{selectedSkills.length > 0 ? `Attached Sub-Skills Tags (${selectedSkills.length})` : "Browse Skill Architecture..."}</span>
                        <span className="text-slate-400 text-[10px]">{activeDropdown === 'skills' ? '▲' : '▼'}</span>
                      </div>
                      
                      {activeDropdown === 'skills' && (
                        <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-inner max-h-60 overflow-y-auto p-3 space-y-3 scrollbar-thin">
                           {Object.keys(MASTER_SKILLS_DATA).map(category => (
                             <div key={category} className="space-y-1">
                               <div className="text-[9px] font-black text-[var(--primary)] bg-[var(--accent)] px-2 py-1 rounded border border-[var(--primary)]/10 uppercase tracking-wider block mb-1">{category}</div>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                 {MASTER_SKILLS_DATA[category].map(sub => {
                                   const isSelected = selectedSkills.includes(sub);
                                   return (
                                     <div 
                                       key={sub} 
                                       onClick={() => setSelectedSkills(prev => isSelected ? prev.filter(x => x !== sub) : [...prev, sub])}
                                       className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-[var(--accent)] border-[var(--primary)]/20 text-[var(--primary)]' : 'hover:bg-slate-50 border-transparent text-slate-600 font-medium bg-white'}`}
                                     >
                                       <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white text-[9px] ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-slate-300 bg-white'}`}>{isSelected && "✓"}</div>
                                       <span className="text-[11px] truncate">{sub}</span>
                                     </div>
                                   );
                                 })}
                               </div>
                             </div>
                           ))}
                        </div>
                      )}
                    </div>

                    {/* Block B: Technological Software Stacks Layer */}
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl relative z-20">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Software Infrastructure</span>
                      <div 
                        onClick={() => setActiveDropdown(activeDropdown === 'tech' ? null : 'tech')}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 flex justify-between items-center cursor-pointer shadow-sm hover:border-blue-400/40 transition-colors bg-white"
                      >
                        <span className="truncate text-slate-600 font-semibold">{selectedTechTools.length > 0 ? `Selected Software Tools (${selectedTechTools.length})` : "Map Software Stacks..."}</span>
                        <span className="text-slate-400 text-[10px]">{activeDropdown === 'tech' ? '▲' : '▼'}</span>
                      </div>
                      
                      {activeDropdown === 'tech' && (
                        <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-inner max-h-48 overflow-y-auto p-2 grid grid-cols-2 gap-1.5 scrollbar-thin">
                           {TECH_SKILLS_LIST.map(tool => {
                             const isSelected = selectedTechTools.includes(tool);
                             return (
                               <div 
                                 key={tool} 
                                 onClick={() => setSelectedTechTools(prev => isSelected ? prev.filter(x => x !== tool) : [...prev, tool])}
                                 className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border ${isSelected ? 'bg-blue-50/50 border-blue-200 text-blue-700' : 'border-transparent text-slate-600 font-medium hover:bg-slate-50 bg-white'}`}
                               >
                                 <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white text-[9px] ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>{isSelected && "✓"}</div>
                                 <span className="text-[11px]">{tool}</span>
                               </div>
                             );
                           })}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Part 2: INLINE ACCORDION GRID FOR NOTICE, EXP, LOC (Fixes cramped widths) */}
                  <div className="space-y-4">
                    
                    {/* Notice Timeline Accordion Box */}
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Notice Timeline</span>
                      <div 
                        onClick={() => setActiveDropdown(activeDropdown === 'notice' ? null : 'notice')}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 flex justify-between items-center cursor-pointer shadow-sm bg-white"
                      >
                        <span className="truncate text-slate-600 font-semibold">{selectedNotices.length > 0 ? `Selected Timelines (${selectedNotices.length})` : "Configure Notice Availability..."}</span>
                        <span className="text-slate-400 text-[10px]">{activeDropdown === 'notice' ? '▲' : '▼'}</span>
                      </div>
                      {activeDropdown === 'notice' && (
                        <div className="mt-2 bg-white border border-slate-200 rounded-xl p-2 grid grid-cols-2 gap-2 shadow-inner">
                          {uniqueNotice.map(notice => {
                            const isSelected = selectedNotices.includes(notice);
                            return (
                              <div key={notice} onClick={() => setSelectedNotices(prev => isSelected ? prev.filter(x => x !== notice) : [...prev, notice])} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold ${isSelected ? 'bg-[var(--accent)] border border-[var(--primary)]/20 text-[var(--primary)]' : 'text-slate-700 hover:bg-slate-50'}`}>
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white text-[9px] ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-slate-300 bg-white'}`}>{isSelected && "✓"}</div>
                                <span className="truncate">{notice}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Experience Horizon Accordion Box */}
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Experience Horizon</span>
                      <div 
                        onClick={() => setActiveDropdown(activeDropdown === 'exp' ? null : 'exp')}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 flex justify-between items-center cursor-pointer shadow-sm bg-white"
                      >
                        <span className="truncate text-slate-600 font-semibold">{selectedExps.length > 0 ? `Selected Brackets (${selectedExps.length})` : "Configure Experience Brackets..."}</span>
                        <span className="text-slate-400 text-[10px]">{activeDropdown === 'exp' ? '▲' : '▼'}</span>
                      </div>
                      {activeDropdown === 'exp' && (
                        <div className="mt-2 bg-white border border-slate-200 rounded-xl p-2 grid grid-cols-2 gap-2 shadow-inner">
                          {uniqueExp.map(exp => {
                            const isSelected = selectedExps.includes(exp);
                            return (
                              <div key={exp} onClick={() => setSelectedExps(prev => isSelected ? prev.filter(x => x !== exp) : [...prev, exp])} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold ${isSelected ? 'bg-[var(--accent)] border border-[var(--primary)]/20 text-[var(--primary)]' : 'text-slate-700 hover:bg-slate-50'}`}>
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white text-[9px] ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-slate-300 bg-white'}`}>{isSelected && "✓"}</div>
                                <span>{exp}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Geographic Node Accordion Box */}
                    <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Geographic Node (City)</span>
                      <div 
                        onClick={() => setActiveDropdown(activeDropdown === 'loc' ? null : 'loc')}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 flex justify-between items-center cursor-pointer shadow-sm bg-white"
                      >
                        <span className="truncate text-slate-600 font-semibold">{selectedLocs.length > 0 ? `Selected Cities (${selectedLocs.length})` : "Filter Locations/Cities..."}</span>
                        <span className="text-slate-400 text-[10px]">{activeDropdown === 'loc' ? '▲' : '▼'}</span>
                      </div>
                      {activeDropdown === 'loc' && (
                        <div className="mt-2 bg-white border border-slate-200 rounded-xl p-2 max-h-48 overflow-y-auto grid grid-cols-2 gap-2 shadow-inner scrollbar-thin">
                          {uniqueLocations.map(loc => {
                            const isSelected = selectedLocs.includes(loc);
                            return (
                              <div key={loc} onClick={() => setSelectedLocs(prev => isSelected ? prev.filter(x => x !== loc) : [...prev, loc])} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold ${isSelected ? 'bg-[var(--accent)] border border-[var(--primary)]/20 text-[var(--primary)]' : 'text-slate-700 hover:bg-slate-50'}`}>
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white text-[9px] ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-slate-300 bg-white'}`}>{isSelected && "✓"}</div>
                                <span className="truncate">{loc}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Part 3: Qualifications credentials spectrum layer dropdown block */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className={`space-y-1.5 relative ${activeDropdown === 'qual' ? 'z-50' : 'z-10'}`}>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Academic Credentials Spectrum</label>
                      <div 
                        onClick={() => setActiveDropdown(activeDropdown === 'qual' ? null : 'qual')}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-xs text-slate-800 flex justify-between items-center cursor-pointer shadow-sm hover:border-[var(--primary)]/40 transition-colors bg-white"
                      >
                        <span className="truncate text-slate-600 font-semibold">{selectedQuals.length > 0 ? `Active Qualifications Criteria (${selectedQuals.length})` : "Filter Academic / Degree Levels..."}</span>
                        <span className="text-slate-400 text-[10px]">▼</span>
                      </div>
                      {activeDropdown === 'qual' && (
                        <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] z-50 max-h-44 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
                          {uniqueQuals.map(qual => {
                            const isSelected = selectedQuals.includes(qual);
                            return (
                              <div key={qual} onClick={() => setSelectedQuals(prev => isSelected ? prev.filter(x => x !== qual) : [...prev, qual])} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs font-bold text-slate-700 bg-white">
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white text-[9px] ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>{isSelected && "✓"}</div>
                                <span className="truncate">{qual}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* 💻 NEW FILTER COMPONENT: Custom Interactive Laptop Availability Overlay Dropdown */}
                    <div className={`space-y-1.5 relative ${activeDropdown === 'laptop' ? 'z-50' : 'z-10'}`}>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Hardware / Laptop Asset Status</label>
                      <div 
                        onClick={() => setActiveDropdown(activeDropdown === 'laptop' ? null : 'laptop')}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-xs text-slate-800 flex justify-between items-center cursor-pointer shadow-sm hover:border-[var(--primary)]/40 transition-colors bg-white"
                      >
                        <span className="truncate text-slate-600 font-semibold">{selectedLaptops.length > 0 ? `Laptop Filters Active (${selectedLaptops.length})` : "Filter Laptop Asset..."}</span>
                        <span className="text-slate-400 text-[10px]">{activeDropdown === 'laptop' ? '▲' : '▼'}</span>
                      </div>
                      {activeDropdown === 'laptop' && (
                        <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.12)] z-50 p-2.5 space-y-1">
                          {[
                            { value: "Yes", display: "💻 Laptop Available" },
                            { value: "No", display: "❌ Laptop Not Available" }
                          ].map(opt => {
                            const isSelected = selectedLaptops.includes(opt.value);
                            return (
                              <div 
                                key={opt.value} 
                                onClick={() => setSelectedLaptops(prev => isSelected ? prev.filter(x => x !== opt.value) : [...prev, opt.value])} 
                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-[11px] font-bold text-slate-700 bg-white transition-colors ${isSelected ? 'bg-[var(--accent)] text-[var(--primary)]' : ''}`}
                              >
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white text-[9px] ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-slate-300 bg-white'}`}>{isSelected && "✓"}</div>
                                <span className="truncate">{opt.display}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Part 4: Behavioral Skills Fits Dashboard Block */}
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Behavioral Traits Fitment</span>
                     <div 
                        onClick={() => setActiveDropdown(activeDropdown === 'behavioral' ? null : 'behavioral')}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-xs text-slate-800 flex justify-between items-center cursor-pointer shadow-sm hover:bg-slate-100/40 transition-colors bg-white"
                     >
                        <span className="truncate text-slate-600 font-semibold">{selectedBehavioral.length > 0 ? `Selected Behavioral Traits (${selectedBehavioral.length})` : "Select Soft Skills Preference..."}</span>
                        <span className="text-slate-400 text-[10px]">{activeDropdown === 'behavioral' ? '▲' : '▼'}</span>
                     </div>
                     {activeDropdown === 'behavioral' && (
                        <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-inner max-h-44 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
                           {BEHAVIORAL_SKILLS_LIST.map(behav => {
                              const isSelected = selectedBehavioral.includes(behav);
                              return (
                                 <div key={behav} onClick={() => setSelectedBehavioral(prev => isSelected ? prev.filter(x => x !== behav) : [...prev, behav])} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold ${isSelected ? 'bg-[var(--accent)] border border-[var(--primary)]/20 text-[var(--primary)]' : 'text-slate-700 hover:bg-slate-50'}`}>
                                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white text-[9px] ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-slate-300 bg-white'}`}>{isSelected && "✓"}</div>
                                    <span className="truncate">{behav}</span>
                                 </div>
                              );
                           })}
                        </div>
                     )}
                  </div>


                  {/* 🔥 NEW: Age Range Filter Block */}
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Age Range</span>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["Under 22", "22–25", "26–30", "31–35", "36–40", "Above 40"].map(range => {
                        const isSelected = selectedAgeRanges.includes(range);
                        return (
                          <div
                            key={range}
                            onClick={() => setSelectedAgeRanges(prev => isSelected ? prev.filter(x => x !== range) : [...prev, range])}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-bold border ${isSelected ? 'bg-[var(--accent)] border-[var(--primary)]/20 text-[var(--primary)]' : 'bg-white border-transparent text-slate-700 hover:bg-slate-100'}`}
                          >
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-white text-[9px] ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-slate-300 bg-white'}`}>{isSelected && "✓"}</div>
                            <span>{range} yrs</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pipeline filters counter block tags mapping logs render dashboard */}
                  {activeFiltersCount > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-2 relative z-10">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pipeline Active Token Tags</div>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                        {selectedTypes.map(x => <span key={x} className="bg-[var(--accent)] border border-[var(--primary)]/20 text-[var(--primary)] text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">{x} <button type="button" onClick={() => setSelectedTypes(selectedTypes.filter(i=>i!==x))}>✕</button></span>)}
                        {selectedNotices.map(x => <span key={x} className="bg-[var(--accent)] border border-[var(--primary)]/20 text-[var(--primary)] text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">{x} <button type="button" onClick={() => setSelectedNotices(selectedNotices.filter(i=>i!==x))}>✕</button></span>)}
                        {selectedExps.map(x => <span key={x} className="bg-[var(--accent)] border border-[var(--primary)]/20 text-[var(--primary)] text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">{x} <button type="button" onClick={() => setSelectedExps(selectedExps.filter(i=>i!==x))}>✕</button></span>)}
                        {selectedLocs.map(x => <span key={x} className="bg-[var(--accent)] border border-[var(--primary)]/20 text-[var(--primary)] text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">{x} <button type="button" onClick={() => setSelectedLocs(selectedLocs.filter(i=>i!==x))}>✕</button></span>)}
                        {selectedQuals.map(x => <span key={x} className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 max-w-[150px] truncate">{x} <button type="button" onClick={() => setSelectedQuals(selectedQuals.filter(i=>i!==x))}>✕</button></span>)}
                        {selectedSkills.map(x => <span key={x} className="bg-[var(--primary)] text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 max-w-[150px] truncate">{x} <button type="button" onClick={() => setSelectedSkills(selectedSkills.filter(i=>i!==x))}>✕</button></span>)}
                        {selectedTechTools.map(x => <span key={x} className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">{x} <button type="button" onClick={() => setSelectedTechTools(selectedTechTools.filter(i=>i!==x))}>✕</button></span>)}
                        {selectedBehavioral.map(x => <span key={x} className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">{x} <button type="button" onClick={() => setSelectedBehavioral(selectedBehavioral.filter(i=>i!==x))}>✕</button></span>)}
                        {selectedWorkModes.map(x => <span key={x} className="bg-gray-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">{x} <button type="button" onClick={() => setSelectedWorkModes(selectedWorkModes.filter(i=>i!==x))}>✕</button></span>)}
                        {selectedLaptops.map(x => <span key={x} className="bg-[var(--primary)] text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">{x === 'Yes' ? '💻 Laptop' : '❌ No Laptop'} <button type="button" onClick={() => setSelectedLaptops(selectedLaptops.filter(i=>i!==x))}>✕</button></span>)}
                        {selectedAgeRanges.map(x => <span key={x} className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">📅 {x} yrs <button type="button" onClick={() => setSelectedAgeRanges(selectedAgeRanges.filter(i=>i!==x))}>✕</button></span>)}
                      </div>
                    </div>
                  )}

                </div>

                {/* Filter Drawer Footer */}
                <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--surface)] flex items-center gap-3 shrink-0 sticky bottom-0 z-20">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTypes([]); setSelectedExps([]); setSelectedLocs([]); setSelectedNotices([]); setSelectedQuals([]);
                      setSelectedSkills([]); setSelectedBehavioral([]); setSelectedTechTools([]); setSelectedWorkModes([]);
                      setSelectedRelocation([]); setSelectedGenders([]); setSelectedLaptops([]); setSelectedProfileJobTypes([]); setSelectedContractOpenness([]); setSelectedAgeRanges([]); setActiveDropdown(null);
                    }}
                    className="flex-1 py-2.5 bg-white border border-[var(--border)] text-[var(--muted-foreground)] font-semibold rounded-lg text-sm hover:bg-[var(--surface)] transition-all"
                  >
                    Reset All
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsFilterDrawerOpen(false); setActiveDropdown(null); }}
                    className="flex-[1.5] py-2.5 bg-[var(--primary)] text-white font-semibold rounded-lg text-sm hover:bg-[var(--primary-glow)] shadow-[var(--shadow-primary)] transition-all text-center"
                  >
                    Apply ({filteredCandidates.length} Found)
                  </button>
                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>

      {/* 🚀 CANDIDATES GRID / LIST 🚀 */}
     <div 
        className={viewMode === 'grid' ? "grid gap-5 items-stretch" : "flex flex-col gap-3"}
        style={viewMode === 'grid' ? { gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' } : undefined}
      >
          <AnimatePresence>
            {(activeTab === 'assigned' ? assignedList : hiredList).map((candidate, index) => {
              const aiScore = candidate.meta?.totalScore || 0;
              const warnings = candidate.meta?.warningsCount || 0;
              const integrityScore = Math.max(0, 100 - warnings * 20);
              const isClean = integrityScore === 100;
              const roleTitle = normalizeQualification(candidate.highestQualification || candidate.educations?.[0]?.qualification || candidate.qualification);

             const statusMap: Record<string, { label: string; cls: string }> = {
                interview_requested: { label: "Awaiting Meet Link",              cls: "bg-blue-50 text-blue-700 border-blue-200" },
                shortlisted:    { label: "Meet Link Ready",                    cls: "bg-cyan-50 text-cyan-700 border-cyan-200" },
                hire_requested: { label: "Pending Admin Approval",             cls: "bg-amber-50 text-amber-700 border-amber-200" },
                hired:          { label: "Hired ✓",                            cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              };
              const status = statusMap[candidate.hired_status];

              return (
               <motion.div 
                  key={candidate.id} 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="block"
                >
                  {/* ===================== LIST VIEW ===================== */}
                  {viewMode === 'list' ? (
                    <div className="relative bg-white border border-[var(--border)] rounded-xl shadow-soft hover:shadow-elevated hover:border-[var(--primary)]/25 transition-all duration-200 overflow-hidden group">
                      {status && (
                        <div className={`px-4 py-1 text-[8px] font-black tracking-widest uppercase flex items-center gap-1.5 border-b ${status.cls}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-80" />
                          {status.label}
                        </div>
                      )}
                      {/* Mobile: stack, Laptop: single row */}
                      <div className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">

                        {/* Row 1 mobile: checkbox + avatar + identity */}
                        <div className="flex items-center gap-3 md:contents">

                          {/* Checkbox */}
                          <div
                            onClick={(e) => { e.stopPropagation(); toggleExcelSelection(candidate.id); }}
                            className={`shrink-0 w-4.5 h-4.5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${selectedForExcel.includes(candidate.id) ? 'bg-[var(--primary)] border-[var(--primary)]' : 'bg-white border-[var(--border)] hover:border-[var(--primary)]'}`}
                          >
                            {selectedForExcel.includes(candidate.id) && (
                              <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm">RM</div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-[var(--primary)]/10 flex items-center justify-center shadow-sm">
                              <ShieldCheck size={8} className="text-[var(--primary)]" />
                            </div>
                          </div>

                          {/* Identity */}
                          <div className="min-w-0 md:w-44 md:shrink-0">
                             <h3 className="text-sm font-black text-slate-900 truncate group-hover:text-[var(--primary)] transition-colors">{(() => { let qp="PR"; if(candidate.highestQualification){const hq=candidate.highestQualification.toLowerCase(); if(hq.includes('ca ')||hq.includes('ca-')||hq==='ca'||hq.includes('chartered accountant'))qp="CA"; else if(hq.includes('cma')||hq.includes('cost & management'))qp="CM"; else if(hq.includes('cs ')||hq.includes('cs-')||hq==='cs'||hq.includes('company secretary'))qp="CS"; else if(hq.includes('acca'))qp="AC"; else if(hq.includes('mba')||hq.includes('pgdm'))qp="MB"; else if(hq.includes('b.tech')||hq.includes('btech')||hq.includes('b.e.'))qp="BT"; else if(hq.includes('m.com')||hq.includes('mcom'))qp="MC"; else if(hq.includes('b.com')||hq.includes('bcom')||hq.includes('bba'))qp="BC"; else if(hq.includes('diploma')||hq.includes('polytechnic'))qp="DP"; else if(hq.includes('high school')||hq.includes('12th')||hq.includes('puc'))qp="HS"; else qp="GD";} return candidate.id?`RM-${qp}-${candidate.id.toUpperCase()}`:'N/A';})()}</h3>
                            <p className="text-[10px] font-bold text-[var(--primary)] truncate">{roleTitle}</p>
                            <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-0.5">
                              <MapPin size={8} className="text-slate-400"/> {candidate.city || "Remote"}
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                          {candidate.skills?.slice(0, 4).map((skill: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded text-[8px] font-bold whitespace-nowrap">{skill}</span>
                          ))}
                          {candidate.skills?.length > 4 && <span className="px-2 py-0.5 bg-white text-slate-400 rounded border border-slate-100 text-[8px] font-bold">+{candidate.skills.length - 4}</span>}
                        </div>



                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          {activeTab === 'assigned' && (
                            <>
                              <button type="button" onClick={() => router.push(`/company/student/${candidate.id}`)} className="text-[9px] font-bold py-1.5 px-3 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm rounded-lg h-7 flex items-center gap-1 cursor-pointer">
                                <FileText size={10} className="opacity-70"/> Profile
                              </button>
                              <button type="button" onClick={() => openInterviewModal(candidate)} className="text-[9px] font-bold py-1.5 px-3 bg-white border border-slate-200 text-slate-600 hover:text-[var(--primary)] hover:bg-[var(--accent)] shadow-sm rounded-lg h-7 flex items-center gap-1 cursor-pointer">
                                <Video size={10} className="opacity-70"/> Interview
                              </button>
                              <button type="button" onClick={() => requestHire(candidate)} className="text-[9px] font-bold py-1.5 px-3 bg-[var(--primary)] hover:bg-[var(--primary-glow)] text-white shadow-sm rounded-lg h-7 flex items-center gap-1 cursor-pointer">
                                 <Zap size={10}/> Quick Hire (Without Interview)
                              </button>
                            </>
                          )}
                          {activeTab === 'hired' && (
                            <>
                              <button type="button" onClick={() => router.push(`/company/student/${candidate.id}`)} className="text-[9px] font-bold py-1.5 px-3 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm rounded-lg h-7 flex items-center cursor-pointer">Profile</button>
                              {candidate.hired_status === 'interview_requested' && <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-3 rounded-lg h-7 flex items-center gap-1"><Clock size={10}/> Awaiting</span>}
                              {candidate.hired_status === 'shortlisted' && (
                                <>
                                  <button type="button" onClick={() => window.open(candidate.meet_link || "https://meet.google.com", "_blank")} className="text-[9px] font-bold py-1.5 px-3 bg-white border border-blue-200 text-blue-700 shadow-sm rounded-lg h-7 flex items-center gap-1 hover:bg-blue-50 cursor-pointer"><Video size={10}/> Meet</button>
                                  <button type="button" onClick={() => requestHire(candidate)} className="text-[9px] font-bold py-1.5 px-3 bg-[var(--primary)] text-white shadow-sm rounded-lg h-7 flex items-center gap-1 hover:bg-[var(--primary-glow)] cursor-pointer"><Zap size={10}/> Hire</button>
                                </>
                              )}
                              {candidate.hired_status === 'hired' && !candidate.company_rating && (
                                <button type="button" onClick={() => {setReviewStudent(candidate); setShowReviewModal(true);}} className="text-[9px] font-bold py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-white shadow-sm rounded-lg h-7 flex items-center gap-1 cursor-pointer"><Star size={10}/> Rate</button>
                              )}
                              {candidate.hired_status === 'hired' && candidate.company_rating && (
                                <div className="flex gap-0.5">{[1,2,3,4,5].map(star => <Star key={star} size={10} fill={star <= candidate.company_rating ? "#D97706" : "none"} className={star <= candidate.company_rating ? "text-amber-500" : "text-slate-300"}/>)}</div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                  /* ===================== GRID VIEW (original) ===================== */
                 <div className="relative flex flex-col bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group hover:border-[var(--primary)]/30">
                    
                    {/* Status Strip (If Any) */}
                    {status && (
                      <div className={`px-4 py-1.5 text-[9px] font-black tracking-widest uppercase flex items-center justify-center gap-1.5 border-b ${status.cls}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-80" />
                        {status.label}
                      </div>
                    )}

                    <div className="p-5 flex flex-col relative z-10">
                      
                      {/* 1. Header: Avatar & Name */}
                      <div className="flex items-start gap-3 mb-4">
                       {/* ✅ Per-card export checkbox — premium */}
                        <div
                          onClick={(e) => { e.stopPropagation(); toggleExcelSelection(candidate.id); }}
                          className={`absolute top-3 right-3 z-20 w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm ${
                            selectedForExcel.includes(candidate.id)
                              ? 'bg-[var(--primary)] border-[var(--primary)] shadow-[var(--primary)]/30'
                              : 'bg-white/90 border-slate-300 hover:border-[var(--primary)] backdrop-blur-sm'
                          }`}
                        >
                          {selectedForExcel.includes(candidate.id) && (
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                              <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-[var(--primary)]/20">
                            RM
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-white border border-[var(--primary)]/10 flex items-center justify-center shadow-sm" title="AI Proctored">
                            <ShieldCheck size={10} className="text-[var(--primary)]" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                         <h3 className="text-sm font-black text-slate-900 truncate group-hover:text-[var(--primary)] transition-colors leading-tight">{(() => { let qp="PR"; if(candidate.highestQualification){const hq=candidate.highestQualification.toLowerCase(); if(hq.includes('ca ')||hq.includes('ca-')||hq==='ca'||hq.includes('chartered accountant'))qp="CA"; else if(hq.includes('cma')||hq.includes('cost & management'))qp="CM"; else if(hq.includes('cs ')||hq.includes('cs-')||hq==='cs'||hq.includes('company secretary'))qp="CS"; else if(hq.includes('acca'))qp="AC"; else if(hq.includes('mba')||hq.includes('pgdm'))qp="MB"; else if(hq.includes('b.tech')||hq.includes('btech')||hq.includes('b.e.'))qp="BT"; else if(hq.includes('m.com')||hq.includes('mcom'))qp="MC"; else if(hq.includes('b.com')||hq.includes('bcom')||hq.includes('bba'))qp="BC"; else if(hq.includes('diploma')||hq.includes('polytechnic'))qp="DP"; else if(hq.includes('high school')||hq.includes('12th')||hq.includes('puc'))qp="HS"; else qp="GD";} return candidate.id?`RM-${qp}-${candidate.id.substring(0,8).toUpperCase()}`:'N/A';})()}</h3>
                          <p className="text-[11px] font-bold text-[var(--primary)] mt-0.5 truncate">{roleTitle}</p>
                          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><MapPin size={10} className="text-slate-400" /> {candidate.city || "Remote"}</span>
                          </div>
                        </div>
                      </div>

                     {/* 2. Compact Skills List — single line, fixed height */}
                      <div className="flex items-center gap-1.5 mb-5 overflow-hidden h-[22px]">
                        {candidate.skills?.slice(0, 2).map((skill: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded text-[9px] font-bold whitespace-nowrap shrink-0">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills?.length > 2 && (
                          <span className="px-2 py-0.5 bg-white text-slate-400 rounded border border-slate-100 text-[9px] font-bold shrink-0">
                            +{candidate.skills.length - 2}
                          </span>
                        )}
                      </div>
                      {/* 3. Sleek Metrics Grid */}
                      <div className="grid grid-cols-2 gap-2 mb-5">
                         {/* Age */}
                         <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 flex justify-between items-center col-span-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Age</span>
                            <span className="text-xs font-black text-slate-800">
                              {candidate.dob ? `${new Date().getFullYear() - new Date(candidate.dob).getFullYear()} yrs` : "N/A"}
                            </span>
                         </div>
                         {/* Experience */}
                         <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 flex justify-between items-center col-span-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Exp.</span>
                            <span className="text-xs font-black text-slate-800">{candidate.experience || "N/A"}</span>
                         </div>
                         {/* Gender */}
                         <div className="col-span-2 bg-slate-50 rounded-lg p-2.5 border border-slate-100 flex justify-between items-center">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gender</span>
                            <span className="text-xs font-black text-slate-800">{candidate.gender || "N/A"}</span>
                         </div>
                      </div>

                      {/* 4. Actions Area */}
                      {/* ✅ FIX: removed mt-auto — no more forced push to bottom */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                        
                        {activeTab === 'assigned' && (
                          <>
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" onClick={() => router.push(`/company/student/${candidate.id}`)} className="flex-1 text-[10px] py-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm rounded-lg h-8">
                                <FileText size={12} className="mr-1.5 opacity-70" /> Profile
                              </Button>
                              <Button variant="secondary" onClick={() => openInterviewModal(candidate)} className="flex-1 text-[10px] py-2 bg-white border border-slate-200 text-slate-600 hover:text-[var(--primary)] hover:border-[var(--primary)]/30 hover:bg-[var(--accent)] shadow-sm rounded-lg h-8">
                                <Video size={12} className="mr-1.5 opacity-70" /> Interview
                              </Button>
                            </div>
                            <Button variant="primary" onClick={() => requestHire(candidate)} className="w-full text-[11px] py-2 bg-[var(--primary)] hover:bg-[var(--primary-glow)] text-white shadow-sm shadow-[var(--primary)]/20 rounded-lg h-9">
                              <Zap size={12} className="mr-1.5" /> Quick Hire (Without Interview)
                            </Button>
                          </>
                        )}

                        {activeTab === 'hired' && (
                          <div className="flex flex-col gap-2">
                            <Button variant="secondary" onClick={() => router.push(`/company/student/${candidate.id}`)} className="w-full text-[10px] py-2 bg-white border border-slate-200 shadow-sm rounded-lg h-8">
                               Profile & Report
                            </Button>

                            {/* 🔥 AWAITING LINK STATE 🔥 */}
                            {candidate.hired_status === 'interview_requested' && (
                               <div className="w-full text-[11px] py-2 bg-slate-100 text-slate-500 font-bold rounded-lg text-center h-9 flex items-center justify-center">
                                 <Clock size={12} className="mr-1.5" /> Awaiting Admin
                               </div>
                            )}
                            
                            {/* 🔥 GOOGLE MEET READY STATE 🔥 */}
                            {candidate.hired_status === 'shortlisted' && (
                              <div className="flex gap-2">
                                 <Button variant="primary" onClick={() => window.open(candidate.meet_link || "https://meet.google.com", "_blank")} className="flex-[1.2] text-[11px] py-2 bg-[var(--primary)] text-white shadow-sm shadow-[var(--primary)]/20 rounded-lg h-9 hover:bg-[var(--primary-glow)]">
                                    <Video size={12} className="mr-1" /> Join Meet
                                 </Button>
                                <Button variant="primary" onClick={() => requestHire(candidate)} className="flex-[1.2] text-[11px] py-2 bg-[var(--primary)] text-white shadow-sm shadow-[var(--primary)]/20 rounded-lg h-9 hover:bg-[var(--primary-glow)]">
                                    <Zap size={12} className="mr-1.5" /> Official Hire
                                  </Button>
                              </div>
                            )}
                            
                            {candidate.hired_status === 'hired' && !candidate.company_rating && (
                               <Button variant="primary" onClick={() => {setReviewStudent(candidate); setShowReviewModal(true);}} className="w-full text-[11px] py-2 bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 rounded-lg h-9">
                                 <Star size={12} className="mr-1.5"/> Rate Work
                               </Button>
                            )}

                            {candidate.hired_status === 'hired' && candidate.company_rating && (
                               <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
                                 <div className="flex gap-0.5">
                                   {[1,2,3,4,5].map(star => <Star key={star} size={10} fill={star <= candidate.company_rating ? "#D97706" : "none"} className={star <= candidate.company_rating ? "text-amber-500" : "text-slate-300"}/>)}
                                 </div>
                               </div>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
               )} {/* end grid/list ternary */}
                </motion.div>
              );
            })}
          </AnimatePresence>
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

      {/* 🔥 INTERVIEW DATE & TIME MODAL 🔥 */}
      {showInterviewModal && interviewStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center shadow-inner">
                <Video size={24}/>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">Schedule Meet</h3>
                <p className="text-slate-500 font-medium text-xs">for RM-{interviewStudent.id?.substring(0, 6).toUpperCase()}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {/* Option Slot 1 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[9px] font-black text-[var(--primary)] bg-[var(--accent)] px-2 py-0.5 rounded border border-[var(--primary)]/10 uppercase tracking-wider">Option Slot 1</span>
                <div className="grid grid-cols-2 gap-2">
                   <input type="date" id="slot1_date" className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[var(--primary)] [color-scheme:light]" />
                   <input type="time" id="slot1_time" className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[var(--primary)] [color-scheme:light]" />
                </div>
              </div>

              {/* Option Slot 2 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Option Slot 2</span>
                <div className="grid grid-cols-2 gap-2">
                   <input type="date" id="slot2_date" className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[var(--primary)] [color-scheme:light]" />
                   <input type="time" id="slot2_time" className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[var(--primary)] [color-scheme:light]" />
                </div>
              </div>

              {/* Option Slot 3 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Option Slot 3</span>
                <div className="grid grid-cols-2 gap-2">
                   <input type="date" id="slot3_date" className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[var(--primary)] [color-scheme:light]" />
                   <input type="time" id="slot3_time" className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[var(--primary)] [color-scheme:light]" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setShowInterviewModal(false)} className="flex-1 py-3">Cancel</Button>
              <Button variant="primary" onClick={submitInterviewRequest} className="flex-[1.5] py-3 bg-[var(--primary)] hover:bg-[var(--primary-glow)] shadow-md shadow-[var(--primary)]/20 text-white">
                Request Admin
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* REVIEW MODAls */}
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

               <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write a brief professional feedback (Optional but recommended)..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 placeholder:text-slate-400 focus:border-[var(--primary)] focus:bg-white outline-none min-h-[120px] mb-6 shadow-sm font-medium"/>

               <div className="flex gap-4">
                  <Button variant="secondary" onClick={() => {setShowReviewModal(false); setRating(0);}} className="flex-1 py-3">Cancel</Button>
                  <Button variant="primary" onClick={submitReview} className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white">Submit Review</Button>
               </div>
            </Card>
         </div>
      )}

      
      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-[var(--border)] shadow-[0_-2px_12px_oklch(0.20_0.025_245/0.06)] pb-[env(safe-area-inset-bottom)] z-50 print:hidden">
        <div className="flex justify-evenly items-center px-2 py-2">
          
          <div onClick={() => setActiveTab('assigned')} className={`flex flex-col items-center gap-1 p-2 cursor-pointer w-20 relative ${activeTab === 'assigned' ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
            <div className={`p-2 rounded-xl ${activeTab === 'assigned' ? 'bg-[var(--accent)]' : ''}`}><LayoutDashboard size={20} /></div>
            <span className="text-[10px] font-bold mt-0.5">Talent Pool</span>
          </div>

          <div onClick={() => setActiveTab('hired')} className={`flex flex-col items-center gap-1 p-2 cursor-pointer w-20 relative ${activeTab === 'hired' ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}>
            <div className={`p-2 rounded-xl ${activeTab === 'hired' ? 'bg-[var(--accent)]' : ''}`}><BriefcaseIcon size={20} /></div>
            <span className="text-[10px] font-bold mt-0.5">My Pipeline</span>
            {pendingReviews.length > 0 && (
              <span className="absolute top-2 right-4 bg-amber-500 w-2 h-2 rounded-full border border-white" />
            )}
          </div>

          <div onClick={() => router.push('/company/profile')} className="flex flex-col items-center gap-1 p-2 text-[var(--muted-foreground)] cursor-pointer w-20">
            <div className="p-2 rounded-xl"><UserCircle size={20} /></div>
            <span className="text-[10px] font-bold mt-0.5">Profile</span>
          </div>

          <div onClick={handleLogout} className="flex flex-col items-center gap-1 p-2 text-[var(--muted-foreground)] hover:text-[#c53030] cursor-pointer w-20">
            <div className="p-2 rounded-xl"><LogOut size={20} /></div>
            <span className="text-[10px] font-bold mt-0.5">Logout</span>
          </div>

        </div>
      </div>

    </div>
  );
}