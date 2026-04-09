"use client";
import { 
  Building2, Globe, MapPin, Users, Calendar, FileText, 
  CheckCircle, Briefcase, Hash, Factory, Mail, Phone, User
} from "lucide-react";

// 🔥 Apna naya Master Card component import kiya 🔥
import Card from "@/app/components/ui/Card";

export default function CompanyProfileView({ company, isAdminView = false }: { company: any, isAdminView?: boolean }) {
  if (!company) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Card */}
      <Card className="relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
           {company.logoURL ? <img src={company.logoURL} className="w-full h-full object-cover"/> : <Building2 size={64} className="text-slate-300"/>}
        </div>

        <div className="relative z-10 flex-1 text-center md:text-left">
           <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2">{company.name || "Unnamed Company"}</h2>
           {company.tagline && <p className="text-indigo-600 font-bold tracking-wide mb-6">{company.tagline}</p>}

           <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-white/80 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 border border-slate-200 shadow-sm flex items-center gap-2">
                 <Factory size={16} className="text-indigo-500"/> {company.companyType || "Type N/A"}
              </span>
              <span className="bg-white/80 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 border border-slate-200 shadow-sm flex items-center gap-2">
                 <MapPin size={16} className="text-blue-500"/> {company.city || company.address || "Location N/A"}
              </span>
              {isAdminView && company.email && (
                 <span className="bg-white/80 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 border border-slate-200 shadow-sm flex items-center gap-2">
                   <Mail size={16} className="text-amber-500"/> {company.email}
                 </span>
              )}
           </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
         {/* Legal & Business Details */}
         <div className="md:col-span-1 space-y-6">
            <Card>
               <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3"><Briefcase className="text-indigo-500"/> Overview</h3>
               <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between border-b border-slate-100 pb-3">
                     <span className="text-slate-500">Industry</span><span className="text-slate-900 font-bold">{company.industry || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-3">
                     <span className="text-slate-500">Size</span><span className="text-slate-900 font-bold">{company.size || "N/A"}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                     <span className="text-slate-500">Founded</span><span className="text-slate-900 font-bold">{company.foundedYear || "N/A"}</span>
                  </div>
               </div>
            </Card>

            <Card className="relative overflow-hidden group">
               <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3"><Hash className="text-amber-500"/> Legal Details</h3>
               <div className="space-y-4 text-sm">
                  <div className="pb-3 border-b border-slate-100">
                     <span className="text-slate-500 block mb-1 text-xs font-bold">GSTIN Number</span>
                     <span className="text-amber-600 font-black tracking-widest">{company.gstin || "NOT PROVIDED"}</span>
                  </div>
                  <div>
                     <span className="text-slate-500 block mb-1 text-xs font-bold">CIN Number</span>
                     <span className="text-amber-600 font-black tracking-widest">{company.cin || "NOT PROVIDED"}</span>
                  </div>
               </div>
            </Card>
         </div>

         {/* About & Point of Contact */}
         <div className="md:col-span-2 space-y-6">
            <Card>
               <h3 className="text-2xl font-extrabold text-slate-900 mb-4 flex items-center gap-3"><FileText className="text-indigo-500"/> About Us</h3>
               <p className="text-slate-700 font-medium leading-relaxed md:text-lg italic">
                  {company.about ? `"${company.about}"` : "No description provided."}
               </p>
               {company.website && (
                  <a href={company.website} target="_blank" className="inline-flex items-center gap-2 mt-6 text-blue-700 font-bold hover:bg-blue-100 transition-colors bg-blue-50 border border-blue-200 px-5 py-2.5 rounded-xl shadow-sm">
                     <Globe size={18}/> Visit Website
                  </a>
               )}
            </Card>

            {/* 🔥 CONTACT PERSON SECTION 🔥 */}
            <Card className="relative overflow-hidden">
               <div className="absolute top-0 right-0 w-1.5 bg-[#0f947e] h-full"></div>
               <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-3"><User className="text-[#0f947e]"/> Point of Contact</h3>
               <div className="grid md:grid-cols-2 gap-6 text-sm font-medium">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                     <span className="text-slate-500 flex items-center gap-2 mb-2 font-bold"><Briefcase size={14}/> Designation</span>
                     <span className="text-slate-900 font-extrabold text-lg">{company.designation || "Not specified"}</span>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                     <span className="text-slate-500 flex items-center gap-2 mb-2 font-bold"><Phone size={14}/> Phone Number</span>
                     <span className="text-slate-900 font-extrabold tracking-wider">{company.contact_number || "Not provided"}</span>
                  </div>
               </div>
            </Card>

         </div>
      </div>
    </div>
  );
}