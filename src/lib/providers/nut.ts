import type { ProviderConfig, UPSStatus } from "./types";

interface NUTUPSEntry {
  name: string;
  description: string;
}

interface NUTVariable {
  name: string;
  value: string;
}

/**
 * NUT (Network UPS Tools) client.
 *
 * NUT natively uses a line-based TCP protocol on port 3493.
 * This client supports two modes:
 *   1. A REST/HTTP wrapper (e.g. nut-web, nutcase, or a custom bridge)
 *   2. Direct TCP if running in a Node.js environment with net module access
 *
 * By default it targets a REST wrapper at http://{host}:{port}/api.
 */
export class NUTClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private sslVerify: boolean;

  constructor(config: ProviderConfig) {
    const port = config.port ?? 3493;
    this.baseUrl = `http://${config.host}:${port}/api`;
    this.sslVerify = config.sslVerify ?? true;
    this.headers = {
      "Content-Type": "application/json",
    };

    if (config.username && config.password) {
      const credentials = btoa(`${config.username}:${config.password}`);
      this.headers["Authorization"] = `Basic ${credentials}`;
    }
  }

  private async request<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      headers: this.headers,
      // @ts-expect-error -- Node.js extended fetch option for self-signed certs
      rejectUnauthorized: this.sslVerify,
    });

    if (!response.ok) {
      throw new Error(`NUT API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  async getUPSList(): Promise<NUTUPSEntry[]> {
    return this.request<NUTUPSEntry[]>("/ups");
  }

  async getUPSStatus(name: string): Promise<UPSStatus> {
    const vars = await this.request<Record<string, string>>(`/ups/${name}`);
    return {
      model: vars["device.model"] ?? vars["ups.model"] ?? "Unknown",
      status: vars["ups.status"] ?? "unknown",
      batteryCharge: parseFloat(vars["battery.charge"] ?? "0"),
      batteryRuntime: parseFloat(vars["battery.runtime"] ?? "0"),
      load: parseFloat(vars["ups.load"] ?? "0"),
      inputVoltage: parseFloat(vars["input.voltage"] ?? "0"),
      outputVoltage: parseFloat(vars["output.voltage"] ?? "0"),
    };
  }

  async getUPSVariables(name: string): Promise<NUTVariable[]> {
    const vars = await this.request<Record<string, string>>(`/ups/${name}/vars`);
    return Object.entries(vars).map(([key, value]) => ({
      name: key,
      value: String(value),
    }));
  }
}
