import { NextResponse } from "next/server";

interface Connection {
  id: string;
  name: string;
  type: "Proxmox" | "Docker" | "pfSense" | "Pi-hole" | "Generic";
  host: string;
  status: "connected" | "disconnected";
}

const connections: Connection[] = [
  { id: "1", name: "Proxmox Node 1", type: "Proxmox", host: "10.11.12.101", status: "connected" },
  { id: "2", name: "Proxmox Node 2", type: "Proxmox", host: "10.11.12.104", status: "connected" },
  { id: "3", name: "pfSense", type: "pfSense", host: "10.11.12.1", status: "connected" },
  { id: "4", name: "Docker Host", type: "Docker", host: "10.11.12.101:2376", status: "connected" },
  { id: "5", name: "Pi-hole", type: "Pi-hole", host: "10.11.12.53", status: "disconnected" },
];

const general = {
  darkMode: true,
  refreshInterval: 30,
};

const notifications = {
  email: "",
  webhookUrl: "",
  discordWebhook: "",
};

export async function GET() {
  return NextResponse.json({ connections, general, notifications });
}

export async function POST(request: Request) {
  const body = await request.json();
  // In a real app, persist settings to database
  return NextResponse.json({ success: true, saved: body });
}
