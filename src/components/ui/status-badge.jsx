"use client";

import { cn } from "@/lib/utils";

const statusColors = {
  Active: "bg-green-100 text-green-800",
  Archived: "bg-gray-100 text-gray-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Scheduled: "bg-blue-100 text-blue-800",
  Sent: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
  Draft: "bg-gray-100 text-gray-800",
  Inactive: "bg-gray-100 text-gray-800",
  Unsubscribed: "bg-red-100 text-red-800"
};

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusColors[status] || "bg-gray-100 text-gray-800",
        className
      )}
    >
      {status}
    </span>
  );
} 