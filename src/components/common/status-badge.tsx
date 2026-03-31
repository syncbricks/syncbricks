import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "online" | "offline" | "running" | "stopped" | "paused" | "up" | "down" | "degraded" | "unknown" | "success" | "failed" | "pending" | "warning" | "critical" | "info" | "restarting" | "exited";

const statusConfig: Record<string, { color: string; label: string }> = {
  online: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Online" },
  offline: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Offline" },
  running: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Running" },
  stopped: { color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30", label: "Stopped" },
  paused: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Paused" },
  up: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Up" },
  down: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Down" },
  degraded: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Degraded" },
  unknown: { color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30", label: "Unknown" },
  success: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Success" },
  failed: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Failed" },
  pending: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Pending" },
  warning: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Warning" },
  critical: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Critical" },
  info: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Info" },
  restarting: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", label: "Restarting" },
  exited: { color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30", label: "Exited" },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] || statusConfig.unknown;
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.color)}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}
