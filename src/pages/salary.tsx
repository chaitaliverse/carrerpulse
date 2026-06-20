import { useState } from "react";
import { useGetSalaryTrends, useGetSalaryComparison } from "@workspace/api-client-react";
import { Wallet, MapPin, Briefcase, TrendingUp } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

const ROLE_ESTIMATES: Record<string, Record<string, Record<string, string>>> = {
  "Data Analyst": {
    "Entry Level (0-2 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹5L – ₹9L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹4L – ₹7L", "Remote": "₹6L – ₹10L" },
    "Mid Level (3-5 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹10L – ₹18L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹8L – ₹14L", "Remote": "₹12L – ₹20L" },
    "Senior (5-8 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹18L – ₹30L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹14L – ₹24L", "Remote": "₹20L – ₹32L" },
    "Lead (8+ yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹28L – ₹50L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹22L – ₹40L", "Remote": "₹30L – ₹55L" },
  },
  "Data Engineer": {
    "Entry Level (0-2 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹7L – ₹12L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹5L – ₹10L", "Remote": "₹8L – ₹14L" },
    "Mid Level (3-5 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹14L – ₹26L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹11L – ₹20L", "Remote": "₹16L – ₹28L" },
    "Senior (5-8 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹26L – ₹45L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹20L – ₹36L", "Remote": "₹28L – ₹48L" },
    "Lead (8+ yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹40L – ₹80L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹32L – ₹65L", "Remote": "₹45L – ₹85L" },
  },
  "Data Scientist": {
    "Entry Level (0-2 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹8L – ₹14L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹6L – ₹11L", "Remote": "₹9L – ₹15L" },
    "Mid Level (3-5 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹15L – ₹28L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹12L – ₹22L", "Remote": "₹18L – ₹30L" },
    "Senior (5-8 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹28L – ₹50L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹22L – ₹40L", "Remote": "₹30L – ₹55L" },
    "Lead (8+ yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹45L – ₹90L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹36L – ₹72L", "Remote": "₹50L – ₹95L" },
  },
  "Analytics Engineer": {
    "Entry Level (0-2 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹6L – ₹11L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹5L – ₹9L", "Remote": "₹7L – ₹12L" },
    "Mid Level (3-5 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹12L – ₹22L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹10L – ₹18L", "Remote": "₹14L – ₹24L" },
    "Senior (5-8 yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹22L – ₹38L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹18L – ₹30L", "Remote": "₹24L – ₹42L" },
    "Lead (8+ yrs)": { "Tier 1 (Bangalore, Mumbai, Delhi)": "₹35L – ₹65L", "Tier 2 (Pune, Hyderabad, Chennai)": "₹28L – ₹52L", "Remote": "₹38L – ₹70L" },
  },
};

export function SalaryIntelligence() {
  const { data: trends, isLoading: loadingTrends } = useGetSalaryTrends();
  const { data: comparison, isLoading: loadingComparison } = useGetSalaryComparison();

  const [selectedRole, setSelectedRole] = useState("Data Analyst");
  const [selectedExp, setSelectedExp] = useState("Mid Level (3-5 yrs)");
  const [selectedLocation, setSelectedLocation] = useState("Tier 1 (Bangalore, Mumbai, Delhi)");

  const estimatedRange = ROLE_ESTIMATES[selectedRole]?.[selectedExp]?.[selectedLocation] ?? "₹10L – ₹18L";

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Wallet className="w-7 h-7 md:w-8 md:h-8 text-primary shrink-0" />
          Salary Intelligence
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Real-time compensation benchmarks across Indian data roles — in Indian Rupees (INR).</p>
      </div>

      {/* Main content: chart + calculator stacked on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Charts column */}
        <div className="lg:col-span-3 space-y-4 md:space-y-6">
          {/* Trend chart */}
          <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 hover-elevate transition-all">
            <h2 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary shrink-0" />
              Compensation Trends (Annual CTC in INR)
            </h2>
            <div className="h-[240px] md:h-[350px]">
              {loadingTrends ? (
                <div className="w-full h-full bg-white/5 animate-pulse rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={(trends as unknown as Record<string, number>[])?.slice().sort((a, b) => a.year - b.year)}
                    margin={{ left: 0, right: 8, top: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="gradDA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradDS" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gradDE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="year"
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => formatINR(v)}
                      width={55}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px' }}
                      labelStyle={{ color: 'white', fontWeight: 700, marginBottom: 6 }}
                      formatter={(value: number, name: string) => [formatINR(value), name]}
                      labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: 12, fontSize: 11 }}
                      formatter={(value) => <span style={{ color: 'hsl(var(--muted-foreground))' }}>{value}</span>}
                    />
                    <Area type="monotone" dataKey="Data Analyst"   stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradDA)" dot={false} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="Data Scientist" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gradDS)" dot={false} activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="Data Engineer"  stroke="#06b6d4" strokeWidth={2.5} fill="url(#gradDE)" dot={false} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Role + City bar charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 hover-elevate transition-all">
              <h2 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-secondary shrink-0" />
                By Role (Avg CTC)
              </h2>
              <div className="h-[220px] md:h-[260px]">
                {loadingComparison ? (
                  <div className="w-full h-full bg-white/5 animate-pulse rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparison?.roles} layout="vertical" margin={{ left: 0, right: 24 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="role" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={95} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        formatter={(value: number) => [formatINR(value), 'Avg CTC']}
                      />
                      <Bar dataKey="avgSalary" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 hover-elevate transition-all">
              <h2 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                By City (Avg CTC)
              </h2>
              <div className="h-[220px] md:h-[260px]">
                {loadingComparison ? (
                  <div className="w-full h-full bg-white/5 animate-pulse rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparison?.locations} layout="vertical" margin={{ left: 0, right: 24 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="location" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={80} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        formatter={(value: number) => [formatINR(value), 'Avg CTC']}
                      />
                      <Bar dataKey="avgSalary" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Salary Calculator — full width on mobile */}
        <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 relative overflow-hidden lg:sticky lg:top-8 h-fit">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />
          <h2 className="text-lg md:text-xl font-semibold text-white mb-1">Salary Calculator</h2>
          <p className="text-xs text-muted-foreground mb-4 md:mb-5">Indian market — Annual CTC in INR</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Target Role</label>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 appearance-none"
              >
                <option>Data Analyst</option>
                <option>Data Engineer</option>
                <option>Data Scientist</option>
                <option>Analytics Engineer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Experience Level</label>
              <select
                value={selectedExp}
                onChange={e => setSelectedExp(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 appearance-none"
              >
                <option>Entry Level (0-2 yrs)</option>
                <option>Mid Level (3-5 yrs)</option>
                <option>Senior (5-8 yrs)</option>
                <option>Lead (8+ yrs)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">City Tier</label>
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 appearance-none"
              >
                <option>Tier 1 (Bangalore, Mumbai, Delhi)</option>
                <option>Tier 2 (Pune, Hyderabad, Chennai)</option>
                <option>Remote</option>
              </select>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2">
              <p className="text-xs text-muted-foreground mb-1">Estimated CTC Range</p>
              <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">{estimatedRange}</p>
              <p className="text-xs text-emerald-400 font-medium mt-1">Per Annum (CTC)</p>
            </div>

            <div className="bg-background/50 border border-white/10 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Includes base salary + variable pay. Excludes ESOPs and benefits. Based on Bangalore, Mumbai, Hyderabad, Pune, Delhi NCR market data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
