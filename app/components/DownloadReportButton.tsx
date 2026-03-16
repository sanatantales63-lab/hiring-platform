"use client";
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Loader2 } from "lucide-react";

export default function DownloadReportButton({ candidate, buttonStyle = "default" }: { candidate: any, buttonStyle?: "default" | "admin" }) {
    const page1Ref = useRef<HTMLDivElement>(null);
    const page2Ref = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!page1Ref.current || !page2Ref.current) return;
        setIsDownloading(true);
        try {
            const container = document.getElementById("pdf-hidden-container");
            if (container) {
                container.style.opacity = "1";
                container.style.visibility = "visible";
            }

            const options = { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false };
            
            const canvas1 = await html2canvas(page1Ref.current, options);
            const imgData1 = canvas1.toDataURL("image/png");
            
            const canvas2 = await html2canvas(page2Ref.current, options);
            const imgData2 = canvas2.toDataURL("image/png");

            if (container) {
                container.style.opacity = "0";
                container.style.visibility = "hidden";
            }

            const pdf = new jsPDF("p", "mm", "a4");
            pdf.addImage(imgData1, "PNG", 0, 0, 210, 297);
            pdf.addPage();
            pdf.addImage(imgData2, "PNG", 0, 0, 210, 297);
            
            pdf.save(`${candidate?.fullName?.replace(/\s+/g, '_') || "Candidate"}_Talexo_Verified_Report.pdf`);
        } catch (error) {
            console.error("Error generating PDF", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const meta = candidate?.meta || {};
    const skillScores = meta.skillScores || {};
    const totalScore = meta.totalScore || 0;
    const aiReport = meta.ai_detailed_report || "AI detailed analysis is pending or not available for this candidate.";
    const status = meta.status || "Pending";
    
    const warningsData = meta.warnings || { tab: 0, mic: 0, cam: 0, face: 0 };
    const tabW = warningsData.tab || 0;
    const micW = warningsData.mic || 0;
    const camW = warningsData.cam || 0;
    const faceW = warningsData.face || 0;
    const totalWarnings = meta.warningsCount || (tabW + micW + camW + faceW) || 0;

    const profileImage = candidate?.photoURL || candidate?.avatar || null;

    return (
        <>
            <button 
                onClick={handleDownload} 
                disabled={isDownloading || status === "Pending"}
                className={`flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    ${buttonStyle === "admin" 
                        ? "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm" 
                        : "bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-900/20 w-full md:w-auto"
                    }`}
            >
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {isDownloading ? "Generating HD Report..." : "Download Verified Report"}
            </button>

            {/* 🔥 HIDDEN A4 CONTAINER (PURE CSS, PERFECT ALIGNMENT) 🔥 */}
            <div id="pdf-hidden-container" style={{ position: "fixed", top: 0, left: 0, opacity: 0, visibility: "hidden", zIndex: -100, pointerEvents: "none" }}>
                
                {/* ================= PAGE 1 ================= */}
                <div 
                    ref={page1Ref} 
                    style={{ width: "794px", height: "1123px", padding: "40px", boxSizing: "border-box", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif" }}
                >
                    {/* STRICT HEADER */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #e2e8f0", paddingBottom: "20px", marginBottom: "30px" }}>
                        
                        {/* Left Side: Logo */}
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                {/* EXACT Pixel Match for Logo box and Text */}
                                <div style={{ width: "36px", height: "36px", backgroundColor: "#2563eb", borderRadius: "8px", color: "#ffffff", fontSize: "24px", fontWeight: 900, textAlign: "center", lineHeight: "36px" }}>
                                    T
                                </div>
                                <div style={{ fontSize: "36px", fontWeight: 900, color: "#1e293b", marginLeft: "12px", lineHeight: "36px", letterSpacing: "-0.5px" }}>
                                    Talexo
                                </div>
                            </div>
                            <div style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", marginTop: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Executive Skill Assessment Report
                            </div>
                        </div>

                        {/* Right Side: Badges */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            {/* LOCKED Verified Badge */}
                            <div style={{ display: "inline-block", backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "6px 16px", borderRadius: "50px", fontSize: "14px", fontWeight: "bold", marginBottom: "8px", lineHeight: "20px", whiteSpace: "nowrap" }}>
                                ✔ Verified Profile
                            </div>
                            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700, marginBottom: "4px" }}>Date: {new Date(meta.lastAttempt || Date.now()).toLocaleDateString('en-GB')}</div>
                            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700 }}>Ref ID: TX-{candidate?.id?.substring(0,8).toUpperCase() || "N/A"}</div>
                        </div>
                    </div>

                    {/* Candidate Info */}
                    <div style={{ display: "flex", gap: "24px", alignItems: "center", backgroundColor: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "30px" }}>
                        <div style={{ width: "90px", height: "90px", flexShrink: 0, borderRadius: "50%", border: "4px solid #ffffff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: "hidden", backgroundColor: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {profileImage ? (
                                <img src={profileImage} crossOrigin="anonymous" alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            ) : (
                                <span style={{ color: "#2563eb", fontSize: "36px", fontWeight: 800 }}>{candidate?.fullName?.charAt(0) || "C"}</span>
                            )}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                            <div style={{ width: "50%", marginBottom: "16px" }}>
                                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 800, marginBottom: "4px" }}>Candidate Name</div>
                                <div style={{ fontSize: "18px", color: "#0f172a", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{candidate?.fullName || "N/A"}</div>
                            </div>
                            <div style={{ width: "50%", marginBottom: "16px" }}>
                                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 800, marginBottom: "4px" }}>Contact Email</div>
                                <div style={{ fontSize: "15px", color: "#334155", fontWeight: 600 }}>{candidate?.email || "N/A"}</div>
                            </div>
                            <div style={{ width: "50%" }}>
                                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 800, marginBottom: "4px" }}>Highest Education</div>
                                <div style={{ fontSize: "15px", color: "#334155", fontWeight: 600 }}>{candidate?.educations?.[0]?.degree || "N/A"} - {candidate?.educations?.[0]?.institution || "N/A"}</div>
                            </div>
                            <div style={{ width: "50%" }}>
                                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 800, marginBottom: "4px" }}>Professional Experience</div>
                                <div style={{ fontSize: "15px", color: "#334155", fontWeight: 600 }}>{candidate?.experience || "Fresher"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Top Metrics */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
                        <div style={{ flex: 2, backgroundColor: "#1e3a8a", padding: "30px", borderRadius: "16px", color: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div style={{ fontSize: "12px", color: "#93c5fd", textTransform: "uppercase", fontWeight: 800, letterSpacing: "1px", marginBottom: "8px" }}>Overall Assessment Score</div>
                            <div style={{ display: "flex", alignItems: "baseline" }}>
                                <span style={{ fontSize: "64px", fontWeight: 900, lineHeight: 1, marginRight: "8px" }}>{totalScore}</span>
                                <span style={{ fontSize: "20px", color: "#bfdbfe", fontWeight: 600 }}>Points Achieved</span>
                            </div>
                        </div>
                        <div style={{ flex: 1, padding: "30px", borderRadius: "16px", border: `2px solid ${totalWarnings > 0 ? "#fecaca" : "#bbf7d0"}`, textAlign: "center", backgroundColor: totalWarnings > 0 ? "#fef2f2" : "#f0fdf4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 800, color: totalWarnings > 0 ? "#991b1b" : "#166534", marginBottom: "8px", whiteSpace: "nowrap" }}>Integrity Status</div>
                            <div style={{ fontSize: "24px", fontWeight: 900, color: totalWarnings > 0 ? "#b91c1c" : "#15803d", whiteSpace: "nowrap" }}>
                                {totalWarnings > 0 ? `⚠ ${totalWarnings} Warnings` : "✔ Clear Record"}
                            </div>
                        </div>
                    </div>

                    {/* Skill Analytics */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px", margin: 0 }}>
                            Domain-Specific Skill Analysis
                        </h3>
                        <div style={{ marginTop: "16px" }}>
                            {Object.keys(skillScores).length > 0 ? Object.keys(skillScores).map((skill, i) => {
                                const data = skillScores[skill];
                                const score = Math.max(0, data.scoreCount || data.correct || 0);
                                const total = data.total || 5;
                                const percentage = (score / total) * 100;
                                const isExpert = data.aiLevel?.includes('Expert');
                                const isInter = data.aiLevel?.includes('Intermediate');
                                const color = isExpert ? "#16a34a" : isInter ? "#d97706" : "#dc2626";

                                return (
                                    <div key={i} style={{ padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", marginBottom: "16px" }}>
                                        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "12px" }}>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <div style={{ fontSize: "16px", fontWeight: 800, color: "#1e293b", margin: 0 }}>{skill}</div>
                                                <div style={{ fontSize: "13px", fontWeight: 700, margin: "4px 0 0 0", color: color }}>{data.aiLevel}</div>
                                            </div>
                                            <div style={{ fontSize: "18px", fontWeight: 900, color: "#334155", margin: 0 }}>{score} / {total}</div>
                                        </div>
                                        <div style={{ width: "100%", backgroundColor: "#e2e8f0", borderRadius: "8px", height: "10px", overflow: "hidden" }}>
                                            <div style={{ height: "100%", backgroundColor: color, width: `${Math.max(5, percentage)}%`, borderRadius: "8px" }}></div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <p style={{ fontSize: "14px", color: "#64748b", fontStyle: "italic" }}>No skill analytics available.</p>
                            )}
                        </div>
                    </div>

                    {/* Page 1 Footer */}
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", borderTop: "2px solid #e2e8f0", paddingTop: "16px", marginTop: "auto" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div style={{ fontSize: "12px", fontWeight: 800, color: "#64748b" }}>Talexo Technologies Pvt. Ltd.</div>
                            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Verify at <span style={{ color: "#2563eb", fontWeight: 600 }}>www.talexo.in</span></div>
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: 800, color: "#cbd5e1", display: "flex", alignItems: "flex-end" }}>Page 1 of 2</div>
                    </div>
                </div>

                {/* ================= PAGE 2 ================= */}
                <div 
                    ref={page2Ref} 
                    style={{ width: "794px", height: "1123px", padding: "40px", boxSizing: "border-box", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif" }}
                >
                    {/* Header (Mini) */}
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", borderBottom: "2px solid #e2e8f0", paddingBottom: "20px", marginBottom: "30px", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ width: "24px", height: "24px", backgroundColor: "#2563eb", borderRadius: "6px", color: "#ffffff", fontSize: "16px", fontWeight: 900, textAlign: "center", lineHeight: "24px" }}>T</div>
                            <div style={{ fontSize: "24px", fontWeight: 900, color: "#1e293b", marginLeft: "10px", lineHeight: "24px" }}>Talexo</div>
                            <span style={{ fontSize: "18px", color: "#cbd5e1", margin: "0 10px" }}>|</span>
                            <span style={{ fontSize: "16px", color: "#64748b", fontWeight: 700 }}>Detailed Assessment Log</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>Ref ID: TX-{candidate?.id?.substring(0,8).toUpperCase() || "N/A"}</div>
                    </div>

                    {/* Integrity Log */}
                    <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", margin: "0 0 20px 0" }}>
                            Proctoring & Integrity Breakdown
                        </h3>
                        <div style={{ display: "flex", width: "100%", gap: "16px" }}>
                            <div style={{ flex: 1, padding: "20px", borderRadius: "12px", border: `1px solid ${tabW > 0 ? "#fecaca" : "#e2e8f0"}`, backgroundColor: tabW > 0 ? "#fef2f2" : "#f8fafc" }}>
                                <div style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "8px", whiteSpace: "nowrap" }}>Tab Switches</div>
                                <div style={{ fontSize: "22px", fontWeight: 900, color: tabW > 0 ? "#dc2626" : "#0f172a", whiteSpace: "nowrap" }}>{tabW} Detected</div>
                            </div>
                            <div style={{ flex: 1, padding: "20px", borderRadius: "12px", border: `1px solid ${micW > 0 ? "#fecaca" : "#e2e8f0"}`, backgroundColor: micW > 0 ? "#fef2f2" : "#f8fafc" }}>
                                <div style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "8px", whiteSpace: "nowrap" }}>Audio Alerts</div>
                                <div style={{ fontSize: "22px", fontWeight: 900, color: micW > 0 ? "#dc2626" : "#0f172a", whiteSpace: "nowrap" }}>{micW} Detected</div>
                            </div>
                            <div style={{ flex: 1, padding: "20px", borderRadius: "12px", border: `1px solid ${(camW + faceW) > 0 ? "#fecaca" : "#e2e8f0"}`, backgroundColor: (camW + faceW) > 0 ? "#fef2f2" : "#f8fafc" }}>
                                <div style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "8px", whiteSpace: "nowrap" }}>Video/Face Alerts</div>
                                <div style={{ fontSize: "22px", fontWeight: 900, color: (camW + faceW) > 0 ? "#dc2626" : "#0f172a", whiteSpace: "nowrap" }}>{camW + faceW} Detected</div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed AI Report */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", margin: "0 0 20px 0" }}>
                            AI Assessor's Evaluation
                        </h3>
                        <div style={{ padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                            <div style={{ fontSize: "14px", color: "#334155", lineHeight: "1.8", whiteSpace: "pre-wrap", fontWeight: 500 }}>
                                {aiReport}
                            </div>
                        </div>
                    </div>

                    {/* Page 2 Footer */}
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", borderTop: "2px solid #e2e8f0", paddingTop: "16px", marginTop: "auto" }}>
                        <div style={{ width: "80%" }}>
                            <div style={{ fontSize: "10px", color: "#94a3b8", lineHeight: "1.5" }}>
                                This report is securely generated by Talexo's AI Assessment Engine. The scores and evaluations are strictly based on the candidate's performance during the proctored session.
                            </div>
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: 800, color: "#cbd5e1", display: "flex", alignItems: "flex-end" }}>Page 2 of 2</div>
                    </div>
                </div>

            </div>
        </>
    );
}