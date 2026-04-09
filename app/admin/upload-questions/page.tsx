"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Upload, CheckCircle, FileJson, ArrowLeft, Loader2 } from "lucide-react";

// 🔥 Naye Master Components 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

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
    <div className="min-h-screen bg-transparent p-6 md:p-12 font-sans relative z-10">
      
      <Button 
        variant="ghost" 
        onClick={() => router.push('/admin/dashboard')} 
        className="mb-8 pl-0 hover:bg-transparent"
      >
        <div className="bg-white border border-slate-200 p-2 rounded-xl shadow-sm text-slate-600 hover:text-[#0f947e] transition-colors">
          <ArrowLeft size={20} />
        </div>
        <span className="font-bold text-slate-700">Back to Owner Panel</span>
      </Button>

      <div className="flex flex-col items-center">
        <div className="text-center mb-10">
           <h1 className="text-4xl font-extrabold mb-3 text-slate-900">AI Question Bank Upload</h1>
           <p className="text-slate-500 font-medium">Select all your JSON skill files at once to populate the database.</p>
        </div>
        
        <Card className="max-w-2xl w-full text-center shadow-xl p-8 md:p-12">
          
          <div className="mb-8 text-left bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-extrabold mb-2 text-blue-700 flex items-center gap-2">
              <FileJson size={22}/> Bulk JSON Upload
            </h3>
            <p className="text-blue-900/70 text-sm leading-relaxed font-medium">
              You can select multiple files at once. Go to your <code className="text-blue-800 bg-white border border-blue-200 px-2 py-1 rounded font-bold">question_bank_data</code> folder, press <kbd className="bg-white border border-blue-200 px-2 py-1 rounded text-blue-800 font-bold shadow-sm">Ctrl + A</kbd> to select all JSON files, and click open.
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-[2rem] p-12 hover:border-[#0f947e] hover:bg-teal-50/50 transition-all relative group cursor-pointer bg-slate-50/50">
            <input 
              type="file" 
              accept=".json" 
              multiple 
              onChange={handleFileUpload} 
              disabled={loading} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            />
            <div className="flex flex-col items-center">
              {loading ? (
                <Loader2 size={56} className="text-[#0f947e] mb-6 animate-spin" />
              ) : (
                <div className="w-20 h-20 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-teal-200 transition-transform shadow-sm">
                   <Upload size={32} className="text-slate-400 group-hover:text-[#0f947e] transition-colors" />
                </div>
              )}
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                {loading ? "Processing AI Questions..." : "Select JSON Files"}
              </h2>
              <p className="text-slate-500 font-medium">
                {loading ? "Do not close this window" : "Upload up to 50 files at once"}
              </p>
            </div>
          </div>

          {stats.success && (
            <div className="mt-8 bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex items-center justify-center gap-4 text-emerald-700 animate-in fade-in slide-in-from-bottom-4 shadow-sm">
              <CheckCircle size={32} className="text-emerald-500" /> 
              <div className="text-left">
                 <p className="font-extrabold text-lg">Upload Successful!</p>
                 <p className="text-emerald-600/90 text-sm font-medium">Added {stats.totalQuestions} questions from {stats.totalFiles} files.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}