"use client";
import { 
  Building2, Globe, MapPin, Users, Calendar, FileText, 
  Hash, Factory, Mail, Smartphone, IdCard, ShieldCheck, ExternalLink, Landmark
} from "lucide-react";

// Master Card component
import Card from "@/app/components/ui/Card";

export default function CompanyProfileView({ company, isAdminView = false }: { company: any, isAdminView?: boolean }) {
  if (!company) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 text-slate-800">
      
      {/* 👑 ELEVATED HEADER PANEL */}
      <Card className="relative overflow-hidden p-8 border border-[var(--border)] shadow-soft bg-[var(--card)] rounded-[2.5rem]">
        {/* Soft Ambient Background Aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[var(--primary)]/10 to-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Logo Shield Container */}
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative group bg-white">
             {company.logoURL ? (
               <img src={company.logoURL} alt="Company Logo" className="w-full h-full object-cover" />
             ) : (
               <Building2 size={52} className="text-[var(--muted-foreground)] opacity-40" />
             )}
             <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-teal-100 flex items-center justify-center shadow-sm">
                <ShieldCheck size={12} className="text-[#0f947e]" />
             </div>
          </div>

          {/* Core Descriptive Context */}
          <div className="flex-1 text-center md:text-left min-w-0">
             <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                <h2 className="font-display text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight truncate">
                   {company.name || "Identity Unconfigured"}
                </h2>
             </div>
             
             {company.tagline ? (
                <p className="text-[#0f947e] font-bold text-sm tracking-wide mb-5 max-w-2xl">{company.tagline}</p>
             ) : (
                <p className="text-slate-400 font-medium text-xs italic mb-5">Premium Registered Partner Enterprise</p>
             )}

             {/* Action Badges Mapping */}
             <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
                <span className="bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-2">
                   <Factory size={13} className="text-[#0f947e]"/> {company.companyType || "Private Limited"}
                </span>
                <span className="bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-2">
                   <MapPin size={13} className="text-[#0f947e]"/> {company.location || company.address || "Location Agnostic"}
                </span>
                {isAdminView && company.email && (
                   <span className="bg-amber-50/60 text-amber-800 font-bold text-xs px-3.5 py-2 rounded-xl border border-amber-200/60 shadow-sm flex items-center gap-2">
                     <Mail size={13} className="text-amber-600"/> {company.email}
                   </span>
                )}
             </div>
          </div>
        </div>
      </Card>

      {/* 📊 BUSINESS ARCHITECTURE MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
         
         {/* Left Infrastructure Panel */}
         <div className="space-y-6">
            
            {/* Overview Card */}
            <Card className="border border-[var(--border)] shadow-soft bg-[var(--card)] p-6 rounded-[2rem]">
               <h3 className="font-display text-sm font-black text-[var(--foreground)] uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Building2 size={16} className="text-[#0f947e]"/> Company Profile
               </h3>
               <div className="space-y-4 text-xs font-bold text-slate-600">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                     <span className="text-slate-400 font-medium">Industry Vertical</span>
                     <span className="text-slate-900 font-black">{company.industry || "Finance & CA Firm"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                     <span className="text-slate-400 font-medium">Active Headcount</span>
                     <span className="text-[#0f947e] font-black">{company.size || "1-10"} Employees</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                     <span className="text-slate-400 font-medium">Est. Anniversary</span>
                     <span className="text-slate-900 font-black">{company.foundedYear || "N/A"}</span>
                  </div>
               </div>
            </Card>

            {/* Legal Structure Cards */}
            <Card className="border border-[var(--border)] shadow-soft bg-[var(--card)] p-6 rounded-[2rem]">
               <h3 className="font-display text-sm font-black text-[var(--foreground)] uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Landmark size={16} className="text-[#0f947e]"/> Compliance Schema
               </h3>
               <div className="space-y-4 text-xs">
                  <div className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl">
                     <span className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[9px]">GSTIN Registration</span>
                     <span className="text-slate-900 font-mono font-black tracking-wider text-sm">{company.gstin || "NOT CONFIGURED"}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl">
                     <span className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[9px]">Corporate Identity No (CIN)</span>
                     <span className="text-slate-900 font-mono font-black tracking-wider text-sm">{company.cin || "NOT CONFIGURED"}</span>
                  </div>
               </div>
            </Card>
         </div>

         {/* Right Core Content Workspace */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Extended Biography Abstract */}
            <Card className="border border-[var(--border)] shadow-soft bg-[var(--card)] p-6 md:p-8 rounded-[2rem]">
               <h3 className="font-display text-sm font-black text-[var(--foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-[#0f947e]"/> Executive Summary
               </h3>
               <p className="text-slate-600 font-semibold leading-relaxed text-sm bg-slate-50/40 border border-slate-100 p-5 rounded-2xl">
                  {company.about ? company.about : "No explicit executive description or culture summary has been logged by the enterprise management yet."}
               </p>
               {company.website && (
                  <a 
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 text-xs font-black uppercase tracking-wider text-white bg-[#0f947e] hover:bg-[#0a7a67] transition-all px-5 py-3 rounded-xl shadow-md shadow-teal-500/10 cursor-pointer"
                  >
                     <Globe size={14}/> Connect To Web Nodes <ExternalLink size={12} className="ml-1 opacity-70"/>
                  </a>
               )}
            </Card>

            {/* Verification Endpoint node: Point of Contact */}
            <Card className="border border-[var(--border)] shadow-soft bg-[var(--card)] p-6 rounded-[2rem] relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0f947e] to-teal-600" />
               <h3 className="font-display text-sm font-black text-[var(--foreground)] uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Smartphone size={16} className="text-[#0f947e]"/> Primary Contact Endpoint
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                     <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0f947e] shrink-0">
                        <IdCard size={18}/>
                     </div>
                     <div className="min-w-0">
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-medium">Verification Status / Designation</span>
                        <span className="text-slate-900 font-black text-sm truncate block mt-0.5">{company.designation || "Not Configured"}</span>
                     </div>
                  </div>
                  
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                     <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0f947e] shrink-0">
                        <Smartphone size={18}/>
                     </div>
                     <div className="min-w-0">
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-medium">Operational Phone Line</span>
                        <span className="text-slate-900 font-black text-sm tracking-wider block mt-0.5">{company.contact_number || "Not Logged"}</span>
                     </div>
                  </div>
               </div>
            </Card>

         </div>
      </div>
    </div>
  );
}