import React, { useState, useEffect } from 'react';
import { GlassCard, Button } from '../../components/UI';
import { AlertCircle, X, Loader2, Eye, XCircle, CheckCircle } from 'lucide-react';
import * as adminApi from '../../api/admin';

export const DriverVerificationPanel = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionDriverId, setRejectionDriverId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const fetchQueue = () => {
    setLoading(true);
    adminApi.getVerificationQueue()
      .then(setQueue)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (driverId: string) => {
    try {
      await adminApi.approveVerification(driverId);
      fetchQueue();
    } catch (err) {
      alert("Failed to approve verification.");
    }
  };

  const handleReject = async () => {
    if (!rejectionDriverId || !reason) return;
    setRejecting(true);
    try {
      await adminApi.rejectVerification(rejectionDriverId, reason);
      setRejectionDriverId(null);
      setReason("");
      fetchQueue();
    } catch (err) {
      alert("Failed to reject verification.");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pending Verifications</h1>

      {rejectionDriverId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <GlassCard className="w-full max-w-md animate-in zoom-in-95 duration-200 border-red-500/30">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle size={20} />
                <h3 className="font-bold">Rejection Reason</h3>
              </div>
              <button 
                onClick={() => setRejectionDriverId(null)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-white/50 mb-4">
              Please provide a clear reason why this driver application is being rejected. This will be shown on their dashboard.
            </p>

            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-red-500 outline-none transition-all h-32 mb-6"
              placeholder="e.g. Driver License photo is blurry or expired..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setRejectionDriverId(null)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-none"
                onClick={handleReject}
                disabled={!reason || rejecting}
              >
                {rejecting ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : queue.length === 0 ? (
        <GlassCard className="py-12 text-center text-white/50">
          No pending verifications found.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queue.map(item => (
            <GlassCard key={item.driverId} className="flex flex-col animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">
                  {item.driver?.name?.[0] || 'D'}
                </div>
                <div>
                  <h3 className="font-bold">{item.driver?.name || 'Unknown Driver'}</h3>
                  <p className="text-sm text-white/50">Applied {new Date(item.documents[0]?.uploadedAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6 flex-1">
                {item.documents.map((doc: any) => (
                  <div key={doc.documentType} className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                    <span className="text-sm text-white/70 capitalize">{doc.documentType.replace('_', ' ')}</span>
                    <div className="flex gap-2 items-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${doc.status === 'approved' ? 'bg-green-500/20 text-green-400' : doc.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {doc.status}
                      </span>
                      <a 
                        href={`http://localhost:5000${doc.fileRef}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary text-xs hover:underline flex items-center gap-1"
                      >
                        <Eye size={12} /> View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-auto">
                <Button variant="danger" className="flex-1 py-2" onClick={() => { setRejectionDriverId(item.driverId); setReason(""); }}><XCircle size={16} /> Reject</Button>
                <Button className="flex-1 py-2" onClick={() => handleApprove(item.driverId)}><CheckCircle size={16} /> Approve</Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
