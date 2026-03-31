import { NextResponse } from "next/server";
import type { NodeInfo } from "@/lib/providers/types";

const demoNodes: NodeInfo[] = [
  {
    id: "pve-node1",
    name: "pve-node1",
    status: "online",
    cpuCores: 16,
    cpuUsage: 42,
    memoryTotal: 64,
    memoryUsed: 24.5,
    diskTotal: 4000,
    diskUsed: 1800,
    uptime: 3650400, // ~42 days
  },
  {
    id: "pve-node2",
    name: "pve-node2",
    status: "online",
    cpuCores: 8,
    cpuUsage: 38,
    memoryTotal: 32,
    memoryUsed: 18.2,
    diskTotal: 8000,
    diskUsed: 2400,
    uptime: 2478720, // ~28 days
  },
];

export async function GET() {
  return NextResponse.json(demoNodes);
}
