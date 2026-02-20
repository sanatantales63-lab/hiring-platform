"use client";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
// Yahan humne Master Component bulaya hai
import CandidateProfileView from "@/app/components/CandidateProfileView";

export default function CompanyCandidateView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); 
  const [candidate, setCandidate] = useState<any>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
      if (data) setCandidate(data);
    };
    fetchCandidate();
  }, [id]);

  if (!candidate) return <div className="h-screen bg-[#020617] flex items-center justify-center text-slate-400">Loading Candidate Info...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={18} /> <span className="font-semibold">Back to Candidates</span>
            </button>
            <button onClick={() => alert("Please contact Admin to unlock.")} className="bg-purple-600 hover:bg-purple-500 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 transition-all">
                <Lock size={16}/> Request Unlock
            </button>
        </div>

        {/* JADOO YAHAN HAI: Sirf ek line mein poora design fetch ho raha hai */}
        <CandidateProfileView candidate={candidate} role="company" />
        
      </div>
    </div>
  );
}