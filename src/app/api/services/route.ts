import { NextResponse } from "next/server";

interface Service {
  name: string;
  description: string;
  status: "installed" | "available";
  category: "Media" | "Monitoring" | "Productivity" | "Security" | "Networking" | "Automation";
}

const installed: Service[] = [
  { name: "Plex", description: "Stream your media library to any device", status: "installed", category: "Media" },
  { name: "Jellyfin", description: "Free software media system", status: "installed", category: "Media" },
  { name: "Sonarr", description: "TV series management and automation", status: "installed", category: "Media" },
  { name: "Radarr", description: "Movie collection manager for Usenet/torrent", status: "installed", category: "Media" },
  { name: "Grafana", description: "Observability dashboards and alerting", status: "installed", category: "Monitoring" },
  { name: "Prometheus", description: "Metrics collection and time-series database", status: "installed", category: "Monitoring" },
  { name: "Uptime Kuma", description: "Self-hosted uptime monitoring tool", status: "installed", category: "Monitoring" },
  { name: "Nextcloud", description: "Self-hosted productivity and file sync", status: "installed", category: "Productivity" },
  { name: "Vaultwarden", description: "Lightweight Bitwarden-compatible server", status: "installed", category: "Security" },
  { name: "Traefik", description: "Cloud-native reverse proxy and load balancer", status: "installed", category: "Networking" },
  { name: "Home Assistant", description: "Open-source home automation platform", status: "installed", category: "Automation" },
  { name: "Pi-hole", description: "Network-wide ad blocking via DNS", status: "installed", category: "Networking" },
];

const available: Service[] = [
  { name: "WireGuard", description: "Fast and modern VPN tunnel", status: "available", category: "Networking" },
  { name: "Gitea", description: "Lightweight self-hosted Git service", status: "available", category: "Productivity" },
  { name: "Paperless-ngx", description: "Document management system with OCR", status: "available", category: "Productivity" },
  { name: "Immich", description: "Self-hosted photo and video backup", status: "available", category: "Media" },
];

export async function GET() {
  return NextResponse.json({ installed, available });
}
