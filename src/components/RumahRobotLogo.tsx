"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function RumahRobotLogo({ className = "", size = "md" }: LogoProps) {
  // Height classes based on size prop
  const heights = {
    sm: "h-10 sm:h-12",
    md: "h-16 sm:h-20",
    lg: "h-28 sm:h-36"
  };

  const heightClass = heights[size];

  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* Official Transparent PNG Logo converted from the user's correct photo */}
      <img 
        src="/media__1780141191072_transparent.png" 
        alt="Rumah Robot Banten Logo" 
        className={`${heightClass} w-auto object-contain transition-transform duration-300 hover:scale-105`}
        draggable={false}
      />
    </div>
  );
}
