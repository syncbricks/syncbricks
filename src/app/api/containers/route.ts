import { NextResponse } from "next/server";
import type { ContainerInfo } from "@/lib/providers/types";

const demoContainers: ContainerInfo[] = [
  { id: "c1", name: "nginx", image: "nginx:latest", status: "running", ports: "80:80, 443:443", created: "2026-03-17" },
  { id: "c2", name: "postgres", image: "postgres:16-alpine", status: "running", ports: "5432:5432", created: "2026-03-10" },
  { id: "c3", name: "redis", image: "redis:7-alpine", status: "running", ports: "6379:6379", created: "2026-03-10" },
  { id: "c4", name: "grafana", image: "grafana/grafana:latest", status: "running", ports: "3000:3000", created: "2026-03-01" },
  { id: "c5", name: "prometheus", image: "prom/prometheus:latest", status: "running", ports: "9090:9090", created: "2026-03-01" },
  { id: "c6", name: "uptime-kuma", image: "louislam/uptime-kuma:1", status: "running", ports: "3001:3001", created: "2026-01-31" },
  { id: "c7", name: "vaultwarden", image: "vaultwarden/server:latest", status: "running", ports: "8080:80", created: "2025-12-31" },
  { id: "c8", name: "nextcloud-aio", image: "nextcloud/all-in-one:latest", status: "running", ports: "8443:8443", created: "2026-03-01" },
  { id: "c9", name: "plex", image: "plexinc/pms-docker:latest", status: "running", ports: "32400:32400", created: "2026-01-31" },
  { id: "c10", name: "sonarr", image: "lscr.io/linuxserver/sonarr:latest", status: "running", ports: "8989:8989", created: "2026-01-31" },
  { id: "c11", name: "radarr", image: "lscr.io/linuxserver/radarr:latest", status: "running", ports: "7878:7878", created: "2026-01-31" },
  { id: "c12", name: "portainer", image: "portainer/portainer-ce:latest", status: "exited", ports: "9000:9000", created: "2025-11-30" },
  { id: "c13", name: "homeassistant", image: "ghcr.io/home-assistant/home-assistant:stable", status: "running", ports: "8123:8123", created: "2025-10-31" },
  { id: "c14", name: "watchtower", image: "containrrr/watchtower:latest", status: "running", ports: "-", created: "2025-12-31" },
  { id: "c15", name: "caddy", image: "caddy:2-alpine", status: "stopped", ports: "80:80, 443:443", created: "2025-09-30" },
];

export async function GET() {
  return NextResponse.json(demoContainers);
}
