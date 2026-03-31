import { NextResponse } from "next/server";
import type { StoragePool } from "@/lib/providers/types";

const pools: StoragePool[] = [
  {
    name: "tank",
    status: "online",
    totalSize: 8000,
    usedSize: 4200,
    type: "RAIDZ1",
    disks: [
      { name: "da0", model: "WD Red Plus 4TB", serial: "WD-WMC4N0K1234", temperature: 34, health: "ONLINE", size: 4000 },
      { name: "da1", model: "WD Red Plus 4TB", serial: "WD-WMC4N0K5678", temperature: 36, health: "ONLINE", size: 4000 },
      { name: "da2", model: "WD Red Plus 4TB", serial: "WD-WMC4N0K9012", temperature: 35, health: "ONLINE", size: 4000 },
      { name: "da3", model: "WD Red Plus 4TB", serial: "WD-WMC4N0K3456", temperature: 33, health: "ONLINE", size: 4000 },
    ],
  },
  {
    name: "fast",
    status: "online",
    totalSize: 2000,
    usedSize: 800,
    type: "Mirror",
    disks: [
      { name: "nvme0", model: "Samsung 980 Pro 1TB", serial: "S5GXNG0R123456", temperature: 42, health: "ONLINE", size: 1000 },
      { name: "nvme1", model: "Samsung 980 Pro 1TB", serial: "S5GXNG0R789012", temperature: 40, health: "ONLINE", size: 1000 },
    ],
  },
];

const datasets = [
  { name: "media", pool: "tank", used: "1.8 TB", available: "3.8 TB", mountpoint: "/mnt/tank/media", compression: "lz4", snapshots: 12 },
  { name: "backups", pool: "tank", used: "1.2 TB", available: "3.8 TB", mountpoint: "/mnt/tank/backups", compression: "zstd", snapshots: 30 },
  { name: "documents", pool: "tank", used: "245 GB", available: "3.8 TB", mountpoint: "/mnt/tank/documents", compression: "lz4", snapshots: 14 },
  { name: "docker", pool: "fast", used: "320 GB", available: "1.2 TB", mountpoint: "/mnt/fast/docker", compression: "lz4", snapshots: 7 },
  { name: "vms", pool: "fast", used: "420 GB", available: "1.2 TB", mountpoint: "/mnt/fast/vms", compression: "off", snapshots: 5 },
  { name: "isos", pool: "tank", used: "156 GB", available: "3.8 TB", mountpoint: "/mnt/tank/isos", compression: "off", snapshots: 2 },
];

const snapshots = [
  { name: "tank/backups@auto-2026-03-31-02:00", dataset: "backups", created: "2026-03-31 02:00", size: "2.4 GB" },
  { name: "tank/media@auto-2026-03-31-02:00", dataset: "media", created: "2026-03-31 02:00", size: "1.1 GB" },
  { name: "fast/docker@auto-2026-03-31-03:00", dataset: "docker", created: "2026-03-31 03:00", size: "856 MB" },
  { name: "tank/documents@auto-2026-03-30-02:00", dataset: "documents", created: "2026-03-30 02:00", size: "412 MB" },
  { name: "fast/vms@pre-update-2026-03-29", dataset: "vms", created: "2026-03-29 18:32", size: "3.2 GB" },
  { name: "tank/backups@auto-2026-03-30-02:00", dataset: "backups", created: "2026-03-30 02:00", size: "2.1 GB" },
  { name: "tank/media@weekly-2026-03-28", dataset: "media", created: "2026-03-28 00:00", size: "4.8 GB" },
];

export async function GET() {
  return NextResponse.json({ pools, datasets, snapshots });
}
