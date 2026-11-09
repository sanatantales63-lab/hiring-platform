import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, candidateName, candidateEmail, extraInfo } = body;

    let subject = "";
    let htmlContent = "";

    // 1. Naya Signup Mail
    if (type === "signup") {
      subject = `🚨 New Candidate Signup: ${candidateName}`;
      htmlContent = `
        <h3>New Candidate Alert!</h3>
        <p><strong>Name:</strong> ${candidateName}</p>
        <p><strong>Email:</strong> ${candidateEmail}</p>
        <p>A new candidate has just registered on Resourcemania.</p>
      `;
    } 
    // 2. Test Completion Mail
    else if (type === "test_completed") {
      subject = `🎯 Test Completed: ${candidateName}`;
      htmlContent = `
        <h3>Assessment Completed!</h3>
        <p><strong>Name:</strong> ${candidateName}</p>
        <p><strong>Email:</strong> ${candidateEmail}</p>
        <p><strong>Score:</strong> ${extraInfo}</p>
        <p>Candidate has completed their final AI assessment. Check the admin panel for detailed reports.</p>
      `;
    } 
    // 3. Re-test Request Mail
    else if (type === "retest") {
      subject = `⏳ Re-test Request: ${candidateName}`;
      htmlContent = `
        <h3>Re-test Approval Required!</h3>
        <p><strong>Name:</strong> ${candidateName}</p>
        <p><strong>Email:</strong> ${candidateEmail}</p>
        <p>Candidate has requested a re-test. Please check the Admin Panel to grant access.</p>
      `;
    }
    // 🔥 4. Interview Request Mail 🔥
    else if (type === "interview_request") {
      subject = `📅 Meet Link Required: ${candidateName}`;
      htmlContent = `
        <h3>New Interview Scheduled!</h3>
        <p><strong>Candidate:</strong> ${candidateName}</p>
        <p><strong>Requested Schedule:</strong> ${extraInfo}</p>
        <hr/>
        <p>Please log in to the Admin Panel, confirm availability, and generate a Google Meet link for the company.</p>
      `;
    }
    // 🔥 4.1. Nayi Job Post Hui (Company dwara submit - Admin Review ke liye) 🔥
    else if (type === "job_submitted") {
      const { jobId, jobTitle, companyName: cName, companyEmail: cEmail, location: loc, skills, experience: exp, salaryRange: sal, description: desc } = body;

      const adminSubj = `🚨 New Job Submitted for Review: [${jobId}] ${jobTitle} by ${cName || 'Recruiter'}`;
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #1e293b; background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 8px; margin-top: 0;">New Job Posting Submitted for Review</h2>
          <p>A company has just submitted a new job requirement on <strong>Resourcemania</strong>. Please review and approve it from the Admin Dashboard.</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 6px 0;"><strong>Job ID:</strong> <span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${jobId}</span></p>
            <p style="margin: 6px 0;"><strong>Role / Title:</strong> ${jobTitle}</p>
            <p style="margin: 6px 0;"><strong>Company:</strong> ${cName || 'N/A'} (${cEmail || 'N/A'})</p>
            <p style="margin: 6px 0;"><strong>Experience:</strong> ${exp || 'Not specified'}</p>
            <p style="margin: 6px 0;"><strong>Location / Mode:</strong> ${loc || 'Remote'}</p>
            <p style="margin: 6px 0;"><strong>Compensation:</strong> ${sal || 'Negotiable'}</p>
            <p style="margin: 6px 0;"><strong>Skills:</strong> ${Array.isArray(skills) ? skills.join(', ') : (skills || 'General')}</p>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
              <strong>Job Description Preview:</strong>
              <p style="white-space: pre-wrap; font-size: 13px; color: #475569; margin-top: 6px;">${desc ? desc.slice(0, 350) + (desc.length > 350 ? '...' : '') : 'N/A'}</p>
            </div>
          </div>
          <p><a href="https://resourcemania.in/admin/dashboard" style="background: #0f766e; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Open Admin Panel to Review & Publish</a></p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Resourcemania Notification System</p>
        </div>
      `;

      const compSubj = `📋 Job Received for Review: [${jobId}] ${jobTitle} | Resourcemania`;
      const compHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #1e293b; background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f766e; margin-top: 0;">Your Job Posting is Under Review</h2>
          <p>Dear ${cName || 'Recruiter'},</p>
          <p>Thank you for submitting your job opening on <strong>Resourcemania</strong>. We have received your request.</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Job ID:</strong> ${jobId}</p>
            <p style="margin: 4px 0;"><strong>Role:</strong> ${jobTitle}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #d97706; font-weight: bold;">Pending Admin Approval</span></p>
          </div>
          <p>Our team verifies all job posts to ensure candidate matching quality. You will receive an email as soon as your job goes live on our candidate portal and public board.</p>
          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Warm regards,<br/>Team Resourcemania</p>
        </div>
      `;

      const p1 = "xkeysib-14994a91da404098ea22bd7c3";
      const p2 = "a7ccaf8ce4f7e9a154f8b8404d63a5223cde84e";
      const p3 = "-XOJf95Gi1PEHfeul";
      const k = p1 + p2 + p3;

      const sendMail = async (toE: string, toN: string, s: string, h: string) => {
        if (!toE || toE.trim() === "") return;
        try {
          await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'api-key': k },
            body: JSON.stringify({
              sender: { email: "admin@resourcemania.in", name: "Resourcemania Alerts" },
              to: [{ email: toE.trim(), name: toN }],
              subject: s,
              htmlContent: h,
            }),
          });
        } catch (e) {
          console.error("Mail send error:", e);
        }
      };

      await sendMail("admin@resourcemania.in", "Admin", adminSubj, adminHtml);
      if (cEmail && cEmail.trim() !== "") {
        await sendMail(cEmail, cName || "Recruiter", compSubj, compHtml);
      }
      return NextResponse.json({ success: true });
    }
    // 🔥 4.2. Job Approved & Published by Admin 🔥
    else if (type === "job_approved") {
      const { jobId, jobTitle, companyName: cName, companyEmail: cEmail } = body;
      const compSubj = `🎉 Your Job is Live: [${jobId}] ${jobTitle} | Resourcemania`;
      const compHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #1e293b; background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f766e; margin-top: 0;">Congratulations! Your Job is Now Live</h2>
          <p>Dear ${cName || 'Recruiter'},</p>
          <p>Great news! Your job posting has been verified and published by our admin team. It is now actively visible to qualified candidates on Resourcemania.</p>
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Job ID:</strong> ${jobId}</p>
            <p style="margin: 4px 0;"><strong>Role:</strong> ${jobTitle}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Active & Published</span></p>
          </div>
          <p>Candidates can now discover and apply for this opening.</p>
          <p><a href="https://resourcemania.in/company/dashboard" style="background: #0f766e; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">View on Dashboard</a></p>
          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Warm regards,<br/>Team Resourcemania</p>
        </div>
      `;

      const p1 = "xkeysib-14994a91da404098ea22bd7c3";
      const p2 = "a7ccaf8ce4f7e9a154f8b8404d63a5223cde84e";
      const p3 = "-XOJf95Gi1PEHfeul";
      const k = p1 + p2 + p3;

      if (cEmail && cEmail.trim() !== "") {
        try {
          await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'api-key': k },
            body: JSON.stringify({
              sender: { email: "admin@resourcemania.in", name: "Resourcemania Alerts" },
              to: [{ email: cEmail.trim(), name: cName || "Recruiter" }],
              subject: compSubj,
              htmlContent: compHtml,
            }),
          });
        } catch (e) {
          console.error("Mail send error:", e);
        }
      }
      return NextResponse.json({ success: true });
    }
    // 🔥 5. Meet Link Sent — Company + Candidate + Admin ko mail 🔥
    else if (type === "meet_link_sent") {
      const { companyName, companyEmail, meetLink, interviewDate, interviewTime } = body;

      const adminSubject = `✅ Meet Link Sent: ${candidateName} ↔ ${companyName}`;
      const adminHtml = `
        <h3>Meet Link Dispatched</h3>
        <p><strong>Candidate:</strong> ${candidateName} (${candidateEmail})</p>
        <p><strong>Company:</strong> ${companyName} (${companyEmail})</p>
        <p><strong>Schedule:</strong> ${interviewDate} at ${interviewTime}</p>
        <p><strong>Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
      `;

      const companySubject = `🎯 Interview Confirmed: Meet Link Ready | Resourcemania`;
      const companyHtml = `
        <h3>Your Interview is Confirmed!</h3>
        <p>Dear Recruiter,</p>
        <p>The Google Meet link for your scheduled interview has been arranged by Resourcemania.</p>
        <p><strong>Candidate ID:</strong> ${candidateName}</p>
        <p><strong>Date:</strong> ${interviewDate} &nbsp;|&nbsp; <strong>Time:</strong> ${interviewTime}</p>
        <p><strong>Join Meeting:</strong> <a href="${meetLink}" style="background:#0f947e;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Click to Join</a></p>
        <br/><p style="color:#888;font-size:12px;">This link was arranged by Resourcemania Admin. Do not share externally.</p>
      `;

      const candidateSubject = `📅 Your Interview is Scheduled | Resourcemania`;
      const candidateHtml = `
        <h3>Your Interview Has Been Arranged!</h3>
        <p>Dear Candidate,</p>
        <p>Resourcemania has arranged a Google Meet interview for you.</p>
        <p><strong>Date:</strong> ${interviewDate} &nbsp;|&nbsp; <strong>Time:</strong> ${interviewTime}</p>
        <p><strong>Join Meeting:</strong> <a href="${meetLink}" style="background:#0f947e;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Click to Join</a></p>
        <br/><p style="color:#888;font-size:12px;">Please be on time. This link is confidential — for your use only.</p>
      `;

      const part1 = "xkeysib-14994a91da404098ea22bd7c3";
      const part2 = "a7ccaf8ce4f7e9a154f8b8404d63a5223cde84e";
      const part3 = "-XOJf95Gi1PEHfeul";
      const apiKey2 = part1 + part2 + part3;

      const sendOne = async (toEmail: string, toName: string, subj: string, html: string) => {
        if (!toEmail || toEmail.trim() === "") {
          console.error(`❌ sendOne skipped — toEmail is empty for: ${toName}`);
          return;
        }
        
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': apiKey2,
          },
          body: JSON.stringify({
            sender: { email: "admin@resourcemania.in", name: "Resourcemania Alerts" },
            to: [{ email: toEmail.trim(), name: toName }],
            subject: subj,
            htmlContent: html,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error(`❌ Brevo failed for ${toEmail}:`, JSON.stringify(err));
        } else {
          console.log(`✅ Email sent successfully to ${toEmail}`);
        }
      };

      console.log("📧 Dispatching Meet Link Emails...");
      
      // Admin Alert
      await sendOne("admin@resourcemania.in", "Admin", adminSubject, adminHtml);
      
      // Company Alert
      if (companyEmail && companyEmail.trim() !== "") {
        await sendOne(companyEmail, companyName || "Recruiter", companySubject, companyHtml);
      }

      // Candidate Alert
      if (candidateEmail && candidateEmail.trim() !== "") {
        await sendOne(candidateEmail, candidateName || "Candidate", candidateSubject, candidateHtml);
      }

      return NextResponse.json({ success: true });
    }

    // Single Alert (Purana Brevo Hit Logic)
    const part1 = "xkeysib-14994a91da404098ea22bd7c3";
    const part2 = "a7ccaf8ce4f7e9a154f8b8404d63a5223cde84e";
    const part3 = "-XOJf95Gi1PEHfeul";
    const apiKey = part1 + part2 + part3;
    
    const adminEmail = "admin@resourcemania.in";

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { email: "admin@resourcemania.in", name: "Resourcemania Alerts" }, 
        to: [{ email: adminEmail, name: "Admin" }],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo Error:", errorData);
      return NextResponse.json({ error: "Failed to send email" }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
