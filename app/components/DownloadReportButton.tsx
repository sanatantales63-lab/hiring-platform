"use client";
import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas-pro"; // 🔥 FIX: Using PRO version for oklch color support
import jsPDF from "jspdf";
import { Download, Loader2 } from "lucide-react";
import Button from "@/app/components/ui/Button";
import { generateCandidateId } from "@/lib/utils";

export default function DownloadReportButton({ candidate, buttonStyle = "default" }: { candidate: any, buttonStyle?: "default" | "admin" }) {
    const [isDownloading, setIsDownloading] = useState(false);

    // 🔥 FORCE LOAD FONTS FOR CRYSTAL CLEAR TEXT 🔥
    useEffect(() => {
        const linkId = "Resourcemania-pdf-fonts";
        if (!document.getElementById(linkId)) {
            const link = document.createElement("link");
            link.id = linkId;
            link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap";
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }
    }, []);

    const getAge = (dobString: string) => {
        if (!dobString) return "N/A";
        const dob = new Date(dobString);
        if (isNaN(dob.getTime())) return "N/A";
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age + " Yrs";
    };

    const handleDownload = async () => {
        setIsDownloading(true);

        try {
            await document.fonts.ready;
            
            const container = document.getElementById("pdf-dynamic-html-container");
            if (!container) throw new Error("Element not found");

            // 🚀 THE FLAWLESS SPACER ALGORITHM 🚀
            const PX_PER_MM = 1024 / 210; 
            const PAGE_HEIGHT_PX = 297 * PX_PER_MM; // ~1448px (Exact A4 Height)
            const FOOTER_SAFE_ZONE = 100; // px before bottom edge
            const HEADER_CLEARANCE = 160; // 🔥 THE MAGIC FIX: 160px clearance to NEVER hide under the 78px header! 🔥

            const elements = Array.from(container.querySelectorAll('.pdf-no-break'));

            for (let i = 0; i < elements.length; i++) {
                const el = elements[i] as HTMLElement;
                const containerRect = container.getBoundingClientRect();
                const rect = el.getBoundingClientRect();
                
                const top = rect.top - containerRect.top; 
                const bottom = rect.bottom - containerRect.top;
                
                const currentPage = Math.floor(top / PAGE_HEIGHT_PX);
                const pageBottomBoundary = (currentPage + 1) * PAGE_HEIGHT_PX;
                
                // If element crosses into the footer/cut-zone
                if (bottom > (pageBottomBoundary - FOOTER_SAFE_ZONE)) {
                    // Push it to the NEXT page, with 160px clearance to drop it SAFELY below the dark header!
                    const targetTop = pageBottomBoundary + HEADER_CLEARANCE; 
                    const pushAmount = targetTop - top;
                    
                    const currentMarginTop = parseFloat(window.getComputedStyle(el).marginTop || "0");
                    el.style.marginTop = `${currentMarginTop + pushAmount}px`; 
                    
                    // Small delay to let browser calculate next elements correctly
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }

            // Important: Let the DOM settle completely after all margins are applied
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(container, {
                scale: 3, 
                useCORS: true,
                backgroundColor: "#f7f5f0",
                windowWidth: 1024,
                logging: false
            });

            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;
            let pageNum = 1;

            const drawOverlays = (page: number) => {
                // Common Footer
                pdf.setFillColor(13, 17, 23); 
                pdf.rect(0, pdfHeight - 12, pdfWidth, 12, 'F');
                pdf.setTextColor(122, 135, 153); 
                pdf.setFontSize(8);
                pdf.text("Resourcemania Technologies Pvt. Ltd. | Verified Executive Report", 15, pdfHeight - 4.5);
                pdf.text(`Page ${page}`, pdfWidth - 20, pdfHeight - 4.5);

                // Common Header for Page 2 and beyond
                if (page > 1) {
                    pdf.setFillColor(30, 42, 58); 
                    pdf.rect(0, 0, pdfWidth, 16, 'F');
                    pdf.setDrawColor(201, 168, 76); 
                    pdf.setLineWidth(0.5);
                    pdf.line(0, 16, pdfWidth, 16);

                    pdf.setTextColor(201, 168, 76);
                    pdf.setFontSize(11);
                    pdf.text("Resourcemania | Executive Assessment (Continued)", 15, 10);
                }
            };

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
            drawOverlays(pageNum);

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
                pageNum++;
                drawOverlays(pageNum);
            }

            pdf.save(`${candidate?.fullName?.replace(/\s+/g, '_') || "Candidate"}_Resourcemania_Executive_Report.pdf`);
            
            // Clean up dynamic margins
            for (let i = 0; i < elements.length; i++) {
                (elements[i] as HTMLElement).style.marginTop = "";
            }

        } catch (error) {
            console.error("Error generating PDF", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    // --- Data Mapping ---
    const meta = candidate?.meta || {};
    const skillScores = meta.skillScores || {};
    const aiReport = meta.ai_detailed_report || "AI detailed analysis is pending or not available for this candidate.";
    
    const warningsData = meta.warnings || { tab: 0, mic: 0, cam: 0, face: 0 };
    const totalWarnings = meta.warningsCount || (warningsData.tab + warningsData.mic + warningsData.cam + warningsData.face) || 0;

    const profileImage = candidate?.photoURL || candidate?.avatar || null;
    const educations = Array.isArray(candidate?.educations) ? candidate.educations : [];
    const experience = Array.isArray(candidate?.workExperience) ? candidate.workExperience : [];
    const skills = Array.isArray(candidate?.skills) && candidate.skills.length > 0 
      ? candidate.skills 
      : Array.isArray(candidate?.operationsSkills) ? candidate.operationsSkills : [];
    const behavioralSkills = Array.isArray(candidate?.behavioralSkills) ? candidate.behavioralSkills : [];
    const technologicalSkills = Array.isArray(candidate?.technologicalSkills) ? candidate.technologicalSkills : [];
    const achievements = Array.isArray(candidate?.achievements) ? candidate.achievements : [];
    
    const reportDate = new Date(meta.lastAttempt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const refID = generateCandidateId(candidate);
    const aiParagraphs = aiReport.split('\n').filter((p: string) => p.trim() !== '');

    return (
        <>
            <Button 
                variant={buttonStyle === "admin" ? "secondary" : "primary"}
                onClick={handleDownload} 
                disabled={isDownloading || meta.status === "Pending"}
                className={`w-full md:w-auto ${buttonStyle === "admin" ? "py-2.5 text-sm" : ""}`}
            >
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {isDownloading ? "Optimizing Layout..." : "Download Verified Report"}
            </Button>

            {/* 🚀 INVISIBLE CONTAINER 🚀 */}
            <div style={{ position: "absolute", top: "-20000px", left: "-20000px", zIndex: -100, pointerEvents: "none" }}>
                
                <style dangerouslySetInnerHTML={{__html: `
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
                    
                    :root {
                        --ink: #0d1117;
                        --paper: #f7f5f0;
                        --gold: #c9a84c;
                        --gold-light: #e8cc7e;
                        --slate: #1e2a3a;
                        --slate-mid: #2d3f55;
                        --accent-green: #2e7d52;
                        --accent-red: #8b2635;
                        --accent-amber: #c9a84c;
                        --muted: #7a8799;
                        --border: #ddd8ce;
                        --white: #ffffff;
                    }

                    .pdf-continuous-doc { 
                        font-family: 'DM Sans', sans-serif; 
                        background: var(--paper); 
                        color: var(--ink); 
                        font-size: 14px; 
                        line-height: 1.6;
                        width: 1024px;
                        box-sizing: border-box;
                        position: relative;
                        padding-bottom: 60px;
                        min-height: 1448px;
                    }

                    /* ── HEADER ── */
                    .header { background: var(--slate); color: var(--white); padding: 48px 56px 40px; position: relative; overflow: hidden; }
                    .header::before { content: ''; position: absolute; top: -60px; right: -60px; width: 280px; height: 280px; background: radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%); border-radius: 50%; }
                    .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
                    .brand { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; color: var(--gold); }
                    .brand span { display: block; font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 400; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-top: 3px; }
                    .report-meta { text-align: right; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); line-height: 1.8; letter-spacing: 0.5px; }
                    
                    /* 🔥 NO MORE BOXES! SLEEK TEXT WITH BOTTOM BORDER 🔥 */
                    .ai-badge { display: inline-block; color: var(--gold-light); font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid rgba(201,168,76,0.6); padding-bottom: 4px; margin-bottom: 10px; font-weight: 500;}
                    
                    .profile-row { display: flex; align-items: flex-end; gap: 32px; }
                    .profile-photo { width: 80px; height: 80px; border-radius: 4px; border: 2px solid var(--gold); object-fit: cover; flex-shrink: 0; }
                    .profile-photo-placeholder { width: 80px; height: 80px; border-radius: 4px; border: 2px solid var(--gold); background: var(--slate-mid); display: flex; align-items: center; justify-content: center; font-size: 28px; color: var(--gold); flex-shrink: 0; }
                    .candidate-name { font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
                    .candidate-tagline { color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 300; font-style: italic; max-width: 480px; }
                    .contact-row { display: flex; gap: 24px; margin-top: 10px; flex-wrap: wrap; }
                    .contact-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(255,255,255,0.65); }
                    .contact-item .icon { color: var(--gold); font-size: 11px; }

                    /* ── SCORE STRIP ── */
                    .score-strip { background: var(--ink); padding: 0 56px; display: flex; gap: 0; border-bottom: 3px solid var(--gold); }
                    .score-block { padding: 18px 32px 18px 0; flex: 1; border-right: 1px solid rgba(255,255,255,0.06); position: relative; }
                    .score-block:last-child { border-right: none; padding-right: 0; }
                    .score-block:first-child { padding-left: 0; }
                    .score-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
                    .score-value { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: var(--white); line-height: 1; }
                    .score-value.gold { color: var(--gold); }
                    .score-value.amber { color: #e8a030; }
                    .score-value.green { color: #5ac88a; }
                    .score-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }

                    /* ── BODY LAYOUT (Original Flex Grid) ── */
                    .body-wrap { display: flex; align-items: stretch; max-width: 100%; min-height: 800px;}
                    .main-col { flex: 1; padding: 44px 48px 44px 56px; border-right: 1px solid var(--border); }
                    .side-col { width: 340px; flex-shrink: 0; padding: 44px 40px 44px 36px; background: #faf9f5; }

                    /* ── SECTION ── */
                    .section { margin-bottom: 40px; }
                    .section:last-child { margin-bottom: 0; }
                    .section-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: var(--slate); margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--gold); display: flex; align-items: center; gap: 8px; }
                    .section-title .num { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--gold); letter-spacing: 1px; }

                    /* ── SKILL BARS ── */
                    .skill-item { margin-bottom: 16px; }
                    .skill-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
                    .skill-name { font-weight: 500; font-size: 13px; color: var(--slate); }
                    
                    /* 🔥 NO MORE SKILL BOXES EITHER! 🔥 */
                    .skill-level-text { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
                    .text-expert { color: var(--accent-green); }
                    .text-inter { color: #c07030; }
                    .text-zero { color: var(--accent-red); }
                    
                    .skill-bar-track { height: 6px; background: #e8e4dc; border-radius: 3px; overflow: hidden; }
                    .skill-bar-fill { height: 100%; border-radius: 3px; }
                    .fill-green { background: linear-gradient(90deg, var(--accent-green), #5ac88a); }
                    .fill-amber { background: linear-gradient(90deg, #c07030, #e8a050); }
                    .fill-red { background: linear-gradient(90deg, var(--accent-red), #e05070); }
                    .skill-score { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); margin-top: 3px; }

                    /* ── EDUCATION ── */
                    .edu-card { padding: 12px 0; border-bottom: 1px solid var(--border); margin-bottom: 0; background: transparent; }
                    .edu-card:last-child { border-bottom: none; }
                    .edu-degree { font-weight: 700; font-size: 14px; color: var(--slate); margin-bottom: 4px; display: flex; align-items: center; gap: 8px;}
                    .edu-school { font-size: 12px; color: var(--muted); margin-bottom: 6px; }
                    .edu-meta { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
                    .edu-chip { font-family: 'DM Mono', monospace; font-size: 9.5px; padding: 3px 8px; border-radius: 4px; background: #eef2f8; color: var(--slate-mid); letter-spacing: 0.5px; font-weight: 600; white-space: nowrap; }

                    /* ── EXPERIENCE ── */
                    .exp-card { padding: 12px 0; border-bottom: 1px solid var(--border); background: transparent; margin-bottom: 0;}
                    .exp-card:last-child { border-bottom: none; }
                    .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
                    .exp-left { display: flex; flex-direction: column; gap: 2px; }
                    .exp-company { font-weight: 700; font-size: 14px; color: var(--slate); }
                    .exp-role-row { display: flex; align-items: center; gap: 8px; }
                    .exp-role { color: var(--accent-green); font-weight: 600; font-size: 12px; }
                    .exp-badge { font-size: 8.5px; background: #f0ece4; color: var(--slate-mid); padding: 2px 6px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; white-space: nowrap; }
                    .exp-tenure { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--slate-mid); background: var(--paper); border: 1px solid var(--border); padding: 3px 8px; border-radius: 4px; font-weight: 600; white-space: nowrap; }
                    .exp-summary { font-size: 11px; color: var(--muted); margin-top: 6px; line-height: 1.5; text-align: justify; }

                    /* ── SIDEBAR CARDS ── */
                    .info-card { background: var(--white); border: 1px solid var(--border); border-radius: 4px; padding: 16px; margin-bottom: 16px; }
                    .info-card-title { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
                    .info-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid #f0ece4; font-size: 12px; }
                    .info-row:last-child { border-bottom: none; }
                    .info-key { color: var(--muted); }
                    .info-val { font-weight: 500; color: var(--slate); }

                    /* ── TAGS ── */
                    .tag-group { margin-bottom: 12px; }
                    .tag-group-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
                    .tag-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
                    .tag { font-size: 11px; padding: 4px 10px; border-radius: 2px; font-weight: 500; display: inline-flex; align-items: center; line-height: 1;}
                    .tag-core { background: #eef2fa; color: #2d4a8a; border: 1px solid #c8d4f0; }
                    .tag-behav { background: #f5eef9; color: #6a3090; border: 1px solid #ddc8f0; }
                    .tag-tool { background: #eaf6ef; color: #1e6040; border: 1px solid #b8dcc8; }

                    /* ── WARNING CARD ── */
                    .warning-card { background: #fff9ee; border: 1px solid #f0cc88; border-left: 3px solid var(--gold); border-radius: 0 4px 4px 0; padding: 12px 14px; margin-bottom: 16px; font-size: 12px; color: #7a5810; }
                    .warning-title { font-weight: 600; font-size: 11px; letter-spacing: 0.5px; margin-bottom: 3px; color: #8a6010; }

                    /* ── AI ANALYSIS ── */
                    .analysis-block { background: var(--white); border: 1px solid var(--border); border-radius: 4px; padding: 20px; }
                    .analysis-item { display: flex; gap: 14px; padding: 12px 0; border-bottom: 1px solid #f0ece4; align-items: flex-start; }
                    .analysis-item:last-child { border-bottom: none; padding-bottom: 0; }
                    .analysis-icon { width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; margin-top: 2px; }
                    .icon-green { background: #e8f5ee; }
                    .icon-amber { background: #fdf2e9; }
                    .icon-blue  { background: #eef2fa; }
                    .analysis-text p { font-size: 12px; color: #5a6878; line-height: 1.6; margin: 0; text-align: justify;}
                `}} />

                <div id="pdf-dynamic-html-container" className="pdf-root pdf-continuous-doc">
                    
                    {/* HEADER */}
                    <div className="header">
                        <div className="header-top">
                            <div className="brand">Resourcemania<span>Executive Profile & Assessment</span></div>
                            <div className="report-meta">
                                {/* 🔥 NO BOX! CLEAN TEXT WITH LINE 🔥 */}
                                <div className="ai-badge">✦ AI Verified Profile</div>
                                <div>Date: {reportDate}</div>
                                <div>Ref: {refID}</div>
                            </div>
                        </div>

                        <div className="profile-row">
                            {profileImage ? 
                                <img src={profileImage} crossOrigin="anonymous" className="profile-photo" alt="Profile"/> : 
                                <div className="profile-photo-placeholder">{candidate?.fullName?.charAt(0) || "C"}</div>
                            }
                            <div>
                                <div className="candidate-name">{candidate?.fullName || "Candidate Name"}</div>
                                <div className="candidate-tagline">"{candidate?.bio || "A highly motivated professional looking to leverage skills to achieve corporate goals."}"</div>
                                
                                {/* 🔥 NEW: Highest Qualification in PDF Header */}
                                {candidate?.highestQualification && (
                                    <div style={{ marginTop: "12px", display: "inline-flex", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", padding: "4px 10px", borderRadius: "4px", alignItems: "center", gap: "6px" }}>
                                        <span style={{ fontSize: "12px" }}>🎓</span>
                                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "var(--gold-light)", fontWeight: "600", letterSpacing: "0.5px" }}>{candidate.highestQualification}</span>
                                    </div>
                                )}

                                <div className="contact-row" style={{ marginTop: candidate?.highestQualification ? "8px" : "10px" }}>
                                    <div className="contact-item"><span className="icon">📍</span> {candidate?.city || "Not Provided"}</div>
                                    <div className="contact-item"><span className="icon">📞</span> {candidate?.phone || "Not Provided"}</div>
                                    <div className="contact-item"><span className="icon">✉</span> {candidate?.email || "Not Provided"}</div>
                                    <div className="contact-item"><span className="icon">🗓</span> Age: {getAge(candidate?.dob)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SCORE STRIP */}
                    <div className="score-strip" style={{ display: "flex", justifyContent: "center", padding: "0" }}>
                        <div className="score-block" style={{ width: "250px", flex: "none", padding: "2px 0", textAlign: "center" }}>
                            <div className="score-label" style={{ margin: "0", padding: "0", lineHeight: "1" }}>Notice Period</div>
                            <div className="score-value" style={{ fontSize: "20px", color: "#fff", margin: "0", padding: "0", lineHeight: "1" }}>{candidate?.noticePeriod || "Immediate"}</div>
                            <div className="score-sub" style={{ margin: "0", padding: "0", lineHeight: "1" }}>{candidate?.experience || "Fresher"} Exp</div>
                        </div>
                        <div className="score-block" style={{ width: "250px", flex: "none", padding: "2px 0", textAlign: "center" }}>
                            <div className="score-label" style={{ margin: "0", padding: "0", lineHeight: "1" }}>Expected Salary</div>
                            <div className="score-value" style={{ fontSize: "20px", color: "#fff", margin: "0", padding: "0", lineHeight: "1" }}>{candidate?.expectedSalary || "N/A"}</div>
                            <div className="score-sub" style={{ margin: "0", padding: "0", lineHeight: "1" }}>Per Month</div>
                        </div>
                        <div className="score-block" style={{ width: "250px", flex: "none", padding: "2px 0", textAlign: "center", borderRight: "none" }}>
                            <div className="score-label" style={{ margin: "0", padding: "0", lineHeight: "1" }}>Work Mode</div>
                            <div className="score-value" style={{ fontSize: "20px", color: "#fff", margin: "0", padding: "0", lineHeight: "1" }}>{candidate?.workMode || "On-site"}</div>
                        </div>
                    </div>

                    {/* TWO-COLUMN BODY */}
                    <div className="body-wrap">
                        
                        {/* MAIN COLUMN */}
                        <div className="main-col">
                            
                            <div className="section pdf-no-break">
                                <div className="section-title pdf-no-break" style={{ justifyContent: "space-between", width: "100%" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span className="num">01</span>
                                        <span style={{ whiteSpace: "nowrap" }}>Domain Skill Analytics</span>
                                    </div>
                                    <span style={{ fontSize: "9px", fontFamily: "'DM Mono', monospace", color: "var(--muted)", fontWeight: "normal", letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                                        * Skill-based assessment by Resourcemania; results below:
                                    </span>
                              </div>                                {Object.keys(skillScores).length > 0 ? Object.keys(skillScores).map((skill, i) => {
                                    const data = skillScores[skill];
                                    const score = Math.max(0, data.scoreCount || data.correct || 0);
                                    const total = data.total || 5;
                                    const pct = (score / total) * 100;
                                    const isExpert = pct >= 80;
                                    const isInter = pct >= 40 && pct < 80;
                                    const textClass = isExpert ? "text-expert" : (isInter ? "text-inter" : "text-zero");
                                    const fillClass = isExpert ? "fill-green" : (isInter ? "fill-amber" : "fill-red");

                                    return (
                                        <div className="skill-item pdf-no-break" key={i}>
                                            <div className="skill-header">
                                                <span className="skill-name">{skill}</span>
                                                {/* 🔥 NO BOX! CLEAN COLORED TEXT WITH DOT 🔥 */}
                                                <span className={`skill-level-text ${textClass}`}>
                                                    {data.aiLevel || "Evaluated"} {isExpert ? "🟢" : isInter ? "🟡" : "🔴"}
                                                </span>
                                            </div>
                                            <div className="skill-bar-track">
                                                <div className={`skill-bar-fill ${fillClass}`} style={{ width: `${Math.max(4, pct)}%` }}></div>
                                            </div>
                                            <div className="skill-score">{score} / {total} Points Scored</div>
                                        </div>
                                    )
                                }) : <p className="pdf-no-break" style={{fontSize: "12px", color: "var(--muted)"}}>No skill data recorded yet.</p>}
                            </div>

<div className="section">
                                <div className="section-title pdf-no-break"><span className="num">02</span> Education & Credentials</div>
                                {educations.length > 0 ? educations.map((edu:any, i:number) => {
                                    const isSchoolLevel = /(10th|12th|class 10|class 12|high school|secondary|intermediate|puc|matric|board|ssc|hsc|cbse|icse|\b10\b|\b12\b|^10$|^12$|x|xii)/i.test((edu.qualification || '').toLowerCase());
                                    return (
                                    <div className="edu-card pdf-no-break" key={i}>
                                        <div className="edu-degree">
                                            {edu.qualification}
                                            {edu.stageCleared && <span style={{ fontSize: "8.5px", background: "#fdf2e9", color: "#c07030", padding: "2px 5px", borderRadius: "3px", textTransform: "uppercase", fontWeight: "bold", whiteSpace: "nowrap" }}>{edu.stageCleared}</span>}
                                        </div>
                                        <div className="edu-school">{edu.collegeName}</div>
                                        <div className="edu-meta">
                                            <span className="edu-chip">Pass: {edu.passingYear}</span>
                                            {/* Extra '%' hata diya hai taaki 'CGPA%' jaisa ajeeb na dikhe */}
                                            {edu.percentage && <span className="edu-chip">Score: {edu.percentage}</span>}
                                            
                                            {/* Naya Maths Yes/No aur Score ka Logic */}
                                            {isSchoolLevel && edu.mathsIncluded && edu.mathsIncluded !== "" && (
                                                <span className="edu-chip" style={{color: edu.mathsIncluded === 'Yes' ? "var(--accent-green)" : "var(--accent-red)", background: edu.mathsIncluded === 'Yes' ? "#e8f5ee" : "#faeef0", border: "none"}}>
                                                    Maths: {edu.mathsIncluded} {edu.mathsIncluded === 'Yes' && edu.mathsScore ? `(${edu.mathsScore}%)` : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}) : <p className="pdf-no-break" style={{fontSize: "12px", color: "var(--muted)"}}>No education listed.</p>}
                            </div>

                            <div className="section">
                                <div className="section-title pdf-no-break"><span className="num">03</span> Professional Experience</div>
                                {experience.length > 0 ? experience.map((exp:any, i:number) => (
                                    <div className="exp-card pdf-no-break" key={i}>
                                        <div className="exp-header">
                                            <div className="exp-left">
                                                <div className="exp-company">{exp.company}</div>
                                                <div className="exp-role-row">
                                                    <span className="exp-role">{exp.role}</span>
                                                    {exp.designation && <span className="exp-badge">{exp.designation}</span>}
                                                </div>
                                            </div>
                                            <div className="exp-tenure">{exp.duration}</div>
                                        </div>
                                        {exp.summary && <div className="exp-summary">{exp.summary}</div>}
                                    </div>
                                )) : <p className="pdf-no-break" style={{fontSize: "12px", color: "var(--muted)"}}>No prior experience listed.</p>}
                            </div>
                            
                            {achievements.length > 0 && (
                                <div className="section">
                                    <div className="section-title pdf-no-break"><span className="num">04</span> Key Achievements</div>
                                    {achievements.map((ach:any, i:number) => (
                                        <div className="exp-card pdf-no-break" key={i}>
                                            <div className="exp-role">🏆 {ach.title}</div>
                                            <div style={{ fontSize: "12px", color: "#475569", lineHeight: "1.6", marginTop: "4px" }}>{ach.description}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="section pdf-no-break">
                                <div className="section-title"><span className="num">{achievements.length > 0 ? "05" : "04"}</span> AI Executive Analysis</div>
                                <div className="analysis-block">
                                    {aiParagraphs.map((para: string, i: number) => {
                                        const icon = i === 0 ? "💻" : (i === 1 ? "🧠" : "🛡️");
                                        const iconClass = i === 0 ? "icon-blue" : (i === 1 ? "icon-amber" : "icon-green");
                                        return (
                                            <div className="analysis-item pdf-no-break" key={i}>
                                                <div className={`analysis-icon ${iconClass}`}>{icon}</div>
                                                <div className="analysis-text">
                                                    <p>{para.replace(/\*\*/g, '')}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* SIDE COLUMN */}
                        <div className="side-col">
                            
                            <div className="info-card pdf-no-break">
                                <div className="info-card-title">Work Preferences</div>
                                <div className="info-row">
                                    <span className="info-key">Expected Salary</span>
                                    <span className="info-val">{candidate?.expectedSalary || "N/A"}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-key">Notice Period</span>
                                    <span className="info-val">{candidate?.noticePeriod || "Immediate"}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-key">Work Mode</span>
                                    <span className="info-val">{candidate?.workMode || "On-site"}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-key">Experience</span>
                                    <span className="info-val">{candidate?.experience || "Fresher"}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-key">Location</span>
                                    <span className="info-val">{candidate?.city || "Not Provided"}</span>
                                </div>
                            </div>

                           {/* Integrity Note Removed */}

                            <div className="info-card pdf-no-break">
                                <div className="info-card-title">Skill Mappings</div>
                                
                                <div className="tag-group">
                                    <div className="tag-group-label">Core Domains</div>
                                    <div className="tag-wrap">
                                        {skills.length > 0 ? skills.map((s:string, i:number) => <span key={i} className="tag tag-core">{s}</span>) : <span className="tag tag-core">N/A</span>}
                                    </div>
                                </div>

                                <div className="tag-group" style={{marginTop: "16px"}}>
                                    <div className="tag-group-label">Tools & Software</div>
                                    <div className="tag-wrap">
                                        {technologicalSkills.length > 0 ? technologicalSkills.map((s:any, i:number) => <span key={i} className="tag tag-tool">{typeof s === 'string' ? s : s.name}</span>) : <span className="tag tag-tool">N/A</span>}
                                    </div>
                                </div>
                                
                                <div className="tag-group" style={{marginTop: "16px"}}>
                                    <div className="tag-group-label">Behavioral</div>
                                    <div className="tag-wrap">
                                        {behavioralSkills.length > 0 ? behavioralSkills.map((s:string, i:number) => <span key={i} className="tag tag-behav">{s}</span>) : <span className="tag tag-behav">N/A</span>}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}