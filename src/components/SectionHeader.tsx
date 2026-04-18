import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between mb-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-accent-purple hover:text-accent-light transition-smooth font-medium text-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
