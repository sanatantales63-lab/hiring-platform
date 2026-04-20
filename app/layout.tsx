import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resourcemania - The Future of Hiring",
  description: "Unlock your career with AI verified profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative`}>
        
        {/* 🌟 GLOBAL ANIMATED BACKGROUND (Visible on ALL pages) 🌟 */}
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-50 pointer-events-none bg-slate-50">
           
           {/* Animated Floating Neon Orbs (Glassmorphism Base) */}
           <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-teal-500/10 rounded-full blur-[100px] animate-blob"></div>
           <div className="absolute top-[40%] right-[-10%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-blob" style={{ animationDelay: "3s" }}></div>
           <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-blue-500/5 rounded-full blur-[120px] animate-blob" style={{ animationDelay: "6s" }}></div>
           
           {/* Premium Corporate SVG Dotted Grid Pattern */}
           <div className="absolute inset-0 opacity-[0.03]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                 <defs>
                    <pattern id="premium-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                       <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-teal-900" />
                    </pattern>
                 </defs>
                 <rect width="100%" height="100%" fill="url(#premium-grid)" />
              </svg>
           </div>
           
        </div>

        {/* MAIN CONTENT OF EVERY PAGE GOES HERE */}
        <div className="relative z-10 flex-1 flex flex-col">
           {children}
        </div>

      </body>
    </html>
  );
}