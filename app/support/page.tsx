"use client";
import { ArrowLeft, HeadphonesIcon, Mail, MessageCircle, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

// 🔥 Naye Master Components 🔥
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-transparent text-slate-900 p-6 md:p-12 font-sans relative z-10">
      <div className="max-w-4xl mx-auto relative z-10">
        
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')} 
          className="mb-8 pl-0 hover:bg-transparent"
        >
          <div className="bg-white border border-slate-200 p-2 rounded-xl shadow-sm text-slate-600 hover:text-[#0f947e] transition-colors">
            <ArrowLeft size={20} />
          </div>
          <span className="font-bold text-slate-700">Back to Home</span>
        </Button>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-teal-50 border border-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <HeadphonesIcon size={40} className="text-[#0f947e]"/>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">How can we help?</h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">Having trouble with your assessment or profile? Our support team is here to help you out.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:border-blue-300 transition-colors shadow-lg group">
             <Mail className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={32}/>
             <h3 className="text-xl font-extrabold text-slate-900 mb-2">Email Support</h3>
             <p className="text-slate-500 font-medium text-sm mb-4">Drop us an email anytime. We usually reply within 24 hours.</p>
             <a href="mailto:connect@resourcemania.in" className="text-blue-600 font-bold hover:underline">connect@resourcemania.in</a>
          </Card>

          <Card className="hover:border-emerald-300 transition-colors shadow-lg group">
             <MessageCircle className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={32}/>
             <h3 className="text-xl font-extrabold text-slate-900 mb-2">Live Chat / WhatsApp</h3>
             <p className="text-slate-500 font-medium text-sm mb-4">Urgent issue during an exam? Message our technical team directly.</p>
             <a href="#" onClick={(e) => { e.preventDefault(); alert("WhatsApp Support coming soon!"); }} className="text-emerald-600 font-bold hover:underline">+91 98XXX XXXXX</a>
          </Card>
        </div>

        <Card className="shadow-2xl md:p-12">
           <h3 className="text-2xl font-extrabold text-slate-900 mb-8">Frequently Asked Questions</h3>
           
           <div className="space-y-6">
              <div className="border-b border-slate-100 pb-6">
                 <h4 className="text-slate-900 font-extrabold mb-2">My test got terminated. What should I do?</h4>
                 <p className="text-sm text-slate-600 font-medium leading-relaxed">If your test was terminated due to tab-switching or right-clicking, you will need to request a re-test from your dashboard. Admin approval is required to unlock your profile.</p>
              </div>
              <div className="border-b border-slate-100 pb-6">
                 <h4 className="text-slate-900 font-extrabold mb-2">How does the AI Salary Calculator work?</h4>
                 <p className="text-sm text-slate-600 font-medium leading-relaxed">Our AI analyzes your exact qualification (e.g., CA 1st attempt vs Multiple attempts) and aligns it with current Indian market standards to suggest a realistic Expected CTC.</p>
              </div>
              <div>
                 <h4 className="text-slate-900 font-extrabold mb-2">I am an employer. How do I unlock candidate details?</h4>
                 <p className="text-sm text-slate-600 font-medium leading-relaxed">Employers need an approved company account to view full contact details. Please register via the 'For Companies' portal and await admin verification.</p>
              </div>
           </div>
        </Card>

      </div>
    </div>
  );
}