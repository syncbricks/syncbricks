# SyncBricks

**The Agentic Homelab & IT Infrastructure Management Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

SyncBricks is an open-source, AI-powered web application that gives you a **single pane of glass** to monitor and manage your entire homelab and IT infrastructure. Stop juggling 15+ web UIs — manage Proxmox, Docker, pfSense, DNS, storage, backups, certificates, and more from one beautiful, unified dashboard.

> **"AI Agents Built by Operators, Not Just Technologists"**

## Why SyncBricks?

Every homelab enthusiast and IT professional faces the same problem: **tool fragmentation**. You have Proxmox for VMs, Portainer for Docker, pfSense for firewall, Pi-hole for DNS, Grafana for monitoring, Uptime Kuma for health checks, TrueNAS for storage — each with its own web UI, credentials, and quirks.

SyncBricks solves this by providing:
- **One dashboard** to see everything at a glance
- **Real management** — not just links, but actual control over your infrastructure
- **AI-powered agents** that analyze health, optimize resources, and flag security issues
- **Privacy-first** — runs entirely on your infrastructure with local LLM support

## Features

### Infrastructure Management
- **Proxmox Nodes** — Multi-node management, VM/LXC lifecycle control, resource monitoring
- **Virtual Machines** — Cross-node VM management with start/stop/snapshot/migrate
- **Docker Containers** — Manage containers across all Docker hosts with log access
- **Service Catalog** — One-click deployment of popular homelab apps (Plex, *arr stack, Nextcloud, etc.)

### Networking & Security
- **Network & Firewall** — pfSense/OPNsense integration, interface status, firewall rules, VLAN overview
- **DNS Management** — Pi-hole / AdGuard Home integration, query logs, blocklist management, local DNS
- **Certificate Tracking** — SSL/TLS expiry monitoring, auto-renewal status, alerts before certificates expire
- **Device Inventory** — IPAM with auto-discovery, MAC tracking, device categorization

### Operations
- **Storage & NAS** — TrueNAS integration, ZFS pool health, SMART data, snapshot management
- **Backup Management** — Unified status across Proxmox Backup Server, Restic, and Borg
- **Power Management** — UPS monitoring via NUT, battery status, load tracking, shutdown orchestration
- **Centralized Logs** — Aggregated log viewer across all services with filtering and search

### Intelligent Automation
- **Health Agent** — Analyzes resource usage, predicts failures, checks service uptime
- **Optimize Agent** — Identifies over-allocated VMs, under-utilized containers, right-sizing recommendations
- **Security Agent** — Reviews firewall rules, checks certificate expiry, audits for default credentials
- **Event-Driven Rules** — Automated responses: "When disk > 90%, alert me", "Auto-restart failed containers"
- **Local LLM Support** — Privacy-first AI with Ollama integration, zero cloud dependency

## Quick Start

### Using Docker (Recommended)

```bash
git clone https://github.com/syncbricks/syncbricks.git
cd syncbricks
cp .env.example .env
# Edit .env with your infrastructure details
docker compose up -d
```

Open http://localhost:3000

### Development

```bash
git clone https://github.com/syncbricks/syncbricks.git
cd syncbricks
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000

## Supported Integrations

| Service | Status | Description |
|---------|--------|-------------|
| Proxmox VE | Supported | Hypervisor management (multi-node) |
| pfSense / OPNsense | Supported | Firewall & network management |
| Docker Engine | Supported | Container lifecycle management |
| Pi-hole | Supported | DNS ad-blocking & local DNS |
| AdGuard Home | Supported | DNS filtering & rewrites |
| TrueNAS | Supported | NAS, ZFS pools, SMART data |
| NUT | Supported | UPS monitoring & shutdown |
| Nginx Proxy Manager | Supported | Reverse proxy & SSL certificates |
| Traefik | Planned | Reverse proxy & auto-discovery |
| Tailscale | Planned | VPN mesh management |
| Home Assistant | Planned | Smart home integration |
| WireGuard | Planned | VPN management |
| Cloudflare | Planned | DNS & tunnel management |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: SQLite (via Drizzle ORM) — zero-config, perfect for self-hosting
- **Charts**: Recharts
- **Icons**: Lucide React
- **State**: Zustand
- **AI**: Modular agent system (Ollama, OpenAI, Anthropic)
- **Deployment**: Docker + Docker Compose

## Project Structure

```
src/
├── app/                  # 14 pages + 15 API routes
│   ├── nodes/           # Proxmox node management
│   ├── vms/             # Virtual machine management
│   ├── containers/      # Docker container management
│   ├── network/         # Firewall & VLAN management
│   ├── dns/             # DNS filtering & records
│   ├── storage/         # NAS & ZFS management
│   ├── backups/         # Backup status & scheduling
│   ├── certificates/    # SSL/TLS tracking
│   ├── devices/         # Device inventory (IPAM)
│   ├── power/           # UPS monitoring
│   ├── services/        # Service catalog & deployment
│   ├── automation/      # Rules & AI agents
│   ├── logs/            # Centralized log viewer
│   ├── settings/        # Connection & app settings
│   └── api/             # REST API endpoints
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Sidebar, header, mobile nav
│   └── common/          # Status badges, page headers
├── lib/
│   ├── db/              # Drizzle ORM schema (11 tables)
│   ├── providers/       # 8 infrastructure API clients
│   └── agents/          # AI agent system
└── hooks/               # React data-fetching hooks
```

## Contributing

We welcome contributions from the community! Whether you're a homelab enthusiast, sysadmin, or developer — there's a place for you.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Contribution Guide

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run `npm run lint && npm run build`
5. Open a PR

### Adding a New Integration

1. Create a provider client in `src/lib/providers/`
2. Add types to `src/lib/providers/types.ts`
3. Add an API route in `src/app/api/`
4. Create the UI page in `src/app/`
5. Add sidebar navigation in `src/components/layout/sidebar.tsx`

## Roadmap

- [ ] Real-time updates via Server-Sent Events
- [ ] User authentication & role-based access (NextAuth.js)
- [ ] Traefik auto-discovery integration
- [ ] Tailscale VPN management
- [ ] Network topology visualization
- [ ] Ansible playbook execution from UI
- [ ] Backup scheduling & orchestration
- [ ] Mobile-responsive PWA
- [ ] Plugin system for community extensions
- [ ] Webhook & Discord/Slack notifications
- [ ] Multi-site/multi-location support

## About

SyncBricks is created and maintained by **[Amjid Ali](https://amjid.au)** — founder of **[SyncBricks](https://syncbricks.com.au)**, an AI-first Managed Capability Center based in Melbourne, Australia.

With 25+ years in digital transformation and AI automation, Amjid brings an operator-first mindset to infrastructure management. SyncBricks (the company) specializes in deploying autonomous AI agents across business operations, and this open-source project extends that philosophy to homelab and IT infrastructure management.

**Credentials:**
- 3x CIO 200 Global Champion
- PMP Certified, AWS Certified
- President, Pro AI Global (Australia)
- 250+ processes mapped into automation blueprints
- 65+ standardized AI agents deployed across production environments

### Why Open Source?

We believe the homelab community deserves better tools. The best infrastructure management solutions should be community-driven, transparent, and free to use. By open-sourcing SyncBricks, we're inviting every homelab enthusiast, sysadmin, and IT professional to help build the tool we all wish existed.

## License

[MIT](LICENSE) — free for personal and commercial use.

---

**SyncBricks** — Sync all the bricks of your infrastructure together.

[Website](https://syncbricks.com.au) | [GitHub](https://github.com/syncbricks/syncbricks) | [Report a Bug](https://github.com/syncbricks/syncbricks/issues)
