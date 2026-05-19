"use client";

import { Bell, Command, Moon, Search, Sun, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Topbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = (mounted ? resolvedTheme ?? theme : "dark") === "dark";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/60 px-5 backdrop-blur-xl">
      <div className="flex h-9 w-full max-w-md items-center gap-2 rounded-md border border-border/60 bg-card/40 px-3 text-sm text-muted-foreground shadow-inner">
        <Search className="h-4 w-4" />
        <span className="flex-1 truncate">
          Search tools, patterns, projects, workflows…
        </span>
        <kbd className="inline-flex items-center gap-1 rounded border border-border/70 px-1.5 py-0.5 font-mono text-[10px]">
          <Command className="h-3 w-3" /> K
        </kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="GitHub" asChild>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Github className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="ml-1 flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2 py-1">
          <div className="grid h-6 w-6 place-items-center rounded-full bg-[linear-gradient(135deg,#8b5cf6,#22d3ee)] text-[10px] font-bold text-white">
            RC
          </div>
          <span className="text-xs font-medium">Ranabir</span>
        </div>
      </div>
    </header>
  );
}
