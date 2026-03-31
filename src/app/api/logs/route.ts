import { NextResponse } from "next/server";

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

export async function GET() {
  return NextResponse.json(logEntries);
}
