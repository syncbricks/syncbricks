"use client";

import {
  Laptop,
  Plus,
  Radar,
  Wifi,
  Monitor,
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
  { label: "Total Devices", value: "42", icon: Laptop },
  { label: "Online", value: "38", icon: Wifi, color: "text-emerald-400" },
  { label: "Offline", value: "4", icon: Monitor, color: "text-red-400" },
];

type DeviceType = "server" | "switch" | "router" | "ap" | "iot" | "workstation";

interface Device {
  id: number;
  name: string;
  ip: string;
  mac: string;
  type: DeviceType;
  manufacturer: string;
  location: string;
  status: "online" | "offline";
  lastSeen: string;
}

const devices: Device[] = [
  { id: 1, name: "proxmox-node1", ip: "10.11.12.101", mac: "AA:BB:CC:01:01:01", type: "server", manufacturer: "Dell", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 2, name: "proxmox-node2", ip: "10.11.12.104", mac: "AA:BB:CC:01:01:04", type: "server", manufacturer: "Dell", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 3, name: "pfsense", ip: "10.11.12.1", mac: "AA:BB:CC:01:00:01", type: "router", manufacturer: "Netgate", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 4, name: "nas", ip: "10.11.12.50", mac: "AA:BB:CC:01:00:50", type: "server", manufacturer: "Synology", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 5, name: "core-switch", ip: "10.11.12.2", mac: "AA:BB:CC:02:00:02", type: "switch", manufacturer: "UniFi", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 6, name: "poe-switch-1", ip: "10.11.12.3", mac: "AA:BB:CC:02:00:03", type: "switch", manufacturer: "UniFi", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 7, name: "poe-switch-2", ip: "10.11.12.4", mac: "AA:BB:CC:02:00:04", type: "switch", manufacturer: "UniFi", location: "Office", status: "online", lastSeen: "Now" },
  { id: 8, name: "ap-living-room", ip: "10.11.12.10", mac: "AA:BB:CC:03:00:10", type: "ap", manufacturer: "UniFi", location: "Living Room", status: "online", lastSeen: "Now" },
  { id: 9, name: "ap-office", ip: "10.11.12.11", mac: "AA:BB:CC:03:00:11", type: "ap", manufacturer: "UniFi", location: "Office", status: "online", lastSeen: "Now" },
  { id: 10, name: "ap-garage", ip: "10.11.12.12", mac: "AA:BB:CC:03:00:12", type: "ap", manufacturer: "UniFi", location: "Garage", status: "offline", lastSeen: "2 days ago" },
  { id: 11, name: "hue-bridge", ip: "10.11.12.60", mac: "AA:BB:CC:04:00:60", type: "iot", manufacturer: "Philips", location: "Living Room", status: "online", lastSeen: "Now" },
  { id: 12, name: "ecobee-thermostat", ip: "10.11.12.61", mac: "AA:BB:CC:04:00:61", type: "iot", manufacturer: "Ecobee", location: "Hallway", status: "online", lastSeen: "Now" },
  { id: 13, name: "ring-doorbell", ip: "10.11.12.62", mac: "AA:BB:CC:04:00:62", type: "iot", manufacturer: "Ring", location: "Front Door", status: "online", lastSeen: "Now" },
  { id: 14, name: "sonos-speaker", ip: "10.11.12.63", mac: "AA:BB:CC:04:00:63", type: "iot", manufacturer: "Sonos", location: "Living Room", status: "online", lastSeen: "Now" },
  { id: 15, name: "workstation-main", ip: "10.11.12.200", mac: "AA:BB:CC:05:00:C8", type: "workstation", manufacturer: "Custom", location: "Office", status: "online", lastSeen: "Now" },
  { id: 16, name: "macbook-pro", ip: "10.11.12.201", mac: "AA:BB:CC:05:00:C9", type: "workstation", manufacturer: "Apple", location: "Office", status: "online", lastSeen: "Now" },
  { id: 17, name: "printer", ip: "10.11.12.70", mac: "AA:BB:CC:06:00:46", type: "iot", manufacturer: "HP", location: "Office", status: "offline", lastSeen: "5 hours ago" },
  { id: 18, name: "smart-plug-rack", ip: "10.11.12.64", mac: "AA:BB:CC:04:00:64", type: "iot", manufacturer: "TP-Link", location: "Server Rack", status: "online", lastSeen: "Now" },
  { id: 19, name: "backup-server", ip: "10.11.12.105", mac: "AA:BB:CC:01:01:05", type: "server", manufacturer: "HPE", location: "Server Rack", status: "offline", lastSeen: "1 day ago" },
  { id: 20, name: "ip-camera-garage", ip: "10.11.12.65", mac: "AA:BB:CC:04:00:65", type: "iot", manufacturer: "Reolink", location: "Garage", status: "offline", lastSeen: "2 days ago" },
];

const typeBadgeColors: Record<DeviceType, string> = {
  server: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  switch: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  router: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  ap: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  iot: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  workstation: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

export default function DevicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Laptop className="h-5 w-5" />}
        title="Devices"
        description="Network device inventory and IP management"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Radar className="h-4 w-4 mr-2" />
              Scan Network
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </>
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
                  <stat.icon
                    className={`h-5 w-5 ${stat.color ?? "text-primary"}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Device Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>MAC Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {device.ip}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {device.mac}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={typeBadgeColors[device.type]}
                      >
                        {device.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {device.manufacturer}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {device.location}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            device.status === "online"
                              ? "bg-emerald-400"
                              : "bg-red-400"
                          }`}
                        />
                        <span className="text-sm capitalize">
                          {device.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {device.lastSeen}
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
