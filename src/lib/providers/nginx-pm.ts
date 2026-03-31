import type { ProviderConfig, CertificateInfo } from "./types";

interface NginxPMTokenResponse {
  token: string;
  expires: string;
}

interface NginxPMProxyHost {
  id: number;
  created_on: string;
  modified_on: string;
  domain_names: string[];
  forward_host: string;
  forward_port: number;
  forward_scheme: string;
  enabled: number;
  ssl_forced: number;
  hsts_enabled: number;
  http2_support: number;
  block_exploits: number;
  caching_enabled: number;
  certificate_id: number;
  access_list_id: number;
  advanced_config: string;
  meta: Record<string, unknown>;
}

interface NginxPMCertificate {
  id: number;
  created_on: string;
  modified_on: string;
  provider: string;
  nice_name: string;
  domain_names: string[];
  expires_on: string;
  meta: Record<string, unknown>;
}

interface NginxPMStream {
  id: number;
  created_on: string;
  modified_on: string;
  incoming_port: number;
  forwarding_host: string;
  forwarding_port: number;
  tcp_forwarding: number;
  udp_forwarding: number;
  enabled: number;
  meta: Record<string, unknown>;
}

interface NginxPM404Host {
  id: number;
  created_on: string;
  modified_on: string;
  domain_names: string[];
  certificate_id: number;
  ssl_forced: number;
  hsts_enabled: number;
  http2_support: number;
  advanced_config: string;
  enabled: number;
  meta: Record<string, unknown>;
}

interface NginxPMAccessList {
  id: number;
  created_on: string;
  modified_on: string;
  name: string;
  directive: string;
  address: string;
  satisfy_any: number;
  pass_auth: number;
  meta: Record<string, unknown>;
}

export class NginxPMClient {
  private baseUrl: string;
  private sslVerify: boolean;
  private username: string;
  private password: string;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: ProviderConfig) {
    const port = config.port ?? 81;
    const scheme = config.sslVerify !== false && port === 443 ? "https" : "http";
    this.baseUrl = `${scheme}://${config.host}:${port}/api`;
    this.sslVerify = config.sslVerify ?? true;
    this.username = config.username ?? "admin@example.com";
    this.password = config.password ?? "";
  }

  private async authenticate(): Promise<string> {
    if (this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.token;
    }

    const url = `${this.baseUrl}/tokens`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identity: this.username,
        secret: this.password,
      }),
      // @ts-expect-error -- Node.js extended fetch option for self-signed certs
      rejectUnauthorized: this.sslVerify,
    });

    if (!response.ok) {
      throw new Error(`Nginx PM auth error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as NginxPMTokenResponse;
    this.token = data.token;
    this.tokenExpiry = new Date(data.expires);
    return this.token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await this.authenticate();
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      // @ts-expect-error -- Node.js extended fetch option for self-signed certs
      rejectUnauthorized: this.sslVerify,
    });

    if (!response.ok) {
      throw new Error(`Nginx PM API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  async getProxyHosts(): Promise<NginxPMProxyHost[]> {
    return this.request<NginxPMProxyHost[]>("/nginx/proxy-hosts");
  }

  async getCertificates(): Promise<CertificateInfo[]> {
    const certs = await this.request<NginxPMCertificate[]>("/nginx/certificates");
    const now = new Date();
    return certs.map((c) => {
      const expiresOn = new Date(c.expires_on);
      const daysLeft = Math.floor(
        (expiresOn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        domain: c.domain_names[0] ?? c.nice_name,
        issuer: c.provider === "letsencrypt" ? "Let's Encrypt" : c.provider,
        validFrom: c.created_on,
        validUntil: c.expires_on,
        daysLeft,
        autoRenew: c.provider === "letsencrypt",
        source: "nginx-proxy-manager",
      };
    });
  }

  async getStreams(): Promise<NginxPMStream[]> {
    return this.request<NginxPMStream[]>("/nginx/streams");
  }

  async get404Hosts(): Promise<NginxPM404Host[]> {
    return this.request<NginxPM404Host[]>("/nginx/dead-hosts");
  }

  async getAccessLists(): Promise<NginxPMAccessList[]> {
    return this.request<NginxPMAccessList[]>("/nginx/access-lists");
  }
}
