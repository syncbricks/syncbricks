"use client";

import {
  Server,
  Monitor,
  Container,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Wifi,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const cpuData = [
  { time: "00:00", node1: 23, node2: 31 },
  { time: "04:00", node1: 18, node2: 25 },
  { time: "08:00", node1: 45, node2: 52 },
  { time: "12:00", node1: 62, node2: 48 },
  { time: "16:00", node1: 55, node2: 41 },
  { time: "20:00", node1: 38, node2: 35 },
  { time: "Now", node1: 42, node2: 38 },
];

const memoryData = [
  { name: "Node 1", used: 24.5, total: 64 },
  { name: "Node 2", used: 18.2, total: 32 },
];

const services = [
  { name: "Proxmox Node 1", status: "up", type: "Hypervisor" },
  { name: "Proxmox Node 2", status: "up", type: "Hypervisor" },
  { name: "pfSense", status: "up", type: "Firewall" },
  { name: "Pi-hole", status: "up", type: "DNS" },
  { name: "Plex", status: "up", type: "Media" },
  { name: "Home Assistant", status: "up", type: "Automation" },
  { name: "Nextcloud", status: "degraded", type: "Cloud" },
  { name: "Grafana", status: "up", type: "Monitoring" },
  { name: "Portainer", status: "down", type: "Management" },
  { name: "Nginx PM", status: "up", type: "Proxy" },
  { name: "Vaultwarden", status: "up", type: "Security" },
  { name: "Uptime Kuma", status: "up", type: "Monitoring" },
];

const recentAlerts = [
  { severity: "critical", title: "Portainer container stopped", time: "5 min ago", source: "Docker" },
  { severity: "warning", title: "Nextcloud response time > 2s", time: "12 min ago", source: "Health Check" },
  { severity: "warning", title: "Disk usage at 82% on Node 1", time: "1 hour ago", source: "Proxmox" },
  { severity: "info", title: "Backup completed for all VMs", time: "3 hours ago", source: "PBS" },
];

const statusColors: Record<string, string> = {
  up: "bg-emerald-500",
  down: "bg-red-500",
  degraded: "bg-amber-500",
};

const severityColors: Record<string, string> = {
  critical: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your homelab infrastructure</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nodes</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Server className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              <span>2 online</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VMs / LXC</p>
                <p className="text-3xl font-bold">14</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Monitor className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              <span>12 running, 2 stopped</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Containers</p>
                <p className="text-3xl font-bold">28</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Container className="h-6 w-6 text-cyan-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-red-400">
              <ArrowDownRight className="h-3 w-3" />
              <span>1 down</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alerts</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-red-400">
              <span>1 critical</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cpu className="h-4 w-4" /> CPU Usage (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpuData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis unit="%" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="node1" name="Node 1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="node2" name="Node 2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MemoryStick className="h-4 w-4" /> Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {memoryData.map((node) => (
                <div key={node.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{node.name}</span>
                    <span className="text-muted-foreground">{node.used} GB / {node.total} GB</span>
                  </div>
                  <Progress value={(node.used / node.total) * 100} className="h-3" />
                </div>
              ))}
            </div>
            <div className="mt-6 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memoryData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis unit=" GB" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="used" name="Used" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" /> Service Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {services.map((svc) => (
                <div key={svc.name} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card/50">
                  <span className={`h-2 w-2 rounded-full ${statusColors[svc.status]}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{svc.name}</p>
                    <p className="text-xs text-muted-foreground">{svc.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" /> Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`mt-0.5 ${severityColors[alert.severity]}`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{alert.source}</span>
                      <span>&middot;</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Firewall</p>
                <p className="text-xs text-muted-foreground">pfSense - Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Wifi className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Network</p>
                <p className="text-xs text-muted-foreground">10.11.12.0/24 - 42 devices</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Storage</p>
                <p className="text-xs text-muted-foreground">4.2 TB / 12 TB used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
