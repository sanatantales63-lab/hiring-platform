"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Building2, Globe, MapPin, Users, Calendar, FileText, 
  Save, Edit, ArrowLeft, Camera, Loader2, CheckCircle, Briefcase, Hash, Factory
} from "lucide-react";
import CompanyProfileView from "@/app/components/CompanyProfileView"; // Naya component import kar rahe hain

export default function CompanyProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", tagline: "", website: "", industry: "Finance",
    size: "10-50 Employees", foundedYear: "", address: "", about: "",
    logoURL: "", requirements: [] as string[],
    gstin: "", cin: "", companyType: "Private Limited" // 🔥 NAYE FIELDS ADD KIYE
  });

  const skillOptions = ["Journal Entry", "GST Return", "TDS Return", "Income Tax", "Excel Advanced", "Ind-AS", "Audit"];

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/company/login"); return; }
      
      try {
        const { data, error } = await supabase.from("companies").select("*").eq("id", session.user.id).single();
        if (data) {
          // NULL values ko handle karna
          const cleanData: any = { ...data };
          Object.keys(cleanData).forEach(key => {
            if (cleanData[key] === null) cleanData[key] = "";
          });
          
          setFormData({ ...formData, ...cleanData });
          
          if (!data.industry || !data.name) setIsEditing(true); 
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
        requirements: formData.requirements || [],
        gstin: formData.gstin || "",         // Naya
        cin: formData.cin || "",             // Naya
        companyType: formData.companyType || "", // Naya
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

  const toggleRequirement = (skill: string) => {
    setFormData(prev => {
      const currentReqs = prev.requirements || []; 
      return {
        ...prev,
        requirements: currentReqs.includes(skill) 
          ? currentReqs.filter(s => s !== skill)
          : [...currentReqs, skill]
      };
    });
  };

  if (loading) return <div className="h-screen bg-[#0A0F1F] flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" size={48}/></div>;

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white p-6 md:p-12 font-sans">
      <button onClick={() => router.push('/company/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 group transition-colors">
        <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-slate-700 transition-colors"><ArrowLeft size={20} /></div>
        <span className="font-medium">Back to Dashboard</span>
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {isEditing ? "Edit Company Profile" : formData.name || "Company Profile"}
            </h1>
            <p className="text-slate-400 mt-2">Make your company stand out to candidates.</p>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all shadow-lg">
              <Edit size={18} /> Edit Details
            </button>
          )}
        </div>

        {!isEditing ? (
          // NAYA VIEW COMPONENT YAHAN AAYEGA
          <CompanyProfileView company={formData} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             
             {/* Upload Logo Section */}
             <div className="flex flex-col items-center mb-10 pb-10 border-b border-slate-800">
                <div className="relative group cursor-pointer w-28 h-28 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden hover:border-purple-500 transition-colors">
                   {uploading ? <Loader2 className="animate-spin text-purple-500"/> : formData.logoURL ? <img src={formData.logoURL} className="w-full h-full object-cover"/> : <Camera className="text-slate-500"/>}
                   <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
                </div>
                <p className="text-slate-500 text-xs mt-3">Upload Company Logo (Max 150KB)</p>
             </div>

             <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left Column */}
                <div className="space-y-5">
                   <div>
                       <label className="text-slate-400 text-sm font-bold mb-2 block">Company Name *</label>
                       <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 focus:border-purple-500 outline-none transition-colors" placeholder="e.g. Infosys Ltd."/>
                   </div>
                   
                   <div>
                       <label className="text-slate-400 text-sm font-bold mb-2 block">Company Type *</label>
                       <select value={formData.companyType} onChange={(e)=>setFormData({...formData, companyType: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 focus:border-purple-500 outline-none text-white [color-scheme:dark]">
                           <option>Private Limited</option>
                           <option>Public Limited</option>
                           <option>Partnership Firm</option>
                           <option>Sole Proprietorship</option>
                           <option>LLP</option>
                           <option>NGO / Trust</option>
                       </select>
                   </div>

                   <div>
                       <label className="text-slate-400 text-sm font-bold mb-2 block">GSTIN Number</label>
                       <input type="text" value={formData.gstin} onChange={(e)=>setFormData({...formData, gstin: e.target.value.toUpperCase()})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 focus:border-purple-500 outline-none uppercase" placeholder="22AAAAA0000A1Z5"/>
                   </div>

                   <div>
                       <label className="text-slate-400 text-sm font-bold mb-2 block">CIN Number</label>
                       <input type="text" value={formData.cin} onChange={(e)=>setFormData({...formData, cin: e.target.value.toUpperCase()})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 focus:border-purple-500 outline-none uppercase" placeholder="L12345XX2000PLC123456"/>
                   </div>

                   <div>
                       <label className="text-slate-400 text-sm font-bold mb-2 block">Tagline (One Liner)</label>
                       <input type="text" value={formData.tagline} onChange={(e)=>setFormData({...formData, tagline: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 focus:border-purple-500 outline-none" placeholder="e.g. Innovating Future"/>
                   </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                   <div>
                       <label className="text-slate-400 text-sm font-bold mb-2 block">Industry</label>
                       <select value={formData.industry} onChange={(e)=>setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 outline-none [color-scheme:dark]">
                         <option>Finance & CA Firm</option><option>IT / Software</option><option>Marketing</option><option>Manufacturing</option><option>EdTech</option><option>Retail</option>
                      </select>
                   </div>
                   
                   <div className="flex gap-4">
                      <div className="flex-1">
                          <label className="text-slate-400 text-sm font-bold mb-2 block">Size</label>
                          <select value={formData.size} onChange={(e)=>setFormData({...formData, size: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 outline-none [color-scheme:dark]">
                             <option>1-10 (Startup)</option><option>10-50 (Small)</option><option>50-200 (Mid)</option><option>200+ (Large)</option>
                          </select>
                      </div>
                      <div className="flex-1">
                          <label className="text-slate-400 text-sm font-bold mb-2 block">Founded</label>
                          <input type="text" value={formData.foundedYear} onChange={(e)=>setFormData({...formData, foundedYear: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 outline-none" placeholder="e.g. 2015"/>
                      </div>
                   </div>

                   <div>
                       <label className="text-slate-400 text-sm font-bold mb-2 block">Website</label>
                       <input type="text" value={formData.website} onChange={(e)=>setFormData({...formData, website: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 focus:border-purple-500 outline-none" placeholder="https://..."/>
                   </div>

                   <div>
                       <label className="text-slate-400 text-sm font-bold mb-2 block">Registered Office Address</label>
                       <textarea rows={3} value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 focus:border-purple-500 outline-none" placeholder="Full address..."/>
                   </div>
                </div>
             </div>

             <div className="mb-8">
                <label className="text-slate-400 text-sm font-bold mb-2 block">About Company</label>
                <textarea rows={4} value={formData.about} onChange={(e)=>setFormData({...formData, about: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 focus:border-purple-500 outline-none" placeholder="Tell candidates about your culture, vision, and what makes your company special..."></textarea>
             </div>

             <div className="mb-10 pt-8 border-t border-slate-800">
                <label className="text-white font-bold mb-4 block text-lg">Preferred Skills for Hiring</label>
                <div className="flex flex-wrap gap-3">
                   {skillOptions.map(skill => (
                      <button key={skill} onClick={(e)=>{ e.preventDefault(); toggleRequirement(skill); }} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${formData.requirements?.includes(skill) ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                         {skill} {formData.requirements?.includes(skill) && "✓"}
                      </button>
                   ))}
                </div>
             </div>

             <button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-extrabold text-lg shadow-xl shadow-purple-900/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                <Save size={20}/> Save Company Profile
             </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}