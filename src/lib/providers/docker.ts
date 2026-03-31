import type { ProviderConfig, ContainerInfo } from "./types";

interface DockerContainerData {
  Id: string;
  Names: string[];
  Image: string;
  State: string;
  Status: string;
  Ports: DockerPort[];
  Created: number;
  Labels: Record<string, string>;
}

interface DockerPort {
  IP?: string;
  PrivatePort: number;
  PublicPort?: number;
  Type: string;
}

interface DockerContainerStats {
  id: string;
  cpu_stats: {
    cpu_usage: { total_usage: number };
    system_cpu_usage: number;
    online_cpus: number;
  };
  precpu_stats: {
    cpu_usage: { total_usage: number };
    system_cpu_usage: number;
  };
  memory_stats: {
    usage: number;
    limit: number;
  };
  networks?: Record<
    string,
    {
      rx_bytes: number;
      tx_bytes: number;
    }
  >;
}

export class DockerClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: ProviderConfig) {
    const port = config.port ?? 2375;
    this.baseUrl = `http://${config.host}:${port}`;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: { ...this.headers, ...options.headers },
    });

    if (!response.ok) {
      throw new Error(`Docker API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  async getContainers(all = true): Promise<ContainerInfo[]> {
    const containers = await this.request<DockerContainerData[]>(
      `/containers/json?all=${all}`
    );
    return containers.map((c) => ({
      id: c.Id.substring(0, 12),
      name: c.Names[0]?.replace(/^\//, "") ?? c.Id.substring(0, 12),
      image: c.Image,
      status: this.mapStatus(c.State),
      ports: this.formatPorts(c.Ports),
      created: new Date(c.Created * 1000).toISOString(),
    }));
  }

  async startContainer(id: string): Promise<void> {
    const url = `${this.baseUrl}/containers/${id}/start`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
    });

    // 204 = success, 304 = already started
    if (!response.ok && response.status !== 304) {
      throw new Error(`Docker API error: ${response.status} ${response.statusText}`);
    }
  }

  async stopContainer(id: string): Promise<void> {
    const url = `${this.baseUrl}/containers/${id}/stop`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
    });

    if (!response.ok && response.status !== 304) {
      throw new Error(`Docker API error: ${response.status} ${response.statusText}`);
    }
  }

  async restartContainer(id: string): Promise<void> {
    const url = `${this.baseUrl}/containers/${id}/restart`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Docker API error: ${response.status} ${response.statusText}`);
    }
  }

  async getContainerLogs(
    id: string,
    options: { tail?: number; since?: number } = {}
  ): Promise<string> {
    const params = new URLSearchParams({
      stdout: "true",
      stderr: "true",
    });
    if (options.tail !== undefined) params.set("tail", String(options.tail));
    if (options.since !== undefined) params.set("since", String(options.since));

    const url = `${this.baseUrl}/containers/${id}/logs?${params}`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(`Docker API error: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  async getContainerStats(id: string): Promise<DockerContainerStats> {
    return this.request<DockerContainerStats>(
      `/containers/${id}/stats?stream=false`
    );
  }

  private mapStatus(state: string): ContainerInfo["status"] {
    switch (state) {
      case "running":
        return "running";
      case "exited":
      case "dead":
        return "exited";
      case "restarting":
        return "restarting";
      case "created":
      case "paused":
        return "stopped";
      default:
        return "unknown";
    }
  }

  private formatPorts(ports: DockerPort[]): string {
    return ports
      .map((p) => {
        if (p.PublicPort) {
          return `${p.IP ?? "0.0.0.0"}:${p.PublicPort}->${p.PrivatePort}/${p.Type}`;
        }
        return `${p.PrivatePort}/${p.Type}`;
      })
      .join(", ");
  }
}
