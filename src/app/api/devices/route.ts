import { NextResponse } from "next/server";

interface Device {
  id: number;
  name: string;
  ip: string;
  mac: string;
  type: "server" | "switch" | "router" | "ap" | "iot" | "workstation";
  manufacturer: string;
  location: string;
  status: "online" | "offline";
  lastSeen: string;
}

const devices: Device[] = [
  { id: 1, name: "proxmox-node1", ip: "10.11.12.101", mac: "AA:BB:CC:01:01:01", type: "server", manufacturer: "Dell", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 2, name: "proxmox-node2", ip: "10.11.12.104", mac: "AA:BB:CC:01:01:04", type: "server", manufacturer: "Dell", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 3, name: "pfsense", ip: "10.11.12.1", mac: "AA:BB:CC:01:00:01", type: "router", manufacturer: "Netgate", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 4, name: "nas", ip: "10.11.12.50", mac: "AA:BB:CC:01:00:50", type: "server", manufacturer: "Synology", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 5, name: "core-switch", ip: "10.11.12.2", mac: "AA:BB:CC:02:00:02", type: "switch", manufacturer: "UniFi", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 6, name: "poe-switch-1", ip: "10.11.12.3", mac: "AA:BB:CC:02:00:03", type: "switch", manufacturer: "UniFi", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 7, name: "poe-switch-2", ip: "10.11.12.4", mac: "AA:BB:CC:02:00:04", type: "switch", manufacturer: "UniFi", location: "Office", status: "online", lastSeen: "Now" },
  { id: 8, name: "ap-living-room", ip: "10.11.12.10", mac: "AA:BB:CC:03:00:10", type: "ap", manufacturer: "UniFi", location: "Living Room", status: "online", lastSeen: "Now" },
  { id: 9, name: "ap-office", ip: "10.11.12.11", mac: "AA:BB:CC:03:00:11", type: "ap", manufacturer: "UniFi", location: "Office", status: "online", lastSeen: "Now" },
  { id: 10, name: "ap-garage", ip: "10.11.12.12", mac: "AA:BB:CC:03:00:12", type: "ap", manufacturer: "UniFi", location: "Garage", status: "offline", lastSeen: "2 days ago" },
  { id: 11, name: "hue-bridge", ip: "10.11.12.60", mac: "AA:BB:CC:04:00:60", type: "iot", manufacturer: "Philips", location: "Living Room", status: "online", lastSeen: "Now" },
  { id: 12, name: "ecobee-thermostat", ip: "10.11.12.61", mac: "AA:BB:CC:04:00:61", type: "iot", manufacturer: "Ecobee", location: "Hallway", status: "online", lastSeen: "Now" },
  { id: 13, name: "ring-doorbell", ip: "10.11.12.62", mac: "AA:BB:CC:04:00:62", type: "iot", manufacturer: "Ring", location: "Front Door", status: "online", lastSeen: "Now" },
  { id: 14, name: "sonos-speaker", ip: "10.11.12.63", mac: "AA:BB:CC:04:00:63", type: "iot", manufacturer: "Sonos", location: "Living Room", status: "online", lastSeen: "Now" },
  { id: 15, name: "workstation-main", ip: "10.11.12.200", mac: "AA:BB:CC:05:00:C8", type: "workstation", manufacturer: "Custom", location: "Office", status: "online", lastSeen: "Now" },
  { id: 16, name: "macbook-pro", ip: "10.11.12.201", mac: "AA:BB:CC:05:00:C9", type: "workstation", manufacturer: "Apple", location: "Office", status: "online", lastSeen: "Now" },
  { id: 17, name: "printer", ip: "10.11.12.70", mac: "AA:BB:CC:06:00:46", type: "iot", manufacturer: "HP", location: "Office", status: "offline", lastSeen: "5 hours ago" },
  { id: 18, name: "smart-plug-rack", ip: "10.11.12.64", mac: "AA:BB:CC:04:00:64", type: "iot", manufacturer: "TP-Link", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 19, name: "backup-server", ip: "10.11.12.105", mac: "AA:BB:CC:01:01:05", type: "server", manufacturer: "HPE", location: "Server Rack", status: "offline", lastSeen: "1 day ago" },
  { id: 20, name: "ip-camera-garage", ip: "10.11.12.65", mac: "AA:BB:CC:04:00:65", type: "iot", manufacturer: "Reolink", location: "Garage", status: "offline", lastSeen: "2 days ago" },
];

const stats = {
  total: 42,
  online: 38,
  offline: 4,
};

export async function GET() {
  return NextResponse.json({ devices, stats });
}
