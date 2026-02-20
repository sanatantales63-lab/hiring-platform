"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";
import { Upload, CheckCircle, FileText, ArrowLeft } from "lucide-react";

export default function UploadQuestions() {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, success: 0 });

  const downloadSample = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "category,difficulty,question,option1,option2,option3,option4,correctAnswerIndex\n" +
      "Tax,easy,What is GST?,Goods Tax,Service Tax,Goods & Service Tax,None,2";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_questions.csv");
    document.body.appendChild(link);
    link.click();
  };

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const questions = results.data;
        setStats({ total: questions.length, success: 0 });
        
        const insertData: any[] = [];
        
        questions.forEach((q: any) => {
          if(q.question && q.category) {
            insertData.push({
              category: q.category.trim(),
              difficulty: q.difficulty?.trim().toLowerCase() || 'medium',
              text: q.question,
              options: [q.option1, q.option2, q.option3, q.option4],
              correct: parseInt(q.correctAnswerIndex)
            });
          }
        });

        try {
          const { error } = await supabase.from('question_bank').insert(insertData);
          if (error) throw error;
          
          setStats({ total: questions.length, success: insertData.length });
          alert(`Successfully uploaded ${insertData.length} questions!`);
        } catch (error) {
          console.error("Error uploading:", error);
          alert("Upload failed! Check console.");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white p-12">
      <button onClick={() => router.push('/admin/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group">
        <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-slate-700 transition-colors">
          <ArrowLeft size={20} />
        </div>
        <span className="font-medium">Back to Owner Panel</span>
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8">Bulk Question Upload</h1>
        
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-2xl w-full text-center">
          <div className="mb-8 text-left bg-slate-800/50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
              <FileText size={20}/> Step 1: Prepare CSV
            </h3>
            <p className="text-slate-400 mb-4">
              Columns: <code className="text-yellow-400">category, difficulty, question, option1...</code>
            </p>
            <button onClick={downloadSample} className="text-sm bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
              Download Sample CSV
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-600 rounded-xl p-10 hover:border-blue-500 transition-colors relative">
            <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
            <div className="flex flex-col items-center">
              {loading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              ) : (
                <Upload size={48} className="text-slate-500 mb-4" />
              )}
              <p className="text-lg font-medium">{loading ? "Uploading..." : "Drag & Drop or Click to Upload CSV"}</p>
            </div>
          </div>

          {stats.success > 0 && (
            <div className="mt-8 bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center justify-center gap-3 text-green-400">
              <CheckCircle /> Uploaded {stats.success} out of {stats.total} questions!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}