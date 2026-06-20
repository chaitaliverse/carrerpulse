import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { Menu, Sparkles } from "lucide-react";

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] bg-[#0a0a0f] text-foreground overflow-hidden selection:bg-primary/30">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between h-14 px-4 border-b border-white/10 glass-panel shrink-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-primary font-bold text-base tracking-tight">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              CareerPulse
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
            JD
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 z-10 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
