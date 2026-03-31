# Contributing to SyncBricks

Thank you for your interest in contributing to SyncBricks! This project is built by and for the homelab and IT infrastructure community. Whether you're fixing a typo or adding a new integration, your contribution matters.

## About SyncBricks

SyncBricks is an open-source, AI-powered homelab management platform created by [Amjid Ali](https://amjid.au) and maintained by the [SyncBricks](https://syncbricks.com.au) team in Melbourne, Australia. Our goal is to give every homelab enthusiast and IT professional a single, unified dashboard to manage their entire infrastructure.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `npm install`
3. **Copy environment file**: `cp .env.example .env`
4. **Start development server**: `npm run dev`
5. **Open** http://localhost:3000

## Development Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Git

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS + shadcn/ui v4
- **Database**: SQLite via Drizzle ORM
- **Charts**: Recharts
- **Icons**: Lucide React
- **State**: Zustand
- **AI**: Modular agent system (Ollama / OpenAI / Anthropic)

### Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # React components
│   ├── ui/          # shadcn/ui base components
│   ├── layout/      # Layout (sidebar, header, mobile nav)
│   └── common/      # Shared components (status badges, page headers)
├── lib/
│   ├── db/          # Database schema and client (Drizzle + SQLite)
│   ├── providers/   # Infrastructure API clients (Proxmox, pfSense, etc.)
│   └── agents/      # AI agent system (health, optimize, security)
└── hooks/           # React data-fetching hooks
```

## How to Contribute

### Reporting Bugs

- Use [GitHub Issues](https://github.com/syncbricks/syncbricks/issues)
- Include steps to reproduce
- Include browser/OS information
- Screenshots and logs are always helpful

### Suggesting Features

- Open a GitHub Issue with the **"feature request"** label
- Describe the use case and why it benefits homelab users
- If you're proposing a new integration, list the API endpoints you'd use

### Pull Requests

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run linting: `npm run lint`
4. Run build: `npm run build`
5. Commit with a clear, descriptive message
6. Push and open a PR against `main`

### Code Style

- Use TypeScript for all new files
- Follow existing patterns in the codebase
- Use shadcn/ui components for UI elements
- Use Lucide icons consistently
- Keep components focused and composable
- Prefer functional components with hooks

### Adding a New Provider Integration

To add support for a new infrastructure service (e.g., Tailscale, Traefik, Cloudflare):

1. Create a client in `src/lib/providers/your-service.ts`
2. Add shared types to `src/lib/providers/types.ts`
3. Add the connection type to `src/lib/db/schema.ts`
4. Create an API route in `src/app/api/your-service/route.ts`
5. Create the UI page in `src/app/your-service/page.tsx`
6. Add navigation entry in `src/components/layout/sidebar.tsx`
7. Update the README integration table

### Adding a New AI Agent

1. Create the agent in `src/lib/agents/your-agent.ts`
2. Implement the `Agent` interface from `src/lib/agents/types.ts`
3. Register it in `src/lib/agents/index.ts`
4. Add it to the automation page's agent task cards

## Areas We Need Help

- **New integrations** — Traefik, Tailscale, WireGuard, Cloudflare, Home Assistant
- **Real-time updates** — SSE implementation for live dashboard data
- **Authentication** — NextAuth.js setup with local credentials + LDAP/OIDC
- **Testing** — Unit and integration test coverage
- **Documentation** — Setup guides, API documentation, screenshots
- **Accessibility** — ARIA labels, keyboard navigation, screen reader support
- **Internationalization** — Multi-language support

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers — everyone starts somewhere
- Focus on the technical merits of contributions
- No harassment or discrimination of any kind
- Assume good intent

## Questions?

- Open a [GitHub Discussion](https://github.com/syncbricks/syncbricks/discussions)
- Email: hello@syncbricks.com.au
- Website: [syncbricks.com.au](https://syncbricks.com.au)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
