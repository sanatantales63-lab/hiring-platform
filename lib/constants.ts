// app/lib/constants.ts

export const QUALIFICATIONS_LIST = [
  "ACCA Applied Knowledge Cleared",
  "ACCA Applied Skills Cleared",
  "ACCA Strategic Professional",
  "Association of Chartered Certified Accountants (ACCA)",
  "Bachelor of Accounting & Finance (BAF)",
  "Bachelor of Banking & Insurance (BBI)",
  "Bachelor of Business Administration – Finance (BBA Finance)",
  "Bachelor of Management Studies (BMS)",
  "Bachelor of Commerce (B.Com)",
  "CA Final",
  "CA Intermediate",
  "CA Foundation Cleared",
  "Certified Financial Planner (CFP)",
  "Certified Fraud Examiner (CFE)",
  "Certified Information Systems Auditor (CISA)",
  "Certified Internal Auditor (CIA)",
  "Certified Management Accountant (CMA – USA)",
  "Cost and Management Accountant (CMA – India)",
  "CS Professional",
  "CS Executive",
  "CS CSEET Cleared",
  "Financial Modeling & Valuation Analyst (FMVA)",
  "Financial Risk Manager (FRM)",
  "Indian Diploma in International Financial Reporting",
  "Insolvency Professional (IP)",
  "Master of Accounting & Finance (MAF)",
  "Master of Business Administration – Finance (MBA Finance)",
  "Master of Commerce (M.Com)",
  "Master of Financial Management (MFM)",
  "Post Graduate Diploma in Management – Finance (PGDM Finance)",
  "Registered Valuer (RV)"
];

// 🔥 NAYA EXCEL SHEET WALA DATA (Main Skills -> Sub Skills)
export const EXCEL_SKILLS_DATA: Record<string, string[]> = {
  "Financial Reporting and Accounting": [
    "Data Entry", "Accounting", "BookKeeping (Invoice, Bills, PO, SO)", 
    "Journal Entries", "Chart Of Accounts (Ledger) Design", "Accounting Standards", 
    "Month-End Books Closure", "Vendor/Customer Reconcilations", "IND AS Accounting", 
    "IND AS Implementation & Transition", "US GAAP", 
    "Preparation of Financial Statement (AS)", "Preparation of Financial Statement (IND AS)", 
    "Restatement of Accounts", "IPO Assistance for Accounts", "Accounts Payable Assistance", 
    "Accounts Receivables Assistance", "Lease Accounting", "Business Combinations Accounting", 
    "Consolidation of Accounts"
  ],
  "Corporate Law, Governance & Secretarial Practice": [
    "Company Incorporation", "MCA filings", "MOA/AOA/Deeds drafting",
    "Secretarial Audit", "Compliance Management", "Board Meeting Assistance"
  ],
  "Costing & Strategic Cost Management": [
    "MIS for Cost analysis", "MIS for Variance Analysis", "Process Costing",
    "Standard Costing", "Marginal Costing", "Budgeting & Forecasting"
  ],
  "Direct & International Taxation": [
    "Income Tax Return Preparation", "Income Tax Computation for Individuals", 
    "Income Tax Computation for Companies", "Tax Audit Assistance",
    "Transfer Pricing", "International Taxation Consulting", "TDS/TCS Returns"
  ],
  "Indirect Taxation": [
    "GST Registration", "GST Returns (GSTR-1, GSTR-3B)", "GST Reconciliation",
    "GST Audit Assistance", "Customs Duty Compliance", "E-way Bill Generation"
  ],
  "Audit & Assurance": [
    "Internal Audit", "Statutory Audit Assistance", "Stock Audit", "Vouching & Verification",
    "Concurrent Audit", "Forensic Audit", "Information Systems Audit"
  ],
  "Finance & Treasury": [
    "Financial Modeling", "Valuation", "Project Finance", "Working Capital Management",
    "Treasury Management", "Due Diligence"
  ]
};

// Purana Categories list (agar kahin aur use ho raha ho toh isko chhod diya hai safe side ke liye)
export const SKILL_CATEGORIES = {
  "Accounting & Audit": [
    "Certificate Course on IFRS (India)", "Certified Internal Auditor (CIA)",
    "Certified Information Systems Auditor (CISA)", "US CPA Bridge Course",
    "QuickBooks Certification", "Tally Certification", "Zoho Books Certification"
  ],
  "Finance & Valuation": [
    "Financial Modeling & Valuation Analyst (FMVA)", "Business Valuation Certification",
    "Certified Financial Modeler (CFM)", "Certified Merger & Acquisition Professional (CMAP)",
    "Private Equity & Venture Capital Certification", "Portfolio Management Certification"
  ],
  "Risk & Compliance": [
    "Certified Anti-Money Laundering Specialist (CAMS)", "Certified Fraud Examiner (CFE)",
    "Banking Risk & Compliance Certification", "Credit Risk Analysis Certification",
    "Certified Risk Management Professional (CRMP)", "Sustainability & Climate Risk Certification"
  ],
  "Tech, Data & ERP": [
    "Advanced Excel Certification", "Alteryx Certification", "Business Analytics Certification",
    "Microsoft Dynamics 365 Finance Certification", "Oracle Financials Certification",
    "Power BI Certification", "Python for Finance Certification", "SAP FICO Certification",
    "SAP S/4HANA Finance Certification", "SQL for Finance Certification", "Tableau Certification"
  ],
  "Other Core Skills": [
    "Agile & Scrum Certification", "Blockchain in Finance Certification",
    "Project Management Professional (PMP)", "Six Sigma (Yellow / Green / Black Belt)",
    "Trade Finance Certification (CDCS)", "Transfer Pricing Certification"
  ]
};