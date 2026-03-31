"use client";

import { useState } from "react";
import {
  Settings,
  Plus,
  Pencil,
  Trash2,
  Zap,
  CheckCircle2,
  XCircle,
  Server,
  Shield,
  Container,
  Ban,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";

type ConnectionType = "Proxmox" | "Docker" | "pfSense" | "Pi-hole" | "Generic";
type ConnectionStatus = "connected" | "disconnected";

interface Connection {
  id: string;
  name: string;
  type: ConnectionType;
  host: string;
  status: ConnectionStatus;
}

const connections: Connection[] = [
  { id: "1", name: "Proxmox Node 1", type: "Proxmox", host: "10.11.12.101", status: "connected" },
  { id: "2", name: "Proxmox Node 2", type: "Proxmox", host: "10.11.12.104", status: "connected" },
  { id: "3", name: "pfSense", type: "pfSense", host: "10.11.12.1", status: "connected" },
  { id: "4", name: "Docker Host", type: "Docker", host: "10.11.12.101:2376", status: "connected" },
  { id: "5", name: "Pi-hole", type: "Pi-hole", host: "10.11.12.53", status: "disconnected" },
];

const typeIcons: Record<ConnectionType, React.ReactNode> = {
  Proxmox: <Server className="h-4 w-4" />,
  Docker: <Container className="h-4 w-4" />,
  pfSense: <Shield className="h-4 w-4" />,
  "Pi-hole": <Ban className="h-4 w-4" />,
  Generic: <Globe className="h-4 w-4" />,
};

const typeBadgeColors: Record<ConnectionType, string> = {
  Proxmox: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Docker: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pfSense: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "Pi-hole": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Generic: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function SettingsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [sslVerify, setSslVerify] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("30");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Settings className="h-5 w-5" />}
        title="Settings"
        description="Configure connections and preferences"
      />

      <Tabs defaultValue="connections">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai">AI Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Configured Connections</h2>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Connection
            </Button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">New Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="My Proxmox Node" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="proxmox">Proxmox</SelectItem>
                        <SelectItem value="docker">Docker</SelectItem>
                        <SelectItem value="pfsense">pfSense</SelectItem>
                        <SelectItem value="pihole">Pi-hole</SelectItem>
                        <SelectItem value="generic">Generic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Host</label>
                    <Input placeholder="10.11.12.100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Port</label>
                    <Input placeholder="8006" type="number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input placeholder="root@pam" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium">API Token</label>
                    <Input placeholder="PVEAPIToken=user@pam!token=..." />
                  </div>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <Switch checked={sslVerify} onCheckedChange={setSslVerify} />
                    <label className="text-sm font-medium">Verify SSL Certificate</label>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button>Save Connection</Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {connections.map((conn) => (
              <Card key={conn.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        {typeIcons[conn.type]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{conn.name}</span>
                          <Badge variant="outline" className={typeBadgeColors[conn.type]}>
                            {conn.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm text-muted-foreground font-mono">{conn.host}</span>
                          <div className="flex items-center gap-1">
                            {conn.status === "connected" ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5 text-red-500" />
                            )}
                            <span className={`text-xs ${conn.status === "connected" ? "text-emerald-500" : "text-red-500"}`}>
                              {conn.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Zap className="h-3.5 w-3.5 mr-1" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Use dark theme across the application</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <div className="space-y-2">
                <label className="font-medium">Refresh Interval</label>
                <p className="text-sm text-muted-foreground">How often to poll infrastructure for updates</p>
                <Select value={refreshInterval} onValueChange={(v) => setRefreshInterval(v ?? "30")}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Every 10 seconds</SelectItem>
                    <SelectItem value="30">Every 30 seconds</SelectItem>
                    <SelectItem value="60">Every 1 minute</SelectItem>
                    <SelectItem value="300">Every 5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="font-medium">Email Address</label>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                <Input placeholder="admin@homelab.local" />
              </div>
              <div className="space-y-2">
                <label className="font-medium">Webhook URL</label>
                <p className="text-sm text-muted-foreground">Generic webhook endpoint for notifications</p>
                <Input placeholder="https://hooks.example.com/webhook/..." />
              </div>
              <div className="space-y-2">
                <label className="font-medium">Discord Webhook</label>
                <p className="text-sm text-muted-foreground">Send notifications to a Discord channel</p>
                <Input placeholder="https://discord.com/api/webhooks/..." />
              </div>
              <Button>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Provider Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="font-medium">Ollama Endpoint</label>
                <p className="text-sm text-muted-foreground">Local Ollama instance for on-premise AI inference</p>
                <Input placeholder="http://10.11.12.101:11434" defaultValue="http://10.11.12.101:11434" />
              </div>
              <div className="space-y-2">
                <label className="font-medium">OpenAI API Key</label>
                <p className="text-sm text-muted-foreground">Optional: Use OpenAI models for advanced reasoning</p>
                <Input type="password" placeholder="sk-..." />
              </div>
              <div className="space-y-2">
                <label className="font-medium">Model Selection</label>
                <p className="text-sm text-muted-foreground">Choose the default model for AI agent tasks</p>
                <Select defaultValue="llama3">
                  <SelectTrigger className="w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama3">Ollama - Llama 3 (8B)</SelectItem>
                    <SelectItem value="llama3-70b">Ollama - Llama 3 (70B)</SelectItem>
                    <SelectItem value="mistral">Ollama - Mistral (7B)</SelectItem>
                    <SelectItem value="codellama">Ollama - Code Llama (13B)</SelectItem>
                    <SelectItem value="gpt4o">OpenAI - GPT-4o</SelectItem>
                    <SelectItem value="gpt4o-mini">OpenAI - GPT-4o Mini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save AI Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
