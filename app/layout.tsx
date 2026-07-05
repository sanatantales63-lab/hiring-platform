import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resourcemania - The Future of Hiring",
  description: "Unlock your career with AI verified profiles.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col relative font-sans">

        {/* Professional Background Base */}
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-50 pointer-events-none" style={{ background: "var(--background)" }}></div>

        {/* MAIN CONTENT OF EVERY PAGE GOES HERE */}
        <div className="relative z-10 flex-1 flex flex-col">
           {children}
        </div>

      </body>
    </html>
  );
}