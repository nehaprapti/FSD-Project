import React from "react";
import { cn } from "@/lib/utils";

interface MapContainerProps {
  dark?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MapContainer: React.FC<MapContainerProps> = ({ dark, className, children }) => {
  return (
    <div className={cn("relative w-full overflow-hidden", dark ? "bg-carbon" : "bg-[#e8e0d8]", className)}>
      {/* Stylized map placeholder */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        {/* Roads */}
        <line x1="0" y1="200" x2="800" y2="200" stroke={dark ? "#333" : "#d4cfc7"} strokeWidth="3" />
        <line x1="0" y1="400" x2="800" y2="400" stroke={dark ? "#333" : "#d4cfc7"} strokeWidth="3" />
        <line x1="200" y1="0" x2="200" y2="600" stroke={dark ? "#333" : "#d4cfc7"} strokeWidth="3" />
        <line x1="500" y1="0" x2="500" y2="600" stroke={dark ? "#333" : "#d4cfc7"} strokeWidth="3" />
        <line x1="100" y1="0" x2="700" y2="600" stroke={dark ? "#2a2a2a" : "#ddd8d0"} strokeWidth="2" />
        <line x1="300" y1="0" x2="800" y2="500" stroke={dark ? "#2a2a2a" : "#ddd8d0"} strokeWidth="2" />
        {/* Blocks */}
        <rect x="210" y="210" width="280" height="180" rx="4" fill={dark ? "#222" : "#ede9e1"} />
        <rect x="510" y="50" width="200" height="140" rx="4" fill={dark ? "#222" : "#ede9e1"} />
        <rect x="40" y="410" width="150" height="120" rx="4" fill={dark ? "#222" : "#ede9e1"} />
        <rect x="510" y="410" width="240" height="140" rx="4" fill={dark ? "#222" : "#ede9e1"} />
        {/* Main roads overlay */}
        <line x1="0" y1="300" x2="800" y2="300" stroke={dark ? "#444" : "#c8c2b8"} strokeWidth="5" />
        <line x1="400" y1="0" x2="400" y2="600" stroke={dark ? "#444" : "#c8c2b8"} strokeWidth="5" />
      </svg>
      {children}
    </div>
  );
};

export default MapContainer;
