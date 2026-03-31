import { NextResponse } from "next/server";
import type { DNSRecord } from "@/lib/providers/types";

const records: DNSRecord[] = [
  { domain: "proxmox.lab.local", ip: "10.11.12.10", type: "A" },
  { domain: "nas.lab.local", ip: "10.11.12.20", type: "A" },
  { domain: "plex.lab.local", ip: "10.11.12.30", type: "A" },
  { domain: "home.lab.local", ip: "10.11.12.40", type: "A" },
  { domain: "grafana.lab.local", ip: "10.11.12.50", type: "A" },
  { domain: "pihole.lab.local", ip: "10.11.12.5", type: "A" },
  { domain: "portainer.lab.local", ip: "10.11.12.60", type: "A" },
  { domain: "nextcloud.lab.local", ip: "10.11.12.70", type: "A" },
  { domain: "vault.lab.local", ip: "10.11.12.80", type: "A" },
  { domain: "mqtt.lab.local", ip: "10.11.12.50", type: "CNAME" },
];

const topBlocked = [
  { domain: "analytics.tiktok.com", count: 3421 },
  { domain: "graph.facebook.com", count: 2814 },
  { domain: "ads.google.com", count: 2156 },
  { domain: "telemetry.microsoft.com", count: 1893 },
  { domain: "tracking.amazon.com", count: 1247 },
];

const topClients = [
  { client: "10.11.12.40 (home-assistant)", queries: 28492 },
  { client: "10.11.10.15 (roku-tv)", queries: 18234 },
  { client: "10.11.12.100 (desktop-pc)", queries: 14821 },
  { client: "10.11.20.5 (iphone-guest)", queries: 9412 },
  { client: "10.11.10.22 (alexa-kitchen)", queries: 8756 },
];

const summary = {
  totalQueries: 124892,
  queriesBlocked: 18234,
  blockPercentage: 14.6,
  blocklistDomains: 892451,
  responseTimeMs: 4.2,
  activeBlocklists: 6,
};

export async function GET() {
  return NextResponse.json({ summary, records, topBlocked, topClients });
}
