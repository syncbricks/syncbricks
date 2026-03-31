import { NextResponse } from "next/server";
import type { CertificateInfo } from "@/lib/providers/types";

const certificates: CertificateInfo[] = [
  { domain: "*.lab.local", issuer: "Self-signed", validFrom: "2025-12-01", validUntil: "2026-12-01", daysLeft: 245, autoRenew: false, source: "NPM" },
  { domain: "plex.domain.com", issuer: "Let's Encrypt", validFrom: "2026-01-15", validUntil: "2026-04-15", daysLeft: 15, autoRenew: true, source: "NPM" },
  { domain: "nextcloud.domain.com", issuer: "Let's Encrypt", validFrom: "2026-01-20", validUntil: "2026-04-20", daysLeft: 20, autoRenew: true, source: "Traefik" },
  { domain: "homeassistant.domain.com", issuer: "Let's Encrypt", validFrom: "2026-02-10", validUntil: "2026-05-10", daysLeft: 40, autoRenew: true, source: "NPM" },
  { domain: "grafana.domain.com", issuer: "Let's Encrypt", validFrom: "2026-02-28", validUntil: "2026-05-28", daysLeft: 58, autoRenew: true, source: "Traefik" },
  { domain: "proxmox.lab.local", issuer: "Self-signed", validFrom: "2025-06-01", validUntil: "2026-06-01", daysLeft: 62, autoRenew: false, source: "NPM" },
  { domain: "pihole.lab.local", issuer: "Self-signed", validFrom: "2025-09-15", validUntil: "2026-09-15", daysLeft: 168, autoRenew: false, source: "NPM" },
  { domain: "wireguard.domain.com", issuer: "Let's Encrypt", validFrom: "2026-03-01", validUntil: "2026-05-30", daysLeft: 60, autoRenew: true, source: "Traefik" },
  { domain: "gitea.domain.com", issuer: "Let's Encrypt", validFrom: "2026-03-10", validUntil: "2026-06-08", daysLeft: 69, autoRenew: true, source: "Traefik" },
  { domain: "portainer.lab.local", issuer: "Self-signed", validFrom: "2025-11-01", validUntil: "2026-11-01", daysLeft: 215, autoRenew: false, source: "NPM" },
  { domain: "vault.domain.com", issuer: "Let's Encrypt", validFrom: "2026-03-15", validUntil: "2026-06-13", daysLeft: 74, autoRenew: true, source: "Traefik" },
  { domain: "minio.lab.local", issuer: "Self-signed", validFrom: "2026-01-10", validUntil: "2027-01-10", daysLeft: 285, autoRenew: false, source: "NPM" },
];

const stats = {
  total: 12,
  expiringSoon: 2,
  expired: 0,
};

export async function GET() {
  return NextResponse.json({ certificates, stats });
}
