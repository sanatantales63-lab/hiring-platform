"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Building2, Globe, MapPin, Users, Calendar, FileText, 
  Save, Edit, ArrowLeft, Camera, Loader2, Hash, Factory, Phone, User
} from "lucide-react";
import CompanyProfileView from "@/app/components/CompanyProfileView";

// 🔥 Naye Master Components 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function CompanyProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", 
    tagline: "", 
    website: "", 
    industry: "Finance",
    size: "10-50 Employees", 
    foundedYear: "", 
    address: "", 
    about: "",
    logoURL: "", 
    contact_number: "", 
    designation: "", 
    gstin: "", 
    cin: "", 
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
          Object.keys(cleanData).forEach(key => {
            if (cleanData[key] === null) cleanData[key] = "";
          });
          
          if (cleanData.name === "New Company") cleanData.name = "";

          setFormData({ 
            ...formData, 
            ...cleanData,
            contact_number: cleanData.contact_number || "",
            designation: cleanData.designation || "" 
          });
          
          if (!data.industry || data.name === "New Company" || !data.name) setIsEditing(true); 
    
        } else {
          setIsEditing(true);
        }
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
    if (!formData.name || !formData.companyType) {
        alert("Company Name and Type are required!");
        return;
    }

    // 🔥 FAKE NUMBER PROTECTION (REGEX) 🔥
    if (formData.contact_number) {
       const phoneRegex = /^\+?[1-9]\d{7,14}$/;
       if (!phoneRegex.test(formData.contact_number)) {
          return alert("🛑 Invalid Contact Number! Please enter a valid number with your Country Code (e.g. +919876543210)");
       }
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    try {
      const payload = {
        id: session.user.id,
        name: formData.name,
        tagline: formData.tagline || "",
        website: formData.website || "",
        industry: formData.industry || "",
        size: formData.size || "",
        foundedYear: formData.foundedYear || "",
        address: formData.address || "",
        about: formData.about || "",
        logoURL: formData.logoURL || "",
        contact_number: formData.contact_number || "", 
        designation: formData.designation || "", 
        gstin: formData.gstin || "",         
        cin: formData.cin || "",             
        companyType: formData.companyType || "", 
        email: session.user.email
      };
      
      const { error } = await supabase.from("companies").upsert(payload);

      if (error) {
        alert("Database Error: " + error.message);
        console.error("Supabase Error:", error);
        return;
      }

      setIsEditing(false);
      alert("Profile Saved Successfully! 🎉");
    } catch (e: any) { 
      alert("System Error: " + e.message); 
    }
  };

  if (loading) return <div className="h-screen bg-transparent flex items-center justify-center relative z-10"><Loader2 className="animate-spin text-indigo-600" size={48}/></div>;
  
  return (
    <div className="min-h-screen bg-transparent text-slate-900 p-6 md:p-12 font-sans relative z-10">
      
      <Button 
        variant="ghost" 
        onClick={() => router.push('/company/dashboard')} 
        className="mb-8 pl-0 hover:bg-transparent"
      >
        <div className="bg-white border border-slate-200 p-2 rounded-xl shadow-sm text-slate-600 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} />
        </div>
        <span className="font-bold text-slate-700">Back to Dashboard</span>
      </Button>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {isEditing ? "Edit Company Profile" : formData.name || "Company Profile"}
            </h1>
            <p className="text-slate-500 font-medium mt-2">Make your company stand out to candidates.</p>
          </div>
          {!isEditing && (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              <Edit size={18} /> Edit Details
            </Button>
          )}
        </div>

        {!isEditing ? (
          <CompanyProfileView company={formData} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-8 md:p-12 shadow-2xl relative overflow-hidden">
               
               <div className="flex flex-col items-center mb-10 pb-10 border-b border-slate-200">
                  <div className="relative group cursor-pointer w-28 h-28 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-colors shadow-sm">
                     {uploading ? <Loader2 className="animate-spin text-indigo-600"/> : formData.logoURL ? <img src={formData.logoURL} className="w-full h-full object-cover"/> : <Camera className="text-slate-400 group-hover:text-indigo-500 transition-colors"/>}
                     <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
                  </div>
                  <p className="text-slate-500 text-xs font-bold mt-3 uppercase tracking-wider">Upload Logo (Max 150KB)</p>
               </div>

               <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-5">
                     <div>
                         <label className="text-slate-700 text-sm font-extrabold mb-2 block">Company Name <span className="text-red-500">*</span></label>
                         <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-indigo-500 focus:bg-slate-50 outline-none transition-colors shadow-sm font-bold text-slate-900" placeholder="e.g. Infosys Ltd."/>
                     </div>
                     
                     <div>
                         <label className="text-slate-700 text-sm font-extrabold mb-2 block">Company Type <span className="text-red-500">*</span></label>
                         <select value={formData.companyType} onChange={(e)=>setFormData({...formData, companyType: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-indigo-500 outline-none text-slate-900 font-bold shadow-sm">
                             <option>Private Limited</option>
                             <option>Public Limited</option>
                             <option>Partnership Firm</option>
                             <option>Sole Proprietorship</option>
                             <option>LLP</option>
                             <option>NGO / Trust</option>
                         </select>
                     </div>

                     {/* 🔥 CONTACT FIELDS 🔥 */}
                     <div className="bg-indigo-50/50 p-5 border border-indigo-100 rounded-2xl shadow-sm">
                        <label className="text-indigo-700 text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-2"><User size={14}/> Point of Contact</label>
                        <div className="space-y-4">
                           <div>
                               <label className="text-slate-700 text-sm font-extrabold mb-2 block">Your Designation (Job Title)</label>
                               <input type="text" value={formData.designation} onChange={(e)=>setFormData({...formData, designation: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:border-indigo-500 outline-none font-bold text-slate-900 shadow-sm" placeholder="e.g. HR Manager, Founder..."/>
                           </div>
                           <div>
                               <label className="text-slate-700 text-sm font-extrabold mb-2 block">Official Contact Number <span className="text-red-500">*</span></label>
                               <div className="relative shadow-sm">
                                  <Phone className="absolute left-3 top-3.5 text-slate-400" size={18}/>
                                  <input type="tel" value={formData.contact_number} onChange={(e)=>setFormData({...formData, contact_number: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:border-indigo-500 outline-none font-bold text-slate-900" placeholder="e.g. +91 9876543210"/>
                               </div>
                               <p className="text-[10px] font-bold text-slate-500 mt-1.5 ml-1">Must include country code (+91 for India).</p>
                           </div>
                        </div>
                     </div>

                  </div>

                  <div className="space-y-5">
                     <div>
                         <label className="text-slate-700 text-sm font-extrabold mb-2 block">Industry</label>
                         <select value={formData.industry} onChange={(e)=>setFormData({...formData, industry: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none text-slate-900 font-bold shadow-sm">
                           <option>Finance & CA Firm</option><option>IT / Software</option><option>Marketing</option><option>Manufacturing</option><option>EdTech</option><option>Retail</option>
                         </select>
                     </div>
                     
                     <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-slate-700 text-sm font-extrabold mb-2 block">Size</label>
                            <select value={formData.size} onChange={(e)=>setFormData({...formData, size: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none text-slate-900 font-bold shadow-sm">
                               <option>1-10 (Startup)</option><option>10-50 (Small)</option><option>50-200 (Mid)</option><option>200+ (Large)</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-slate-700 text-sm font-extrabold mb-2 block">Founded</label>
                            <input type="text" value={formData.foundedYear} onChange={(e)=>setFormData({...formData, foundedYear: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 outline-none text-slate-900 font-bold shadow-sm" placeholder="e.g. 2015"/>
                        </div>
                     </div>

                     <div>
                         <label className="text-slate-700 text-sm font-extrabold mb-2 block">Website</label>
                         <input type="text" value={formData.website} onChange={(e)=>setFormData({...formData, website: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-indigo-500 outline-none text-slate-900 font-bold shadow-sm" placeholder="https://..."/>
                     </div>

                     <div>
                         <label className="text-slate-700 text-sm font-extrabold mb-2 block">Registered Office Address</label>
                         <textarea rows={3} value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-indigo-500 outline-none text-slate-900 font-bold shadow-sm" placeholder="Full address..."/>
                     </div>

                     <div className="flex gap-4 pt-2">
                         <div className="flex-1">
                             <label className="text-slate-700 text-sm font-extrabold mb-2 block">GSTIN Number</label>
                             <input type="text" value={formData.gstin} onChange={(e)=>setFormData({...formData, gstin: e.target.value.toUpperCase()})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-indigo-500 outline-none uppercase text-slate-900 font-bold shadow-sm" placeholder="22AAAAA..."/>
                         </div>
                         <div className="flex-1">
                             <label className="text-slate-700 text-sm font-extrabold mb-2 block">CIN Number</label>
                             <input type="text" value={formData.cin} onChange={(e)=>setFormData({...formData, cin: e.target.value.toUpperCase()})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-indigo-500 outline-none uppercase text-slate-900 font-bold shadow-sm" placeholder="L12345XX..."/>
                         </div>
                     </div>
                  </div>
               </div>

               <div className="mb-10">
                  <label className="text-slate-700 text-sm font-extrabold mb-2 block">About Company (Tagline & Description)</label>
                  <input type="text" value={formData.tagline} onChange={(e)=>setFormData({...formData, tagline: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-indigo-500 outline-none mb-3 font-bold text-slate-900 shadow-sm" placeholder="A short one-liner tagline..."/>
                  <textarea rows={4} value={formData.about} onChange={(e)=>setFormData({...formData, about: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3.5 focus:border-indigo-500 outline-none font-bold text-slate-900 shadow-sm" placeholder="Tell candidates about your culture, vision, and what makes your company special..."></textarea>
               </div>

               <Button onClick={handleSave} className="w-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20">
                  <Save size={20}/> Save Company Profile
               </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}