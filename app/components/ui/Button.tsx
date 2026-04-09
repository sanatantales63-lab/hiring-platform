import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export default function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyle = "px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#0f947e] hover:bg-[#0c7a68] text-white shadow-lg shadow-teal-500/20",
    secondary: "bg-white border-2 border-slate-200 text-slate-700 hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50 shadow-sm",
    danger: "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100",
    ghost: "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}