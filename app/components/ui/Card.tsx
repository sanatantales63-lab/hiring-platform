import { ReactNode } from "react";

export default function Card({ 
  children, 
  className = "",
  onClick 
}: { 
  children: ReactNode; 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-[var(--border)] p-6 md:p-8 rounded-xl shadow-card transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
