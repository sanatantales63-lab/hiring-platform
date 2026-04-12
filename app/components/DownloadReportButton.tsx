"use client";
import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Loader2 } from "lucide-react";
import Button from "@/app/components/ui/Button";

export default function DownloadReportButton({ candidate, buttonStyle = "default" }: { candidate: any, buttonStyle?: "default" | "admin" }) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
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

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth(); 
            const pdfHeight = pdf.internal.pageSize.getHeight(); 

            const pages = ["pdf-page-1", "pdf-page-2", "pdf-page-3"];

            for (let i = 0; i < pages.length; i++) {
                const pageElement = document.getElementById(pages[i]);
                if (!pageElement) continue;

                const canvas = await html2canvas(pageElement, { 
                    scale: 2, 
                    useCORS: true, 
                    backgroundColor: "#ffffff", 
                    logging: false,
                    width: 794,
                    height: 1123
                });

                const imgData = canvas.toDataURL("image/png");

                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

                // Premium Footer
                pdf.setFontSize(8);
                pdf.setTextColor(150, 150, 150);
                pdf.text(`Talexo Technologies Pvt. Ltd. | Verified Executive Report`, 15, pdfHeight - 10);
                pdf.text(`Page ${i + 1} of ${pages.length}`, pdfWidth - 20, pdfHeight - 10);
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

    const dobToDisplay = candidate?.dob || "Not Provided";
    const panToDisplay = candidate?.panCard || "Not Provided";
    const expSalaryToDisplay = candidate?.expectedSalary || "Not Provided";
    const curSalaryToDisplay = candidate?.currentSalary || "Not Provided";
    const noticeToDisplay = candidate?.noticePeriod || "Not Provided";
    const workModeToDisplay = candidate?.workMode || "On-site";
    const refID = candidate?.id?.substring(0,8).toUpperCase() || "N/A";
    const reportDate = new Date(meta.lastAttempt || Date.now()).toLocaleDateString('en-GB');

    return (
        <>
            <Button 
                variant={buttonStyle === "admin" ? "secondary" : "primary"}
                onClick={handleDownload} 
                disabled={isDownloading || status === "Pending"}
                className={`w-full md:w-auto ${buttonStyle === "admin" ? "py-2.5 text-sm" : ""}`}
            >
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {isDownloading ? "Generating Premium Report..." : "Download Verified Report"}
            </Button>

            {/* STRICLY NO TAILWIND CLASSES INSIDE THIS CONTAINER */}
            <div id="pdf-hidden-container" style={{ position: "fixed", top: 0, left: "-9999px", opacity: 0, visibility: "hidden", zIndex: -100, pointerEvents: "none", color: "#0f172a" }}>
                
                {/* ================= PAGE 1: EXECUTIVE SUMMARY & SCORE ================= */}
                <div id="pdf-page-1" style={{ width: "794px", height: "1123px", padding: "40px", backgroundColor: "#ffffff", boxSizing: "border-box", overflow: "hidden", fontFamily: "Helvetica, Arial, sans-serif", color: "#0f172a" }}>
                    
                    {/* Perfect Header Table */}
                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderBottom: "2px solid #0f947e", paddingBottom: "10px", marginBottom: "25px" }}>
                        <tbody>
                            <tr>
                                <td valign="bottom" style={{ width: "50%" }}>
                                    <h1 style={{ margin: "0 0 4px 0", fontSize: "28px", color: "#0f172a", fontWeight: "bold", letterSpacing: "-0.5px" }}>Talexo</h1>
                                    <span style={{ color: "#64748b", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Executive Profile & Assessment</span>
                                </td>
                                <td align="right" valign="bottom" style={{ width: "50%" }}>
                                    <div style={{ backgroundColor: "#f0fdf4", color: "#15803d", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold", border: "1px solid #bbf7d0", display: "inline-block", marginBottom: "6px" }}>✔ AI Verified Profile</div><br/>
                                    <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}>Date: {reportDate} &nbsp;|&nbsp; Ref: TX-{refID}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Candidate Details & Photo Table */}
                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "25px" }}>
                        <tbody>
                            <tr>
                                <td valign="top" style={{ paddingRight: "20px" }}>
                                    <h2 style={{ margin: "0 0 15px 0", fontSize: "24px", color: "#0f172a", fontWeight: "bold" }}>{candidate?.fullName || "Candidate Name"}</h2>
                                    
                                    <table width="100%" cellPadding="4" cellSpacing="0" style={{ fontSize: "12px", color: "#475569", marginBottom: "15px" }}>
                                        <tbody>
                                            <tr><td width="100" style={{ fontWeight: "bold", color: "#334155" }}>Email:</td><td>{candidate?.email || "N/A"}</td></tr>
                                            <tr><td style={{ fontWeight: "bold", color: "#334155" }}>Phone:</td><td>{candidate?.phone || "N/A"}</td></tr>
                                            <tr><td style={{ fontWeight: "bold", color: "#334155" }}>Location:</td><td>{candidate?.city || "N/A"}</td></tr>
                                            <tr><td style={{ fontWeight: "bold", color: "#334155" }}>DOB:</td><td>{dobToDisplay}</td></tr>
                                            <tr><td style={{ fontWeight: "bold", color: "#334155" }}>PAN:</td><td style={{ textTransform: "uppercase" }}>{panToDisplay}</td></tr>
                                        </tbody>
                                    </table>

                                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "10px", marginTop: "5px" }}>
                                        <span style={{ fontSize: "12px", color: "#0f947e", fontWeight: "bold", textTransform: "uppercase" }}>Work Preferences</span>
                                        <table width="100%" cellPadding="4" cellSpacing="0" style={{ fontSize: "12px", color: "#475569", marginTop: "5px" }}>
                                            <tbody>
                                                <tr>
                                                    <td width="90" style={{ fontWeight: "bold", color: "#334155" }}>Exp. Salary:</td><td style={{ fontWeight: "bold", color: "#0f172a" }}>{expSalaryToDisplay}</td>
                                                    <td width="90" style={{ fontWeight: "bold", color: "#334155" }}>Notice Period:</td><td>{noticeToDisplay}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ fontWeight: "bold", color: "#334155" }}>Total Exp:</td><td>{candidate?.experience || "Fresher"}</td>
                                                    <td style={{ fontWeight: "bold", color: "#334155" }}>Work Mode:</td><td>{workModeToDisplay}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                                <td width="120" align="right" valign="top">
                                    <div style={{ width: "110px", height: "140px", border: "1px solid #cbd5e1", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", textAlign: "center" }}>
                                        {profileImage ? 
                                            <img src={profileImage} crossOrigin="anonymous" alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> 
                                            : <span style={{ fontSize: "10px", color: "#94a3b8", padding: "10px" }}>Passport Size<br/>Photo</span>
                                        }
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Bio Quote */}
                    {candidate?.bio && (
                        <div style={{ backgroundColor: "#f8fafc", borderLeft: "3px solid #0f947e", padding: "12px 15px", marginBottom: "25px", borderRadius: "0 6px 6px 0" }}>
                            <p style={{ margin: 0, fontSize: "12px", color: "#334155", fontStyle: "italic", lineHeight: "1.5" }}>"{candidate.bio}"</p>
                        </div>
                    )}

                    {/* Sleek Score Banner */}
                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: "#0f172a", borderRadius: "8px", overflow: "hidden", marginBottom: "25px" }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: "15px 25px", width: "60%", borderRight: "1px solid #1e293b" }}>
                                    <span style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>Final AI Assessed Score</span><br/>
                                    <span style={{ fontSize: "36px", color: "#10b981", fontWeight: "bold", lineHeight: "1.2" }}>{totalScore}</span> <span style={{ fontSize: "14px", color: "#cbd5e1" }}>Points</span>
                                </td>
                                <td style={{ backgroundColor: totalWarnings > 0 ? "#7f1d1d" : "#064e3b", padding: "15px 25px", textAlign: "right", width: "40%", verticalAlign: "middle" }}>
                                    <span style={{ fontSize: "10px", color: totalWarnings > 0 ? "#fca5a5" : "#86efac", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>Integrity Status</span><br/>
                                    <span style={{ fontSize: "18px", color: "#ffffff", fontWeight: "bold" }}>{totalWarnings > 0 ? `⚠ ${totalWarnings} Warnings` : '✔ Clear Record'}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Detailed Per-Skill Breakdown (Now on Page 1) */}
                    <div>
                        <h3 style={{ fontSize: "16px", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px", margin: "0 0 15px 0" }}>Domain Skill Analytics</h3>
                        
                        {Object.keys(skillScores).length > 0 ? Object.keys(skillScores).map((skill, i) => {
                            const data = skillScores[skill];
                            const score = Math.max(0, data.scoreCount || data.correct || 0);
                            const total = data.total || 5;
                            const percentage = (score / total) * 100;
                            const isPsycho = skill.includes('Psychometric');
                            const techSkillNames = technologicalSkills.map((s:any) => typeof s === 'string' ? s : s.name);
                            const isTechSkill = techSkillNames.includes(skill);
                            
                            const color = isPsycho ? "#a855f7" : isTechSkill ? "#ec4899" : (percentage >= 80 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444");

                            return (
                                <div key={i} style={{ marginBottom: "12px" }}>
                                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "4px" }}>
                                        <tbody>
                                            <tr>
                                                <td align="left" style={{ fontSize: "12px", fontWeight: "bold", color: "#1e293b" }}>
                                                    {isPsycho ? "🧠 Behavioral & Culture Fit" : isTechSkill ? `💻 ${skill}` : skill}
                                                </td>
                                                <td align="right" style={{ fontSize: "12px", fontWeight: "bold", color: color }}>
                                                    {data.aiLevel} ({score}/{total})
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div style={{ width: "100%", backgroundColor: "#f1f5f9", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
                                        <div style={{ width: `${Math.max(3, percentage)}%`, backgroundColor: color, height: "100%", borderRadius: "3px" }}></div>
                                    </div>
                                </div>
                            )
                        }) : <p style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>No test data available yet.</p>}
                    </div>

                </div>

                {/* ================= PAGE 2: PROFESSIONAL BACKGROUND ================= */}
                <div id="pdf-page-2" style={{ width: "794px", height: "1123px", padding: "50px 40px", backgroundColor: "#ffffff", boxSizing: "border-box", overflow: "hidden", fontFamily: "Helvetica, Arial, sans-serif", color: "#0f172a" }}>
                    
                    {/* Education */}
                    <h2 style={{ color: "#0f172a", fontSize: "18px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", margin: "0 0 15px 0" }}>Education & Credentials</h2>
                    {educations.length > 0 ? educations.map((edu:any, i:number) => {
                        const isSchoolLevel = /(10th|12th|class 10|class 12|high school|secondary|intermediate|puc|matric|board|ssc|hsc|cbse|icse|\b10\b|\b12\b|^10$|^12$|x|xii)/i.test((edu.qualification || '').toLowerCase());
                        return (
                            <div key={i} style={{ marginBottom: "15px", padding: "12px", backgroundColor: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "6px" }}>
                                <h4 style={{ margin: 0, fontSize: "14px", color: "#0f172a" }}>{edu.qualification} {edu.stageCleared ? `(${edu.stageCleared})` : ''}</h4>
                                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#475569" }}>{edu.collegeName}</p>
                                <div style={{ margin: "6px 0 0 0", fontSize: "11px", color: "#64748b", display: "flex", gap: "15px" }}>
                                    <span><b style={{color: "#334155"}}>Passed:</b> {edu.passingYear}</span>
                                    {edu.percentage && <span><b style={{color: "#334155"}}>Score:</b> {edu.percentage}%</span>}
                                    {isSchoolLevel && edu.mathsIncluded === 'Yes' && edu.mathsScore && (
                                        <span style={{ color: "#0f947e", fontWeight: "bold" }}>Maths: {edu.mathsScore}%</span>
                                    )}
                                </div>
                            </div>
                        )
                    }) : <p style={{ fontSize: "12px", color: "#64748b" }}>No education listed.</p>}

                    {/* Work Experience */}
                    <h2 style={{ color: "#0f172a", fontSize: "18px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", margin: "25px 0 15px 0" }}>Professional Experience</h2>
                    {experience.length > 0 ? experience.map((exp:any, i:number) => (
                        <div key={i} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: i !== experience.length -1 ? "1px dashed #e2e8f0" : "none" }}>
                            <h4 style={{ margin: 0, fontSize: "14px", color: "#0f172a" }}>{exp.role} <span style={{ fontWeight: "normal", color: "#64748b" }}>at</span> {exp.company}</h4>
                            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#475569", fontWeight: "bold" }}>{exp.duration}</p>
                        </div>
                    )) : <p style={{ fontSize: "12px", color: "#64748b" }}>No prior work experience listed.</p>}

                    {/* Achievements */}
                    {achievements.length > 0 && (
                        <>
                            <h2 style={{ color: "#0f172a", fontSize: "18px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", margin: "25px 0 15px 0" }}>Key Achievements</h2>
                            {achievements.map((ach:any, i:number) => (
                                <div key={i} style={{ marginBottom: "12px" }}>
                                    <h4 style={{ margin: 0, fontSize: "13px", color: "#0f172a" }}>🏆 {ach.title}</h4>
                                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#475569", lineHeight: "1.4" }}>{ach.description}</p>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Mapped Skills Summary */}
                    <h2 style={{ color: "#0f172a", fontSize: "18px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", margin: "25px 0 15px 0" }}>Skill Mappings</h2>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                        <tbody>
                            <tr>
                                <td width="33%" valign="top" style={{ paddingRight: "10px" }}>
                                    <h4 style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#0f947e", textTransform: "uppercase" }}>Core Domains</h4>
                                    {skills.length > 0 ? skills.map((s:string, i:number) => <div key={i} style={{ fontSize: "11px", backgroundColor: "#f0fdf4", padding: "4px 8px", marginBottom: "4px", borderRadius: "4px", border: "1px solid #bbf7d0", color: "#166534" }}>{s}</div>) : <span style={{fontSize:"11px", color:"#94a3b8"}}>N/A</span>}
                                </td>
                                <td width="33%" valign="top" style={{ paddingRight: "10px" }}>
                                    <h4 style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#7e22ce", textTransform: "uppercase" }}>Behavioral</h4>
                                    {behavioralSkills.length > 0 ? behavioralSkills.map((s:string, i:number) => <div key={i} style={{ fontSize: "11px", backgroundColor: "#faf5ff", padding: "4px 8px", marginBottom: "4px", borderRadius: "4px", border: "1px solid #e9d5ff", color: "#6b21a8" }}>{s}</div>) : <span style={{fontSize:"11px", color:"#94a3b8"}}>N/A</span>}
                                </td>
                                <td width="33%" valign="top">
                                    <h4 style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#be185d", textTransform: "uppercase" }}>Tools & Software</h4>
                                    {technologicalSkills.length > 0 ? technologicalSkills.map((s:any, i:number) => <div key={i} style={{ fontSize: "11px", backgroundColor: "#fdf2f8", padding: "4px 8px", marginBottom: "4px", borderRadius: "4px", border: "1px solid #fbcfe8", color: "#9d174d" }}>{typeof s === 'string' ? s : s.name}</div>) : <span style={{fontSize:"11px", color:"#94a3b8"}}>N/A</span>}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>

                {/* ================= PAGE 3: AI EXECUTIVE REPORT ================= */}
                <div id="pdf-page-3" style={{ width: "794px", height: "1123px", padding: "50px 40px", backgroundColor: "#ffffff", boxSizing: "border-box", overflow: "hidden", fontFamily: "Helvetica, Arial, sans-serif", color: "#0f172a" }}>
                    
                    <h2 style={{ color: "#0f172a", fontSize: "20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", margin: "0 0 20px 0" }}>AI Executive Analysis Report</h2>
                    
                    <div style={{ padding: "24px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                        {aiReport.split('\n').filter((p:string) => p.trim() !== '').map((para:string, i:number) => (
                            <p key={i} style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#334155", lineHeight: "1.8", textAlign: "justify" }}>
                                {para.replace(/\*\*/g, '')}
                            </p>
                        ))}
                    </div>

                </div>

            </div>
        </>
    );
}