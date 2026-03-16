"use client";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Timer, CheckCircle, HelpCircle, ArrowRight, Mic, ShieldAlert, AlertTriangle, Video, Camera, Loader2, Play } from "lucide-react";
import { supabase } from "@/lib/supabase"; 

function DemoTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo'); 

  // 🔥 UPDATED: Added "I Don't Know" to all demo questions 🔥
  const demoQuestions = [
    { text: "Which is the shortcut key to copy in Excel?", options: ["Ctrl + V", "Ctrl + C", "Ctrl + X", "Ctrl + Z", "I Don't Know"], correct: 1 },
    { text: "What is the full form of GST?", options: ["Goods and Supply Tax", "Grand Service Tax", "Goods and Services Tax", "General Sales Tax", "I Don't Know"], correct: 2 },
    { text: "This is a sample question to check UI. Select Option 1.", options: ["Option 1 (Correct)", "Option 2", "Option 3", "Option 4", "I Don't Know"], correct: 0 }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(3).fill(-1));
  const [timeLeft, setTimeLeft] = useState(120);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);

  const [hasCompletedRealTest, setHasCompletedRealTest] = useState(false);

  const [mediaAllowed, setMediaAllowed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const noiseFramesRef = useRef(0);
  const movementFramesRef = useRef(0);
  const previousFrameRef = useRef<Uint8Array | null>(null);
  const [demoWarnings, setDemoWarnings] = useState(0);

  useEffect(() => {
    const checkTestStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('profiles').select('meta').eq('id', session.user.id).single();
        if (data && data.meta && data.meta.status) {
          setHasCompletedRealTest(true);
        }
      }
    };
    checkTestStatus();
  }, []);

  useEffect(() => {
    if (videoRef.current && streamRef.current && !videoRef.current.srcObject) {
       videoRef.current.srcObject = streamRef.current;
    }
  });

  const triggerWarning = useCallback(() => {
    setDemoWarnings(p => {
       if(p + 1 >= 6) {
          alert("🚨 AUTO-SUBMIT: In the real exam, your test would be Auto-Submitted right now due to Audio/Video violation!");
          submitTest();
       } else {
          alert(`⚠️ PRACTICE WARNING ${p+1}/6: You moved out of frame or made noise!`);
       }
       return p + 1;
    });
  }, []);

  const startProctoringEngine = (stream: MediaStream) => {
    try {
      streamRef.current = stream;
      if(videoRef.current) videoRef.current.srcObject = stream;

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
        if (finished) return;
        frameCount++;

        analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;

        if (average > 35) {
          noiseFramesRef.current += 1;
          if (noiseFramesRef.current > 150) { 
              noiseFramesRef.current = 0; 
              triggerWarning(); 
          }
        } else {
            noiseFramesRef.current = Math.max(0, noiseFramesRef.current - 2);
        }

        if (frameCount % 30 === 0 && videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack && (!videoTrack.enabled || videoTrack.readyState === 'ended')) triggerWarning();
            if (video.readyState >= 2) {
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                    
                    let totalBrightness = 0;
                    for(let i=0; i<currentFrame.length; i+=4) totalBrightness += currentFrame[i] + currentFrame[i+1] + currentFrame[i+2];
                    if (totalBrightness < 1000) {
                        movementFramesRef.current += 1;
                        if (movementFramesRef.current > 2) { movementFramesRef.current = 0; triggerWarning(); }
                    } else if (previousFrameRef.current) {
                        let diffCount = 0;
                        for (let i = 0; i < currentFrame.length; i += 4) {
                            const r = Math.abs(currentFrame[i] - previousFrameRef.current[i]);
                            const g = Math.abs(currentFrame[i+1] - previousFrameRef.current[i+1]);
                            const b = Math.abs(currentFrame[i+2] - previousFrameRef.current[i+2]);
                            if (r + g + b > 60) diffCount++; 
                        }
                        if ((diffCount / (currentFrame.length / 4)) * 100 > 15) { 
                            movementFramesRef.current += 1;
                            if (movementFramesRef.current > 1) { movementFramesRef.current = 0; triggerWarning(); }
                        } else movementFramesRef.current = Math.max(0, movementFramesRef.current - 1);
                    }
                    previousFrameRef.current = new Uint8Array(currentFrame);
                }
            }
        }
        animationFrameRef.current = requestAnimationFrame(checkActivity);
      };
      checkActivity();
    } catch (error) { console.error("Media failed:", error); }
  };

  const stopProctoring = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close().catch(console.error);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  useEffect(() => {
    return () => stopProctoring();
  }, []);

  const requestMediaPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setMediaAllowed(true);
      stream.getTracks().forEach(t => t.stop());
    } catch (err) {
      alert("Microphone & Camera permission is required to practice this mode.");
      setMediaAllowed(false);
    }
  };

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

  // 🔥 UPDATED: Score logic with Negative Marking 🔥
  const submitTest = () => {
    stopProctoring();
    let newScore = 0;
    demoQuestions.forEach((q, index) => {
      const selectedIndex = answers[index];
      const selectedText = selectedIndex !== -1 ? q.options[selectedIndex] : null;

      if (selectedIndex === q.correct) {
          newScore += 1; // Correct
      } else if (selectedText && selectedText !== "I Don't Know") {
          newScore -= 0.5; // Incorrect (Negative Marking)
      }
    });
    setScore(Math.max(0, newScore)); // Prevent negative total score
    setFinished(true);
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl max-w-lg w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Demo Completed!</h2>
          <p className="text-slate-400 mb-6">In the real exam, your score will be saved and sent to companies.</p>
          <div className="bg-slate-800 p-4 rounded-xl mb-8 border border-slate-700">
             <p className="text-slate-500 text-sm mb-1 uppercase font-bold tracking-wider">You Scored</p>
             <p className="text-4xl font-extrabold text-green-400">{score} <span className="text-xl text-slate-500">/ {demoQuestions.length}</span></p>
          </div>
          
          {returnTo === 'profile' ? (
             <button onClick={() => router.push('/student/profile?step=4')} className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20">
                Return to Profile Setup <ArrowRight size={18}/>
             </button>
          ) : hasCompletedRealTest ? (
             <div className="space-y-5">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-400 font-bold text-sm">
                   ✅ You have already completed your Final AI Assessment.
                </div>
                <button onClick={() => router.push('/student/dashboard')} className="w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-xl font-bold transition-all border border-slate-700 text-slate-300 hover:text-white">
                   Return to Dashboard
                </button>
             </div>
          ) : (
             <div className="space-y-4">
                <button onClick={() => router.push('/student/test')} className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 flex justify-center items-center gap-2">
                   <Play size={18}/> Start Real AI Test Now
                </button>
                <button onClick={() => router.push('/student/dashboard')} className="w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-xl font-bold transition-all border border-slate-700 text-slate-300 hover:text-white">
                   Return to Dashboard
                </button>
             </div>
          )}
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-900/80 p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="text-center mb-8">
              <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"><HelpCircle className="text-blue-400" size={32}/></div>
              <h1 className="text-3xl font-bold mb-4">Welcome to Practice Mode</h1>
              <p className="text-slate-400 text-lg">This is a <strong>Tutorial</strong> to help you understand the exam interface.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
             <div className="text-left bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <p className="flex items-center gap-3 text-sm"><CheckCircle size={18} className="text-green-500"/> <strong>Timer & Fullscreen</strong></p>
                <p className="flex items-center gap-3 text-sm"><Video size={18} className="text-red-400"/> <strong>Camera Tracking</strong></p>
                
                {/* 🔥 Negative Marking UI 🔥 */}
                <div className="bg-red-950/30 p-4 rounded-xl border border-red-900/50 mt-4">
                    <p className="text-red-400 font-bold text-xs mb-2 flex items-center gap-2 uppercase tracking-wider"><AlertTriangle size={14}/> Negative Marking</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-1">-0.5 marks for wrong answers.</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Use <strong>"I Don't Know"</strong> option to avoid penalty.</p>
                </div>
             </div>
             <div className={`p-6 rounded-2xl border flex flex-col justify-center items-center text-center transition-colors ${mediaAllowed ? 'bg-green-900/10 border-green-500/30' : 'bg-slate-950 border-slate-800'}`}>
                <Camera className={mediaAllowed ? "text-green-500 mb-4" : "text-blue-400 mb-4"} size={32} />
                <span className="text-sm font-bold text-white mb-4">Media Check</span>
                {mediaAllowed ? (
                   <span className="text-xs font-bold text-green-500 bg-green-500/20 px-4 py-2 rounded-lg">All Set & Connected!</span>
                ) : (
                   <button onClick={requestMediaPermission} className="text-xs font-bold bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">Test Camera/Mic</button>
                )}
             </div>
          </div>
          
          <button onClick={() => { 
              if(mediaAllowed) { 
                 navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
                     setStarted(true); startProctoringEngine(stream); 
                 }).catch(() => { alert("SECURITY LOCK: Please don't block permissions."); setMediaAllowed(false); });
              } else { alert("Please Test Camera & Mic first!"); } 
          }} className="mt-4 bg-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto w-full max-w-sm disabled:opacity-50 transition-all shadow-xl shadow-blue-900/20" disabled={!mediaAllowed}>
            Start Demo Test <ArrowRight size={20}/>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex flex-col items-center justify-center p-4 select-none">
       <div className="fixed bottom-6 right-6 w-32 h-24 bg-black border border-red-500/50 rounded-xl overflow-hidden shadow-2xl z-50 pointer-events-none opacity-80">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100" />
          <div className="absolute top-1 left-1 bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded uppercase animate-pulse">Demo Track</div>
       </div>
       <canvas ref={canvasRef} width="64" height="48" className="hidden" />

       <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
             <span className="text-slate-400 font-medium">Demo Question <span className="text-white font-bold">{currentQ + 1}</span></span>
             <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-1 rounded uppercase font-bold border border-green-500/20"><Mic size={12} className="inline mr-1 animate-pulse"/> Tracking</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xl font-bold text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
            <Timer size={20} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <motion.div key={currentQ} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-md">PRACTICE MODE</div>
          <h2 className="text-xl md:text-2xl font-medium mb-8 leading-relaxed max-w-2xl">{demoQuestions[currentQ].text}</h2>
          
          <div className="space-y-4">
            {/* 🔥 UPDATED: Dynamic Styling for "I Don't Know" Option 🔥 */}
            {demoQuestions[currentQ].options.map((opt, index) => {
               const isDontKnow = opt === "I Don't Know";
               return (
               <button 
                 key={index} 
                 onClick={() => { const n = [...answers]; n[currentQ] = index; setAnswers(n); }} 
                 className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group 
                    ${answers[currentQ] === index 
                        ? (isDontKnow ? "bg-slate-700 border-slate-500 shadow-lg shadow-slate-900" : "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20") 
                        : "bg-slate-950 border-slate-800 hover:bg-slate-800 hover:border-slate-600"}
                    ${isDontKnow && answers[currentQ] !== index ? "opacity-70 hover:opacity-100 italic" : ""}`}
               >
                 <span className={`font-medium ${answers[currentQ] === index ? 'text-white' : 'text-slate-300'}`}>{opt}</span>
                 {answers[currentQ] === index && <CheckCircle size={20} className="text-white" />}
               </button>
            )})}
          </div>
        </motion.div>

        <div className="flex justify-between mt-8">
           <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0} className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">Previous</button>
           {currentQ < demoQuestions.length - 1 ?
             <button onClick={() => setCurrentQ(p => p+1)} className="px-8 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20">Next Question</button> :
             <button onClick={submitTest} className="px-8 py-3 bg-green-600 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-900/20">Finish Demo</button>
           }
        </div>
      </div>
    </div>
  );
}

export default function DemoTestPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0A0F1F] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={48}/></div>}>
      <DemoTestContent />
    </Suspense>
  );
}