import { NextResponse } from "next/server";
import type { VMInfo } from "@/lib/providers/types";

const demoVMs: VMInfo[] = [
  { id: "100", name: "ubuntu-server", status: "running", type: "qemu", node: "pve-node1", cpu: 2, memory: 4096, disk: 32768, ipAddress: "10.11.12.110", os: "Ubuntu 22.04", tags: ["production"] },
  { id: "101", name: "docker-host", status: "running", type: "qemu", node: "pve-node1", cpu: 4, memory: 8192, disk: 102400, ipAddress: "10.11.12.111", os: "Debian 12", tags: ["production", "docker"] },
  { id: "102", name: "k3s-master", status: "running", type: "qemu", node: "pve-node1", cpu: 4, memory: 8192, disk: 65536, ipAddress: "10.11.12.112", os: "Ubuntu 22.04", tags: ["kubernetes"] },
  { id: "103", name: "win11-desktop", status: "stopped", type: "qemu", node: "pve-node1", cpu: 4, memory: 16384, disk: 262144, os: "Windows 11", tags: ["desktop"] },
  { id: "104", name: "plex-media", status: "running", type: "qemu", node: "pve-node2", cpu: 4, memory: 8192, disk: 51200, ipAddress: "10.11.12.114", os: "Ubuntu 22.04", tags: ["media"] },
  { id: "105", name: "nextcloud", status: "running", type: "qemu", node: "pve-node2", cpu: 2, memory: 4096, disk: 204800, ipAddress: "10.11.12.115", os: "Debian 12", tags: ["production"] },
  { id: "106", name: "home-assistant", status: "running", type: "qemu", node: "pve-node2", cpu: 2, memory: 4096, disk: 32768, ipAddress: "10.11.12.116", os: "HAOS", tags: ["automation"] },
  { id: "107", name: "test-vm", status: "stopped", type: "qemu", node: "pve-node2", cpu: 2, memory: 2048, disk: 20480, tags: ["test"] },
  { id: "200", name: "pihole", status: "running", type: "lxc", node: "pve-node1", cpu: 1, memory: 512, disk: 8192, ipAddress: "10.11.12.53", os: "Debian 12", tags: ["dns"] },
  { id: "201", name: "nginx-proxy", status: "running", type: "lxc", node: "pve-node1", cpu: 1, memory: 1024, disk: 8192, ipAddress: "10.11.12.80", os: "Alpine", tags: ["proxy"] },
  { id: "202", name: "wireguard", status: "running", type: "lxc", node: "pve-node2", cpu: 1, memory: 256, disk: 4096, ipAddress: "10.11.12.51", os: "Alpine", tags: ["vpn"] },
];

export async function GET() {
  return NextResponse.json(demoVMs);
}
