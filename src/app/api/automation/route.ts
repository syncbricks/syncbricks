import { NextResponse } from "next/server";

const rules = [
  { id: "1", name: "High disk alert", trigger: "Disk usage > 90%", action: "Send webhook notification", enabled: true, lastRun: "10 min ago" },
  { id: "2", name: "Auto-restart failed containers", trigger: "Container exit code != 0", action: "Restart container (max 3 attempts)", enabled: true, lastRun: "2 hours ago" },
  { id: "3", name: "Daily backup trigger", trigger: "Cron: 02:00 daily", action: "Run PBS backup job", enabled: true, lastRun: "6 hours ago" },
  { id: "4", name: "Certificate expiry warning", trigger: "SSL cert expires < 14 days", action: "Send email + renew via ACME", enabled: true, lastRun: "1 day ago" },
  { id: "5", name: "Resource optimization scan", trigger: "Cron: Sunday 03:00", action: "Run AI optimize agent", enabled: false, lastRun: "5 days ago" },
];

const agentTasks = [
  { name: "Health Agent", description: "Monitors service health and predicts failures", lastRun: "5 min ago", findings: 2, status: "completed" },
  { name: "Optimize Agent", description: "Analyzes resource usage and suggests optimizations", lastRun: "3 hours ago", findings: 4, status: "idle" },
  { name: "Security Agent", description: "Scans for vulnerabilities and misconfigurations", lastRun: "1 day ago", findings: 1, status: "completed" },
  { name: "Deploy Agent", description: "Handles automated deployments and rollbacks", lastRun: "2 days ago", findings: 0, status: "idle" },
];

const history = [
  { timestamp: "2026-03-31 10:42:03", rule: "High disk alert", result: "success", details: "Webhook sent to Discord - Node 1 disk at 91%" },
  { timestamp: "2026-03-31 08:15:22", rule: "Auto-restart failed containers", result: "success", details: "Restarted 'paperless-worker' container (attempt 1/3)" },
  { timestamp: "2026-03-31 02:00:01", rule: "Daily backup trigger", result: "success", details: "PBS backup completed - 14 VMs, 6 LXC containers" },
  { timestamp: "2026-03-30 22:30:45", rule: "Auto-restart failed containers", result: "failure", details: "Container 'portainer' failed after 3 restart attempts" },
  { timestamp: "2026-03-30 14:00:00", rule: "Health Agent", result: "success", details: "All services healthy - 2 warnings noted" },
  { timestamp: "2026-03-30 02:00:01", rule: "Daily backup trigger", result: "success", details: "PBS backup completed - 14 VMs, 6 LXC containers" },
  { timestamp: "2026-03-29 11:20:33", rule: "Certificate expiry warning", result: "success", details: "Renewed wildcard cert for *.lab.local via ACME" },
  { timestamp: "2026-03-28 03:00:00", rule: "Resource optimization scan", result: "success", details: "Found 4 optimization opportunities" },
];

export async function GET() {
  return NextResponse.json({ rules, agentTasks, history });
}
