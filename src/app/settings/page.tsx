"use client";

import { useState, useEffect, useCallback } from "react";
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
  HardDrive,
  Plug,
  KeyRound,
  AlertTriangle,
  Loader2,
  X,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";

interface Connection {
  id: number;
  name: string;
  type: string;
  host: string;
  port: number | null;
  username: string | null;
  password: string | null;
  apiToken: string | null;
  sslVerify: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SSHKeyInfo {
  detected: boolean;
  path: string;
  publicKey?: string;
}

interface ConnectionForm {
  name: string;
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  apiToken: string;
  sslVerify: boolean;
  monitorOnly: boolean;
}

const emptyForm: ConnectionForm = {
  name: "",
  type: "",
  host: "",
  port: "",
  username: "",
  password: "",
  apiToken: "",
  sslVerify: false,
  monitorOnly: false,
};

const connectionTypes = [
  { value: "proxmox", label: "Proxmox VE", defaultPort: "8006", icon: <Server className="h-4 w-4" /> },
  { value: "docker", label: "Docker Engine", defaultPort: "2375", icon: <Container className="h-4 w-4" /> },
  { value: "pfsense", label: "pfSense", defaultPort: "443", icon: <Shield className="h-4 w-4" /> },
  { value: "opnsense", label: "OPNsense", defaultPort: "443", icon: <Shield className="h-4 w-4" /> },
  { value: "pihole", label: "Pi-hole", defaultPort: "80", icon: <Ban className="h-4 w-4" /> },
  { value: "adguard", label: "AdGuard Home", defaultPort: "3000", icon: <Ban className="h-4 w-4" /> },
  { value: "truenas", label: "TrueNAS", defaultPort: "443", icon: <HardDrive className="h-4 w-4" /> },
  { value: "nut", label: "NUT (UPS)", defaultPort: "3493", icon: <Plug className="h-4 w-4" /> },
  { value: "nginx-pm", label: "Nginx Proxy Manager", defaultPort: "81", icon: <Globe className="h-4 w-4" /> },
  { value: "traefik", label: "Traefik", defaultPort: "8080", icon: <Globe className="h-4 w-4" /> },
];

const typeIconMap: Record<string, React.ReactNode> = Object.fromEntries(
  connectionTypes.map((t) => [t.value, t.icon])
);

const typeLabelMap: Record<string, string> = Object.fromEntries(
  connectionTypes.map((t) => [t.value, t.label])
);

const typeBadgeColors: Record<string, string> = {
  proxmox: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  docker: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pfsense: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  opnsense: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  pihole: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  adguard: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  truenas: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  nut: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "nginx-pm": "bg-green-500/10 text-green-500 border-green-500/20",
  traefik: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function SettingsPage() {
  const [conns, setConns] = useState<Connection[]>([]);
  const [sshKey, setSSHKey] = useState<SSHKeyInfo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ConnectionForm>(emptyForm);
  const [testing, setTesting] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<Record<number, { success: boolean; message: string }>>({});
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("30");

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch("/api/connections");
      const data = await res.json();
      setConns(data.connections || []);
      setSSHKey(data.sshKey || null);
    } catch {
      // API may not be connected to real DB yet — use empty state
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount — data load is an appropriate effect use
    let cancelled = false;
    fetch("/api/connections")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setConns(data.connections || []);
          setSSHKey(data.sshKey || null);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const updateField = (field: keyof ConnectionForm, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-fill port when type changes
      if (field === "type" && typeof value === "string") {
        const typeDef = connectionTypes.find((t) => t.value === value);
        if (typeDef && !prev.port) {
          next.port = typeDef.defaultPort;
        }
        // Auto-generate name
        if (!prev.name) {
          next.name = typeDef?.label || "";
        }
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.name || !form.type || !form.host) return;
    setSaving(true);

    const payload = {
      ...(editingId ? { id: editingId } : {}),
      name: form.name,
      type: form.type,
      host: form.host,
      port: form.port ? parseInt(form.port) : null,
      username: form.monitorOnly ? null : form.username || null,
      password: form.monitorOnly ? null : form.password || null,
      apiToken: form.monitorOnly ? null : form.apiToken || null,
      sslVerify: form.sslVerify,
    };

    const method = editingId ? "PUT" : "POST";
    await fetch("/api/connections", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    fetchConnections();
  };

  const handleEdit = (conn: Connection) => {
    setForm({
      name: conn.name,
      type: conn.type,
      host: conn.host,
      port: conn.port?.toString() || "",
      username: conn.username || "",
      password: "",
      apiToken: conn.apiToken || "",
      sslVerify: conn.sslVerify,
      monitorOnly: !conn.username && !conn.password && !conn.apiToken,
    });
    setEditingId(conn.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/connections?id=${id}`, { method: "DELETE" });
    fetchConnections();
  };

  const handleTest = async (conn: Connection) => {
    setTesting(conn.id);
    setTestResult((prev) => ({ ...prev, [conn.id]: { success: false, message: "Testing..." } }));

    try {
      const res = await fetch("/api/connections/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: conn.type,
          host: conn.host,
          port: conn.port,
          username: conn.username,
          password: conn.password,
          apiToken: conn.apiToken,
          sslVerify: conn.sslVerify,
        }),
      });
      const data = await res.json();
      setTestResult((prev) => ({ ...prev, [conn.id]: { success: data.success, message: data.message } }));
    } catch {
      setTestResult((prev) => ({ ...prev, [conn.id]: { success: false, message: "Test request failed" } }));
    }
    setTesting(null);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Settings className="h-5 w-5" />}
        title="Settings"
        description="Manage connections, preferences, and integrations"
      />

      <Tabs defaultValue="connections">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai">AI Providers</TabsTrigger>
        </TabsList>

        {/* ==================== CONNECTIONS TAB ==================== */}
        <TabsContent value="connections" className="mt-6 space-y-4">
          {/* SSH Key Detection Banner */}
          {sshKey && (
            <Card className={sshKey.detected ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <KeyRound className={`h-5 w-5 mt-0.5 ${sshKey.detected ? "text-emerald-500" : "text-amber-500"}`} />
                  <div className="flex-1">
                    {sshKey.detected ? (
                      <>
                        <p className="text-sm font-medium text-emerald-400">SSH Key Detected</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Found at <code className="text-xs bg-muted px-1 py-0.5 rounded">{sshKey.path}</code>.
                          If this key is already authorized on your infrastructure servers, SyncBricks can connect automatically without additional credentials.
                        </p>
                        {sshKey.publicKey && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Show public key</summary>
                            <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block break-all">{sshKey.publicKey}</code>
                          </details>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-amber-400">No SSH Key Found</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          For passwordless access, generate an SSH key and add it to your servers.
                          This is optional — you can still connect using credentials or API tokens.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Header + Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Infrastructure Connections</h2>
              <p className="text-sm text-muted-foreground">
                Add your homelab services — Proxmox, Docker, pfSense, NAS, and more.
                You can add multiple instances of any type.
              </p>
            </div>
            <Button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Connection
            </Button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <Card className="border-primary/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {editingId ? "Edit Connection" : "Add New Connection"}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={cancelForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Type + URL */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</div>
                    <span className="text-sm font-medium">Choose type and enter URL</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <Select value={form.type} onValueChange={(v) => updateField("type", v ?? "")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {connectionTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              <span className="flex items-center gap-2">{t.icon} {t.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Host / IP Address</label>
                      <Input
                        placeholder="10.11.12.101 or proxmox.local"
                        value={form.host}
                        onChange={(e) => updateField("host", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Port</label>
                      <Input
                        placeholder="Auto-detected"
                        value={form.port}
                        onChange={(e) => updateField("port", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Name + Monitor Only Toggle */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</div>
                    <span className="text-sm font-medium">Display name and access level</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Display Name</label>
                      <Input
                        placeholder="My Proxmox Node"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <Switch
                        checked={form.monitorOnly}
                        onCheckedChange={(v) => updateField("monitorOnly", v)}
                      />
                      <div>
                        <label className="text-sm font-medium">Monitor only (URL only)</label>
                        <p className="text-xs text-muted-foreground">Skip credentials — just track reachability</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Credentials (conditional) */}
                {!form.monitorOnly && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</div>
                      <span className="text-sm font-medium">Credentials</span>
                      <span className="text-xs text-muted-foreground">(for full management access)</span>
                    </div>
                    {sshKey?.detected && (
                      <div className="flex items-start gap-2 mb-4 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                        <Info className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          SSH key detected — if it&apos;s authorized on this host, you can leave credentials blank and SyncBricks will use key-based auth.
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Username</label>
                        <Input
                          placeholder={form.type === "proxmox" ? "root@pam" : "admin"}
                          value={form.username}
                          onChange={(e) => updateField("username", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={form.password}
                          onChange={(e) => updateField("password", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">API Token</label>
                        <Input
                          placeholder={
                            form.type === "proxmox"
                              ? "user@pam!tokenid=secret-value"
                              : "API key or token"
                          }
                          value={form.apiToken}
                          onChange={(e) => updateField("apiToken", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Recommended over password — most services support API tokens for secure, scoped access.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <Switch
                        checked={form.sslVerify}
                        onCheckedChange={(v) => updateField("sslVerify", v)}
                      />
                      <div>
                        <label className="text-sm font-medium">Verify SSL Certificate</label>
                        <p className="text-xs text-muted-foreground">Disable for self-signed certificates (common in homelabs)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button onClick={handleSave} disabled={!form.name || !form.type || !form.host || saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingId ? "Update Connection" : "Save Connection"}
                  </Button>
                  <Button variant="outline" onClick={cancelForm}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connection List */}
          {conns.length === 0 && !showForm && (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <Server className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-1">No connections yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first infrastructure connection to get started.
                  You can add Proxmox nodes, Docker hosts, firewalls, DNS servers, and more.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Connection
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3">
            {conns.map((conn) => (
              <Card key={conn.id} className="hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        {typeIconMap[conn.type] || <Globe className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{conn.name}</span>
                          <Badge variant="outline" className={typeBadgeColors[conn.type] || "bg-zinc-500/10 text-zinc-400"}>
                            {typeLabelMap[conn.type] || conn.type}
                          </Badge>
                          {!conn.username && !conn.password && !conn.apiToken && (
                            <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20 text-[10px]">
                              Monitor only
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm text-muted-foreground font-mono">
                            {conn.host}{conn.port ? `:${conn.port}` : ""}
                          </span>
                          {testResult[conn.id] && (
                            <div className="flex items-center gap-1">
                              {testResult[conn.id].success ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-red-500" />
                              )}
                              <span className={`text-xs ${testResult[conn.id].success ? "text-emerald-500" : "text-red-500"}`}>
                                {testResult[conn.id].message}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTest(conn)}
                        disabled={testing === conn.id}
                      >
                        {testing === conn.id ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        ) : (
                          <Zap className="h-3.5 w-3.5 mr-1" />
                        )}
                        Test
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(conn)}>
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-500"
                        onClick={() => handleDelete(conn.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Security Notice */}
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-400">Security Notice</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Credentials are stored in the local SQLite database. For production use, ensure your SyncBricks instance is not
                    publicly accessible. Use API tokens with minimal permissions where possible. SSH key authentication is recommended
                    for passwordless, secure access — add your server&apos;s SSH public key to each target host&apos;s <code className="text-xs bg-muted px-1 py-0.5 rounded">authorized_keys</code>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== GENERAL TAB ==================== */}
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

        {/* ==================== NOTIFICATIONS TAB ==================== */}
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

        {/* ==================== AI TAB ==================== */}
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
