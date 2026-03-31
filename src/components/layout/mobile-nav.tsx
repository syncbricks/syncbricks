"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Server,
  Monitor,
  Container,
  Network,
  Globe,
  HardDrive,
  DatabaseBackup,
  ShieldCheck,
  Laptop,
  Plug,
  AppWindow,
  Workflow,
  ScrollText,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Nodes", href: "/nodes", icon: Server },
  { name: "Virtual Machines", href: "/vms", icon: Monitor },
  { name: "Containers", href: "/containers", icon: Container },
  { name: "Network", href: "/network", icon: Network },
  { name: "DNS", href: "/dns", icon: Globe },
  { name: "Storage", href: "/storage", icon: HardDrive },
  { name: "Backups", href: "/backups", icon: DatabaseBackup },
  { name: "Certificates", href: "/certificates", icon: ShieldCheck },
  { name: "Devices", href: "/devices", icon: Laptop },
  { name: "Power", href: "/power", icon: Plug },
  { name: "Services", href: "/services", icon: AppWindow },
  { name: "Automation", href: "/automation", icon: Workflow },
  { name: "Logs", href: "/logs", icon: ScrollText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 h-16 px-4 border-b border-border">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">SB</span>
        </div>
        <span className="font-bold text-lg">SyncBricks</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
