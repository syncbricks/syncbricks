import type { ProviderConfig, NodeInfo, VMInfo } from "./types";

interface ProxmoxResponse<T> {
  data: T;
}

interface ProxmoxNodeData {
  node: string;
  id: string;
  status: string;
  cpu: number;
  maxcpu: number;
  mem: number;
  maxmem: number;
  disk: number;
  maxdisk: number;
  uptime: number;
}

interface ProxmoxVMData {
  vmid: number;
  name: string;
  status: string;
  type?: string;
  node?: string;
  cpus: number;
  mem: number;
  maxmem: number;
  disk: number;
  maxdisk: number;
  netin?: number;
  netout?: number;
  tags?: string;
}

interface ProxmoxResourceData {
  id: string;
  type: string;
  node: string;
  status: string;
  name?: string;
  vmid?: number;
  cpu?: number;
  maxcpu?: number;
  mem?: number;
  maxmem?: number;
  disk?: number;
  maxdisk?: number;
  uptime?: number;
}

export class ProxmoxClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private sslVerify: boolean;

  constructor(config: ProviderConfig) {
    const port = config.port ?? 8006;
    this.baseUrl = `https://${config.host}:${port}/api2/json`;
    this.sslVerify = config.sslVerify ?? true;
    this.headers = {
      "Content-Type": "application/json",
    };

    if (config.apiToken) {
      // Token format: user@realm!tokenid=secret
      this.headers["Authorization"] = `PVEAPIToken=${config.apiToken}`;
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: { ...this.headers, ...options.headers },
      // @ts-expect-error -- Node.js extended fetch option for self-signed certs
      rejectUnauthorized: this.sslVerify,
    });

    if (!response.ok) {
      throw new Error(`Proxmox API error: ${response.status} ${response.statusText}`);
    }

    const json = (await response.json()) as ProxmoxResponse<T>;
    return json.data;
  }

  async getNodes(): Promise<NodeInfo[]> {
    const nodes = await this.request<ProxmoxNodeData[]>("/nodes");
    return nodes.map((n) => ({
      id: n.id ?? n.node,
      name: n.node,
      status: n.status === "online" ? "online" : n.status === "offline" ? "offline" : "unknown",
      cpuCores: n.maxcpu,
      cpuUsage: n.cpu,
      memoryTotal: n.maxmem,
      memoryUsed: n.mem,
      diskTotal: n.maxdisk,
      diskUsed: n.disk,
      uptime: n.uptime,
    }));
  }

  async getVMs(node: string): Promise<VMInfo[]> {
    const vms = await this.request<ProxmoxVMData[]>(`/nodes/${node}/qemu`);
    return vms.map((vm) => ({
      id: String(vm.vmid),
      name: vm.name,
      status: this.mapVMStatus(vm.status),
      type: "qemu" as const,
      node,
      cpu: vm.cpus,
      memory: vm.maxmem,
      disk: vm.maxdisk,
      tags: vm.tags ? vm.tags.split(";") : undefined,
    }));
  }

  async getContainers(node: string): Promise<VMInfo[]> {
    const cts = await this.request<ProxmoxVMData[]>(`/nodes/${node}/lxc`);
    return cts.map((ct) => ({
      id: String(ct.vmid),
      name: ct.name,
      status: this.mapVMStatus(ct.status),
      type: "lxc" as const,
      node,
      cpu: ct.cpus,
      memory: ct.maxmem,
      disk: ct.maxdisk,
      tags: ct.tags ? ct.tags.split(";") : undefined,
    }));
  }

  async startVM(node: string, vmid: number | string): Promise<string> {
    return this.request<string>(`/nodes/${node}/qemu/${vmid}/status/start`, {
      method: "POST",
    });
  }

  async stopVM(node: string, vmid: number | string): Promise<string> {
    return this.request<string>(`/nodes/${node}/qemu/${vmid}/status/stop`, {
      method: "POST",
    });
  }

  async getNodeStatus(node: string): Promise<NodeInfo> {
    const data = await this.request<ProxmoxNodeData>(`/nodes/${node}/status`);
    return {
      id: data.id ?? node,
      name: node,
      status: data.status === "online" ? "online" : data.status === "offline" ? "offline" : "unknown",
      cpuCores: data.maxcpu,
      cpuUsage: data.cpu,
      memoryTotal: data.maxmem,
      memoryUsed: data.mem,
      diskTotal: data.maxdisk,
      diskUsed: data.disk,
      uptime: data.uptime,
    };
  }

  async getClusterResources(): Promise<ProxmoxResourceData[]> {
    return this.request<ProxmoxResourceData[]>("/cluster/resources");
  }

  private mapVMStatus(status: string): VMInfo["status"] {
    switch (status) {
      case "running":
        return "running";
      case "stopped":
        return "stopped";
      case "paused":
        return "paused";
      default:
        return "unknown";
    }
  }
}
