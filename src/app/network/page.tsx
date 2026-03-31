"use client";

import {
  Network,
  Shield,
  Wifi,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/status-badge";
import { PageHeader } from "@/components/common/page-header";

const interfaces = [
  {
    name: "WAN",
    status: "online" as const,
    ip: "203.0.113.1",
    subnet: "/24",
    gateway: "203.0.113.254",
    trafficIn: "142.3 Mbps",
    trafficOut: "38.7 Mbps",
  },
  {
    name: "LAN",
    status: "online" as const,
    ip: "10.11.12.1",
    subnet: "/24",
    gateway: "-",
    trafficIn: "892.1 Mbps",
    trafficOut: "654.2 Mbps",
  },
  {
    name: "VLAN10_IOT",
    status: "online" as const,
    ip: "10.11.10.1",
    subnet: "/24",
    gateway: "-",
    trafficIn: "12.4 Mbps",
    trafficOut: "3.1 Mbps",
  },
  {
    name: "VLAN20_GUEST",
    status: "online" as const,
    ip: "10.11.20.1",
    subnet: "/24",
    gateway: "-",
    trafficIn: "24.8 Mbps",
    trafficOut: "18.2 Mbps",
  },
  {
    name: "VLAN30_LAB",
    status: "online" as const,
    ip: "10.11.30.1",
    subnet: "/24",
    gateway: "-",
    trafficIn: "456.7 Mbps",
    trafficOut: "321.5 Mbps",
  },
];

const firewallRules = [
  { id: 1, action: "pass", protocol: "TCP", source: "LAN net", destination: "any", port: "443", description: "Allow HTTPS outbound" },
  { id: 2, action: "pass", protocol: "TCP", source: "LAN net", destination: "any", port: "80", description: "Allow HTTP outbound" },
  { id: 3, action: "pass", protocol: "TCP/UDP", source: "any", destination: "LAN address", port: "53", description: "Allow DNS to Pi-hole" },
  { id: 4, action: "block", protocol: "any", source: "VLAN20_GUEST", destination: "LAN net", port: "*", description: "Block guest to LAN" },
  { id: 5, action: "block", protocol: "any", source: "VLAN10_IOT", destination: "LAN net", port: "*", description: "Block IoT to LAN" },
  { id: 6, action: "pass", protocol: "TCP", source: "VLAN10_IOT", destination: "10.11.12.50", port: "1883", description: "Allow IoT to MQTT broker" },
  { id: 7, action: "pass", protocol: "TCP", source: "VLAN30_LAB", destination: "any", port: "*", description: "Allow Lab unrestricted" },
  { id: 8, action: "pass", protocol: "TCP", source: "any", destination: "WAN address", port: "51820", description: "Allow WireGuard VPN" },
  { id: 9, action: "block", protocol: "any", source: "VLAN20_GUEST", destination: "10.11.10.0/24", port: "*", description: "Block guest to IoT" },
  { id: 10, action: "pass", protocol: "ICMP", source: "LAN net", destination: "any", port: "*", description: "Allow ICMP from LAN" },
];

const vlans = [
  { name: "IoT", vlan: "VLAN 10", subnet: "10.11.10.0/24", devices: 18, color: "bg-cyan-500/10 text-cyan-500" },
  { name: "Guest", vlan: "VLAN 20", subnet: "10.11.20.0/24", devices: 7, color: "bg-amber-500/10 text-amber-500" },
  { name: "Lab", vlan: "VLAN 30", subnet: "10.11.30.0/24", devices: 12, color: "bg-purple-500/10 text-purple-500" },
  { name: "Management", vlan: "LAN", subnet: "10.11.12.0/24", devices: 5, color: "bg-emerald-500/10 text-emerald-500" },
];

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Network className="h-5 w-5" />}
        title="Network"
        description="Network topology and firewall management"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">WAN Status</p>
                <p className="text-2xl font-bold">Up</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">IP: 203.0.113.1</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">LAN Status</p>
                <p className="text-2xl font-bold">Up</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Wifi className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">10.11.12.0/24</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Connections</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Network className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12% from yesterday</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Firewall Rules</p>
                <p className="text-2xl font-bold">86</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">10 active, 76 system</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Interfaces and Firewall */}
      <Tabs defaultValue="interfaces" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interfaces">Interfaces</TabsTrigger>
          <TabsTrigger value="firewall">Firewall Rules</TabsTrigger>
          <TabsTrigger value="vlans">VLANs</TabsTrigger>
        </TabsList>

        <TabsContent value="interfaces">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Network Interfaces</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Subnet</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead className="text-right">Traffic In</TableHead>
                    <TableHead className="text-right">Traffic Out</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interfaces.map((iface) => (
                    <TableRow key={iface.name}>
                      <TableCell className="font-medium">{iface.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={iface.status} />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{iface.ip}</TableCell>
                      <TableCell className="font-mono text-sm">{iface.subnet}</TableCell>
                      <TableCell className="font-mono text-sm">{iface.gateway}</TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end gap-1 text-emerald-400 text-sm">
                          <ArrowDownRight className="h-3 w-3" />
                          {iface.trafficIn}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end gap-1 text-blue-400 text-sm">
                          <ArrowUpRight className="h-3 w-3" />
                          {iface.trafficOut}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firewall">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Firewall Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Port</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firewallRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="text-muted-foreground">{rule.id}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            rule.action === "pass"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }
                        >
                          {rule.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{rule.protocol}</TableCell>
                      <TableCell className="text-sm">{rule.source}</TableCell>
                      <TableCell className="text-sm">{rule.destination}</TableCell>
                      <TableCell className="font-mono text-sm">{rule.port}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{rule.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vlans">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vlans.map((vlan) => (
              <Card key={vlan.name}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${vlan.color}`}>
                      <Network className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{vlan.name}</p>
                      <p className="text-xs text-muted-foreground">{vlan.vlan}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subnet</span>
                      <span className="font-mono">{vlan.subnet}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Devices</span>
                      <span>{vlan.devices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <StatusBadge status="online" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
