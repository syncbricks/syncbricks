import type { ProviderConfig, DNSRecord } from "./types";

interface PiholeSummary {
  domains_being_blocked: number;
  dns_queries_today: number;
  ads_blocked_today: number;
  ads_percentage_today: number;
  unique_domains: number;
  queries_forwarded: number;
  queries_cached: number;
  clients_ever_seen: number;
  unique_clients: number;
  dns_queries_all_types: number;
  reply_NODATA: number;
  reply_NXDOMAIN: number;
  reply_CNAME: number;
  reply_IP: number;
  privacy_level: number;
  status: string;
  gravity_last_updated: {
    file_exists: boolean;
    absolute: number;
    relative: { days: number; hours: number; minutes: number };
  };
}

interface PiholeTopDomains {
  top_queries: Record<string, number>;
  top_ads: Record<string, number>;
}

interface PiholeTopClients {
  top_sources: Record<string, number>;
}

interface PiholeQueryLogEntry {
  timestamp: number;
  type: string;
  domain: string;
  client: string;
  status: string;
  dnssec: string;
  reply: string;
  response_time: number;
}

export class PiholeClient {
  private baseUrl: string;
  private apiToken: string;
  private sslVerify: boolean;

  constructor(config: ProviderConfig) {
    const port = config.port ?? 80;
    const scheme = config.sslVerify !== false && port === 443 ? "https" : "http";
    this.baseUrl = `${scheme}://${config.host}:${port}/admin/api.php`;
    this.apiToken = config.apiToken ?? "";
    this.sslVerify = config.sslVerify ?? true;
  }

  private async request<T>(params: Record<string, string> = {}): Promise<T> {
    const searchParams = new URLSearchParams(params);
    if (this.apiToken) {
      searchParams.set("auth", this.apiToken);
    }

    const url = `${this.baseUrl}?${searchParams}`;
    const response = await fetch(url, {
      // @ts-expect-error -- Node.js extended fetch option for self-signed certs
      rejectUnauthorized: this.sslVerify,
    });

    if (!response.ok) {
      throw new Error(`Pi-hole API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  async getSummary(): Promise<PiholeSummary> {
    return this.request<PiholeSummary>({ summaryRaw: "" });
  }

  async getTopDomains(count = 10): Promise<PiholeTopDomains> {
    return this.request<PiholeTopDomains>({ topItems: String(count) });
  }

  async getTopClients(count = 10): Promise<PiholeTopClients> {
    return this.request<PiholeTopClients>({ topClients: String(count) });
  }

  async getQueryLog(count = 100): Promise<PiholeQueryLogEntry[]> {
    const data = await this.request<{ data: string[][] }>({
      getAllQueries: String(count),
    });
    return data.data.map((entry) => ({
      timestamp: Number(entry[0]),
      type: entry[1],
      domain: entry[2],
      client: entry[3],
      status: entry[4],
      dnssec: entry[5],
      reply: entry[6],
      response_time: Number(entry[7]),
    }));
  }

  async getCustomDNS(): Promise<DNSRecord[]> {
    const data = await this.request<{ data: string[][] }>({
      customdns: "",
      action: "get",
    });
    return data.data.map((entry) => ({
      domain: entry[0],
      ip: entry[1],
      type: "A",
    }));
  }

  async addCustomDNS(domain: string, ip: string): Promise<void> {
    await this.request({
      customdns: "",
      action: "add",
      domain,
      ip,
    });
  }

  async deleteCustomDNS(domain: string, ip: string): Promise<void> {
    await this.request({
      customdns: "",
      action: "delete",
      domain,
      ip,
    });
  }
}
