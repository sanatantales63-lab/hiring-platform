"use client";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
// Yahan humne wahi Master Component Admin ke liye bulaya hai
import CandidateProfileView from "@/app/components/CandidateProfileView";

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
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={18}/> <span className="font-bold">Back to Admin Panel</span>
        </button>
        
        {/* JADOO YAHAN HAI: Admin Mode mein Master Design fetch */}
        <CandidateProfileView candidate={student} role="admin" />
        
      </div>
    </div>
  );
}