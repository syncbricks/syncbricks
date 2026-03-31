export interface AgentConfig {
  provider: "ollama" | "openai" | "anthropic";
  model: string;
  endpoint?: string;
  apiKey?: string;
}

export interface AgentTask {
  id: string;
  agent: string;
  status: "pending" | "running" | "completed" | "failed";
  input: string;
  output?: string;
  findings?: AgentFinding[];
  startedAt?: string;
  completedAt?: string;
}

export interface AgentFinding {
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  recommendation?: string;
}

export interface Agent {
  name: string;
  description: string;
  analyze(context: Record<string, unknown>): Promise<AgentFinding[]>;
}
