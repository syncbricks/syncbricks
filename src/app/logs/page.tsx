"use client";

import { useState } from "react";
import { ScrollText, Search, Pause, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/common/page-header";

type LogSource = "Proxmox" | "Docker" | "pfSense" | "DNS" | "System";
type LogSeverity = "info" | "warning" | "error" | "critical";

interface LogEntry {
  timestamp: string;
  source: LogSource;
  severity: LogSeverity;
  message: string;
}

const logEntries: LogEntry[] = [
  { timestamp: "2026-03-31 10:45:12.342", source: "Docker", severity: "error", message: "Container 'portainer' exited with code 137 (OOMKilled)" },
  { timestamp: "2026-03-31 10:44:58.108", source: "Proxmox", severity: "warning", message: "Node pve1: disk usage at 91% on /dev/sda1 (local-lvm)" },
  { timestamp: "2026-03-31 10:44:33.891", source: "pfSense", severity: "info", message: "WAN interface re-negotiated link at 1Gbps full-duplex" },
  { timestamp: "2026-03-31 10:43:21.553", source: "Docker", severity: "info", message: "Container 'grafana' health check passed" },
  { timestamp: "2026-03-31 10:42:58.002", source: "DNS", severity: "info", message: "Pi-hole: blocked query for telemetry.microsoft.com from 10.11.12.45" },
  { timestamp: "2026-03-31 10:42:03.117", source: "System", severity: "info", message: "Automation: webhook sent to Discord for high disk alert" },
  { timestamp: "2026-03-31 10:41:45.882", source: "Proxmox", severity: "info", message: "VM 102 (nextcloud): snapshot 'daily-20260331' completed" },
  { timestamp: "2026-03-31 10:40:12.334", source: "Docker", severity: "warning", message: "Container 'nextcloud' response time exceeded 2000ms threshold" },
  { timestamp: "2026-03-31 10:39:58.221", source: "pfSense", severity: "warning", message: "Firewall: 14 blocked intrusion attempts from 203.0.113.42" },
  { timestamp: "2026-03-31 10:38:45.009", source: "DNS", severity: "info", message: "Pi-hole: upstream DNS resolver 1.1.1.1 responded in 12ms" },
  { timestamp: "2026-03-31 10:37:22.445", source: "Proxmox", severity: "info", message: "Node pve2: CPU usage normalized to 38% after VM migration" },
  { timestamp: "2026-03-31 10:36:11.778", source: "Docker", severity: "info", message: "Container 'plex' transcoding session started for user admin" },
  { timestamp: "2026-03-31 10:35:02.112", source: "System", severity: "info", message: "Backup verification: all checksums match for PBS datastore" },
  { timestamp: "2026-03-31 10:33:45.667", source: "pfSense", severity: "critical", message: "IPsec tunnel to remote site DOWN - peer unreachable" },
  { timestamp: "2026-03-31 10:32:18.990", source: "Docker", severity: "error", message: "Container 'paperless-worker' OOM: memory limit 512MB exceeded" },
  { timestamp: "2026-03-31 10:31:02.334", source: "DNS", severity: "warning", message: "Pi-hole: upstream resolver 8.8.8.8 timeout (>5000ms)" },
  { timestamp: "2026-03-31 10:30:15.221", source: "Proxmox", severity: "info", message: "Storage: ZFS pool 'tank' scrub completed with 0 errors" },
  { timestamp: "2026-03-31 10:29:03.556", source: "System", severity: "info", message: "Certificate renewal: wildcard cert for *.lab.local valid until 2026-06-29" },
  { timestamp: "2026-03-31 10:27:45.889", source: "Docker", severity: "info", message: "Image pull: ghcr.io/immich-app/immich-server:v1.99.0 completed" },
  { timestamp: "2026-03-31 10:26:32.112", source: "pfSense", severity: "info", message: "DHCP: lease renewed for 10.11.12.145 (desktop-amjid)" },
  { timestamp: "2026-03-31 10:25:18.445", source: "Proxmox", severity: "warning", message: "Node pve1: high IOWait detected (23%) on local-lvm storage" },
  { timestamp: "2026-03-31 10:24:05.778", source: "DNS", severity: "info", message: "Pi-hole: gravity update completed - 142,847 domains blocked" },
  { timestamp: "2026-03-31 10:22:52.001", source: "Docker", severity: "info", message: "Container 'traefik' certificate for grafana.lab.local renewed via ACME" },
  { timestamp: "2026-03-31 10:21:38.334", source: "System", severity: "error", message: "SMART: /dev/sdb warning - reallocated sector count increased to 8" },
];

const severityColors: Record<LogSeverity, string> = {
  info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  error: "bg-red-500/10 text-red-500 border-red-500/20",
  critical: "bg-red-600/20 text-red-400 border-red-600/30",
};

const sourceColors: Record<LogSource, string> = {
  Proxmox: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Docker: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pfSense: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  DNS: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  System: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function LogsPage() {
  const [sourceFilter, setSourceFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [paused, setPaused] = useState(false);

  const filteredLogs = logEntries.filter((entry) => {
    if (sourceFilter !== "all" && entry.source !== sourceFilter) return false;
    if (severityFilter !== "all" && entry.severity !== severityFilter) return false;
    if (searchQuery && !entry.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ScrollText className="h-5 w-5" />}
        title="Logs"
        description="Centralized log viewer across all services"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="Proxmox">Proxmox</SelectItem>
            <SelectItem value="Docker">Docker</SelectItem>
            <SelectItem value="pfSense">pfSense</SelectItem>
            <SelectItem value="DNS">DNS</SelectItem>
            <SelectItem value="System">System</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v ?? "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={paused ? "default" : "outline"}
            size="sm"
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play className="h-3.5 w-3.5 mr-1" /> : <Pause className="h-3.5 w-3.5 mr-1" />}
            {paused ? "Resume" : "Pause"}
          </Button>
          <div className="flex items-center gap-2">
            <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
            <span className="text-sm text-muted-foreground">Auto-scroll</span>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/30 px-4 py-2 border-b flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {logEntries.length} entries
          </span>
          {paused && (
            <Badge variant="secondary" className="text-xs">
              Paused
            </Badge>
          )}
        </div>
        <div className="divide-y max-h-[calc(100vh-320px)] overflow-y-auto">
          {filteredLogs.map((entry, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
            >
              <span className="text-xs font-mono text-muted-foreground whitespace-nowrap pt-0.5 min-w-[185px]">
                {entry.timestamp}
              </span>
              <Badge
                variant="outline"
                className={`text-xs shrink-0 ${sourceColors[entry.source]}`}
              >
                {entry.source}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs shrink-0 uppercase ${severityColors[entry.severity]}`}
              >
                {entry.severity}
              </Badge>
              <span className="text-sm font-mono leading-relaxed">{entry.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
