"use client";
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Loader2 } from "lucide-react";

// 🔥 Naya Master Button Component 🔥
import Button from "@/app/components/ui/Button";

export default function DownloadReportButton({ candidate, buttonStyle = "default" }: { candidate: any, buttonStyle?: "default" | "admin" }) {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!reportRef.current) return;
        setIsDownloading(true);

        try {
            const container = document.getElementById("pdf-hidden-container");
            if (container) {
                container.style.opacity = "1";
                container.style.visibility = "visible";
                container.style.position = "absolute"; 
                container.style.top = "0";
                container.style.left = "0";
                container.style.zIndex = "-1000";
            }

            // High quality canvas generation with dynamic height
            const canvas = await html2canvas(reportRef.current, { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: "#ffffff", 
                logging: false,
                windowWidth: 794 // A4 width at 96 DPI
            });

            const imgData = canvas.toDataURL("image/png");

            // Dynamic Auto-Pagination Logic
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = pdfWidth / imgWidth;
            const totalPdfHeight = imgHeight * ratio;
            
            let heightLeft = totalPdfHeight;
            let position = 0;
            let currentPage = 1;

            // First Page
            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, totalPdfHeight);
            heightLeft -= pdfHeight;

            // Subsequent Pages
            while (heightLeft > 0) {
                position = position - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, totalPdfHeight);
                heightLeft -= pdfHeight;
                currentPage++;
            }

            // Add Footer with Dynamic Page Numbers on all pages
            for (let i = 1; i <= currentPage; i++) {
                pdf.setPage(i);
                pdf.setFontSize(9);
                pdf.setTextColor(150, 150, 150);
                pdf.text(`Talexo Technologies Pvt. Ltd. | Verified Report`, 15, pdfHeight - 10);
                pdf.text(`Page ${i} of ${currentPage}`, pdfWidth - 25, pdfHeight - 10);
            }

            if (container) {
                container.style.opacity = "0";
                container.style.visibility = "hidden";
                container.style.position = "fixed";
            }

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
    const totalWarnings = meta.warningsCount || (warningsData.tab + warningsData.mic + warningsData.cam + warningsData.face) || 0;

    const profileImage = candidate?.photoURL || candidate?.avatar || null;
    const educations = Array.isArray(candidate?.educations) ? candidate.educations : [];
    const experience = Array.isArray(candidate?.workExperience) ? candidate.workExperience : [];
    
    const skills = Array.isArray(candidate?.skills) ? candidate.skills : [];
    const behavioralSkills = Array.isArray(candidate?.behavioralSkills) ? candidate.behavioralSkills : [];
    const technologicalSkills = Array.isArray(candidate?.technologicalSkills) ? candidate.technologicalSkills : [];
    const achievements = Array.isArray(candidate?.achievements) ? candidate.achievements : [];

    return (
        <>
            {/* 🔥 SIRF YE BUTTON MASTER COMPONENT SE REPLACE HUA HAI 🔥 */}
            <Button 
                variant={buttonStyle === "admin" ? "secondary" : "primary"}
                onClick={handleDownload} 
                disabled={isDownloading || status === "Pending"}
                className={`w-full md:w-auto ${buttonStyle === "admin" ? "py-2.5 text-sm" : ""}`}
            >
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {isDownloading ? "Generating HD Report..." : "Download Verified Report"}
            </Button>

            {/* 🔥 PDF KA HIDDEN CONTAINER BILKUL WAISE HI RAKHA HAI 🔥 */}
            <div id="pdf-hidden-container" style={{ position: "fixed", top: 0, left: "-9999px", opacity: 0, visibility: "hidden", zIndex: -100, pointerEvents: "none", width: "794px" }}>
                
                <div ref={reportRef} style={{ width: "794px", padding: "40px", boxSizing: "border-box", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif", color: "#1e293b", height: "auto", minHeight: "1123px" }}>
                    
                    {/* Header: PERFECT LOGO ALIGNMENT */}
                    <table style={{ width: "100%", borderBottom: "2px solid #e2e8f0", paddingBottom: "15px", marginBottom: "25px", borderCollapse: "collapse" }}>
                        <tbody>
                            <tr>
                                <td style={{ verticalAlign: "middle", textAlign: "left", width: "50%" }}>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "40px", height: "40px", backgroundColor: "#0f172a", borderRadius: "8px", color: "#ffffff", fontSize: "24px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            T
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: "1" }}>Talexo</div>
                                            <div style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" }}>Executive Profile & Assessment</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ verticalAlign: "middle", textAlign: "right", width: "50%" }}>
                                    <div style={{ backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold", display: "inline-block", marginBottom: "6px" }}>
                                        ✔ AI Verified Profile
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700 }}>Date: {new Date(meta.lastAttempt || Date.now()).toLocaleDateString('en-GB')} | Ref ID: TX-{candidate?.id?.substring(0,8).toUpperCase() || "N/A"}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* SECTION 1: CANDIDATE PROFILE */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
                        {/* Avatar */}
                        <div style={{ width: "100px", flexShrink: 0 }}>
                            <div style={{ width: "100px", height: "100px", backgroundColor: "#f1f5f9", color: "#3b82f6", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", fontWeight: 800, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                                {profileImage ? <img src={profileImage} crossOrigin="anonymous" alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (candidate?.fullName?.charAt(0) || "C")}
                            </div>
                        </div>
                        
                        {/* Core Info */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <h1 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 6px 0", color: "#0f172a" }}>{candidate?.fullName || "Candidate Name"}</h1>
                            <div style={{ fontSize: "14px", color: "#475569", fontWeight: 600, display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "10px" }}>
                                <span>📧 {candidate?.email || "N/A"}</span>
                                <span>📱 {candidate?.phone || "N/A"}</span>
                                <span>📍 {candidate?.city || "Location N/A"}</span>
                            </div>
                            {candidate?.bio && (
                                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: "1.6", margin: 0, fontStyle: "italic", borderLeft: "3px solid #cbd5e1", paddingLeft: "10px", whiteSpace: "pre-wrap" }}>
                                    "{candidate.bio}"
                                </p>
                            )}
                        </div>
                    </div>

                    {/* SECTION 2: PROFESSIONAL BACKGROUND */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "35px" }}>
                        
                        {/* Left Column: Experience, Education, Achievements */}
                        <div style={{ flex: "2" }}>
                            
                            {/* Experience */}
                            <h3 style={{ fontSize: "15px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "6px", marginBottom: "12px", margin: 0 }}>Work Experience ({candidate?.experience || "Fresher"})</h3>
                            {experience.length > 0 ? (
                                <div style={{ marginBottom: "20px" }}>
                                    {experience.map((exp: any, i: number) => (
                                        <div key={i} style={{ marginBottom: "10px" }}>
                                            <div style={{ fontSize: "14px", fontWeight: 800, color: "#1e293b" }}>{exp.role} <span style={{ fontWeight: 400, color: "#64748b" }}>at</span> {exp.company}</div>
                                            <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>{exp.duration}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>No prior work experience listed.</p>
                            )}

                            {/* Education (Now with Maths Score) */}
                            <h3 style={{ fontSize: "15px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "6px", marginBottom: "12px", margin: 0 }}>Education & Credentials</h3>
                            {educations.length > 0 ? (
                                <div style={{ marginBottom: "20px" }}>
                                    {educations.map((edu: any, i: number) => {
                                        const isSchoolLevel = /(10th|12th|class 10|class 12|high school|secondary|intermediate|puc|matric|board|ssc|hsc|cbse|icse|\b10\b|\b12\b|^10$|^12$|x|xii)/i.test((edu.qualification || '').toLowerCase());
                                        return (
                                            <div key={i} style={{ marginBottom: "10px" }}>
                                                <div style={{ fontSize: "14px", fontWeight: 800, color: "#1e293b" }}>
                                                    {edu.qualification} {edu.stageCleared ? `(${edu.stageCleared})` : ""}
                                                    {/* 🔥 MATHS SCORE RENDER 🔥 */}
                                                    {isSchoolLevel && edu.mathsIncluded === 'Yes' && edu.mathsScore && (
                                                        <span style={{ fontSize: "10px", backgroundColor: "#e0f2fe", color: "#2563eb", padding: "2px 6px", borderRadius: "4px", marginLeft: "8px", verticalAlign: "middle" }}>Maths: {edu.mathsScore}%</span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>{edu.collegeName} • {edu.passingYear} {edu.percentage ? `• ${edu.percentage}%` : ""}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>No education listed.</p>
                            )}

                            {/* 🔥 NEW: ACHIEVEMENTS 🔥 */}
                            {achievements.length > 0 && (
                                <div>
                                    <h3 style={{ fontSize: "15px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "6px", marginBottom: "12px", margin: 0 }}>Key Achievements</h3>
                                    {achievements.map((ach: any, i: number) => (
                                        <div key={i} style={{ marginBottom: "10px" }}>
                                            <div style={{ fontSize: "14px", fontWeight: 800, color: "#1e293b" }}>🏆 {ach.title}</div>
                                            <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 500, fontStyle: "italic", marginTop: "2px" }}>{ach.description}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* Right Column: Skills (Core, Behavioral, Tech) */}
                        <div style={{ flex: "1" }}>
                            
                            {/* Core Skills */}
                            <h3 style={{ fontSize: "15px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "6px", marginBottom: "12px", margin: 0 }}>Core Domain Skills</h3>
                            {skills.length > 0 ? (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                                    {skills.map((skill: string, i: number) => (
                                        <span key={i} style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: "#334155" }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>No skills mapped.</p>
                            )}

                            {/* 🔥 NEW: Behavioral Skills 🔥 */}
                            <h3 style={{ fontSize: "15px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "6px", marginBottom: "12px", margin: 0 }}>Behavioral Skills</h3>
                            {behavioralSkills.length > 0 ? (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                                    {behavioralSkills.map((skill: string, i: number) => (
                                        <span key={i} style={{ backgroundColor: "#faf5ff", border: "1px solid #e9d5ff", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: "#7e22ce" }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>No behavioral skills mapped.</p>
                            )}

                            {/* 🔥 NEW: Technological Skills 🔥 */}
                            <h3 style={{ fontSize: "15px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "6px", marginBottom: "12px", margin: 0 }}>Software & Tools</h3>
                            {technologicalSkills.length > 0 ? (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                                    {technologicalSkills.map((skill: any, i: number) => {
                                        const skillName = typeof skill === 'string' ? skill : skill.name;
                                        const skillLevel = typeof skill === 'object' && skill.level ? skill.level : 'Beginner';
                                        return (
                                            <span key={i} style={{ backgroundColor: "#fdf2f8", border: "1px solid #fbcfe8", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: "#be185d" }}>
                                                {skillName} ({skillLevel})
                                            </span>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>No tools mapped.</p>
                            )}
                            
                        </div>
                    </div>

                    {/* SPACER FOR SEPARATION */}
                    <div style={{ height: "20px", backgroundColor: "#f8fafc", margin: "0 -40px 30px -40px", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}></div>

                    {/* SECTION 3: ASSESSMENT METRICS */}
                    <table style={{ width: "100%", marginBottom: "30px", borderCollapse: "separate", borderSpacing: "0" }}>
                        <tbody>
                            <tr>
                                <td style={{ width: "65%", backgroundColor: "#0f172a", padding: "24px", borderRadius: "16px", color: "#ffffff", verticalAlign: "middle" }}>
                                    <div style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 800, letterSpacing: "1px", marginBottom: "6px" }}>Final Proctored Assessment Score</div>
                                    <div>
                                        <span style={{ fontSize: "56px", fontWeight: 900, lineHeight: 1, marginRight: "8px" }}>{totalScore}</span>
                                        <span style={{ fontSize: "16px", color: "#cbd5e1", fontWeight: 600 }}>Points Achieved</span>
                                    </div>
                                </td>
                                <td style={{ width: "3%" }}></td> 
                                <td style={{ width: "32%", padding: "24px", borderRadius: "16px", border: `2px solid ${totalWarnings > 0 ? "#fecaca" : "#bbf7d0"}`, textAlign: "center", backgroundColor: totalWarnings > 0 ? "#fef2f2" : "#f0fdf4", verticalAlign: "middle" }}>
                                    <div style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: 800, color: totalWarnings > 0 ? "#991b1b" : "#166534", marginBottom: "8px" }}>Integrity & Proctoring</div>
                                    <div style={{ fontSize: "20px", fontWeight: 900, color: totalWarnings > 0 ? "#b91c1c" : "#15803d" }}>
                                        {totalWarnings > 0 ? `⚠ ${totalWarnings} Warnings` : "✔ Clear Record"}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* SECTION 4: SKILL ANALYTICS */}
                    <div style={{ marginBottom: "30px" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px", margin: 0 }}>
                            Domain-Specific Skill & Culture Fit Analysis
                        </h3>
                        <div style={{ marginTop: "16px" }}>
                            {Object.keys(skillScores).length > 0 ? Object.keys(skillScores).map((skill, i) => {
                                const data = skillScores[skill];
                                const score = Math.max(0, data.scoreCount || data.correct || 0);
                                const total = data.total || 5;
                                const percentage = (score / total) * 100;
                                
                                const isPsycho = skill.includes('Psychometric');
                                
                                // Check if it's a Tech Skill
                                const techSkillNames = technologicalSkills.map((s:any) => typeof s === 'string' ? s : s.name);
                                const isTechSkill = techSkillNames.includes(skill);

                                const isExpert = data.aiLevel?.includes('Expert');
                                const isInter = data.aiLevel?.includes('Intermediate');
                                
                                // Color logic based on skill type
                                const color = isPsycho ? "#a855f7" : isTechSkill ? "#ec4899" : (isExpert ? "#16a34a" : isInter ? "#d97706" : "#dc2626");

                                return (
                                    <div key={i} style={{ padding: "16px", borderRadius: "12px", border: `1px solid ${isPsycho ? '#d8b4fe' : isTechSkill ? '#fbcfe8' : '#e2e8f0'}`, backgroundColor: isPsycho ? '#faf5ff' : isTechSkill ? '#fdf2f8' : '#f8fafc', marginBottom: "16px" }}>
                                        <table style={{ width: "100%", marginBottom: "10px", borderCollapse: "collapse" }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ textAlign: "left" }}>
                                                        <div style={{ fontSize: "15px", fontWeight: 800, color: isPsycho ? "#7e22ce" : isTechSkill ? "#be185d" : "#1e293b" }}>
                                                            {isPsycho ? "🧠 Behavioral & Culture Fit" : isTechSkill ? `💻 ${skill}` : skill}
                                                        </div>
                                                        <div style={{ fontSize: "12px", fontWeight: 700, color: color, marginTop: "4px" }}>{data.aiLevel}</div>
                                                    </td>
                                                    <td style={{ textAlign: "right", verticalAlign: "bottom" }}>
                                                        <div style={{ fontSize: "16px", fontWeight: 900, color: "#334155" }}>{score} / {total}</div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div style={{ width: "100%", backgroundColor: "#e2e8f0", borderRadius: "8px", height: "8px", overflow: "hidden" }}>
                                            <div style={{ height: "100%", backgroundColor: color, width: `${Math.max(5, percentage)}%`, borderRadius: "8px" }}></div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <p style={{ fontSize: "14px", color: "#64748b", fontStyle: "italic" }}>No skill analytics available.</p>
                            )}
                        </div>
                    </div>

                    {/* SECTION 5: AI REPORT */}
                    <div style={{ flex: 1, paddingBottom: "20px" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", margin: "0 0 20px 0" }}>
                            AI Assessor's Executive Evaluation
                        </h3>
                        <div style={{ padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                            <div style={{ fontSize: "14px", color: "#334155", lineHeight: "1.8", whiteSpace: "pre-wrap", fontWeight: 500 }}>
                                {aiReport}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}