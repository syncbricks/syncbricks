"use client";

import {
  HardDrive,
  Database,
  Clock,
  Plus,
  RefreshCw,
  Trash2,
  Download,
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

const storagePools = [
  {
    name: "tank",
    totalTB: 8,
    usedTB: 4.2,
    layout: "RAIDZ1",
    status: "online" as const,
    disks: [
      { name: "da0", model: "WD Red Plus 4TB", serial: "WD-WMC4N0K1234", temp: "34°C", health: "ONLINE" },
      { name: "da1", model: "WD Red Plus 4TB", serial: "WD-WMC4N0K5678", temp: "36°C", health: "ONLINE" },
      { name: "da2", model: "WD Red Plus 4TB", serial: "WD-WMC4N0K9012", temp: "35°C", health: "ONLINE" },
      { name: "da3", model: "WD Red Plus 4TB", serial: "WD-WMC4N0K3456", temp: "33°C", health: "ONLINE" },
    ],
  },
  {
    name: "fast",
    totalTB: 2,
    usedTB: 0.8,
    layout: "Mirror",
    status: "online" as const,
    disks: [
      { name: "nvme0", model: "Samsung 980 Pro 1TB", serial: "S5GXNG0R123456", temp: "42°C", health: "ONLINE" },
      { name: "nvme1", model: "Samsung 980 Pro 1TB", serial: "S5GXNG0R789012", temp: "40°C", health: "ONLINE" },
    ],
  },
];

const datasets = [
  { name: "media", pool: "tank", used: "1.8 TB", available: "3.8 TB", mountpoint: "/mnt/tank/media", compression: "lz4", snapshots: 12 },
  { name: "backups", pool: "tank", used: "1.2 TB", available: "3.8 TB", mountpoint: "/mnt/tank/backups", compression: "zstd", snapshots: 30 },
  { name: "documents", pool: "tank", used: "245 GB", available: "3.8 TB", mountpoint: "/mnt/tank/documents", compression: "lz4", snapshots: 14 },
  { name: "docker", pool: "fast", used: "320 GB", available: "1.2 TB", mountpoint: "/mnt/fast/docker", compression: "lz4", snapshots: 7 },
  { name: "vms", pool: "fast", used: "420 GB", available: "1.2 TB", mountpoint: "/mnt/fast/vms", compression: "off", snapshots: 5 },
  { name: "isos", pool: "tank", used: "156 GB", available: "3.8 TB", mountpoint: "/mnt/tank/isos", compression: "off", snapshots: 2 },
];

const snapshots = [
  { name: "tank/backups@auto-2026-03-31-02:00", dataset: "backups", created: "2026-03-31 02:00", size: "2.4 GB" },
  { name: "tank/media@auto-2026-03-31-02:00", dataset: "media", created: "2026-03-31 02:00", size: "1.1 GB" },
  { name: "fast/docker@auto-2026-03-31-03:00", dataset: "docker", created: "2026-03-31 03:00", size: "856 MB" },
  { name: "tank/documents@auto-2026-03-30-02:00", dataset: "documents", created: "2026-03-30 02:00", size: "412 MB" },
  { name: "fast/vms@pre-update-2026-03-29", dataset: "vms", created: "2026-03-29 18:32", size: "3.2 GB" },
  { name: "tank/backups@auto-2026-03-30-02:00", dataset: "backups", created: "2026-03-30 02:00", size: "2.1 GB" },
  { name: "tank/media@weekly-2026-03-28", dataset: "media", created: "2026-03-28 00:00", size: "4.8 GB" },
];

export default function StoragePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<HardDrive className="h-5 w-5" />}
        title="Storage"
        description="NAS and storage pool management"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Scrub
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Snapshot
            </Button>
          </div>
        }
      />

      {/* Storage pool cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {storagePools.map((pool) => {
          const usedPercent = (pool.usedTB / pool.totalTB) * 100;
          return (
            <Card key={pool.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Database className="h-4 w-4" />
                    Pool: {pool.name}
                  </CardTitle>
                  <StatusBadge status={pool.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pool summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {pool.usedTB} TB / {pool.totalTB} TB used
                    </span>
                    <span className="font-medium">{usedPercent.toFixed(1)}%</span>
                  </div>
                  <Progress value={usedPercent} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Layout</p>
                    <p className="font-medium">{pool.layout}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Disks</p>
                    <p className="font-medium">{pool.disks.length} {pool.name === "fast" ? "NVMe SSDs" : "disks"}</p>
                  </div>
                </div>

                {/* Disk list */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Device</TableHead>
                        <TableHead className="text-xs">Model</TableHead>
                        <TableHead className="text-xs">Serial</TableHead>
                        <TableHead className="text-xs">Temp</TableHead>
                        <TableHead className="text-xs">Health</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pool.disks.map((disk) => (
                        <TableRow key={disk.name}>
                          <TableCell className="font-mono text-xs">{disk.name}</TableCell>
                          <TableCell className="text-xs">{disk.model}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{disk.serial}</TableCell>
                          <TableCell className="text-xs">{disk.temp}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                              {disk.health}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Datasets and Snapshots */}
      <Tabs defaultValue="datasets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="datasets">Datasets / Shares</TabsTrigger>
          <TabsTrigger value="snapshots">Recent Snapshots</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Datasets / Shares</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Pool</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Mountpoint</TableHead>
                    <TableHead>Compression</TableHead>
                    <TableHead className="text-right">Snapshots</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datasets.map((ds) => (
                    <TableRow key={ds.name}>
                      <TableCell className="font-medium">{ds.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{ds.pool}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{ds.used}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{ds.available}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{ds.mountpoint}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            ds.compression === "off"
                              ? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-xs"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs"
                          }
                        >
                          {ds.compression}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {ds.snapshots}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="snapshots">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Snapshots</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Dataset</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshots.map((snap) => (
                    <TableRow key={snap.name}>
                      <TableCell className="font-mono text-xs">{snap.name}</TableCell>
                      <TableCell className="text-sm">{snap.dataset}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{snap.created}</TableCell>
                      <TableCell className="text-sm">{snap.size}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Rollback">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Clone">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
