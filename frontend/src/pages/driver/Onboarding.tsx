import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import DocumentUploadCard, { DocStatus } from "@/components/shared/DocumentUploadCard";
import { Button } from "@/components/ui/button";

const steps = ["Personal Info", "Vehicle Details", "Documents", "Review"];

interface Doc { name: string; status: DocStatus; reason?: string }

const DriverOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2); // Show Documents step
  const [docs, setDocs] = useState<Doc[]>([
    { name: "Driving License", status: "pending" },
    { name: "Aadhaar / ID Proof", status: "uploaded" },
    { name: "Vehicle Registration", status: "pending" },
    { name: "Insurance Certificate", status: "rejected", reason: "Document is expired" },
  ]);

  const handleUpload = (idx: number) => {
    setDocs(prev => prev.map((d, i) => i === idx ? { ...d, status: "uploaded" as DocStatus, reason: undefined } : d));
  };

  const allUploaded = docs.every(d => d.status === "uploaded");

  return (
    <div className="min-h-screen bg-carbon px-5 py-8">
      <div className="max-w-md mx-auto">
        {/* Progress stepper */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i < currentStep ? "bg-green-success text-white" :
                  i === currentStep ? "bg-y-primary text-y-dark" :
                  "bg-carbon-border text-rx-gray-400"
                }`}>
                  {i < currentStep ? <Check size={16} /> : i + 1}
                </div>
                <span className="text-[10px] text-rx-gray-400 mt-1.5 whitespace-nowrap">{step}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-px mx-2 ${i < currentStep ? "bg-green-success" : "bg-carbon-border"}`} />}
            </React.Fragment>
          ))}
        </div>

        <h2 className="text-white text-xl font-bold mb-1">Upload Required Documents</h2>
        <p className="text-rx-gray-400 text-[13px] mb-6">All documents are encrypted and reviewed within 24 hours</p>

        {docs.map((doc, i) => (
          <DocumentUploadCard
            key={doc.name}
            name={doc.name}
            status={doc.status}
            rejectionReason={doc.reason}
            onUpload={() => handleUpload(i)}
          />
        ))}

        <Button
          className="w-full mt-6"
          disabled={!allUploaded}
          style={!allUploaded ? { backgroundColor: "#333", color: "#666" } : undefined}
          onClick={() => navigate("/driver/dashboard")}
        >
          Submit for Review
        </Button>
      </div>
    </div>
  );
};

export default DriverOnboarding;
