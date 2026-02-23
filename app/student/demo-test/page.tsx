"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Timer, CheckCircle, HelpCircle, ArrowRight, Mic, ShieldAlert, AlertTriangle, Video, Camera } from "lucide-react";

export default function DemoTestPage() {
  const router = useRouter();

  const demoQuestions = [
    { text: "Which is the shortcut key to copy in Excel?", options: ["Ctrl + V", "Ctrl + C", "Ctrl + X", "Ctrl + Z"], correct: 1 },
    { text: "What is the full form of GST?", options: ["Goods and Supply Tax", "Grand Service Tax", "Goods and Services Tax", "General Sales Tax"], correct: 2 },
    { text: "This is a sample question to check UI. Select Option 1.", options: ["Option 1 (Correct)", "Option 2", "Option 3", "Option 4"], correct: 0 }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(3).fill(-1));
  const [timeLeft, setTimeLeft] = useState(120);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);

  // 🎙️📷 MEDIA STATES
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

  // Ensures stream is bound to video tag
  useEffect(() => {
    if (videoRef.current && streamRef.current && !videoRef.current.srcObject) {
       videoRef.current.srcObject = streamRef.current;
    }
  });

  const triggerWarning = useCallback(() => {
    setDemoWarnings(p => {
       if(p + 1 >= 4) {
          alert("🚨 AUTO-SUBMIT: In the real exam, your test would be Auto-Submitted right now due to Audio/Video violation!");
          submitTest();
       } else {
          alert(`⚠️ PRACTICE WARNING ${p+1}/4: You moved out of frame or made noise!`);
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

        // Audio
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        if (sum / bufferLength > 35) {
          noiseFramesRef.current += 1;
          if (noiseFramesRef.current > 150) { noiseFramesRef.current = 0; triggerWarning(); }
        } else noiseFramesRef.current = Math.max(0, noiseFramesRef.current - 2);

        // 🔥 HIGH SENSITIVITY VIDEO PIXEL DIFF CHECK 🔥
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
                            // Sensitivity increased
                            const r = Math.abs(currentFrame[i] - previousFrameRef.current[i]);
                            const g = Math.abs(currentFrame[i+1] - previousFrameRef.current[i+1]);
                            const b = Math.abs(currentFrame[i+2] - previousFrameRef.current[i+2]);
                            if (r + g + b > 60) diffCount++; 
                        }
                        // Triggers if just 15% of the frame changes
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

  const submitTest = () => {
    stopProctoring();
    let newScore = 0;
    demoQuestions.forEach((q, index) => {
      if (answers[index] === q.correct) newScore += 1; 
    });
    setScore(newScore);
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
          <div className="bg-slate-800 p-4 rounded-xl mb-8">
             <p className="text-slate-500 text-sm">You Scored</p>
             <p className="text-2xl font-bold text-white">{score} / {demoQuestions.length}</p>
          </div>
          <button onClick={() => router.push('/student/dashboard')} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold transition-all">Go to Dashboard & Start Real Test</button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-[#0A0F1F] text-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-900/50 p-10 rounded-3xl border border-slate-800">
          <div className="text-center mb-8">
              <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"><HelpCircle className="text-blue-400" size={32}/></div>
              <h1 className="text-3xl font-bold mb-4">Welcome to Practice Mode</h1>
              <p className="text-slate-400 text-lg">This is a <strong>Tutorial</strong> to help you understand the exam interface.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
             <div className="text-left bg-slate-800 p-6 rounded-xl space-y-3">
                <p className="flex items-center gap-3"><CheckCircle size={18} className="text-green-500"/> <strong>Timer & Fullscreen</strong></p>
                <p className="flex items-center gap-3"><Video size={18} className="text-red-400"/> <strong>Camera Tracking</strong></p>
             </div>
             <div className={`p-6 rounded-xl border flex flex-col justify-center items-center text-center transition-colors ${mediaAllowed ? 'bg-green-900/20 border-green-500/50' : 'bg-slate-800 border-slate-700'}`}>
                <Camera className={mediaAllowed ? "text-green-500 mb-2" : "text-blue-400 mb-2"} size={28} />
                <span className="text-sm font-bold text-white mb-2">Media Check</span>
                {mediaAllowed ? (
                   <span className="text-xs font-bold text-green-500 bg-green-500/20 px-3 py-1 rounded-lg">All Set!</span>
                ) : (
                   <button onClick={requestMediaPermission} className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">Test Camera/Mic</button>
                )}
             </div>
          </div>
          <button onClick={() => { 
              if(mediaAllowed) { 
                 navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
                     setStarted(true); startProctoringEngine(stream); 
                 }).catch(() => { alert("SECURITY LOCK: Please don't block permissions."); setMediaAllowed(false); });
              } else { alert("Test camera first!"); } 
          }} className="bg-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto w-full max-w-sm disabled:opacity-50" disabled={!mediaAllowed}>
            Start Demo Test <ArrowRight size={20}/>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white flex flex-col items-center justify-center p-4 select-none">
       
       {/* 📷 DEMO CAMERA PIP + CANVAS 📷 */}
       <div className="fixed bottom-6 right-6 w-32 h-24 bg-black border border-red-500/50 rounded-xl overflow-hidden shadow-2xl z-50 pointer-events-none opacity-80">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100" />
          <div className="absolute top-1 left-1 bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded uppercase animate-pulse">Demo Track</div>
       </div>
       <canvas ref={canvasRef} width="64" height="48" className="hidden" />

       <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-8 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-4">
             <span className="text-slate-400 font-medium">Demo Question {currentQ + 1}</span>
             <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-1 rounded uppercase font-bold border border-green-500/20"><Mic size={12} className="inline mr-1 animate-pulse"/> Tracking</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xl font-bold text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg">
            <Timer size={20} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <motion.div key={currentQ} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-slate-900 border border-slate-700 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-xl">PRACTICE MODE</div>
          <h2 className="text-2xl font-semibold mb-8 leading-relaxed">{demoQuestions[currentQ].text}</h2>
          <div className="space-y-4">
            {demoQuestions[currentQ].options.map((opt, index) => (
              <button 
                key={index} 
                onClick={() => { const n = [...answers]; n[currentQ] = index; setAnswers(n); }} 
                className={`w-full text-left p-5 rounded-xl border transition-all flex items-center justify-between group ${answers[currentQ] === index ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20" : "bg-slate-800 border-slate-700 hover:bg-slate-750"}`}
              >
                <span className="font-medium">{opt}</span>
                {answers[currentQ] === index && <CheckCircle size={20} className="text-white" />}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex justify-between mt-8">
           <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0} className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
           {currentQ < demoQuestions.length - 1 ? 
             <button onClick={() => setCurrentQ(p => p+1)} className="px-8 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700">Next Question</button> :
             <button onClick={submitTest} className="px-8 py-3 bg-green-600 rounded-xl font-bold hover:bg-green-700">Finish Demo</button>
           }
        </div>
      </div>
    </div>
  );
}