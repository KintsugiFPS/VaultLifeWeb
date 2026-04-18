import React from "react";

interface AvatarProps {
  mood: "happy" | "neutral" | "stressed" | "excited";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const moodEmojis = {
  happy: "😊",
  neutral: "😐",
  stressed: "😰",
  excited: "🤩",
};

const moodColors = {
  happy: "text-green-400",
  neutral: "text-yellow-400",
  stressed: "text-red-400",
  excited: "text-accent-light",
};

export function Avatar({ mood, size = "md", className = "" }: AvatarProps) {
  const sizes = {
    sm: "text-4xl",
    md: "text-6xl",
    lg: "text-8xl",
    xl: "text-9xl",
  };

  return (
    <div
      className={`flex items-center justify-center ${sizes[size]} ${moodColors[mood]} transition-all duration-300 ${className}`}
    >
      {moodEmojis[mood]}
    </div>
  );
}
