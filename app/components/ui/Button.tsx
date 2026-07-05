import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export default function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyle =
    "px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2";

  const variants = {
    primary:   "bg-[var(--primary)] text-white hover:bg-[var(--primary-glow)] shadow-[var(--shadow-primary)] hover:-translate-y-px",
    secondary: "bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface)] hover:border-[var(--primary)]/40 shadow-soft",
    danger:    "bg-[#c53030] text-white hover:bg-[#b52020] shadow-soft",
    ghost:     "bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}