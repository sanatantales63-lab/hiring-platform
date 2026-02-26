"use client";
import { 
  Building2, Globe, MapPin, Users, Calendar, FileText, 
  CheckCircle, Briefcase, Hash, Factory, Mail
} from "lucide-react";

export default function CompanyProfileView({ company, isAdminView = false }: { company: any, isAdminView?: boolean }) {
  if (!company) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-slate-800 border-4 border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-xl">
           {company.logoURL ? <img src={company.logoURL} className="w-full h-full object-cover"/> : <Building2 size={64} className="text-slate-600"/>}
        </div>

        <div className="relative z-10 flex-1 text-center md:text-left">
           <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{company.name || "Unnamed Company"}</h2>
           {company.tagline && <p className="text-purple-400 font-bold tracking-wide mb-6">{company.tagline}</p>}

           <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-slate-950/80 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 border border-slate-800 flex items-center gap-2">
                 <Factory size={16} className="text-purple-500"/> {company.companyType || "Type N/A"}
              </span>
              <span className="bg-slate-950/80 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 border border-slate-800 flex items-center gap-2">
                 <MapPin size={16} className="text-blue-500"/> {company.city || company.address || "Location N/A"}
              </span>
              {isAdminView && company.email && (
                  <span className="bg-slate-950/80 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 border border-slate-800 flex items-center gap-2">
                    <Mail size={16} className="text-yellow-500"/> {company.email}
                  </span>
              )}
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         {/* Legal & Business Details */}
         <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-900/60 p-8 rounded-[2rem] border border-slate-800">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Briefcase className="text-purple-400"/> Overview</h3>
               <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between border-b border-slate-800/80 pb-3">
                     <span className="text-slate-400">Industry</span><span className="text-white font-bold">{company.industry || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-3">
                     <span className="text-slate-400">Size</span><span className="text-white font-bold">{company.size || "N/A"}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                     <span className="text-slate-400">Founded</span><span className="text-white font-bold">{company.foundedYear || "N/A"}</span>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-[2rem] border border-slate-800 relative overflow-hidden group">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Hash className="text-yellow-400"/> Legal Details</h3>
               <div className="space-y-4 text-sm">
                  <div className="pb-3 border-b border-slate-800/80">
                     <span className="text-slate-400 block mb-1 text-xs">GSTIN Number</span>
                     <span className="text-yellow-400 font-black tracking-widest">{company.gstin || "NOT PROVIDED"}</span>
                  </div>
                  <div>
                     <span className="text-slate-400 block mb-1 text-xs">CIN Number</span>
                     <span className="text-yellow-400 font-black tracking-widest">{company.cin || "NOT PROVIDED"}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* About & Requirements */}
         <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900/60 p-8 rounded-[2rem] border border-slate-800">
               <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><FileText className="text-purple-400"/> About Us</h3>
               <p className="text-slate-300 leading-relaxed md:text-lg italic">
                  {company.about ? `"${company.about}"` : "No description provided."}
               </p>
               {company.website && (
                  <a href={company.website} target="_blank" className="inline-flex items-center gap-2 mt-6 text-blue-400 font-bold hover:underline bg-blue-500/10 px-4 py-2 rounded-xl">
                     <Globe size={18}/> Visit Website
                  </a>
               )}
            </div>

            <div className="bg-slate-900/60 p-8 rounded-[2rem] border border-slate-800">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><CheckCircle className="text-green-500"/> Hiring Requirements</h3>
               <div className="flex flex-wrap gap-3">
                  {company.requirements && company.requirements.length > 0 ? (
                     company.requirements.map((req: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-purple-900/20 text-purple-300 border border-purple-500/30 rounded-xl text-sm font-bold shadow-sm">
                           {req}
                        </span>
                     ))
                  ) : (
                     <p className="text-slate-500 italic">No specific skills mentioned.</p>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}