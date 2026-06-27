import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold tracking-[0.15em] uppercase text-slate-500 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full border-2 border-slate-200 focus:border-[#192ee2]
          bg-slate-50 px-4 py-4
          text-slate-950 font-semibold text-base
          placeholder:text-slate-300
          outline-none transition-colors
          ${error ? "border-red-400 focus:border-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>
      )}
    </div>
  );
}
