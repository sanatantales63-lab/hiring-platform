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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 text-[var(--foreground)]">
      
      {/* 👑 ELEVATED HEADER PANEL */}
      <Card className="relative overflow-hidden p-6 border border-[var(--border)] shadow-soft bg-white rounded-xl">
        {/* Soft Ambient Background Aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* Logo Shield Container */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0 shadow-soft relative group bg-white">
             {company.logoURL ? (
                <img src={company.logoURL} alt="Company Logo" className="w-full h-full object-cover" />
             ) : (
                <Building2 size={36} className="text-[var(--muted-foreground)] opacity-40" />
             )}
             <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-[var(--border)] flex items-center justify-center shadow-soft">
                <ShieldCheck size={12} className="text-[var(--primary)]" />
             </div>
          </div>

          {/* Core Descriptive Context */}
          <div className="flex-1 text-center md:text-left min-w-0">
             <div className="flex flex-col md:flex-row md:items-center gap-3 mb-1 justify-center md:justify-start">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--foreground)] tracking-tight truncate">
                   {company.name || "Identity Unconfigured"}
                </h2>
             </div>
             
             {company.tagline ? (
                <p className="text-[var(--primary)] font-semibold text-sm tracking-wide mb-4 max-w-2xl">{company.tagline}</p>
             ) : (
                <p className="text-[var(--muted-foreground)] font-medium text-xs italic mb-4">Premium Registered Partner Enterprise</p>
             )}

             {/* Action Badges Mapping */}
             <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-[var(--surface)] text-[var(--foreground)] font-semibold text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] shadow-soft flex items-center gap-1.5">
                   <Factory size={12} className="text-[var(--primary)]"/> {company.companyType || "Private Limited"}
                </span>
                <span className="bg-[var(--surface)] text-[var(--foreground)] font-semibold text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] shadow-soft flex items-center gap-1.5">
                   <MapPin size={12} className="text-[var(--primary)]"/> {company.location || company.address || "Location Agnostic"}
                </span>
                {isAdminView && company.email && (
                   <span className="bg-[var(--accent)] text-[var(--primary)] font-semibold text-xs px-3 py-1.5 rounded-lg border border-[var(--primary)]/20 shadow-soft flex items-center gap-1.5">
                     <Mail size={12} className="text-[var(--primary)]"/> {company.email}
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
            <Card className="border border-[var(--border)] shadow-soft bg-white p-6 rounded-xl">
               <h3 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 size={14} className="text-[var(--primary)]"/> Company Profile
               </h3>
               <div className="space-y-3 text-xs font-semibold text-[var(--muted-foreground)]">
                  <div className="flex justify-between items-center border-b border-[var(--border)] pb-2.5">
                     <span className="text-[var(--muted-foreground)] font-medium">Industry Vertical</span>
                     <span className="text-[var(--foreground)] font-bold">{company.industry || "Finance & CA Firm"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[var(--border)] pb-2.5">
                     <span className="text-[var(--muted-foreground)] font-medium">Active Headcount</span>
                     <span className="text-[var(--primary)] font-bold">{company.size || "1-10"} Employees</span>
                  </div>
                  <div className="flex justify-between items-center pb-0.5">
                     <span className="text-[var(--muted-foreground)] font-medium">Est. Anniversary</span>
                     <span className="text-[var(--foreground)] font-bold">{company.foundedYear || "N/A"}</span>
                  </div>
               </div>
            </Card>

            {/* Legal Structure Cards */}
            <Card className="border border-[var(--border)] shadow-soft bg-white p-6 rounded-xl">
               <h3 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Landmark size={14} className="text-[var(--primary)]"/> Compliance Schema
               </h3>
               <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                     <span className="text-[var(--muted-foreground)] block mb-1 font-bold uppercase tracking-wider text-[9px]">GSTIN Registration</span>
                     <span className="text-[var(--foreground)] font-mono font-bold tracking-wider text-xs">{company.gstin || "NOT CONFIGURED"}</span>
                  </div>
                  <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                     <span className="text-[var(--muted-foreground)] block mb-1 font-bold uppercase tracking-wider text-[9px]">Corporate Identity No (CIN)</span>
                     <span className="text-[var(--foreground)] font-mono font-bold tracking-wider text-xs">{company.cin || "NOT CONFIGURED"}</span>
                  </div>
               </div>
            </Card>
         </div>

         {/* Right Core Content Workspace */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Extended Biography Abstract */}
            <Card className="border border-[var(--border)] shadow-soft bg-white p-6 md:p-8 rounded-xl">
               <h3 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={14} className="text-[var(--primary)]"/> Executive Summary
               </h3>
               <p className="text-[var(--muted-foreground)] font-medium leading-relaxed text-sm bg-[var(--surface)] border border-[var(--border)] p-4 rounded-lg">
                  {company.about ? company.about : "No explicit executive description or culture summary has been logged by the enterprise management yet."}
               </p>
               {company.website && (
                  <a 
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--primary)] hover:bg-[var(--primary-glow)] transition-all px-4 py-2.5 rounded-lg shadow-[var(--shadow-primary)] cursor-pointer"
                  >
                     <Globe size={12}/> Connect To Web Nodes <ExternalLink size={10} className="ml-1 opacity-70"/>
                  </a>
               )}
            </Card>

            {/* Verification Endpoint node: Point of Contact */}
            <Card className="border border-[var(--border)] shadow-soft bg-white p-6 rounded-xl relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)]" />
               <h3 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Smartphone size={14} className="text-[var(--primary)]"/> Primary Contact Endpoint
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-[var(--muted-foreground)]">
                  <div className="bg-[var(--surface)] p-3 rounded-lg border border-[var(--border)] flex items-center gap-3">
                     <div className="w-8 h-8 rounded-md bg-[var(--accent)] border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] shrink-0">
                        <IdCard size={16}/>
                     </div>
                     <div className="min-w-0">
                        <span className="text-[var(--muted-foreground)] block text-[9px] uppercase tracking-wider font-medium">Verification Status / Designation</span>
                        <span className="text-[var(--foreground)] font-bold text-sm truncate block mt-0.5">{company.designation || "Not Configured"}</span>
                     </div>
                  </div>
                  
                  <div className="bg-[var(--surface)] p-3 rounded-lg border border-[var(--border)] flex items-center gap-3">
                     <div className="w-8 h-8 rounded-md bg-[var(--accent)] border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] shrink-0">
                        <Smartphone size={16}/>
                     </div>
                     <div className="min-w-0">
                        <span className="text-[var(--muted-foreground)] block text-[9px] uppercase tracking-wider font-medium">Operational Phone Line</span>
                        <span className="text-[var(--foreground)] font-bold text-sm tracking-wider block mt-0.5">{company.contact_number || "Not Logged"}</span>
                     </div>
                  </div>
               </div>
            </Card>

          </div>
      </div>
    </div>
  );
}