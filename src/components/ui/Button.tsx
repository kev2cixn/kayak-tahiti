import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "electric" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "font-black uppercase tracking-tight transition-colors disabled:opacity-30 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#0a0a0a] text-white hover:bg-[#192ee2]",
    electric: "bg-[#192ee2] text-white hover:bg-blue-700",
    ghost:
      "bg-transparent text-[#0a0a0a] border-2 border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-5 text-lg w-full",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
