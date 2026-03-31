import { NextResponse } from "next/server";

const jobs = [
  { id: 1, target: "ubuntu-server", type: "PBS", schedule: "Daily 02:00", lastRun: "2026-03-31 02:00", status: "success", duration: "12m 34s", size: "42.1 GB" },
  { id: 2, target: "docker-host", type: "PBS", schedule: "Daily 02:30", lastRun: "2026-03-31 02:30", status: "success", duration: "18m 12s", size: "86.3 GB" },
  { id: 3, target: "k3s-master", type: "PBS", schedule: "Daily 03:00", lastRun: "2026-03-31 03:00", status: "success", duration: "8m 45s", size: "24.7 GB" },
  { id: 4, target: "nextcloud", type: "Restic", schedule: "Every 6h", lastRun: "2026-03-31 06:00", status: "success", duration: "22m 18s", size: "156.2 GB" },
  { id: 5, target: "plex-media", type: "Restic", schedule: "Weekly Sun 01:00", lastRun: "2026-03-29 01:00", status: "success", duration: "1h 45m", size: "890.4 GB" },
  { id: 6, target: "home-assistant", type: "Borg", schedule: "Daily 04:00", lastRun: "2026-03-31 04:00", status: "failed", duration: "0m 12s", size: "-" },
  { id: 7, target: "pihole", type: "PBS", schedule: "Daily 03:30", lastRun: "2026-03-31 03:30", status: "success", duration: "1m 08s", size: "2.1 GB" },
  { id: 8, target: "nginx-proxy", type: "PBS", schedule: "Daily 03:45", lastRun: "2026-03-31 03:45", status: "success", duration: "0m 45s", size: "1.4 GB" },
  { id: 9, target: "wireguard", type: "Borg", schedule: "Daily 04:15", lastRun: "2026-03-31 04:15", status: "success", duration: "0m 32s", size: "0.8 GB" },
  { id: 10, target: "nas-config", type: "Restic", schedule: "Daily 05:00", lastRun: "2026-03-31 05:00", status: "success", duration: "3m 22s", size: "12.5 GB" },
];

const history = [
  { time: "2026-03-31 06:00", target: "nextcloud", status: "success" },
  { time: "2026-03-31 05:00", target: "nas-config", status: "success" },
  { time: "2026-03-31 04:15", target: "wireguard", status: "success" },
  { time: "2026-03-31 04:00", target: "home-assistant", status: "failed" },
  { time: "2026-03-31 03:45", target: "nginx-proxy", status: "success" },
];

const stats = {
  totalBackups: 156,
  lastBackup: "2 hours ago",
  totalSize: "2.4 TB",
  successRate: 98.7,
};

export async function GET() {
  return NextResponse.json({ jobs, history, stats });
}
