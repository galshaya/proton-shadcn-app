"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

const statusIcons = {
  success: <CheckCircle className="h-4 w-4 text-green-500" />,
  failed: <XCircle className="h-4 w-4 text-red-500" />,
  warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  running: <Clock className="h-4 w-4 text-blue-500 animate-spin" />,
};

const statusColors = {
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800",
  running: "bg-blue-100 text-blue-800",
};

export function ScrapingPackageHistory({ history = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run History</CardTitle>
        <CardDescription>
          View the history of scraping package runs and their results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
              <div className="text-2xl font-bold">{history.length}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <div className="text-2xl font-bold">
                {Math.round(
                  (history.filter((run) => run.status === "success").length /
                    history.length) *
                    100
                )}
                %
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">
                Documents Found
              </CardTitle>
              <div className="text-2xl font-bold">
                {history.reduce((sum, run) => sum + (run.documentsFound || 0), 0)}
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">
                Average Duration
              </CardTitle>
              <div className="text-2xl font-bold">
                {Math.round(
                  history.reduce((sum, run) => sum + (run.duration || 0), 0) /
                    history.length
                )}
                s
              </div>
            </CardHeader>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((run, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {statusIcons[run.status]}
                    <Badge
                      variant="secondary"
                      className={statusColors[run.status]}
                    >
                      {run.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(run.startTime), "PPp")}
                </TableCell>
                <TableCell>{run.duration}s</TableCell>
                <TableCell>{run.documentsFound}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {run.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 