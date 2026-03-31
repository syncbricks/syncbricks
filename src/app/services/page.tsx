"use client";

import { useState } from "react";
import {
  AppWindow,
  Play,
  Film,
  Tv,
  Radar,
  BarChart3,
  Activity,
  HeartPulse,
  Cloud,
  Lock,
  Shield,
  Globe,
  Home,
  GitBranch,
  FileText,
  Image as ImageIcon,
  Ban,
  Settings,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";

type ServiceStatus = "installed" | "available";
type ServiceCategory = "Media" | "Monitoring" | "Productivity" | "Security" | "Networking" | "Automation";

interface Service {
  name: string;
  description: string;
  icon: React.ReactNode;
  status: ServiceStatus;
  category: ServiceCategory;
}

const services: Service[] = [
  { name: "Plex", description: "Stream your media library to any device", icon: <Play className="h-5 w-5" />, status: "installed", category: "Media" },
  { name: "Jellyfin", description: "Free software media system", icon: <Film className="h-5 w-5" />, status: "installed", category: "Media" },
  { name: "Sonarr", description: "TV series management and automation", icon: <Tv className="h-5 w-5" />, status: "installed", category: "Media" },
  { name: "Radarr", description: "Movie collection manager for Usenet/torrent", icon: <Radar className="h-5 w-5" />, status: "installed", category: "Media" },
  { name: "Grafana", description: "Observability dashboards and alerting", icon: <BarChart3 className="h-5 w-5" />, status: "installed", category: "Monitoring" },
  { name: "Prometheus", description: "Metrics collection and time-series database", icon: <Activity className="h-5 w-5" />, status: "installed", category: "Monitoring" },
  { name: "Uptime Kuma", description: "Self-hosted uptime monitoring tool", icon: <HeartPulse className="h-5 w-5" />, status: "installed", category: "Monitoring" },
  { name: "Nextcloud", description: "Self-hosted productivity and file sync", icon: <Cloud className="h-5 w-5" />, status: "installed", category: "Productivity" },
  { name: "Vaultwarden", description: "Lightweight Bitwarden-compatible server", icon: <Lock className="h-5 w-5" />, status: "installed", category: "Security" },
  { name: "WireGuard", description: "Fast and modern VPN tunnel", icon: <Shield className="h-5 w-5" />, status: "available", category: "Networking" },
  { name: "Traefik", description: "Cloud-native reverse proxy and load balancer", icon: <Globe className="h-5 w-5" />, status: "installed", category: "Networking" },
  { name: "Home Assistant", description: "Open-source home automation platform", icon: <Home className="h-5 w-5" />, status: "installed", category: "Automation" },
  { name: "Gitea", description: "Lightweight self-hosted Git service", icon: <GitBranch className="h-5 w-5" />, status: "available", category: "Productivity" },
  { name: "Paperless-ngx", description: "Document management system with OCR", icon: <FileText className="h-5 w-5" />, status: "available", category: "Productivity" },
  { name: "Immich", description: "Self-hosted photo and video backup", icon: <ImageIcon className="h-5 w-5" />, status: "available", category: "Media" },
  { name: "Pi-hole", description: "Network-wide ad blocking via DNS", icon: <Ban className="h-5 w-5" />, status: "installed", category: "Networking" },
];

const statusBadgeVariant: Record<ServiceStatus, "default" | "secondary"> = {
  installed: "default",
  available: "secondary",
};

const categoryColors: Record<ServiceCategory, string> = {
  Media: "bg-purple-500/10 text-purple-500",
  Monitoring: "bg-blue-500/10 text-blue-500",
  Productivity: "bg-emerald-500/10 text-emerald-500",
  Security: "bg-red-500/10 text-red-500",
  Networking: "bg-cyan-500/10 text-cyan-500",
  Automation: "bg-amber-500/10 text-amber-500",
};

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredServices =
    activeTab === "all"
      ? services
      : services.filter((s) => s.category.toLowerCase() === activeTab);

  const installed = filteredServices.filter((s) => s.status === "installed");
  const available = filteredServices.filter((s) => s.status === "available");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<AppWindow className="h-5 w-5" />}
        title="Services"
        description="Deploy and manage homelab applications"
        actions={
          <Button>
            <Rocket className="h-4 w-4 mr-2" />
            Deploy New
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-8">
          {installed.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Installed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {installed.map((service) => (
                  <ServiceCard key={service.name} service={service} />
                ))}
              </div>
            </div>
          )}

          {available.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Available</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {available.map((service) => (
                  <ServiceCard key={service.name} service={service} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
            {service.icon}
          </div>
          <Badge variant={statusBadgeVariant[service.status]}>
            {service.status === "installed" ? "Installed" : "Available"}
          </Badge>
        </div>
        <CardTitle className="text-base mt-3">{service.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{service.description}</p>
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[service.category]}`}
          >
            {service.category}
          </span>
          {service.status === "installed" ? (
            <Button variant="outline" size="sm">
              <Settings className="h-3 w-3 mr-1" />
              Manage
            </Button>
          ) : (
            <Button size="sm">
              <Rocket className="h-3 w-3 mr-1" />
              Deploy
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
