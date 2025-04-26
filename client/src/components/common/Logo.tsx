import React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className || ""}`}>
      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold mr-2">
        R
      </div>
      <span className="text-lg font-semibold">RiderLink</span>
    </div>
  );
};

export default Logo;
