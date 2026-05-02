import { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`bg-[var(--card)]/95 backdrop-blur-xl border border-[var(--border)] p-6 md:p-8 rounded-3xl shadow-elevated transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}