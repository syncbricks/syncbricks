"use client";

import {
  DatabaseBackup,
  Play,
  Clock,
  HardDrive,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/status-badge";
import { PageHeader } from "@/components/common/page-header";

const stats = [
  { label: "Total Backups", value: "156", icon: DatabaseBackup, detail: "All time" },
  { label: "Last Backup", value: "2 hours ago", icon: Clock, detail: "ubuntu-server" },
  { label: "Total Size", value: "2.4 TB", icon: HardDrive, detail: "Across all targets" },
  { label: "Success Rate", value: "98.7%", icon: CheckCircle2, detail: "Last 30 days" },
];

const backupJobs = [
  { target: "ubuntu-server", type: "PBS", schedule: "Daily 02:00", lastRun: "2026-03-31 02:00", status: "success" as const, duration: "12m 34s", size: "42.1 GB", id: 1 },
  { target: "docker-host", type: "PBS", schedule: "Daily 02:30", lastRun: "2026-03-31 02:30", status: "success" as const, duration: "18m 12s", size: "86.3 GB", id: 2 },
  { target: "k3s-master", type: "PBS", schedule: "Daily 03:00", lastRun: "2026-03-31 03:00", status: "success" as const, duration: "8m 45s", size: "24.7 GB", id: 3 },
  { target: "nextcloud", type: "Restic", schedule: "Every 6h", lastRun: "2026-03-31 06:00", status: "success" as const, duration: "22m 18s", size: "156.2 GB", id: 4 },
  { target: "plex-media", type: "Restic", schedule: "Weekly Sun 01:00", lastRun: "2026-03-29 01:00", status: "success" as const, duration: "1h 45m", size: "890.4 GB", id: 5 },
  { target: "home-assistant", type: "Borg", schedule: "Daily 04:00", lastRun: "2026-03-31 04:00", status: "failed" as const, duration: "0m 12s", size: "-", id: 6 },
  { target: "pihole", type: "PBS", schedule: "Daily 03:30", lastRun: "2026-03-31 03:30", status: "success" as const, duration: "1m 08s", size: "2.1 GB", id: 7 },
  { target: "nginx-proxy", type: "PBS", schedule: "Daily 03:45", lastRun: "2026-03-31 03:45", status: "success" as const, duration: "0m 45s", size: "1.4 GB", id: 8 },
  { target: "wireguard", type: "Borg", schedule: "Daily 04:15", lastRun: "2026-03-31 04:15", status: "success" as const, duration: "0m 32s", size: "0.8 GB", id: 9 },
  { target: "nas-config", type: "Restic", schedule: "Daily 05:00", lastRun: "2026-03-31 05:00", status: "success" as const, duration: "3m 22s", size: "12.5 GB", id: 10 },
];

const recentHistory = [
  { time: "2026-03-31 06:00", target: "nextcloud", status: "success" as const },
  { time: "2026-03-31 05:00", target: "nas-config", status: "success" as const },
  { time: "2026-03-31 04:15", target: "wireguard", status: "success" as const },
  { time: "2026-03-31 04:00", target: "home-assistant", status: "failed" as const },
  { time: "2026-03-31 03:45", target: "nginx-proxy", status: "success" as const },
];

const typeColors: Record<string, string> = {
  PBS: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Restic: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Borg: "bg-orange-500/10 text-orange-400 border-orange-500/30",
};

export default function BackupsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<DatabaseBackup className="h-5 w-5" />}
        title="Backups"
        description="Backup status and disaster recovery"
        actions={
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Run Backup Now
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.detail}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Backup Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Target</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.target}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={typeColors[job.type]}>
                        {job.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {job.schedule}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {job.lastRun}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={job.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {job.duration}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {job.size}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentHistory.map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      entry.status === "success" ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                  <span className="font-medium text-sm">{entry.target}</span>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={entry.status} />
                  <span className="text-xs text-muted-foreground font-mono">
                    {entry.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
