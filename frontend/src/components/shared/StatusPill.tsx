import React from "react";
import { cn } from "@/lib/utils";

interface StatusPillProps {
  status: "online" | "offline" | "pending" | "approved" | "rejected" | "in-transit" | "searching" | "cancelled" | "completed" | "arriving" | "trip-in-progress" | "driver-on-way" | "driver-arrived" | "paid" | "under-review";
  className?: string;
  children?: React.ReactNode;
}

const statusStyles: Record<string, string> = {
  online: "bg-green-success/15 text-green-dark",
  offline: "bg-rx-gray-100 text-rx-gray-700",
  pending: "bg-y-surface text-y-text",
  approved: "bg-green-success/15 text-green-dark",
  rejected: "bg-red-danger/10 text-red-dark",
  "in-transit": "bg-green-success/15 text-green-dark",
  searching: "bg-y-surface text-y-text",
  cancelled: "bg-red-danger/10 text-red-dark",
  completed: "bg-green-success/15 text-green-dark",
  arriving: "bg-y-surface text-y-text animate-pulse",
  "trip-in-progress": "bg-green-success/15 text-green-dark",
  "driver-on-way": "bg-y-surface text-y-text",
  "driver-arrived": "bg-y-primary/20 text-y-text animate-pulse",
  paid: "bg-green-success/15 text-green-dark",
  "under-review": "bg-y-surface text-y-text",
};

const statusLabels: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  "in-transit": "In Transit",
  searching: "Searching",
  cancelled: "Cancelled",
  completed: "Completed",
  arriving: "Arriving",
  "trip-in-progress": "Trip in Progress",
  "driver-on-way": "Driver on the way",
  "driver-arrived": "Driver Arrived",
  paid: "Paid",
  "under-review": "Under Review",
};

const StatusPill: React.FC<StatusPillProps> = ({ status, className, children }) => {
  return (
    <span className={cn("inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold", statusStyles[status], className)}>
      {children || statusLabels[status]}
    </span>
  );
};

export default StatusPill;
