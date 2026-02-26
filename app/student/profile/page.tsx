"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MapPin, Briefcase, 
  Edit, Save, Phone, Camera, Loader2, ArrowLeft, 
  GraduationCap, ChevronRight, ChevronLeft, Sparkles, Plus, X, ShieldCheck, Check, Globe, FileText, Search
} from "lucide-react";
import CandidateProfileView from "@/app/components/CandidateProfileView";
import { QUALIFICATIONS_LIST, EXCEL_SKILLS_DATA } from "@/lib/constants";

export default function CandidateProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showGatekeeper, setShowGatekeeper] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userEmail, setUserEmail] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "", dob: "", gender: "", phone: "", photoURL: "", addressLine: "", city: "", state: "", pincode: "", willingToRelocate: "No",
    panCard: "", bio: "", 
    educations: [{ qualification: "", collegeName: "", passingYear: "", percentage: "", stageCleared: "", attempts: "" }], 
    workExperience: [] as { company: string, role: string, duration: string }[],
    languages: [] as { language: string; proficiency: string }[],
    skills: [] as string[],
    preferredLocations: [] as string[],
    experience: "Fresher", currentStatus: "Unemployed", noticePeriod: "Immediate", 
    currentSalary: "", expectedSalary: "", 
    workMode: "On-site", jobType: "Permanent", availabilityDuration: "",
    resumeURL: ""
  });

  const languageOptions = ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada", "Bengali", "French", "German"];
  const proficiencyOptions = ["Native / Bilingual", "Fluent", "Intermediate", "Beginner"];

  const [locInput, setLocInput] = useState("");
  const [langInput, setLangInput] = useState("");
  const [profInput, setProfInput] = useState("Fluent");
  
  const [activeSkillTab, setActiveSkillTab] = useState(Object.keys(EXCEL_SKILLS_DATA)[0]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/student/login"); return; }
      setUserEmail(session.user.email || "");
      
      try {
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (data && data.fullName) {
          setFormData({ 
              ...formData, ...data,
              bio: data.bio || "",
              panCard: data.panCard || "",
              currentSalary: data.currentSalary || "",
              expectedSalary: data.expectedSalary || "",
              jobType: data.jobType || "Permanent",
              educations: data.educations?.length ? data.educations : formData.educations,
              workExperience: data.workExperience || [],
              languages: Array.isArray(data.languages) ? data.languages.filter((l:any) => typeof l === 'object' && l !== null && l.language) : [],
              preferredLocations: data.preferredLocations?.length ? data.preferredLocations : [],
              skills: Array.isArray(data.skills) ? data.skills.filter((s:any) => typeof s === 'string') : []
          });

          setIsEditing(false);
          setShowGatekeeper(false);
        } else { 
          setIsEditing(true); 
          setShowGatekeeper(true);
        }
      } catch (e) {} finally { setLoading(false); }
    };
    fetchProfile();
  }, [router]);

  const handleAddLocation = (e: any) => {
    if (e.key === 'Enter' && locInput.trim() !== '') {
      e.preventDefault();
      if (!formData.preferredLocations.includes(locInput.trim())) setFormData(p => ({ ...p, preferredLocations: [...p.preferredLocations, locInput.trim()] }));
      setLocInput("");
    }
  };

  const removeLocation = (loc: string) => setFormData(p => ({ ...p, preferredLocations: p.preferredLocations.filter(l => l !== loc) }));
  const addEducation = () => setFormData(p => ({ ...p, educations: [...p.educations, { qualification: "", collegeName: "", passingYear: "", percentage: "", stageCleared: "", attempts: "" }] }));
  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...formData.educations];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setFormData(p => ({ ...p, educations: newEdu }));
  };
  const removeEducation = (index: number) => {
    if (formData.educations.length === 1) return;
    const newEdu = [...formData.educations];
    newEdu.splice(index, 1);
    setFormData(p => ({ ...p, educations: newEdu }));
  };

  const addWorkExp = () => setFormData(p => ({ ...p, workExperience: [...p.workExperience, { company: "", role: "", duration: "" }] }));
  const updateWorkExp = (index: number, field: string, value: string) => { const newWork = [...formData.workExperience]; newWork[index] = { ...newWork[index], [field]: value }; setFormData(p => ({ ...p, workExperience: newWork })); };
  const removeWorkExp = (index: number) => { const newWork = [...formData.workExperience]; newWork.splice(index, 1); setFormData(p => ({ ...p, workExperience: newWork })); };

  // 🔥 ADD LANGUAGE LOGIC 🔥
  const addLanguage = () => {
    if (langInput && !formData.languages.find(l => l.language.toLowerCase() === langInput.toLowerCase())) {
      setFormData(p => ({ ...p, languages: [...p.languages, { language: langInput, proficiency: profInput }] }));
      setLangInput("");
    }
  };
  const removeLanguage = (lang: string) => setFormData(p => ({ ...p, languages: p.languages.filter(l => l.language !== lang) }));

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file || file.size > 150 * 1024) return alert("Photo too big! Max 150KB.");
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => { setFormData(prev => ({ ...prev, photoURL: reader.result as string })); setUploading(false); };
    reader.readAsDataURL(file);
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
         const rawLocs = aiData.preferredLocations || [];
         const cleanedLocs = rawLocs.filter((l:string) => l.toLowerCase() !== 'remote');
         
         setFormData(prev => ({ 
            ...prev, resumeURL: publicUrlData.publicUrl,
            fullName: aiData.fullName || prev.fullName, dob: aiData.dob || prev.dob, gender: aiData.gender || prev.gender, phone: aiData.phone || prev.phone,
            city: aiData.city || prev.city, state: aiData.state || prev.state, pincode: aiData.pincode || prev.pincode, experience: aiData.experience || prev.experience,
            bio: aiData.bio || prev.bio || "", panCard: aiData.panCard || prev.panCard || "", 
            currentSalary: aiData.currentSalary || prev.currentSalary || "", 
            expectedSalary: aiData.expectedSalary || prev.expectedSalary || "",
            educations: aiData.educations?.length > 0 ? aiData.educations : prev.educations,
            workExperience: aiData.workExperience?.length > 0 ? aiData.workExperience : prev.workExperience, 
            preferredLocations: cleanedLocs.length > 0 ? cleanedLocs : prev.preferredLocations,
            skills: aiData.skills ? Array.from(new Set([...prev.skills, ...aiData.skills.filter((s:any) => typeof s === 'string')])) : prev.skills,
            languages: aiData.languages?.length > 0 ? aiData.languages.filter((l:any) => typeof l === 'object' && l.language) : prev.languages
         }));
         setShowGatekeeper(false);
         setCurrentStep(1);
         alert("✨ AI Auto-Fill Successful!");
      } else {
         setFormData(prev => ({ ...prev, resumeURL: publicUrlData.publicUrl }));
         setShowGatekeeper(false); alert("Resume Uploaded! Please fill remaining details manually.");
      }
    } catch (e: any) { alert("Upload Failed: " + e.message); } 
    finally { setUploading(false); }
  };

  const validateAndProceed = () => {
     if (currentStep === 1) {
        if (!formData.fullName || !formData.phone || !formData.dob || !formData.gender || !formData.city) {
           return alert("🛑 Please fill all required fields: Name, Phone, DOB, Gender, and City.");
        }
        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
           return alert("🛑 Invalid Phone Number! Please enter a valid 10-digit number.");
        }
        if (formData.panCard && formData.panCard.trim() !== "") {
           const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
           if (!panRegex.test(formData.panCard.toUpperCase())) {
              return alert("🛑 Invalid PAN Card format! Please enter a valid PAN (e.g., ABCDE1234F).");
           }
        }
     } else if (currentStep === 2) {
        if (!formData.educations[0].qualification || !formData.educations[0].collegeName || !formData.educations[0].passingYear) {
           return alert("🛑 Please complete at least one Education block completely.");
        }

        for (const edu of formData.educations) {
           if (edu.qualification) {
              const isProfessional = ['CA', 'CMA', 'CS', 'ACCA'].some(keyword => edu.qualification.includes(keyword));
              if (isProfessional) {
                 if (!edu.stageCleared || edu.stageCleared.trim() === "") {
                    return alert(`🛑 For Professional Qualifications like ${edu.qualification}, 'Stage Cleared' is mandatory!`);
                 }
                 if (!edu.attempts || edu.attempts.trim() === "") {
                    return alert(`🛑 For Professional Qualifications like ${edu.qualification}, 'Attempts' are mandatory!`);
                 }
              }
           }
        }
     }
     setCurrentStep(p => Math.min(3, p + 1));
  };

  const handleSave = async () => {
    if (!formData.experience || !formData.expectedSalary) return alert("🛑 Please fill your Experience and Expected Salary.");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    try {
      const { error } = await supabase.from("profiles").upsert({ id: session.user.id, ...formData, email: session.user.email, updated_at: new Date().toISOString() });
      if (error) throw error;
      
      setIsEditing(false); 
      alert("Profile Saved Successfully!");
    } catch (e: any) { alert("Error saving profile: " + e.message); }
  };

  const toggleSkill = (skill: string) => setFormData(prev => ({ ...prev, skills: prev.skills.includes(skill) ? prev.skills.filter(item => item !== skill) : [...prev.skills, skill] }));
  const prevStep = () => setCurrentStep(p => Math.max(1, p - 1));
  
  if (loading) return <div className="h-screen bg-[#020617] text-white flex gap-3 items-center justify-center"><Loader2 className="animate-spin text-blue-500" /> Loading...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
         <div className="flex justify-between items-center mb-10">
            <button onClick={() => router.push('/student/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-semibold"><ArrowLeft size={18} /> Dashboard</button>
            {!isEditing && (
               <button onClick={() => { setIsEditing(true); setShowGatekeeper(false); setCurrentStep(1); }} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-2.5 rounded-xl text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25">
                  <Edit size={16}/> Edit Profile
               </button>
            )}
         </div>

        {!isEditing ? (
           <CandidateProfileView candidate={formData} role="student" />
        ) : showGatekeeper ? (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto mt-6">
              <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden text-center">
                 <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg rotate-3"><FileText size={40} className="text-white -rotate-3"/></div>
                 <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Supercharge Your Profile</h1>
                 <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto mb-10">Let our AI read your resume and auto-fill your details. Accept the terms below to securely process your document.</p>
                 
                 <div onClick={() => setConsentGiven(!consentGiven)} className={`cursor-pointer max-w-xl mx-auto bg-slate-950/50 border-2 rounded-2xl p-6 mb-8 transition-all flex items-start gap-5 ${consentGiven ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-blue-500/5' : 'border-slate-800 hover:border-slate-700'}`}>
                    <div className={`w-7 h-7 border-2 rounded-lg flex items-center justify-center shrink-0 ${consentGiven ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-slate-900'}`}>
                       <Check size={18} className={`text-white transition-opacity ${consentGiven ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3}/>
                    </div>
                    <div className="text-left">
                       <p className={`font-bold text-lg mb-1 ${consentGiven ? 'text-blue-400' : 'text-white'}`}>I agree to the Data Privacy Terms</p>
                       <p className="text-sm text-slate-500 leading-relaxed">I consent to the secure processing of my resume data by AI.</p>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-5 max-w-xl mx-auto">
                    <div className="flex-1 relative group" onClick={() => { if(!consentGiven) alert("🛑 Action Blocked: Please tick the 'I agree' box above."); }}>
                       <input type="file" accept=".pdf" onChange={handleResumeUpload} disabled={!consentGiven} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"/>
                       <div className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all ${consentGiven ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-500 hover:-translate-y-1' : 'bg-slate-800 text-slate-500'}`}>
                          {uploading ? <Loader2 size={22} className="animate-spin"/> : <Sparkles size={22}/>} {uploading ? "Analyzing..." : "Auto-fill with AI"}
                       </div>
                    </div>
                    <button onClick={() => { if(consentGiven) { setShowGatekeeper(false); setCurrentStep(1); } else alert("Please accept terms."); }} className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${consentGiven ? 'border-slate-700 text-white hover:bg-slate-800 hover:-translate-y-1' : 'border-slate-800/50 text-slate-600 cursor-not-allowed'}`}>Skip & Fill Manually</button>
                 </div>
              </div>
           </motion.div>
        ) : (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl">
            <div className="mb-12">
               <div className="flex justify-between text-sm md:text-base font-bold mb-4">
                  <span className={currentStep >= 1 ? "text-blue-400" : "text-slate-600"}>1. Personal Info</span>
                  <span className={currentStep >= 2 ? "text-blue-400" : "text-slate-600"}>2. Education</span>
                  <span className={currentStep >= 3 ? "text-blue-400" : "text-slate-600"}>3. Preferences</span>
               </div>
               <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden flex">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
               </div>
            </div>

            <AnimatePresence mode="wait">
               <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
               
               {currentStep === 1 && (
                  <div className="space-y-8">
                     <h2 className="text-3xl font-extrabold text-white mb-6">Personal Details</h2>
                     <div className="md:col-span-2 bg-slate-950/50 border border-slate-800 p-6 rounded-2xl">
                       <label className="form-label flex items-center gap-2"><Sparkles size={16} className="text-blue-400"/> AI Generated Professional Bio</label>
                        <textarea value={formData.bio || ""} onChange={(e)=>setFormData({...formData, bio: e.target.value})} className="input-field min-h-[80px]"/>
                     </div>

                     <div className="flex items-center gap-8 mb-8">
                        <div className="relative w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-xl group cursor-pointer">
                           {uploading ? <Loader2 className="animate-spin text-blue-500"/> : formData.photoURL ? <img src={formData.photoURL} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"/> : <Camera size={32} className="text-slate-500"/>}
                           <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
                        </div>
                        <div><p className="font-bold text-xl text-white">Profile Photo</p><p className="text-sm text-slate-400">Professional headshot</p></div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-6">
                        <div><label className="form-label">Full Name <span className="text-red-500">*</span></label><input type="text" value={formData.fullName} onChange={(e)=>setFormData({...formData, fullName: e.target.value})} className="input-field" placeholder="e.g. Rahul Sharma"/></div>
                        <div>
                           <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
                           <input type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="input-field" placeholder="10-digit mobile number" maxLength={10} />
                        </div>
                        <div><label className="form-label">Date of Birth <span className="text-red-500">*</span></label><input type="date" value={formData.dob} onChange={(e)=>setFormData({...formData, dob: e.target.value})} className="input-field [color-scheme:dark]"/></div>
                        <div><label className="form-label">Gender <span className="text-red-500">*</span></label><select value={formData.gender} onChange={(e)=>setFormData({...formData, gender: e.target.value})} className="input-field [color-scheme:dark]"><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
                        <div><label className="form-label">City <span className="text-red-500">*</span></label><input type="text" value={formData.city} onChange={(e)=>setFormData({...formData, city: e.target.value})} className="input-field" placeholder="Mumbai"/></div>
                        <div><label className="form-label">PAN Card Number <span className="text-slate-500 text-xs ml-1">(Optional)</span></label><input type="text" value={formData.panCard || ""} onChange={(e)=>setFormData({...formData, panCard: e.target.value.toUpperCase()})} className="input-field uppercase font-mono tracking-widest" maxLength={10}/></div>
                     </div>

                     {/* 🔥 NEW LANGUAGES UI SECTION 🔥 */}
                     <div className="pt-8 border-t border-slate-800/80 mt-8">
                        <h3 className="text-xl font-extrabold text-white mb-6 flex items-center gap-2"><Globe className="text-blue-400" size={20}/> Languages Known</h3>
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                           <div className="flex-1">
                              <label className="form-label text-sm">Language</label>
                              <input type="text" list="language-options" value={langInput} onChange={(e) => setLangInput(e.target.value)} className="input-field" placeholder="e.g. English, Hindi" />
                              <datalist id="language-options">{languageOptions.map(l => <option key={l} value={l} />)}</datalist>
                           </div>
                           <div className="flex-1">
                              <label className="form-label text-sm">Proficiency</label>
                              <select value={profInput} onChange={(e) => setProfInput(e.target.value)} className="input-field [color-scheme:dark]">
                                 {proficiencyOptions.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                           </div>
                           <div className="flex items-end">
                              <button onClick={addLanguage} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all h-[56px] w-full md:w-auto shadow-lg shadow-blue-500/20">Add</button>
                           </div>
                        </div>
                        
                        {formData.languages.length > 0 && (
                           <div className="flex flex-wrap gap-3 p-5 bg-slate-950/50 rounded-2xl border border-slate-800">
                              {formData.languages.map((lang, idx) => (
                                 <span key={idx} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium border border-slate-700 shadow-sm group">
                                    <span className="font-bold text-blue-400">{lang.language}</span> 
                                    <span className="text-slate-400 text-xs px-2 py-0.5 bg-slate-800 rounded-md">{lang.proficiency}</span>
                                    <X size={16} className="cursor-pointer text-slate-500 hover:text-red-400 ml-1 transition-colors" onClick={() => removeLanguage(lang.language)}/>
                                 </span>
                              ))}
                           </div>
                        )}
                     </div>

                  </div>
               )}

               {currentStep === 2 && (
                  <div className="space-y-12">
                     <div>
                        <div className="flex justify-between items-center mb-6">
                           <h2 className="text-3xl font-extrabold text-white">Education <span className="text-red-500 text-lg">*</span></h2>
                           <button onClick={addEducation} className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-xl transition-colors"><Plus size={18}/> Add More</button>
                        </div>
                        <div className="space-y-6">
                           {formData.educations.map((edu, index) => (
                              <div key={index} className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 relative">
                                 {formData.educations.length > 1 && (<button onClick={() => removeEducation(index)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-2"><X size={18}/></button>)}
                                 <div className="grid md:grid-cols-2 gap-6 mt-2">
                                    <div>
                                       <label className="form-label">Qualification <span className="text-red-500">*</span></label>
                                       <input type="text" list="qualifications-list" value={edu.qualification} onChange={(e)=>updateEducation(index, 'qualification', e.target.value)} className="input-field"/>
                                    </div>
                                    
                                    {['CA', 'CMA', 'CS', 'ACCA'].some(keyword => (edu.qualification || '').includes(keyword)) && (
                                       <div className="grid grid-cols-2 gap-4">
                                          <div><label className="form-label text-yellow-400">Stage Cleared <span className="text-red-500">*</span></label><select value={edu.stageCleared} onChange={(e)=>updateEducation(index, 'stageCleared', e.target.value)} className="input-field border-yellow-500/30 [color-scheme:dark]"><option value="">Select</option><option>Group 1</option><option>Group 2</option><option>Both Groups</option><option>Cleared</option></select></div>
                                          <div><label className="form-label text-red-400">Attempts <span className="text-red-500">*</span></label><input type="text" value={edu.attempts || ""} onChange={(e)=>updateEducation(index, 'attempts', e.target.value)} className="input-field border-red-500/30"/></div>
                                       </div>
                                    )}
                                    <div className="md:col-span-2"><label className="form-label">College / Institution <span className="text-red-500">*</span></label><input type="text" value={edu.collegeName} onChange={(e)=>updateEducation(index, 'collegeName', e.target.value)} className="input-field"/></div>
                                    <div><label className="form-label">Passing Year <span className="text-red-500">*</span></label><input type="text" value={edu.passingYear} onChange={(e)=>updateEducation(index, 'passingYear', e.target.value)} className="input-field"/></div>
                                    <div><label className="form-label">Score (%)</label><input type="text" value={edu.percentage} onChange={(e)=>updateEducation(index, 'percentage', e.target.value)} className="input-field"/></div>
                                 </div>
                              </div>
                           ))}
                           <datalist id="qualifications-list">{QUALIFICATIONS_LIST.map(q => <option key={q} value={q} />)}</datalist>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-slate-800/80">
                        <h2 className="text-2xl font-extrabold text-white mb-6">Technical Skills & Expertise</h2>
                        
                        {formData.skills.length > 0 && (
                           <div className="flex flex-wrap gap-2 mb-6 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                              {formData.skills.map(skill => (
                                 <span key={skill} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                                    {skill} <X size={16} className="cursor-pointer hover:text-red-300" onClick={() => toggleSkill(skill)}/>
                                 </span>
                              ))}
                           </div>
                        )}

                        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/50 flex flex-col md:flex-row">
                           <div className="md:w-1/3 bg-slate-900/40 border-r border-slate-800 p-3 max-h-[350px] overflow-y-auto">
                              {(Object.keys(EXCEL_SKILLS_DATA) as Array<keyof typeof EXCEL_SKILLS_DATA>).map((mainSkill) => (
                                 <button 
                                    key={mainSkill} 
                                    onClick={() => setActiveSkillTab(mainSkill)} 
                                    className={`w-full text-left px-4 py-3 mb-2 text-sm font-bold rounded-xl transition-all ${
                                       activeSkillTab === mainSkill 
                                       ? 'bg-blue-600 text-white shadow-lg' 
                                       : 'hover:bg-slate-800/80 text-slate-400'
                                    }`}
                                 >
                                    {mainSkill}
                                 </button>
                              ))}
                           </div>
                           <div className="md:w-2/3 p-6 max-h-[350px] overflow-y-auto">
                              <h4 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                                 Select Sub-Skills for <span className="text-blue-400">{activeSkillTab}</span>
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {(EXCEL_SKILLS_DATA[activeSkillTab] || []).map((subSkill: string) => {
                                    const isSelected = formData.skills.includes(subSkill);
                                    return (
                                       <button 
                                          key={subSkill} 
                                          onClick={() => toggleSkill(subSkill)} 
                                          className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                                             isSelected 
                                             ? 'bg-blue-600/20 border-blue-500 text-white shadow-md' 
                                             : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                                          } flex items-center justify-between group`}
                                       >
                                          <span className="truncate pr-2">{subSkill}</span>
                                          <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-slate-800 border-slate-600 group-hover:border-slate-500'}`}>
                                             {isSelected && <Check size={14} className="text-white" />}
                                          </div>
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
                           <h2 className="text-3xl font-extrabold text-white">Past Work Experience</h2>
                           <button onClick={addWorkExp} className="text-sm font-bold text-green-400 bg-green-500/10 px-4 py-2 rounded-xl"><Plus size={18} className="inline"/> Add Company</button>
                        </div>
                        <div className="space-y-4">
                           {formData.workExperience.map((work, index) => (
                              <div key={index} className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 relative">
                                 <button onClick={() => removeWorkExp(index)} className="absolute top-4 right-4 text-slate-500 hover:text-red-500"><X size={18}/></button>
                                 <div className="grid md:grid-cols-3 gap-4 mt-2">
                                    <div><label className="form-label">Company Name</label><input type="text" value={work.company} onChange={(e)=>updateWorkExp(index, 'company', e.target.value)} className="input-field" placeholder="e.g. TCS"/></div>
                                    <div><label className="form-label">Job Role</label><input type="text" value={work.role} onChange={(e)=>updateWorkExp(index, 'role', e.target.value)} className="input-field" placeholder="e.g. Audit Exec"/></div>
                                    <div><label className="form-label">Duration</label><input type="text" value={work.duration} onChange={(e)=>updateWorkExp(index, 'duration', e.target.value)} className="input-field" placeholder="e.g. 2021 - 2023"/></div>
                                 </div>
                              </div>
                           ))}
                           {formData.workExperience.length === 0 && <p className="text-slate-500 text-sm">No past experience added. AI will auto-fill if found on resume.</p>}
                        </div>
                     </div>

                     <div className="pt-8 border-t border-slate-800/80">
                        <h2 className="text-3xl font-extrabold text-white mb-8">Work & Salary Preferences</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                           <div><label className="form-label">Total Experience <span className="text-red-500">*</span></label><select value={formData.experience} onChange={(e)=>setFormData({...formData, experience: e.target.value})} className="input-field [color-scheme:dark]"><option>Fresher</option><option>0-1 Years</option><option>1-3 Years</option><option>3-5 Years</option><option>5+ Years</option></select></div>
                           <div><label className="form-label">Notice Period <span className="text-red-500">*</span></label><select value={formData.noticePeriod} onChange={(e)=>setFormData({...formData, noticePeriod: e.target.value})} className="input-field [color-scheme:dark]"><option>Immediate Joiner</option><option>15 Days</option><option>1 Month</option><option>2 Months</option></select></div>
                           
                           {formData.experience !== "Fresher" && (
                              <div>
                                 <label className="form-label">Current Salary (CTC)</label>
                                 <input type="text" value={formData.currentSalary || ""} onChange={(e)=>setFormData({...formData, currentSalary: e.target.value})} className="input-field" placeholder="e.g. ₹4,50,000"/>
                              </div>
                           )}
                           <div>
                              <label className="form-label flex items-center gap-2">Expected Salary <span className="text-red-500">*</span></label>
                              <input type="text" value={formData.expectedSalary || ""} onChange={(e)=>setFormData({...formData, expectedSalary: e.target.value})} className="input-field border-blue-500/30" placeholder="e.g. ₹6,00,000"/>
                           </div>

                           <div>
                              <label className="form-label text-yellow-400">Looking For (Role Type) <span className="text-red-500">*</span></label>
                              <select value={formData.jobType} onChange={(e)=>setFormData({...formData, jobType: e.target.value})} className="input-field border-yellow-500/30 [color-scheme:dark]">
                                 <option value="Permanent">Permanent Role</option>
                                 <option value="3-Month Contract">3-Month Contract</option>
                                 <option value="Internship">Internship</option>
                              </select>
                           </div>
                           <div><label className="form-label">Work Mode</label><select value={formData.workMode} onChange={(e)=>setFormData({...formData, workMode: e.target.value})} className="input-field [color-scheme:dark]"><option>On-site</option><option>Hybrid</option><option>Remote</option></select></div>

                           <div className="md:col-span-2 bg-slate-950/50 p-8 rounded-3xl border border-slate-800/80 mt-4">
                              <label className="text-slate-300 font-bold mb-4 block text-base">Preferred Work Locations <span className="text-slate-500 font-normal text-sm ml-2">(Type city & press Enter)</span></label>
                              <div className="flex flex-wrap gap-3 mb-4">
                                 {formData.preferredLocations.map((loc, i) => (
                                    <span key={i} className="flex items-center gap-2 bg-blue-600/10 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-sm font-bold">
                                       {loc} <X size={16} className="cursor-pointer text-blue-400/70 hover:text-white" onClick={() => removeLocation(loc)}/>
                                    </span>
                                 ))}
                              </div>
                              <input type="text" value={locInput} onChange={(e) => setLocInput(e.target.value)} onKeyDown={handleAddLocation} className="w-full bg-transparent border-b-2 border-slate-700 pb-3 outline-none text-white text-base font-medium placeholder:text-slate-600 focus:border-blue-500" placeholder="e.g. Mumbai, Bangalore..."/>
                           </div>

                           <div><label className="form-label">Willing to Relocate?</label><select value={formData.willingToRelocate} onChange={(e)=>setFormData({...formData, willingToRelocate: e.target.value})} className="input-field [color-scheme:dark]"><option>No</option><option>Yes</option></select></div>
                        </div>
                     </div>
                  </div>
               )}

               </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-12 pt-8 border-t border-slate-800/80">
               {currentStep > 1 ? (<button onClick={prevStep} className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold flex items-center gap-3 text-white transition-all"><ChevronLeft size={20}/> Back</button>) : <div></div>}
               {currentStep < 3 ? (
                  <button onClick={validateAndProceed} className="px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold flex items-center gap-3 text-white shadow-lg shadow-blue-500/20 text-lg">Next <ChevronRight size={20}/></button>
               ) : (
                  <button onClick={handleSave} className="px-10 py-4 rounded-xl bg-green-600 hover:bg-green-500 font-bold flex items-center gap-3 text-white shadow-lg shadow-green-500/20 text-lg"><Save size={20}/> Save Profile</button>
               )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .form-label { display: block; font-size: 0.9rem; font-weight: 600; color: #cbd5e1; margin-bottom: 0.6rem; }
        .input-field { width: 100%; background-color: #0f172a; border: 2px solid #1e293b; border-radius: 1rem; padding: 1rem 1.25rem; color: white; outline: none; transition: all 0.2s; font-size: 1rem; font-weight: 500; appearance: none; }
        .input-field:focus { border-color: #3b82f6; background-color: #020617; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); }
        select.input-field { background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right 1.2rem top 50%; background-size: 0.75rem auto; }
      `}</style>
    </div>
  );
}