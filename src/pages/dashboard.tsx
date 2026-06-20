import { 
  useGetDashboardSummary, 
  useGetDashboardActivity, 
} from "@workspace/api-client-react";
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Briefcase, 
  BrainCircuit, 
  Wallet,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar, 
  PolarAngleAxis, 
  AreaChart,
  Area,
  XAxis, 
  Tooltip as RechartsTooltip,
} from "recharts";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: activity, isLoading: loadingActivity } = useGetDashboardActivity();

  if (loadingSummary || loadingActivity) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 md:w-64 bg-white/5 animate-pulse rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 md:h-32 bg-white/5 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 md:h-96 bg-white/5 animate-pulse rounded-xl lg:col-span-2" />
          <div className="h-72 md:h-96 bg-white/5 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  const careerScore = summary?.careerScore ?? 78;
  const scoreData = [
    { name: "Total", value: careerScore, fill: "hsl(var(--primary))" }
  ];

  const mockTrendData = [
    { name: "Mon", value: 40 },
    { name: "Tue", value: 30 },
    { name: "Wed", value: 45 },
    { name: "Thu", value: 50 },
    { name: "Fri", value: 65 },
    { name: "Sat", value: 60 },
    { name: "Sun", value: 75 },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Command Center
            <Sparkles className="w-5 h-5 text-accent animate-pulse-slow" />
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Live overview of your data career trajectory.</p>
        </div>
        <div className="glass-panel px-3 md:px-4 py-2 rounded-full flex items-center gap-2 md:gap-3 border-primary/20 self-start sm:self-auto">
          <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-primary"></span>
          </span>
          <span className="text-xs md:text-sm font-medium text-primary">
            Market: {summary?.marketDemand || 'High'}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Career Score" 
          value={summary?.careerScore ?? 78} 
          trend={`+${summary?.weeklyGrowth ?? 4.2}% this week`}
          icon={<Target className="w-5 h-5 text-primary" />}
        />
        <StatCard 
          title="Salary Benchmark" 
          value={`₹${(((summary?.salaryBenchmark ?? 1800000))/100000).toFixed(0)}L`}
          trend="Top 15% for your role"
          icon={<Wallet className="w-5 h-5 text-secondary" />}
        />
        <StatCard 
          title="Jobs Applied" 
          value={summary?.jobsApplied ?? 24} 
          trend="3 pending responses"
          icon={<Briefcase className="w-5 h-5 text-accent" />}
        />
        <StatCard 
          title="Skills Tracked" 
          value={summary?.skillsTracked ?? 18} 
          trend="2 needing improvement"
          icon={<BrainCircuit className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 glass-panel rounded-xl p-4 md:p-6 hover-elevate transition-all border border-white/5 hover:border-primary/30 group">
          <div className="flex items-center justify-between mb-4 md:mb-6 gap-2">
            <h2 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary shrink-0" />
              Growth Trajectory
            </h2>
            <select className="bg-background/50 border border-white/10 rounded-md px-2 md:px-3 py-1 text-xs md:text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary shrink-0">
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <div className="h-[220px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 md:p-6 border border-white/5 hover:border-secondary/30 transition-all hover-elevate flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent z-0" />
          <h2 className="text-base md:text-lg font-semibold text-white mb-2 z-10 w-full text-left flex items-center gap-2">
            <Target className="w-5 h-5 text-secondary shrink-0" />
            Overall Readiness
          </h2>
          <div className="h-[180px] md:h-[250px] w-full z-10 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" cy="50%" 
                innerRadius="70%" outerRadius="100%" 
                barSize={20} 
                data={scoreData} 
                startAngle={180} endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar 
                  background={{ fill: 'hsl(var(--muted))' }}
                  dataKey="value" 
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
              <span className="text-4xl md:text-5xl font-bold text-white neon-text-glow tracking-tighter">
                {careerScore}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground mt-1">/ 100 Score</span>
            </div>
          </div>
          <div className="w-full mt-3 md:mt-4 space-y-2 z-10">
            {[
              "Add cloud certification (AWS/GCP) to boost market fit by ~12 points",
              "Complete 2 more ML projects to strengthen portfolio score",
            ].map((rec, i) => (
              <div key={i} className="text-xs bg-white/5 p-2 rounded border border-white/10 text-muted-foreground flex items-start gap-2">
                <ArrowUpRight className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary shrink-0" />
          Recent Activity
        </h2>
        <div className="space-y-3 md:space-y-4">
          {activity?.map((item) => (
            <div key={item.id} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                <BrainCircuit className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                <p className="text-xs text-muted-foreground/70 mt-1.5">{new Date(item.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {(!activity || activity.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No recent activity. Start exploring the platform!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon }: { title: string, value: string | number, trend: string, icon: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-xl p-4 md:p-6 border border-white/5 hover:border-white/20 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">{title}</h3>
        <div className="p-1.5 md:p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors">
          {icon}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</span>
        <span className="text-xs text-emerald-400 font-medium">{trend}</span>
      </div>
    </div>
  );
}
