"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Upload, CheckCircle, FileJson, ArrowLeft, Loader2 } from "lucide-react";

export default function UploadQuestions() {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalFiles: 0, totalQuestions: 0, success: false });

  const handleFileUpload = async (e: any) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setLoading(true);
    let allQuestions: any[] = [];

    try {
      // 1. Read all selected JSON files
      for (const file of files) {
        const text = await (file as File).text();
        const parsedData = JSON.parse(text);
        allQuestions = [...allQuestions, ...parsedData];
      }

      // 2. Format data exactly as our new Supabase Table expects
      const insertData = allQuestions.map((q: any) => ({
        skill: q.skill.trim(),
        difficulty: q.difficulty.trim(),
        question: q.question.trim(),
        options: q.options, // JSONB array
        correct_answer: q.correctAnswer.trim(),
        explanation: q.explanation.trim()
      }));

      // 3. Push to Supabase in bulk
      const { error } = await supabase.from('question_bank').insert(insertData);
      if (error) throw error;
      
      setStats({ totalFiles: files.length, totalQuestions: insertData.length, success: true });
      alert(`🚀 Successfully uploaded ${insertData.length} questions from ${files.length} files!`);
      
    } catch (error: any) {
      console.error("Error uploading:", error);
      alert("🛑 Upload failed! Please check if your JSON files are formatted correctly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white p-12 font-sans">
      <button onClick={() => router.push('/admin/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group">
        <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-slate-700 transition-colors">
          <ArrowLeft size={20} />
        </div>
        <span className="font-medium">Back to Owner Panel</span>
      </button>

      <div className="flex flex-col items-center">
        <div className="text-center mb-10">
           <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">AI Question Bank Upload</h1>
           <p className="text-slate-400">Select all your JSON skill files at once to populate the database.</p>
        </div>
        
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl max-w-2xl w-full text-center shadow-2xl">
          <div className="mb-8 text-left bg-blue-950/30 border border-blue-900/50 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-2 text-blue-400 flex items-center gap-2">
              <FileJson size={22}/> Bulk JSON Upload
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              You can select multiple files at once. Go to your <code className="text-yellow-400 bg-slate-800 px-2 py-1 rounded">question_bank_data</code> folder, press <kbd className="bg-slate-800 px-2 py-1 rounded text-white">Ctrl + A</kbd> to select all JSON files, and click open.
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-12 hover:border-blue-500 hover:bg-slate-800/50 transition-all relative group cursor-pointer">
            <input type="file" accept=".json" multiple onChange={handleFileUpload} disabled={loading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"/>
            <div className="flex flex-col items-center">
              {loading ? (
                <Loader2 size={56} className="text-blue-500 mb-6 animate-spin" />
              ) : (
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Upload size={32} className="text-blue-400" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-white mb-2">{loading ? "Processing AI Questions..." : "Select JSON Files"}</h2>
              <p className="text-slate-500">{loading ? "Do not close this window" : "Upload up to 50 files at once"}</p>
            </div>
          </div>

          {stats.success && (
            <div className="mt-8 bg-green-500/10 border border-green-500/30 p-6 rounded-2xl flex items-center justify-center gap-4 text-green-400 animate-in fade-in slide-in-from-bottom-4">
              <CheckCircle size={28} /> 
              <div className="text-left">
                 <p className="font-bold text-lg">Upload Successful!</p>
                 <p className="text-green-400/80 text-sm">Added {stats.totalQuestions} questions from {stats.totalFiles} files.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}