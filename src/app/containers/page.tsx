"use client";

import { useState } from "react";
import {
  Container,
  Play,
  Square,
  RotateCcw,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/status-badge";
import { PageHeader } from "@/components/common/page-header";

type ContainerStatus = "running" | "stopped" | "exited" | "restarting";

interface DockerContainer {
  name: string;
  image: string;
  status: ContainerStatus;
  ports: string;
  host: string;
  created: string;
}

const containers: DockerContainer[] = [
  { name: "nginx", image: "nginx:latest", status: "running", ports: "80:80, 443:443", host: "docker-host", created: "2 weeks ago" },
  { name: "postgres", image: "postgres:16-alpine", status: "running", ports: "5432:5432", host: "docker-host", created: "3 weeks ago" },
  { name: "redis", image: "redis:7-alpine", status: "running", ports: "6379:6379", host: "docker-host", created: "3 weeks ago" },
  { name: "grafana", image: "grafana/grafana:latest", status: "running", ports: "3000:3000", host: "docker-host", created: "1 month ago" },
  { name: "prometheus", image: "prom/prometheus:latest", status: "running", ports: "9090:9090", host: "docker-host", created: "1 month ago" },
  { name: "uptime-kuma", image: "louislam/uptime-kuma:1", status: "running", ports: "3001:3001", host: "docker-host", created: "2 months ago" },
  { name: "vaultwarden", image: "vaultwarden/server:latest", status: "running", ports: "8080:80", host: "docker-host", created: "3 months ago" },
  { name: "nextcloud-aio", image: "nextcloud/all-in-one:latest", status: "running", ports: "8443:8443", host: "plex-media", created: "1 month ago" },
  { name: "plex", image: "plexinc/pms-docker:latest", status: "running", ports: "32400:32400", host: "plex-media", created: "2 months ago" },
  { name: "sonarr", image: "lscr.io/linuxserver/sonarr:latest", status: "running", ports: "8989:8989", host: "plex-media", created: "2 months ago" },
  { name: "radarr", image: "lscr.io/linuxserver/radarr:latest", status: "running", ports: "7878:7878", host: "plex-media", created: "2 months ago" },
  { name: "portainer", image: "portainer/portainer-ce:latest", status: "exited", ports: "9000:9000", host: "docker-host", created: "4 months ago" },
  { name: "homeassistant", image: "ghcr.io/home-assistant/home-assistant:stable", status: "running", ports: "8123:8123", host: "plex-media", created: "5 months ago" },
  { name: "watchtower", image: "containrrr/watchtower:latest", status: "running", ports: "-", host: "docker-host", created: "3 months ago" },
  { name: "caddy", image: "caddy:2-alpine", status: "stopped", ports: "80:80, 443:443", host: "docker-host", created: "6 months ago" },
];

export default function ContainersPage() {
  const [filter, setFilter] = useState("all");

  const runningCount = containers.filter((c) => c.status === "running").length;
  const stoppedCount = containers.filter((c) => c.status === "stopped").length;
  const exitedCount = containers.filter((c) => c.status === "exited").length;

  const filteredContainers =
    filter === "all"
      ? containers
      : containers.filter((c) => c.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Container className="h-5 w-5" />}
        title="Containers"
        description="Manage Docker containers across all hosts"
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Deploy Container
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-2xl font-bold">{containers.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Running</span>
              <span className="text-2xl font-bold text-emerald-400">{runningCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Stopped</span>
              <span className="text-2xl font-bold text-zinc-400">{stoppedCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Exited</span>
              <span className="text-2xl font-bold text-red-400">{exitedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({containers.length})</TabsTrigger>
              <TabsTrigger value="running">Running ({runningCount})</TabsTrigger>
              <TabsTrigger value="stopped">Stopped ({stoppedCount})</TabsTrigger>
              <TabsTrigger value="exited">Exited ({exitedCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={filter}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ports</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContainers.map((container) => (
                      <TableRow key={container.name}>
                        <TableCell className="font-medium">
                          {container.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                          {container.image}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={container.status} />
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {container.ports}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {container.host}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {container.created}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            {container.status !== "running" ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-400 hover:text-emerald-300"
                                title="Start"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-400 hover:text-red-300"
                                title="Stop"
                              >
                                <Square className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-amber-400 hover:text-amber-300"
                              title="Restart"
                              disabled={container.status !== "running"}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-400 hover:text-blue-300"
                              title="Logs"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
