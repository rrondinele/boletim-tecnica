import React, { ReactNode, HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "outline";
}

export function Badge({ children, className = "", variant, ...props }: BadgeProps) {
  const base = "inline-flex items-center px-2 py-1 text-xs font-semibold rounded";
  const variants = {
    outline: "border border-gray-300 text-gray-600",
    default: "bg-gray-100 text-gray-800"
  };
  const variantClass = variant ? variants[variant] : variants.default;

  return (
    <span className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
}
