"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Timer, Lock, ShieldAlert, CheckCircle, Loader2, FileText, AlertTriangle, 
  MousePointer2, Ban, Award, Mic, Camera, Video, Sparkles, Layers, Move, Monitor
} from "lucide-react";

// 🔥 Naye Master Components 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

// 🔥 BULLETPROOF HELPER FUNCTIONS 🔥
const normalizeText = (str: string) => (str || "").toLowerCase().trim();
const isDontKnowOption = (text: string) => normalizeText(text).includes("don't know");

export default function LiveTestPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  // Mobile Detection State
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [mobileWarningDismissed, setMobileWarningDismissed] = useState(false);

  const [mediaAllowed, setMediaAllowed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const faceMatchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const profileDescriptorRef = useRef<Float32Array | null>(null);

  const noiseFramesRef = useRef(0);
  const movementFramesRef = useRef(0);
  const previousFrameRef = useRef<Uint8Array | null>(null);
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);

  const [showBonusPopup, setShowBonusPopup] = useState(false);
  const [bonusRoundTaken, setBonusRoundTaken] = useState(false);
  const [extraQuestionsPool, setExtraQuestionsPool] = useState<any[]>([]); 
  
  const [examScope, setExamScope] = useState<any[]>([]);
  const [shortfallData, setShortfallData] = useState<any[]>([]);

 const [tabWarnings, setTabWarnings] = useState(0);
  const [micWarnings, setMicWarnings] = useState(0);
  const [camWarnings, setCamWarnings] = useState(0);
  const [faceWarnings, setFaceWarnings] = useState(0);
  const [doubleFaceWarnings, setDoubleFaceWarnings] = useState(0);
  const [eyeWarnings, setEyeWarnings] = useState(0);

  const MAX_TAB_WARNINGS = 2;
  const MAX_MIC_WARNINGS = 6;
  const MAX_CAM_WARNINGS = 6;
  const MAX_FACE_WARNINGS = 2;
  const MAX_DOUBLE_FACE_WARNINGS = 2;
  const MAX_EYE_WARNINGS = 5;

  const [isTerminated, setIsTerminated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [skillAnalytics, setSkillAnalytics] = useState<any>({});
  const [aiReportGenerating, setAiReportGenerating] = useState(false);
  const [aiModelsLoaded, setAiModelsLoaded] = useState(false);

  const [generatingAIQuestions, setGeneratingAIQuestions] = useState(false);

  useEffect(() => {
    const loadFaceAPI = async () => {
      if (typeof window !== 'undefined' && !(window as any).faceapi) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/dist/face-api.js";
        script.async = true;
        script.onload = async () => {
            try {
                await (window as any).faceapi.nets.tinyFaceDetector.loadFromUri('https://vladmandic.github.io/face-api/model/');
                await (window as any).faceapi.nets.faceLandmark68Net.loadFromUri('https://vladmandic.github.io/face-api/model/');
                await (window as any).faceapi.nets.faceRecognitionNet.loadFromUri('https://vladmandic.github.io/face-api/model/');
                setAiModelsLoaded(true);
            } catch (e) { console.warn("FaceAPI models failed to load", e); }
        };
        document.body.appendChild(script);
      } else if ((window as any).faceapi) {
          setAiModelsLoaded(true);
      }
    };
    loadFaceAPI();
  }, []);

  useEffect(() => {
    const precomputeProfileFace = async () => {
        if (aiModelsLoaded && studentProfile?.photoURL) {
            try {
                const faceapi = (window as any).faceapi;
                const profileImg = new Image();
                profileImg.crossOrigin = "anonymous";
                profileImg.src = studentProfile.photoURL;
                await new Promise((resolve) => { profileImg.onload = resolve; });
                
                const profileDetection = await faceapi.detectSingleFace(profileImg, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
                
                if (profileDetection) {
                    profileDescriptorRef.current = profileDetection.descriptor;
                }
            } catch (error) {
                console.error("Error pre-computing profile face:", error);
            }
        }
    };
    precomputeProfileFace();
  }, [aiModelsLoaded, studentProfile]);

  const stopProctoring = useCallback(() => {
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close().catch(console.error);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (faceMatchIntervalRef.current) clearInterval(faceMatchIntervalRef.current);
  }, []);

  // 🔥 100% FIXED BULLETPROOF ANSWER CHECKER 🔥
  const checkIsCorrect = (q: any, ansIndex: number) => {
      if (ansIndex === -1 || ansIndex === undefined) return false;
      
      const selectedText = normalizeText(String(q.options[ansIndex]));
      const correctText = normalizeText(String(q.correct_answer));
      const selectedLetter = ['a', 'b', 'c', 'd', 'e'][ansIndex]; // e.g., 'a', 'b'...
      
      // 1. Direct Exact Text Match (If they are literally the same)
      if (selectedText === correctText) return true;
      
      // 2. Direct Letter Match (If DB only has "a", "b", "c" or "option a")
      if (correctText === selectedLetter || correctText === `option ${selectedLetter}`) return true;
      
      // 3. Prefix Letter Match (If DB has "A) Matching Concept" or "A. Something")
      // This regex extracts the starting letter if it's followed by a bracket, dot, dash, or space
      const prefixMatch = correctText.match(/^(?:option\s+)?([a-e])[\)\.\-\s:]/i);
      if (prefixMatch && prefixMatch[1] === selectedLetter) return true;
      
      // 4. Clean Text Match (Strip "A) " from both and compare raw text)
      const stripPrefix = (str: string) => str.replace(/^(?:option\s+)?([a-e])[\)\.\-\s:]+/i, "").trim();
      const cleanSelected = stripPrefix(selectedText);
      const cleanCorrect = stripPrefix(correctText);
      
      if (cleanSelected && cleanCorrect && cleanSelected === cleanCorrect) return true;
      
      // 5. Substring Fallback Match (If one text contains the other)
      if (cleanCorrect.length > 3 && cleanSelected.includes(cleanCorrect)) return true;
      if (cleanSelected.length > 3 && cleanCorrect.includes(cleanSelected)) return true;
      
      return false; // If nothing matches, it's wrong
  };

  // 🔥 BULLETPROOF SCORE CALCULATOR 🔥
  const calculateCurrentScore = () => {
     let calcScore = 0;
     const techSkillNamesNormalized = Array.isArray(studentProfile?.technologicalSkills) 
        ? studentProfile.technologicalSkills.map((s:any) => normalizeText(typeof s === 'string' ? s : s.name)) 
        : [];

     questions.forEach((q, i) => {
        const ansIndex = answers[i];
        const selectedOptionText = ansIndex !== -1 && ansIndex !== undefined ? q.options[ansIndex] : null;
        
        const isPsycho = q.category === "Psychometric" || normalizeText(q.skill).includes("psychometric");
        const isTechTool = techSkillNamesNormalized.includes(normalizeText(q.skill));
        
        if (checkIsCorrect(q, ansIndex)) {
            calcScore += 1; 
        } else if (selectedOptionText && !isDontKnowOption(selectedOptionText)) {
            if (!isPsycho && !isTechTool) {
                calcScore -= 0.5; 
            }
        }
     });
     return Math.max(0, calcScore); 
  };

 const handlePreSubmit = () => {
     if (isTerminated || isSubmitted) return;

     // Check if candidate has attempted at least 1 question
     const hasAttemptedAtLeastOne = answers.some(ans => ans !== -1 && ans !== undefined);
     if (!hasAttemptedAtLeastOne) {
         alert("🛑 Please attempt at least 1 question before submitting the assessment.");
         return;
     }

     const currentScore = calculateCurrentScore();
     const percentage = questions.length > 0 ? (currentScore / questions.length) * 100 : 0;
     
     if (percentage < 30 && !bonusRoundTaken && extraQuestionsPool.length > 0) {
         setShowBonusPopup(true);
     } else {
         submitTest();
     }
  };

  // 🔥 BULLETPROOF BONUS ROUND 🔥
  const acceptBonusRound = () => {
     const extraQs = extraQuestionsPool.sort(() => 0.5 - Math.random()).slice(0, 5);
     const processedBonusQs = extraQs.map(q => {
         const hasIDK = q.options.some((opt: string) => isDontKnowOption(opt));
         if (!hasIDK) {
             return { ...q, options: [...q.options.slice(0, 4), "I Don't Know"] };
         }
         return q;
     });

     setQuestions(prev => [...prev, ...processedBonusQs]);
     
     const newAnswers = [...answers];
     for(let i=0; i<processedBonusQs.length; i++) newAnswers.push(-1);
     setAnswers(newAnswers);
     setTimeLeft(prev => prev + (processedBonusQs.length * 60));
     setBonusRoundTaken(true); 
     setShowBonusPopup(false);
     setCurrentQ(questions.length);
  };

  const rejectBonusRound = () => { 
     setShowBonusPopup(false); 
     submitTest(); 
  };

  const submitTest = useCallback(async (forceReason?: string, isDisqualified: boolean = false) => {
    if (!user || isTerminated || isSubmitted) return;
    setLoading(true); 
    setAiReportGenerating(true);
    stopProctoring(); 
    
    try {
        let analyticsData: any = {};
        const techSkillNamesNormalized = Array.isArray(studentProfile?.technologicalSkills) 
            ? studentProfile.technologicalSkills.map((s:any) => normalizeText(typeof s === 'string' ? s : s.name)) 
            : [];

        questions.forEach((q, i) => {
           if (!analyticsData[q.skill]) {
               // Initializing data specifically for this exact subskill
               analyticsData[q.skill] = { total: 0, correct: 0, beginner: 0, intermediate: 0, advanced: 0, scoreCount: 0, aiLevel: "Beginner" };
           }
           analyticsData[q.skill].total += 1;

           const ansIndex = answers[i];
           const selectedOptionText = ansIndex !== -1 && ansIndex !== undefined ? q.options[ansIndex] : null;
           const isPsycho = q.category === "Psychometric" || normalizeText(q.skill).includes("psychometric");
           const isTechTool = techSkillNamesNormalized.includes(normalizeText(q.skill));
           
           if (checkIsCorrect(q, ansIndex)) {
               analyticsData[q.skill].correct += 1;
               analyticsData[q.skill].scoreCount += 1;
               if(q.difficulty?.toLowerCase().includes('beginner')) analyticsData[q.skill].beginner += 1;
               if(q.difficulty?.toLowerCase().includes('intermediate')) analyticsData[q.skill].intermediate += 1;
               if(q.difficulty?.toLowerCase().includes('advanced')) analyticsData[q.skill].advanced += 1;
           } else if (selectedOptionText && !isDontKnowOption(selectedOptionText)) {
               if (!isPsycho && !isTechTool) {
                   analyticsData[q.skill].scoreCount -= 0.5; // Negative marking applied only to this specific subskill
               }
           }
        });

        let currentTestTotalScore = 0;
        for (const skill in analyticsData) {
            const data = analyticsData[skill];
            const finalSkillScore = Math.max(0, data.scoreCount);
            currentTestTotalScore += finalSkillScore;
            
            if (finalSkillScore >= (data.total * 0.8)) data.aiLevel = "Expert Level 🟢";
            else if (finalSkillScore >= (data.total * 0.4)) data.aiLevel = "Intermediate Level 🟡";
            else data.aiLevel = "Beginner Level 🔴";

            const { error: insertErr } = await supabase.from("test_results").insert({ 
                student_id: user.id, skill: skill, total_score: finalSkillScore, 
                beginner_score: data.beginner, intermediate_score: data.intermediate, 
                advanced_score: data.advanced, ai_skill_level: data.aiLevel 
            });
            if (insertErr) console.log("Test result insert skipped", insertErr);
        }

        setScore(currentTestTotalScore);
        setSkillAnalytics(analyticsData);
        
        const finalStatus = forceReason && typeof forceReason === 'string' ? forceReason : "Passed";

        let generatedAiReport = "Report generation pending.";
        try {
           const safeClaimedSkills = Array.isArray(studentProfile?.skills) ? studentProfile.skills : [];
           const reportRes = await fetch('/api/generate-report', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  name: studentProfile?.fullName || "Candidate",
                  claimedSkills: safeClaimedSkills,
                  testScores: analyticsData,
                  warnings: { tab: tabWarnings, mic: micWarnings, cam: camWarnings, face: faceWarnings }
               })
           });
           if(reportRes.ok) {
              const reportData = await reportRes.json();
              if(reportData.report) generatedAiReport = reportData.report;
           }
        } catch(e) { console.error("AI Report generation failed", e); }

        await supabase.from("profiles").update({
           examAccess: isDisqualified ? "disqualified" : "completed",
           meta: {
              lastAttempt: new Date(),
              totalScore: currentTestTotalScore, 
              status: finalStatus,
              warnings: { tab: tabWarnings, mic: micWarnings, cam: camWarnings, face: faceWarnings, doubleFace: doubleFaceWarnings, eyeMovement: eyeWarnings },
              warningsCount: tabWarnings + micWarnings + camWarnings + faceWarnings + doubleFaceWarnings + eyeWarnings, 
              skillScores: analyticsData, 
              ai_detailed_report: generatedAiReport 
           }
        }).eq("id", user.id);

        // 🚀 BREVO ALERT: Test Completed
        if (!isDisqualified) {
            try {
                await fetch('/api/send-admin-alert', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: "test_completed",
                        candidateName: studentProfile?.fullName || "Candidate",
                        candidateEmail: user.email,
                        extraInfo: `${currentTestTotalScore} / ${questions.length}`
                    })
                });
            } catch (e) { console.error("Email alert failed", e); }
        }

    } catch (error) {
        console.error("Critical error during submission", error);
    } finally {
        setLoading(false); 
        setAiReportGenerating(false);
        if (isDisqualified) {
            setIsTerminated(true);
        } else {
            setIsSubmitted(true);
        }
    }
  }, [user, studentProfile, isTerminated, isSubmitted, questions, answers, tabWarnings, micWarnings, camWarnings, faceWarnings, stopProctoring]);

  const triggerWarning = useCallback((type: 'tab' | 'mic' | 'cam' | 'face', customMsg?: string) => {
    if (isTerminated || isSubmitted) return;
    
    if (type === 'tab') {
        setTabWarnings(prev => {
            const next = prev + 1;
            if (next >= MAX_TAB_WARNINGS) {
                alert("🚨 Test Auto-Submitted due to Tab Switching!");
                submitTest("Auto-Submitted: Tab Switching Exceeded", true);
            }
            else alert(`⚠️ WARNING ${next}/${MAX_TAB_WARNINGS}: Tab Switch Detected! Disqualification at ${MAX_TAB_WARNINGS}.`);
            return next;
        });
    } else if (type === 'mic') {
        setMicWarnings(prev => {
            const next = prev + 1;
            if (next >= MAX_MIC_WARNINGS) { 
                alert("🚨 Test Auto-Submitted due to Maximum Audio Warnings!"); 
                submitTest("Auto-Submitted: Maximum Audio Warnings Exceeded", true); 
            } else alert(`⚠️ AUDIO WARNING ${next}/${MAX_MIC_WARNINGS}: Background Noise Detected!`);
            return next;
        });
    } else if (type === 'cam') {
        setCamWarnings(prev => {
            const next = prev + 1;
            if (next >= MAX_CAM_WARNINGS) { 
                alert("🚨 Test Auto-Submitted due to Maximum Camera Warnings!");
                submitTest("Auto-Submitted: Maximum Camera Warnings Exceeded", true); 
            } else alert(`⚠️ CAMERA WARNING ${next}/${MAX_CAM_WARNINGS}: Please face the camera and do not move out of frame!`);
            return next;
        });
    } else if (type === 'face') {
        setFaceWarnings(prev => {
            const next = prev + 1;
            if (next >= MAX_FACE_WARNINGS) { 
                alert("🚨 Test Auto-Submitted due to Continuous Identity Mismatch!");
                submitTest("Auto-Submitted: Identity Mismatch Exceeded", true); 
            } else alert(`⚠️ IDENTITY WARNING ${next}/${MAX_FACE_WARNINGS}: ${customMsg || "Face mismatch detected!"}`);
            return next;
        });
    } else if (type === 'double_face') {
        setDoubleFaceWarnings(prev => {
            const next = prev + 1;
            if (next >= MAX_DOUBLE_FACE_WARNINGS) { 
                alert("🚨 Test Auto-Submitted: Multiple persons detected in frame!");
                submitTest("Auto-Submitted: Multiple Faces Detected", true); 
            } else alert(`⚠️ CHEATING WARNING ${next}/${MAX_DOUBLE_FACE_WARNINGS}: Multiple faces detected! You will be disqualified.`);
            return next;
        });
    } else if (type === 'eye') {
        setEyeWarnings(prev => {
            const next = prev + 1;
            if (next >= MAX_EYE_WARNINGS) { 
                alert("🚨 Test Auto-Submitted: Suspicious Eye/Head movement detected!");
                submitTest("Auto-Submitted: Eye/Head Movement Exceeded", true); 
            } else alert(`⚠️ PROCTOR WARNING ${next}/${MAX_EYE_WARNINGS}: ${customMsg || "Please look straight at the screen!"}`);
            return next;
        });
    }
  }, [isTerminated, isSubmitted, submitTest]);

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

     // Double Face Warning Timer State (Bahar rakh rahe taaki 10s track kar sake)
      let doubleFaceTimeCounter = 0;

      faceMatchIntervalRef.current = setInterval(async () => {
         if (isSubmitted || isTerminated) return;
         if (!videoRef.current) return; 

         try {
             const faceapi = (window as any).faceapi;
             if (!faceapi || !faceapi.nets.tinyFaceDetector.isLoaded) return;

             // 🔥 FIX: Lowered threshold (0.3) so it detects blurry/background faces too
             const detectorOptions = new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 });
             const liveDetections = await faceapi.detectAllFaces(videoRef.current, detectorOptions).withFaceLandmarks().withFaceDescriptors();

             if (liveDetections.length === 0) {
                 triggerWarning('face', "No face detected! Please look at the camera.");
                 return;
             }
             
             // 🔥 FIX: Robust accumulation for Double Face (Handles AI flickering)
             if (liveDetections.length > 1) {
                 doubleFaceTimeCounter += 2000; 
                 // Target 8-10 seconds of accumulated double face time
                 if (doubleFaceTimeCounter >= 500) { 
                     triggerWarning('double_face');
                     doubleFaceTimeCounter = 0; // Reset after warning
                 }
             } else {
                 // 🔥 FIX: Gradual cooldown! Agar AI milliseconds ke liye face miss kare toh timer 0 na ho
                 doubleFaceTimeCounter = Math.max(0, doubleFaceTimeCounter - 2000); 
             }

             const detection = liveDetections[0];
             
             // 🔥 FIX: Check identity strictness only when single person is detected (to avoid clash with double face)
             if (profileDescriptorRef.current && liveDetections.length === 1) {
                 const distance = faceapi.euclideanDistance(profileDescriptorRef.current, detection.descriptor);
                 // 🔥 FIX: Threshold tightened from 0.55 to 0.50 for stricter identity check
                 if (distance > 0.50) { 
                     triggerWarning('face', "Different person detected! Identity mismatch.");
                 }
             }
             
             // 🔥 100% FIXED: Deep Eyeball Tracking (Gaze) + Head Movement
             const nose = detection.landmarks.getNose();
             const leftEye = detection.landmarks.getLeftEye();
             const rightEye = detection.landmarks.getRightEye();
             const jaw = detection.landmarks.getJawOutline();
             
             const noseBridge = nose[0];
             const noseTip = nose[3];
             
             // Head Turn Calculation
             const leftJaw = jaw[0];
             const rightJaw = jaw[16];
             const distLeftJaw = Math.abs(noseBridge.x - leftJaw.x);
             const distRightJaw = Math.abs(noseBridge.x - rightJaw.x);

             // Eyeball Gaze Calculation (Distance from nose to inner corners of eyes)
             const leftEyeInner = leftEye[3]; // Inner corner of left eye
             const rightEyeInner = rightEye[0]; // Inner corner of right eye
             const distLeftEye = Math.abs(noseBridge.x - leftEyeInner.x);
             const distRightEye = Math.abs(rightEyeInner.x - noseBridge.x);
             
             // Looking Down Calculation
             const eyeYAvg = (leftEye[0].y + rightEye[0].y) / 2;
             const noseDistY = Math.abs(noseTip.y - eyeYAvg);
             const faceHeight = detection.detection.box.height;

             // 1. Extreme Head Turn (Sarr ghumana)
             if (distLeftJaw > distRightJaw * 1.6 || distRightJaw > distLeftJaw * 1.6) {
                 triggerWarning('eye', "Head turned away from screen!");
             } 
             // 2. Eyeball Gaze Turn (Sarr straight, par aankhein side mein)
             else if (distLeftEye > distRightEye * 1.5 || distRightEye > distLeftEye * 1.5) {
                 triggerWarning('eye', "Looking sideways detected! Keep your eyes on the screen.");
             }
             // 3. Looking Down (Aankhein / Sarr neeche notes padhne ke liye)
             else if (noseDistY < (faceHeight * 0.18)) { 
                 triggerWarning('eye', "Looking down detected! Keep your head straight.");
             }

         } catch (err) {
             console.error("Background face tracking error:", err);
         }
      }, 2000); // 🔥 100% FIXED: 2000 ms (2 seconds) kiya hai taaki lagatar monitor kare bina miss kiye.

      const checkActivity = () => {
        if (isSubmitted || isTerminated) return;
        frameCount++;
        analyser.getByteFrequencyData(dataArray);
        
       // 🔥 FIX: Ignore low-frequency background hum (AC, fan, traffic) and focus on human speech/whisper frequencies
        let speechSum = 0;
        let speechBins = 0;
        // Bin math: Bins 2 to 25 cover approx 350Hz to 4500Hz (Core human voice and whisper range).
        // Isse fan, AC aur bahar ki low rumble (0-300Hz) bilkul ignore ho jayegi.
        for (let i = 2; i < 25 && i < bufferLength; i++) {
            speechSum += dataArray[i];
            speechBins++;
        }
        const speechAverage = speechBins > 0 ? speechSum / speechBins : 0;

     // Smart Audio Check: Focused specifically on human voice frequencies
       // 🔥 FIX: Set threshold high (70) to completely ignore laptop mic static and browser auto-gain in silence
       if (speechAverage > 85) { 
         noiseFramesRef.current += 1;
         // 🔥 FIX: Requires almost 2 full seconds of solid continuous talking (~120 frames)
         if (noiseFramesRef.current > 140) { 
             noiseFramesRef.current = 0;
             triggerWarning('mic', "Continuous speaking detected!"); 
         }
       } else { 
           // 🔥 FIX: Faster reset (-2) so random background noises clear out instantly
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
                        if (movementFramesRef.current > 4) { 
                            movementFramesRef.current = 0;
                            triggerWarning('cam', "Camera blocked or too dark!"); 
                        }
                    } else if (previousFrameRef.current) {
                        let diffCount = 0;
                        const totalPixels = currentFrame.length / 4;
                        for (let i = 0; i < currentFrame.length; i += 4) {
                            const rDiff = Math.abs(currentFrame[i] - previousFrameRef.current[i]);
                            const gDiff = Math.abs(currentFrame[i+1] - previousFrameRef.current[i+1]);
                            const bDiff = Math.abs(currentFrame[i+2] - previousFrameRef.current[i+2]);
                            if (rDiff + gDiff + bDiff > 60) diffCount++; 
                        }

                        // Device-aware threshold (Relaxed for mobile, Strict for PC)
                        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                        const movementThreshold = isMobile ? 35 : 15; 
                        
                        if ((diffCount / totalPixels) * 100 > movementThreshold) {
                            movementFramesRef.current += 1;
                            if (movementFramesRef.current > 4) { 
                                movementFramesRef.current = 0;
                                triggerWarning('cam', "Excessive movement detected!"); 
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
      streamRef.current = stream; 
      if (videoRef.current) videoRef.current.srcObject = stream;
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
      setStudentProfile(profileSnap);

      const currentStatus = profileSnap?.examAccess || 'none';
      if (currentStatus === 'completed' || currentStatus === 'disqualified' || currentStatus === 'pending') {
         alert("Your test is locked. Please request a re-test from your dashboard if needed."); 
         window.location.href = "/student/dashboard"; 
         return;
      }

      const coreSkills = Array.isArray(profileSnap?.skills) ? profileSnap.skills.filter((s:any) => typeof s === 'string') : [];
      const techSkillsObjects = Array.isArray(profileSnap?.technologicalSkills) ? profileSnap.technologicalSkills : [];
      const techSkills = techSkillsObjects.map((s:any) => typeof s === 'string' ? s : s.name).filter(Boolean);
      
      const testableSkills = [...coreSkills, ...techSkills];
      
      if (testableSkills.length === 0) {
          alert("Test engine couldn't find any skills in your profile! Please add core skills or tech skills.");
          router.push("/student/profile"); 
          return;
      }

      try {
        let finalQuestions: any[] = [];
        let backupQuestions: any[] = []; 
        let scopeInfo: any[] = [];
        let shortfallToFetch: any[] = [];
        
        for (const skill of testableSkills) {
            const exactSkill = skill.trim();
            
            const { data: skillQs } = await supabase
                .from("question_bank")
                .select("*")
                .ilike("skill", exactSkill); 
            
            let dbFetchedCount = 0;

            if (skillQs && skillQs.length > 0) {
                const processedQs = skillQs.map(q => {
                    let opts = q.options;
                    if (opts.length === 4 && !opts.some((o:string) => isDontKnowOption(o))) {
                        opts = [...opts, "I Don't Know"];
                    }
                    return { ...q, options: opts, category: "Technical", skill: exactSkill }; 
                });

               const randomizedQs = processedQs.sort(() => 0.5 - Math.random());
                const toAdd = randomizedQs.slice(0, 6); // Changed to 6
                dbFetchedCount = toAdd.length;

                finalQuestions = [...finalQuestions, ...toAdd];
                backupQuestions = [...backupQuestions, ...randomizedQs.slice(6)];
            }

            const missing = 6 - dbFetchedCount; // Changed to 6
            scopeInfo.push({
                skillName: exactSkill,
                dbCount: dbFetchedCount,
                aiCount: missing,
                total: 6 // Changed to 6
            });
            
            if (missing > 0) {
                const techObj = techSkillsObjects.find((t:any) => (t.name || t) === exactSkill);
                const skillWithLevel = techObj && typeof techObj === 'object' && techObj.level ? `${exactSkill} (${techObj.level})` : exactSkill;
                shortfallToFetch.push({ skill: skillWithLevel, count: missing });
            }
        }

       scopeInfo.push({
            skillName: "Behavioral & Culture Fit",
            dbCount: 0,
            aiCount: 6, 
            total: 6 
        });
        
        // MISSING LOGIC: Behavioral ko bhi AI ki demand list (shortfall) mein daalna hai
        shortfallToFetch.push({ skill: "Behavioral & Culture Fit", count: 6 });

        setExamScope(scopeInfo);
        setShortfallData(shortfallToFetch);

        if (finalQuestions.length > 0) {
           finalQuestions = finalQuestions.sort(() => 0.5 - Math.random());
           setQuestions(finalQuestions); 
           setAnswers(new Array(finalQuestions.length).fill(-1));
           setTimeLeft(finalQuestions.length * 60); 
           setExtraQuestionsPool(backupQuestions); 
        } else { 
           setQuestions([]); 
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    initTest(); 
    return () => stopProctoring(); 
  }, [router, stopProctoring]);

  useEffect(() => {
    if (loading || !testStarted || isSubmitted || isTerminated || showBonusPopup || generatingAIQuestions) return;
    const timer = setInterval(() => { 
        setTimeLeft((prev) => { 
            if (prev <= 1) { submitTest(); return 0; } 
            return prev - 1; 
        }); 
    }, 1000);
    
    return () => clearInterval(timer);
  }, [loading, testStarted, isSubmitted, isTerminated, showBonusPopup, generatingAIQuestions, submitTest]);

  const handleVisibilityChange = useCallback(() => { 
      if (document.hidden && testStarted && !isSubmitted && !isTerminated) triggerWarning('tab'); 
  }, [testStarted, isSubmitted, isTerminated, triggerWarning]);

  useEffect(() => {
    if(loading || !testStarted) return; 
    const elem = document.documentElement; 
    if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {});
    
    document.addEventListener("visibilitychange", handleVisibilityChange); 
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    
    const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key === "PrintScreen" || e.key === "F12" || (e.ctrlKey && e.key === "c") || (e.altKey && e.key === "Tab")) {
          e.preventDefault(); triggerWarning('tab');
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

  const handleStartTest = async () => {
    if(!mediaAllowed) return alert("Please Allow Media access to start the secure test.");
    if(!agreed) return alert("Please read and agree to the Terms & Conditions.");
    
    setGeneratingAIQuestions(true); 
    setTestStarted(true);
    
    if (streamRef.current) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(() => console.log("Fullscreen denied"));
        startProctoringEngine(streamRef.current); 
    }

    try {
        const safeCoreSkills = Array.isArray(studentProfile?.skills) ? studentProfile.skills.join(", ") : "General Aptitude";
        const techSkillsObjects = Array.isArray(studentProfile?.technologicalSkills) ? studentProfile.technologicalSkills : [];
        const safeTechSkills = techSkillsObjects.map((s:any) => typeof s === 'string' ? s : `${s.name} (${s.level})`).join(", ");
        const safeSkills = safeTechSkills ? `${safeCoreSkills}, ${safeTechSkills}` : safeCoreSkills;

        const safeEdu = Array.isArray(studentProfile?.educations) && studentProfile.educations.length > 0 
                        ? studentProfile.educations.map((e:any) => e.qualification).join(", ") 
                        : "";
        
       const aiInstruction = "IMPORTANT FOR AI: Ensure each generated question has EXACTLY ONE correct answer among the 4 options. Do not make options ambiguous.";
        const payloadString = safeEdu ? `Education: ${safeEdu}, Skills: ${safeSkills}. ${aiInstruction}` : `Skills: ${safeSkills}. ${aiInstruction}`;

        const existingQsTextLower = questions.map(q => normalizeText(q.question));
        const existingQsText = questions.map(q => q.question).join(" | ");

        const aiResponse = await fetch('/api/generate-ai-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                qualifications: payloadString,
                missingSkillsMap: shortfallData,
                existingQuestions: existingQsText
            })
        });
        
        if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            if (aiData.success && aiData.questions) {
                
                const filteredAiQuestions = aiData.questions.filter((q: any) => {
                    const qText = normalizeText(q.question);
                    // Fixed strict filter: Now it only drops if it's almost an EXACT match, protecting valid AI questions
                    return !existingQsTextLower.some(eq => eq === qText); 
                });

                const safeAiQuestions = filteredAiQuestions.map((q: any) => {
                    let opts = q.options;
                    if (!opts.some((o:string) => isDontKnowOption(o))) {
                       opts = [...opts.slice(0, 4), "I Don't Know"];
                    }
                    
                    const isPsycho = q.category === "Psychometric" || normalizeText(q.skill).includes("psychometric");
                    
                    let exactSkillAssigned = q.skill;
                    if (exactSkillAssigned && exactSkillAssigned.includes('(')) {
                        exactSkillAssigned = exactSkillAssigned.replace(/\s*\(.*?\)\s*/g, '').trim();
                    }

                    if (!isPsycho) {
                       const matchedShortfall = shortfallData.find(s => {
                           const sfName = normalizeText(s.skill.replace(/\s*\(.*?\)\s*/g, ''));
                           return sfName === normalizeText(exactSkillAssigned);
                       });
                       if (matchedShortfall) exactSkillAssigned = matchedShortfall.skill.replace(/\s*\(.*?\)\s*/g, '').trim();
                    }

                    return { 
                        ...q, 
                        options: opts, 
                        skill: isPsycho ? "Psychometric & Behavioral Fit" : (exactSkillAssigned || "Core Qualification Check"),
                        category: isPsycho ? "Psychometric" : "Technical"
                    };
                });
                
                // FIX: AI ne agar extra questions diye toh usko strict exact requirement tak kaat do (trim)
                const totalExpectedAIQs = shortfallData.reduce((sum, item) => sum + item.count, 0);
                const exactAiQuestions = safeAiQuestions.slice(0, totalExpectedAIQs);

                const finalMixedQs = [...questions, ...exactAiQuestions].sort(() => 0.5 - Math.random());
                setQuestions(finalMixedQs);
                setAnswers(new Array(finalMixedQs.length).fill(-1));
                setTimeLeft(finalMixedQs.length * 60); 
            } else {
                throw new Error("AI returned empty");
            }
        }
    } catch (error) {
        console.error("Failed to load AI questions", error);
        alert("Network Note: AI couldn't generate dynamic questions. Continuing with available database questions.");
        if (questions.length === 0) {
            alert("No questions available to start the test. Redirecting to dashboard.");
            window.location.href = "/student/dashboard";
            return;
        }
    }
    
    setGeneratingAIQuestions(false); 
  };


  // ---------------------------------------------------------
  // 🔥 UI CHANGES START HERE (Only classes/colors updated) 🔥
  // ---------------------------------------------------------


  // Effect to check if user is on mobile device when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
        setIsMobileDevice(mobileCheck);
    }
  }, []);

  if (loading) return (
      <div className="h-screen bg-transparent flex flex-col items-center justify-center text-slate-900 relative z-10">
         <Loader2 className="animate-spin text-[#0f947e] w-12 h-12 mb-4"/> 
         <p className="text-lg font-extrabold">{aiReportGenerating ? "AI is Analyzing your Performance..." : "Loading Secure Environment..."}</p>
      </div>
  );

  // 🛑 MOBILE WARNING POPUP (Locks the screen until accepted)
  if (isMobileDevice && !mobileWarningDismissed && !testStarted) return (
      <div className="min-h-screen bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 relative z-50">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-5 md:p-8 max-w-md w-full text-center shadow-2xl border border-amber-200 mx-4">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-amber-50 border-2 border-amber-200 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6 shadow-sm">
               <AlertTriangle size={28} className="text-amber-500" />
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold mb-2 md:mb-3 text-slate-900">Mobile Device Detected!</h2>
            <p className="text-slate-600 text-xs md:text-sm font-medium mb-4 md:mb-6 leading-relaxed">
               For the best experience and to avoid <strong className="text-red-600">Auto-Disqualification</strong>, we highly recommend taking this test on a <strong>Laptop or Desktop PC</strong>.
            </p>
            <div className="bg-red-50 border border-red-100 p-3 md:p-4 rounded-xl text-left mb-5 md:mb-8 shadow-sm">
               <p className="text-[10px] md:text-xs text-red-800 font-bold mb-1 md:mb-2 uppercase tracking-widest">Risks of using mobile:</p>
               <ul className="text-[11px] md:text-sm text-red-700 space-y-1.5 md:space-y-2 font-medium">
                  <li className="flex gap-2 items-start"><Ban size={14} className="mt-0.5 shrink-0"/> Calls/messages may trigger Tab Switch warnings.</li>
                  <li className="flex gap-2 items-start"><Camera size={14} className="mt-0.5 shrink-0"/> Shaky hands may trigger Camera Movement warnings.</li>
               </ul>
            </div>
            <div className="flex flex-col gap-2 md:gap-3 text-left">
               {/* Option 1: Continue on Mobile */}
               <button onClick={() => setMobileWarningDismissed(true)} className="flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all group">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded border-2 border-slate-300 group-hover:border-amber-500 bg-white shrink-0 flex items-center justify-center"></div>
                  <span className="text-xs md:text-sm font-bold text-slate-700 group-hover:text-amber-800">I Understand, Continue on Mobile Anyway</span>
               </button>
               
               {/* Option 2: Exit to Laptop (Recommended) */}
               <button onClick={() => window.location.href = '/student/dashboard'} className="flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 border-[#0f947e] bg-teal-50 hover:bg-teal-100 transition-all group shadow-sm">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded border-2 border-[#0f947e] bg-[#0f947e] shrink-0 flex items-center justify-center">
                     <CheckCircle size={12} className="text-white"/>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-[#0f947e]">Exit and open on Laptop (Recommended)</span>
               </button>
            </div>
         </motion.div>
      </div>
  );

  if (generatingAIQuestions) return (
      <div className="h-screen bg-transparent flex flex-col items-center justify-center text-slate-900 px-4 text-center relative z-10">
         <Sparkles className="animate-pulse text-[#0f947e] w-16 h-16 mb-6"/>
         <h2 className="text-3xl font-extrabold mb-2">Generating Dynamic Assessment</h2>
         <p className="text-slate-500 font-medium max-w-md">Our AI is analyzing your profile to craft unique Technical & Psychometric questions.</p>
         <div className="w-64 h-2 bg-slate-200 rounded-full mt-8 overflow-hidden shadow-inner">
             <div className="h-full bg-gradient-to-r from-[#0f947e] to-emerald-400 animate-pulse w-full"></div>
         </div>
      </div>
  );

  if (!testStarted && !isSubmitted && !isTerminated) {
    return (
        <div className="min-h-screen bg-transparent text-slate-900 flex items-center justify-center p-4 font-sans relative z-10">
            <div className="max-w-4xl w-full bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="bg-slate-50 border-b border-slate-200 p-8">
                    <h1 className="text-3xl font-extrabold mb-2 text-slate-900">Resourcemania Skill Assessment</h1>
                    <p className="text-slate-500 font-medium">Please read the instructions carefully before starting.</p>
                </div>
                
                <div className="p-8 grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="font-extrabold flex items-center gap-2 mb-4 text-blue-600">
                                <Layers size={18}/> Dynamic Exam Scope
                            </h3>
                            <div className="space-y-3">
                                {examScope.map((scope: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-slate-200 pb-2">
                                        <span className="text-sm text-slate-700 font-bold truncate max-w-[150px]" title={scope.skillName}>
                                            {scope.skillName}
                                        </span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-slate-900 font-extrabold text-sm">{scope.total} Qs</span>
                                            <span className="text-[10px] text-slate-500 font-bold">
                                                ({scope.dbCount} DB + {scope.aiCount} AI)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-sm">
                            <h3 className="font-extrabold flex items-center gap-2 mb-4 text-red-600">
                                <ShieldAlert size={18}/> Anti-Cheat Policy
                            </h3>
                            <ul className="space-y-3 text-sm text-red-800 font-medium">
                                <li className="flex gap-3"><Ban className="text-red-500 shrink-0" size={16}/> Tab Switching is prohibited (Max {MAX_TAB_WARNINGS} Warnings).</li>
                                <li className="flex gap-3"><Video className="text-red-500 shrink-0" size={16}/> Double Face Detection is Active (Max {MAX_DOUBLE_FACE_WARNINGS} Warnings).</li>
                                <li className="flex gap-3"><Camera className="text-red-500 shrink-0" size={16}/> Looking down/away will be flagged (Max {MAX_EYE_WARNINGS} Warnings).</li>
                                <li className="flex gap-3"><Mic className="text-red-500 shrink-0" size={16}/> Background Audio Monitoring Active.</li>
                             </ul>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-4 mb-4 transition-colors ${mediaAllowed ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                           <h3 className="font-extrabold flex items-center justify-between text-slate-900">
                              <span className="flex items-center gap-2"><Camera size={18} className={mediaAllowed ? "text-emerald-600" : "text-blue-600"}/> Camera & Mic Setup</span>
                              {mediaAllowed && <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg">Connected</span>}
                           </h3>
                           <div className="flex flex-col items-center gap-4">
                               <div className="w-32 h-32 bg-slate-900 rounded-full overflow-hidden border-4 border-white shadow-md relative">
                                   <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
                                   {!mediaAllowed && <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-400 text-center px-2">Camera Off</div>}
                               </div>
                               {!mediaAllowed ? (
                                   <Button variant="primary" onClick={requestMediaPermission} className="text-xs w-full py-2.5">Enable Camera & Mic</Button>
                               ) : !aiModelsLoaded ? (
                                   <div className="text-blue-600 font-bold text-xs flex items-center gap-2 py-2"><Loader2 size={16} className="animate-spin"/> Loading AI Models...</div>
                               ) : (
                                   <div className="text-emerald-600 font-extrabold text-sm">System Ready</div>
                               )}
                           </div>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 flex-1 shadow-sm">
                            <h3 className="font-extrabold flex items-center gap-2 mb-4 text-amber-600">
                                <AlertTriangle size={18}/> Important Scoring Rules
                            </h3>
                            <div className="text-xs text-slate-600 space-y-3 h-32 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="bg-red-50 p-2 rounded-xl border border-red-200 font-medium">
                                   <strong className="text-red-700">Core Technical Questions:</strong> +1 for Correct, <strong className="text-red-600">-0.5 for Wrong</strong>. Use "I Don't Know" to avoid penalty.
                                </div>
                                <div className="bg-blue-50 p-2 rounded-xl border border-blue-200 font-medium">
                                   <strong className="text-blue-700">Software & Tools (Tech Skills):</strong> +1 for Correct, <strong className="text-blue-900">NO Negative Marking</strong>.
                                </div>
                                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 font-medium">
                                   <strong className="text-emerald-700">Psychometric Questions:</strong> Evaluates culture fit. <strong className="text-emerald-900">NO Negative Marking</strong>. Answer honestly.
                                </div>
                            </div>
                        </div>

                        <div onClick={() => setAgreed(!agreed)} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 mb-6 shadow-sm ${agreed ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200 hover:border-blue-200'}`}>
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-slate-50'}`}>
                                {agreed && <CheckCircle size={14} className="text-white"/>}
                            </div>
                            <p className="text-sm font-bold text-slate-700 select-none">I understand the Tech & Psychometric rules and agree to the Terms.</p>
                        </div>

                        <div className="flex gap-4 mt-auto">
                            <Button variant="secondary" onClick={() => window.location.href = '/student/dashboard'} className="py-3 px-6">Cancel</Button>
                            <Button 
                                variant="primary" 
                                onClick={handleStartTest} 
                                disabled={!agreed || !mediaAllowed || !aiModelsLoaded || (examScope.length === 0 && !generatingAIQuestions)} 
                                className="flex-1 py-3"
                            >
                                <MousePointer2 size={18}/> Start Test
                            </Button>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
  }

  if (isTerminated) {
    return (
      <div className="min-h-screen bg-red-50/90 backdrop-blur-md text-red-900 flex flex-col items-center justify-center p-6 text-center relative z-10">
         <ShieldAlert size={80} className="text-red-600 mb-6 animate-pulse"/>
         <h1 className="text-5xl font-extrabold mb-4">Test Terminated</h1>
         <p className="text-red-700 text-xl mb-8 max-w-lg font-bold">Violation of Anti-Cheat Rules Detected.<br/>Your partial score has been saved.</p>
         <Button variant="danger" onClick={() => window.location.href = '/student/dashboard'} className="px-8 py-3">Return to Dashboard</Button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-transparent text-slate-900 flex flex-col items-center justify-center p-6 text-center py-12 relative z-10">
         <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mb-6 mt-10 shadow-sm">
            <CheckCircle size={40} className="text-emerald-500"/>
         </div>
         <h1 className="text-3xl font-extrabold mb-2">Assessment Completed</h1>
         <p className="text-slate-500 font-bold text-sm mb-8">Your Technical & Behavioral analytics have been securely recorded.</p>
         
         <Card className="w-full max-w-2xl mb-8 shadow-xl p-8 md:p-10">
            <p className="text-slate-500 text-sm uppercase font-black mb-2 tracking-widest">Final Overall Score</p>
            <p className="text-6xl font-black text-emerald-600 mb-6">{score} <span className="text-2xl text-slate-400">/ {questions.length}</span></p>

            <div className="border-t border-slate-200 pt-6 text-left">
               <h4 className="text-slate-700 text-sm font-extrabold uppercase mb-4 flex items-center gap-2">
                  <Award size={18} className="text-[#0f947e]"/> Skill & Culture Fit Report
               </h4>
               <div className="space-y-4">
                  {Object.keys(skillAnalytics).map(skill => {
                     const isPsycho = skill === "Psychometric & Behavioral Fit";
                     const techSkillNamesNormalized = Array.isArray(studentProfile?.technologicalSkills) 
                        ? studentProfile.technologicalSkills.map((s:any) => normalizeText(typeof s === 'string' ? s : s.name)) 
                        : [];
                     const isTechSkill = techSkillNamesNormalized.includes(normalizeText(skill));
                     
                     return (
                     <div key={skill} className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${isPsycho ? 'bg-indigo-50 border-indigo-200' : isTechSkill ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div>
                           <span className={`font-extrabold text-lg ${isPsycho ? 'text-indigo-800' : isTechSkill ? 'text-blue-800' : 'text-slate-800'}`}>{isTechSkill ? `💻 ${skill}` : skill}</span>
                           <p className="text-xs text-slate-500 font-bold mt-1">Score: {Math.max(0, skillAnalytics[skill].scoreCount)} / {skillAnalytics[skill].total}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl border font-bold text-sm text-center ${skillAnalytics[skill].aiLevel.includes('Expert') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : skillAnalytics[skill].aiLevel.includes('Intermediate') ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                           {skillAnalytics[skill].aiLevel}
                        </div>
                     </div>
                  )})}
               </div>
            </div>
         </Card>
         <Button variant="primary" onClick={() => window.location.href = '/student/dashboard'} className="px-8 py-3 mb-10 shadow-teal-500/20">Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900 p-4 select-none relative z-10" onContextMenu={(e)=>e.preventDefault()}>
       
{/* Draggable PiP Video */}
       <AnimatePresence>
         {testStarted && (
           <motion.div 
              drag 
              dragConstraints={{ left: -1000, right: 20, top: -800, bottom: 20 }} 
              dragElastic={0.1}
              className="fixed top-4 right-4 md:top-auto md:bottom-6 md:right-6 w-24 h-32 md:w-56 md:h-40 bg-slate-900 border-[3px] border-red-500/80 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl z-50 cursor-move"
           >
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100 opacity-90 pointer-events-none" />
              <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-red-600 text-white text-[7px] md:text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest animate-pulse flex items-center gap-1 pointer-events-none shadow-md">
                 <Video size={10} className="hidden md:block"/> <span className="md:hidden">REC</span><span className="hidden md:inline">Proctoring Active</span>
              </div>
              <div className="absolute bottom-1 right-1 bg-black/50 p-1 md:p-1.5 rounded-lg backdrop-blur-sm pointer-events-none">
                 <Move size={12} className="text-white/90 md:w-[14px] md:h-[14px]" />
              </div>
           </motion.div>
         )}
       </AnimatePresence>
       
       <canvas ref={canvasRef} width="64" height="48" className="hidden" />

       {/* Bonus Round Popup Modal */}
       <AnimatePresence>
         {showBonusPopup && (
           <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-indigo-200 p-8 rounded-[2rem] max-w-lg text-center shadow-2xl w-full">
                 <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Sparkles size={40} className="text-indigo-500"/>
                 </div>
                 <h2 className="text-3xl font-extrabold mb-4 text-slate-900">You Can Do Better!</h2>
                 <p className="text-slate-500 font-medium text-lg mb-8">Your current score seems a bit low. We want to give you a <strong className="text-indigo-600">Second Chance</strong> to improve your profile rating before submitting.</p>
                 <div className="bg-indigo-50 p-4 rounded-xl mb-8 border border-indigo-200 shadow-sm">
                    <p className="text-indigo-700 font-black mb-1">🎁 Take 5 Bonus Questions</p>
                    <p className="text-xs text-indigo-600/80 font-bold">5 minutes will be added to your timer.</p>
                 </div>
                 <div className="flex gap-4">
                    <Button variant="secondary" onClick={rejectBonusRound} className="flex-1 py-3 text-sm">Submit Anyway</Button>
                    <Button variant="primary" onClick={acceptBonusRound} className="flex-[2] py-3 text-sm bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 text-white">Accept Bonus Round</Button>
                 </div>
              </motion.div>
           </div>
         )}
       </AnimatePresence>

 <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center bg-white/80 backdrop-blur-xl border border-red-200 p-3 md:p-4 rounded-2xl mb-6 shadow-sm gap-3">
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg border border-red-100 shadow-sm">
                <Lock size={14} className="md:w-4 md:h-4"/> <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">Secure Exam</span>
             </div>
             {bonusRoundTaken && (
                <div className="text-[10px] md:text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg shadow-sm">
                   ✨ Bonus Round
                </div>
             )}
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 text-[9px] md:text-xs font-black uppercase tracking-wider w-full md:w-auto justify-start md:justify-end">
             <div className={`px-2 py-1 md:px-2.5 md:py-1.5 rounded-md md:rounded-lg border shadow-sm ${faceWarnings > 0 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-500 border-slate-200'}`}>ID: {MAX_FACE_WARNINGS - faceWarnings}</div>
             <div className={`px-2 py-1 md:px-2.5 md:py-1.5 rounded-md md:rounded-lg border shadow-sm ${doubleFaceWarnings > 0 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-500 border-slate-200'}`}>2-Faces: {MAX_DOUBLE_FACE_WARNINGS - doubleFaceWarnings}</div>
             <div className={`px-2 py-1 md:px-2.5 md:py-1.5 rounded-md md:rounded-lg border shadow-sm ${eyeWarnings > 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-slate-500 border-slate-200'}`}>Eye: {MAX_EYE_WARNINGS - eyeWarnings}</div>
             <div className={`px-2 py-1 md:px-2.5 md:py-1.5 rounded-md md:rounded-lg border shadow-sm ${tabWarnings > 0 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-500 border-slate-200'}`}>Tab: {MAX_TAB_WARNINGS - tabWarnings}</div>
             <div className={`px-2 py-1 md:px-2.5 md:py-1.5 rounded-md md:rounded-lg border shadow-sm ${micWarnings > 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-slate-500 border-slate-200'}`}>Mic: {MAX_MIC_WARNINGS - micWarnings}</div>
          </div>
       </div>

    
       <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-sm">
             <span className="text-slate-500 font-bold">Question <span className="text-slate-900 font-black text-lg">{currentQ + 1}</span> <span className="text-sm">/ {questions.length}</span></span>
             
             {questions.length > 0 && (questions[currentQ].category === "Psychometric" || normalizeText(questions[currentQ].skill).includes("psychometric")) && (
                 <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest animate-pulse shadow-sm">Behavioral (No Neg Marking)</span>
             )}
             
             {questions.length > 0 && questions[currentQ].category !== "Psychometric" && !normalizeText(questions[currentQ].skill).includes("psychometric") && Array.isArray(studentProfile?.technologicalSkills) && studentProfile.technologicalSkills.some((s:any) => normalizeText(typeof s === 'string' ? s : s.name) === normalizeText(questions[currentQ].skill)) && (
                 <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">Tech Tool (No Neg Marking)</span>
             )}

             <div className="flex items-center gap-2 font-mono text-xl font-bold text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 shadow-sm">
                <Timer size={20} className="text-blue-500"/> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </div>
          </div>

          {questions.length > 0 && (
             <motion.div key={currentQ} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
               <Card className="p-8 md:p-12 relative overflow-hidden shadow-xl">
                  <div className="flex justify-between items-start mb-8">
                     <h2 className="text-xl md:text-2xl font-extrabold leading-relaxed max-w-2xl text-slate-900">{questions[currentQ].question}</h2>
                  </div>
                  <div className="space-y-4">
                     {questions[currentQ].options.map((opt: string, index: number) => {
                        const isDontKnow = isDontKnowOption(opt);
                        return (
                        <button 
                           key={index} 
                           onClick={() => { const n = [...answers]; n[currentQ] = index; setAnswers(n); }} 
                           className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group shadow-sm
                              ${answers[currentQ] === index 
                                  ? (isDontKnow ? "bg-slate-100 border-slate-400" : "bg-blue-50 border-blue-500 shadow-blue-500/20") 
                                  : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50"}
                              ${isDontKnow && answers[currentQ] !== index ? "opacity-70 hover:opacity-100 italic" : ""}`}
                        >
                           <span className={`font-bold ${answers[currentQ] === index ? (isDontKnow ? 'text-slate-700' : 'text-blue-700') : 'text-slate-600'}`}>{opt}</span>
                           {answers[currentQ] === index && <CheckCircle size={20} className={isDontKnow ? "text-slate-500" : "text-blue-600"} />}
                        </button>
                     )})}
                  </div>
               </Card>
             </motion.div>
          )}

          <div className="flex justify-between mt-8 pb-10">
             <Button 
                variant="secondary"
                onClick={() => setCurrentQ(p => Math.max(0, p - 1))} 
                disabled={currentQ === 0} 
                className="px-6 py-3"
             >
                Previous
             </Button>
             {currentQ < questions.length - 1 ? (
                <Button variant="primary" onClick={() => setCurrentQ(p => p+1)} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 text-white">
                   Next Question
                </Button>
             ) : (
                <Button variant="primary" onClick={handlePreSubmit} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 text-white">
                   Submit Assessment
                </Button>
             )}
          </div>
       </div>
       <style jsx global>{`body { user-select: none; }`}</style>
    </div>
  );
}