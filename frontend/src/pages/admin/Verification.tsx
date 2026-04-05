import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import StatusPill from "@/components/shared/StatusPill";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = ["All", "Pending", "Under Review", "Rejected"];

const drivers = [
  { id: 1, name: "Arun Prakash", date: "Mar 28", docs: { license: "approved", id: "approved", reg: "pending", ins: "pending" }, status: "pending" as const },
  { id: 2, name: "Muthu Selvam", date: "Mar 27", docs: { license: "approved", id: "rejected", reg: "approved", ins: "approved" }, status: "rejected" as const },
  { id: 3, name: "Ganesh R", date: "Mar 26", docs: { license: "pending", id: "pending", reg: "pending", ins: "pending" }, status: "pending" as const },
  { id: 4, name: "Vikram S", date: "Mar 25", docs: { license: "approved", id: "approved", reg: "approved", ins: "approved" }, status: "under-review" as const },
];

const docLabels = { license: "License", id: "ID", reg: "Reg", ins: "Insurance" };
const docColors: Record<string, string> = { approved: "bg-green-success/15 text-green-dark", pending: "bg-y-surface text-y-text", rejected: "bg-red-danger/10 text-red-dark" };

const AdminVerification: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [reviewId, setReviewId] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const reviewDriver = drivers.find(d => d.id === reviewId);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-rx-black">Verification Queue</h1>
          <p className="text-rx-gray-400 text-sm">23 pending reviews</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-rx-gray-100 mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? "text-rx-black border-b-2 border-y-primary font-bold" : "text-rx-gray-400 hover:text-rx-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-label text-rx-gray-400 border-b border-rx-gray-100">
                <th className="p-4">Driver</th>
                <th className="p-4">Submitted</th>
                <th className="p-4">Documents</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(d => (
                <tr key={d.id} className="border-b border-rx-gray-100 last:border-0 hover:bg-y-surface/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rx-gray-100 flex items-center justify-center text-rx-gray-700 font-bold text-sm">{d.name[0]}</div>
                      <span className="font-medium text-rx-black text-sm">{d.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-rx-gray-700">{d.date}</td>
                  <td className="p-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {Object.entries(d.docs).map(([key, val]) => (
                        <span key={key} className={`text-[10px] font-semibold rounded-pill px-2 py-0.5 ${docColors[val]}`}>
                          {docLabels[key as keyof typeof docLabels]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4"><StatusPill status={d.status} /></td>
                  <td className="p-4">
                    <Button size="pill" onClick={() => { setReviewId(d.id); setRejecting(false); }}>Review</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {reviewDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-modal p-8 w-full max-w-[560px] shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-rx-black">Review Driver</h2>
              <button onClick={() => setReviewId(null)}><X size={20} className="text-rx-gray-400" /></button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-rx-gray-100 flex items-center justify-center text-rx-gray-700 font-bold text-lg">{reviewDriver.name[0]}</div>
              <div>
                <p className="font-bold text-rx-black">{reviewDriver.name}</p>
                <p className="text-rx-gray-400 text-sm">White Swift Dzire · TN 09 AB 1234</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {Object.entries(reviewDriver.docs).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-rx-gray-100 last:border-0">
                  <span className="text-sm text-rx-black">{docLabels[key as keyof typeof docLabels]}</span>
                  <div className="flex items-center gap-3">
                    <button className="text-y-primary text-sm font-medium">View Document</button>
                    <StatusPill status={val as any} />
                  </div>
                </div>
              ))}
            </div>

            {rejecting && (
              <div className="mb-4">
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Rejection reason..."
                  className="w-full h-20 border border-rx-gray-100 rounded-input p-3 text-sm outline-none focus:border-red-danger resize-none"
                />
              </div>
            )}

            <div className="flex gap-3">
              {rejecting ? (
                <Button variant="destructive" className="flex-1" onClick={() => setReviewId(null)}>
                  Submit Rejection
                </Button>
              ) : (
                <>
                  <Button variant="outline-red" className="flex-1" onClick={() => setRejecting(true)}>
                    Reject
                  </Button>
                  <Button className="flex-1" onClick={() => setReviewId(null)}>
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminVerification;
