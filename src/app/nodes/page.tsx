"use client";

import { useState } from "react";
import {
  Server,
  RefreshCw,
  Cpu,
  MemoryStick,
  HardDrive,
  Clock,
  ArrowDownUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

const nodes = [
  {
    id: "pve-node1",
    name: "pve-node1",
    ip: "10.11.12.101",
    status: "online" as const,
    uptime: "42 days, 7h 23m",
    cpu: { cores: 16, usage: 42 },
    memory: { used: 24.5, total: 64, percent: 38 },
    disk: { used: 1.8, total: 4, percent: 45 },
    vms: [
      { id: 100, name: "ubuntu-server", type: "QEMU", status: "running" as const, cpu: "2 cores", memory: "4 GB", ip: "10.11.12.110" },
      { id: 101, name: "docker-host", type: "QEMU", status: "running" as const, cpu: "4 cores", memory: "8 GB", ip: "10.11.12.111" },
      { id: 102, name: "k3s-master", type: "QEMU", status: "running" as const, cpu: "4 cores", memory: "8 GB", ip: "10.11.12.112" },
      { id: 200, name: "pihole", type: "LXC", status: "running" as const, cpu: "1 core", memory: "512 MB", ip: "10.11.12.53" },
      { id: 201, name: "nginx-proxy", type: "LXC", status: "running" as const, cpu: "1 core", memory: "1 GB", ip: "10.11.12.80" },
      { id: 103, name: "win11-desktop", type: "QEMU", status: "stopped" as const, cpu: "4 cores", memory: "16 GB", ip: "-" },
    ],
  },
  {
    id: "pve-node2",
    name: "pve-node2",
    ip: "10.11.12.104",
    status: "online" as const,
    uptime: "28 days, 15h 42m",
    cpu: { cores: 8, usage: 38 },
    memory: { used: 18.2, total: 32, percent: 57 },
    disk: { used: 2.4, total: 8, percent: 30 },
    vms: [
      { id: 104, name: "plex-media", type: "QEMU", status: "running" as const, cpu: "4 cores", memory: "8 GB", ip: "10.11.12.114" },
      { id: 105, name: "nextcloud", type: "QEMU", status: "running" as const, cpu: "2 cores", memory: "4 GB", ip: "10.11.12.115" },
      { id: 106, name: "home-assistant", type: "QEMU", status: "running" as const, cpu: "2 cores", memory: "4 GB", ip: "10.11.12.116" },
      { id: 202, name: "wireguard", type: "LXC", status: "running" as const, cpu: "1 core", memory: "256 MB", ip: "10.11.12.51" },
      { id: 107, name: "test-vm", type: "QEMU", status: "stopped" as const, cpu: "2 cores", memory: "2 GB", ip: "-" },
    ],
  },
];

function ResourceGauge({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
}) {
  const color =
    value > 80 ? "text-red-400" : value > 60 ? "text-amber-400" : "text-emerald-400";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          {icon}
          {label}
        </span>
        <span className={`font-mono font-medium ${color}`}>{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

export default function NodesPage() {
  const [activeNode, setActiveNode] = useState("all");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Server className="h-5 w-5" />}
        title="Nodes"
        description="Manage your Proxmox compute nodes"
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <ArrowDownUp className="h-4 w-4 mr-2" />
              Sync All
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {nodes.map((node) => (
          <Card key={node.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="h-4 w-4 text-blue-500" />
                  {node.name}
                </CardTitle>
                <StatusBadge status={node.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span>IP: {node.ip}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Uptime: {node.uptime}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ResourceGauge
                icon={<Cpu className="h-3.5 w-3.5" />}
                label="CPU"
                value={node.cpu.usage}
                detail={`${node.cpu.cores} cores`}
              />
              <ResourceGauge
                icon={<MemoryStick className="h-3.5 w-3.5" />}
                label="Memory"
                value={node.memory.percent}
                detail={`${node.memory.used} GB / ${node.memory.total} GB`}
              />
              <ResourceGauge
                icon={<HardDrive className="h-3.5 w-3.5" />}
                label="Disk"
                value={node.disk.percent}
                detail={`${node.disk.used} TB / ${node.disk.total} TB`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">VMs &amp; Containers</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeNode} onValueChange={setActiveNode}>
            <TabsList>
              <TabsTrigger value="all">All Nodes</TabsTrigger>
              {nodes.map((node) => (
                <TabsTrigger key={node.id} value={node.id}>
                  {node.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {["all", ...nodes.map((n) => n.id)].map((tabValue) => {
              const filteredVms =
                tabValue === "all"
                  ? nodes.flatMap((n) =>
                      n.vms.map((vm) => ({ ...vm, node: n.name }))
                    )
                  : (nodes.find((n) => n.id === tabValue)?.vms ?? []).map(
                      (vm) => ({
                        ...vm,
                        node: nodes.find((n) => n.id === tabValue)!.name,
                      })
                    );

              return (
                <TabsContent key={tabValue} value={tabValue}>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Node</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>CPU</TableHead>
                          <TableHead>Memory</TableHead>
                          <TableHead>IP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVms.map((vm) => (
                          <TableRow key={`${vm.node}-${vm.id}`}>
                            <TableCell className="font-mono text-sm">
                              {vm.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {vm.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {vm.node}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  vm.type === "QEMU"
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                    : "bg-purple-500/10 text-purple-400 border-purple-500/30"
                                }
                              >
                                {vm.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={vm.status} />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {vm.cpu}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {vm.memory}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              {vm.ip}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
