import type { ProviderConfig, StoragePool, DiskInfo } from "./types";

interface TrueNASPool {
  id: number;
  name: string;
  path: string;
  status: string;
  healthy: boolean;
  topology: {
    data: TrueNASVDev[];
    cache: TrueNASVDev[];
    log: TrueNASVDev[];
    spare: TrueNASVDev[];
  };
  size: number;
  allocated: number;
  free: number;
}

interface TrueNASVDev {
  name: string;
  type: string;
  status: string;
  children: TrueNASVDev[];
  disk?: string;
}

interface TrueNASDataset {
  id: string;
  name: string;
  pool: string;
  type: string;
  mountpoint: string;
  used: { parsed: number; rawvalue: string };
  available: { parsed: number; rawvalue: string };
  quota: { parsed: number | null; rawvalue: string };
  compression: { value: string };
  readonly: { value: boolean };
  comments: { value: string };
}

interface TrueNASDisk {
  identifier: string;
  name: string;
  model: string;
  serial: string;
  size: number;
  type: string;
  temperature: number | null;
  hddstandby: string;
  advpowermgmt: string;
  pool: string | null;
}

interface TrueNASSnapshot {
  id: string;
  name: string;
  dataset: string;
  snapshot_name: string;
  properties: {
    creation: { parsed: string; rawvalue: string };
    used: { parsed: number; rawvalue: string };
    referenced: { parsed: number; rawvalue: string };
  };
}

interface TrueNASSMARTData {
  disk: string;
  temperature: number;
  tests: Array<{
    num: number;
    description: string;
    status: string;
    remaining: number;
    lifetime: number;
  }>;
  attrs: Array<{
    id: number;
    name: string;
    value: number;
    worst: number;
    thresh: number;
    raw: string;
    flags: string;
  }>;
}

interface TrueNASAlert {
  id: string;
  node: string;
  source: string;
  klass: string;
  level: string;
  formatted: string;
  datetime: string;
  dismissed: boolean;
}

export class TrueNASClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private sslVerify: boolean;

  constructor(config: ProviderConfig) {
    const port = config.port ?? 443;
    const scheme = port === 80 ? "http" : "https";
    this.baseUrl = `${scheme}://${config.host}:${port}/api/v2.0`;
    this.sslVerify = config.sslVerify ?? true;
    this.headers = {
      "Content-Type": "application/json",
    };

    if (config.apiToken) {
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
      throw new Error(`TrueNAS API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  async getPools(): Promise<StoragePool[]> {
    const pools = await this.request<TrueNASPool[]>("/pool");
    return pools.map((p) => ({
      name: p.name,
      status: p.status,
      totalSize: p.size,
      usedSize: p.allocated,
      type: this.getPoolType(p),
      disks: this.extractDisks(p),
    }));
  }

  async getDatasets(): Promise<TrueNASDataset[]> {
    return this.request<TrueNASDataset[]>("/pool/dataset");
  }

  async getDisks(): Promise<DiskInfo[]> {
    const disks = await this.request<TrueNASDisk[]>("/disk");
    return disks.map((d) => ({
      name: d.name,
      model: d.model,
      serial: d.serial,
      temperature: d.temperature ?? 0,
      health: "UNKNOWN",
      size: d.size,
    }));
  }

  async getSnapshots(): Promise<TrueNASSnapshot[]> {
    return this.request<TrueNASSnapshot[]>("/zfs/snapshot");
  }

  async getSMARTData(disk: string): Promise<TrueNASSMARTData> {
    return this.request<TrueNASSMARTData>(`/smart/test/results?disk=${disk}`);
  }

  async getAlerts(): Promise<TrueNASAlert[]> {
    return this.request<TrueNASAlert[]>("/alert/list");
  }

  private getPoolType(pool: TrueNASPool): string {
    const dataVDevs = pool.topology.data;
    if (dataVDevs.length === 0) return "unknown";
    const firstVDev = dataVDevs[0];
    if (firstVDev.type === "MIRROR") return "mirror";
    if (firstVDev.type === "RAIDZ1") return "raidz1";
    if (firstVDev.type === "RAIDZ2") return "raidz2";
    if (firstVDev.type === "RAIDZ3") return "raidz3";
    if (firstVDev.type === "STRIPE" || firstVDev.children.length === 0) return "stripe";
    return firstVDev.type.toLowerCase();
  }

  private extractDisks(pool: TrueNASPool): DiskInfo[] {
    const disks: DiskInfo[] = [];
    const extractFromVDevs = (vdevs: TrueNASVDev[]) => {
      for (const vdev of vdevs) {
        if (vdev.disk) {
          disks.push({
            name: vdev.disk,
            model: "",
            serial: "",
            temperature: 0,
            health: vdev.status,
            size: 0,
          });
        }
        if (vdev.children) {
          extractFromVDevs(vdev.children);
        }
      }
    };
    extractFromVDevs(pool.topology.data);
    return disks;
  }
}
