import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const connections = sqliteTable("connections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type", {
    enum: [
      "proxmox",
      "pfsense",
      "opnsense",
      "docker",
      "pihole",
      "adguard",
      "truenas",
      "nut",
      "nginx-pm",
      "traefik",
    ],
  }).notNull(),
  host: text("host").notNull(),
  port: integer("port"),
  username: text("username"),
  password: text("password"),
  apiToken: text("api_token"),
  sslVerify: integer("ssl_verify", { mode: "boolean" }).default(false),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const nodes = sqliteTable("nodes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  connectionId: integer("connection_id").notNull().references(() => connections.id),
  externalId: text("external_id").notNull(),
  name: text("name").notNull(),
  status: text("status", { enum: ["online", "offline", "unknown"] }).default("unknown"),
  cpuCores: integer("cpu_cores"),
  cpuUsage: real("cpu_usage"),
  memoryTotal: integer("memory_total"),
  memoryUsed: integer("memory_used"),
  diskTotal: integer("disk_total"),
  diskUsed: integer("disk_used"),
  uptime: integer("uptime"),
  lastSyncedAt: text("last_synced_at"),
});

export const virtualMachines = sqliteTable("virtual_machines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nodeId: integer("node_id").notNull().references(() => nodes.id),
  externalId: text("external_id").notNull(),
  name: text("name").notNull(),
  status: text("status", { enum: ["running", "stopped", "paused", "unknown"] }).default("unknown"),
  type: text("type", { enum: ["qemu", "lxc"] }).notNull(),
  cpu: integer("cpu"),
  memory: integer("memory"),
  disk: integer("disk"),
  ipAddress: text("ip_address"),
  os: text("os"),
  tags: text("tags"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  lastSyncedAt: text("last_synced_at"),
});

export const containers = sqliteTable("containers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  connectionId: integer("connection_id").notNull().references(() => connections.id),
  externalId: text("external_id").notNull(),
  name: text("name").notNull(),
  image: text("image"),
  status: text("status", { enum: ["running", "stopped", "restarting", "exited", "unknown"] }).default("unknown"),
  ports: text("ports"),
  volumes: text("volumes"),
  network: text("network"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  lastSyncedAt: text("last_synced_at"),
});

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url"),
  type: text("type"),
  status: text("status", { enum: ["up", "down", "degraded", "unknown"] }).default("unknown"),
  healthCheckUrl: text("health_check_url"),
  icon: text("icon"),
  category: text("category"),
  connectionId: integer("connection_id").references(() => connections.id),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const devices = sqliteTable("devices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  ipAddress: text("ip_address"),
  macAddress: text("mac_address"),
  type: text("type", {
    enum: ["server", "switch", "router", "ap", "iot", "workstation", "other"],
  }).default("other"),
  location: text("location"),
  manufacturer: text("manufacturer"),
  model: text("model"),
  notes: text("notes"),
  lastSeenAt: text("last_seen_at"),
});

export const alerts = sqliteTable("alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  source: text("source").notNull(),
  severity: text("severity", { enum: ["info", "warning", "critical"] }).notNull(),
  title: text("title").notNull(),
  message: text("message"),
  acknowledged: integer("acknowledged", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const backups = sqliteTable("backups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  connectionId: integer("connection_id").references(() => connections.id),
  targetName: text("target_name").notNull(),
  targetType: text("target_type"),
  status: text("status", { enum: ["success", "failed", "running", "pending"] }).default("pending"),
  size: integer("size"),
  duration: integer("duration"),
  startedAt: text("started_at"),
  completedAt: text("completed_at"),
});

export const certificates = sqliteTable("certificates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  domain: text("domain").notNull(),
  issuer: text("issuer"),
  validFrom: text("valid_from"),
  validUntil: text("valid_until"),
  autoRenew: integer("auto_renew", { mode: "boolean" }).default(false),
  source: text("source"),
  lastCheckedAt: text("last_checked_at"),
});

export const automationRules = sqliteTable("automation_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  triggerType: text("trigger_type").notNull(),
  triggerConfig: text("trigger_config"),
  actionType: text("action_type").notNull(),
  actionConfig: text("action_config"),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  lastRunAt: text("last_run_at"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value"),
  category: text("category"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});
