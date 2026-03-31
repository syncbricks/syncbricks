import { NextResponse } from "next/server";
import type { FirewallRule } from "@/lib/providers/types";

interface NetworkInterface {
  name: string;
  status: "online" | "offline";
  ip: string;
  subnet: string;
  gateway: string;
  trafficIn: string;
  trafficOut: string;
}

interface VLAN {
  name: string;
  vlan: string;
  subnet: string;
  devices: number;
}

const interfaces: NetworkInterface[] = [
  { name: "WAN", status: "online", ip: "203.0.113.1", subnet: "/24", gateway: "203.0.113.254", trafficIn: "142.3 Mbps", trafficOut: "38.7 Mbps" },
  { name: "LAN", status: "online", ip: "10.11.12.1", subnet: "/24", gateway: "-", trafficIn: "892.1 Mbps", trafficOut: "654.2 Mbps" },
  { name: "VLAN10_IOT", status: "online", ip: "10.11.10.1", subnet: "/24", gateway: "-", trafficIn: "12.4 Mbps", trafficOut: "3.1 Mbps" },
  { name: "VLAN20_GUEST", status: "online", ip: "10.11.20.1", subnet: "/24", gateway: "-", trafficIn: "24.8 Mbps", trafficOut: "18.2 Mbps" },
  { name: "VLAN30_LAB", status: "online", ip: "10.11.30.1", subnet: "/24", gateway: "-", trafficIn: "456.7 Mbps", trafficOut: "321.5 Mbps" },
];

const firewallRules: FirewallRule[] = [
  { id: 1, action: "pass", protocol: "TCP", source: "LAN net", destination: "any", port: "443", description: "Allow HTTPS outbound" },
  { id: 2, action: "pass", protocol: "TCP", source: "LAN net", destination: "any", port: "80", description: "Allow HTTP outbound" },
  { id: 3, action: "pass", protocol: "TCP/UDP", source: "any", destination: "LAN address", port: "53", description: "Allow DNS to Pi-hole" },
  { id: 4, action: "block", protocol: "any", source: "VLAN20_GUEST", destination: "LAN net", port: "*", description: "Block guest to LAN" },
  { id: 5, action: "block", protocol: "any", source: "VLAN10_IOT", destination: "LAN net", port: "*", description: "Block IoT to LAN" },
  { id: 6, action: "pass", protocol: "TCP", source: "VLAN10_IOT", destination: "10.11.12.50", port: "1883", description: "Allow IoT to MQTT broker" },
  { id: 7, action: "pass", protocol: "TCP", source: "VLAN30_LAB", destination: "any", port: "*", description: "Allow Lab unrestricted" },
  { id: 8, action: "pass", protocol: "TCP", source: "any", destination: "WAN address", port: "51820", description: "Allow WireGuard VPN" },
  { id: 9, action: "block", protocol: "any", source: "VLAN20_GUEST", destination: "10.11.10.0/24", port: "*", description: "Block guest to IoT" },
  { id: 10, action: "pass", protocol: "ICMP", source: "LAN net", destination: "any", port: "*", description: "Allow ICMP from LAN" },
];

const vlans: VLAN[] = [
  { name: "IoT", vlan: "VLAN 10", subnet: "10.11.10.0/24", devices: 18 },
  { name: "Guest", vlan: "VLAN 20", subnet: "10.11.20.0/24", devices: 7 },
  { name: "Lab", vlan: "VLAN 30", subnet: "10.11.30.0/24", devices: 12 },
  { name: "Management", vlan: "LAN", subnet: "10.11.12.0/24", devices: 5 },
];

export async function GET() {
  return NextResponse.json({ interfaces, firewallRules, vlans });
}
