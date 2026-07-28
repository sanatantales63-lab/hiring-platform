"use client";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Globe, Loader2 } from "lucide-react";

// Yahan humne wahi Master Component Admin ke liye bulaya hai
import CandidateProfileView from "@/app/components/CandidateProfileView";
// 🔥 PDF DOWNLOAER COMPONENT 🔥
import DownloadReportButton from "@/app/components/DownloadReportButton";

export default function AdminStudentView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      if(!id) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (data) setStudent(data);
    };
    fetchCandidate();
  }, [id]);

  if (!student) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[var(--primary)] mb-4" size={48} />
        <p className="text-[var(--muted-foreground)] font-bold text-lg">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8 md:p-12 font-sans relative overflow-hidden">
      {/* Indigo Ambient Glow */}
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--primary)]/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
       <div className="flex justify-between items-center mb-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[var(--border)] shadow-soft">
             <button onClick={() => router.back()} className="flex items-center gap-2 text-[var(--ink-soft)] hover:text-[var(--foreground)] transition-colors">
               <ArrowLeft size={18}/> <span className="font-bold">Back to Admin Panel</span>
             </button>

             <div className="flex items-center gap-4">
                {/* 🔥 ADMIN ONLY: SHARE LINK BUTTON 🔥 */}
                <button 
                    onClick={() => {
                        if (!student?.id) return;
                        const profileLink = `${window.location.origin}/p/${student.id}`;
                        navigator.clipboard.writeText(profileLink);
                        alert(`Public Link Copied Successfully!`);
                    }}
                    className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-[var(--primary)] px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-[oklch(0.46_0.20_264_/_0.15)] shadow-sm"
                >
                    <Globe size={16} /> Copy Public Link
                </button>

                {/* 🔥 ADMIN KE LIYE RESUME VIEW BUTTON 🔥 */}
                {student?.resumeURL ? (
                    <a 
                        href={student.resumeURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/40 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-soft"
                    >
                        <FileText size={16} /> View Resume
                    </a>
                ) : (
                    <button disabled className="flex items-center gap-2 bg-[var(--muted)] text-[var(--muted-foreground)] px-4 py-2.5 rounded-xl text-sm font-bold border border-[var(--border)]/50 cursor-not-allowed">
                        <FileText size={16} /> No Resume Found
                    </button>
                )}

                {/* 🔥 REPORT DOWNLOAD BUTTON 🔥 */}
                {(student?.examAccess === 'completed' || student?.meta?.totalScore !== undefined) ? (
                    <DownloadReportButton candidate={student} buttonStyle="admin" />
                ) : (
                    <button disabled className="flex items-center gap-2 bg-[var(--muted)] text-[var(--muted-foreground)] px-4 py-2.5 rounded-xl text-sm font-bold border border-[var(--border)]/50 cursor-not-allowed">
                        Test Not Completed
                    </button>
                )}
             </div>
         </div>
        
        {/* JADOO YAHAN HAI: Admin Mode mein Master Design fetch */}
        <CandidateProfileView candidate={student} role="admin" />
        
      </div>
    </div>
  );
}