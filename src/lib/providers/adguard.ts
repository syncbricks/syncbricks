import type { ProviderConfig, DNSRecord } from "./types";

interface AdGuardStatus {
  dns_addresses: string[];
  dns_port: number;
  http_port: number;
  protection_enabled: boolean;
  running: boolean;
  version: string;
  language: string;
}

interface AdGuardStats {
  num_dns_queries: number;
  num_blocked_filtering: number;
  num_replaced_safebrowsing: number;
  num_replaced_safesearch: number;
  num_replaced_parental: number;
  avg_processing_time: number;
  top_queried_domains: Record<string, number>[];
  top_clients: Record<string, number>[];
  top_blocked_domains: Record<string, number>[];
  dns_queries_count: number[];
  blocked_filtering_count: number[];
  time_units: string;
}

interface AdGuardQueryLogEntry {
  answer: Array<{ value: string; type: string; ttl: number }>;
  client: string;
  client_proto: string;
  elapsedMs: string;
  question: { class: string; host: string; type: string };
  reason: string;
  status: string;
  time: string;
  filterId?: number;
  rule?: string;
}

interface AdGuardQueryLog {
  data: AdGuardQueryLogEntry[];
  oldest: string;
}

interface AdGuardFilteringRule {
  url: string;
  name: string;
  enabled: boolean;
  id: number;
  rules_count: number;
  last_updated: string;
}

interface AdGuardFilteringStatus {
  enabled: boolean;
  filters: AdGuardFilteringRule[];
  whitelist_filters: AdGuardFilteringRule[];
  user_rules: string[];
  interval: number;
}

interface AdGuardDNSRewrite {
  domain: string;
  answer: string;
}

export class AdGuardClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private sslVerify: boolean;

  constructor(config: ProviderConfig) {
    const port = config.port ?? 3000;
    const scheme = config.sslVerify !== false && port === 443 ? "https" : "http";
    this.baseUrl = `${scheme}://${config.host}:${port}/control`;
    this.sslVerify = config.sslVerify ?? true;
    this.headers = {
      "Content-Type": "application/json",
    };

    if (config.username && config.password) {
      const credentials = btoa(`${config.username}:${config.password}`);
      this.headers["Authorization"] = `Basic ${credentials}`;
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
      throw new Error(`AdGuard API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  async getStatus(): Promise<AdGuardStatus> {
    return this.request<AdGuardStatus>("/status");
  }

  async getStats(): Promise<AdGuardStats> {
    return this.request<AdGuardStats>("/stats");
  }

  async getQueryLog(limit = 100): Promise<AdGuardQueryLog> {
    return this.request<AdGuardQueryLog>(`/querylog?limit=${limit}`);
  }

  async getFilteringRules(): Promise<AdGuardFilteringStatus> {
    return this.request<AdGuardFilteringStatus>("/filtering/status");
  }

  async getDNSRewrites(): Promise<DNSRecord[]> {
    const rewrites = await this.request<AdGuardDNSRewrite[]>("/rewrite/list");
    return rewrites.map((r) => ({
      domain: r.domain,
      ip: r.answer,
      type: "A",
    }));
  }

  async addDNSRewrite(domain: string, answer: string): Promise<void> {
    await this.request("/rewrite/add", {
      method: "POST",
      body: JSON.stringify({ domain, answer }),
    });
  }

  async deleteDNSRewrite(domain: string, answer: string): Promise<void> {
    await this.request("/rewrite/delete", {
      method: "POST",
      body: JSON.stringify({ domain, answer }),
    });
  }
}
