import type { ProviderConfig, FirewallRule } from "./types";

interface PfSenseInterface {
  name: string;
  descr: string;
  status: string;
  ipaddr: string;
  subnet: string;
  mac: string;
  media: string;
  gateway: string;
  inbytes: number;
  outbytes: number;
}

interface PfSenseGateway {
  name: string;
  monitor: string;
  gateway: string;
  status: string;
  delay: string;
  stddev: string;
  loss: string;
}

interface PfSenseSystemInfo {
  hostname: string;
  domain: string;
  version: string;
  cpu_type: string;
  cpu_count: number;
  cpu_usage: number;
  memory_total: number;
  memory_used: number;
  uptime: string;
  temperature: number;
}

interface PfSenseFirewallRule {
  id: number;
  type: string;
  interface: string;
  ipprotocol: string;
  protocol: string;
  source: string;
  destination: string;
  dstport: string;
  descr: string;
}

interface PfSenseDHCPLease {
  ip: string;
  mac: string;
  hostname: string;
  start: string;
  end: string;
  online: boolean;
  descr: string;
}

export class PfSenseClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private sslVerify: boolean;

  constructor(config: ProviderConfig) {
    const port = config.port ?? 443;
    const scheme = port === 80 ? "http" : "https";
    this.baseUrl = `${scheme}://${config.host}:${port}/api/v1`;
    this.sslVerify = config.sslVerify ?? true;
    this.headers = {
      "Content-Type": "application/json",
    };

    if (config.apiToken && config.username) {
      // pfSense API uses client-id / client-token headers
      this.headers["Authorization"] = `${config.username} ${config.apiToken}`;
    } else if (config.apiToken) {
      this.headers["Authorization"] = `Bearer ${config.apiToken}`;
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
      throw new Error(`pfSense API error: ${response.status} ${response.statusText}`);
    }

    const json = (await response.json()) as { data: T };
    return json.data;
  }

  async getInterfaces(): Promise<PfSenseInterface[]> {
    return this.request<PfSenseInterface[]>("/interface");
  }

  async getFirewallRules(): Promise<FirewallRule[]> {
    const rules = await this.request<PfSenseFirewallRule[]>("/firewall/rule");
    return rules.map((r) => ({
      id: r.id,
      action: r.type === "pass" ? "pass" : r.type === "block" ? "block" : "reject",
      protocol: r.protocol ?? r.ipprotocol,
      source: r.source,
      destination: r.destination,
      port: r.dstport,
      description: r.descr,
    }));
  }

  async getGateways(): Promise<PfSenseGateway[]> {
    return this.request<PfSenseGateway[]>("/routing/gateway");
  }

  async getSystemInfo(): Promise<PfSenseSystemInfo> {
    return this.request<PfSenseSystemInfo>("/system/info");
  }

  async getDHCPLeases(): Promise<PfSenseDHCPLease[]> {
    return this.request<PfSenseDHCPLease[]>("/services/dhcpd/lease");
  }
}
