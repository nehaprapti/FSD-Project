import React, { useState, useEffect } from 'react';
import { GlassCard, Button } from '../../components/UI';
import { Loader2, CheckCircle, AlertCircle, Clock, Upload } from 'lucide-react';
import * as verificationApi from '../../api/verification';

export const DriverVerification = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = () => {
    setLoading(true);
    verificationApi
      .getVerificationStatus()
      .then(setStatus)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileUpload = async (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      await verificationApi.uploadDocument(type, file);
      fetchStatus();
    } catch (err) {
      alert("Failed to upload document.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );

  const docs = status?.documents || [];
  const requiredTypes = [
    "license",
    "id_proof",
    "vehicle_registration",
    "insurance",
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div
          className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${
            status?.verificationStatus === "approved"
              ? "bg-green-500/20 text-green-400"
              : status?.verificationStatus === "rejected"
                ? "bg-red-500/20 text-red-500"
                : "bg-yellow-500/20 text-yellow-400"
          }`}
        >
          {status?.verificationStatus || "Incomplete"}
        </div>
      </div>
      <p className="text-white/50 mb-6">Manage your verification documents</p>

      <div className="flex flex-col gap-4">
        {requiredTypes.map((type) => {
          const doc = docs.find((d: any) => d.documentType === type);
          return (
            <GlassCard
              key={type}
              className={`border-l-4 ${
                doc?.reviewStatus === "approved"
                  ? "border-l-green-500"
                  : doc?.reviewStatus === "rejected"
                    ? "border-l-red-500"
                    : doc
                      ? "border-l-yellow-500"
                      : "border-l-white/10"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold capitalize">
                    {type.replace("_", " ")}
                  </h3>
                  <p className="text-sm text-white/50">
                    {doc
                      ? `Uploaded on ${new Date(doc.uploadedAt).toLocaleDateString()}`
                      : "Not uploaded yet"}
                  </p>
                </div>
                {doc ? (
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        doc.reviewStatus === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : doc.reviewStatus === "rejected"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {doc.reviewStatus === "approved" && (
                        <CheckCircle size={12} />
                      )}
                      {doc.reviewStatus === "rejected" && (
                        <AlertCircle size={12} />
                      )}
                      {doc.reviewStatus === "pending" && <Clock size={12} />}
                      <span className="capitalize">{doc.reviewStatus}</span>
                    </div>
                    {doc.reviewStatus === "rejected" && (
                      <button 
                         onClick={() => document.getElementById(`file-${type}`)?.click()}
                        className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline flex items-center gap-1"
                      >
                         <Upload size={10} /> Re-upload
                      </button>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="text-xs py-1 px-3 h-auto flex gap-2"
                    onClick={() => document.getElementById(`file-${type}`)?.click()}
                  >
                    <Upload size={14} /> Upload
                  </Button>
                )}
                <input 
                  type="file" 
                  id={`file-${type}`} 
                  className="hidden" 
                  accept="image/*,.pdf" 
                  onChange={(e) => handleFileUpload(type, e)}
                />
              </div>
              {doc?.remarks && doc.reviewStatus === "rejected" && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                  <strong>Reason:</strong> {doc.remarks}
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
