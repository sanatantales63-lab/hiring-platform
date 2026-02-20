"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Timer, CheckCircle, HelpCircle, ArrowRight } from "lucide-react";

export default function DemoTestPage() {
  const router = useRouter();
  
  // Hardcoded Demo Questions (DB ki zaroorat nahi)
  const demoQuestions = [
    {
      text: "Which is the shortcut key to copy in Excel?",
      options: ["Ctrl + V", "Ctrl + C", "Ctrl + X", "Ctrl + Z"],
      correct: 1, // Index 1 = Ctrl + C
    },
    {
      text: "What is the full form of GST?",
      options: ["Goods and Supply Tax", "Grand Service Tax", "Goods and Services Tax", "General Sales Tax"],
      correct: 2,
    },
    {
      text: "This is a sample question to check UI. Select Option 1.",
      options: ["Option 1 (Correct)", "Option 2", "Option 3", "Option 4"],
      correct: 0,
    }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(3).fill(-1));
  const [timeLeft, setTimeLeft] = useState(120); // 2 Minutes for Demo
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);

  // Timer Logic
  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { submitTest(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  const submitTest = () => {
    let newScore = 0;
    demoQuestions.forEach((q, index) => {
      if (answers[index] === q.correct) newScore += 1; 
    });
    setScore(newScore);
    setFinished(true);
  };

  // --- RESULT SCREEN (DEMO) ---
  if (finished) {
    return (
      <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl max-w-lg w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Demo Completed!</h2>
          <p className="text-slate-400 mb-6">
            Great! Now you know how the test works. <br/>
            In the real exam, your score will be saved and sent to companies.
          </p>
          <div className="bg-slate-800 p-4 rounded-xl mb-8">
             <p className="text-slate-500 text-sm">You Scored</p>
             <p className="text-2xl font-bold text-white">{score} / {demoQuestions.length}</p>
          </div>
          <button onClick={() => router.push('/student/dashboard')} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold transition-all">
            Go to Dashboard & Start Real Test
          </button>
        </div>
      </div>
    );
  }

  // --- INTRO SCREEN (TUTORIAL) ---
  if (!started) {
    return (
      <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center bg-slate-900/50 p-10 rounded-3xl border border-slate-800">
          <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
             <HelpCircle className="text-blue-400" size={32}/>
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Practice Mode</h1>
          <p className="text-slate-400 mb-8 text-lg">
            This is a <strong>Tutorial</strong> to help you understand the exam interface.
          </p>
          
          <div className="text-left bg-slate-800 p-6 rounded-xl mb-8 space-y-3">
             <p className="flex items-center gap-3"><CheckCircle size={18} className="text-green-500"/> <strong>Timer:</strong> Keep an eye on the top-right corner.</p>
             <p className="flex items-center gap-3"><CheckCircle size={18} className="text-green-500"/> <strong>Fullscreen:</strong> Do not switch tabs in real exam.</p>
             <p className="flex items-center gap-3"><CheckCircle size={18} className="text-green-500"/> <strong>Submission:</strong> Click 'Submit' when done.</p>
          </div>

          <button onClick={() => setStarted(true)} className="bg-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
            Start Demo Test <ArrowRight size={20}/>
          </button>
        </div>
      </div>
    );
  }

  // --- TEST INTERFACE (SAME AS REAL) ---
  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex flex-col items-center justify-center p-4 select-none">
       <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          <span className="text-slate-400 font-medium">Demo Question {currentQ + 1} / {demoQuestions.length}</span>
          <div className="flex items-center gap-2 font-mono text-xl font-bold text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg">
            <Timer size={20} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Question Card */}
        <motion.div key={currentQ} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-slate-900 border border-slate-700 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">PRACTICE MODE</div>
          
          <h2 className="text-2xl font-semibold mb-8 leading-relaxed">{demoQuestions[currentQ].text}</h2>
          
          <div className="space-y-4">
            {demoQuestions[currentQ].options.map((opt, index) => (
              <button 
                key={index} 
                onClick={() => { const n = [...answers]; n[currentQ] = index; setAnswers(n); }} 
                className={`w-full text-left p-5 rounded-xl border transition-all flex items-center justify-between group
                  ${answers[currentQ] === index 
                    ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20" 
                    : "bg-slate-800 border-slate-700 hover:bg-slate-750 hover:border-slate-500"}`}
              >
                <span className="font-medium">{opt}</span>
                {answers[currentQ] === index && <CheckCircle size={20} className="text-white" />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
           <button 
             onClick={() => setCurrentQ(p => Math.max(0, p - 1))} 
             disabled={currentQ === 0}
             className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
           >
             Previous
           </button>

           {currentQ < demoQuestions.length - 1 ? 
             <button onClick={() => setCurrentQ(p => p+1)} className="px-8 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
               Next Question
             </button> :
             <button onClick={submitTest} className="px-8 py-3 bg-green-600 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20">
               Finish Demo
             </button>
           }
        </div>
      </div>
    </div>
  );
}