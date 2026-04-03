"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Timer, Lock, ShieldAlert, CheckCircle, Loader2, FileText, AlertTriangle, 
  MousePointer2, Ban, Award, Mic, Camera, Video, Sparkles, Layers, Move, Monitor
} from "lucide-react";

export default function LiveTestPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
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

  const MAX_TAB_WARNINGS = 2;
  const MAX_MIC_WARNINGS = 6;
  const MAX_CAM_WARNINGS = 6;
  const MAX_FACE_WARNINGS = 4;

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
        warnings: { tab: tabWarnings, mic: micWarnings, cam: camWarnings, face: faceWarnings },
        warningsCount: tabWarnings + micWarnings + camWarnings + faceWarnings, 
        skillScores: {} 
      }
    }).eq("id", user.id);
  }, [user, tabWarnings, micWarnings, camWarnings, faceWarnings, stopProctoring]);

  const checkIsCorrect = (q: any, ansIndex: number) => {
      if (ansIndex === -1 || ansIndex === undefined) return false;
      const selectedText = String(q.options[ansIndex]).trim().toLowerCase();
      const correctAns = String(q.correct_answer).trim().toLowerCase();

      if (selectedText === correctAns) return true; 
      if (correctAns === String(ansIndex)) return true; 
      if (correctAns === ['a', 'b', 'c', 'd', 'e'][ansIndex]) return true; 
      if (selectedText.includes(correctAns) || correctAns.includes(selectedText)) return true; 

      return false;
  };

  const calculateCurrentScore = () => {
     let calcScore = 0;
     
     const techSkillNames = Array.isArray(studentProfile?.technologicalSkills) 
        ? studentProfile.technologicalSkills.map((s:any) => typeof s === 'string' ? s : s.name) 
        : [];

     questions.forEach((q, i) => {
        const ansIndex = answers[i];
        const selectedOptionText = ansIndex !== -1 && ansIndex !== undefined ? q.options[ansIndex] : null;
        
        const isPsycho = q.category === "Psychometric" || q.skill === "Psychometric & Behavioral Fit";
        const isTechTool = techSkillNames.includes(q.skill);
        
        if (checkIsCorrect(q, ansIndex)) {
            calcScore += 1; 
        } else if (selectedOptionText && selectedOptionText !== "I Don't Know") {
            if (!isPsycho && !isTechTool) {
                calcScore -= 0.5; 
            }
        }
     });
     return Math.max(0, calcScore); 
  };

  const handlePreSubmit = () => {
     if (isTerminated || isSubmitted) return;
     const currentScore = calculateCurrentScore();
     const percentage = questions.length > 0 ? (currentScore / questions.length) * 100 : 0;
     
     if (percentage < 30 && !bonusRoundTaken && extraQuestionsPool.length > 0) {
         setShowBonusPopup(true);
     } else {
         submitTest();
     }
  };

  const acceptBonusRound = () => {
     const extraQs = extraQuestionsPool.sort(() => 0.5 - Math.random()).slice(0, 5);
     const processedBonusQs = extraQs.map(q => {
         if (!q.options.includes("I Don't Know")) {
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

  const submitTest = useCallback(async (forceReason?: string) => {
    if (!user || isTerminated || isSubmitted) return;
    setLoading(true); 
    setAiReportGenerating(true);
    stopProctoring(); 
    
    try {
        let analyticsData: any = {};
        
        const techSkillNames = Array.isArray(studentProfile?.technologicalSkills) 
            ? studentProfile.technologicalSkills.map((s:any) => typeof s === 'string' ? s : s.name) 
            : [];

        questions.forEach((q, i) => {
           if (!analyticsData[q.skill]) {
               analyticsData[q.skill] = { total: 0, correct: 0, beginner: 0, intermediate: 0, advanced: 0, scoreCount: 0, aiLevel: "Beginner" };
           }
     
           analyticsData[q.skill].total += 1;

           const ansIndex = answers[i];
           const selectedOptionText = ansIndex !== -1 && ansIndex !== undefined ? q.options[ansIndex] : null;
           
           const isPsycho = q.category === "Psychometric" || q.skill === "Psychometric & Behavioral Fit";
           const isTechTool = techSkillNames.includes(q.skill);
           
           if (checkIsCorrect(q, ansIndex)) {
               analyticsData[q.skill].correct += 1;
               analyticsData[q.skill].scoreCount += 1;
               if(q.difficulty?.toLowerCase().includes('beginner')) analyticsData[q.skill].beginner += 1;
               if(q.difficulty?.toLowerCase().includes('intermediate')) analyticsData[q.skill].intermediate += 1;
               if(q.difficulty?.toLowerCase().includes('advanced')) analyticsData[q.skill].advanced += 1;
           } else if (selectedOptionText && selectedOptionText !== "I Don't Know") {
               if (!isPsycho && !isTechTool) {
                   analyticsData[q.skill].scoreCount -= 0.5;
               }
           }
        });

        for (const skill in analyticsData) {
            const data = analyticsData[skill];
            const finalSkillScore = Math.max(0, data.scoreCount);
            
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

        let currentTestTotalScore = 0;
        for (const skill in analyticsData) {
            currentTestTotalScore += Math.max(0, analyticsData[skill].scoreCount);
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
           examAccess: "completed",
           meta: {
              lastAttempt: new Date(),
              totalScore: currentTestTotalScore, 
              status: finalStatus,
              warnings: { tab: tabWarnings, mic: micWarnings, cam: camWarnings, face: faceWarnings },
              warningsCount: tabWarnings + micWarnings + camWarnings + faceWarnings, 
              skillScores: analyticsData, 
              ai_detailed_report: generatedAiReport 
           }
        }).eq("id", user.id);

    } catch (error) {
        console.error("Critical error during submission", error);
    } finally {
        setIsSubmitted(true);
        setLoading(false); 
        setAiReportGenerating(false);
    }
  }, [user, studentProfile, isTerminated, isSubmitted, questions, answers, tabWarnings, micWarnings, camWarnings, faceWarnings, stopProctoring]);

  const triggerWarning = useCallback((type: 'tab' | 'mic' | 'cam' | 'face', customMsg?: string) => {
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
            } else alert(`⚠️ AUDIO WARNING ${next}/${MAX_MIC_WARNINGS}: Background Noise Detected!`);
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
    } else if (type === 'face') {
        setFaceWarnings(prev => {
            const next = prev + 1;
            if (next >= MAX_FACE_WARNINGS) { 
                alert("🚨 Test Auto-Submitted due to Continuous Identity Mismatch!");
                submitTest("Auto-Submitted: Identity Mismatch Exceeded"); 
            } else alert(`⚠️ IDENTITY WARNING ${next}/${MAX_FACE_WARNINGS}: ${customMsg || "Face mismatch detected!"}`);
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

      faceMatchIntervalRef.current = setInterval(async () => {
         if (isSubmitted || isTerminated) return;
         if (!videoRef.current || !profileDescriptorRef.current) return;

         try {
             const faceapi = (window as any).faceapi;
             if (!faceapi || !faceapi.nets.tinyFaceDetector.isLoaded) return;

             const liveDetection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

             if (!liveDetection) {
                 triggerWarning('face', "No face detected in camera! Please stay in frame.");
                 return;
             }

             const distance = faceapi.euclideanDistance(profileDescriptorRef.current, liveDetection.descriptor);
             
             if (distance > 0.55) { 
                 triggerWarning('face', "Different person detected! Identity mismatch.");
             }
         } catch (err) {
             console.error("Background face matching error:", err);
         }
      }, 30000); 

      const checkActivity = () => {
        if (isSubmitted || isTerminated) return;
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
                        if (movementFramesRef.current > 4) { 
                            movementFramesRef.current = 0;
                            triggerWarning('cam'); 
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
                        if ((diffCount / totalPixels) * 100 > 15) {
                            movementFramesRef.current += 1;
                            if (movementFramesRef.current > 4) { 
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
            
            // 🔥 SMART SEARCH LOGIC ADDED HERE 🔥
            // Pura naam dhundhne ki jagah, sirf pehla main word dhundhega taaki mismatch na ho
            const safeSearchTerm = exactSkill.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');

            // DB Priority: Fetch from DB first using Smart Search
            const { data: skillQs } = await supabase
                .from("question_bank")
                .select("*")
                .ilike("skill", `%${safeSearchTerm}%`); 
            
            let dbFetchedCount = 0;

            if (skillQs && skillQs.length > 0) {
                const processedQs = skillQs.map(q => {
                    let opts = q.options;
                    if (opts.length === 4 && !opts.includes("I Don't Know")) {
                        opts = [...opts, "I Don't Know"];
                    }
                    return { ...q, options: opts, category: "Technical", skill: exactSkill }; 
                });

                const randomizedQs = processedQs.sort(() => 0.5 - Math.random());
                const toAdd = randomizedQs.slice(0, 5); 
                dbFetchedCount = toAdd.length;

                finalQuestions = [...finalQuestions, ...toAdd];
                backupQuestions = [...backupQuestions, ...randomizedQs.slice(5)];
            }

            const missing = 5 - dbFetchedCount;
            scopeInfo.push({
                skillName: exactSkill,
                dbCount: dbFetchedCount,
                aiCount: missing,
                total: 5
            });

            // Shortfall tracking for AI
            if (missing > 0) {
                const techObj = techSkillsObjects.find((t:any) => (t.name || t) === exactSkill);
                const skillWithLevel = techObj && typeof techObj === 'object' && techObj.level ? `${exactSkill} (${techObj.level})` : exactSkill;
                shortfallToFetch.push({ skill: skillWithLevel, count: missing });
            }
        }

        scopeInfo.push({
            skillName: "Behavioral & Culture Fit",
            dbCount: 0,
            aiCount: 5,
            total: 5
        });

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
        
        const payloadString = safeEdu ? `Education: ${safeEdu}, Skills: ${safeSkills}` : `Skills: ${safeSkills}`;

        // EXISTING DB QUESTIONS TO AVOID AI REPEATING THEM
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
                const safeAiQuestions = aiData.questions.map((q: any) => {
                    let opts = q.options;
                    if (!opts.includes("I Don't Know")) {
                       opts = [...opts.slice(0, 4), "I Don't Know"];
                    }
                    
                    const isPsycho = q.category === "Psychometric" || q.skill === "Psychometric & Behavioral Fit";
                    
                    let exactSkillAssigned = q.skill;
                    if (exactSkillAssigned && exactSkillAssigned.includes('(')) {
                        exactSkillAssigned = exactSkillAssigned.replace(/\s*\(.*?\)\s*/g, '').trim();
                    }

                    if (!isPsycho) {
                       const matchedShortfall = shortfallData.find(s => {
                           const sfName = s.skill.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();
                           return sfName === exactSkillAssigned.toLowerCase();
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
                
                const finalMixedQs = [...questions, ...safeAiQuestions].sort(() => 0.5 - Math.random());
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

  if (loading) return (
      <div className="h-screen bg-[#0A0F1F] flex flex-col items-center justify-center text-white">
         <Loader2 className="animate-spin text-blue-500 w-12 h-12 mb-4"/> 
         <p className="text-lg font-bold">{aiReportGenerating ? "AI is Analyzing your Performance..." : "Loading Secure Environment..."}</p>
      </div>
  );

  if (generatingAIQuestions) return (
      <div className="h-screen bg-[#0A0F1F] flex flex-col items-center justify-center text-white px-4 text-center">
         <Sparkles className="animate-pulse text-purple-500 w-16 h-16 mb-6"/>
         <h2 className="text-3xl font-extrabold mb-2">Generating Dynamic Assessment</h2>
         <p className="text-slate-400 max-w-md">Our AI is analyzing your profile to craft unique Technical & Psychometric questions.</p>
         <div className="w-64 h-2 bg-slate-800 rounded-full mt-8 overflow-hidden">
             <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse w-full"></div>
         </div>
      </div>
  );

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
                            <h3 className="font-bold flex items-center gap-2 mb-4 text-blue-400">
                                <Layers size={18}/> Dynamic Exam Scope
                            </h3>
                            <div className="space-y-3">
                                {examScope.map((scope: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-slate-800 pb-2">
                                        <span className="text-sm text-slate-300 truncate max-w-[150px]" title={scope.skillName}>
                                            {scope.skillName}
                                        </span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-white font-bold text-sm">{scope.total} Qs</span>
                                            <span className="text-[10px] text-slate-500">
                                                ({scope.dbCount} DB + {scope.aiCount} AI)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-red-950/20 p-5 rounded-2xl border border-red-900/50">
                            <h3 className="font-bold flex items-center gap-2 mb-4 text-red-500">
                                <ShieldAlert size={18}/> Anti-Cheat Policy
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex gap-3"><Ban className="text-red-500 shrink-0" size={16}/> Do not switch tabs (Max 2 Warnings).</li>
                                <li className="flex gap-3"><Video className="text-red-500 shrink-0" size={16}/> Identity & Movement Check Active.</li>
                                <li className="flex gap-3"><Mic className="text-red-500 shrink-0" size={16}/> Background Audio Monitoring Active.</li>
                             </ul>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                        <div className={`p-5 rounded-2xl border flex flex-col gap-4 mb-4 transition-colors ${mediaAllowed ? 'bg-green-900/20 border-green-500/50' : 'bg-slate-950 border-slate-800'}`}>
                           <h3 className="font-bold flex items-center justify-between text-white">
                              <span className="flex items-center gap-2"><Camera size={18} className={mediaAllowed ? "text-green-400" : "text-blue-400"}/> Camera & Mic Setup</span>
                              {mediaAllowed && <span className="text-xs font-bold text-green-500 bg-green-500/20 px-3 py-1 rounded-lg">Connected</span>}
                           </h3>
                           <div className="flex flex-col items-center gap-4">
                               <div className="w-32 h-32 bg-black rounded-full overflow-hidden border-4 border-slate-800 relative">
                                   <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
                                   {!mediaAllowed && <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500 text-center px-2">Camera Off</div>}
                               </div>
                               {!mediaAllowed ? (
                                   <button onClick={requestMediaPermission} className="text-xs font-bold bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-500 shadow-lg transition-all w-full">Enable Camera & Mic</button>
                               ) : !aiModelsLoaded ? (
                                   <div className="text-blue-400 font-bold text-xs flex items-center gap-2 py-2"><Loader2 size={16} className="animate-spin"/> Loading AI Models...</div>
                               ) : (
                                   <div className="text-green-500 font-bold text-sm">System Ready</div>
                               )}
                           </div>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 mb-6 flex-1">
                            <h3 className="font-bold flex items-center gap-2 mb-4 text-yellow-400">
                                <AlertTriangle size={18}/> Important Scoring Rules
                            </h3>
                            <div className="text-xs text-slate-400 space-y-3 h-32 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="bg-red-900/10 p-2 rounded border border-red-500/20">
                                   <strong className="text-red-400">Core Technical Questions:</strong> +1 for Correct, <strong className="text-red-500">-0.5 for Wrong</strong>. Use "I Don't Know" to avoid penalty.
                                </div>
                                <div className="bg-blue-900/10 p-2 rounded border border-blue-500/20">
                                   <strong className="text-blue-400">Software & Tools (Tech Skills):</strong> +1 for Correct, <strong className="text-white">NO Negative Marking</strong>.
                                </div>
                                <div className="bg-green-900/10 p-2 rounded border border-green-500/20">
                                   <strong className="text-green-400">Psychometric Questions:</strong> Evaluates culture fit. <strong className="text-white">NO Negative Marking</strong>. Answer honestly.
                                </div>
                            </div>
                        </div>

                        <div onClick={() => setAgreed(!agreed)} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 mb-6 ${agreed ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-800 border-slate-700 hover:bg-slate-750'}`}>
                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${agreed ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                                {agreed && <CheckCircle size={12} className="text-white"/>}
                            </div>
                            <p className="text-sm text-slate-300 select-none">I understand the Tech & Psychometric rules and agree to the Terms.</p>
                        </div>

                        <div className="flex gap-4 mt-auto">
                            <button onClick={() => window.location.href = '/student/dashboard'} className="px-6 py-3 rounded-xl font-bold border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
                            <button onClick={handleStartTest} disabled={!agreed || !mediaAllowed || !aiModelsLoaded || (examScope.length === 0 && !generatingAIQuestions)} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${agreed && mediaAllowed && aiModelsLoaded ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
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
         <p className="text-red-200 text-xl mb-8 max-w-lg">Violation of Anti-Cheat Rules Detected.<br/>Your attempt is locked.</p>
         <button onClick={() => window.location.href = '/student/dashboard'} className="bg-white text-red-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">Return to Dashboard</button>
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
         <p className="text-slate-400 text-sm mb-8">Your Technical & Behavioral analytics have been securely recorded.</p>
         
         <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-2xl mb-8 shadow-2xl">
            <p className="text-slate-500 text-sm uppercase font-bold mb-2">Final Overall Score</p>
            <p className="text-6xl font-bold text-green-400 mb-6">{score} <span className="text-2xl text-slate-500">/ {questions.length}</span></p>

            <div className="border-t border-slate-800 pt-6 text-left">
               <h4 className="text-slate-400 text-sm font-bold uppercase mb-4 flex items-center gap-2">
                  <Award size={18}/> Skill & Culture Fit Report
               </h4>
               <div className="space-y-4">
                  {Object.keys(skillAnalytics).map(skill => {
                     const isPsycho = skill === "Psychometric & Behavioral Fit";
                     
                     const techSkillNames = Array.isArray(studentProfile?.technologicalSkills) 
                        ? studentProfile.technologicalSkills.map((s:any) => typeof s === 'string' ? s : s.name) 
                        : [];
                     const isTechSkill = techSkillNames.includes(skill);
                     
                     return (
                     <div key={skill} className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${isPsycho ? 'bg-purple-950/40 border-purple-500/30' : isTechSkill ? 'bg-blue-950/40 border-blue-500/30' : 'bg-slate-950 border-slate-800'}`}>
                        <div>
                           <span className={`font-bold text-lg ${isPsycho ? 'text-purple-300' : isTechSkill ? 'text-blue-300' : 'text-white'}`}>{isTechSkill ? `💻 ${skill}` : skill}</span>
                           <p className="text-xs text-slate-500 mt-1">Score: {Math.max(0, skillAnalytics[skill].scoreCount)} / {skillAnalytics[skill].total}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border font-bold text-sm text-center ${skillAnalytics[skill].aiLevel.includes('Expert') ? 'bg-green-900/30 text-green-400 border-green-500/30' : skillAnalytics[skill].aiLevel.includes('Intermediate') ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' : 'bg-red-900/30 text-red-400 border-red-500/30'}`}>
                           {skillAnalytics[skill].aiLevel}
                        </div>
                     </div>
                  )})}
               </div>
            </div>
         </div>
         <button onClick={() => window.location.href = '/student/dashboard'} className="bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20 mb-10">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white p-4 select-none" onContextMenu={(e)=>e.preventDefault()}>
       
       <AnimatePresence>
         {testStarted && (
           <motion.div 
              drag 
              dragConstraints={{ left: -1000, right: 20, top: -800, bottom: 20 }} 
              dragElastic={0.1}
              className="fixed bottom-6 right-6 w-40 h-32 md:w-56 md:h-40 bg-black border-2 border-red-500/50 rounded-2xl overflow-hidden shadow-2xl z-50 cursor-move"
           >
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100 opacity-80 pointer-events-none" />
              <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest animate-pulse flex items-center gap-1 pointer-events-none">
                 <Video size={10}/> Proctoring Active
              </div>
              <div className="absolute bottom-1 right-1 bg-black/50 p-1 rounded backdrop-blur-sm pointer-events-none">
                 <Move size={14} className="text-white/70" />
              </div>
           </motion.div>
         )}
       </AnimatePresence>
       
       <canvas ref={canvasRef} width="64" height="48" className="hidden" />

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
             {bonusRoundTaken && (
                <div className="text-xs font-bold text-purple-400 bg-purple-900/20 border border-purple-500/30 px-3 py-1 rounded-lg">
                    ✨ Bonus Round Active
                </div>
             )}
          </div>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
             <div className={`px-2 py-1 rounded border ${faceWarnings > 0 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>Face: {MAX_FACE_WARNINGS - faceWarnings} Left</div>
             <div className={`hidden md:block px-2 py-1 rounded border ${tabWarnings > 0 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>Tab: {MAX_TAB_WARNINGS - tabWarnings} Left</div>
             <div className={`hidden md:block px-2 py-1 rounded border ${micWarnings > 0 ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>Mic: {MAX_MIC_WARNINGS - micWarnings} Left</div>
          </div>
       </div>

       <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
             <span className="text-slate-400 font-medium">Question <span className="text-white font-bold">{currentQ + 1}</span> / {questions.length}</span>
             
             {questions.length > 0 && questions[currentQ].category === "Psychometric" && (
                 <span className="bg-purple-900/40 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">Behavioral (No Neg Marking)</span>
             )}
             
             {questions.length > 0 && questions[currentQ].category !== "Psychometric" && Array.isArray(studentProfile?.technologicalSkills) && studentProfile.technologicalSkills.some((s:any) => (typeof s === 'string' ? s : s.name) === questions[currentQ].skill) && (
                 <span className="bg-blue-900/40 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Tech Tool (No Neg Marking)</span>
             )}

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
                   {questions[currentQ].options.map((opt: string, index: number) => {
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
          )}

          <div className="flex justify-between mt-8 pb-10">
             <button 
                onClick={() => setCurrentQ(p => Math.max(0, p - 1))} 
                disabled={currentQ === 0} 
                className="px-6 py-3 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
                Previous
             </button>
             {currentQ < questions.length - 1 ? (
                <button onClick={() => setCurrentQ(p => p+1)} className="px-8 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-900/20">
                   Next Question
                </button>
             ) : (
                <button onClick={handlePreSubmit} className="px-8 py-3 bg-green-600 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-900/20">
                   Submit Assessment
                </button>
             )}
          </div>
       </div>
       <style jsx global>{`body { user-select: none; }`}</style>
    </div>
  );
}