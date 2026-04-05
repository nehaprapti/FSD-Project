import React from "react";
import { cn } from "@/lib/utils";
import { FileText, Check, AlertCircle, Upload } from "lucide-react";

export type DocStatus = "pending" | "uploaded" | "rejected";

interface DocumentUploadCardProps {
  name: string;
  status: DocStatus;
  rejectionReason?: string;
  onUpload?: () => void;
}

const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({ name, status, rejectionReason, onUpload }) => {
  return (
    <div className="bg-carbon-card rounded-[14px] border border-carbon-border p-4 my-2.5">
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-y-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm">{name}</p>
          <p className={cn("text-xs mt-0.5", {
            "text-rx-gray-400": status === "pending",
            "text-green-success": status === "uploaded",
            "text-red-danger": status === "rejected",
          })}>
            {status === "pending" && "Pending upload"}
            {status === "uploaded" && "Uploaded successfully"}
            {status === "rejected" && "Rejected"}
          </p>
          {status === "rejected" && rejectionReason && (
            <p className="text-red-danger text-[11px] mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {rejectionReason}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          {status === "uploaded" ? (
            <div className="w-8 h-8 rounded-full bg-green-success/20 flex items-center justify-center">
              <Check size={16} className="text-green-success" />
            </div>
          ) : (
            <button
              onClick={onUpload}
              className={cn(
                "rounded-pill px-4 py-2 text-xs font-bold",
                status === "rejected" ? "bg-red-danger text-white" : "bg-y-primary text-y-dark"
              )}
            >
              {status === "rejected" ? "Re-upload" : "Upload"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadCard;
