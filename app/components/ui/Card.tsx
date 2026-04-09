import { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`bg-white/70 backdrop-blur-xl border border-slate-200/80 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}