"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MapPin, Briefcase, 
  Edit, Save, Phone, Camera, Loader2, ArrowLeft, 
  GraduationCap, ChevronRight, ChevronLeft, Sparkles, Plus, X, Check, Globe, FileText, Search, ShieldAlert, PlayCircle, Target, TrendingUp, TrendingDown, ScanFace, Award, ImagePlus, Users, Monitor, MessageCircle, AlertTriangle
} from "lucide-react";
import CandidateProfileView from "@/app/components/CandidateProfileView";
import { QUALIFICATIONS_LIST } from "@/lib/constants";
import { City } from "country-state-city";

// Fetching all 4000+ Indian Cities for Autocomplete
const INDIAN_CITIES = City.getCitiesOfCountry("IN") || [];

// 🔥 UPDATED EXCEL MASTER SKILLS DATA 🔥
const MASTER_SKILLS_DATA: Record<string, string[]> = {
  "1. Financial Reporting and Accounting": [
      "Accounting & Bookkeeping", "Accounting Standards (AS)", "Accounts Payable Assistance", 
      "Accounts Receivables Assistaance", "Business Combinations Accounting", "Consolidation of Accounts", 
      "Ind AS Accounting", "US GAAP"
  ],
  "2. Internal Audit & Risk assessment & testing": [
      "AML Investigation Techniques", "Contractual Compliance Testing", "Corporate governance framework assessment", 
      "Digital Forensic Investigation", "Fraud Risk Assessment Models", "Internal Audit", "Internal Control Testing", 
      "IT and Data Analytics", "Litigation Support Reporting", "RCM Prepration", "SOP Preparation & Implementation", 
      "SOX Audit"
  ],
  "3. Statutory Audit & Compliances": [
      "Audit Assistance for Companies", "Audit Documentation", "Audit Observations Correction", 
      "Audit Reports Drafting", "Bank Audit", "Compliance & Legal Verifications", "Concurrent Audit", 
      "Control Testing", "Financial Due Diligence Audit", "Group Audit", "NBFCs Audit", "Physical Verification"
  ],
  "4. Direct & International Taxation": [
      "Cross-Border Structuring", "GAAR", "Income Tax Return Preparation and Filing", 
      "MAT-AMT Calculation", "Permanent Establishment", "Tax Audit", "Tax Structuring Advisory", 
      "Tax Treaty", "TDS-TCS Filling", "Transfer Pricing"
  ],
  "5. Indirect Taxation & Transaction Taxes": [
      "Customs Valuation", "E-Invoicing Compliance", "E-Way Bill", "GST Audit", 
      "GST Reconciliation", "GST Return Filing", "Input Tax Credit Optimisation", 
      "M&A Tax Due Diligence", "Refund Claim Processing"
  ],
  "6. Costing & Strategic Cost Management": [
      "Break-Even Analysis & Optimization", "Job Costing", "Kaizen Costing", "Lean Accounting", 
      "Life-Cycle Costing", "MIS For Cost Analysis", "MIS For Variance Analysis", 
      "Process Costing", "Target Costing"
  ],
  "7. Financial Modeling & Valuation Engineering": ["Three-Statement Integrated Modeling", "Dynamic Scenario Simulation", "Sensitivity Matrix Design", "DCF Valuation Construction", "Comparable Company Analysis", "Precedent Transaction Analysis", "Leveraged Buyout Modeling", "Project Finance Modeling", "Startup Valuation", "Model Audit"],
  "8. Investment & Portfolio Analytics": ["Equity Valuation Frameworks", "Fixed Income Duration Analysis", "Credit Spread Modeling", "Alternative Asset Evaluation", "Hedge Fund Performance", "Portfolio Optimisation (Markowitz)", "CAPM & Multifactor Modeling", "Derivatives Pricing Models"],
  "9. Treasury & Corporate Liquidity Management": ["Bank Reconcilations", "Treasury operation management", "Working Capital Structuring", "Cash Forecasting Architecture", "Bank Relationship Management", "Foreign Exchange Exposure Hedging", "Interest Rate Swap Structuring", "Debt Issuance Strategy"],
  "10. Corporate Law, Governance & Secretarial Practice": ["Company Incorporation", "MCA filings", "MOA/AOA/Deeds drafting", "Compliance Checklist drafting", "Companies Act Compliance", "Board Process Advisory", "SEBI Listing Regulations", "Insider Trading Compliance", "Secretarial Audit Execution", "FEMA Compliance"],
  "11. Information Systems Audit & IT Governance": ["ITGC Testing", "ERP Control Mapping", "Access Rights Review", "Cybersecurity Audit", "Data Integrity Verification", "SOC Report Evaluation", "Cloud Risk Assessment", "Change Management Audit", "Business Continuity System Review"],
  "12. Insolvency, Restructuring & Distressed Advisory": ["CIRP Process Management", "Resolution Plan Evaluation", "Liquidation Waterfall Distribution", "Forensic Transaction Review", "Avoidance Transaction Analysis", "Insolvency Law Compliance", "Revival Feasibility Assessment", "Debt Restructuring Modeling"],
  "13. Wealth Management & Financial Planning": ["Retirement Corpus Planning", "Estate Planning Structuring", "Tax-Efficient Investment Strategy", "Insurance Planning", "Succession Planning", "Client Risk Profiling", "Portfolio Rebalancing Strategy"],
  "14. Financial Operations & Process Optimization": ["Procure-To-Pay Cycle Control", "Order-To-Cash Optimization", "Record-To-Report Efficiency", "Financial Close Acceleration", "Shared Services Setup", "ERP Migration Planning", "Internal SOP Drafting", "Process Automation Evaluation"]
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
    "Excel", "Tally Prime", "SAP FICO", "MS Word", "MS PowerPoint", 
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
  const [customNoticeDays, setCustomNoticeDays] = useState(""); // 🔥 Custom notice period input
  
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
    whatsappNumber: "", 
    photoURL: "", 
    addressLine: "", 
    city: "", 
    state: "", 
   pincode: "", 
    willingToRelocate: "No",
    travelPreference: "No / Minimal Travel (Work from Base Office Only)",
    panCard: "", 
    bio: "", 
    highestQualification: "", // 🔥 NEW: Track Highest Qualification Level
    hasLaptop: "No", // 🔥 NEW: Laptop availability tracking logic array
    educations: [{ qualification: "", collegeName: "", passingYear: "", percentage: "", stageCleared: "", attempts: "", mathsIncluded: "", mathsScore: "" }],
    workExperience: [] as { company: string, role: string, duration: string, designation: string, summary: string }[],    achievements: [] as { title: string, description: string, imageURL: string }[], 
    languages: [] as { language: string; proficiency: string }[],
    skills: [] as string[],
    operationsSkills: [] as string[],
    selectsGeneralTrack: false,
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
            whatsappNumber: data.whatsappNumber || "",
            currentSalary: data.currentSalary || "", 
            expectedSalary: data.expectedSalary || "",
            travelPreference: data.travelPreference || "No / Minimal Travel (Work from Base Office Only)",
            jobType: data.jobType || "Permanent Role",
            openToContractRoles: data.openToContractRoles === true ? "Yes" : (data.openToContractRoles === false ? "No" : ""),
            highestQualification: data.highestQualification || "", // 🔥 NEW: Pre-fill from DB
            educations: data.educations?.length ? data.educations : formData.educations,
            workExperience: data.workExperience || [],
            achievements: data.achievements || [],
            languages: Array.isArray(data.languages) ? data.languages.filter((l:any) => typeof l === 'object' && l !== null && l.language) : [],
          preferredLocations: data.preferredLocations?.length ? data.preferredLocations : [],
            operationsSkills: Array.isArray(data.operationsSkills) ? data.operationsSkills.filter((s:any) => typeof s === 'string') : [],
            selectsGeneralTrack: data.selectsGeneralTrack || false,
            skills: Array.isArray(data.skills) ? data.skills.filter((s:any) => typeof s === 'string') : [],
            behavioralSkills: Array.isArray(data.behavioralSkills) ? data.behavioralSkills.filter((s:any) => typeof s === 'string') : [],
            technologicalSkills: Array.isArray(data.technologicalSkills) ? data.technologicalSkills.map((s:any) => typeof s === 'string' ? { name: s, level: 'Beginner' } : s) : [],
            strengths: Array.isArray(data.strengths) ? data.strengths : [],
            weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : []
          });

          // 🔥 Agar saved noticePeriod fixed options mein nahi hai toh custom hai
          const fixedOptions = ["Immediate Joiner", "15 Days", "1 Month", "2 Months"];
          if (data.noticePeriod && !fixedOptions.includes(data.noticePeriod)) {
            const numMatch = data.noticePeriod.replace(/\D/g, "");
            if (numMatch) setCustomNoticeDays(numMatch);
          }
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
      const inputCity = locInput.trim();
      
      // Smart check for dropdown selection (handles both strings and objects)
      const isValid = INDIAN_CITIES.some((c: any) => (c.name || c) === inputCity);
      if (!isValid) {
          return alert("🛑 Invalid Location! Please select a valid city from the dropdown suggestions.");
      }

      if (!formData.preferredLocations.includes(inputCity)) {
          setFormData(p => ({ ...p, preferredLocations: [...p.preferredLocations, inputCity] }));
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
      setFormData(p => ({ ...p, workExperience: [...p.workExperience, { company: "", role: "", duration: "", designation: "", summary: "" }] }));
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
            whatsappNumber: aiData.whatsappNumber || prev.whatsappNumber || "",
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
       if (!formData.fullName || !formData.phone || !formData.dob || !formData.gender || !formData.city || !formData.hasLaptop) {
            return alert("🛑 Please fill all required fields: Name, Phone, DOB, Gender, City, and Laptop Availability.");
        }
        
        const isValidCity = INDIAN_CITIES.some((c: any) => (c.name || c) === formData.city.trim());
        if (!isValidCity) {
            return alert("🛑 Invalid City! Please select a valid city from the dropdown suggestions.");
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
            if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard.toUpperCase().trim())) {
                return alert("🛑 Invalid PAN Card format! It should be like ABCDE1234F.");
            }
        }
        if (formData.whatsappNumber && !/^[0-9]{10}$/.test(formData.whatsappNumber.trim())) {
            return alert("🛑 Invalid WhatsApp Number! Must be exactly 10 digits.");
        }
     } else if (currentStep === 2) {
        if (!formData.highestQualification || formData.highestQualification.trim() === "") {
            return alert("🛑 Please select your Highest Qualification Level to proceed.");
        }
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
        
        if (formData.operationsSkills.length < 1 && !formData.selectsGeneralTrack && formData.skills.length < 1) {
            return alert("🛑 Please select either an Operations option, the General Track, or at least 1 Technical Sub-Skill to proceed.");
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
    if (formData.operationsSkills.length < 1 && !formData.selectsGeneralTrack && formData.skills.length < 1) {
        setCurrentStep(2);
        return alert("🛑 Please select either an Operations option, the General Track, or at least 1 Technical Sub-Skill before saving.");
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
  
  // 🔥 SMART SALARY CHECK: Over 30% Hike Warning
  let showHikeWarning = false;
  if (formData.currentSalary && formData.expectedSalary) {
     const currNum = parseInt(formData.currentSalary.replace(/[^0-9]/g, ''), 10);
     const expNum = parseInt(formData.expectedSalary.replace(/[^0-9]/g, ''), 10);
     if (!isNaN(currNum) && !isNaN(expNum) && currNum > 0) {
        if (expNum > currNum * 1.30) {
            showHikeWarning = true;
        }
     }
  }

  if (loading) {
       return (
           <div className="h-screen bg-[var(--surface)] text-[var(--foreground)] flex gap-3 items-center justify-center">
               <Loader2 className="animate-spin text-[var(--primary)]" /> Loading...
           </div>
       );
   }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
         <div className="flex justify-between items-center mb-10">
            <button 
                onClick={() => router.push('/student/dashboard')} 
                className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors font-semibold text-sm"
            >
                <ArrowLeft size={16} /> Dashboard
            </button>

            {!isEditing && (
               <div className="flex items-center">
                  <button 
                     onClick={() => { 
                         setIsEditing(true); 
                         setShowGatekeeper(false); 
                         setCurrentStep(1); 
                         setIsOnboarding(false); 
                     }} 
                     className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-glow)] text-white text-xs font-semibold shadow-soft transition-all"
                  >
                     Edit Profile
                  </button>
               </div>
            )}
         </div>

         {!isEditing ?
        (
           <CandidateProfileView candidate={formData} role="student" />
        ) : showGatekeeper ?
        (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto mt-6">
              <div className="bg-white border border-[var(--border)] rounded-xl p-8 md:p-10 shadow-modal relative overflow-hidden text-center">
                 <div className="w-16 h-16 bg-[var(--accent)] border border-[var(--primary)]/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <FileText size={32} className="text-[var(--primary)]"/>
                 </div>
                 <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2 tracking-tight">Supercharge Your Profile</h1>
                 <p className="text-[var(--muted-foreground)] text-sm leading-relaxed max-w-md mx-auto mb-8 font-medium">Let our AI read your resume and auto-fill your details. Accept the terms below to securely process your document.</p>
              
                <div onClick={() => setConsentGiven(!consentGiven)} className={`cursor-pointer max-w-md mx-auto bg-[var(--surface)] border rounded-lg p-4 mb-6 transition-all flex items-start gap-4 ${consentGiven ? 'border-[var(--primary)] bg-[var(--accent)]/30' : 'border-[var(--border)] hover:border-[var(--primary)]/40'}`}>
                    <div className={`w-5 h-5 border rounded flex items-center justify-center shrink-0 ${consentGiven ? 'bg-[var(--primary)] border-transparent' : 'border-[var(--border)] bg-white'}`}>
                        <Check size={14} className={`text-[var(--primary-foreground)] transition-opacity ${consentGiven ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3}/>
                    </div>
                    <div className="text-left">
                       <p className={`font-semibold text-sm mb-0.5 ${consentGiven ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>I agree to the Data Privacy Terms</p>
                       <p className="text-xs text-[var(--muted-foreground)] leading-normal">I consent to the secure processing of my resume data by AI.</p>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <div className="flex-1 relative group" onClick={() => { if(!consentGiven) alert("🛑 Action Blocked: Please tick the 'I agree' box above.");}}>
                       <input type="file" accept=".pdf,.docx,.txt" onChange={handleResumeUpload} disabled={!consentGiven} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"/>
                       <div className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${consentGiven ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-glow)] shadow-[var(--shadow-primary)]' : 'bg-[var(--surface)] text-[var(--muted-foreground)] border border-[var(--border)]'}`}>
                           {uploading ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>} {uploading ? "Analyzing..." : "Auto-fill with AI"}
                       </div>
                    </div>
                    <button 
                        onClick={() => { 
                            if(consentGiven) { 
                                setShowGatekeeper(false);
                                setCurrentStep(1); 
                            } else alert("Please accept terms."); 
                        }} 
                        className={`flex-1 py-3 rounded-lg font-semibold text-sm border transition-all ${consentGiven ? 'border-[var(--border)] text-[var(--foreground)] bg-[var(--surface)] hover:bg-[var(--accent)]' : 'border-[var(--border)] text-[var(--muted-foreground)] cursor-not-allowed opacity-50'}`}
                    >
                        Skip & Fill Manually
                    </button>
                 </div>
              </div>
           </motion.div>
        ) : (
          <div className="bg-white border border-[var(--border)] p-6 md:p-10 rounded-xl shadow-card">
            <div className="mb-10">
               <div className="flex justify-between text-xs sm:text-sm font-semibold mb-3">
                  <span className={currentStep >= 1 ? "text-[var(--primary)] font-bold" : "text-[var(--muted-foreground)]"}>1. Personal</span>
                  <span className={currentStep >= 2 ? "text-[var(--primary)] font-bold" : "text-[var(--muted-foreground)]"}>2. Education</span>
                  <span className={currentStep >= 3 ? "text-[var(--primary)] font-bold" : "text-[var(--muted-foreground)]"}>3. Preferences</span>
                  {isOnboarding && <span className={currentStep >= 4 ? "text-[var(--primary)] font-bold" : "text-[var(--muted-foreground)] hidden md:inline"}>4. Unlock Profile</span>}
               </div>
               <div className="h-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[var(--primary)] transition-all duration-500" style={{ width: `${(currentStep / (isOnboarding ? 4 : 3)) * 100}%` }}></div>
               </div>
            </div>

            <AnimatePresence mode="wait">
               <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
               
               {currentStep === 1 && (
                  <div className="space-y-6">
                     <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Personal Details</h2>
                     
                     <div className="md:col-span-2 bg-[var(--surface)] border border-[var(--border)] p-5 rounded-xl">
                       <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block flex items-center gap-2">
                            <Sparkles size={14} className="text-[var(--primary)]"/> AI Generated Professional Bio
                       </label>
                       <textarea 
                           value={formData.bio || ""} 
                           onChange={(e)=>setFormData({...formData, bio: e.target.value})} 
                           className="w-full border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all min-h-[80px]"
                       />
                     </div>

                     <div className="flex items-center gap-6 mb-6">
                        <div onClick={startCamera} className="relative w-20 h-20 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center overflow-hidden shadow-soft group cursor-pointer hover:border-[var(--primary)]/50 transition-colors">
                           {uploading ? <Loader2 className="animate-spin text-[var(--primary)]"/> : 
                               formData.photoURL ? <img src={formData.photoURL} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"/> : 
                                  <Camera size={26} className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)]"/>
                           }
                           <div className="absolute inset-0 bg-white/90 hidden group-hover:flex flex-col items-center justify-center text-center p-1.5 backdrop-blur-sm">
                              <Camera size={16} className="text-[var(--foreground)] mb-0.5"/>
                              <span className="text-[9px] text-[var(--foreground)] font-bold leading-tight">Live Capture</span>
                           </div>
                        </div>
                        <div>
                           <p className="font-semibold text-base text-[var(--foreground)]">Profile Photo <span className="text-[#c53030]">*</span></p>
                           <p className="text-xs text-[var(--muted-foreground)] font-medium">Click to capture a professional photo</p>
                        </div>
                     </div>

                     <AnimatePresence>
                        {showCamera && (
                           <div className="fixed inset-0 z-50 bg-[var(--foreground)]/40 flex items-center justify-center p-4 backdrop-blur-sm">
                              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white border border-[var(--border)] p-6 rounded-xl max-w-md w-full shadow-modal">
                                 <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2"><ScanFace className="text-[var(--primary)]"/> Capture Profile Picture</h3>
                                    <button onClick={stopCamera} className="text-[var(--muted-foreground)] hover:text-[#c53030]"><X size={20}/></button>
                                 </div>
                                 
                                 <p className="text-xs text-[var(--muted-foreground)] text-center mb-4">Please look straight into the camera to capture a clear photo.</p>

                                 <div className="relative w-full aspect-square bg-slate-900 rounded-lg overflow-hidden mb-5 border border-[var(--border)]">
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100"></video>
                                    <canvas ref={canvasRef} className="hidden"></canvas>
                                    <div className="absolute inset-0 border-2 border-dashed border-[var(--primary)]/35 rounded-full m-6 pointer-events-none"></div>
                                 </div>
                                 <button onClick={capturePhoto} disabled={uploading || !aiModelsLoaded} className="w-full bg-[var(--primary)] hover:bg-[var(--primary-glow)] text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-[var(--shadow-primary)]">
                                    {!aiModelsLoaded ? <><Loader2 className="animate-spin" size={16}/> Loading AI Models...</> : uploading ? <><Loader2 className="animate-spin" size={16}/> Capturing...</> : <><Camera size={16}/> Capture Photo</>}
                                 </button>
                              </motion.div>
                           </div>
                        )}
                     </AnimatePresence>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                        <div className="w-full">
                           <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Full Name <span className="text-[#c53030]">*</span></label>
                           <input type="text" value={formData.fullName} onChange={(e)=>setFormData({...formData, fullName: e.target.value})} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"/>
                        </div>
                        <div className="w-full">
                           <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Phone Number <span className="text-[#c53030]">*</span></label>
                           <input type="text" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" placeholder="e.g. 9876543210"/>
                        </div>
                        <div className="w-full">
                           <label className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1 block flex items-center gap-1.5">
                               <MessageCircle size={14}/> WhatsApp Number
                           </label>
                           <input type="text" value={formData.whatsappNumber || ""} onChange={(e)=>setFormData({...formData, whatsappNumber: e.target.value})} className="w-full border border-[var(--primary)]/20 focus:border-[var(--primary)] bg-[var(--accent)]/30 focus:bg-white rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" placeholder="e.g. 9876543210" maxLength={10}/>
                        </div>
                        <div className="w-full">
                           <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Date of Birth <span className="text-[#c53030]">*</span> <span className="text-[var(--muted-foreground)] text-2xs lowercase font-normal">(Min. 18)</span></label>
                           <input type="date" value={formData.dob} onChange={(e)=>setFormData({...formData, dob: e.target.value})} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all [color-scheme:light]"/>
                        </div>
                        <div className="w-full">
                           <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Gender <span className="text-[#c53030]">*</span></label>
                           <select value={formData.gender} onChange={(e)=>setFormData({...formData, gender: e.target.value})} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all [color-scheme:light]">
                              <option value="">Select</option>
                              <option>Male</option>
                              <option>Female</option>
                              <option>Other</option>
                           </select>
                        </div>
                        <div className="w-full">
                           <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">City <span className="text-[#c53030]">*</span></label>
                           <input type="text" list="indian-cities" value={formData.city} onChange={(e)=>setFormData({...formData, city: e.target.value})} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" placeholder="Type to search your city..."/>
                           <datalist id="indian-cities">
                              {INDIAN_CITIES.map((c, idx) => <option key={idx} value={c.name} />)}
                           </datalist>
                        </div>
                        <div className="w-full">
                           <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Do you own a laptop? <span className="text-[#c53030]">*</span></label>
                           <select value={formData.hasLaptop} onChange={(e)=>setFormData({...formData, hasLaptop: e.target.value})} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all [color-scheme:light]">
                              <option value="">Select Option</option>
                              <option value="Yes">Yes, I have a working laptop</option>
                              <option value="No">No, I do not have a laptop</option>
                           </select>
                        </div>
                        <div className="w-full md:col-span-2">
                           <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">PAN Card <span className="text-2xs font-normal lowercase ml-1">(Optional)</span></label>
                           <input type="text" value={formData.panCard || ""} onChange={(e)=>setFormData({...formData, panCard: e.target.value.toUpperCase()})} className="w-full md:w-1/2 border border-[var(--border)] bg-white focus:bg-white uppercase font-mono tracking-widest rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" maxLength={10} placeholder="ABCDE1234F (Optional)"/>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-5 pt-5 border-t border-[var(--border)]">
                          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)]">
                             <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3 block flex items-center gap-1.5">
                                <TrendingUp className="text-[var(--primary)]" size={16}/> Core Strengths <span className="text-[var(--muted-foreground)] font-normal text-3xs lowercase">(Press Enter)</span>
                              </label>
                             <div className="flex flex-wrap gap-1.5 mb-3">
                                {formData.strengths.map((str, i) => (
                                   <span key={i} className="flex items-center gap-1 bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 px-2.5 py-1 rounded-md text-xs font-medium">
                                      {str} <X size={13} className="cursor-pointer hover:text-[var(--primary-glow)]" onClick={() => removeStr(str)}/>
                                   </span>
                                ))}
                             </div>
                             <input type="text" value={strInput} onChange={(e) => setStrInput(e.target.value)} onKeyDown={handleAddStr} className="w-full bg-transparent border-b border-[var(--border)] pb-1.5 outline-none text-[var(--foreground)] text-sm focus:border-[var(--primary)] transition-colors" placeholder="e.g. Analytical Thinking..."/>
                          </div>
                          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)]">
                             <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3 block flex items-center gap-1.5">
                                <TrendingDown className="text-[oklch(0.55_0.15_30)]" size={16}/> Areas of Improvement <span className="text-[var(--muted-foreground)] font-normal text-3xs lowercase">(Press Enter)</span>
                             </label>
                             <div className="flex flex-wrap gap-1.5 mb-3">
                                {formData.weaknesses.map((wk, i) => (
                                   <span key={i} className="flex items-center gap-1 bg-[oklch(0.97_0.015_15)] text-[oklch(0.52_0.16_20)] border border-[oklch(0.88_0.02_15)] px-2.5 py-1 rounded-md text-xs font-medium">
                                      {wk} <X size={13} className="cursor-pointer hover:text-red-900" onClick={() => removeWeak(wk)}/>
                                   </span>
                                ))}
                             </div>
                             <input type="text" value={weakInput} onChange={(e) => setWeakInput(e.target.value)} onKeyDown={handleAddWeak} className="w-full bg-transparent border-b border-[var(--border)] pb-1.5 outline-none text-[var(--foreground)] text-sm focus:border-[var(--primary)] transition-colors" placeholder="e.g. Over-detail oriented..."/>
                          </div>
                      </div>

                  </div>
               )}

               {currentStep === 2 && (
                  <div className="space-y-10">
                     {/* 🎓 MAIN SECTION 1: EDUCATION */}
                     <div className="bg-white border border-[var(--border)] p-6 md:p-8 rounded-2xl shadow-soft">
                        <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
                           <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                              <GraduationCap className="text-[var(--primary)]" size={22}/> Education Profile <span className="text-[#c53030]">*</span>
                           </h2>
                           <button onClick={addEducation} className="text-xs font-bold text-[var(--primary)] hover:text-[var(--primary-glow)] flex items-center gap-1.5 bg-[var(--accent)]/50 px-3.5 py-2 rounded-xl transition-colors">
                              <Plus size={16}/> Add Education
                           </button>
                        </div>
                        
                         <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] mb-5">
                             <label className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-2 block flex items-center gap-2">
                                 Highest Qualification Level <span className="text-[#c53030]">*</span>
                             </label>
                             <p className="text-xs text-[var(--muted-foreground)] mb-3 font-medium">This will help our AI tailor the assessment difficulty specifically for your profile level.</p>
                             <input 
                                 type="text" 
                                 list="highest-qual-list" 
                                 value={formData.highestQualification} 
                                 onChange={(e)=>setFormData({...formData, highestQualification: e.target.value})} 
                                 className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" 
                                 placeholder="Select or type your highest qualification level..."
                             />
                             <datalist id="highest-qual-list">
                                 <option value="Chartered Accountant (CA) - Qualified" />
                                 <option value="CA Finalist (Group 1 Cleared)" />
                                 <option value="CA Finalist (Group 2 Cleared)" />
                                 <option value="CA Intermediate - Cleared" />
                                 <option value="Cost & Management Accountant (CMA) - Qualified" />
                                 <option value="CMA Finalist" />
                                 <option value="CMA Intermediate" />
                                 <option value="Company Secretary (CS) - Qualified" />
                                 <option value="CS Professional" />
                                 <option value="CS Executive" />
                                 <option value="ACCA - Qualified / Affiliate" />
                                 <option value="Master of Business Administration (MBA)" />
                                 <option value="Post Graduate Diploma in Management (PGDM)" />
                                 <option value="Master of Commerce (M.Com)" />
                                 <option value="Bachelor of Commerce (B.Com)" />
                                 <option value="Bachelor of Business Administration (BBA)" />
                                 <option value="Bachelor of Technology (B.Tech / B.E.)" />
                                 <option value="Bachelor of Arts / Science (B.A. / B.Sc)" />
                                 <option value="Diploma / Polytechnic" />
                                 <option value="High School (12th / PUC)" />
                             </datalist>
                         </div>

                         <div className="space-y-4">
                            {formData.educations.map((edu, index) => {
                               const qualText = (edu.qualification || '').toLowerCase();
                               const isSchoolLevel = /(10th|12th|class 10|class 12|high school|secondary|intermediate|puc|matric|board|ssc|hsc|cbse|icse|\b10\b|\b12\b|^10$|^12$|x|xii)/i.test(qualText);
                               
                               return (
                               <div key={index} className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] relative">
                                  {formData.educations.length > 1 && (
                                     <button onClick={() => removeEducation(index)} className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-[#c53030] p-1.5 transition-colors">
                                        <X size={16}/>
                                     </button>
                                  )}
                                  <div className="grid md:grid-cols-2 gap-5 mt-2">
                                     <div className={isSchoolLevel ? "md:col-span-1" : "md:col-span-2"}>
                                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Qualification <span className="text-[#c53030]">*</span></label>
                                        <input type="text" list="qualifications-list" value={edu.qualification} onChange={(e)=>updateEducation(index, 'qualification', e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"/>
                                     </div>
                                     
                                     {isSchoolLevel && (
                                        <div className="flex gap-4">
                                           <div className="flex-1">
                                              <label className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1 block">Maths Included? <span className="text-[var(--muted-foreground)] text-3xs lowercase font-normal">(Optional)</span></label>
                                              <select value={edu.mathsIncluded || ""} onChange={(e)=>updateEducation(index, 'mathsIncluded', e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all">
                                                 <option value="">Select</option>
                                                 <option value="Yes">Yes</option>
                                                 <option value="No">No</option>
                                              </select>
                                           </div>
                                           {edu.mathsIncluded === 'Yes' && (
                                               <div className="flex-1">
                                                  <label className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1 block">Maths Score (%) <span className="text-[#c53030]">*</span></label>
                                                  <input type="text" value={edu.mathsScore || ""} onChange={(e)=>updateEducation(index, 'mathsScore', e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" placeholder="e.g. 85"/>
                                               </div>
                                           )}
                                        </div>
                                     )}

                                     {['CA', 'CMA', 'CS', 'ACCA'].some(keyword => (edu.qualification || '').includes(keyword)) && (
                                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                           <div>
                                              <label className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1 block">Stage Cleared <span className="text-[#c53030]">*</span></label>
                                              <select value={edu.stageCleared} onChange={(e)=>updateEducation(index, 'stageCleared', e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all">
                                                 <option value="">Select</option>
                                                 <option>Group 1</option>
                                                 <option>Group 2</option>
                                                 <option>Both Groups</option>
                                                 <option>Cleared</option>
                                              </select>
                                           </div>
                                           <div>
                                              <label className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-1 block">Attempts <span className="text-[#c53030]">*</span></label>
                                              <input type="text" value={edu.attempts || ""} onChange={(e)=>updateEducation(index, 'attempts', e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"/>
                                           </div>
                                        </div>
                                     )}
                                     <div className="md:col-span-2">
                                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">College / Institution <span className="text-[#c53030]">*</span></label>
                                        <input type="text" value={edu.collegeName} onChange={(e)=>updateEducation(index, 'collegeName', e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"/>
                                     </div>
                                     <div>
                                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Passing Year <span className="text-[#c53030]">*</span></label>
                                        <input type="text" value={edu.passingYear} onChange={(e)=>updateEducation(index, 'passingYear', e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"/>
                                     </div>
                                     <div>
                                        <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Total Score (%)</label>
                                        <input type="text" value={edu.percentage} onChange={(e)=>updateEducation(index, 'percentage', e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" placeholder="e.g. 75"/>
                                     </div>
                                  </div>
                               </div>
                            )})}
                            <datalist id="qualifications-list">
                               {QUALIFICATIONS_LIST.map(q => <option key={q} value={q} />)}
                            </datalist>
                         </div>
                     </div>

                     {/* 🛠️ MAIN SECTION 2: SKILLS DIRECTORY */}
                     <div className="bg-white border border-[var(--border)] p-6 md:p-8 rounded-2xl shadow-soft space-y-10">
                        <div className="border-b border-[var(--border)] pb-4">
                           <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                              <Award className="text-[var(--primary)]" size={22}/> Skills Directory & Assessment Config <span className="text-[#c53030]">*</span>
                           </h2>
                           <p className="text-xs text-[var(--muted-foreground)] font-medium mt-1">
                              Configure your functional areas below. Choose Non-Technical ground roles OR proceed with Technical evaluation tracks.
                           </p>
                        </div>

                        {/* ================================================= */}
                        {/* 1. NON-TECHNICAL EVALUATION                      */}
                        {/* ================================================= */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-center border-b border-[var(--border)]/60 pb-3">
                              <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2 uppercase tracking-wider">
                                 <ShieldAlert className="text-amber-600" size={18}/> Non-Technical Evaluation <span className="text-[var(--muted-foreground)] font-normal text-2xs lowercase">(Ground Operational Roles)</span>
                              </h3>
                              {formData.operationsSkills.length > 0 && (
                                 <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-md text-xs font-semibold">
                                    {formData.operationsSkills.length} Selected
                                 </span>
                              )}
                           </div>
                           <p className="text-xs text-[var(--muted-foreground)] font-medium">
                              Select ground operational roles below if you do not want an advanced technical evaluation. <strong className="text-[var(--foreground)]">Selecting any option here automatically disables Technical Evaluation.</strong>
                           </p>

                           {/* Selected Non-Tech Summary Badges */}
                           {formData.operationsSkills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3 p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 border-dashed">
                                 {formData.operationsSkills.map(opSkill => (
                                    <span key={opSkill} className="flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-lg text-xs font-bold">
                                       {opSkill} 
                                       <X 
                                          size={14} 
                                          className="cursor-pointer hover:text-red-700" 
                                          onClick={() => {
                                             setFormData(prev => {
                                                const updated = prev.operationsSkills.filter(s => s !== opSkill);
                                                return {
                                                   ...prev,
                                                   operationsSkills: updated,
                                                   selectsGeneralTrack: updated.length === 0 ? true : prev.selectsGeneralTrack
                                                };
                                             });
                                          }}
                                       />
                                    </span>
                                 ))}
                              </div>
                           )}

                           {/* Structured Grid Cards for Non-Technical Roles */}
                           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                 "Physical Verification (PV)", 
                                 "Documentation Work", 
                                 "Simple Data Entry Roles",
                                 "Billing & Cash Counter Management", 
                                 "Stock & Inventory Counting", 
                                 "Basic Tele-Calling / Verification Support", 
                                 "File Archiving & Record Keeping"
                              ].map((opSkill) => {
                                 const isSelected = formData.operationsSkills.includes(opSkill);
                                 return (
                                    <button
                                       key={opSkill}
                                       type="button"
                                       onClick={() => {
                                          setFormData(prev => {
                                             const exists = prev.operationsSkills.includes(opSkill);
                                             const updatedOps = exists 
                                                ? prev.operationsSkills.filter(s => s !== opSkill) 
                                                : [...prev.operationsSkills, opSkill];
                                             return {
                                                ...prev,
                                                operationsSkills: updatedOps,
                                                selectsGeneralTrack: updatedOps.length === 0 ? true : false,
                                                skills: updatedOps.length > 0 ? [] : prev.skills,
                                                technologicalSkills: updatedOps.length > 0 ? [] : prev.technologicalSkills
                                             };
                                          });
                                       }}
                                       className={`text-left p-3.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-between group ${
                                          isSelected 
                                            ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm' 
                                            : 'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]/50'
                                       }`}
                                    >
                                       <span className="pr-2 leading-snug">{opSkill}</span>
                                       <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                                          isSelected ? 'bg-white border-white text-[var(--primary)]' : 'bg-white border-[var(--border)] group-hover:border-[var(--primary)]'
                                       }`}>
                                          {isSelected && <Check size={12} strokeWidth={3} className="text-[var(--primary)]"/>}
                                       </div>
                                    </button>
                                 );
                              })}
                           </div>
                        </div>

                        {/* ================================================= */}
                        {/* 2. TECHNICAL EVALUATION                          */}
                        {/* ================================================= */}
                        <div className={`pt-6 border-t border-[var(--border)] space-y-6 ${formData.operationsSkills.length > 0 ? 'opacity-40 pointer-events-none' : ''}`}>
                           <div className="flex justify-between items-center border-b border-[var(--border)]/60 pb-3">
                              <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2 uppercase tracking-wider">
                                 <Target className="text-[var(--primary)]" size={18}/> Technical Evaluation
                              </h3>
                              {formData.operationsSkills.length === 0 && (
                                 <span className="bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 px-2.5 py-1 rounded-md text-xs font-semibold">
                                    Active Track
                                 </span>
                              )}
                           </div>

                           {formData.operationsSkills.length > 0 && (
                              <div className="text-xs text-amber-800 font-bold bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-center gap-2">
                                 <AlertTriangle size={15}/> Technical evaluation is locked because you chose Non-Technical / Operations roles above. Uncheck all operational tags to re-enable.
                              </div>
                           )}

                           {/* Sub-section A: General Track (MANDATORY / MUST) */}
                           <div className="bg-[var(--surface)] border-2 border-[var(--primary)]/30 rounded-xl p-5 relative overflow-hidden shadow-soft">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                 <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-[var(--primary)] rounded flex items-center justify-center shrink-0">
                                       <Check size={14} className="text-white" strokeWidth={3}/>
                                    </div>
                                    <h4 className="font-bold text-sm text-[var(--primary)]">
                                       General Commerce & Foundational Core Track
                                    </h4>
                                 </div>
                                 <span className="bg-[var(--primary)] text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
                                    MANDATORY (MUST)
                                 </span>
                              </div>
                              <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed pl-7">
                                 Every candidate on the technical evaluation path must complete this foundational assessment. It tests standard commerce, basic accounting, and core business fundamentals matched to your qualification level.
                              </p>
                           </div>

                           {/* Sub-section B: Specialisation Sub-Skills (SELECTIVE / OPTIONAL) */}
                           <div className="pt-2">
                              <div className="flex justify-between items-center mb-2">
                                 <h4 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider flex items-center gap-1.5">
                                    Specialisation Sub-Skills <span className="text-[var(--muted-foreground)] text-2xs lowercase font-normal">(Selective / Optional)</span>
                                 </h4>
                                 <span className="bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 px-2.5 py-1 rounded-md text-xs font-semibold">
                                    {formData.skills.length} / 10 Selected
                                 </span>
                              </div>
                              <p className="text-xs text-[var(--muted-foreground)] mb-4 font-medium">
                                 Choose <strong className="text-[var(--foreground)]">0 to 10 specialisations</strong> if you want to prove expertise in specific technical domains. (7 intermediate & hard situational questions will be generated per selected skill).
                              </p>

                              {/* Selected Specialisations Pill Badges */}
                              {formData.skills.length > 0 && (
                                 <div className="flex flex-wrap gap-1.5 mb-5 p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] border-dashed">
                                    {formData.skills.map(skill => (
                                       <span key={skill} className="flex items-center gap-1.5 bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 px-3 py-1.5 rounded-lg text-xs font-semibold">
                                          {skill} <X className="cursor-pointer hover:text-[var(--primary-glow)]" onClick={() => toggleSkill(skill)} size={14}/>
                                       </span>
                                    ))}
                                 </div>
                              )}

                              {/* Master Skills Tabbed Component */}
                              <div className="border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)] flex flex-col md:flex-row shadow-soft">
                                 {/* Left Categories Column */}
                                 <div className="md:w-1/3 bg-white border-r border-[var(--border)] p-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                                    {(Object.keys(MASTER_SKILLS_DATA) as Array<keyof typeof MASTER_SKILLS_DATA>).map((mainSkill) => (
                                       <button 
                                          key={mainSkill} 
                                          onClick={() => setActiveSkillTab(mainSkill)} 
                                          className={`w-full text-left px-3 py-2.5 mb-1.5 text-xs font-bold rounded-lg transition-all border ${
                                             activeSkillTab === mainSkill 
                                             ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm' 
                                             : 'bg-white border-transparent text-[var(--muted-foreground)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]'
                                          }`}
                                       >
                                          {mainSkill}
                                       </button>
                                    ))}
                                 </div>

                                 {/* Right Sub-skills Column */}
                                 <div className="md:w-2/3 p-5 max-h-[350px] overflow-y-auto custom-scrollbar bg-white">
                                    <h4 className="text-[var(--foreground)] font-semibold text-sm mb-4 flex items-center gap-1.5 border-b border-[var(--border)] pb-2">
                                       Select Sub-Skills for <span className="text-[var(--primary)]">{activeSkillTab}</span>
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                       {(MASTER_SKILLS_DATA[activeSkillTab] || []).map((subSkill: string) => {
                                          const isSelected = formData.skills.includes(subSkill);
                                          return (
                                             <button 
                                                key={subSkill} 
                                                onClick={() => toggleSkill(subSkill)} 
                                                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${isSelected ? 'bg-[var(--accent)]/50 border-[var(--primary)] text-[var(--foreground)]' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/50'} flex items-center justify-between group`}
                                             >
                                                <span className="truncate pr-2">{subSkill}</span>
                                                <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'bg-white border-[var(--border)] group-hover:border-[var(--primary)]/50'}`}>
                                                   {isSelected && <Check className="text-white" size={11}/>}
                                                </div>
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* C. BEHAVIORAL & SOFT SKILLS */}
                        <div className="pt-6 border-t border-[var(--border)]">
                           <div className="flex justify-between items-center mb-3">
                              <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-1.5 uppercase tracking-wider">
                                 <Users className="text-[var(--primary)]" size={18}/> Behavioral & Soft Skills <span className="text-[#c53030] text-sm">*</span>
                              </h3>
                              <span className="bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 px-2.5 py-1 rounded-md text-xs font-semibold">
                                 {formData.behavioralSkills.length} / 5 Selected
                              </span>
                           </div>
                           <p className="text-xs text-[var(--muted-foreground)] mb-4">Select <strong className="text-[var(--foreground)]">Minimum 1 and Maximum 5</strong> behavioral traits.</p>
                           
                           {formData.behavioralSkills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-5 p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] border-dashed">
                                 {formData.behavioralSkills.map(skill => (
                                    <span key={skill} className="flex items-center gap-1.5 bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 px-3 py-1.5 rounded-lg text-sm font-semibold">
                                       {skill} <X className="cursor-pointer hover:text-[var(--primary-glow)]" onClick={() => removeBehavioralSkill(skill)} size={14}/>
                                    </span>
                                 ))}
                              </div>
                           )}

                           <div className="grid md:grid-cols-2 gap-5">
                               <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)]">
                                  <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3 block flex items-center gap-1.5">
                                     <Plus className="text-[var(--primary)]" size={16}/> Add Custom Skill <span className="text-[var(--muted-foreground)] font-normal text-3xs lowercase">(Press Enter)</span>
                                  </label>
                                  <input type="text" value={behavInput} onChange={(e) => setBehavInput(e.target.value)} onKeyDown={handleAddBehavioralSkill} className="w-full bg-transparent border-b border-[var(--border)] pb-1.5 outline-none text-[var(--foreground)] text-sm focus:border-[var(--primary)] transition-colors" placeholder="e.g. Public Speaking, Negotiation..."/>
                               </div>

                               <div className="bg-white p-5 rounded-xl border border-[var(--border)] shadow-soft">
                                  <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3 block">Quick Suggestions</label>
                                  <div className="flex flex-wrap gap-1.5 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
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
                                              className={`px-2.5 py-1.5 rounded-md text-2xs font-semibold transition-all border flex items-center gap-1 ${isSelected ? 'bg-[var(--accent)] border-[var(--primary)]/40 text-[var(--primary)]' : 'bg-white border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/30'}`}
                                           >
                                              {isSelected && <Check className="text-[var(--primary)]" size={11}/>}
                                              {bSkill}
                                           </button>
                                        );
                                     })}
                                  </div>
                               </div>
                           </div>
                        </div>

                        {/* D. TECHNOLOGICAL TOOLS & SOFTWARE */}
                        <div className="pt-6 border-t border-[var(--border)]">
                           <div className="flex justify-between items-center mb-3">
                              <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-1.5 uppercase tracking-wider">
                                 <Monitor className="text-[var(--primary)]" size={18}/> Technological Tools & Software <span className="text-[var(--muted-foreground)] text-xs font-normal lowercase ml-1">(Optional)</span>
                              </h3>
                              <span className="bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 px-2.5 py-1 rounded-md text-xs font-semibold">
                                 {formData.technologicalSkills.length} / 8 Selected
                              </span>
                           </div>
                           <p className="text-xs text-[var(--muted-foreground)] mb-4">Select tools you are proficient in (Max 8) and set your level.</p>
                           
                           {formData.technologicalSkills.length > 0 && (
                              <div className="flex flex-col gap-2.5 mb-5 p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] border-dashed">
                                 {formData.technologicalSkills.map(skill => (
                                    <div key={skill.name} className="flex items-center gap-2.5 bg-[var(--accent)] border border-[var(--primary)]/25 px-3 py-2 rounded-lg w-fit">
                                       <span className="text-[var(--primary)] text-sm font-semibold">{skill.name}</span>
                                       <div className="flex items-center gap-2.5 ml-2 border-l border-[var(--border)] pl-3">
                                           <select 
                                               value={skill.level} 
                                               onChange={(e) => updateTechSkillLevel(skill.name, e.target.value)}
                                               className="bg-white text-[var(--primary)] text-xs font-semibold px-2 py-1.5 rounded-md border border-[var(--primary)]/20 outline-none cursor-pointer hover:bg-[var(--surface)] transition-colors"
                                           >
                                               <option value="Beginner">Beginner Level</option>
                                               <option value="Intermediate">Intermediate Level</option>
                                               <option value="Advanced">Advanced Level</option>
                                           </select>
                                           <X className="cursor-pointer text-[var(--muted-foreground)] hover:text-[#c53030] ml-1 transition-colors" onClick={() => removeTechSkill(skill.name)} size={15}/>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}

                           <div className="grid md:grid-cols-2 gap-5">
                                <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)]">
                                  <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3 block flex items-center gap-1.5">
                                     <Plus className="text-[var(--primary)]" size={16}/> Add Custom Tool <span className="text-[var(--muted-foreground)] font-normal text-3xs lowercase">(Press Enter)</span>
                                  </label>
                                  <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleAddTechSkill} className="w-full bg-transparent border-b border-[var(--border)] pb-1.5 outline-none text-[var(--foreground)] text-sm focus:border-[var(--primary)] transition-colors" placeholder="e.g. Jira, Xero, Tally ERP 9..."/>
                               </div>

                               <div className="bg-white p-5 rounded-xl border border-[var(--border)] shadow-soft">
                                  <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3 block">Most Demanded Tools</label>
                                  <div className="flex flex-wrap gap-1.5 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                                     {TECH_SKILLS_LIST.map((tSkill: string) => {
                                        const isSelected = formData.technologicalSkills.some(s => s.name === tSkill);
                                        return (
                                           <button 
                                              key={tSkill} 
                                              onClick={() => toggleTechSkill(tSkill)} 
                                              className={`px-2.5 py-1.5 rounded-md text-2xs font-semibold transition-all border flex items-center gap-1 ${isSelected ? 'bg-[var(--accent)] border-[var(--primary)]/40 text-[var(--primary)]' : 'bg-white border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/30'}`}
                                           >
                                              {isSelected && <Check className="text-[var(--primary)]" size={11}/>}
                                              {tSkill}
                                           </button>
                                        );
                                     })}
                                  </div>
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
                           <h2 className="text-3xl font-extrabold text-indigo-950">Past Work Experience</h2>
                           <button onClick={addWorkExp} className="text-sm font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 transition-colors">
                               <Plus size={18}/> Add Company
                           </button>
                        </div>
                        
                        <div className="space-y-6">
                           {formData.workExperience.map((work, index) => (
                              <div key={index} className="bg-white p-6 md:p-8 rounded-3xl border-2 border-indigo-50 relative shadow-sm hover:border-indigo-100 transition-all">
                                 
                                 {/* Perfectly aligned Delete Button */}
                                 <button 
                                    onClick={() => removeWorkExp(index)} 
                                    className="absolute top-5 right-5 bg-indigo-50 text-indigo-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all z-10 flex items-center justify-center"
                                    title="Remove Experience"
                                 >
                                    <X size={18}/>
                                 </button>
                                 
                                 {/* 2-Column Professional Grid */}
                                 <div className="grid md:grid-cols-2 gap-6 mt-2">
                                    <div>
                                       <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 block">Company Name</label>
                                       <input type="text" value={work.company} onChange={(e)=>updateWorkExp(index, 'company', e.target.value)} className="w-full border-2 border-indigo-100 rounded-xl px-4 py-3 text-sm text-indigo-950 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. TCS"/>
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 block">Job Role / Position</label>
                                       <input type="text" value={work.role} onChange={(e)=>updateWorkExp(index, 'role', e.target.value)} className="w-full border-2 border-indigo-100 rounded-xl px-4 py-3 text-sm text-indigo-950 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Audit Exec"/>
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 block">Designation Level</label>
                                       <select value={work.designation || ""} onChange={(e)=>updateWorkExp(index, 'designation', e.target.value)} className="w-full border-2 border-indigo-100 rounded-xl px-4 py-3 text-sm text-indigo-950 focus:border-indigo-500 outline-none transition-all [color-scheme:light]">
                                          <option value="">Select Level</option>
                                          <option>Intern / Trainee</option>
                                          <option>Associate / Executive</option>
                                          <option>Senior Associate / Analyst</option>
                                          <option>Supervisor / Team Lead</option>
                                          <option>Manager</option>
                                          <option>Director / VP</option>
                                       </select>
                                    </div>
                                    <div>
                                       <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 block">Duration</label>
                                       <input type="text" value={work.duration} onChange={(e)=>updateWorkExp(index, 'duration', e.target.value)} className="w-full border-2 border-indigo-100 rounded-xl px-4 py-3 text-sm text-indigo-950 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. 2021 - 2023"/>
                                    </div>
                                    <div className="md:col-span-2">
                                       <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 block">Work Summary <span className="text-indigo-400 font-normal ml-1">(Auto-filled by AI)</span></label>
                                       <textarea value={work.summary || ""} onChange={(e)=>updateWorkExp(index, 'summary', e.target.value)} className="w-full border-2 border-indigo-100 rounded-xl p-4 text-sm text-indigo-950 focus:border-indigo-500 outline-none transition-all min-h-[100px] resize-y" placeholder="Brief summary of tasks handled..."/>
                                    </div>
                                 </div>
                              </div>
                           ))}
                           {formData.workExperience.length === 0 && <p className="text-indigo-400 text-sm font-medium pl-2">No past experience added. AI will auto-fill if found on resume.</p>}
                        </div>
                     </div>

                     <div className="pt-8 border-t border-indigo-100">
                        <div className="flex justify-between items-center mb-6">
                           <h2 className="text-3xl font-extrabold text-indigo-950 flex items-center gap-3"><Award className="text-indigo-500"/> Achievements & Certifications</h2>
                           <button onClick={addAchievement} className="text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-4 py-2 rounded-xl transition-colors">
                              <Plus size={18} className="inline mr-1"/> Add Achievement
                           </button>
                        </div>
                        <div className="space-y-4">
                           {formData.achievements.map((ach, index) => (
                              <div key={index} className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] relative">
                                 <button onClick={() => removeAchievement(index)} className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-[#c53030] p-1.5 transition-colors">
                                    <X size={16}/>
                                 </button>
                                 <div className="grid md:grid-cols-2 gap-5 mt-2">
                                    <div className="md:col-span-2">
                                       <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Achievement / Certificate Title</label>
                                       <input type="text" value={ach.title} onChange={(e)=>updateAchievement(index, 'title', e.target.value)} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" placeholder="e.g. Employee of the Month, NCFM Certified..."/>
                                    </div>
                                    <div className="md:col-span-2">
                                       <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Short Description</label>
                                       <textarea value={ach.description} onChange={(e)=>updateAchievement(index, 'description', e.target.value)} className="w-full border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all min-h-[60px]" placeholder="e.g. Awarded for generating maximum revenue..."/>
                                    </div>
                                    <div className="md:col-span-2">
                                       <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Upload Certificate/Photo <span className="text-2xs font-normal lowercase ml-1">(Optional)</span></label>
                                       <div className="flex items-center gap-4 mt-1">
                                          {ach.imageURL && (
                                              <img src={ach.imageURL} alt="Achievement" className="w-14 h-14 object-cover rounded-lg border border-[var(--border)] shadow-soft"/>
                                          )}
                                          <div className="relative">
                                             <input type="file" accept="image/*" onChange={(e) => handleAchievementImageUpload(index, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                                             <div className="bg-white hover:bg-[var(--surface)] text-[var(--primary)] text-xs font-semibold px-3 py-2 rounded-lg border border-[var(--border)] flex items-center gap-2 transition-colors shadow-soft">
                                                  <ImagePlus size={14}/> {ach.imageURL ? "Change Image" : "Upload Image"}
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                           {formData.achievements.length === 0 && <p className="text-xs text-[var(--muted-foreground)] pl-2 font-medium">Stand out by adding your awards or extra certifications.</p>}
                        </div>
                     </div>

                     <div className="pt-6 border-t border-[var(--border)]">
                         <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Work & Salary Preferences</h2>
                         <div className="grid md:grid-cols-2 gap-6">
                            <div>
                               <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Total Experience <span className="text-[#c53030]">*</span></label>
                               <select value={formData.experience} onChange={(e)=>setFormData({...formData, experience: e.target.value})} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all [color-scheme:light]">
                                  <option>Fresher</option>
                                  <option>0-1 Years</option>
                                  <option>1-3 Years</option>
                                  <option>3-5 Years</option>
                                  <option>5+ Years</option>
                               </select>
                            </div>
                             <div>
                                <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Notice Period <span className="text-[#c53030]">*</span></label>
                                <select
                                  value={["Immediate Joiner","15 Days","1 Month","2 Months"].includes(formData.noticePeriod) ? formData.noticePeriod : "Custom"}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "Custom") {
                                      setCustomNoticeDays("");
                                      setFormData({...formData, noticePeriod: ""});
                                    } else {
                                      setCustomNoticeDays("");
                                      setFormData({...formData, noticePeriod: val});
                                    }
                                  }}
                                  className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all [color-scheme:light]"
                                >
                                   <option>Immediate Joiner</option>
                                   <option>15 Days</option>
                                   <option>1 Month</option>
                                   <option>2 Months</option>
                                   <option value="Custom">Custom (Enter Days)</option>
                                </select>
                                {!["Immediate Joiner","15 Days","1 Month","2 Months"].includes(formData.noticePeriod) && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <input
                                      type="number"
                                      min="1"
                                      max="365"
                                      placeholder="Enter days e.g. 20"
                                      value={customNoticeDays}
                                      onChange={(e) => {
                                        const days = e.target.value.replace(/\D/g, "");
                                        setCustomNoticeDays(days);
                                        if (days) setFormData({...formData, noticePeriod: `${days} Days`});
                                      }}
                                      className="w-full border border-[var(--primary)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all"
                                    />
                                    <span className="text-sm font-semibold text-[var(--muted-foreground)] whitespace-nowrap">Days</span>
                                  </div>
                                )}
                             </div>
                            
                            {formData.experience !== "Fresher" && (
                               <div>
                                  <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Monthly Current Salary</label>
                                  <input type="text" value={formData.currentSalary || ""} onChange={(e)=>setFormData({...formData, currentSalary: e.target.value})} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all" placeholder="e.g. ₹30,000"/>
                               </div>
                            )}
                           <div>
                               <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Monthly Expected Salary <span className="text-[#c53030]">*</span></label>
                               <input type="text" value={formData.expectedSalary || ""} onChange={(e)=>setFormData({...formData, expectedSalary: e.target.value})} className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] focus:bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all bg-[var(--accent)]/30 ${showHikeWarning ? 'border-amber-400' : 'border-[var(--primary)]/20'}`} placeholder="e.g. ₹40,000"/>
                               <AnimatePresence>
                                  {showHikeWarning && (
                                     <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="overflow-hidden">
                                        <p className="text-xs text-[oklch(0.40_0.10_70)] mt-2 font-semibold flex items-center gap-1 bg-[oklch(0.98_0.02_70)] p-2 rounded-lg border border-[oklch(0.85_0.05_70)] shadow-soft">
                                           <AlertTriangle size={14} className="shrink-0"/> Asking for &gt;30% hike may slow down your hiring process.
                                        </p>
                                     </motion.div>
                                  )}
                               </AnimatePresence>
                            </div>
 
                            <div className="md:col-span-2">
                               <label className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider mb-2 block">Looking For (Role Type) <span className="text-[#c53030]">*</span></label>
                               <select 
                                  value={formData.jobType} 
                                  onChange={(e)=>{
                                      const val = e.target.value;
                                      setFormData({...formData, jobType: val, openToContractRoles: val === "Permanent Role" ? "" : (val === "Open to Both (Permanent & Contractual)" ? "Yes" : formData.openToContractRoles)});
                                  }} 
                                  className="w-full border border-[var(--primary)]/25 bg-[var(--accent)]/30 rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all [color-scheme:light] mb-4"
                               >
                                  <option value="Permanent Role">Permanent Role</option>
                                  <option value="Open to Both (Permanent & Contractual)">Open to Both (Permanent & Contractual)</option>
                                  <option value="1-3 Month Contract">1-3 Month Contract</option>
                                  <option value="3-6 Month Contract">3-6 Month Contract</option>
                                  <option value="6+ Month Contract">6+ Month Contract</option>
                                  <option value="Freelance/Project Basis">Freelance/Project Basis</option>
                                  <option value="Internship">Internship</option>
                                </select>
                               
                               {formData.jobType === "Permanent Role" && (
                                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-xl flex flex-col md:flex-row items-start gap-4 shadow-soft">
                                     <div className="bg-white p-2.5 rounded-lg shrink-0 mt-0.5 border border-[var(--border)] shadow-soft">
                                        <Briefcase className="text-[var(--primary)]" size={24}/>
                                     </div>
                                     <div className="w-full">
                                        <h4 className="text-[var(--foreground)] font-bold mb-1.5 text-base">Smart Career Tip 💡</h4>
                                        <p className="text-[var(--muted-foreground)] text-xs mb-3 leading-relaxed font-medium">
                                           Top companies on Resourcemania often hire for high-paying, short-term contract projects (ranging from 1 to 12 months). Would you like to be considered for these while you hunt for a permanent role? <span className="text-[#c53030] text-xs ml-1">*Required</span>
                                        </p>
                                        
                                        <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                           <button 
                                              type="button"
                                              onClick={() => setFormData({...formData, openToContractRoles: "Yes"})}
                                              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${formData.openToContractRoles === "Yes" ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-[var(--shadow-primary)]' : 'bg-white border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--foreground)]'}`}
                                           >
                                              {formData.openToContractRoles === "Yes" && <Check size={14} strokeWidth={3}/>} Yes, I'm open to it
                                           </button>
                                           
                                           <button 
                                              type="button"
                                              onClick={() => setFormData({...formData, openToContractRoles: "No"})}
                                              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${formData.openToContractRoles === "No" ? 'bg-[oklch(0.97_0.015_15)] border-[oklch(0.85_0.02_15)] text-[#c53030] shadow-soft' : 'bg-white border-[var(--border)] text-[var(--muted-foreground)] hover:border-[#c53030] hover:bg-[oklch(0.98_0.015_15)] hover:text-[#c53030]'}`}
                                           >
                                              {formData.openToContractRoles === "No" && <X size={14} strokeWidth={3}/>} No, only permanent
                                           </button>
                                        </div>
                                     </div>
                                  </motion.div>
                               )}
                            </div>
 
                            <div>
                               <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Work Mode</label>
                               <select value={formData.workMode} onChange={(e)=>setFormData({...formData, workMode: e.target.value})} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all [color-scheme:light]">
                                  <option>On-site</option>
                                  <option>Hybrid</option>
                                  <option>Work From Home</option>
                               </select>
                            </div>
                            <div>
                               <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Willing to Relocate?</label>
                               <select value={formData.willingToRelocate} onChange={(e)=>setFormData({...formData, willingToRelocate: e.target.value})} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all [color-scheme:light]">
                                  <option>No</option>
                                  <option>Yes</option>
                               </select>
                            </div>
                            <div className="md:col-span-2">
                               <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1 block">Traveling Preference</label>
                               <select value={formData.travelPreference || "No / Minimal Travel (Work from Base Office Only)"} onChange={(e)=>setFormData({...formData, travelPreference: e.target.value})} className="w-full border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--foreground)] bg-white focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all [color-scheme:light]">
                                  <option value="No / Minimal Travel (Work from Base Office Only)">No / Minimal Travel (Work from Base Office Only)</option>
                                  <option value="Occasional Travel (Up to 5–7 Days / Month)">Occasional Travel (Up to 5–7 Days / Month)</option>
                                  <option value="Moderate Travel (15+ Days / Month)">Moderate Travel (15+ Days / Month)</option>
                                  <option value="Open to Frequent Travel (No Restrictions)">Open to Frequent Travel (No Restrictions)</option>
                               </select>
                            </div>
 
                            <div className="md:col-span-2 bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] mt-4 shadow-soft">
                               <label className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3 block">Preferred Work Locations <span className="text-[var(--muted-foreground)] font-normal text-3xs lowercase ml-1">(Type city & press Enter)</span></label>
                               <div className="flex flex-wrap gap-2 mb-3">
                                  {formData.preferredLocations.map((loc, i) => (
                                     <span key={i} className="flex items-center gap-1.5 bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20 px-3 py-1.5 rounded-lg text-sm font-semibold">
                                        {loc} <X size={14} className="cursor-pointer text-[var(--muted-foreground)] hover:text-[#c53030]" onClick={() => removeLocation(loc)}/>
                                     </span>
                                  ))}
                                </div>
                              <input type="text" list="indian-cities" value={locInput} onChange={(e) => setLocInput(e.target.value)} onKeyDown={handleAddLocation} className="w-full bg-transparent border-b border-[var(--border)] pb-2 outline-none text-[var(--foreground)] text-sm focus:border-[var(--primary)] transition-colors" placeholder="Type city and press Enter..."/>
                            </div>
                         </div>
                      </div>
                  </div>
               )}

               {currentStep === 4 && isOnboarding && (
                 <div className="space-y-6 text-center py-4">
                     <div className="w-16 h-16 bg-[var(--accent)] border border-[var(--primary)]/20 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                        <ShieldAlert size={36} className="text-[var(--primary)]" />
                     </div>
                     <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2 tracking-tight">
                        Profile Saved, but <span className="text-[var(--primary)]">HIDDEN</span> 🔒
                      </h2>
                     <p className="text-[var(--muted-foreground)] text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">
                        To maintain trust, companies can only see profiles that have passed the AI Skill Assessment. Unlock your profile now to get hired.
                     </p>
                     
                     <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto mb-6">
                        <div className="bg-white p-5 rounded-xl border border-[var(--border)] hover:border-[var(--primary)]/30 flex flex-col shadow-soft text-left">
                           <h3 className="text-base font-bold text-[var(--foreground)] mb-2 flex items-center gap-2">
                              <PlayCircle className="text-[var(--primary)]" size={20}/> Practice First
                           </h3>
                           <p className="text-[var(--muted-foreground)] text-xs mb-6 flex-1">Take a quick dummy test to understand how tracking works.</p>
                           <button onClick={() => router.push('/student/demo-test?returnTo=profile')} className="w-full bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--accent)] text-[var(--foreground)] py-2.5 rounded-lg text-sm font-semibold transition-all shadow-soft">
                              Take Demo Test
                           </button>
                        </div>
                        <div className="bg-[var(--accent)] p-5 rounded-xl border border-[var(--primary)]/25 hover:border-[var(--primary)]/45 transition-all text-left shadow-soft relative overflow-hidden flex flex-col">
                           <div className="absolute top-0 right-0 bg-[var(--primary)] text-white text-2xs font-semibold tracking-widest px-3 py-1 rounded-bl-lg shadow-soft">REQUIRED</div>
                           <h3 className="text-base font-bold text-[var(--foreground)] mb-2 flex items-center gap-2">
                              <Target className="text-[var(--primary)]" size={20}/> Final Assessment
                           </h3>
                           <p className="text-[var(--muted-foreground)] text-xs mb-6 flex-1">Ensure you are in a quiet room.</p>
                           <button onClick={() => router.push('/student/test')} className="w-full bg-[var(--primary)] hover:bg-[var(--primary-glow)] text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-soft flex justify-center items-center gap-2">
                              Start AI Test Now <ChevronRight size={16}/>
                           </button>
                        </div>
                      </div>
                     <button onClick={() => { setIsEditing(false); router.push('/student/dashboard'); }} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-bold text-xs underline underline-offset-4 transition-colors">
                        Save as draft & take test later
                     </button>
                  </div>
               )}
               </motion.div>
            </AnimatePresence>

            {currentStep < 4 && (
               <div className="flex justify-between mt-10 pt-6 border-t border-[var(--border)]">
                  {currentStep > 1 ? (
                     <button onClick={prevStep} className="px-5 py-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] font-semibold flex items-center gap-2 text-xs text-[var(--muted-foreground)] transition-all shadow-soft">
                        <ChevronLeft size={16}/> Back
                     </button>
                  ) : <div></div>}
                  
                  {currentStep < 3 ? (
                     <button onClick={validateAndProceed} className="px-6 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-glow)] font-semibold flex items-center gap-2 text-white shadow-[var(--shadow-primary)] text-xs transition-all">
                        Next <ChevronRight size={16}/>
                     </button>
                  ) : (
                     isOnboarding ?
                     (
                        <button onClick={() => saveProfileData(4)} disabled={savingData} className="px-6 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-glow)] font-semibold flex items-center gap-2 text-white shadow-[var(--shadow-primary)] text-xs transition-all">
                           {savingData ? <><Loader2 className="animate-spin" size={16}/> Saving...</> : <>Save & Next: Assessment <ChevronRight size={16}/></>}
                        </button>
                     ) : (
                        <button onClick={() => saveProfileData()} disabled={savingData} className="px-6 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-glow)] font-semibold flex items-center gap-2 text-white shadow-[var(--shadow-primary)] text-xs transition-all">
                           {savingData ? <><Loader2 className="animate-spin" size={16}/> Saving...</> : <><Save size={16}/> Save Changes</>}
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
            font-weight: 800; 
            color: var(--foreground); 
            margin-bottom: 0.6rem; 
        }
        .input-field { 
            width: 100%;
            background-color: var(--input); 
            border: 1px solid var(--border); 
            border-radius: 1rem; 
            padding: 1rem 1.25rem; 
            color: var(--foreground); 
            outline: none; 
            transition: all 0.2s; 
            font-size: 1rem;
            font-weight: 600; 
            appearance: none; 
            box-shadow: var(--shadow-sm);
        }
        .input-field:focus { 
            border-color: var(--primary);
            background-color: var(--surface); 
            box-shadow: var(--shadow-ring);
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
            background: var(--border);
            border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
            background: var(--muted-foreground);
        }
      `}</style>
    </div>
  );
}
