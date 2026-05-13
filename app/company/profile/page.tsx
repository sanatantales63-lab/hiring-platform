"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Building2, Globe, MapPin, Users, Calendar, FileText, 
  Save, Edit, ArrowLeft, Camera, Loader2, Hash, Factory, Phone, User, ShieldCheck, Briefcase
} from "lucide-react";
import CompanyProfileView from "@/app/components/CompanyProfileView";

import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function CompanyProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", tagline: "", website: "", industry: "Finance",
    size: "10-50 Employees", foundedYear: "", address: "", about: "",
    logoURL: "", contact_number: "", designation: "", gstin: "", cin: "", companyType: "Private Limited"
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
          setFormData({ ...formData, ...cleanData });
          if (!data.industry || data.name === "New Company" || !data.name) setIsEditing(true); 
        } else { setIsEditing(true); }
      } catch (e) { console.error(e); }
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
    if (!formData.name || !formData.companyType) return alert("Company Name and Type are required!");
    if (formData.contact_number) {
       const phoneRegex = /^\+?[1-9]\d{7,14}$/;
       if (!phoneRegex.test(formData.contact_number)) return alert("Invalid Contact Number! Please include Country Code.");
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    try {
      const payload = { ...formData, id: session.user.id, email: session.user.email };
      const { error } = await supabase.from("companies").upsert(payload);
      if (error) throw error;
      setIsEditing(false);
      alert("Profile Saved Successfully! 🎉");
    } catch (e: any) { alert("System Error: " + e.message); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center relative z-10"><Loader2 className="animate-spin text-[#0f947e]" size={48}/></div>;
  
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 font-sans relative z-10">
      
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
           <div className="flex items-center gap-4">
              <button onClick={() => router.push('/company/dashboard')} className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600 hover:text-[#0f947e] transition-all hover:scale-105"><ArrowLeft size={24} /></button>
              <div>
                 <h1 className="text-4xl font-black text-slate-900 tracking-tight">{isEditing ? "Configure Identity" : "Organization Profile"}</h1>
                 <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Management Console</p>
              </div>
           </div>
           {!isEditing && (
              <Button variant="secondary" onClick={() => setIsEditing(true)} className="px-8 py-3 bg-white text-slate-900 border-slate-200 font-black uppercase text-xs tracking-widest shadow-sm"><Edit size={16} /> Edit Details</Button>
           )}
        </header>

        {!isEditing ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <CompanyProfileView company={formData} />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-0 border-none shadow-2xl overflow-hidden bg-white rounded-[3rem]">
               
               <div className="grid md:grid-cols-3">
                  {/* Left Column: Branding */}
                  <div className="p-8 md:p-12 bg-slate-900 text-white flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/5">
                     <div className="relative group w-32 h-32 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden hover:border-[#0f947e] transition-all duration-300 mb-6 cursor-pointer">
                        {uploading ? <Loader2 className="animate-spin text-[#0f947e]"/> : formData.logoURL ? <img src={formData.logoURL} className="w-full h-full object-cover"/> : <Camera className="text-white/40 group-hover:text-[#0f947e] transition-colors" size={32}/>}
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
                     </div>
                     <h3 className="text-lg font-black tracking-tight mb-2">Company Branding</h3>
                     <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.15em] leading-relaxed px-4">Upload a high-resolution logo (Max 150KB). This will be visible to all candidates.</p>
                  </div>

                  {/* Right Column: Form Fields */}
                  <div className="md:col-span-2 p-8 md:p-12">
                     <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-6">
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Organization Name</label>
                              <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-black text-slate-900 focus:border-[#0f947e] focus:bg-white outline-none transition-all shadow-sm" placeholder="e.g. Acme Corp Ltd."/>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Company Legal Type</label>
                              <select value={formData.companyType} onChange={(e)=>setFormData({...formData, companyType: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-black text-slate-900 focus:border-[#0f947e] outline-none shadow-sm cursor-pointer">
                                 <option>Private Limited</option><option>Public Limited</option><option>Partnership Firm</option><option>Sole Proprietorship</option><option>LLP</option>
                              </select>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Industry Vertical</label>
                              <select value={formData.industry} onChange={(e)=>setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-black text-slate-900 focus:border-[#0f947e] outline-none shadow-sm cursor-pointer">
                                 <option>Finance & CA Firm</option><option>IT / Software</option><option>Marketing</option><option>Manufacturing</option><option>EdTech</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Workforce Size</label>
                              <select value={formData.size} onChange={(e)=>setFormData({...formData, size: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-black text-slate-900 focus:border-[#0f947e] outline-none shadow-sm cursor-pointer">
                                 <option>1-10 (Startup)</option><option>10-50 (Small)</option><option>50-200 (Mid)</option><option>200+ (Large)</option>
                              </select>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 border-dashed">
                           <h4 className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest mb-6"><User size={14} className="text-[#0f947e]"/> Point of Contact</h4>
                           <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Designation</label>
                                 <input type="text" value={formData.designation} onChange={(e)=>setFormData({...formData, designation: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 font-bold text-slate-900 outline-none focus:border-[#0f947e]" placeholder="e.g. HR Head"/>
                              </div>
                              <div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Contact Number</label>
                                 <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 text-slate-300" size={16}/>
                                    <input type="tel" value={formData.contact_number} onChange={(e)=>setFormData({...formData, contact_number: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 font-bold text-slate-900 outline-none focus:border-[#0f947e]" placeholder="+91..."/>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Company Vision & Culture</label>
                           <textarea rows={4} value={formData.about} onChange={(e)=>setFormData({...formData, about: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6 font-bold text-slate-900 focus:border-[#0f947e] focus:bg-white outline-none transition-all shadow-sm text-sm" placeholder="Briefly describe what makes your company a great place to work..."/>
                        </div>

                        <div className="p-6 bg-slate-900 rounded-[1.5rem] text-white/80">
                           <h4 className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest mb-6"><ShieldCheck size={14} className="text-[#0f947e]"/> Legal & Compliance</h4>
                           <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                 <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 block">GSTIN Number</label>
                                 <input type="text" value={formData.gstin} onChange={(e)=>setFormData({...formData, gstin: e.target.value.toUpperCase()})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-mono font-bold text-white outline-none focus:border-[#0f947e]" placeholder="19AAAAA..."/>
                              </div>
                              <div>
                                 <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 block">CIN Number</label>
                                 <input type="text" value={formData.cin} onChange={(e)=>setFormData({...formData, cin: e.target.value.toUpperCase()})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 font-mono font-bold text-white outline-none focus:border-[#0f947e]" placeholder="L12345..."/>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-4 mt-12">
                        <Button variant="ghost" onClick={() => setIsEditing(false)} className="flex-1 py-5 font-black uppercase text-xs tracking-widest text-slate-400 hover:bg-slate-50 rounded-[1.5rem]">Discard</Button>
                        <Button onClick={handleSave} className="flex-[2] py-5 bg-[#0f947e] text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-teal-500/20 rounded-[1.5rem] flex items-center justify-center gap-2">
                           <Save size={18}/> Deploy Profile Updates
                        </Button>
                     </div>
                  </div>
               </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}