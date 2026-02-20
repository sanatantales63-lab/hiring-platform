"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Building2, Globe, MapPin, Users, Calendar, FileText, 
  Save, Edit, ArrowLeft, Camera, Loader2, CheckCircle, Briefcase 
} from "lucide-react";

export default function CompanyProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", tagline: "", website: "", industry: "Finance",
    size: "10-50 Employees", foundedYear: "", address: "", about: "",
    logoURL: "", requirements: [] as string[] 
  });

  const skillOptions = ["Journal Entry", "GST Return", "TDS Return", "Income Tax", "Excel Advanced", "Ind-AS", "Audit"];

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/company/login"); return; }
      
      try {
        const { data, error } = await supabase.from("companies").select("*").eq("id", session.user.id).single();
        if (data) {
          // 🔥 FIX 1: Database se aane wale 'null' ko khali string "" bana do
          const cleanData: any = { ...data };
          Object.keys(cleanData).forEach(key => {
            if (cleanData[key] === null) cleanData[key] = "";
          });
          
          setFormData({ ...formData, ...cleanData });
          
          // Check agar form khali hai toh edit mode me dalo
          if (!data.industry) setIsEditing(true); 
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

  // 🔥 FIX 2: Naya Handle Save (Filter karke data bhejega taaki 400 Error na aaye)
  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    try {
      const payload = {
        id: session.user.id,
        name: formData.name || "",
        tagline: formData.tagline || "",
        website: formData.website || "",
        industry: formData.industry || "",
        size: formData.size || "",
        foundedYear: formData.foundedYear || "",
        address: formData.address || "",
        about: formData.about || "",
        logoURL: formData.logoURL || "",
        requirements: formData.requirements || [],
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

  // 🔥 FIX 3: Requirements array null hone par crash na ho uski safety
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
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all">
              <Edit size={18} /> Edit Details
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
                <div className="w-28 h-28 bg-slate-800 rounded-2xl border-4 border-slate-900 shadow-xl mb-4 overflow-hidden flex items-center justify-center relative z-10">
                   {formData.logoURL ? <img src={formData.logoURL} className="w-full h-full object-cover"/> : <Building2 size={40} className="text-slate-600"/>}
                </div>
                <h2 className="text-2xl font-bold">{formData.name || "Company Name"}</h2>
                <p className="text-purple-400 text-sm mb-6">{formData.tagline || "Tagline goes here..."}</p>

                <div className="w-full space-y-4 text-left bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                    <div className="flex items-center gap-3 text-slate-300"><Globe size={16} className="text-slate-500"/> <a href={formData.website} target="_blank" className="text-sm hover:text-blue-400 truncate">{formData.website || "No Website"}</a></div>
                    <div className="flex items-center gap-3 text-slate-300"><Briefcase size={16} className="text-slate-500"/> <span className="text-sm">{formData.industry}</span></div>
                    <div className="flex items-center gap-3 text-slate-300"><Users size={16} className="text-slate-500"/> <span className="text-sm">{formData.size}</span></div>
                    <div className="flex items-center gap-3 text-slate-300"><MapPin size={16} className="text-slate-500"/> <span className="text-sm">{formData.address || "Location not set"}</span></div>
                </div>
            </motion.div>

            <div className="md:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                   <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText className="text-purple-500"/> About Us</h3>
                   <p className="text-slate-400 leading-relaxed">{formData.about || "No description added yet. Edit profile to add company bio."}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                   <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><CheckCircle className="text-green-500"/> Talent Requirements</h3>
                   <div className="flex flex-wrap gap-3">
                      {formData.requirements?.length > 0 ? formData.requirements.map((req, i) => (
                         <span key={i} className="px-4 py-2 bg-purple-900/20 text-purple-300 border border-purple-500/30 rounded-xl text-sm">{req}</span>
                      )) : <p className="text-slate-500 italic">No requirements set.</p>}
                   </div>
                </motion.div>
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
             <div className="flex flex-col items-center mb-10 pb-10 border-b border-slate-800">
                <div className="relative group cursor-pointer w-28 h-28 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden hover:border-purple-500 transition-colors">
                   {uploading ? <Loader2 className="animate-spin text-purple-500"/> : formData.logoURL ? <img src={formData.logoURL} className="w-full h-full object-cover"/> : <Camera className="text-slate-500"/>}
                   <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
                </div>
                <p className="text-slate-500 text-xs mt-3">Upload Company Logo (Max 150KB)</p>
             </div>

             <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-5">
                   <div><label className="text-slate-400 text-sm mb-1 block">Company Name</label><input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:border-purple-500 outline-none"/></div>
                   <div><label className="text-slate-400 text-sm mb-1 block">Tagline (One Liner)</label><input type="text" value={formData.tagline} onChange={(e)=>setFormData({...formData, tagline: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:border-purple-500 outline-none" placeholder="e.g. Innovating Future"/></div>
                   <div><label className="text-slate-400 text-sm mb-1 block">Website</label><input type="text" value={formData.website} onChange={(e)=>setFormData({...formData, website: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:border-purple-500 outline-none" placeholder="https://..."/></div>
                </div>
                <div className="space-y-5">
                   <div><label className="text-slate-400 text-sm mb-1 block">Industry</label>
                      <select value={formData.industry} onChange={(e)=>setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none">
                         <option>Finance & CA</option><option>IT / Software</option><option>Marketing</option><option>Manufacturing</option><option>EdTech</option>
                      </select>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex-1"><label className="text-slate-400 text-sm mb-1 block">Size</label>
                         <select value={formData.size} onChange={(e)=>setFormData({...formData, size: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none">
                            <option>1-10 (Startup)</option><option>10-50 (Small)</option><option>50-200 (Mid)</option><option>200+ (Large)</option>
                         </select>
                      </div>
                      <div className="flex-1"><label className="text-slate-400 text-sm mb-1 block">Founded</label><input type="text" value={formData.foundedYear} onChange={(e)=>setFormData({...formData, foundedYear: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none" placeholder="e.g. 2015"/></div>
                   </div>
                   <div><label className="text-slate-400 text-sm mb-1 block">Office Address</label><input type="text" value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:border-purple-500 outline-none"/></div>
                </div>
             </div>

             <div className="mb-8">
                <label className="text-slate-400 text-sm mb-1 block">About Company</label>
                <textarea rows={4} value={formData.about} onChange={(e)=>setFormData({...formData, about: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:border-purple-500 outline-none" placeholder="Tell candidates about your culture and vision..."></textarea>
             </div>

             <div className="mb-8 pt-6 border-t border-slate-800">
                <label className="text-white font-bold mb-4 block">Candidate Requirements (Skills)</label>
                <div className="flex flex-wrap gap-3">
                   {skillOptions.map(skill => (
                      <button key={skill} onClick={(e)=>{ e.preventDefault(); toggleRequirement(skill); }} className={`px-4 py-2 rounded-xl text-sm border transition-all ${formData.requirements?.includes(skill) ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                         {skill} {formData.requirements?.includes(skill) && "✓"}
                      </button>
                   ))}
                </div>
             </div>

             <button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold text-lg shadow-xl shadow-purple-900/20 hover:scale-[1.01] transition-transform flex items-center justify-center gap-2">
                <Save size={20}/> Save Profile
             </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}