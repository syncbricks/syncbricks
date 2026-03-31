import type { Agent, AgentTask } from "./types";

export class AgentOrchestrator {
  private agents: Map<string, Agent> = new Map();
  private results: Map<string, AgentTask> = new Map();

  registerAgent(agent: Agent): void {
    this.agents.set(agent.name, agent);
  }

  async runAgent(
    name: string,
    context: Record<string, unknown>
  ): Promise<AgentTask> {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent "${name}" not found`);
    }

    const task: AgentTask = {
      id: `${name}-${Date.now()}`,
      agent: name,
      status: "running",
      input: JSON.stringify(context),
      startedAt: new Date().toISOString(),
    };

    this.results.set(task.id, task);

    try {
      const findings = await agent.analyze(context);
      task.status = "completed";
      task.findings = findings;
      task.output = `Found ${findings.length} finding(s)`;
      task.completedAt = new Date().toISOString();
    } catch (error) {
      task.status = "failed";
      task.output =
        error instanceof Error ? error.message : "Unknown error occurred";
      task.completedAt = new Date().toISOString();
    }

    this.results.set(task.id, task);
    return task;
  }

  async runAll(
    context: Record<string, unknown>
  ): Promise<AgentTask[]> {
    const tasks: AgentTask[] = [];

    for (const [name] of this.agents) {
      const task = await this.runAgent(name, context);
      tasks.push(task);
    }

    return tasks;
  }

  getResults(): AgentTask[] {
    return Array.from(this.results.values());
  }

  getAgentNames(): string[] {
    return Array.from(this.agents.keys());
  }
}

export { HealthAgent } from "./health-agent";
export { OptimizeAgent } from "./optimize-agent";
export { SecurityAgent } from "./security-agent";
export type { Agent, AgentTask, AgentFinding, AgentConfig } from "./types";
