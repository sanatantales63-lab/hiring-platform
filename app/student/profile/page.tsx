"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MapPin, Briefcase, 
  Edit, Save, Phone, Camera, Loader2, ArrowLeft, 
  GraduationCap, ChevronRight, ChevronLeft, Sparkles, Plus, X, Check, Globe, FileText, Search, ShieldAlert, PlayCircle, Target, TrendingUp, TrendingDown, ScanFace, Award, ImagePlus, Users, Monitor
} from "lucide-react";
import CandidateProfileView from "@/app/components/CandidateProfileView";
import { QUALIFICATIONS_LIST } from "@/lib/constants";

// 🔥 UPDATED EXCEL MASTER SKILLS DATA 🔥
const MASTER_SKILLS_DATA: Record<string, string[]> = {
  "Financiacial Reporting and Accounting": [
      "Accounting & Bookkeeping", "Accounting Standards (AS)", "Accounts Payable Assistance", 
      "Accounts Receivables Assistaance", "Business Combinations Accounting", "Consolidation of Accounts", 
      "Ind AS Accounting", "US GAAP"
  ],
  "Internal Audit & Risk assessment & testing": [
      "AML Investigation Techniques", "Contractual Compliance Testing", "Corporate governance framework assessment", 
      "Digital Forensic Investigation", "Fraud Risk Assessment Models", "Internal Audit", "Internal Control Testing", 
      "IT and Data Analytics", "Litigation Support Reporting", "RCM Prepration", "SOP Preparation & Implementation", 
      "SOX Audit"
  ],
  "Statutory Audit & Compliances": [
      "Audit Assistance for Companies", "Audit Documentation", "Audit Observations Correction", 
      "Audit Reports Drafting", "Bank Audit", "Compliance & Legal Verifications", "Concurrent Audit", 
      "Control Testing", "Financial Due Diligence Audit", "Group Audit", "NBFCs Audit", "Physical Verification"
  ],
  "Direct & International Taxation": [
      "Cross-Border Structuring", "GAAR", "Income Tax Return Preparation and Filing", 
      "MAT-AMT Calculation", "Permanent Establishment", "Tax Audit", "Tax Structuring Advisory", 
      "Tax Treaty", "TDS-TCS Filling", "Transfer Pricing"
  ],
  "Indirect Taxation & Transaction Taxes": [
      "Customs Valuation", "E-Invoicing Compliance", "E-Way Bill", "GST Audit", 
      "GST Reconciliation", "GST Return Filing", "Input Tax Credit Optimisation", 
      "M&A Tax Due Diligence", "Refund Claim Processing"
  ],
  "Costing & Strategic Cost Management": [
      "Break-Even Analysis & Optimization", "Job Costing", "Kaizen Costing", "Lean Accounting", 
      "Life-Cycle Costing", "MIS For Cost Analysis", "MIS For Variance Analysis", 
      "Process Costing", "Target Costing"
  ],
  "Financial Modeling & Valuation Engineering": ["Three-Statement Integrated Modeling", "Dynamic Scenario Simulation", "Sensitivity Matrix Design", "DCF Valuation Construction", "Comparable Company Analysis", "Precedent Transaction Analysis", "Leveraged Buyout Modeling", "Project Finance Modeling", "Startup Valuation", "Model Audit"],
  "Investment & Portfolio Analytics": ["Equity Valuation Frameworks", "Fixed Income Duration Analysis", "Credit Spread Modeling", "Alternative Asset Evaluation", "Hedge Fund Performance", "Portfolio Optimisation (Markowitz)", "CAPM & Multifactor Modeling", "Derivatives Pricing Models"],
  "Treasury & Corporate Liquidity Management": ["Bank Reconcilations", "Treasury operation management", "Working Capital Structuring", "Cash Forecasting Architecture", "Bank Relationship Management", "Foreign Exchange Exposure Hedging", "Interest Rate Swap Structuring", "Debt Issuance Strategy"],
  "Corporate Law, Governance & Secretarial Practice": ["Company Incorporation", "MCA filings", "MOA/AOA/Deeds drafting", "Compliance Checklist drafting", "Companies Act Compliance", "Board Process Advisory", "SEBI Listing Regulations", "Insider Trading Compliance", "Secretarial Audit Execution", "FEMA Compliance"],
  "Information Systems Audit & IT Governance": ["ITGC Testing", "ERP Control Mapping", "Access Rights Review", "Cybersecurity Audit", "Data Integrity Verification", "SOC Report Evaluation", "Cloud Risk Assessment", "Change Management Audit", "Business Continuity System Review"],
  "Insolvency, Restructuring & Distressed Advisory": ["CIRP Process Management", "Resolution Plan Evaluation", "Liquidation Waterfall Distribution", "Forensic Transaction Review", "Avoidance Transaction Analysis", "Insolvency Law Compliance", "Revival Feasibility Assessment", "Debt Restructuring Modeling"],
  "Wealth Management & Financial Planning": ["Retirement Corpus Planning", "Estate Planning Structuring", "Tax-Efficient Investment Strategy", "Insurance Planning", "Succession Planning", "Client Risk Profiling", "Portfolio Rebalancing Strategy"],
  "Financial Operations & Process Optimization": ["Procure-To-Pay Cycle Control", "Order-To-Cash Optimization", "Record-To-Report Efficiency", "Financial Close Acceleration", "Shared Services Setup", "ERP Migration Planning", "Internal SOP Drafting", "Process Automation Evaluation"]
};

// 🔥 PRESET BEHAVIORAL SKILLS LIST 🔥
const BEHAVIORAL_SKILLS_LIST = [
    "Leadership", "Team Management", "Communication Skills", "Problem Solving", 
    "Critical Thinking", "Adaptability & Flexibility", "Time Management", 
    "Work Ethic", "Conflict Resolution", "Emotional Intelligence", "Decision Making",
    "Client Relationship Management", "Strategic Planning"
];

// 🔥 PRESET TECHNOLOGICAL SKILLS LIST 🔥
const TECH_SKILLS_LIST = [
    "Advanced Excel", "Tally Prime", "SAP FICO", "MS Word", "MS PowerPoint", 
    "Power BI", "Tableau", "Oracle ERP", "QuickBooks", "Zoho Books", 
    "SQL", "Python for Finance", "Macros & VBA"
];

const fetchLegalProof = async () => {
  let ip = "Unknown IP";
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    ip = data.ip;
  } catch (err) {
    console.warn("Could not fetch IP", err);
  }
  return {
    consent_timestamp: new Date().toISOString(),
    consent_ip: ip,
    consent_browser: typeof navigator !== 'undefined' ? navigator.userAgent : "Unknown Browser"
  };
};

export default function CandidateProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false); 
  const [showGatekeeper, setShowGatekeeper] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingData, setSavingData] = useState(false); 
  const [currentStep, setCurrentStep] = useState(1);
  const [userEmail, setUserEmail] = useState("");
  
  const [showCamera, setShowCamera] = useState(false);
  const [aiModelsLoaded, setAiModelsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: "", 
    dob: "", 
    gender: "", 
    phone: "", 
    photoURL: "", 
    addressLine: "", 
    city: "", 
    state: "", 
    pincode: "", 
    willingToRelocate: "No",
    panCard: "", 
    bio: "", 
    educations: [{ qualification: "", collegeName: "", passingYear: "", percentage: "", stageCleared: "", attempts: "", mathsIncluded: "", mathsScore: "" }], 
    workExperience: [] as { company: string, role: string, duration: string }[],
    achievements: [] as { title: string, description: string, imageURL: string }[], 
    languages: [] as { language: string; proficiency: string }[],
    skills: [] as string[],
    behavioralSkills: [] as string[], 
    technologicalSkills: [] as { name: string, level: string }[], 
    strengths: [] as string[],
    weaknesses: [] as string[],
    preferredLocations: [] as string[],
    experience: "Fresher", 
    currentStatus: "Unemployed", 
    noticePeriod: "Immediate", 
    currentSalary: "", 
    expectedSalary: "", 
    workMode: "On-site", 
    jobType: "Permanent Role", 
    openToContractRoles: "", 
    availabilityDuration: "",
    resumeURL: ""
  });

  const [locInput, setLocInput] = useState("");
  const [strInput, setStrInput] = useState("");
  const [weakInput, setWeakInput] = useState("");
  const [behavInput, setBehavInput] = useState("");
  const [techInput, setTechInput] = useState(""); 
  
  const [activeSkillTab, setActiveSkillTab] = useState(Object.keys(MASTER_SKILLS_DATA)[0]);

  useEffect(() => {
    const loadFaceAPI = async () => {
      if (typeof window !== 'undefined' && !(window as any).faceapi) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/dist/face-api.js";
        script.async = true;
        script.onload = async () => {
            try {
                await (window as any).faceapi.nets.tinyFaceDetector.loadFromUri('https://vladmandic.github.io/face-api/model/');
                setAiModelsLoaded(true);
            } catch (e) { console.warn("FaceAPI models failed to load", e); }
        };
        document.body.appendChild(script);
      } else if ((window as any).faceapi) {
          setAiModelsLoaded(true);
      }
    };
    loadFaceAPI();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { 
        router.push("/student/login"); 
        return; 
      }
      setUserEmail(session.user.email || "");
      
      try {
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    
        if (data && data.fullName) {
          setFormData({ 
            ...formData, 
            ...data,
            bio: data.bio || "", 
            panCard: data.panCard || "",
            currentSalary: data.currentSalary || "", 
            expectedSalary: data.expectedSalary || "",
            jobType: data.jobType || "Permanent Role",
            openToContractRoles: data.openToContractRoles === true ? "Yes" : (data.openToContractRoles === false ? "No" : ""),
            educations: data.educations?.length ? data.educations : formData.educations,
            workExperience: data.workExperience || [],
            achievements: data.achievements || [],
            languages: Array.isArray(data.languages) ? data.languages.filter((l:any) => typeof l === 'object' && l !== null && l.language) : [],
            preferredLocations: data.preferredLocations?.length ? data.preferredLocations : [],
            skills: Array.isArray(data.skills) ? data.skills.filter((s:any) => typeof s === 'string') : [],
            behavioralSkills: Array.isArray(data.behavioralSkills) ? data.behavioralSkills.filter((s:any) => typeof s === 'string') : [],
            technologicalSkills: Array.isArray(data.technologicalSkills) ? data.technologicalSkills.map((s:any) => typeof s === 'string' ? { name: s, level: 'Beginner' } : s) : [],
            strengths: Array.isArray(data.strengths) ? data.strengths : [],
            weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : []
          });

          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('step') === '4') {
             setIsEditing(true); 
             setShowGatekeeper(false); 
             setCurrentStep(4);
             setIsOnboarding(true); 
          } else {
             setIsEditing(false); 
             setShowGatekeeper(false); 
             setIsOnboarding(false);
          }
        } else { 
          setIsEditing(true);
          setShowGatekeeper(true); 
          setIsOnboarding(true);
        }
      } catch (e) {
         console.error(e);
      } finally { 
        setLoading(false); 
      }
    };
    fetchProfile();
  }, [router]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleAddLocation = (e: any) => {
    if (e.key === 'Enter' && locInput.trim() !== '') {
      e.preventDefault();
      if (!formData.preferredLocations.includes(locInput.trim())) {
          setFormData(p => ({ ...p, preferredLocations: [...p.preferredLocations, locInput.trim()] }));
      }
      setLocInput("");
    }
  };

  const removeLocation = (loc: string) => {
      setFormData(p => ({ ...p, preferredLocations: p.preferredLocations.filter(l => l !== loc) }));
  };

  const handleAddStr = (e: any) => {
    if (e.key === 'Enter' && strInput.trim() !== '') {
      e.preventDefault();
      if (!formData.strengths.includes(strInput.trim())) {
          setFormData(p => ({ ...p, strengths: [...p.strengths, strInput.trim()] }));
      }
      setStrInput("");
    }
  };

  const removeStr = (val: string) => setFormData(p => ({ ...p, strengths: p.strengths.filter(l => l !== val) }));

  const handleAddWeak = (e: any) => {
    if (e.key === 'Enter' && weakInput.trim() !== '') {
      e.preventDefault();
      if (!formData.weaknesses.includes(weakInput.trim())) {
          setFormData(p => ({ ...p, weaknesses: [...p.weaknesses, weakInput.trim()] }));
      }
      setWeakInput("");
    }
  };

  const removeWeak = (val: string) => setFormData(p => ({ ...p, weaknesses: p.weaknesses.filter(l => l !== val) }));

  const handleAddBehavioralSkill = (e: any) => {
      if (e.key === 'Enter' && behavInput.trim() !== '') {
          e.preventDefault();
          const newSkill = behavInput.trim();
          if (!formData.behavioralSkills.includes(newSkill)) {
              if (formData.behavioralSkills.length >= 5) {
                  alert("🛑 You can select a maximum of 5 Behavioral Skills.");
                  return;
              }
              setFormData(p => ({ ...p, behavioralSkills: [...p.behavioralSkills, newSkill] }));
          }
          setBehavInput("");
      }
  };

  const removeBehavioralSkill = (skill: string) => {
      setFormData(p => ({ ...p, behavioralSkills: p.behavioralSkills.filter(s => s !== skill) }));
  };

  const handleAddTechSkill = (e: any) => {
      if (e.key === 'Enter' && techInput.trim() !== '') {
          e.preventDefault();
          const newSkillName = techInput.trim();
          const exists = formData.technologicalSkills.find(s => s.name.toLowerCase() === newSkillName.toLowerCase());
          if (!exists) {
              if (formData.technologicalSkills.length >= 8) {
                  alert("🛑 You can select a maximum of 8 Technological Skills.");
                  return;
              }
              setFormData(p => ({ ...p, technologicalSkills: [...p.technologicalSkills, { name: newSkillName, level: "Beginner" }] }));
          }
          setTechInput("");
      }
  };

  const removeTechSkill = (skillName: string) => {
      setFormData(p => ({ ...p, technologicalSkills: p.technologicalSkills.filter(s => s.name !== skillName) }));
  };

  const updateTechSkillLevel = (skillName: string, level: string) => {
      setFormData(p => ({
          ...p,
          technologicalSkills: p.technologicalSkills.map(s => s.name === skillName ? { ...s, level } : s)
      }));
  };

  const addEducation = () => {
      setFormData(p => ({ ...p, educations: [...p.educations, { qualification: "", collegeName: "", passingYear: "", percentage: "", stageCleared: "", attempts: "", mathsIncluded: "", mathsScore: "" }] }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...formData.educations];
    newEdu[index] = { ...newEdu[index], [field]: value }; 
    if (field === 'mathsIncluded' && value !== 'Yes') {
        newEdu[index].mathsScore = "";
    }
    setFormData(p => ({ ...p, educations: newEdu }));
  };

  const removeEducation = (index: number) => {
    if (formData.educations.length === 1) return;
    const newEdu = [...formData.educations];
    newEdu.splice(index, 1); 
    setFormData(p => ({ ...p, educations: newEdu }));
  };

  const addWorkExp = () => {
      setFormData(p => ({ ...p, workExperience: [...p.workExperience, { company: "", role: "", duration: "" }] }));
  };

  const updateWorkExp = (index: number, field: string, value: string) => { 
      const newWork = [...formData.workExperience];
      newWork[index] = { ...newWork[index], [field]: value }; 
      setFormData(p => ({ ...p, workExperience: newWork })); 
  };

  const removeWorkExp = (index: number) => { 
      const newWork = [...formData.workExperience]; 
      newWork.splice(index, 1);
      setFormData(p => ({ ...p, workExperience: newWork })); 
  };

  const addAchievement = () => {
    setFormData(p => ({ ...p, achievements: [...p.achievements, { title: "", description: "", imageURL: "" }] }));
  };

  const updateAchievement = (index: number, field: string, value: string) => { 
      const newAch = [...formData.achievements];
      newAch[index] = { ...newAch[index], [field]: value }; 
      setFormData(p => ({ ...p, achievements: newAch })); 
  };

  const removeAchievement = (index: number) => { 
      const newAch = [...formData.achievements]; 
      newAch.splice(index, 1);
      setFormData(p => ({ ...p, achievements: newAch })); 
  };

  const handleAchievementImageUpload = async (index: number, e: any) => {
    const file = e.target.files[0];
    if (!file || file.size > 2 * 1024 * 1024) return alert("Image must be under 2MB!");
    
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if(!session) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}_achivement_${Date.now()}.${fileExt}`;
      await supabase.storage.from('resumes').upload(fileName, file, { upsert: true });
      const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(fileName);

      updateAchievement(index, 'imageURL', publicUrlData.publicUrl);
    } catch (error: any) {
        alert("Upload Failed: " + error.message);
    } finally {
        setUploading(false);
    }
  };

  const startCamera = async () => {
    try {
        setShowCamera(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        alert("Camera permission denied! Please allow camera access to capture your profile photo.");
        setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const faceapi = (window as any).faceapi;
    if (!faceapi || !faceapi.nets.tinyFaceDetector.isLoaded) {
        alert("AI Models are still loading. Please wait 2 seconds and click again.");
        return;
    }

    setUploading(true);
    try {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions());
        if (detections.length === 0) {
            alert("🛑 No face detected! Please look straight into the camera.");
        } else if (detections.length > 1) {
            alert("🛑 Multiple faces detected! Please ensure only you are in the frame.");
        } else {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    setFormData(prev => ({ ...prev, photoURL: imageDataUrl }));
                    stopCamera();
                }
            }
        }
    } catch (err) {
        console.error("Face detection error:", err);
        alert("Technical error. Please try again.");
    }
    setUploading(false); 
  };

  const handleResumeUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file || file.size > 2 * 1024 * 1024) return alert("Resume must be under 2MB!");
    
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if(!session) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}_resume_${Date.now()}.${fileExt}`;
      await supabase.storage.from('resumes').upload(fileName, file, { upsert: true });
      const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(fileName);

      const formDataForAPI = new FormData();
      formDataForAPI.append('file', file);
      const aiResponse = await fetch('/api/parse-resume', { method: 'POST', body: formDataForAPI });
      if (aiResponse.ok) {
         const aiData = await aiResponse.json();
         const cleanedLocs = (aiData.preferredLocations || []).filter((l:string) => l.toLowerCase() !== 'remote');
         setFormData(prev => ({ 
            ...prev, 
            resumeURL: publicUrlData.publicUrl,
            fullName: aiData.fullName || prev.fullName, 
            dob: aiData.dob || prev.dob, 
            gender: aiData.gender || prev.gender, 
            phone: aiData.phone || prev.phone,
            city: aiData.city || prev.city, 
            state: aiData.state || prev.state, 
            pincode: aiData.pincode || prev.pincode, 
            experience: aiData.experience || prev.experience,
            bio: aiData.bio || prev.bio || "", 
            panCard: aiData.panCard || prev.panCard || "", 
            currentSalary: aiData.currentSalary || prev.currentSalary || "", 
            expectedSalary: aiData.expectedSalary || prev.expectedSalary || "",
            educations: aiData.educations?.length > 0 ? aiData.educations : prev.educations,
            workExperience: aiData.workExperience?.length > 0 ? aiData.workExperience : prev.workExperience, 
            achievements: aiData.achievements?.length > 0 ? aiData.achievements : prev.achievements, 
            preferredLocations: cleanedLocs.length > 0 ? cleanedLocs : prev.preferredLocations,
            strengths: aiData.strengths?.length > 0 ? aiData.strengths : prev.strengths,
            weaknesses: aiData.weaknesses?.length > 0 ? aiData.weaknesses : prev.weaknesses,
            languages: aiData.languages?.length > 0 ? aiData.languages.filter((l:any) => typeof l === 'object' && l.language) : prev.languages
         }));
         setShowGatekeeper(false);
         setCurrentStep(1); 
         alert("✨ AI Auto-Fill Successful! Please review the details.");
      } else {
         setFormData(prev => ({ ...prev, resumeURL: publicUrlData.publicUrl }));
         setShowGatekeeper(false); 
         alert("Resume Uploaded! Please fill remaining details manually.");
      }
    } catch (e: any) { 
        alert("Upload Failed: " + e.message);
    } finally { 
        setUploading(false); 
    }
  };

  const validateAndProceed = () => {
     if (currentStep === 1) {
        if (!formData.photoURL || formData.photoURL.trim() === "") {
            return alert("🛑 Profile Photo is mandatory! Please click a clear profile photo to proceed.");
        }
        if (!formData.fullName || !formData.phone || !formData.dob || !formData.gender || !formData.city) {
            return alert("🛑 Please fill all required fields: Name, Phone, DOB, Gender, and City.");
        }
        if (formData.dob) {
            const birthDate = new Date(formData.dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                return alert("🛑 You must be at least 18 years old to register on this platform.");
            }
        }
        if (formData.panCard && formData.panCard.trim() !== "") {
           if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard.toUpperCase())) {
               return alert("🛑 Invalid PAN Card format!");
           }
        }
     } else if (currentStep === 2) {
        if (!formData.educations[0].qualification || !formData.educations[0].collegeName || !formData.educations[0].passingYear) {
            return alert("🛑 Please complete at least one Education block completely.");
        }
        
        for (const edu of formData.educations) {
           if (edu.qualification) {
              
              if (edu.percentage && edu.percentage.trim() !== "") {
                  const p = parseFloat(edu.percentage);
                  if (isNaN(p) || p < 0 || p > 100) {
                      return alert(`🛑 Invalid Total Score (%) for ${edu.qualification}. Score must be a valid number between 0 and 100.`);
                  }
              }

              const isProfessional = ['CA', 'CMA', 'CS', 'ACCA'].some(keyword => edu.qualification.includes(keyword));
              if (isProfessional) {
                 if (!edu.stageCleared || edu.stageCleared.trim() === "") {
                     return alert(`🛑 For Professional Qualifications like ${edu.qualification}, 'Stage Cleared' is mandatory!`);
                 }
                 if (!edu.attempts || edu.attempts.trim() === "") {
                     return alert(`🛑 For Professional Qualifications like ${edu.qualification}, 'Attempts' are mandatory!`);
                 }
              }
              const isSchoolLevel = /(10th|12th|class 10|class 12|high school|secondary|intermediate|puc|matric|board|ssc|hsc|cbse|icse|\b10\b|\b12\b|^10$|^12$|x|xii)/i.test(edu.qualification);
              if (isSchoolLevel && edu.mathsIncluded === 'Yes') {
                  if (!edu.mathsScore || edu.mathsScore.trim() === "") {
                      return alert(`🛑 You selected 'Yes' for Maths in ${edu.qualification}. Please provide your Maths Score (%) to proceed.`);
                  }
                  const m = parseFloat(edu.mathsScore);
                  if (isNaN(m) || m < 0 || m > 100) {
                      return alert(`🛑 Invalid Maths Score (%) for ${edu.qualification}. Score must be a valid number between 0 and 100.`);
                  }
              }
           }
        }
        
        if (formData.skills.length < 1) {
            return alert("🛑 Please select at least 1 Technical Sub-Skill. This is mandatory for your assessment.");
        }
        if (formData.behavioralSkills.length < 1) {
            return alert("🛑 Please select at least 1 Behavioral & Soft Skill. Companies look for these traits!");
        }
     }
     setCurrentStep(p => Math.min(4, p + 1));
  };

  const saveProfileData = async (stepTo: number | null = null) => {
    if (!formData.experience || !formData.expectedSalary) {
        return alert("🛑 Please fill your Experience and Expected Salary.");
    }
    if (formData.jobType === "Permanent Role" && (formData.openToContractRoles === "" || formData.openToContractRoles === null)) {
        return alert("🛑 Smart Career Tip: Please explicitly select 'Yes' or 'No' for short-term contract roles to proceed.");
    }
    if (formData.skills.length < 1) {
        setCurrentStep(2);
        return alert("🛑 Please select at least 1 Technical Sub-Skill before saving.");
    }
    if (formData.behavioralSkills.length < 1) {
        setCurrentStep(2);
        return alert("🛑 Please select at least 1 Behavioral Skill before saving.");
    }

    setSavingData(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    try {
      const legalProof = await fetchLegalProof();
      const payloadToSave = {
          ...formData,
          openToContractRoles: formData.openToContractRoles === "Yes" ? true : false,
      };

      const { error } = await supabase.from("profiles").upsert({ 
          id: session.user.id, 
          ...payloadToSave, 
          ...legalProof, 
          email: session.user.email, 
          updated_at: new Date().toISOString() 
      });
      if (error) throw error;

      if(stepTo === 4) {
          setCurrentStep(4);
      } else { 
          setIsEditing(false); 
          alert("Profile Updates Saved Successfully!");
      }
    } catch (e: any) { 
        alert("Error saving profile: " + e.message);
    } finally { 
        setSavingData(false); 
    }
  };

  const toggleSkill = (skill: string) => {
      setFormData(prev => {
          const isCurrentlySelected = prev.skills.includes(skill);
          if (!isCurrentlySelected && prev.skills.length >= 10) {
              alert("🛑 You can select a maximum of 10 Technical Sub-Skills.");
              return prev; 
          }
        
          return { 
              ...prev, 
              skills: isCurrentlySelected ? prev.skills.filter(item => item !== skill) : [...prev.skills, skill] 
          };
      });
  };

  const toggleBehavioralSkill = (skill: string) => {
      setFormData(prev => {
          const isCurrentlySelected = prev.behavioralSkills.includes(skill);
          if (!isCurrentlySelected && prev.behavioralSkills.length >= 5) {
              alert("🛑 You can select a maximum of 5 Behavioral Skills.");
              return prev; 
          }
       
           return { 
              ...prev, 
              behavioralSkills: isCurrentlySelected ? prev.behavioralSkills.filter(item => item !== skill) : [...prev.behavioralSkills, skill] 
          };
      });
  };

  const toggleTechSkill = (skillName: string) => {
      setFormData(prev => {
          const exists = prev.technologicalSkills.find(s => s.name === skillName);
          if (!exists && prev.technologicalSkills.length >= 8) {
              alert("🛑 You can select a maximum of 8 Technological Skills.");
              return prev; 
          }
   
           return { 
              ...prev, 
              technologicalSkills: exists 
                 ? prev.technologicalSkills.filter(item => item.name !== skillName) 
                 : [...prev.technologicalSkills, { name: skillName, level: "Beginner" }] 
          };
      });
  };

  const prevStep = () => setCurrentStep(p => Math.max(1, p - 1));
  
  if (loading) {
      return (
          <div className="h-screen bg-slate-50 text-slate-900 flex gap-3 items-center justify-center">
              <Loader2 className="animate-spin text-teal-600" /> Loading...
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
         <div className="flex justify-between items-center mb-10">
            <button 
                onClick={() => router.push('/student/dashboard')} 
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold"
            >
                <ArrowLeft size={18} /> Dashboard
            </button>
            {!isEditing && (
               <button 
                  onClick={() => { 
                      setIsEditing(true); 
                      setShowGatekeeper(false); 
                      setCurrentStep(1); 
                      setIsOnboarding(false); 
                  }} 
                  className="bg-[#0f947e] hover:bg-[#0c7a68] px-6 py-2.5 rounded-xl text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-500/25"
               >
                  <Edit size={16}/> Edit Profile
               </button>
            )}
         </div>

        {!isEditing ?
        (
           <CandidateProfileView candidate={formData} role="student" />
        ) : showGatekeeper ?
        (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto mt-6">
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden text-center">
                 <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg rotate-3">
                   <FileText size={40} className="text-white -rotate-3"/>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Supercharge Your Profile</h1>
                 <p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto mb-10">Let our AI read your resume and auto-fill your details. Accept the terms below to securely process your document.</p>
              
                 <div onClick={() => setConsentGiven(!consentGiven)} className={`cursor-pointer max-w-xl mx-auto bg-slate-50 border-2 rounded-2xl p-6 mb-8 transition-all flex items-start gap-5 ${consentGiven ? 'border-teal-500 shadow-md bg-teal-50' : 'border-slate-200 hover:border-teal-300'}`}>
                    <div className={`w-7 h-7 border-2 rounded-lg flex items-center justify-center shrink-0 ${consentGiven ? 'bg-teal-500 border-teal-500' : 'border-slate-300 bg-white'}`}>
                        <Check size={18} className={`text-white transition-opacity ${consentGiven ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3}/>
                    </div>
                    <div className="text-left">
                       <p className={`font-bold text-lg mb-1 ${consentGiven ? 'text-teal-700' : 'text-slate-900'}`}>I agree to the Data Privacy Terms</p>
                       <p className="text-sm text-slate-500 leading-relaxed">I consent to the secure processing of my resume data by AI.</p>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-5 max-w-xl mx-auto">
                    <div className="flex-1 relative group" onClick={() => { if(!consentGiven) alert("🛑 Action Blocked: Please tick the 'I agree' box above.");}}>
                       <input type="file" accept=".pdf,.docx,.txt" onChange={handleResumeUpload} disabled={!consentGiven} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"/>
                       <div className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all ${consentGiven ? 'bg-[#0f947e] text-white shadow-lg hover:bg-[#0c7a68] hover:-translate-y-1' : 'bg-slate-100 text-slate-400'}`}>
                           {uploading ? <Loader2 size={22} className="animate-spin"/> : <Sparkles size={22}/>} {uploading ? "Analyzing..." : "Auto-fill with AI"}
                       </div>
                    </div>
                    <button 
                        onClick={() => { 
                            if(consentGiven) { 
                                setShowGatekeeper(false);
                                setCurrentStep(1); 
                            } else alert("Please accept terms."); 
                        }} 
                        className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${consentGiven ? 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:-translate-y-1' : 'border-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                        Skip & Fill Manually
                    </button>
                 </div>
              </div>
           </motion.div>
        ) : (
          <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-[2.5rem] shadow-xl">
            <div className="mb-12">
               <div className="flex justify-between text-sm md:text-base font-bold mb-4">
                  <span className={currentStep >= 1 ? "text-teal-600" : "text-slate-400"}>1. Personal</span>
                  <span className={currentStep >= 2 ? "text-teal-600" : "text-slate-400"}>2. Education</span>
                  <span className={currentStep >= 3 ? "text-teal-600" : "text-slate-400"}>3. Preferences</span>
                  {isOnboarding && <span className={currentStep >= 4 ? "text-teal-600" : "text-slate-400 hidden md:inline"}>4. Unlock Profile</span>}
               </div>
               <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${(currentStep / (isOnboarding ? 4 : 3)) * 100}%` }}></div>
               </div>
            </div>

            <AnimatePresence mode="wait">
               <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
               
               {currentStep === 1 && (
                  <div className="space-y-8">
                     <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Personal Details</h2>
                     
                     <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                       <label className="form-label flex items-center gap-2">
                           <Sparkles size={16} className="text-teal-500"/> AI Generated Professional Bio
                       </label>
                       <textarea 
                           value={formData.bio || ""} 
                           onChange={(e)=>setFormData({...formData, bio: e.target.value})} 
                           className="input-field min-h-[80px]"
                       />
                     </div>

                     <div className="flex items-center gap-8 mb-8">
                        <div onClick={startCamera} className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden shadow-sm group cursor-pointer hover:border-teal-500 transition-colors">
                           {uploading ? <Loader2 className="animate-spin text-teal-600"/> : 
                              formData.photoURL ? <img src={formData.photoURL} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"/> : 
                                 <Camera size={32} className="text-slate-400 group-hover:text-teal-600"/>
                           }
                           <div className="absolute inset-0 bg-white/80 hidden group-hover:flex flex-col items-center justify-center text-center p-2 backdrop-blur-sm">
                              <Camera size={20} className="text-slate-900 mb-1"/>
                              <span className="text-[10px] text-slate-900 font-bold leading-tight">Live Capture</span>
                           </div>
                        </div>
                        <div>
                           <p className="font-bold text-xl text-slate-900">Profile Photo <span className="text-red-500">*</span></p>
                           <p className="text-sm text-slate-500">Click to capture a professional photo</p>
                        </div>
                     </div>

                     <AnimatePresence>
                        {showCamera && (
                           <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
                              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white border border-slate-200 p-6 rounded-3xl max-w-md w-full shadow-2xl">
                                 <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><ScanFace className="text-teal-500"/> Capture Profile Picture</h3>
                                    <button onClick={stopCamera} className="text-slate-400 hover:text-red-500"><X size={24}/></button>
                                 </div>
                                 
                                 <p className="text-sm text-slate-500 text-center mb-4">Please look straight into the camera to capture a clear photo.</p>

                                 <div className="relative w-full aspect-square bg-slate-900 rounded-2xl overflow-hidden mb-6 border-2 border-slate-200">
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100"></video>
                                    <canvas ref={canvasRef} className="hidden"></canvas>
                                    <div className="absolute inset-0 border-[3px] border-dashed border-teal-500/50 rounded-full m-8 pointer-events-none"></div>
                                 </div>
                                 <button onClick={capturePhoto} disabled={uploading || !aiModelsLoaded} className="w-full bg-[#0f947e] hover:bg-[#0c7a68] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                                    {!aiModelsLoaded ? <><Loader2 className="animate-spin"/> Loading AI Models...</> : uploading ? <><Loader2 className="animate-spin"/> Capturing...</> : <><Camera/> Capture Photo</>}
                                 </button>
                              </motion.div>
                           </div>
                        )}
                     </AnimatePresence>

                     <div className="grid md:grid-cols-2 gap-6">
                        <div>
                           <label className="form-label">Full Name <span className="text-red-500">*</span></label>
                           <input type="text" value={formData.fullName} onChange={(e)=>setFormData({...formData, fullName: e.target.value})} className="input-field"/>
                        </div>
                        <div>
                           <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
                           <input type="text" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="input-field w-full"/>
                        </div>
                        <div>
                           <label className="form-label">Date of Birth <span className="text-red-500">*</span> <span className="text-slate-400 text-xs">(Min. 18 Years)</span></label>
                           <input type="date" value={formData.dob} onChange={(e)=>setFormData({...formData, dob: e.target.value})} className="input-field [color-scheme:light]"/>
                        </div>
                        <div>
                           <label className="form-label">Gender <span className="text-red-500">*</span></label>
                           <select value={formData.gender} onChange={(e)=>setFormData({...formData, gender: e.target.value})} className="input-field [color-scheme:light]">
                              <option value="">Select</option>
                              <option>Male</option>
                              <option>Female</option>
                              <option>Other</option>
                           </select>
                        </div>
                        <div>
                           <label className="form-label">City <span className="text-red-500">*</span></label>
                           <input type="text" value={formData.city} onChange={(e)=>setFormData({...formData, city: e.target.value})} className="input-field"/>
                        </div>
                        <div>
                           <label className="form-label">PAN Card <span className="text-slate-400 text-xs ml-1">(Optional)</span></label>
                           <input type="text" value={formData.panCard || ""} onChange={(e)=>setFormData({...formData, panCard: e.target.value.toUpperCase()})} className="input-field uppercase font-mono tracking-widest" maxLength={10}/>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <label className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                               <TrendingUp className="text-teal-600" size={20}/> Core Strengths <span className="text-slate-500 font-normal text-xs ml-2">(Press Enter)</span>
                             </label>
                            <div className="flex flex-wrap gap-2 mb-4">
                               {formData.strengths.map((str, i) => (
                                  <span key={i} className="flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                                     {str} <X size={14} className="cursor-pointer hover:text-teal-900" onClick={() => removeStr(str)}/>
                                  </span>
                               ))}
                            </div>
                            <input type="text" value={strInput} onChange={(e) => setStrInput(e.target.value)} onKeyDown={handleAddStr} className="w-full bg-transparent border-b-2 border-slate-300 pb-2 outline-none text-slate-900 text-sm focus:border-teal-500" placeholder="e.g. Analytical Thinking..."/>
                         </div>
                         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <label className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                               <TrendingDown className="text-red-500" size={20}/> Professional Weaknesses <span className="text-slate-500 font-normal text-xs ml-2">(Press Enter)</span>
                            </label>
                            <div className="flex flex-wrap gap-2 mb-4">
                               {formData.weaknesses.map((wk, i) => (
                                  <span key={i} className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                                     {wk} <X size={14} className="cursor-pointer hover:text-red-800" onClick={() => removeWeak(wk)}/>
                                  </span>
                               ))}
                            </div>
                            <input type="text" value={weakInput} onChange={(e) => setWeakInput(e.target.value)} onKeyDown={handleAddWeak} className="w-full bg-transparent border-b-2 border-slate-300 pb-2 outline-none text-slate-900 text-sm focus:border-red-500" placeholder="e.g. Over-detail oriented..."/>
                         </div>
                     </div>

                  </div>
               )}

               {currentStep === 2 && (
                  <div className="space-y-12">
                     <div>
                        <div className="flex justify-between items-center mb-6">
                           <h2 className="text-3xl font-extrabold text-slate-900">Education <span className="text-red-500 text-lg">*</span></h2>
                           <button onClick={addEducation} className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-xl transition-colors">
                              <Plus size={18}/> Add More
                           </button>
                        </div>
                        <div className="space-y-6">
                           {formData.educations.map((edu, index) => {
                              const qualText = (edu.qualification || '').toLowerCase();
                              const isSchoolLevel = /(10th|12th|class 10|class 12|high school|secondary|intermediate|puc|matric|board|ssc|hsc|cbse|icse|\b10\b|\b12\b|^10$|^12$|x|xii)/i.test(qualText);
                              
                              return (
                              <div key={index} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 relative shadow-sm">
                                 {formData.educations.length > 1 && (
                                    <button onClick={() => removeEducation(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 p-2">
                                       <X size={18}/>
                                    </button>
                                 )}
                                 <div className="grid md:grid-cols-2 gap-6 mt-2">
                                    <div className={isSchoolLevel ? "md:col-span-1" : "md:col-span-2"}>
                                       <label className="form-label">Qualification <span className="text-red-500">*</span></label>
                                       <input type="text" list="qualifications-list" value={edu.qualification} onChange={(e)=>updateEducation(index, 'qualification', e.target.value)} className="input-field"/>
                                    </div>
                                    
                                    {isSchoolLevel && (
                                       <div className="flex gap-4">
                                          <div className="flex-1">
                                             <label className="form-label text-teal-600">Maths Included? <span className="text-slate-400 text-xs">(Optional)</span></label>
                                             <select value={edu.mathsIncluded || ""} onChange={(e)=>updateEducation(index, 'mathsIncluded', e.target.value)} className="input-field border-teal-200 bg-teal-50">
                                                <option value="">Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                              </select>
                                          </div>
                                          {edu.mathsIncluded === 'Yes' && (
                                              <div className="flex-1">
                                                 <label className="form-label text-teal-600">Maths Score (%) <span className="text-red-500">*</span></label>
                                                 <input type="text" value={edu.mathsScore || ""} onChange={(e)=>updateEducation(index, 'mathsScore', e.target.value)} className="input-field border-teal-200 bg-teal-50" placeholder="e.g. 85"/>
                                              </div>
                                          )}
                                       </div>
                                    )}

                                    {['CA', 'CMA', 'CS', 'ACCA'].some(keyword => (edu.qualification || '').includes(keyword)) && (
                                       <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                          <div>
                                             <label className="form-label text-amber-600">Stage Cleared <span className="text-red-500">*</span></label>
                                             <select value={edu.stageCleared} onChange={(e)=>updateEducation(index, 'stageCleared', e.target.value)} className="input-field border-amber-200 bg-amber-50">
                                                <option value="">Select</option>
                                                <option>Group 1</option>
                                                <option>Group 2</option>
                                                <option>Both Groups</option>
                                                <option>Cleared</option>
                                              </select>
                                          </div>
                                          <div>
                                             <label className="form-label text-rose-500">Attempts <span className="text-red-500">*</span></label>
                                             <input type="text" value={edu.attempts || ""} onChange={(e)=>updateEducation(index, 'attempts', e.target.value)} className="input-field border-rose-200 bg-rose-50"/>
                                          </div>
                                       </div>
                                    )}
                                    <div className="md:col-span-2">
                                       <label className="form-label">College / Institution <span className="text-red-500">*</span></label>
                                       <input type="text" value={edu.collegeName} onChange={(e)=>updateEducation(index, 'collegeName', e.target.value)} className="input-field"/>
                                    </div>
                                    <div>
                                       <label className="form-label">Passing Year <span className="text-red-500">*</span></label>
                                       <input type="text" value={edu.passingYear} onChange={(e)=>updateEducation(index, 'passingYear', e.target.value)} className="input-field"/>
                                    </div>
                                    <div>
                                       <label className="form-label">Total Score (%)</label>
                                       <input type="text" value={edu.percentage} onChange={(e)=>updateEducation(index, 'percentage', e.target.value)} className="input-field" placeholder="e.g. 75"/>
                                    </div>
                                 </div>
                              </div>
                           )})}
                           <datalist id="qualifications-list">
                              {QUALIFICATIONS_LIST.map(q => <option key={q} value={q} />)}
                           </datalist>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-slate-200">
                        
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm">
                           <Sparkles className="text-amber-500 shrink-0 mt-0.5" size={20}/>
                           <div>
                              <p className="text-slate-900 font-bold text-sm">Pro Tip for Hiring 💡</p>
                              <p className="text-slate-700 text-xs mt-1">Candidates who select <strong className="text-teal-600">more than 5 sub-skills</strong> see a <strong className="text-teal-600">60% increase</strong> in their hiring and interview shortlisting rate. Select all the skills you actually know!</p>
                           </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                           <h2 className="text-2xl font-extrabold text-slate-900">Technical Skills & Expertise <span className="text-red-500 text-lg">*</span></h2>
                           <span className="bg-slate-100 text-teal-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">
                              {formData.skills.length} / 10 Selected
                           </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-6">Select <strong className="text-slate-900">Minimum 1 and Maximum 10</strong> sub-skills. Your assessment test will be strictly generated based on these selections.</p>
                        
                        {formData.skills.length > 0 && (
                           <div className="flex flex-wrap gap-2 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                              {formData.skills.map(skill => (
                                 <span key={skill} className="flex items-center gap-2 bg-[#0f947e] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">
                                    {skill} <X size={16} className="cursor-pointer hover:text-red-200" onClick={() => toggleSkill(skill)}/>
                                 </span>
                              ))}
                           </div>
                        )}
                        
                        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex flex-col md:flex-row shadow-sm">
                           <div className="md:w-1/3 bg-slate-100 border-r border-slate-200 p-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                              {(Object.keys(MASTER_SKILLS_DATA) as Array<keyof typeof MASTER_SKILLS_DATA>).map((mainSkill) => (
                                 <button 
                                    key={mainSkill} 
                                    onClick={() => setActiveSkillTab(mainSkill)} 
                                    className={`w-full text-left px-4 py-3 mb-2 text-sm font-bold rounded-xl transition-all ${activeSkillTab === mainSkill ? 'bg-[#0f947e] text-white shadow-md' : 'hover:bg-slate-200 text-slate-600'}`}
                                 >
                                    {mainSkill}
                                 </button>
                              ))}
                           </div>
                           <div className="md:w-2/3 p-6 max-h-[350px] overflow-y-auto custom-scrollbar bg-white">
                              <h4 className="text-slate-900 font-bold mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                                 Select Sub-Skills for <span className="text-teal-600">{activeSkillTab}</span>
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {(MASTER_SKILLS_DATA[activeSkillTab] || []).map((subSkill: string) => {
                                    const isSelected = formData.skills.includes(subSkill);
                                    return (
                                       <button 
                                          key={subSkill} 
                                          onClick={() => toggleSkill(subSkill)} 
                                          className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${isSelected ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'} flex items-center justify-between group`}
                                       >
                                          <span className="truncate pr-2">{subSkill}</span>
                                          <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${isSelected ? 'bg-teal-500 border-teal-500' : 'bg-slate-100 border-slate-300 group-hover:border-teal-400'}`}>
                                             {isSelected && <Check size={14} className="text-white" />}
                                          </div>
                                       </button>
                                    );
                                 })}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                           <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2"><Users className="text-indigo-500"/> Behavioral & Soft Skills <span className="text-red-500 text-lg">*</span></h2>
                           <span className="bg-slate-100 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">
                              {formData.behavioralSkills.length} / 5 Selected
                           </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-6">Select <strong className="text-slate-900">Minimum 1 and Maximum 5</strong> behavioral traits. You can choose from the list or type your own.</p>
                        
                        {formData.behavioralSkills.length > 0 && (
                           <div className="flex flex-wrap gap-2 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                              {formData.behavioralSkills.map(skill => (
                                 <span key={skill} className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">
                                    {skill} <X size={16} className="cursor-pointer hover:text-indigo-200" onClick={() => removeBehavioralSkill(skill)}/>
                                 </span>
                              ))}
                           </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
                               <label className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                                  <Plus className="text-indigo-500" size={20}/> Add Custom Skill <span className="text-slate-500 font-normal text-xs ml-2">(Press Enter)</span>
                               </label>
                               <input type="text" value={behavInput} onChange={(e) => setBehavInput(e.target.value)} onKeyDown={handleAddBehavioralSkill} className="w-full bg-transparent border-b-2 border-slate-300 pb-2 outline-none text-slate-900 text-sm focus:border-indigo-500" placeholder="e.g. Public Speaking, Negotiation..."/>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                               <label className="text-slate-900 font-bold mb-4 block">Quick Suggestions</label>
                               <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                                  {BEHAVIORAL_SKILLS_LIST.map((bSkill: string) => {
                                     const isSelected = formData.behavioralSkills.includes(bSkill);
                                     return (
                                        <button 
                                           key={bSkill} 
                                           onClick={() => {
                                               if(!isSelected && formData.behavioralSkills.length >= 5) {
                                                   alert("🛑 You can select a maximum of 5 Behavioral Skills.");
                                                   return;
                                               }
                                               setFormData(prev => ({...prev, behavioralSkills: isSelected ? prev.behavioralSkills.filter(item => item !== bSkill) : [...prev.behavioralSkills, bSkill]}));
                                           }} 
                                           className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                                        >
                                           {isSelected && <Check size={12} className="text-indigo-600" />}
                                           {bSkill}
                                        </button>
                                     );
                                  })}
                               </div>
                            </div>
                        </div>
                     </div>

                     {/* 🔥 TECHNOLOGICAL SKILLS SECTION WITH LEVEL DROPDOWN 🔥 */}
                     <div className="pt-8 border-t border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                           <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2"><Monitor className="text-blue-500"/> Technological Tools & Software <span className="text-slate-500 text-sm font-medium ml-2">(Optional)</span></h2>
                           <span className="bg-slate-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">
                              {formData.technologicalSkills.length} / 8 Selected
                           </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-6">Select tools you are proficient in (Max 8) and set your level. <strong className="text-slate-900">Note: Our AI will ask 5 questions per selected software tool with NO negative marking.</strong></p>
                        
                        {formData.technologicalSkills.length > 0 && (
                           <div className="flex flex-col gap-3 mb-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                              {formData.technologicalSkills.map(skill => (
                                 <div key={skill.name} className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl w-fit shadow-sm">
                                    <span className="text-blue-900 text-sm font-bold">{skill.name}</span>
                                    <div className="flex items-center gap-2 ml-2 border-l border-blue-200 pl-3">
                                        <select 
                                            value={skill.level} 
                                            onChange={(e) => updateTechSkillLevel(skill.name, e.target.value)}
                                            className="bg-white text-blue-700 text-xs font-bold px-2 py-1.5 rounded-lg border border-blue-200 outline-none cursor-pointer hover:bg-blue-50 transition-colors"
                                        >
                                            <option value="Beginner">Beginner Level</option>
                                            <option value="Intermediate">Intermediate Level</option>
                                            <option value="Advanced">Advanced Level</option>
                                        </select>
                                        <X size={18} className="cursor-pointer text-blue-400 hover:text-red-500 ml-1 transition-colors" onClick={() => removeTechSkill(skill.name)}/>
                                    </div>
                                 </div>
                               ))}
                           </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
                               <label className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                                  <Plus className="text-blue-500" size={20}/> Add Custom Tool <span className="text-slate-500 font-normal text-xs ml-2">(Press Enter)</span>
                               </label>
                               <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleAddTechSkill} className="w-full bg-transparent border-b-2 border-slate-300 pb-2 outline-none text-slate-900 text-sm focus:border-blue-500" placeholder="e.g. Jira, Xero, Tally ERP 9..."/>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                               <label className="text-slate-900 font-bold mb-4 block">Most Demanded Tools</label>
                               <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                                  {TECH_SKILLS_LIST.map((tSkill: string) => {
                                     const isSelected = formData.technologicalSkills.some(s => s.name === tSkill);
                                     return (
                                        <button 
                                           key={tSkill} 
                                           onClick={() => toggleTechSkill(tSkill)} 
                                           className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${isSelected ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                                        >
                                           {isSelected && <Check size={12} className="text-blue-600" />}
                                           {tSkill}
                                        </button>
                                     );
                                  })}
                               </div>
                            </div>
                        </div>
                     </div>

                  </div>
               )}

               {currentStep === 3 && (
                  <div className="space-y-12">
                     <div>
                        <div className="flex justify-between items-center mb-6">
                           <h2 className="text-3xl font-extrabold text-slate-900">Past Work Experience</h2>
                           <button onClick={addWorkExp} className="text-sm font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-4 py-2 rounded-xl transition-colors">
                               <Plus size={18} className="inline"/> Add Company
                           </button>
                        </div>
                        <div className="space-y-4">
                           {formData.workExperience.map((work, index) => (
                              <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative shadow-sm">
                                 <button onClick={() => removeWorkExp(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                                    <X size={18}/>
                                 </button>
                                 <div className="grid md:grid-cols-3 gap-4 mt-2">
                                    <div>
                                       <label className="form-label">Company Name</label>
                                       <input type="text" value={work.company} onChange={(e)=>updateWorkExp(index, 'company', e.target.value)} className="input-field" placeholder="e.g. TCS"/>
                                    </div>
                                    <div>
                                       <label className="form-label">Job Role</label>
                                       <input type="text" value={work.role} onChange={(e)=>updateWorkExp(index, 'role', e.target.value)} className="input-field" placeholder="e.g. Audit Exec"/>
                                    </div>
                                    <div>
                                       <label className="form-label">Duration</label>
                                       <input type="text" value={work.duration} onChange={(e)=>updateWorkExp(index, 'duration', e.target.value)} className="input-field" placeholder="e.g. 2021 - 2023"/>
                                    </div>
                                 </div>
                               </div>
                           ))}
                           {formData.workExperience.length === 0 && <p className="text-slate-500 text-sm font-medium">No past experience added. AI will auto-fill if found on resume.</p>}
                        </div>
                     </div>

                     <div className="pt-8 border-t border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                           <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2"><Award className="text-amber-500"/> Achievements & Certifications</h2>
                           <button onClick={addAchievement} className="text-sm font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 px-4 py-2 rounded-xl transition-colors">
                              <Plus size={18} className="inline"/> Add Achievement
                           </button>
                        </div>
                        <div className="space-y-4">
                           {formData.achievements.map((ach, index) => (
                              <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative shadow-sm">
                                 <button onClick={() => removeAchievement(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                                    <X size={18}/>
                                  </button>
                                 <div className="grid md:grid-cols-2 gap-4 mt-2">
                                    <div className="md:col-span-2">
                                       <label className="form-label">Achievement / Certificate Title</label>
                                       <input type="text" value={ach.title} onChange={(e)=>updateAchievement(index, 'title', e.target.value)} className="input-field" placeholder="e.g. Employee of the Month, NCFM Certified..."/>
                                    </div>
                                    <div className="md:col-span-2">
                                       <label className="form-label">Short Description</label>
                                       <textarea value={ach.description} onChange={(e)=>updateAchievement(index, 'description', e.target.value)} className="input-field min-h-[60px]" placeholder="e.g. Awarded for generating maximum revenue..."/>
                                    </div>
                                    <div className="md:col-span-2">
                                       <label className="form-label text-slate-500">Upload Certificate/Photo <span className="text-xs ml-1">(Optional)</span></label>
                                       <div className="flex items-center gap-4">
                                          {ach.imageURL && (
                                              <img src={ach.imageURL} alt="Achievement" className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-sm"/>
                                          )}
                                          <div className="relative">
                                             <input type="file" accept="image/*" onChange={(e) => handleAchievementImageUpload(index, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                                             <div className="bg-white hover:bg-slate-100 text-teal-600 text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 transition-colors shadow-sm">
                                                  <ImagePlus size={16}/> {ach.imageURL ? "Change Image" : "Upload Image"}
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                               </div>
                           ))}
                           {formData.achievements.length === 0 && <p className="text-slate-500 text-sm font-medium">Stand out by adding your awards or extra certifications.</p>}
                        </div>
                     </div>

                     <div className="pt-8 border-t border-slate-200">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Work & Salary Preferences</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                           <div>
                              <label className="form-label">Total Experience <span className="text-red-500">*</span></label>
                              <select value={formData.experience} onChange={(e)=>setFormData({...formData, experience: e.target.value})} className="input-field [color-scheme:light]">
                                 <option>Fresher</option>
                                 <option>0-1 Years</option>
                                 <option>1-3 Years</option>
                                 <option>3-5 Years</option>
                                 <option>5+ Years</option>
                              </select>
                           </div>
                           <div>
                              <label className="form-label">Notice Period <span className="text-red-500">*</span></label>
                              <select value={formData.noticePeriod} onChange={(e)=>setFormData({...formData, noticePeriod: e.target.value})} className="input-field [color-scheme:light]">
                                 <option>Immediate Joiner</option>
                                 <option>15 Days</option>
                                 <option>1 Month</option>
                                 <option>2 Months</option>
                              </select>
                           </div>
                           
                           {formData.experience !== "Fresher" && (
                              <div>
                                 <label className="form-label">Monthly Current Salary</label>
                                 <input type="text" value={formData.currentSalary || ""} onChange={(e)=>setFormData({...formData, currentSalary: e.target.value})} className="input-field" placeholder="e.g. ₹30,000"/>
                              </div>
                           )}
                           <div>
                              <label className="form-label flex items-center gap-2">Monthly Expected Salary <span className="text-red-500">*</span></label>
                              <input type="text" value={formData.expectedSalary || ""} onChange={(e)=>setFormData({...formData, expectedSalary: e.target.value})} className="input-field border-teal-200 bg-teal-50" placeholder="e.g. ₹40,000"/>
                           </div>

                           <div className="md:col-span-2">
                              <label className="form-label text-indigo-600">Looking For (Role Type) <span className="text-red-500">*</span></label>
                              <select 
                                 value={formData.jobType} 
                                 onChange={(e)=>{
                                     const val = e.target.value;
                                     setFormData({...formData, jobType: val, openToContractRoles: val === "Permanent Role" ? "" : formData.openToContractRoles});
                                 }} 
                                 className="input-field border-indigo-200 bg-indigo-50 [color-scheme:light] mb-4"
                              >
                                 <option value="Permanent Role">Permanent Role</option>
                                 <option value="1-3 Month Contract">1-3 Month Contract</option>
                                 <option value="3-6 Month Contract">3-6 Month Contract</option>
                                 <option value="6+ Month Contract">6+ Month Contract</option>
                                 <option value="Freelance/Project Basis">Freelance/Project Basis</option>
                                 <option value="Internship">Internship</option>
                               </select>
                              
                              {formData.jobType === "Permanent Role" && (
                                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl flex flex-col md:flex-row items-start gap-4 shadow-sm">
                                    <div className="bg-white p-3 rounded-xl shrink-0 mt-1 border border-indigo-100 shadow-sm">
                                       <Briefcase className="text-indigo-600" size={28}/>
                                    </div>
                                    <div className="w-full">
                                       <h4 className="text-indigo-900 font-extrabold mb-2 text-lg">Smart Career Tip 💡</h4>
                                       <p className="text-slate-700 text-sm mb-4 leading-relaxed font-medium">
                                          Top companies on Talexo often hire for high-paying, short-term contract projects (ranging from 1 to 12 months). Would you like to be considered for these while you hunt for a permanent role? <span className="text-red-500 text-xs ml-1">*Required</span>
                                       </p>
                                       
                                       <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                          <button 
                                             type="button"
                                             onClick={() => setFormData({...formData, openToContractRoles: "Yes"})}
                                             className={`flex-1 py-3.5 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${formData.openToContractRoles === "Yes" ? 'bg-[#0f947e] border-[#0f947e] text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-500 hover:bg-teal-50'}`}
                                          >
                                             {formData.openToContractRoles === "Yes" && <Check size={18} strokeWidth={3}/>} Yes, I'm open to it
                                          </button>
                                          
                                          <button 
                                             type="button"
                                             onClick={() => setFormData({...formData, openToContractRoles: "No"})}
                                             className={`flex-1 py-3.5 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${formData.openToContractRoles === "No" ? 'bg-red-50 border-red-300 text-red-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-red-300 hover:bg-red-50'}`}
                                          >
                                             {formData.openToContractRoles === "No" && <X size={18} strokeWidth={3}/>} No, only permanent
                                          </button>
                                       </div>
                                    </div>
                                 </motion.div>
                              )}
                           </div>

                           <div>
                              <label className="form-label">Work Mode</label>
                              <select value={formData.workMode} onChange={(e)=>setFormData({...formData, workMode: e.target.value})} className="input-field [color-scheme:light]">
                                 <option>On-site</option>
                                 <option>Hybrid</option>
                                 <option>Remote</option>
                              </select>
                           </div>
                           <div>
                              <label className="form-label">Willing to Relocate?</label>
                              <select value={formData.willingToRelocate} onChange={(e)=>setFormData({...formData, willingToRelocate: e.target.value})} className="input-field [color-scheme:light]">
                                 <option>No</option>
                                 <option>Yes</option>
                              </select>
                           </div>

                           <div className="md:col-span-2 bg-slate-50 p-8 rounded-3xl border border-slate-200 mt-4 shadow-sm">
                              <label className="text-slate-900 font-bold mb-4 block text-base">Preferred Work Locations <span className="text-slate-500 font-normal text-sm ml-2">(Type city & press Enter)</span></label>
                              <div className="flex flex-wrap gap-3 mb-4">
                                 {formData.preferredLocations.map((loc, i) => (
                                    <span key={i} className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                                       {loc} <X size={16} className="cursor-pointer text-blue-400 hover:text-red-500" onClick={() => removeLocation(loc)}/>
                                    </span>
                                 ))}
                               </div>
                              <input type="text" value={locInput} onChange={(e) => setLocInput(e.target.value)} onKeyDown={handleAddLocation} className="w-full bg-transparent border-b-2 border-slate-300 pb-3 outline-none text-slate-900 text-base font-bold placeholder:text-slate-400 placeholder:font-medium focus:border-teal-500" placeholder="e.g. Mumbai, Bangalore..."/>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {currentStep === 4 && isOnboarding && (
                 <div className="space-y-8 text-center py-6">
                     <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-200 shadow-md">
                        <ShieldAlert size={48} className="text-amber-500" />
                     </div>
                     <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Profile Saved, but <span className="text-amber-500">HIDDEN</span> 🔒
                      </h2>
                     <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        To maintain trust, companies can only see profiles that have passed the AI Skill Assessment. Unlock your profile now to get hired.
                     </p>
                     
                     <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-teal-500 transition-all text-left flex flex-col shadow-lg">
                           <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                              <PlayCircle className="text-teal-500" size={28}/> Practice First
                           </h3>
                           <p className="text-slate-500 text-sm mb-8 flex-1 font-medium">Take a quick dummy test to understand how tracking works.</p>
                           <button onClick={() => router.push('/student/demo-test?returnTo=profile')} className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 py-4 rounded-xl font-bold transition-all shadow-sm text-lg">
                              Take Demo Test
                           </button>
                        </div>
                        <div className="bg-teal-50 p-8 rounded-[2rem] border border-teal-200 hover:border-teal-400 transition-all text-left shadow-xl relative overflow-hidden flex flex-col">
                           <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-black tracking-widest px-4 py-1.5 rounded-bl-xl shadow-md">REQUIRED</div>
                           <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                              <Target className="text-teal-600" size={28}/> Final Assessment
                           </h3>
                           <p className="text-teal-800/70 font-medium text-sm mb-8 flex-1">Ensure you are in a quiet room.</p>
                           <button onClick={() => router.push('/student/test')} className="w-full bg-[#0f947e] hover:bg-[#0c7a68] text-white py-4 rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all text-lg flex justify-center items-center gap-2">
                              Start AI Test Now <ChevronRight size={20}/>
                           </button>
                        </div>
                      </div>
                     <button onClick={() => { setIsEditing(false); router.push('/student/dashboard'); }} className="text-slate-500 hover:text-slate-900 font-bold underline underline-offset-4 transition-colors">
                        Save as draft & take test later
                     </button>
                  </div>
               )}
               </motion.div>
            </AnimatePresence>

            {currentStep < 4 && (
               <div className="flex justify-between mt-12 pt-8 border-t border-slate-200">
                  {currentStep > 1 ? (
                     <button onClick={prevStep} className="px-8 py-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 font-bold flex items-center gap-3 text-slate-700 transition-all shadow-sm">
                        <ChevronLeft size={20}/> Back
                     </button>
                  ) : <div></div>}
                  
                  {currentStep < 3 ? (
                     <button onClick={validateAndProceed} className="px-10 py-4 rounded-xl bg-[#0f947e] hover:bg-[#0c7a68] font-bold flex items-center gap-3 text-white shadow-lg shadow-teal-500/20 text-lg transition-all">
                        Next <ChevronRight size={20}/>
                     </button>
                  ) : (
                     isOnboarding ?
                     (
                        <button onClick={() => saveProfileData(4)} disabled={savingData} className="px-10 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 font-bold flex items-center gap-3 text-white shadow-xl shadow-teal-500/30 text-lg transition-all">
                           {savingData ? <><Loader2 className="animate-spin" size={20}/> Saving...</> : <>Save & Next: Assessment <ChevronRight size={20}/></>}
                        </button>
                     ) : (
                        <button onClick={() => saveProfileData()} disabled={savingData} className="px-10 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold flex items-center gap-3 text-white shadow-xl shadow-teal-500/20 text-lg transition-all">
                           {savingData ? <><Loader2 className="animate-spin" size={20}/> Saving...</> : <><Save size={20}/> Save Changes</>}
                        </button>
                     )
                  )}
               </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .form-label { 
            display: block;
            font-size: 0.9rem; 
            font-weight: 700; 
            color: #475569; 
            margin-bottom: 0.6rem; 
        }
        .input-field { 
            width: 100%;
            background-color: #ffffff; 
            border: 2px solid #e2e8f0; 
            border-radius: 1rem; 
            padding: 1rem 1.25rem; 
            color: #0f172a; 
            outline: none; 
            transition: all 0.2s; 
            font-size: 1rem;
            font-weight: 600; 
            appearance: none; 
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .input-field:focus { 
            border-color: #0f947e;
            background-color: #ffffff; 
            box-shadow: 0 0 0 4px rgba(15, 148, 126, 0.1);
        }
        select.input-field { 
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat; 
            background-position: right 1.2rem top 50%; 
            background-size: 0.75rem auto;
        }
        .custom-scrollbar::-webkit-scrollbar { 
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
            background: #cbd5e1;
            border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
            background: #94a3b8;
        }
      `}</style>
    </div>
  );
}