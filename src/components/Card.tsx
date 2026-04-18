import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "glass-light" | "solid";
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  variant = "glass",
  onClick,
}: CardProps) {
  const baseClasses =
    "rounded-lg p-6 transition-smooth border";

  const variants = {
    glass:
      "bg-glass-dark border-opacity-30 backdrop-blur-md border-accent-light",
    "glass-light":
      "bg-glass-lighter border-opacity-20 backdrop-blur-sm border-accent-light",
    solid: "bg-dark-card border-dark-border",
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className} ${
        onClick ? "cursor-pointer hover:border-accent-purple" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
