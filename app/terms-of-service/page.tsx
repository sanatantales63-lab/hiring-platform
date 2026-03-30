"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, ArrowLeft, ShieldCheck, Info, FileText, 
  UserCheck, Laptop, Lock, AlertTriangle, Scale, Mail, 
  CreditCard, ShieldAlert, CheckCircle, FileSignature, XOctagon
} from "lucide-react";

export default function TermsOfService() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("about");

  // Sidebar Navigation mapping
  const sections = [
    { id: "about", title: "1-2. About & Definitions", icon: <Info size={16} /> },
    { id: "relationship", title: "3. Independent Freelancer", icon: <Briefcase size={16} /> },
    { id: "account", title: "4-5. Eligibility & Profile", icon: <UserCheck size={16} /> },
    { id: "assessments", title: "6-7. Assessments & Interviews", icon: <Laptop size={16} /> },
    { id: "obligations", title: "8-9. Listing & Obligations", icon: <FileSignature size={16} /> },
    { id: "payments", title: "10. Fees & Payments", icon: <CreditCard size={16} /> },
    { id: "conduct", title: "11-13. Conduct & Confidentiality", icon: <ShieldAlert size={16} /> },
    { id: "privacy", title: "14-15. Privacy & IP", icon: <Lock size={16} /> },
    { id: "legal", title: "16-20. Legal Provisions", icon: <Scale size={16} /> },
    { id: "contact", title: "21. Contact Us", icon: <Mail size={16} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 pb-20">
      
      {/* NAVBAR */}
      <nav className="w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <Briefcase className="text-blue-500" strokeWidth={2.5} /> Talexo
          </div>
          <button onClick={() => router.back()} className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg border border-slate-800">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </nav>

      {/* HEADER SECTION */}
      <div className="bg-slate-900/50 border-b border-slate-800/50 relative overflow-hidden">
        <div className="absolute top-[-50%] left-[20%] w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
             <ShieldCheck size={16} /> Legal Documentation
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Candidate Platform Terms & Conditions
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            These Terms and Conditions ('Agreement') govern your engagement with Talexo as an independent freelance professional. 
          </p>
          <div className="flex gap-6 mt-8 text-sm font-bold text-slate-500">
             <span className="text-blue-400">Effective Date: March 2026</span>
             <span>•</span>
             <span className="text-blue-400">Version 2.0</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT WITH SIDEBAR */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 relative">
        
        {/* STICKY SIDEBAR (Hidden on mobile) */}
        <div className="hidden lg:block w-1/4 shrink-0">
           <div className="sticky top-32 bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Table of Contents</h3>
              <ul className="space-y-1">
                 {sections.map((section) => (
                    <li key={section.id}>
                       <button 
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                             ${activeSection === section.id 
                                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"}`}
                       >
                          {section.icon} {section.title}
                       </button>
                    </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* CONTENT AREA */}
        <div className="w-full lg:w-3/4 space-y-16 text-slate-300 text-sm md:text-base leading-relaxed">
          
          <div className="bg-red-950/20 border-l-4 border-red-500 p-6 rounded-r-2xl">
             <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Important — Please Read Carefully</h3>
             <p className="text-red-200/80 leading-relaxed text-sm">
               By registering on the Platform, you confirm that you have read, understood, and agree to be bound by this Agreement in its entirety. <strong className="text-red-300">If you do not agree, please do not register or use the Platform.</strong>
             </p>
          </div>

          <section id="about" className="scroll-mt-32 space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">1. About Talexo</h2>
                <p className="mb-3">Talexo is a technology-driven hiring platform that connects rigorously assessed, skill-verified freelance professionals with organisations seeking short-term, contractual, or project-based expertise.</p>
                <p className="mb-3">Talexo's core value proposition is its domain-specific assessment process that verifies each candidate's competency before listing them on the Platform.</p>
                <p className="mb-3">Talexo acts exclusively as an intermediary platform. It is not a staffing agency, recruitment firm, or employer. All engagements facilitated through Talexo are between independent freelance professionals and Clients, on a contractual basis.</p>
                <p>Talexo is operated by Talexo Technologies Private Limited, a company incorporated under the Companies Act 2013 and registered in India ('Talexo', 'we', 'us', 'our').</p>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white mb-6">2. Definitions</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { term: "Candidate / You / Freelancer", desc: "An independent professional who registers on the Talexo Platform to be listed for freelance or contractual engagements." },
                    { term: "Platform", desc: "The Talexo website, mobile application, and any related digital services operated by Talexo Technologies Private Limited." },
                    { term: "Client", desc: "Any company, firm, or individual that accesses the Platform to identify, evaluate, and engage Freelancers." },
                    { term: "Assessment", desc: "The domain-specific skill-testing process administered by Talexo to verify a Candidate's professional competency." },
                    { term: "Profile", desc: "The Candidate's information, qualifications, experience, assessment results, and availability displayed on the Platform to Clients." },
                    { term: "Listing", desc: "The act of making a verified Candidate's Profile visible and available to Clients on the Platform." },
                    { term: "Engagement", desc: "A contractual assignment or project entered into between a Freelancer and a Client (with Talexo as facilitating intermediary) on a freelance, fixed-term, or project basis." },
                    { term: "Freelance Agreement", desc: "The separate project-specific contract or work order executed between the Freelancer and Talexo setting out the scope, timeline, deliverables, and compensation for a specific Engagement." },
                    { term: "Invoice", desc: "A valid tax invoice raised by the Freelancer to Talexo for services rendered during an Engagement, in compliance with applicable GST and tax laws." },
                    { term: "Due Diligence", desc: "The process by which a Client independently evaluates a Candidate's suitability, including but not limited to interviews, document verification, background checks, and reference checks." },
                    { term: "Confidential Information", desc: "Any non-public information disclosed by either party in the course of using the Platform or during an Engagement." },
                    { term: "Statutory Deductions", desc: "All applicable deductions required by law, including TDS (Tax Deducted at Source) under the Income Tax Act 1961, GST reverse charge (if applicable), professional tax, and any other statutory withholdings." }
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <strong className="text-blue-400 block mb-1">{item.term}</strong>
                        <span className="text-slate-400 text-sm">{item.desc}</span>
                    </div>
                  ))}
                </div>
            </div>
          </section>

          <section id="relationship" className="scroll-mt-32 space-y-6">
             <h2 className="text-2xl font-bold text-white mb-4">3. Nature of Relationship — Independent Freelancer</h2>
             
             <div className="bg-blue-950/20 border border-blue-900/50 p-5 rounded-2xl text-blue-200 text-sm">
                <strong className="text-blue-400 uppercase tracking-wider mb-2 block">Important:</strong> 
                Your relationship with Talexo and with any Client is strictly that of an independent freelance contractor. Nothing in this Agreement, in any Freelance Agreement, or in the course of any Engagement shall be construed as creating an employer-employee relationship, a partnership, a joint venture, or an agency relationship between you and Talexo or between you and any Client.
             </div>

             <div className="space-y-4">
                <div><strong className="text-white">3.1 Independent Contractor Status:</strong> You are engaged by Talexo and its Clients as an independent professional. You retain full control over how, when, and where you perform the services agreed in a Freelance Agreement, subject to the deliverable requirements and timelines specified therein.</div>
                <div><strong className="text-white">3.2 No Entitlement to Employment Benefits:</strong> As an independent freelancer, you are not entitled to any benefits associated with employment, including but not limited to: paid leave, gratuity, provident fund contributions, ESI, bonus, reimbursement of expenses (unless specifically agreed), or any other statutory or non-statutory employment benefit.</div>
                <div><strong className="text-white">3.3 No Exclusivity:</strong> This Agreement does not prevent you from providing services to other clients or platforms, provided that such activities do not conflict with any active Freelance Agreement, non-compete obligations, or the confidentiality obligations set out in Clause 13.</div>
                <div><strong className="text-white">3.4 No Guarantee of Work:</strong> Talexo does not guarantee any minimum volume of work, Engagements, or income. Your listing on the Platform does not constitute a promise or commitment of work.</div>
                <div><strong className="text-white">3.5 Taxes and Statutory Compliance:</strong> As an independent freelancer, you are responsible for your own professional and business registrations, GST registration (if applicable based on your turnover), filing of income tax returns, and compliance with all applicable laws governing self-employed or freelance professionals in India. Talexo will deduct TDS and other applicable statutory amounts from payments made to you.</div>
             </div>
          </section>

          <section id="account" className="scroll-mt-32 space-y-8">
             <div>
                 <h2 className="text-2xl font-bold text-white mb-4">4. Eligibility</h2>
                 <p className="mb-3">To register as a Freelancer on Talexo, you must satisfy all of the following criteria at the time of registration and at all times during your listing:</p>
                 <ul className="space-y-2 list-disc list-inside pl-4 text-slate-400">
                    <li>Be at least 18 years of age.</li>
                    <li>Hold the professional qualifications, certifications, and experience you declare on your Profile.</li>
                    <li>Be legally authorised to provide freelance or professional services in India (or the jurisdiction where you seek Engagement).</li>
                    <li>Not be subject to any court order, professional disqualification, regulatory bar, or insolvency proceeding that would prevent you from practising in your declared domain.</li>
                    <li>Not be a full-time employee of a company where providing freelance services would constitute a conflict of interest or breach of your employment contract, unless you have obtained your employer's prior written consent.</li>
                    <li>Agree to and comply with all terms set out in this Agreement.</li>
                 </ul>
                 <p className="mt-4 text-sm text-red-400">Talexo reserves the right to refuse registration, decline listing, or revoke an existing listing at any time if eligibility criteria are not met or are found to have been misrepresented.</p>
             </div>

             <div>
                 <h2 className="text-2xl font-bold text-white mb-4">5. Registration and Profile</h2>
                 <div className="space-y-4">
                    <div><strong className="text-white">5.1 Accurate Information:</strong> You agree to provide true, accurate, current, and complete information during registration and to update your Profile promptly whenever any information changes. Misrepresentation is a serious breach of this Agreement.</div>
                    <div><strong className="text-white">5.2 Profile Responsibility:</strong> You are solely responsible for the content of your Profile. Talexo does not independently verify every item; however, Assessment results are verified through Talexo's testing process.</div>
                    <div>
                       <strong className="text-white">5.3 Document Submission:</strong> You agree to submit, upon request, all documents reasonably required to verify your identity, qualifications, and standing. These may include Government ID, PAN Card, Degrees, Membership certificates, and Experience letters. Failure to produce them may result in listing suspension.
                    </div>
                    <div><strong className="text-white">5.4 Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials. Notify Talexo immediately at support@talexo.in if you suspect unauthorized use.</div>
                    <div><strong className="text-white">5.5 Single Account:</strong> You may not register more than one account on the Platform. Duplicate accounts will be deactivated.</div>
                 </div>
             </div>
          </section>

          <section id="assessments" className="scroll-mt-32 space-y-8">
             <div>
                 <h2 className="text-2xl font-bold text-white mb-4">6. Skill Assessment Process</h2>
                 <div className="space-y-4">
                    <div><strong className="text-white">6.1 Mandatory Assessment:</strong> Listing on the Platform is conditional on successfully completing the relevant domain-specific Assessment designated by Talexo.</div>
                    <div>
                       <strong className="text-white">6.2 Assessment Conduct:</strong> You agree to: attempt the test independently; not share, reproduce, record, or disclose questions/answers; comply with all instructions; and acknowledge that Talexo may use proctoring tools to ensure integrity.
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
                       <strong className="text-blue-400">6.3 Re-Assessment:</strong> If you do not achieve the required score, you may re-attempt the Assessment after a mandatory cooling-off period of <strong>five (05) days</strong> from the date of the previous attempt.
                    </div>
                    <div><strong className="text-white">6.4 Assessment Results:</strong> Assessment results are the property of Talexo. A passing score does not guarantee Engagement; it is a prerequisite for listing only.</div>
                    <div><strong className="text-red-400">6.5 Disqualification:</strong> Any attempt to cheat, circumvent, misrepresent, or manipulate the assessment process will result in immediate and permanent removal from the Platform.</div>
                 </div>
             </div>

             <div>
                 <h2 className="text-2xl font-bold text-white mb-4">7. Client Due Diligence & Interviews</h2>
                 <div className="space-y-4">
                    <div><strong className="text-white">7.1 Client's Right:</strong> Clients have the independent right to conduct their own due diligence (interviews, document verification, background checks, portfolio review). Talexo does not restrict this process.</div>
                    <div>
                       <strong className="text-white">7.2 Mandatory Interview Attendance:</strong> If a Client requests an interview, you are required to attend punctually or provide a minimum 24 hours' advance notice if unable to attend. Repeated unprofessional conduct may result in removal.
                    </div>
                    <div><strong className="text-white">7.3 Document Production:</strong> You agree to produce all documents required during due diligence within the specified timeline.</div>
                    <div><strong className="text-white">7.4 Background Checks:</strong> By registering, you consent to Talexo and its Clients conducting background verification and reference checks.</div>
                    <div><strong className="text-white">7.5 No Guarantee:</strong> Completion of due diligence or interviews does not guarantee an Engagement.</div>
                 </div>
             </div>
          </section>

          <section id="obligations" className="scroll-mt-32 space-y-8">
             <div>
                 <h2 className="text-2xl font-bold text-white mb-4">8. Listing and Visibility</h2>
                 <div className="space-y-4">
                    <p><strong className="text-white">8.1 Listing Criteria:</strong> Successful Assessment is the primary criterion. Additional criteria like minimum experience may apply.</p>
                    <p><strong className="text-white">8.2 Visibility:</strong> Once listed, your Profile (name, domain, experience, scores) will be visible to Clients. You expressly consent to this visibility.</p>
                    <p><strong className="text-white">8.3 Profile Pausing:</strong> You may request to pause your listing at any time by notifying support@talexo.in. Active Engagements are not affected.</p>
                    <p><strong className="text-white">8.4 Removal of Listing:</strong> Talexo reserves the right to remove your listing for breaches, dishonest assessments, misrepresentation, ignoring interviews, negative feedback, or prohibited conduct.</p>
                 </div>
             </div>

             <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl">
                 <h2 className="text-xl font-bold text-white mb-4">9. Candidate Obligations</h2>
                 <p className="mb-3">In addition to other obligations, you agree at all times to:</p>
                 <ul className="space-y-2 list-disc list-inside pl-4 text-slate-400 text-sm">
                    <li>Represent your qualifications and standing honestly.</li>
                    <li>Update your Profile promptly regarding availability or credential changes.</li>
                    <li>Respond professionally and promptly to outreach.</li>
                    <li>Attend scheduled Client interviews (or give 24h notice).</li>
                    <li>Not approach a Client directly to circumvent Talexo (See Clause 11).</li>
                    <li>Maintain strict confidentiality of Client information.</li>
                    <li>Issue valid GST-compliant invoices to Talexo on time.</li>
                    <li>Maintain necessary professional registrations and not use the Platform for unlawful purposes.</li>
                 </ul>
             </div>
          </section>

          <section id="payments" className="scroll-mt-32">
             <h2 className="text-2xl font-bold text-white mb-6">10. Fees, Payments and Invoicing</h2>
             
             <div className="space-y-6">
                <div>
                   <strong className="text-white text-lg block mb-2">10.1 Freelance Compensation Structure</strong>
                   <p>Your compensation will be negotiated and agreed upon exclusively between you and Talexo, documented in a Freelance Agreement. Talexo retains the sole right to negotiate pricing with the end-Client. <strong className="text-red-400">You are strictly prohibited from discussing or negotiating fees directly with the Client.</strong></p>
                </div>

                <div>
                   <strong className="text-white text-lg block mb-4">10.2 Invoice Submission Deadline</strong>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr>
                               <th className="border-b border-slate-700 bg-slate-800/50 px-4 py-3 text-white font-bold rounded-tl-xl">Engagement Type</th>
                               <th className="border-b border-slate-700 bg-slate-800/50 px-4 py-3 text-white font-bold rounded-tr-xl">Invoice Submission Deadline</th>
                            </tr>
                         </thead>
                         <tbody className="text-sm divide-y divide-slate-800 bg-slate-900/20">
                            <tr><td className="px-4 py-3">Milestone-based</td><td className="px-4 py-3 text-slate-400">Within 7 calendar days of milestone sign-off</td></tr>
                            <tr><td className="px-4 py-3">Monthly Retainer</td><td className="px-4 py-3 text-slate-400">By the 5th calendar day of the following month</td></tr>
                            <tr><td className="px-4 py-3">Project Completion</td><td className="px-4 py-3 text-slate-400">Within 7 calendar days of final project delivery</td></tr>
                            <tr><td className="px-4 py-3">Any other</td><td className="px-4 py-3 text-slate-400">As specified in the Freelance Agreement</td></tr>
                         </tbody>
                      </table>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4">
                   <div>
                      <strong className="text-white block mb-2">10.3 Invoice Requirements</strong>
                      <p className="text-sm">Invoices must include your PAN/GST, Talexo's address, clear service description, exact fee, and Freelance Agreement reference number.</p>
                   </div>
                   <div>
                      <strong className="text-white block mb-2">10.4 Payment Processing</strong>
                      <p className="text-sm">Payments are processed after receiving a valid invoice, confirmation of service delivery, and deduction of applicable Statutory Deductions (like TDS under Sec 194C/194J).</p>
                   </div>
                   <div>
                      <strong className="text-white block mb-2">10.5 Fee Discussion Prohibition</strong>
                      <p className="text-sm text-red-400">Discussing compensation or commercial terms directly with the Client may result in immediate termination and forfeiture of payments.</p>
                   </div>
                   <div>
                      <strong className="text-white block mb-2">10.6 & 10.7 No Registration Fee & Tax</strong>
                      <p className="text-sm">Listing is currently free. You remain solely responsible for your own income tax and GST returns.</p>
                   </div>
                </div>
             </div>
          </section>

          <section id="conduct" className="scroll-mt-32 space-y-8">
             <div className="bg-orange-950/20 border border-orange-900/50 p-6 rounded-2xl">
                 <h2 className="text-xl font-bold text-orange-500 mb-3">11. Non-Circumvention (12-Month Restriction)</h2>
                 <p className="text-orange-200/80 text-sm leading-relaxed mb-3">
                   If Talexo introduces you to a Client or facilitates a connection, you agree <strong className="text-white">not to directly contact, solicit, or engage with that Client for professional services outside the Platform for a period of twelve (12) months</strong> from the date of introduction, without Talexo's prior written consent.
                 </p>
                 <p className="text-orange-200/80 text-sm leading-relaxed">
                   A breach of this clause entitles Talexo to claim liquidated damages equivalent to the service fee that would have been payable to Talexo had the Engagement been properly facilitated.
                 </p>
             </div>

             <div>
                 <h2 className="text-2xl font-bold text-white mb-4">12. Prohibited Conduct</h2>
                 <ul className="grid md:grid-cols-2 gap-3 text-sm">
                    {["Upload false, fabricated, or fraudulent documents.", "Impersonate any other person or entity.", "Negotiate fees directly with a Client.", "Solicit direct engagements bypassing Talexo.", "Use bots or scripts to interact with the Platform.", "Disclose confidential Client information.", "Use the Platform to harass or defame.", "Violate any applicable law or professional code."].map((item, i) => (
                       <li key={i} className="flex gap-2"><XOctagon size={16} className="text-red-500 shrink-0 mt-0.5" /> <span className="text-slate-400">{item}</span></li>
                    ))}
                 </ul>
             </div>

             <div>
                 <h2 className="text-2xl font-bold text-white mb-2">13. Confidentiality</h2>
                 <p>Any non-public information you receive about a Client must be treated as strictly confidential. This obligation survives termination and remains binding for a period of <strong className="text-white">three (3) years</strong> following the end of the Engagement, or indefinitely for trade secrets.</p>
             </div>
          </section>

          <section id="privacy" className="scroll-mt-32 space-y-8">
             <div>
                 <h2 className="text-2xl font-bold text-white mb-4">14. Privacy and Data Protection</h2>
                 <div className="space-y-3 text-sm">
                    <p><strong className="text-white">14.1 Collection:</strong> By registering, you consent to Talexo collecting and processing your personal data (name, PAN, Aadhaar, assessment results) to operate the Platform.</p>
                    <p><strong className="text-white">14.2 Sharing:</strong> Profile information is shared with Clients. Talexo will not sell your personal data to unrelated third parties.</p>
                    <p><strong className="text-white">14.3 Retention:</strong> Data is retained while active and for three (3) years post-closure, subject to legal obligations.</p>
                    <p><strong className="text-white">14.4 Law:</strong> Governed by the IT Act 2000 and Digital Personal Data Protection Act 2023.</p>
                 </div>
             </div>

             <div>
                 <h2 className="text-2xl font-bold text-white mb-4">15. Intellectual Property</h2>
                 <div className="space-y-3 text-sm">
                    <p><strong className="text-white">15.1 Talexo's IP:</strong> Platform content (assessments, design) is Talexo's exclusive IP.</p>
                    <p><strong className="text-white">15.2 Work Product:</strong> Unless agreed otherwise, deliverables created during an Engagement are works made for the Client and vest in the Client upon full payment.</p>
                    <p><strong className="text-white">15.3 Candidate Content:</strong> You own your Profile content but grant Talexo a license to display it to promote your listing.</p>
                 </div>
             </div>
          </section>

          <section id="legal" className="scroll-mt-32 space-y-8">
             <div>
                 <h2 className="text-2xl font-bold text-white mb-4">16-20. Legal Provisions & Termination</h2>
                 
                 <div className="space-y-6">
                    <div>
                       <strong className="text-white block mb-1">Limitation of Liability (16)</strong>
                       <p className="text-sm">Talexo is an intermediary and does not warrant that a listing results in an Engagement. Liability is capped at the total fees paid by you to Talexo in the preceding 12 months. Talexo is not liable for consequential loss.</p>
                    </div>

                    <div>
                       <strong className="text-white block mb-1">Term and Termination (17)</strong>
                       <p className="text-sm">You may close your account via support@talexo.in. Talexo may terminate for material breach. Active Engagements will be concluded per the Freelance Agreement. Confidentiality and Non-circumvention clauses survive termination.</p>
                    </div>

                    <div>
                       <strong className="text-white block mb-1">Governing Law and Dispute (18)</strong>
                       <p className="text-sm">Governed by the laws of India. Disputes unresolved within 30 days will be referred to Arbitration under the Arbitration and Conciliation Act 1996. English language, sole arbitrator.</p>
                    </div>

                    <div>
                       <strong className="text-white block mb-1">Amendments (19) & General Provisions (20)</strong>
                       <p className="text-sm">Talexo may update Terms with 15 days notice. This Agreement supersedes prior discussions. Force Majeure applies to unforeseen disruptions.</p>
                    </div>
                 </div>
             </div>

             <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 p-6 rounded-2xl mt-8">
                <h3 className="text-lg font-bold text-white mb-4">Confirmation of Agreement</h3>
                <p className="mb-3 text-sm text-blue-200">BY REGISTERING ON THE TALEXO PLATFORM, YOU CONFIRM THAT:</p>
                <ul className="space-y-2 text-sm text-blue-100/80 font-medium">
                   <li>1. You have read and understood these Terms and Conditions in their entirety.</li>
                   <li>2. You agree to be legally bound by this Agreement as an independent freelancer.</li>
                   <li>3. You acknowledge that your relationship with Talexo and Clients is contractual, not employment.</li>
                   <li>4. You meet all eligibility criteria set out in Clause 4.</li>
                   <li>5. You are authorised to enter into this Agreement on your own behalf.</li>
                   <li>6. You understand that having a profile and giving tests does not guarantee work.</li>
                </ul>
             </div>
          </section>

          <section id="contact" className="scroll-mt-32 border-t border-slate-800 pt-12 pb-8">
             <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-white">21. Contact Us</h2>
                <p className="text-slate-400 max-w-lg mx-auto">For any questions about these Terms, please write to us before using the Platform.</p>
                
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                   <div className="text-left">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Us</span>
                      <a href="mailto:support@talexo.in" className="text-blue-400 font-medium hover:text-blue-300">support@talexo.in</a>
                   </div>
                   <div className="w-px bg-slate-800 hidden md:block"></div>
                   <div className="text-left">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Grievance Officer</span>
                      <a href="mailto:grievance@talexo.in" className="text-blue-400 font-medium hover:text-blue-300">grievance@talexo.in</a>
                   </div>
                   <div className="w-px bg-slate-800 hidden md:block"></div>
                   <div className="text-left">
                      <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company</span>
                      <span className="text-slate-300 font-medium block">Talexo Technologies Pvt. Ltd.</span>
                      <a href="https://www.talexo.in" target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">www.talexo.in</a>
                   </div>
                </div>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}