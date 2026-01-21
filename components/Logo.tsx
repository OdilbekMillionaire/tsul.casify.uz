import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Background: Navy Squircle - Represents the secure, professional platform */}
      <rect x="0" y="0" width="100" height="100" rx="22" fill="#0f172a" />
      
      {/* Inner Border for definition on dark backgrounds */}
      <rect x="5" y="5" width="90" height="90" rx="18" stroke="#d97706" strokeWidth="1.5" strokeOpacity="0.2" />

      {/* The Symbol: Abstract Digital Scales */}
      {/* Center Pillar */}
      <path d="M50 25V75" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
      
      {/* Balance Beam */}
      <path d="M22 38H78" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
      
      {/* Tech Nodes (Left and Right Pans connections) */}
      <path d="M22 38V52" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
      <path d="M78 38V52" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
      
      {/* Digital Data Blocks (Weights/Pans) */}
      <rect x="15" y="52" width="14" height="14" rx="4" fill="#d97706" />
      <rect x="71" y="52" width="14" height="14" rx="4" fill="#d97706" />
      
      {/* Central Core (AI/Processing) */}
      <circle cx="50" cy="38" r="5" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
      
      {/* Base Connector */}
      <path d="M38 75H62" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;