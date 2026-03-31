"use client";

import {
  Globe,
  Search,
  ShieldBan,
  Clock,
  ListFilter,
  Plus,
  Trash2,
  Edit,
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
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common/page-header";

const localDnsRecords = [
  { domain: "proxmox.lab.local", ip: "10.11.12.10", type: "A" },
  { domain: "nas.lab.local", ip: "10.11.12.20", type: "A" },
  { domain: "plex.lab.local", ip: "10.11.12.30", type: "A" },
  { domain: "home.lab.local", ip: "10.11.12.40", type: "A" },
  { domain: "grafana.lab.local", ip: "10.11.12.50", type: "A" },
  { domain: "pihole.lab.local", ip: "10.11.12.5", type: "A" },
  { domain: "portainer.lab.local", ip: "10.11.12.60", type: "A" },
  { domain: "nextcloud.lab.local", ip: "10.11.12.70", type: "A" },
  { domain: "vault.lab.local", ip: "10.11.12.80", type: "A" },
  { domain: "mqtt.lab.local", ip: "10.11.12.50", type: "CNAME" },
];

const topBlockedDomains = [
  { domain: "analytics.tiktok.com", count: 3421 },
  { domain: "graph.facebook.com", count: 2814 },
  { domain: "ads.google.com", count: 2156 },
  { domain: "telemetry.microsoft.com", count: 1893 },
  { domain: "tracking.amazon.com", count: 1247 },
];

const topClients = [
  { client: "10.11.12.40 (home-assistant)", queries: 28492 },
  { client: "10.11.10.15 (roku-tv)", queries: 18234 },
  { client: "10.11.12.100 (desktop-pc)", queries: 14821 },
  { client: "10.11.20.5 (iphone-guest)", queries: 9412 },
  { client: "10.11.10.22 (alexa-kitchen)", queries: 8756 },
];

const blocklists = [
  { name: "Steven Black's Unified Hosts", domains: 184231, enabled: true },
  { name: "AdGuard DNS Filter", domains: 312456, enabled: true },
  { name: "OISD Full", domains: 248912, enabled: true },
  { name: "Energized Ultimate", domains: 98234, enabled: true },
  { name: "Dan Pollock's Hosts", domains: 14892, enabled: true },
  { name: "Phishing Army Extended", domains: 33726, enabled: false },
];

export default function DnsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Globe className="h-5 w-5" />}
        title="DNS"
        description="DNS filtering and local DNS management"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Queries</p>
                <p className="text-2xl font-bold">124,892</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Queries Blocked</p>
                <p className="text-2xl font-bold">18,234</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <ShieldBan className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-red-400">14.6% blocked</span>
              </div>
              <Progress value={14.6} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blocklist Domains</p>
                <p className="text-2xl font-bold">892,451</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <ListFilter className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">6 blocklists active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">DNS Response Time</p>
                <p className="text-2xl font-bold">4.2ms</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
            <p className="text-xs text-emerald-400 mt-2">Excellent</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Local DNS Records</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="blocklists">Blocklists</TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Local DNS Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localDnsRecords.map((record) => (
                    <TableRow key={record.domain}>
                      <TableCell className="font-mono text-sm font-medium">{record.domain}</TableCell>
                      <TableCell className="font-mono text-sm">{record.ip}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {record.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
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

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Blocked Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topBlockedDomains.map((item, i) => (
                    <div key={item.domain} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-5">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono truncate">{item.domain}</p>
                        <Progress value={(item.count / topBlockedDomains[0].count) * 100} className="h-1.5 mt-1" />
                      </div>
                      <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs shrink-0">
                        {item.count.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topClients.map((item, i) => (
                    <div key={item.client} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-5">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono truncate">{item.client}</p>
                        <Progress value={(item.queries / topClients[0].queries) * 100} className="h-1.5 mt-1" />
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {item.queries.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blocklists">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Blocklist Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blocklist</TableHead>
                    <TableHead>Domains</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blocklists.map((list) => (
                    <TableRow key={list.name}>
                      <TableCell className="font-medium text-sm">{list.name}</TableCell>
                      <TableCell className="text-sm">{list.domains.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            list.enabled
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs"
                              : "bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-xs"
                          }
                        >
                          {list.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-xs">
                          {list.enabled ? "Disable" : "Enable"}
                        </Button>
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
