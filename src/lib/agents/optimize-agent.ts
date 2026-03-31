import type { Agent, AgentFinding } from "./types";

export class OptimizeAgent implements Agent {
  name = "Optimize Agent";
  description = "Analyzes resource usage and suggests right-sizing and optimization opportunities";

  async analyze(context: Record<string, unknown>): Promise<AgentFinding[]> {
    const findings: AgentFinding[] = [];

    // Analyze VMs for over-allocation
    const vms = context.vms as Array<{
      name: string;
      cpu: number;
      memory: number;
      disk: number;
      status: string;
      type: string;
      node: string;
    }> | undefined;

    if (vms) {
      // Detect stopped VMs still consuming disk
      const stoppedVMs = vms.filter((vm) => vm.status === "stopped");
      if (stoppedVMs.length > 0) {
        const totalDiskWasted = stoppedVMs.reduce((sum, vm) => sum + vm.disk, 0);
        findings.push({
          severity: "info",
          title: `${stoppedVMs.length} stopped VM(s) consuming disk space`,
          description: `Stopped VMs (${stoppedVMs.map((v) => v.name).join(", ")}) are using ${(totalDiskWasted / 1024).toFixed(1)} GB of disk space.`,
          recommendation: "Consider removing VMs that are no longer needed, or convert them to templates.",
        });
      }

      // Detect VMs with potentially over-allocated memory
      const highMemoryVMs = vms.filter(
        (vm) => vm.status === "running" && vm.memory >= 16384
      );
      if (highMemoryVMs.length > 0) {
        findings.push({
          severity: "info",
          title: `${highMemoryVMs.length} VM(s) with 16GB+ memory allocation`,
          description: `VMs with high memory allocations: ${highMemoryVMs.map((v) => `${v.name} (${(v.memory / 1024).toFixed(0)} GB)`).join(", ")}.`,
          recommendation: "Review actual memory usage via monitoring. Consider enabling memory ballooning or reducing allocation if usage is consistently low.",
        });
      }

      // Check for CPU over-provisioning per node
      const nodeMap = new Map<string, { totalCpu: number; vmCount: number }>();
      for (const vm of vms.filter((v) => v.status === "running")) {
        const existing = nodeMap.get(vm.node) || { totalCpu: 0, vmCount: 0 };
        existing.totalCpu += vm.cpu;
        existing.vmCount += 1;
        nodeMap.set(vm.node, existing);
      }

      const nodes = context.nodes as Array<{
        name: string;
        cpuCores: number;
      }> | undefined;

      if (nodes) {
        for (const node of nodes) {
          const allocated = nodeMap.get(node.name);
          if (allocated && allocated.totalCpu > node.cpuCores * 2) {
            findings.push({
              severity: "warning",
              title: `CPU over-provisioned on ${node.name}`,
              description: `${allocated.totalCpu} vCPUs allocated across ${allocated.vmCount} VMs, but node only has ${node.cpuCores} physical cores (${((allocated.totalCpu / node.cpuCores) * 100).toFixed(0)}% ratio).`,
              recommendation: "High over-provisioning ratios can cause CPU contention. Consider migrating some VMs to less loaded nodes.",
            });
          }
        }
      }
    }

    // Analyze containers for optimization
    const containers = context.containers as Array<{
      name: string;
      status: string;
      image: string;
      created: string;
    }> | undefined;

    if (containers) {
      // Detect containers with old images
      const staleContainers = containers.filter((c) => {
        if (!c.created) return false;
        const created = new Date(c.created);
        const now = new Date();
        const daysSinceCreation =
          (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceCreation > 90;
      });

      if (staleContainers.length > 0) {
        findings.push({
          severity: "info",
          title: `${staleContainers.length} container(s) with images older than 90 days`,
          description: `Containers that may need image updates: ${staleContainers.map((c) => c.name).join(", ")}.`,
          recommendation: "Review and update container images for security patches and bug fixes. Use Watchtower or similar for automated updates.",
        });
      }
    }

    // Analyze storage waste
    const storage = context.storage as {
      pools: Array<{
        name: string;
        totalSize: number;
        usedSize: number;
      }>;
      datasets: Array<{
        name: string;
        compression: string;
      }>;
    } | undefined;

    if (storage?.datasets) {
      const uncompressed = storage.datasets.filter(
        (d) => d.compression === "off"
      );
      if (uncompressed.length > 0) {
        findings.push({
          severity: "info",
          title: `${uncompressed.length} dataset(s) without compression`,
          description: `Datasets without compression enabled: ${uncompressed.map((d) => d.name).join(", ")}.`,
          recommendation: "Enable LZ4 or ZSTD compression on datasets to save disk space with minimal CPU overhead.",
        });
      }
    }

    return findings;
  }
}
