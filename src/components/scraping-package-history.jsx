"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Calendar, FileText, ArrowDownToLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export function ScrapingPackageHistory({ packageId, onClose }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Mock loading history data
    const mockHistory = [
      {
        id: "hist_1",
        packageId: packageId,
        runDate: "2025-01-15T10:00:00Z",
        status: "success",
        itemsFound: 24,
        itemsProcessed: 24,
        duration: "3m 45s",
        error: null
      },
      {
        id: "hist_2",
        packageId: packageId,
        runDate: "2025-01-08T10:00:00Z",
        status: "success",
        itemsFound: 18,
        itemsProcessed: 18,
        duration: "2m 30s",
        error: null
      },
      {
        id: "hist_3",
        packageId: packageId,
        runDate: "2025-01-01T10:00:00Z",
        status: "failed",
        itemsFound: 26,
        itemsProcessed: 3,
        duration: "0m 42s",
        error: "Connection timeout after 40s"
      },
      {
        id: "hist_4",
        packageId: packageId,
        runDate: "2025-01-22T10:00:00Z",
        status: "scheduled",
        itemsFound: null,
        itemsProcessed: null,
        duration: null,
        error: null
      },
      {
        id: "hist_5",
        packageId: packageId,
        runDate: "2025-01-16T14:30:00Z",
        status: "running",
        itemsFound: 12,
        itemsProcessed: 5,
        duration: "1m 22s (running)",
        error: null
      }
    ];
    
    setTimeout(() => {
      setHistory(mockHistory);
      setIsLoading(false);
    }, 500);
  }, [packageId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      (item.runDate && item.runDate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.status && item.status.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "completed" && item.status === "success") ||
      (statusFilter === "failed" && item.status === "failed") ||
      (statusFilter === "running" && item.status === "running") ||
      (statusFilter === "scheduled" && item.status === "scheduled");
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-600 text-white hover:bg-green-700">Completed</Badge>;
      case "failed":
        return <Badge className="bg-red-600 text-white hover:bg-red-700">Failed</Badge>;
      case "running":
        return <Badge className="bg-blue-600 text-white hover:bg-blue-700">Running</Badge>;
      case "scheduled":
        return <Badge className="bg-gray-600 text-white hover:bg-gray-700">Scheduled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="py-4 text-center text-gray-400">Loading history...</div>;
  }

  return (
    <div className="space-y-4 text-white">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-[#1e1f23] border-[#2d2e33] text-white placeholder:text-gray-500 focus:border-[#e80566] focus:ring-0"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-[#2d2e33] rounded-md overflow-hidden">
        <Table className="bg-[#1a1b1f]">
          <TableCaption className="text-gray-400">
            {filteredHistory.length === 0 
              ? "No history found"
              : `Showing ${filteredHistory.length} run${filteredHistory.length !== 1 ? 's' : ''}`}
          </TableCaption>
          <TableHeader className="bg-[#1e1f23]">
            <TableRow className="border-b border-[#2d2e33] hover:bg-transparent">
              <TableHead className="text-gray-300 font-medium">Date</TableHead>
              <TableHead className="text-gray-300 font-medium">Status</TableHead>
              <TableHead className="text-gray-300 font-medium">Items Found</TableHead>
              <TableHead className="text-gray-300 font-medium">Processed</TableHead>
              <TableHead className="text-gray-300 font-medium">Duration</TableHead>
              <TableHead className="text-gray-300 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length === 0 ? (
              <TableRow className="border-b border-[#2d2e33] hover:bg-[#262730]">
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  No history entries match your search
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((item) => (
                <TableRow key={item.id} className="border-b border-[#2d2e33] hover:bg-[#262730]">
                  <TableCell className="font-medium">{formatDate(item.runDate)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{item.itemsFound ?? "—"}</TableCell>
                  <TableCell>{item.itemsProcessed ?? "—"}</TableCell>
                  <TableCell>{item.duration ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33] hover:text-white"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" size="sm" className="border-[#2d2e33] text-gray-300 hover:bg-[#2d2e33] hover:text-white">
          <ArrowDownToLine className="h-4 w-4 mr-2" />
          Export History
        </Button>
        <Button onClick={onClose} className="bg-[#e80566] hover:bg-[#c30552] text-white">Close</Button>
      </div>
    </div>
  );
} 