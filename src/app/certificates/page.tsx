"use client";

import {
  ShieldCheck,
  Plus,
  AlertTriangle,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/page-header";

const stats = [
  {
    label: "Total Certificates",
    value: "12",
    icon: ShieldCheck,
    color: "text-primary",
  },
  {
    label: "Expiring Soon",
    value: "2",
    icon: AlertTriangle,
    color: "text-amber-400",
  },
  {
    label: "Expired",
    value: "0",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
];

const certificates = [
  { domain: "*.lab.local", issuer: "Self-signed", validFrom: "2025-12-01", validUntil: "2026-12-01", daysLeft: 245, autoRenew: false, source: "NPM", id: 1 },
  { domain: "plex.domain.com", issuer: "Let's Encrypt", validFrom: "2026-01-15", validUntil: "2026-04-15", daysLeft: 15, autoRenew: true, source: "NPM", id: 2 },
  { domain: "nextcloud.domain.com", issuer: "Let's Encrypt", validFrom: "2026-01-20", validUntil: "2026-04-20", daysLeft: 20, autoRenew: true, source: "Traefik", id: 3 },
  { domain: "homeassistant.domain.com", issuer: "Let's Encrypt", validFrom: "2026-02-10", validUntil: "2026-05-10", daysLeft: 40, autoRenew: true, source: "NPM", id: 4 },
  { domain: "grafana.domain.com", issuer: "Let's Encrypt", validFrom: "2026-02-28", validUntil: "2026-05-28", daysLeft: 58, autoRenew: true, source: "Traefik", id: 5 },
  { domain: "proxmox.lab.local", issuer: "Self-signed", validFrom: "2025-06-01", validUntil: "2026-06-01", daysLeft: 62, autoRenew: false, source: "NPM", id: 6 },
  { domain: "pihole.lab.local", issuer: "Self-signed", validFrom: "2025-09-15", validUntil: "2026-09-15", daysLeft: 168, autoRenew: false, source: "NPM", id: 7 },
  { domain: "wireguard.domain.com", issuer: "Let's Encrypt", validFrom: "2026-03-01", validUntil: "2026-05-30", daysLeft: 60, autoRenew: true, source: "Traefik", id: 8 },
  { domain: "gitea.domain.com", issuer: "Let's Encrypt", validFrom: "2026-03-10", validUntil: "2026-06-08", daysLeft: 69, autoRenew: true, source: "Traefik", id: 9 },
  { domain: "portainer.lab.local", issuer: "Self-signed", validFrom: "2025-11-01", validUntil: "2026-11-01", daysLeft: 215, autoRenew: false, source: "NPM", id: 10 },
  { domain: "vault.domain.com", issuer: "Let's Encrypt", validFrom: "2026-03-15", validUntil: "2026-06-13", daysLeft: 74, autoRenew: true, source: "Traefik", id: 11 },
  { domain: "minio.lab.local", issuer: "Self-signed", validFrom: "2026-01-10", validUntil: "2027-01-10", daysLeft: 285, autoRenew: false, source: "NPM", id: 12 },
];

function daysLeftColor(days: number): string {
  if (days < 7) return "text-red-400";
  if (days <= 30) return "text-amber-400";
  return "text-emerald-400";
}

function issuerBadgeColor(issuer: string): string {
  return issuer === "Let's Encrypt"
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
    : "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
}

function sourceBadgeColor(source: string): string {
  return source === "NPM"
    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
    : "bg-purple-500/10 text-purple-400 border-purple-500/30";
}

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ShieldCheck className="h-5 w-5" />}
        title="Certificates"
        description="SSL/TLS certificate tracking and management"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Certificate
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Valid From</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Auto Renew</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium font-mono text-sm">
                      {cert.domain}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={issuerBadgeColor(cert.issuer)}
                      >
                        {cert.issuer}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {cert.validFrom}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {cert.validUntil}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-mono font-medium text-sm ${daysLeftColor(
                          cert.daysLeft
                        )}`}
                      >
                        {cert.daysLeft}d
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm ${
                          cert.autoRenew
                            ? "text-emerald-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {cert.autoRenew ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={sourceBadgeColor(cert.source)}
                      >
                        {cert.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
