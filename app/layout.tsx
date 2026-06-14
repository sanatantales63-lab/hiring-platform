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
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative`}>
        
        {/* Clean Background Base - Specific pages like Home will draw their own grids */}
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-50 pointer-events-none bg-slate-50"></div>

        {/* MAIN CONTENT OF EVERY PAGE GOES HERE */}
        <div className="relative z-10 flex-1 flex flex-col">
           {children}
        </div>

      </body>
    </html>
  );
}