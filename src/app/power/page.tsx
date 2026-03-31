"use client";

import {
  Plug,
  Battery,
  Gauge,
  Clock,
  Zap,
  DollarSign,
  AlertTriangle,
  Server,
  HardDrive,
  Monitor,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/status-badge";
import { PageHeader } from "@/components/common/page-header";

const powerEvents = [
  { time: "2026-03-28 14:32", event: "Battery Test", details: "Scheduled self-test completed successfully", status: "success" as const },
  { time: "2026-03-25 09:15", event: "On Battery", details: "Utility power lost, running on battery", status: "warning" as const },
  { time: "2026-03-25 09:18", event: "Back Online", details: "Utility power restored after 3 minutes", status: "success" as const },
  { time: "2026-03-20 03:00", event: "Battery Test", details: "Scheduled self-test completed successfully", status: "success" as const },
  { time: "2026-03-12 22:45", event: "On Battery", details: "Utility power lost, running on battery", status: "warning" as const },
  { time: "2026-03-12 22:46", event: "Low Battery Warning", details: "Battery capacity below 30%, initiating shutdown sequence", status: "critical" as const },
  { time: "2026-03-12 22:48", event: "Back Online", details: "Utility power restored, shutdown sequence cancelled", status: "success" as const },
];

const shutdownPriority = [
  { order: 1, name: "Non-critical VMs", icon: Monitor, items: "win11-desktop, test-vm", delay: "0s" },
  { order: 2, name: "Application VMs", icon: Server, items: "plex-media, nextcloud, home-assistant", delay: "30s" },
  { order: 3, name: "Infrastructure VMs", icon: Server, items: "docker-host, k3s-master, pihole, wireguard", delay: "60s" },
  { order: 4, name: "NAS / Storage", icon: HardDrive, items: "nas (Synology DS1621+)", delay: "90s" },
  { order: 5, name: "Proxmox Hosts", icon: Server, items: "pve-node2, pve-node1", delay: "120s" },
];

export default function PowerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Plug className="h-5 w-5" />}
        title="Power"
        description="UPS monitoring and power management"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">UPS Status</CardTitle>
              <StatusBadge status="online" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Battery className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-lg font-semibold">CyberPower CP1500</p>
                <p className="text-sm text-muted-foreground">
                  1500VA / 900W Line-Interactive UPS
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-lg font-bold text-emerald-400 mt-1">Online</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Battery</p>
                <p className="text-lg font-bold text-emerald-400 mt-1">100%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Load</p>
                <p className="text-lg font-bold text-amber-400 mt-1">45%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Runtime</p>
                <p className="text-lg font-bold mt-1">28 min</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Battery className="h-3.5 w-3.5" />
                    Battery Level
                  </span>
                  <span className="font-mono font-medium text-emerald-400">
                    100%
                  </span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Gauge className="h-3.5 w-3.5" />
                    Load
                  </span>
                  <span className="font-mono font-medium text-amber-400">
                    45%
                  </span>
                </div>
                <Progress value={45} className="h-2" />
                <p className="text-xs text-muted-foreground">405W / 900W</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Power Consumption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Draw</span>
                <span className="font-mono font-medium">405W</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Daily Average</span>
                <span className="font-mono font-medium">9.7 kWh</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Est.</span>
                <span className="font-mono font-medium">291 kWh</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Est. Monthly Cost
                  </span>
                  <span className="font-mono font-medium text-lg">$34.92</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on $0.12/kWh average rate
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Input Voltage</span>
                <span className="font-mono font-medium">121V</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Output Voltage</span>
                <span className="font-mono font-medium">120V</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Temperature</span>
                <span className="font-mono font-medium">32°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Replaced</span>
                <span className="font-mono font-medium">2025-08-15</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Power Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {powerEvents.map((event, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm text-muted-foreground whitespace-nowrap">
                        {event.time}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {event.status === "critical" && (
                            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                          )}
                          {event.status === "warning" && (
                            <Zap className="h-3.5 w-3.5 text-amber-400" />
                          )}
                          {event.status === "success" && (
                            <Clock className="h-3.5 w-3.5 text-emerald-400" />
                          )}
                          <span className="font-medium text-sm">{event.event}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {event.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Shutdown Sequence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Ordered shutdown priority when battery reaches critical level.
            </p>
            <div className="space-y-3">
              {shutdownPriority.map((step) => (
                <div
                  key={step.order}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                    {step.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm flex items-center gap-1.5">
                        <step.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        {step.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        +{step.delay}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {step.items}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
