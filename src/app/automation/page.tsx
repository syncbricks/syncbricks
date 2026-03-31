"use client";

import { useState } from "react";
import {
  Workflow,
  Plus,
  Play,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Rocket,
  HeartPulse,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  lastRun: string;
}

const rules: AutomationRule[] = [
  { id: "1", name: "High disk alert", trigger: "Disk usage > 90%", action: "Send webhook notification", enabled: true, lastRun: "10 min ago" },
  { id: "2", name: "Auto-restart failed containers", trigger: "Container exit code != 0", action: "Restart container (max 3 attempts)", enabled: true, lastRun: "2 hours ago" },
  { id: "3", name: "Daily backup trigger", trigger: "Cron: 02:00 daily", action: "Run PBS backup job", enabled: true, lastRun: "6 hours ago" },
  { id: "4", name: "Certificate expiry warning", trigger: "SSL cert expires < 14 days", action: "Send email + renew via ACME", enabled: true, lastRun: "1 day ago" },
  { id: "5", name: "Resource optimization scan", trigger: "Cron: Sunday 03:00", action: "Run AI optimize agent", enabled: false, lastRun: "5 days ago" },
];

interface AgentTask {
  name: string;
  icon: React.ReactNode;
  description: string;
  lastRun: string;
  findings: number;
  status: "idle" | "running" | "completed" | "error";
}

const agents: AgentTask[] = [
  { name: "Health Agent", icon: <HeartPulse className="h-5 w-5" />, description: "Monitors service health and predicts failures", lastRun: "5 min ago", findings: 2, status: "completed" },
  { name: "Optimize Agent", icon: <Cpu className="h-5 w-5" />, description: "Analyzes resource usage and suggests optimizations", lastRun: "3 hours ago", findings: 4, status: "idle" },
  { name: "Security Agent", icon: <ShieldCheck className="h-5 w-5" />, description: "Scans for vulnerabilities and misconfigurations", lastRun: "1 day ago", findings: 1, status: "completed" },
  { name: "Deploy Agent", icon: <Rocket className="h-5 w-5" />, description: "Handles automated deployments and rollbacks", lastRun: "2 days ago", findings: 0, status: "idle" },
];

interface HistoryEntry {
  timestamp: string;
  rule: string;
  result: "success" | "failure";
  details: string;
}

const history: HistoryEntry[] = [
  { timestamp: "2026-03-31 10:42:03", rule: "High disk alert", result: "success", details: "Webhook sent to Discord - Node 1 disk at 91%" },
  { timestamp: "2026-03-31 08:15:22", rule: "Auto-restart failed containers", result: "success", details: "Restarted 'paperless-worker' container (attempt 1/3)" },
  { timestamp: "2026-03-31 02:00:01", rule: "Daily backup trigger", result: "success", details: "PBS backup completed - 14 VMs, 6 LXC containers" },
  { timestamp: "2026-03-30 22:30:45", rule: "Auto-restart failed containers", result: "failure", details: "Container 'portainer' failed after 3 restart attempts" },
  { timestamp: "2026-03-30 14:00:00", rule: "Health Agent", result: "success", details: "All services healthy - 2 warnings noted" },
  { timestamp: "2026-03-30 02:00:01", rule: "Daily backup trigger", result: "success", details: "PBS backup completed - 14 VMs, 6 LXC containers" },
  { timestamp: "2026-03-29 11:20:33", rule: "Certificate expiry warning", result: "success", details: "Renewed wildcard cert for *.lab.local via ACME" },
  { timestamp: "2026-03-28 03:00:00", rule: "Resource optimization scan", result: "success", details: "Found 4 optimization opportunities" },
];


export default function AutomationPage() {
  const [ruleStates, setRuleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(rules.map((r) => [r.id, r.enabled]))
  );

  const toggleRule = (id: string) => {
    setRuleStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Workflow className="h-5 w-5" />}
        title="Automation"
        description="Event-driven automation and AI agents"
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        }
      />

      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="agents">Agent Tasks</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{rule.trigger}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{rule.action}</TableCell>
                    <TableCell>
                      <Switch
                        checked={ruleStates[rule.id]}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{rule.lastRun}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Play className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <Card key={agent.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {agent.icon}
                    </div>
                    <Badge
                      variant={agent.status === "error" ? "destructive" : agent.status === "running" ? "default" : "secondary"}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-3">{agent.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{agent.lastRun}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <span className="font-medium">{agent.findings} findings</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Play className="h-3 w-3 mr-1" />
                    Run Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Rule / Agent</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                      {entry.timestamp}
                    </TableCell>
                    <TableCell className="font-medium">{entry.rule}</TableCell>
                    <TableCell>
                      {entry.result === "success" ? (
                        <div className="flex items-center gap-1 text-emerald-500">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm">Success</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-500">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">Failure</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
