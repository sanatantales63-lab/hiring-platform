"use client";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";

// 🔥 Naye Master Components 🔥
import Button from "@/app/components/ui/Button";
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

  if (!candidate) return (
      <div className="h-screen bg-transparent flex items-center justify-center text-slate-900 relative z-10">
          <Loader2 className="animate-spin text-[#0f947e] w-10 h-10 mr-3" />
          <span className="font-extrabold text-lg">Loading Candidate Info...</span>
      </div>
  );

  return (
    <div className="min-h-screen bg-transparent text-slate-900 p-6 md:p-12 font-sans relative z-10">
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* NAYA GLASSY HEADER BAR */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8 bg-white/80 backdrop-blur-xl border border-slate-200 p-4 rounded-2xl shadow-sm">
            
            <Button 
                variant="ghost" 
                onClick={() => router.back()} 
                className="pl-0 hover:bg-transparent"
            >
                <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl shadow-sm text-slate-600 hover:text-[#0f947e] transition-colors">
                    <ArrowLeft size={18} />
                </div>
                <span className="font-bold text-slate-700">Back to Candidates</span>
            </Button>

            <Button 
                variant="primary" 
                onClick={() => alert("Please contact Admin to unlock.")} 
                className="w-full sm:w-auto shadow-teal-500/20"
            >
                <Lock size={16}/> Request Unlock
            </Button>
        </div>

        {/* JADOO YAHAN HAI: Sirf ek line mein poora premium design fetch ho raha hai */}
        <CandidateProfileView candidate={candidate} role="company" />
        
      </div>
    </div>
  );
}