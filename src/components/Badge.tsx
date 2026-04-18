import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center rounded-full font-medium transition-smooth";

  const variants = {
    primary: "bg-accent-purple/20 text-accent-light border border-accent-purple/30",
    success: "bg-green-500/20 text-green-300 border border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    danger: "bg-red-500/20 text-red-300 border border-red-500/30",
    info: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
