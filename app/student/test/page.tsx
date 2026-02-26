"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Timer, Lock, ShieldAlert, CheckCircle, Loader2, FileText, AlertTriangle, 
  MousePointer2, Monitor, Wifi, Ban, Target, Award, Mic, Camera, Video, Sparkles
} from "lucide-react";

export default function LiveTestPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [testStarted, setTestStarted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  // 🎙️📷 MEDIA STATES & REFS 
  const [mediaAllowed, setMediaAllowed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const noiseFramesRef = useRef(0);
  const movementFramesRef = useRef(0);
  const previousFrameRef = useRef<Uint8Array | null>(null);

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0); 
  
  // 🔥 BONUS ROUND STATES 🔥
  const [showBonusPopup, setShowBonusPopup] = useState(false);
  const [bonusRoundTaken, setBonusRoundTaken] = useState(false);
  const [extraQuestionsPool, setExtraQuestionsPool] = useState<any[]>([]); // Baki bache hue questions yahan save karenge
  
  // 🚨 SEPARATED WARNINGS 
  const [tabWarnings, setTabWarnings] = useState(0);
  const [micWarnings, setMicWarnings] = useState(0);
  const [camWarnings, setCamWarnings] = useState(0);

  const MAX_TAB_WARNINGS = 2;
  const MAX_MIC_WARNINGS = 4;
  const MAX_CAM_WARNINGS = 4;

  const [isTerminated, setIsTerminated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [skillAnalytics, setSkillAnalytics] = useState<any>({});

  const stopProctoring = useCallback(() => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
    }
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const terminateTest = useCallback(async (reason: string) => {
    setIsTerminated(true);
    stopProctoring(); 
    if (!user) return;
    
    await supabase.from("profiles").update({
      examAccess: "disqualified",
      meta: {
        lastAttempt: new Date(),
        totalScore: 0,
        status: `Terminated: ${reason}`,
        warnings: { tab: tabWarnings, mic: micWarnings, cam: camWarnings },
        warningsCount: tabWarnings + micWarnings + camWarnings, 
        skillScores: {} 
      }
    }).eq("id", user.id);
  }, [user, tabWarnings, micWarnings, camWarnings, stopProctoring]);

  // 🔥 CALCULATE SCORE HELPER (Bonus Round Check ke liye)
  const calculateCurrentScore = () => {
     let calcScore = 0;
     questions.forEach((q, i) => {
        const selectedOptionText = answers[i] !== -1 && answers[i] !== undefined ? q.options[answers[i]] : null;
        if (selectedOptionText === q.correct_answer) calcScore += 1;
     });
     return calcScore;
  };

  const handlePreSubmit = () => {
     if (isTerminated || isSubmitted) return;
     
     const currentScore = calculateCurrentScore();
     const percentage = (currentScore / questions.length) * 100;

     // Agar score 30% se kam hai aur bonus round nahi liya hai
     if (percentage < 30 && !bonusRoundTaken && extraQuestionsPool.length >= 5) {
         setShowBonusPopup(true);
     } else {
         submitTest();
     }
  };

  const acceptBonusRound = () => {
     // Take 5 random questions from the extra pool
     const extraQs = extraQuestionsPool.sort(() => 0.5 - Math.random()).slice(0, 5);
     
     setQuestions(prev => [...prev, ...extraQs]);
     
     // Update answers array to match new length
     const newAnswers = [...answers];
     for(let i=0; i<5; i++) newAnswers.push(-1);
     setAnswers(newAnswers);
     
     // Add 5 minutes to timer
     setTimeLeft(prev => prev + (5 * 60));
     
     setBonusRoundTaken(true);
     setShowBonusPopup(false);
     
     // Move to the first new question
     setCurrentQ(questions.length);
  };

  const rejectBonusRound = () => {
     setShowBonusPopup(false);
     submitTest();
  };

  const submitTest = useCallback(async (forceReason?: string) => {
    if (!user || isTerminated || isSubmitted) return;
    setLoading(true);
    stopProctoring(); 
    
    let calcScore = 0;
    let analyticsData: any = {};

    questions.forEach((q, i) => {
       if (!analyticsData[q.skill]) {
           analyticsData[q.skill] = { total: 0, correct: 0, beginner: 0, intermediate: 0, advanced: 0, aiLevel: "Beginner" };
       }
       analyticsData[q.skill].total += 1;

       const selectedOptionText = answers[i] !== -1 && answers[i] !== undefined ? q.options[answers[i]] : null;
       const isCorrect = selectedOptionText === q.correct_answer;

       if (isCorrect) {
           calcScore += 1;
           analyticsData[q.skill].correct += 1;
           if(q.difficulty.toLowerCase().includes('beginner')) analyticsData[q.skill].beginner += 1;
           if(q.difficulty.toLowerCase().includes('intermediate')) analyticsData[q.skill].intermediate += 1;
           if(q.difficulty.toLowerCase().includes('advanced')) analyticsData[q.skill].advanced += 1;
       }
    });

    for (const skill in analyticsData) {
        const data = analyticsData[skill];
        // Rules adjusted slightly for 5 questions
        if (data.correct < 2) data.aiLevel = "Beginner Level 🔴";
        else if (data.correct >= 4 && data.advanced >= 1) data.aiLevel = "Expert Level 🟢";
        else if (data.correct >= 2) data.aiLevel = "Intermediate Level 🟡";
        else data.aiLevel = "Beginner Level 🔴";

        await supabase.from("test_results").insert({
            student_id: user.id, skill: skill, total_score: data.correct,
            beginner_score: data.beginner, intermediate_score: data.intermediate,
            advanced_score: data.advanced, ai_skill_level: data.aiLevel
        });
    }

    setScore(calcScore);
    setSkillAnalytics(analyticsData);
    setIsSubmitted(true);

    const finalStatus = forceReason && typeof forceReason === 'string' ? forceReason : "Passed";

    await supabase.from("profiles").update({
       examAccess: "completed",
       meta: {
          lastAttempt: new Date(),
          totalScore: calcScore,
          status: finalStatus,
          warnings: { tab: tabWarnings, mic: micWarnings, cam: camWarnings },
          warningsCount: tabWarnings + micWarnings + camWarnings, 
          skillScores: analyticsData 
       }
    }).eq("id", user.id);
    setLoading(false);
  }, [user, isTerminated, isSubmitted, questions, answers, tabWarnings, micWarnings, camWarnings, stopProctoring]);

  const triggerWarning = useCallback((type: 'tab' | 'mic' | 'cam') => {
    if (isTerminated || isSubmitted) return;

    if (type === 'tab') {
        setTabWarnings(prev => {
            const next = prev + 1;
            if (next >= MAX_TAB_WARNINGS) terminateTest("Tab Switching");
            else alert(`⚠️ WARNING ${next}/${MAX_TAB_WARNINGS}: Tab Switch Detected! Disqualification at ${MAX_TAB_WARNINGS}.`);
            return next;
        });
    } else if (type === 'mic') {
        setMicWarnings(prev => {
            const next = prev + 1;
            if (next >= MAX_MIC_WARNINGS) {
                alert("🚨 Test Auto-Submitted due to Maximum Audio Warnings!");
                submitTest("Auto-Submitted: Maximum Audio Warnings Exceeded");
            } else alert(`⚠️ AUDIO WARNING ${next}/${MAX_MIC_WARNINGS}: Background Voice Detected!`);
            return next;
        });
    } else if (type === 'cam') {
        setCamWarnings(prev => {
            const next = prev + 1;
            if (next >= MAX_CAM_WARNINGS) {
                alert("🚨 Test Auto-Submitted due to Maximum Camera Warnings!");
                submitTest("Auto-Submitted: Maximum Camera Warnings Exceeded");
            } else alert(`⚠️ CAMERA WARNING ${next}/${MAX_CAM_WARNINGS}: Please face the camera and do not move out of frame!`);
            return next;
        });
    }
  }, [isTerminated, isSubmitted, terminateTest, submitTest]);

  useEffect(() => {
    if (videoRef.current && streamRef.current && !videoRef.current.srcObject) {
       videoRef.current.srcObject = streamRef.current;
    }
  });

  const startProctoringEngine = (stream: MediaStream) => {
    try {
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let frameCount = 0;

      const checkActivity = () => {
        if (isSubmitted || isTerminated) return;
        frameCount++;

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const avgVolume = sum / bufferLength;

        if (avgVolume > 35) {
          noiseFramesRef.current += 1;
          if (noiseFramesRef.current > 150) {
            noiseFramesRef.current = 0;
            triggerWarning('mic');
          }
        } else {
          noiseFramesRef.current = Math.max(0, noiseFramesRef.current - 2);
        }

        if (frameCount % 30 === 0 && videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            const videoTrack = stream.getVideoTracks()[0];
            const audioTrack = stream.getAudioTracks()[0];
            if ((videoTrack && (!videoTrack.enabled || videoTrack.readyState === 'ended')) || 
                (audioTrack && (!audioTrack.enabled || audioTrack.readyState === 'ended'))) {
                triggerWarning('cam');
            }

            if (video.readyState >= 2) {
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                    
                    let totalBrightness = 0;
                    for(let i=0; i<currentFrame.length; i+=4) totalBrightness += currentFrame[i] + currentFrame[i+1] + currentFrame[i+2];
                    
                    if (totalBrightness < 1000) {
                        movementFramesRef.current += 1;
                        if (movementFramesRef.current > 2) { movementFramesRef.current = 0; triggerWarning('cam'); }
                    } else if (previousFrameRef.current) {
                        let diffCount = 0;
                        const totalPixels = currentFrame.length / 4;
                        for (let i = 0; i < currentFrame.length; i += 4) {
                            const rDiff = Math.abs(currentFrame[i] - previousFrameRef.current[i]);
                            const gDiff = Math.abs(currentFrame[i+1] - previousFrameRef.current[i+1]);
                            const bDiff = Math.abs(currentFrame[i+2] - previousFrameRef.current[i+2]);
                            if (rDiff + gDiff + bDiff > 60) diffCount++; 
                        }
                        const diffPercentage = (diffCount / totalPixels) * 100;
                        
                        if (diffPercentage > 15) {
                            movementFramesRef.current += 1;
                            if (movementFramesRef.current > 1) { 
                                movementFramesRef.current = 0; 
                                triggerWarning('cam'); 
                            }
                        } else {
                            movementFramesRef.current = Math.max(0, movementFramesRef.current - 1);
                        }
                    }
                    previousFrameRef.current = new Uint8Array(currentFrame);
                }
            }
        }
        animationFrameRef.current = requestAnimationFrame(checkActivity);
      };
      
      checkActivity();
    } catch (error) {
      console.error("Proctoring failed:", error);
    }
  };

  const requestMediaPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setMediaAllowed(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      alert("Microphone and Camera permissions are strictly required for this proctored exam.");
      setMediaAllowed(false);
    }
  };

  useEffect(() => {
    const initTest = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/student/login"); return; }
      setUser(session.user);
      
      const { data: profileSnap } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      const currentStatus = profileSnap?.examAccess || 'none';
      if (currentStatus === 'completed' || currentStatus === 'disqualified' || currentStatus === 'pending') {
         alert("Your test is locked. Please request a re-test from your dashboard if needed.");
         router.push("/student/dashboard"); return;
      }

      const studentSkills = profileSnap?.skills || [];
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
          router.push("/student/profile"); return;
      }

      try {
        let finalQuestions: any[] = [];
        let backupQuestions: any[] = []; // Bonus round ke liye

        for (const skill of testableSkills) {
            const { data: skillQs } = await supabase.from("question_bank").select("*").eq("skill", skill);
            if (skillQs && skillQs.length > 0) {
                // 🔥 ONLY 5 QUESTIONS PER SKILL 🔥
                const beginnerQs = skillQs.filter((q: any) => q.difficulty.toLowerCase().includes('beginner')).sort(() => 0.5 - Math.random());
                const interQs = skillQs.filter((q: any) => q.difficulty.toLowerCase().includes('intermediate')).sort(() => 0.5 - Math.random());
                const advancedQs = skillQs.filter((q: any) => q.difficulty.toLowerCase().includes('advanced')).sort(() => 0.5 - Math.random());
                
                // Select 5 for main test
                const mainQs = [
                    ...beginnerQs.slice(0, 2), 
                    ...interQs.slice(0, 2), 
                    ...advancedQs.slice(0, 1)
                ];
                
                // Save remaining in backup pool
                const remainingQs = [
                    ...beginnerQs.slice(2), 
                    ...interQs.slice(2), 
                    ...advancedQs.slice(1)
                ];

                finalQuestions = [...finalQuestions, ...mainQs];
                backupQuestions = [...backupQuestions, ...remainingQs];
            }
        }

        if (finalQuestions.length > 0) {
           finalQuestions = finalQuestions.sort(() => 0.5 - Math.random());
           setQuestions(finalQuestions);
           setAnswers(new Array(finalQuestions.length).fill(-1));
           setTimeLeft(finalQuestions.length * 60); 
           setExtraQuestionsPool(backupQuestions); // Save for bonus round
        } else {
           alert("Question Bank is empty for your matched skills. Please check database.");
           router.push("/student/dashboard");
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    initTest();
    return () => stopProctoring(); 
  }, [router, stopProctoring]);

  useEffect(() => {
    if (loading || !testStarted || isSubmitted || isTerminated || showBonusPopup) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { submitTest(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, testStarted, isSubmitted, isTerminated, showBonusPopup, submitTest]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && testStarted && !isSubmitted && !isTerminated) {
      triggerWarning('tab');
    }
  }, [testStarted, isSubmitted, isTerminated, triggerWarning]);

  useEffect(() => {
    if(loading || !testStarted) return; 
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    
    const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key === "PrintScreen" || e.key === "F12" || (e.ctrlKey && e.key === "c") || (e.altKey && e.key === "Tab")) {
          e.preventDefault();
          triggerWarning('tab');
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
  }, [loading, testStarted, handleVisibilityChange, triggerWarning]);

  const handleStartTest = () => {
    if(!mediaAllowed) return alert("Please Allow Media access to start the secure test.");
    if(!agreed) return alert("Please read and agree to the Terms & Conditions.");
    
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().then(() => {
                setTestStarted(true);
                startProctoringEngine(stream); 
            }).catch(() => {
                alert("Fullscreen is required.");
                setTestStarted(true);
                startProctoringEngine(stream); 
            });
        } else {
            setTestStarted(true);
            startProctoringEngine(stream);
        }
    }).catch((err) => {
        alert("SECURITY LOCK: Camera or Microphone access was revoked. You cannot start the test.");
        setMediaAllowed(false);
    });
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
                            </ul>
                        </div>

                        <div className="bg-red-950/20 p-5 rounded-2xl border border-red-900/50">
                            <h3 className="font-bold flex items-center gap-2 mb-4 text-red-500"><ShieldAlert size={18}/> Anti-Cheat Policy</h3>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex gap-3"><Ban className="text-red-500 shrink-0" size={16}/> Do not switch tabs (Max 2 Warnings).</li>
                                <li className="flex gap-3"><Video className="text-red-500 shrink-0" size={16}/> Face & Frame Movement Tracking Active.</li>
                                <li className="flex gap-3"><Mic className="text-red-500 shrink-0" size={16}/> Background Audio Monitoring is active.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className={`p-5 rounded-2xl border flex flex-col gap-3 mb-4 transition-colors ${mediaAllowed ? 'bg-green-900/20 border-green-500/50' : 'bg-slate-950 border-slate-800'}`}>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <Camera className={mediaAllowed ? "text-green-500" : "text-blue-400"} size={20} />
                                 <span className="text-sm font-bold text-white">Camera & Mic Check</span>
                              </div>
                              {mediaAllowed ? (
                                 <span className="text-xs font-bold text-green-500 bg-green-500/20 px-3 py-1 rounded-lg flex items-center gap-1"><CheckCircle size={12}/> Granted</span>
                              ) : (
                                 <button onClick={requestMediaPermission} className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 shadow-lg transition-all">Allow Access</button>
                              )}
                           </div>
                           <p className="text-xs text-slate-400">Required to monitor test environment. Media is not recorded.</p>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 mb-6 flex-1">
                            <h3 className="font-bold flex items-center gap-2 mb-4 text-yellow-400"><AlertTriangle size={18}/> Terms & Conditions</h3>
                            <div className="text-xs text-slate-400 space-y-2 h-20 overflow-y-auto pr-2 custom-scrollbar">
                                <p>1. You agree to be monitored by our proctoring system.</p>
                                <p>2. Maximum 2 Tab switches will terminate the exam.</p>
                                <p>3. Max Media warnings will auto-submit the exam.</p>
                            </div>
                        </div>

                        <div onClick={() => setAgreed(!agreed)} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 mb-6 ${agreed ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-800 border-slate-700 hover:bg-slate-750'}`}>
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${agreed ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                                {agreed && <CheckCircle size={12} className="text-white"/>}
                            </div>
                            <p className="text-sm text-slate-300 select-none">I agree to the Terms & Conditions.</p>
                        </div>

                        <div className="flex gap-4 mt-auto">
                            <button onClick={() => router.push('/student/dashboard')} className="px-6 py-3 rounded-xl font-bold border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
                            <button 
                                onClick={handleStartTest} 
                                disabled={!agreed || !mediaAllowed || questions.length === 0}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${agreed && mediaAllowed && questions.length > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
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
           Your attempt is locked due to Tab Switching.
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
         <h1 className="text-3xl font-bold mb-2">Assessment Completed</h1>
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
                           </p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border font-bold text-sm text-center ${
                           skillAnalytics[skill].aiLevel.includes('Expert') ? 'bg-green-900/30 text-green-400 border-green-500/30' : 
                           skillAnalytics[skill].aiLevel.includes('Intermediate') ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' : 
                           'bg-red-900/30 text-red-400 border-red-500/30'
                        }`}>{skillAnalytics[skill].aiLevel}</div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
         <button onClick={() => router.push('/student/dashboard')} className="bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 mb-10">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white p-4 select-none" onContextMenu={(e)=>e.preventDefault()}>
       
       {/* 📷 LIVE CAMERA PIP BOX & HIDDEN CANVAS FOR PIXEL DIFF 📷 */}
       <div className="fixed bottom-6 right-6 w-40 h-32 md:w-56 md:h-40 bg-black border-2 border-red-500/50 rounded-2xl overflow-hidden shadow-2xl z-50 pointer-events-none">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100 opacity-80" />
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest animate-pulse flex items-center gap-1"><Video size={10}/> Proctoring Active</div>
       </div>
       <canvas ref={canvasRef} width="64" height="48" className="hidden" />

       {/* 🔥 THE BONUS ROUND POPUP 🔥 */}
       <AnimatePresence>
         {showBonusPopup && (
           <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-purple-500/50 p-8 rounded-3xl max-w-lg text-center shadow-[0_0_50px_rgba(168,85,247,0.2)]">
                 <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={40} className="text-purple-400"/>
                 </div>
                 <h2 className="text-3xl font-bold mb-4">You Can Do Better!</h2>
                 <p className="text-slate-400 text-lg mb-8">Your current score seems a bit low. We want to give you a <strong className="text-white">Second Chance</strong> to improve your profile rating before submitting.</p>
                 
                 <div className="bg-slate-950 p-4 rounded-xl mb-8 border border-slate-800">
                    <p className="text-purple-400 font-bold mb-1">🎁 Take 5 Bonus Questions</p>
                    <p className="text-xs text-slate-500">5 minutes will be added to your timer.</p>
                 </div>

                 <div className="flex gap-4">
                    <button onClick={rejectBonusRound} className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 font-bold transition-all">Submit Anyway</button>
                    <button onClick={acceptBonusRound} className="flex-[2] bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold text-white shadow-lg shadow-purple-900/30 transition-all">Accept Bonus Round</button>
                 </div>
              </motion.div>
           </div>
         )}
       </AnimatePresence>

       <div className="max-w-5xl mx-auto flex justify-between items-center bg-slate-900 border border-red-500/30 p-4 rounded-xl mb-6 shadow-lg">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 text-red-400 bg-red-900/20 px-3 py-1 rounded-lg border border-red-500/20">
                <Lock size={16}/> <span className="text-xs font-bold uppercase tracking-wider">Secure Exam</span>
             </div>
             {bonusRoundTaken && <div className="text-xs font-bold text-purple-400 bg-purple-900/20 border border-purple-500/30 px-3 py-1 rounded-lg">✨ Bonus Round Active</div>}
          </div>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
             <div className={`px-2 py-1 rounded border ${tabWarnings > 0 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>Tab: {MAX_TAB_WARNINGS - tabWarnings} Left</div>
             <div className={`px-2 py-1 rounded border ${micWarnings > 0 ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>Mic: {MAX_MIC_WARNINGS - micWarnings} Left</div>
             <div className={`px-2 py-1 rounded border ${camWarnings > 0 ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>Cam: {MAX_CAM_WARNINGS - camWarnings} Left</div>
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
               <button onClick={() => setCurrentQ(p => p+1)} className="px-8 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20">Next Question</button> :
               <button onClick={handlePreSubmit} className="px-8 py-3 bg-green-600 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-900/20">Submit Assessment</button>
             }
          </div>
       </div>
       <style jsx global>{`body { user-select: none; }`}</style>
    </div>
  );
}