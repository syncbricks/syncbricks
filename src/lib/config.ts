export const config = {
  app: {
    name: "SyncBricks",
    description: "Agentic Homelab Management Platform",
    version: "0.1.0",
  },
  proxmox: {
    node1: {
      host: process.env.PROXMOX_NODE1_HOST || "",
      user: process.env.PROXMOX_NODE1_USER || "root@pam",
      tokenId: process.env.PROXMOX_NODE1_API_TOKEN_ID || "",
      tokenSecret: process.env.PROXMOX_NODE1_API_TOKEN_SECRET || "",
    },
    node2: {
      host: process.env.PROXMOX_NODE2_HOST || "",
      user: process.env.PROXMOX_NODE2_USER || "root@pam",
      tokenId: process.env.PROXMOX_NODE2_API_TOKEN_ID || "",
      tokenSecret: process.env.PROXMOX_NODE2_API_TOKEN_SECRET || "",
    },
  },
  pfsense: {
    host: process.env.PFSENSE_HOST || "",
    user: process.env.PFSENSE_USER || "admin",
    apiKey: process.env.PFSENSE_API_KEY || "",
    apiSecret: process.env.PFSENSE_API_SECRET || "",
  },
  network: {
    subnet: process.env.HOMELAB_SUBNET || "10.11.12.0/24",
    gateway: process.env.HOMELAB_GATEWAY || "",
    dnsPrimary: process.env.HOMELAB_DNS_PRIMARY || "",
    dnsSecondary: process.env.HOMELAB_DNS_SECONDARY || "",
    domain: process.env.HOMELAB_DOMAIN || "",
  },
};
