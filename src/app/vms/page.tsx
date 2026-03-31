"use client";

import { useState } from "react";
import {
  Monitor,
  Play,
  Square,
  RotateCcw,
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
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/status-badge";
import { PageHeader } from "@/components/common/page-header";

type VMStatus = "running" | "stopped";

interface VM {
  vmid: number;
  name: string;
  node: string;
  status: VMStatus;
  type: "QEMU" | "LXC";
  cpuCores: number;
  memoryGB: number;
  diskGB: number;
  ip: string;
}

const vms: VM[] = [
  { vmid: 100, name: "ubuntu-server", node: "pve-node1", status: "running", type: "QEMU", cpuCores: 2, memoryGB: 4, diskGB: 32, ip: "10.11.12.110" },
  { vmid: 101, name: "docker-host", node: "pve-node1", status: "running", type: "QEMU", cpuCores: 4, memoryGB: 8, diskGB: 100, ip: "10.11.12.111" },
  { vmid: 102, name: "k3s-master", node: "pve-node1", status: "running", type: "QEMU", cpuCores: 4, memoryGB: 8, diskGB: 64, ip: "10.11.12.112" },
  { vmid: 103, name: "win11-desktop", node: "pve-node1", status: "stopped", type: "QEMU", cpuCores: 4, memoryGB: 16, diskGB: 256, ip: "-" },
  { vmid: 104, name: "plex-media", node: "pve-node2", status: "running", type: "QEMU", cpuCores: 4, memoryGB: 8, diskGB: 50, ip: "10.11.12.114" },
  { vmid: 105, name: "nextcloud", node: "pve-node2", status: "running", type: "QEMU", cpuCores: 2, memoryGB: 4, diskGB: 200, ip: "10.11.12.115" },
  { vmid: 106, name: "home-assistant", node: "pve-node2", status: "running", type: "QEMU", cpuCores: 2, memoryGB: 4, diskGB: 32, ip: "10.11.12.116" },
  { vmid: 107, name: "test-vm", node: "pve-node2", status: "stopped", type: "QEMU", cpuCores: 2, memoryGB: 2, diskGB: 20, ip: "-" },
  { vmid: 200, name: "pihole", node: "pve-node1", status: "running", type: "LXC", cpuCores: 1, memoryGB: 0.5, diskGB: 8, ip: "10.11.12.53" },
  { vmid: 201, name: "nginx-proxy", node: "pve-node1", status: "running", type: "LXC", cpuCores: 1, memoryGB: 1, diskGB: 8, ip: "10.11.12.80" },
  { vmid: 202, name: "wireguard", node: "pve-node2", status: "running", type: "LXC", cpuCores: 1, memoryGB: 0.25, diskGB: 4, ip: "10.11.12.51" },
];

export default function VMsPage() {
  const [filter, setFilter] = useState("all");

  const filteredVMs =
    filter === "all"
      ? vms
      : vms.filter((vm) => vm.status === filter);

  const runningCount = vms.filter((v) => v.status === "running").length;
  const stoppedCount = vms.filter((v) => v.status === "stopped").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Monitor className="h-5 w-5" />}
        title="Virtual Machines"
        description="Manage VMs across all nodes"
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create VM
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total VMs</span>
              <span className="text-2xl font-bold">{vms.length}</span>
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
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({vms.length})</TabsTrigger>
              <TabsTrigger value="running">Running ({runningCount})</TabsTrigger>
              <TabsTrigger value="stopped">Stopped ({stoppedCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={filter}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">VMID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Node</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">CPU Cores</TableHead>
                      <TableHead className="text-right">Memory (GB)</TableHead>
                      <TableHead className="text-right">Disk (GB)</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVMs.map((vm) => (
                      <TableRow key={vm.vmid}>
                        <TableCell className="font-mono text-sm">
                          {vm.vmid}
                        </TableCell>
                        <TableCell className="font-medium">{vm.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {vm.node}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={vm.status} />
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
                        <TableCell className="text-right">{vm.cpuCores}</TableCell>
                        <TableCell className="text-right">{vm.memoryGB}</TableCell>
                        <TableCell className="text-right">{vm.diskGB}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {vm.ip}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            {vm.status === "stopped" ? (
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
                              disabled={vm.status === "stopped"}
                            >
                              <RotateCcw className="h-4 w-4" />
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
