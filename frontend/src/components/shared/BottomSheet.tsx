import React from "react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  children: React.ReactNode;
  className?: string;
  showHandle?: boolean;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ children, className, showHandle = true }) => {
  return (
    <div className={cn("bg-white rounded-sheet shadow-sheet p-6 relative", className)}>
      {showHandle && (
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-rx-gray-100 rounded-pill" />
        </div>
      )}
      {children}
    </div>
  );
};

export default BottomSheet;
