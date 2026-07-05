"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Building2, Globe, MapPin, Users, Calendar, FileText, 
  Save, Edit, ArrowLeft, Camera, Loader2, Phone, User, ShieldCheck, Briefcase, Landmark
} from "lucide-react";
import CompanyProfileView from "@/app/components/CompanyProfileView";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function CompanyProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Real-time tracking with accurate database schema keys
  const [formData, setFormData] = useState({
    name: "", tagline: "", website: "", industry: "Finance & CA Firm",
    size: "1-10", foundedYear: "", address: "", location: "", about: "",
    logoURL: "", contact_number: "", designation: "", gstin: "", cin: "", 
    companyType: "Private Limited"
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/company/login"); return; }
      try {
        const { data, error } = await supabase.from("companies").select("*").eq("id", session.user.id).single();
        if (data) {
          const cleanData: any = { ...data };
          Object.keys(cleanData).forEach(key => { if (cleanData[key] === null) cleanData[key] = ""; });
          if (cleanData.name === "New Company") cleanData.name = "";
          setFormData(prev => ({ ...prev, ...cleanData }));
          if (!data.industry || data.name === "New Company" || !data.name) setIsEditing(true); 
        } else { 
          setIsEditing(true); 
        }
      } catch (e) { 
        console.error("Error fetching profile:", e); 
      }
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  const handleLogoUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 150 * 1024) { alert("Logo too big! Max 150KB."); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logoURL: reader.result as string }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.companyType) return alert("Company Name and Legal Type are required!");
    if (!formData.location.trim()) return alert("Core Location/City is required!");
    
    if (formData.contact_number) {
       const phoneRegex = /^\+?[1-9]\d{7,14}$/;
       if (!phoneRegex.test(formData.contact_number)) return alert("Invalid Contact Number! Please include country code.");
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    try {
      setLoading(true);
      const payload = { 
        ...formData, 
        id: session.user.id, 
        email: session.user.email,
        updatedAt: new Date().toISOString()
      };
      
      const { error } = await supabase.from("companies").upsert(payload);
      if (error) throw error;
      
      setIsEditing(false);
      alert("Identity updates deployed successfully! 🎉");
    } catch (e: any) { 
      alert("Database Synchronization Error: " + e.message); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[var(--surface)]"><Loader2 className="animate-spin text-[var(--primary)]" size={48}/></div>;
  
  return (
    <div className="min-h-screen bg-[var(--surface)] p-4 md:p-10 font-sans relative z-10 text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
           <div className="flex items-center gap-4">
              <button onClick={() => router.push('/company/dashboard')} className="p-2.5 bg-white border border-[var(--border)] rounded-lg shadow-soft text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all hover:scale-105"><ArrowLeft size={20} /></button>
              <div>
                 <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">{isEditing ? "Configure Corporate Identity" : "Organization Identity"}</h1>
                 <p className="text-[var(--muted-foreground)] text-[10px] font-semibold uppercase tracking-[0.2em] mt-0.5">Verified Profile Console</p>
              </div>
           </div>
           {!isEditing && (
              <Button variant="secondary" onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-white text-[var(--foreground)] border border-[var(--border)] font-semibold text-xs tracking-wider shadow-soft rounded-lg flex items-center gap-2"><Edit size={14} /> Edit Identity</Button>
           )}
        </header>

        {!isEditing ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
             <CompanyProfileView company={formData} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             
             {/* Left Column: Live Interactive Card Preview */}
             <div className="lg:sticky lg:top-10 space-y-6">
                <div className="bg-[var(--primary)] rounded-xl p-6 text-white shadow-card relative overflow-hidden border border-[var(--primary)]">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                   <span className="text-[9px] bg-white/10 text-white/80 border border-white/10 px-2.5 py-1 rounded-md font-mono font-semibold tracking-widest uppercase mb-6 inline-block">Realtime Blueprint</span>
                   
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                         {formData.logoURL ? <img src={formData.logoURL} className="w-full h-full object-cover"/> : <Building2 className="text-white/40" size={28}/>}
                      </div>
                      <div className="min-w-0">
                         <h3 className="text-lg font-bold text-white truncate leading-tight">{formData.name || "Unnamed Entity"}</h3>
                         <p className="text-white/70 text-xs font-semibold truncate mt-0.5">{formData.industry}</p>
                         <p className="text-white/50 text-[10px] font-semibold flex items-center gap-1 mt-1"><MapPin size={10}/> {formData.location || "City not configured"}</p>
                      </div>
                   </div>

                   <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-white/70">
                      <div className="flex justify-between"><span className="text-white/50 font-semibold">Legal Class</span><span className="font-semibold text-white">{formData.companyType}</span></div>
                      <div className="flex justify-between"><span className="text-white/50 font-semibold">Workforce Range</span><span className="font-semibold text-white">{formData.size} Staff</span></div>
                      <div className="flex justify-between"><span className="text-white/50 font-semibold">Contact Node</span><span className="font-semibold text-white truncate max-w-[150px]">{formData.contact_number || "None"}</span></div>
                   </div>
                </div>

                {/* Brand Logo Upload Action Container */}
                <div className="bg-white rounded-xl p-6 border border-[var(--border)] shadow-soft flex flex-col items-center justify-center text-center">
                   <div className="relative group w-24 h-24 rounded-xl bg-[var(--surface)] border-2 border-dashed border-[var(--border)] flex items-center justify-center overflow-hidden hover:border-[var(--primary)] transition-all duration-300 mb-4 cursor-pointer">
                      {uploading ? <Loader2 className="animate-spin text-[var(--primary)]"/> : formData.logoURL ? <img src={formData.logoURL} className="w-full h-full object-cover"/> : <Camera className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" size={24}/>}
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
                   </div>
                   <h4 className="text-sm font-semibold text-[var(--foreground)]">Corporate Emblem</h4>
                   <p className="text-[var(--muted-foreground)] text-[10px] px-4 mt-1 leading-normal">PNG or JPG (Max 150KB).</p>
                </div>
             </div>

             {/* Right Column: High-End Grid Workspace Forms */}
             <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white border border-[var(--border)] p-6 md:p-8 shadow-card rounded-xl">
                   
                   {/* Part 1: Core Essentials */}
                   <div className="mb-8">
                      <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-6 flex items-center gap-2"><Building2 size={16} className="text-[var(--primary)]"/> Core Baseline</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                             <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">Official Enterprise Name</label>
                             <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-[var(--border)] rounded-lg p-3.5 font-medium text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all text-sm" placeholder="e.g. Acme Solutions Private Limited"/>
                         </div>
                         <div>
                             <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">Entity Operational Classification</label>
                             <select value={formData.companyType} onChange={(e)=>setFormData({...formData, companyType: e.target.value})} className="w-full bg-white border border-[var(--border)] rounded-lg p-3.5 font-medium text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none cursor-pointer text-sm">
                                <option>Private Limited</option><option>Public Limited</option><option>Partnership Firm</option><option>Sole Proprietorship</option><option>LLP</option><option>Recruitment Consultancy</option>
                             </select>
                         </div>
                         <div>
                             <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">Industry Core Sector</label>
                             <select value={formData.industry} onChange={(e)=>setFormData({...formData, industry: e.target.value})} className="w-full bg-white border border-[var(--border)] rounded-lg p-3.5 font-medium text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none cursor-pointer text-sm">
                                <option>Finance & CA Firm</option><option>IT / Software</option><option>Marketing</option><option>Manufacturing</option><option>EdTech</option>
                             </select>
                         </div>
                         <div>
                             <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">Active Headcount Array (Size)</label>
                             <select value={formData.size} onChange={(e)=>setFormData({...formData, size: e.target.value})} className="w-full bg-white border border-[var(--border)] rounded-lg p-3.5 font-medium text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none cursor-pointer text-sm">
                                <option>1-10</option><option>11-50</option><option>51-200</option><option>201-500</option><option>500+</option>
                             </select>
                         </div>
                         <div>
                             <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">Core City Node (Location)</label>
                             <input type="text" value={formData.location} onChange={(e)=>setFormData({...formData, location: e.target.value})} className="w-full bg-white border border-[var(--border)] rounded-lg p-3.5 font-medium text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all text-sm" placeholder="e.g. Mumbai, Delhi, Jaipur"/>
                          </div>
                          <div>
                             <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">Founding Anniversary (Year)</label>
                             <input type="text" value={formData.foundedYear} onChange={(e)=>setFormData({...formData, foundedYear: e.target.value})} className="w-full bg-white border border-[var(--border)] rounded-lg p-3.5 font-medium text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all text-sm" placeholder="e.g. 2018"/>
                         </div>
                      </div>
                   </div>

                   {/* Part 2: Point of Contact Node */}
                   <div className="mb-8 pt-6 border-t border-[var(--border)]">
                      <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-6 flex items-center gap-2"><User size={16} className="text-[var(--primary)]"/> Verification Hub (Point of Contact)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                             <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">Executive Designation</label>
                             <input type="text" value={formData.designation} onChange={(e)=>setFormData({...formData, designation: e.target.value})} className="w-full bg-white border border-[var(--border)] rounded-lg p-3.5 font-medium text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 text-sm" placeholder="e.g. HR Director / Founder"/>
                          </div>
                          <div>
                             <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">Secure Contact Line</label>
                             <div className="relative">
                                <Phone className="absolute left-3 top-4 text-[var(--muted-foreground)]" size={14}/>
                                <input type="tel" value={formData.contact_number} onChange={(e)=>setFormData({...formData, contact_number: e.target.value})} className="w-full bg-white border border-[var(--border)] rounded-lg py-3.5 pl-10 pr-4 font-medium text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 text-sm" placeholder="+91 9999999999"/>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Part 3: Extensive Information fields */}
                   <div className="mb-8 pt-6 border-t border-[var(--border)]">
                      <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-6 flex items-center gap-2"><FileText size={16} className="text-[var(--primary)]"/> Deep Insights & Address</h3>
                      <div className="space-y-6">
                         <div>
                            <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">Strategic Organization Abstract (About)</label>
                            <textarea rows={3} value={formData.about} onChange={(e)=>setFormData({...formData, about: e.target.value})} className="w-full bg-white border border-[var(--border)] rounded-lg p-4 font-medium text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none transition-all text-sm" placeholder="Detail the core values, corporate culture, and technical horizon..."/>
                         </div>
                         <div>
                            <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">Geographical Headquarters Endpoint (Full Address)</label>
                            <input type="text" value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} className="w-full bg-white border border-[var(--border)] rounded-lg p-3.5 font-medium text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 outline-none text-sm" placeholder="Complete structural physical address"/>
                         </div>
                      </div>
                   </div>

                   {/* Part 4: Legal Frameworks */}
                   <div className="pt-6 border-t border-[var(--border)] mb-6">
                      <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-6 flex items-center gap-2"><Landmark size={16} className="text-[var(--primary)]"/> Compliance Architecture</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                             <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">GSTIN Registration</label>
                             <input type="text" value={formData.gstin} onChange={(e)=>setFormData({...formData, gstin: e.target.value.toUpperCase()})} className="w-full bg-white border border-[var(--border)] rounded-lg p-3.5 font-mono font-medium text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 text-sm" placeholder="19AAAAA0000A1Z5"/>
                          </div>
                          <div>
                             <label className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-1.5 block">CIN Number</label>
                             <input type="text" value={formData.cin} onChange={(e)=>setFormData({...formData, cin: e.target.value.toUpperCase()})} className="w-full bg-white border border-[var(--border)] rounded-lg p-3.5 font-mono font-medium text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 text-sm" placeholder="L12345MH2021PTC000000"/>
                         </div>
                      </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4 border-t border-[var(--border)]">
                      <Button variant="ghost" onClick={() => setIsEditing(false)} className="flex-1 py-3.5 font-semibold uppercase text-xs tracking-wider text-[var(--muted-foreground)] hover:bg-[var(--surface)] rounded-lg">Discard Updates</Button>
                      <Button onClick={handleSave} className="flex-[2] py-3.5 bg-[var(--primary)] hover:opacity-90 text-white font-semibold uppercase text-xs tracking-wider shadow-card rounded-lg flex items-center justify-center gap-2">
                         <Save size={14}/> Save Profile
                      </Button>
                   </div>

                </Card>
             </div>

          </div>
        )}

      </div>
    </div>
  );
}