import { NextResponse } from "next/server";
import type { UPSStatus } from "@/lib/providers/types";

const ups: UPSStatus = {
  model: "CyberPower CP1500",
  status: "Online",
  batteryCharge: 100,
  batteryRuntime: 28,
  load: 45,
  inputVoltage: 121,
  outputVoltage: 120,
};

const events = [
  { time: "2026-03-28 14:32", event: "Battery Test", details: "Scheduled self-test completed successfully", status: "success" },
  { time: "2026-03-25 09:15", event: "On Battery", details: "Utility power lost, running on battery", status: "warning" },
  { time: "2026-03-25 09:18", event: "Back Online", details: "Utility power restored after 3 minutes", status: "success" },
  { time: "2026-03-20 03:00", event: "Battery Test", details: "Scheduled self-test completed successfully", status: "success" },
  { time: "2026-03-12 22:45", event: "On Battery", details: "Utility power lost, running on battery", status: "warning" },
  { time: "2026-03-12 22:46", event: "Low Battery Warning", details: "Battery capacity below 30%, initiating shutdown sequence", status: "critical" },
  { time: "2026-03-12 22:48", event: "Back Online", details: "Utility power restored, shutdown sequence cancelled", status: "success" },
];

const shutdownSequence = [
  { order: 1, name: "Non-critical VMs", items: "win11-desktop, test-vm", delay: "0s" },
  { order: 2, name: "Application VMs", items: "plex-media, nextcloud, home-assistant", delay: "30s" },
  { order: 3, name: "Infrastructure VMs", items: "docker-host, k3s-master, pihole, wireguard", delay: "60s" },
  { order: 4, name: "NAS / Storage", items: "nas (Synology DS1621+)", delay: "90s" },
  { order: 5, name: "Proxmox Hosts", items: "pve-node2, pve-node1", delay: "120s" },
];

export async function GET() {
  return NextResponse.json({ ups, events, shutdownSequence });
}
