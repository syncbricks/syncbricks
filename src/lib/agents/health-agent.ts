import type { Agent, AgentFinding } from "./types";

const CPU_WARNING_THRESHOLD = 80;
const CPU_CRITICAL_THRESHOLD = 95;
const MEMORY_WARNING_THRESHOLD = 85;
const MEMORY_CRITICAL_THRESHOLD = 95;
const DISK_WARNING_THRESHOLD = 80;
const DISK_CRITICAL_THRESHOLD = 90;

export class HealthAgent implements Agent {
  name = "Health Agent";
  description = "Monitors service health, CPU/memory thresholds, and disk usage";

  async analyze(context: Record<string, unknown>): Promise<AgentFinding[]> {
    const findings: AgentFinding[] = [];

    // Analyze nodes
    const nodes = context.nodes as Array<{
      name: string;
      cpuUsage: number;
      memoryUsed: number;
      memoryTotal: number;
      diskUsed: number;
      diskTotal: number;
      uptime: number;
      status: string;
    }> | undefined;

    if (nodes) {
      for (const node of nodes) {
        // Check node status
        if (node.status === "offline") {
          findings.push({
            severity: "critical",
            title: `Node ${node.name} is offline`,
            description: `The node ${node.name} is not responding. All VMs and containers on this node are unavailable.`,
            recommendation: "Check physical connectivity, power status, and IPMI/iDRAC for hardware issues.",
          });
          continue;
        }

        // Check CPU usage
        if (node.cpuUsage >= CPU_CRITICAL_THRESHOLD) {
          findings.push({
            severity: "critical",
            title: `Critical CPU usage on ${node.name}`,
            description: `CPU usage is at ${node.cpuUsage}%, exceeding the ${CPU_CRITICAL_THRESHOLD}% critical threshold.`,
            recommendation: "Consider migrating VMs to other nodes or scaling down workloads.",
          });
        } else if (node.cpuUsage >= CPU_WARNING_THRESHOLD) {
          findings.push({
            severity: "warning",
            title: `High CPU usage on ${node.name}`,
            description: `CPU usage is at ${node.cpuUsage}%, exceeding the ${CPU_WARNING_THRESHOLD}% warning threshold.`,
            recommendation: "Monitor for sustained high usage and consider load balancing.",
          });
        }

        // Check memory usage
        const memoryPercent = node.memoryTotal > 0
          ? (node.memoryUsed / node.memoryTotal) * 100
          : 0;

        if (memoryPercent >= MEMORY_CRITICAL_THRESHOLD) {
          findings.push({
            severity: "critical",
            title: `Critical memory usage on ${node.name}`,
            description: `Memory usage is at ${memoryPercent.toFixed(1)}% (${node.memoryUsed} / ${node.memoryTotal} GB).`,
            recommendation: "Immediately free memory by stopping non-essential VMs or adding more RAM.",
          });
        } else if (memoryPercent >= MEMORY_WARNING_THRESHOLD) {
          findings.push({
            severity: "warning",
            title: `High memory usage on ${node.name}`,
            description: `Memory usage is at ${memoryPercent.toFixed(1)}% (${node.memoryUsed} / ${node.memoryTotal} GB).`,
            recommendation: "Review VM memory allocations and consider right-sizing over-provisioned VMs.",
          });
        }

        // Check disk usage
        const diskPercent = node.diskTotal > 0
          ? (node.diskUsed / node.diskTotal) * 100
          : 0;

        if (diskPercent >= DISK_CRITICAL_THRESHOLD) {
          findings.push({
            severity: "critical",
            title: `Critical disk usage on ${node.name}`,
            description: `Disk usage is at ${diskPercent.toFixed(1)}%, exceeding the ${DISK_CRITICAL_THRESHOLD}% critical threshold.`,
            recommendation: "Clean up old snapshots, templates, and ISOs. Consider expanding storage.",
          });
        } else if (diskPercent >= DISK_WARNING_THRESHOLD) {
          findings.push({
            severity: "warning",
            title: `High disk usage on ${node.name}`,
            description: `Disk usage is at ${diskPercent.toFixed(1)}%, exceeding the ${DISK_WARNING_THRESHOLD}% warning threshold.`,
            recommendation: "Review and remove unused VM disks, old backups, and orphaned data.",
          });
        }

        // Check uptime (very long uptime may mean missed updates)
        const uptimeDays = node.uptime / 86400;
        if (uptimeDays > 90) {
          findings.push({
            severity: "info",
            title: `Extended uptime on ${node.name}`,
            description: `Node has been running for ${Math.floor(uptimeDays)} days without a reboot.`,
            recommendation: "Consider scheduling maintenance for kernel updates and security patches.",
          });
        }
      }
    }

    // Analyze services/containers
    const containers = context.containers as Array<{
      name: string;
      status: string;
    }> | undefined;

    if (containers) {
      const exitedContainers = containers.filter(
        (c) => c.status === "exited" || c.status === "stopped"
      );

      if (exitedContainers.length > 0) {
        findings.push({
          severity: "warning",
          title: `${exitedContainers.length} container(s) not running`,
          description: `The following containers are stopped or exited: ${exitedContainers.map((c) => c.name).join(", ")}.`,
          recommendation: "Review container logs and restart if needed, or remove if no longer required.",
        });
      }
    }

    // Analyze backup status
    const backups = context.backups as {
      jobs: Array<{ target: string; status: string }>;
    } | undefined;

    if (backups?.jobs) {
      const failedBackups = backups.jobs.filter((j) => j.status === "failed");
      if (failedBackups.length > 0) {
        findings.push({
          severity: "critical",
          title: `${failedBackups.length} backup job(s) failed`,
          description: `Failed backups: ${failedBackups.map((j) => j.target).join(", ")}.`,
          recommendation: "Check backup target connectivity, available space, and service credentials.",
        });
      }
    }

    return findings;
  }
}
