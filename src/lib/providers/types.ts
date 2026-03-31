export interface ProviderConfig {
  host: string;
  port?: number;
  username?: string;
  password?: string;
  apiToken?: string;
  sslVerify?: boolean;
}

export interface NodeInfo {
  id: string;
  name: string;
  status: "online" | "offline" | "unknown";
  cpuCores: number;
  cpuUsage: number;
  memoryTotal: number;
  memoryUsed: number;
  diskTotal: number;
  diskUsed: number;
  uptime: number;
}

export interface VMInfo {
  id: string;
  name: string;
  status: "running" | "stopped" | "paused" | "unknown";
  type: "qemu" | "lxc";
  node: string;
  cpu: number;
  memory: number;
  disk: number;
  ipAddress?: string;
  os?: string;
  tags?: string[];
}

export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  status: "running" | "stopped" | "restarting" | "exited" | "unknown";
  ports: string;
  created: string;
}

export interface FirewallRule {
  id: number;
  action: "pass" | "block" | "reject";
  protocol: string;
  source: string;
  destination: string;
  port: string;
  description: string;
}

export interface DNSRecord {
  domain: string;
  ip: string;
  type: string;
}

export interface StoragePool {
  name: string;
  status: string;
  totalSize: number;
  usedSize: number;
  type: string;
  disks: DiskInfo[];
}

export interface DiskInfo {
  name: string;
  model: string;
  serial: string;
  temperature: number;
  health: string;
  size: number;
}

export interface UPSStatus {
  model: string;
  status: string;
  batteryCharge: number;
  batteryRuntime: number;
  load: number;
  inputVoltage: number;
  outputVoltage: number;
}

export interface CertificateInfo {
  domain: string;
  issuer: string;
  validFrom: string;
  validUntil: string;
  daysLeft: number;
  autoRenew: boolean;
  source: string;
}
