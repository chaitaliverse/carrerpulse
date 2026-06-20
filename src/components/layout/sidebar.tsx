import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  BrainCircuit, 
  Briefcase, 
  LayoutDashboard, 
  Map, 
  MessageSquare, 
  Wallet,
  FileText,
  Sparkles,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Skills Analytics', href: '/skills', icon: BarChart3 },
  { name: 'Salary Intel', href: '/salary', icon: Wallet },
  { name: 'Resume AI', href: '/resume', icon: FileText },
  { name: 'Career Coach', href: '/coach', icon: MessageSquare },
  { name: 'Learning Roadmap', href: '/roadmap', icon: Map },
  { name: 'Job Market', href: '/jobs', icon: Briefcase },
  { name: 'Portfolio', href: '/portfolio', icon: BrainCircuit },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div className={cn(
        "fixed md:relative inset-y-0 left-0 z-40 flex h-full w-64 flex-col glass-panel border-r border-white/10 transition-transform duration-300 ease-in-out",
        "md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
            <Sparkles className="w-5 h-5 text-accent animate-pulse-slow" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent neon-text-glow">
              CareerPulse
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-muted-foreground hover:text-white transition-colors p-1 rounded"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    isActive
                      ? 'bg-primary/10 text-primary border-r-2 border-primary neon-glow'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white',
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-white',
                      'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] shrink-0">
              JD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white truncate">Data Pro</span>
              <span className="text-xs text-muted-foreground">Pro Tier</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
