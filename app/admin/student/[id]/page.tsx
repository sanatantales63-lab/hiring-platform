"use client";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { ArrowLeft, FileText, Globe } from "lucide-react";

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

  if (!student) return <div className="h-screen bg-[#020617] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 md:p-12 font-sans relative overflow-hidden">
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
       <div className="flex justify-between items-center mb-8">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
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
                    className="flex items-center gap-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-teal-500/30 shadow-sm"
                >
                    <Globe size={16} /> Copy Public Link
                </button>

                {/* 🔥 ADMIN KE LIYE RESUME VIEW BUTTON 🔥 */}
                {student?.resumeURL ? (
                    <a 
                        href={student.resumeURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-700 shadow-sm"
                    >
                        <FileText size={16} /> View Resume
                    </a>
                ) : (
                    <button disabled className="flex items-center gap-2 bg-slate-800/40 text-slate-500 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-700/50 cursor-not-allowed">
                        <FileText size={16} /> No Resume Found
                    </button>
                )}

                {/* 🔥 REPORT DOWNLOAD BUTTON 🔥 */}
                {(student?.examAccess === 'completed' || student?.meta?.totalScore !== undefined) ? (
                    <DownloadReportButton candidate={student} buttonStyle="admin" />
                ) : (
                    <button disabled className="flex items-center gap-2 bg-slate-800/40 text-slate-500 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-700/50 cursor-not-allowed">
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