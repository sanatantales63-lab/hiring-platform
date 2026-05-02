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
      <Card className="relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8 border border-[var(--border)] shadow-elevated bg-[var(--card)]/90 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
           {company.logoURL ? <img src={company.logoURL} className="w-full h-full object-cover"/> : <Building2 size={64} className="text-[var(--muted-foreground)]"/>}
        </div>

        <div className="relative z-10 flex-1 text-center md:text-left">
           <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[var(--foreground)] mb-2 tracking-tight">{company.name || "Unnamed Company"}</h2>
           {company.tagline && <p className="text-[var(--primary)] font-bold tracking-wide mb-6">{company.tagline}</p>}

           <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-[var(--surface)] px-4 py-2 rounded-xl text-sm font-bold text-[var(--foreground)] border border-[var(--border)] shadow-sm flex items-center gap-2">
                 <Factory size={16} className="text-[var(--primary)]"/> {company.companyType || "Type N/A"}
              </span>
              <span className="bg-[var(--surface)] px-4 py-2 rounded-xl text-sm font-bold text-[var(--foreground)] border border-[var(--border)] shadow-sm flex items-center gap-2">
                 <MapPin size={16} className="text-[var(--primary)]"/> {company.city || company.address || "Location N/A"}
              </span>
              {isAdminView && company.email && (
                 <span className="bg-[var(--surface)] px-4 py-2 rounded-xl text-sm font-bold text-[var(--foreground)] border border-[var(--border)] shadow-sm flex items-center gap-2">
                   <Mail size={16} className="text-amber-500"/> {company.email}
                 </span>
              )}
           </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
         {/* Legal & Business Details */}
         <div className="md:col-span-1 space-y-6">
            <Card className="border border-[var(--border)] shadow-soft bg-[var(--card)]">
               <h3 className="font-display text-xl font-extrabold text-[var(--foreground)] mb-6 flex items-center gap-3"><Briefcase className="text-[var(--primary)]"/> Overview</h3>
               <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between border-b border-[var(--border)] pb-3">
                     <span className="text-[var(--muted-foreground)]">Industry</span><span className="text-[var(--foreground)] font-bold">{company.industry || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border)] pb-3">
                     <span className="text-[var(--muted-foreground)]">Size</span><span className="text-[var(--foreground)] font-bold">{company.size || "N/A"}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                     <span className="text-[var(--muted-foreground)]">Founded</span><span className="text-[var(--foreground)] font-bold">{company.foundedYear || "N/A"}</span>
                  </div>
               </div>
            </Card>

            <Card className="relative overflow-hidden group border border-[var(--border)] shadow-soft bg-[var(--card)]">
               <h3 className="font-display text-xl font-extrabold text-[var(--foreground)] mb-6 flex items-center gap-3"><Hash className="text-[var(--primary)]"/> Legal Details</h3>
               <div className="space-y-4 text-sm">
                  <div className="pb-3 border-b border-[var(--border)]">
                     <span className="text-[var(--muted-foreground)] block mb-1 text-xs font-bold">GSTIN Number</span>
                     <span className="text-[var(--primary)] font-black tracking-widest">{company.gstin || "NOT PROVIDED"}</span>
                  </div>
                  <div>
                     <span className="text-[var(--muted-foreground)] block mb-1 text-xs font-bold">CIN Number</span>
                     <span className="text-[var(--primary)] font-black tracking-widest">{company.cin || "NOT PROVIDED"}</span>
                  </div>
               </div>
            </Card>
         </div>

         {/* About & Point of Contact */}
         <div className="md:col-span-2 space-y-6">
            <Card className="border border-[var(--border)] shadow-soft bg-[var(--card)]">
               <h3 className="font-display text-2xl font-extrabold text-[var(--foreground)] mb-4 flex items-center gap-3"><FileText className="text-[var(--primary)]"/> About Us</h3>
               <p className="text-[var(--muted-foreground)] font-medium leading-relaxed md:text-lg italic">
                  {company.about ? `"${company.about}"` : "No description provided."}
               </p>
               {company.website && (
                  <a href={company.website} target="_blank" className="inline-flex items-center gap-2 mt-6 text-[var(--primary)] font-bold hover:bg-[var(--accent)] transition-colors bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-5 py-2.5 rounded-xl shadow-sm">
                     <Globe size={18}/> Visit Website
                  </a>
               )}
            </Card>

            {/* CONTACT PERSON SECTION */}
            <Card className="relative overflow-hidden border border-[var(--border)] shadow-soft bg-[var(--card)]">
               <div className="absolute top-0 right-0 w-1.5 bg-gradient-primary h-full"></div>
               <h3 className="font-display text-xl font-extrabold text-[var(--foreground)] mb-6 flex items-center gap-3"><User className="text-[var(--primary)]"/> Point of Contact</h3>
               <div className="grid md:grid-cols-2 gap-6 text-sm font-medium">
                  <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
                     <span className="text-[var(--muted-foreground)] flex items-center gap-2 mb-2 font-bold"><Briefcase size={14}/> Designation</span>
                     <span className="text-[var(--foreground)] font-extrabold text-lg">{company.designation || "Not specified"}</span>
                  </div>
                  <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
                     <span className="text-[var(--muted-foreground)] flex items-center gap-2 mb-2 font-bold"><Phone size={14}/> Phone Number</span>
                     <span className="text-[var(--foreground)] font-extrabold tracking-wider">{company.contact_number || "Not provided"}</span>
                  </div>
               </div>
            </Card>

         </div>
      </div>
    </div>
  );
}