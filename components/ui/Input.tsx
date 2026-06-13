"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, isPassword, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-text-secondary" style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none size-4">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full h-10 bg-bg-muted border border-border rounded-md px-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-120",
              "focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(79,126,247,0.12)]",
              leftIcon && "pl-10",
              isPassword && "pr-10",
              error && "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]",
              className
            )}
            style={{ fontFamily: "var(--font-inter)", fontSize: "14px", lineHeight: 1.5 }}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && (
          <span className="text-xs text-danger" style={{ fontSize: "12px", color: "var(--danger)" }}>
            {error}
          </span>
        )}
        {hint && !error && (
          <span className="text-xs text-text-tertiary" style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
export type { InputProps };
