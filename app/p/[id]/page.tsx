"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CandidateProfileView from "@/app/components/CandidateProfileView";
import { Loader2, AlertCircle } from "lucide-react";

export default function PublicProfilePage() {
  const params = useParams();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      // URL se ID nikal kar database mein search karenge
      if (!params?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error || !data) {
          setError(true);
        } else {
          setCandidate(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [params]);

  // Jab tak data aa raha hai, loader dikhayenge
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[var(--primary)] mb-4" size={48} />
        <p className="text-[var(--muted-foreground)] font-bold text-lg">Loading Profile...</p>
      </div>
    );
  }

  // Agar ID galat hui ya profile exist nahi karti
  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="text-[var(--destructive)] mb-6" size={64} />
        <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-3">Profile Not Found</h1>
        <p className="text-[var(--muted-foreground)] text-lg">This profile link is invalid, expired, or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans">
      
      {/* 🚀 PUBLIC HEADER - Resourcemania Branding 🚀 */}
      <header className="bg-[var(--card)]/90 backdrop-blur-md border-b border-[var(--border)] py-4 px-6 md:px-12 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <h1 className="font-display text-2xl font-black text-[var(--foreground)] tracking-tight">
          Resource<span className="text-[var(--primary)]">mania</span>
        </h1>
        <div className="text-xs font-bold bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1.5 rounded-lg border border-[var(--primary)]/20 uppercase tracking-widest shadow-sm">
          Verified Candidate
        </div>
      </header>

      {/* 🚀 PROFILE CONTENT 🚀 */}
      <main className="p-4 md:p-12 max-w-5xl mx-auto mt-4">
        
        {/* Role 'company' rakha hai taaki Email, Phone, aur PAN number automatically hide ho jayein */}
        <CandidateProfileView candidate={candidate} role="company" />
        
      </main>

    </div>
  );
}