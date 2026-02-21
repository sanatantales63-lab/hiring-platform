"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion } from "framer-motion";
import { 
  Timer, Lock, ShieldAlert, CheckCircle, Loader2, FileText, AlertTriangle, 
  MousePointer2, Monitor, Wifi, Ban, Target, Award
} from "lucide-react";

export default function LiveTestPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [testStarted, setTestStarted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0); 
  const [warnings, setWarnings] = useState(0);
  const [isTerminated, setIsTerminated] = useState(false);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [skillAnalytics, setSkillAnalytics] = useState<any>({});
  
  const MAX_WARNINGS = 3;

  const terminateTest = useCallback(async () => {
    setIsTerminated(true);
    if (!user) return;
    
    await supabase.from("profiles").update({
      examAccess: "disqualified",
      meta: {
        lastAttempt: new Date(),
        totalScore: 0,
        status: "Terminated for Cheating",
        warningsCount: MAX_WARNINGS,
        skillScores: {} 
      }
    }).eq("id", user.id);
  }, [user, MAX_WARNINGS]);

  const triggerWarning = useCallback((reason: string) => {
    setWarnings(prev => {
      const newCount = prev + 1;
      if (newCount >= MAX_WARNINGS) {
        terminateTest();
        return MAX_WARNINGS;
      }
      alert(`⚠️ WARNING ${newCount}/${MAX_WARNINGS}: ${reason}\nDo not switch tabs or minimize window.`);
      return newCount;
    });
  }, [MAX_WARNINGS, terminateTest]);

  useEffect(() => {
    const initTest = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/student/login");
        return;
      }
      setUser(session.user);
      
      const { data: profileSnap } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      
      // THE ENTRY GATEKEEPER
      const currentStatus = profileSnap?.examAccess || 'none';
      if (currentStatus === 'completed' || currentStatus === 'disqualified' || currentStatus === 'pending') {
         alert("Your test is locked. Please request a re-test from your dashboard if needed.");
         router.push("/student/dashboard");
         return;
      }

      const studentSkills = profileSnap?.skills || [];

      // THE SMART SKILL MAPPER
      const mappedSkills = new Set<string>();
      const combinedSkills = studentSkills.join(" ").toLowerCase();

      if (combinedSkills.includes("tally")) mappedSkills.add("Tally ERP");
      if (combinedSkills.includes("excel")) mappedSkills.add("Advanced Excel");
      if (combinedSkills.includes("sap")) mappedSkills.add("SAP FICO");
      if (combinedSkills.includes("gst")) mappedSkills.add("GST Return Filing & Reconciliation");
      if (combinedSkills.includes("journal") || combinedSkills.includes("book closure") || combinedSkills.includes("accounting")) mappedSkills.add("Journal Entry & Book Closure");
      if (combinedSkills.includes("tds")) mappedSkills.add("TDS Return & Compliance");
      if (combinedSkills.includes("income tax") || combinedSkills.includes("itr") || combinedSkills.includes("taxation")) mappedSkills.add("Income Tax Return (ITR) Processing");
      if (combinedSkills.includes("corporate tax")) mappedSkills.add("Corporate Tax Planning");
      if (combinedSkills.includes("ind-as") || combinedSkills.includes("financial statement")) mappedSkills.add("Financial Statements & Ind-AS");
      if (combinedSkills.includes("gaap") || combinedSkills.includes("accounting standard")) mappedSkills.add("Accounting Standards");
      if (combinedSkills.includes("payroll")) mappedSkills.add("Payroll Processing & Compliance");
      if (combinedSkills.includes("audit")) mappedSkills.add("Statutory Audit & Assurance");

      const testableSkills = Array.from(mappedSkills);

      if (testableSkills.length === 0) {
          alert("Test engine couldn't match your skills! Please add core skills like 'Tally', 'Excel', 'SAP', or 'GST' to your profile.");
          router.push("/student/profile");
          return;
      }

      try {
        let finalQuestions: any[] = [];
        
        for (const skill of testableSkills) {
            const { data: skillQs } = await supabase.from("question_bank").select("*").eq("skill", skill);
            
            if (skillQs && skillQs.length > 0) {
                const beginnerQs = skillQs.filter((q: any) => q.difficulty.toLowerCase().includes('beginner')).sort(() => 0.5 - Math.random()).slice(0, 3);
                const interQs = skillQs.filter((q: any) => q.difficulty.toLowerCase().includes('intermediate')).sort(() => 0.5 - Math.random()).slice(0, 4);
                const advancedQs = skillQs.filter((q: any) => q.difficulty.toLowerCase().includes('advanced')).sort(() => 0.5 - Math.random()).slice(0, 3);
                
                finalQuestions = [...finalQuestions, ...beginnerQs, ...interQs, ...advancedQs];
            }
        }

        if (finalQuestions.length > 0) {
           finalQuestions = finalQuestions.sort(() => 0.5 - Math.random());
           setQuestions(finalQuestions);
           setAnswers(new Array(finalQuestions.length).fill(-1));
           setTimeLeft(finalQuestions.length * 60); 
        } else {
           alert("Question Bank is empty for your matched skills. Please check database.");
           router.push("/student/dashboard");
        }

      } catch (e) { 
        console.error("Error fetching questions:", e); 
      }
      
      setLoading(false);
    };
    initTest();
  }, [router]);

  const submitTest = useCallback(async () => {
    if (!user || isTerminated) return;
    setLoading(true);
    
    let calcScore = 0;
    let analyticsData: any = {};

    questions.forEach((q, i) => {
       if (!analyticsData[q.skill]) {
           analyticsData[q.skill] = { total: 0, correct: 0, beginner: 0, intermediate: 0, advanced: 0, aiLevel: "Beginner" };
       }
       analyticsData[q.skill].total += 1;

       const selectedOptionText = answers[i] !== -1 ? q.options[answers[i]] : null;
       const isCorrect = selectedOptionText === q.correct_answer;

       if (isCorrect) {
           calcScore += 1;
           analyticsData[q.skill].correct += 1;
           
           if(q.difficulty.toLowerCase().includes('beginner')) analyticsData[q.skill].beginner += 1;
           if(q.difficulty.toLowerCase().includes('intermediate')) analyticsData[q.skill].intermediate += 1;
           if(q.difficulty.toLowerCase().includes('advanced')) analyticsData[q.skill].advanced += 1;
       }
    });

    // 🧠 THE NEW, STRICT AI GRADING LOGIC 🧠
    for (const skill in analyticsData) {
        const data = analyticsData[skill];
        
        // Fail-Safe: Agar 40% (4/10) se kam score hai, toh tukka maara hai, seedha Beginner.
        if (data.correct < 4) {
            data.aiLevel = "Beginner Level 🔴";
        } 
        // Expert: Score kam se kam 70% hona chahiye, aur Hard wale kam se kam 2 theek hone chahiye.
        else if (data.correct >= 7 && data.advanced >= 2) {
            data.aiLevel = "Expert Level 🟢";
        } 
        // Intermediate: Score kam se kam 40% hona chahiye, aur thode medium/hard theek hone chahiye.
        else if (data.correct >= 4 && (data.intermediate >= 2 || data.advanced >= 1)) {
            data.aiLevel = "Intermediate Level 🟡";
        } 
        // Baaki sab Beginner
        else {
            data.aiLevel = "Beginner Level 🔴";
        }

        // Push detailed result to test_results table
        await supabase.from("test_results").insert({
            student_id: user.id,
            skill: skill,
            total_score: data.correct,
            beginner_score: data.beginner,
            intermediate_score: data.intermediate,
            advanced_score: data.advanced,
            ai_skill_level: data.aiLevel
        });
    }

    setScore(calcScore);
    setSkillAnalytics(analyticsData);
    setIsSubmitted(true);

    await supabase.from("profiles").update({
       examAccess: "completed",
       meta: {
          lastAttempt: new Date(),
          totalScore: calcScore,
          status: "Passed",
          warningsCount: warnings,
          skillScores: analyticsData 
       }
    }).eq("id", user.id);

    setLoading(false);
  }, [user, isTerminated, questions, answers, warnings]);

  useEffect(() => {
    if (loading || !testStarted || isSubmitted || isTerminated) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { submitTest(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, testStarted, isSubmitted, isTerminated, submitTest]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && testStarted && !isSubmitted && !isTerminated) {
      triggerWarning("You switched tabs/windows!");
    }
  }, [testStarted, isSubmitted, isTerminated, triggerWarning]);

  useEffect(() => {
    if(loading || !testStarted) return; 

    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    
    const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key === "PrintScreen" || e.key === "F12" || (e.ctrlKey && e.key === "c") || (e.altKey && e.key === "Tab")) {
          e.preventDefault();
          alert("Screenshots and Tab Switching are disabled!");
          document.body.style.filter = "blur(20px)";
          setTimeout(() => document.body.style.filter = "none", 3000);
       }
    };
    window.addEventListener("keydown", handleKeyDown);
    const preventSelect = (e: Event) => e.preventDefault();
    document.addEventListener("selectstart", preventSelect);

    return () => {
       document.removeEventListener("visibilitychange", handleVisibilityChange);
       document.removeEventListener("contextmenu", (e) => e.preventDefault());
       window.removeEventListener("keydown", handleKeyDown);
       document.removeEventListener("selectstart", preventSelect);
    };
  }, [loading, testStarted, handleVisibilityChange]);

  const handleStartTest = () => {
    if(!agreed) {
        alert("Please read and agree to the Terms & Conditions.");
        return;
    }
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().then(() => {
            setTestStarted(true);
        }).catch((err) => {
            alert("Fullscreen is required. Please allow fullscreen permission.");
            setTestStarted(true);
        });
    } else {
        setTestStarted(true);
    }
  };

  if (loading) return <div className="h-screen bg-[#0A0F1F] flex items-center justify-center text-white"><Loader2 className="animate-spin text-blue-500"/> Loading Secure Environment...</div>;

  if (!testStarted && !isSubmitted && !isTerminated) {
    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 font-sans">
            <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 border-b border-slate-800">
                    <h1 className="text-3xl font-bold mb-2">Talexo Skill Assessment</h1>
                    <p className="text-slate-400">Please read the instructions carefully before starting.</p>
                </div>
                
                <div className="p-8 grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                            <h3 className="font-bold flex items-center gap-2 mb-4 text-blue-400"><FileText size={18}/> Exam Details</h3>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex justify-between border-b border-slate-800 pb-2"><span>Total Questions</span> <span className="text-white font-bold">{questions.length} Qs</span></li>
                                <li className="flex justify-between border-b border-slate-800 pb-2"><span>Duration</span> <span className="text-white font-bold">{questions.length} Mins</span></li>
                                <li className="flex justify-between border-b border-slate-800 pb-2"><span>Format</span> <span className="text-white font-bold">Adaptive MCQ</span></li>
                                <li className="flex justify-between"><span>Negative Marking</span> <span className="text-white font-bold">No</span></li>
                            </ul>
                        </div>

                        <div className="bg-red-950/20 p-5 rounded-2xl border border-red-900/50">
                            <h3 className="font-bold flex items-center gap-2 mb-4 text-red-500"><ShieldAlert size={18}/> Anti-Cheat Policy</h3>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex gap-3"><Ban className="text-red-500 shrink-0" size={16}/> Do not switch tabs or minimize window.</li>
                                <li className="flex gap-3"><Ban className="text-red-500 shrink-0" size={16}/> Copy-paste and right-click are disabled.</li>
                                <li className="flex gap-3"><Ban className="text-red-500 shrink-0" size={16}/> 3 Warnings = Immediate Disqualification.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 mb-6 flex-1">
                            <h3 className="font-bold flex items-center gap-2 mb-4 text-yellow-400"><AlertTriangle size={18}/> Terms & Conditions</h3>
                            <div className="text-xs text-slate-400 space-y-2 h-40 overflow-y-auto pr-2 custom-scrollbar">
                                <p>1. By starting this test, you agree to be monitored by our proctoring system.</p>
                                <p>2. The score generated is final and cannot be challenged.</p>
                                <p>3. Malpractice will lead to a permanent ban from the Talexo platform.</p>
                                <p>4. You only have ONE attempt. Re-test requires strict Admin approval.</p>
                                <p>5. Ensure you have a stable internet connection before starting.</p>
                            </div>
                        </div>

                        <div 
                           onClick={() => setAgreed(!agreed)}
                           className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 mb-6 ${agreed ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-800 border-slate-700 hover:bg-slate-750'}`}
                        >
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${agreed ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                                {agreed && <CheckCircle size={12} className="text-white"/>}
                            </div>
                            <p className="text-sm text-slate-300 select-none">I have read the rules and agree to the Terms & Conditions.</p>
                        </div>

                        <div className="flex gap-4 mt-auto">
                            <button onClick={() => router.push('/student/dashboard')} className="px-6 py-3 rounded-xl font-bold border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">Cancel</button>
                            <button 
                                onClick={handleStartTest} 
                                disabled={!agreed || questions.length === 0}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${agreed && questions.length > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                            >
                                <MousePointer2 size={18}/> Start Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (isTerminated) {
    return (
      <div className="min-h-screen bg-red-950 text-white flex flex-col items-center justify-center p-6 text-center">
         <ShieldAlert size={80} className="text-red-500 mb-6 animate-pulse"/>
         <h1 className="text-5xl font-bold mb-4">Test Terminated</h1>
         <p className="text-red-200 text-xl mb-8 max-w-lg">
           Violation of Anti-Cheat Rules Detected.<br/>
           System recorded multiple suspicious activities. Your attempt is locked.
         </p>
         <button onClick={() => router.push('/student/dashboard')} className="bg-white text-red-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
            Return to Dashboard
         </button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0A0F1F] text-white flex flex-col items-center justify-center p-6 text-center py-12">
         <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 mt-10">
            <CheckCircle size={40} className="text-green-500"/>
         </div>
         <h1 className="text-3xl font-bold mb-2">Assessment Submitted</h1>
         <p className="text-slate-400 text-sm mb-8">Your response and AI skill analytics have been securely recorded.</p>
         
         <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-2xl mb-8 shadow-2xl">
            <p className="text-slate-500 text-sm uppercase font-bold mb-2">Final Overall Score</p>
            <p className="text-6xl font-bold text-green-400 mb-6">{score} <span className="text-2xl text-slate-500">/ {questions.length}</span></p>

            <div className="border-t border-slate-800 pt-6 text-left">
               <h4 className="text-slate-400 text-sm font-bold uppercase mb-4 flex items-center gap-2"><Award size={18}/> AI Skill Grading Report</h4>
               <div className="space-y-4">
                  {Object.keys(skillAnalytics).map(skill => (
                     <div key={skill} className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                           <span className="text-white font-bold text-lg">{skill}</span>
                           <p className="text-xs text-slate-500 mt-1">
                              Correct: {skillAnalytics[skill].correct}/{skillAnalytics[skill].total} 
                              (Hard: {skillAnalytics[skill].advanced}, Med: {skillAnalytics[skill].intermediate}, Easy: {skillAnalytics[skill].beginner})
                           </p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border font-bold text-sm text-center ${
                           skillAnalytics[skill].aiLevel.includes('Expert') ? 'bg-green-900/30 text-green-400 border-green-500/30' : 
                           skillAnalytics[skill].aiLevel.includes('Intermediate') ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' : 
                           'bg-red-900/30 text-red-400 border-red-500/30'
                        }`}>
                           {skillAnalytics[skill].aiLevel}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <button onClick={() => router.push('/student/dashboard')} className="bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 mb-10">
            Back to Dashboard
         </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white p-4 select-none" onContextMenu={(e)=>e.preventDefault()}>
       <div className="max-w-5xl mx-auto flex justify-between items-center bg-slate-900 border border-red-500/30 p-4 rounded-xl mb-6 shadow-lg">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 text-red-400 bg-red-900/20 px-3 py-1 rounded-lg border border-red-500/20">
                <Lock size={16}/> <span className="text-xs font-bold uppercase tracking-wider">Proctoring Active</span>
             </div>
             <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 border-l border-slate-700 pl-4 ml-2">
                 <span className="flex items-center gap-1"><Monitor size={14}/> Fullscreen</span>
                 <span className="flex items-center gap-1"><Wifi size={14}/> Network Monitor</span>
             </div>
          </div>
          <div className="text-sm text-slate-300 font-mono bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
             Warnings Left: <span className={`${warnings > 0 ? 'text-red-500 font-bold' : 'text-green-500'}`}>{MAX_WARNINGS - warnings}</span>
          </div>
       </div>

       <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
             <span className="text-slate-400 font-medium">Question <span className="text-white font-bold">{currentQ + 1}</span> / {questions.length}</span>
             <div className="flex items-center gap-2 font-mono text-xl font-bold text-blue-400 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20">
                <Timer size={20} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
          </div>

          {questions.length > 0 && (
             <motion.div key={currentQ} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-slate-900 border border-slate-800 p-6 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                   <h2 className="text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">{questions[currentQ].question}</h2>
                   <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${questions[currentQ].difficulty.toLowerCase().includes('advanced') ? 'bg-red-500/10 text-red-400 border-red-500/20' : questions[currentQ].difficulty.toLowerCase().includes('intermediate') ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                          {questions[currentQ].difficulty.split(' ')[0]}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-full font-bold uppercase text-right max-w-[120px] truncate">{questions[currentQ].skill}</span>
                   </div>
                </div>
                
                <div className="space-y-4">
                   {questions[currentQ].options.map((opt: string, index: number) => (
                      <button 
                        key={index} 
                        onClick={() => { const n = [...answers]; n[currentQ] = index; setAnswers(n); }} 
                        className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group ${answers[currentQ] === index ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20" : "bg-slate-950 border-slate-800 hover:bg-slate-800 hover:border-slate-600"}`}
                      >
                         <span className={`font-medium ${answers[currentQ] === index ? 'text-white' : 'text-slate-300'}`}>{opt}</span>
                         {answers[currentQ] === index && <CheckCircle size={20} className="text-white" />}
                      </button>
                   ))}
                </div>
             </motion.div>
          )}

          <div className="flex justify-between mt-8 pb-10">
             <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0} className="px-6 py-3 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
             {currentQ < questions.length - 1 ?
               <button onClick={() => setCurrentQ(p => p+1)} className="px-8 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">Next Question</button> :
               <button onClick={submitTest} className="px-8 py-3 bg-green-600 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-900/20">Submit Assessment</button>
             }
          </div>
       </div>

       <style jsx global>{`body { user-select: none; }`}</style>
    </div>
  );
}