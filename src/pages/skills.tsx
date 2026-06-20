import { useState } from "react";
import { useGetSkillDemand, useGetTrendingSkills, useAnalyzeSkillGap } from "@workspace/api-client-react";
import { BarChart3, TrendingUp, ArrowUpRight, Zap, Target, CheckCircle2, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const IMPORTANCE_COLOR: Record<string, string> = {
  Critical: "text-red-400 bg-red-400/10 border-red-400/30",
  High: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  Medium: "text-blue-400 bg-blue-400/10 border-blue-400/30",
};

export function SkillsAnalytics() {
  const [category, setCategory] = useState<string>("All");
  const { data: demandData, isLoading: loadingDemand } = useGetSkillDemand(
    category !== "All" ? { category } : {}
  );
  const { data: trendingData, isLoading: loadingTrending } = useGetTrendingSkills();

  const [currentSkillsInput, setCurrentSkillsInput] = useState("");
  const [targetRole, setTargetRole] = useState("Data Scientist");
  const [gapResult, setGapResult] = useState<ReturnType<typeof useAnalyzeSkillGap>["data"] | null>(null);

  const { mutate: analyzeGap, isPending: analyzing } = useAnalyzeSkillGap();

  function handleAnalyze() {
    const skills = currentSkillsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    analyzeGap(
      { data: { currentSkills: skills, targetRole, experienceLevel: "Mid" } },
      { onSuccess: (data) => setGapResult(data) }
    );
  }

  const CATEGORIES = ['All', 'Python', 'SQL', 'BI Tools', 'Cloud', 'ML/AI'];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-primary shrink-0" />
          Skill Demand Analytics
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Real-time market demand and growth trajectories for data skills.</p>
      </div>

      {/* Trending ticker */}
      <div className="glass-panel p-3 md:p-4 rounded-xl border border-white/5 flex items-center gap-3 overflow-hidden relative">
        <div className="flex items-center gap-2 text-secondary shrink-0 font-medium z-10 bg-card pr-3 border-r border-white/10">
          <Zap className="w-4 h-4" />
          <span className="text-sm">Trending</span>
        </div>
        <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          {loadingTrending ? (
            <div className="h-6 w-64 bg-white/5 animate-pulse rounded" />
          ) : (
            trendingData?.map((skill) => (
              <div key={skill.skill} className="flex items-center gap-1.5">
                <span className="text-white text-sm font-medium">{skill.skill}</span>
                <span className="text-emerald-400 text-xs flex items-center">
                  <ArrowUpRight className="w-3 h-3" />{skill.weeklyGrowth}%
                </span>
                <span className="text-muted-foreground text-xs ml-1">•</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Demand Matrix */}
        <div className="lg:col-span-2 glass-panel rounded-xl border border-white/5 p-4 md:p-6 hover-elevate transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-semibold text-white">Market Demand Matrix</h2>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all border ${
                    category === cat
                      ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                      : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[280px] md:h-[400px]">
            {loadingDemand ? (
              <div className="w-full h-full bg-white/5 animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData} layout="vertical" margin={{ left: 30, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="skill"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="demandScore" radius={[0, 4, 4, 0]}>
                    {demandData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${0.5 + (entry.demandScore / 200)})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4 md:space-y-6">
          {/* Skill Gap Analyzer */}
          <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 hover-elevate transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full -z-10 blur-2xl" />
            <h2 className="text-base md:text-lg font-semibold text-white mb-1 flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary shrink-0" />
              Skill Gap Analyzer
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Enter your skills and target role to see what you're missing.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Your Current Skills</label>
                <input
                  type="text"
                  value={currentSkillsInput}
                  onChange={e => setCurrentSkillsInput(e.target.value)}
                  placeholder="e.g. SQL, Python, Excel"
                  className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50"
                />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Target Role</label>
                <select
                  value={targetRole}
                  onChange={e => { setTargetRole(e.target.value); setGapResult(null); }}
                  className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 appearance-none"
                >
                  <option>Data Scientist</option>
                  <option>Data Engineer</option>
                  <option>Data Analyst</option>
                  <option>ML Engineer</option>
                  <option>BI Developer</option>
                  <option>Analytics Engineer</option>
                </select>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !currentSkillsInput.trim()}
                className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 font-medium rounded-md py-2 text-sm transition-all shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? "Analyzing…" : "Analyze Gaps"}
              </button>
            </div>

            {gapResult && (
              <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">Role Match</span>
                    <span className={`text-lg font-bold ${(gapResult.matchScore ?? 0) >= 70 ? 'text-emerald-400' : (gapResult.matchScore ?? 0) >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                      {gapResult.matchScore}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${(gapResult.matchScore ?? 0) >= 70 ? 'bg-emerald-400' : (gapResult.matchScore ?? 0) >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ width: `${gapResult.matchScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Est. time: <span className="text-white font-medium ml-1">{gapResult.estimatedTimeline}</span>
                  </p>
                </div>

                {(gapResult.strongSkills?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs font-medium text-emerald-400 mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> You already have
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {gapResult.strongSkills?.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {(gapResult.missingSkills?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs font-medium text-red-400 mb-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Skills to acquire
                    </p>
                    <div className="space-y-1.5">
                      {gapResult.missingSkills?.map(s => (
                        <div key={s.skill} className="flex items-center justify-between gap-2">
                          <span className="text-sm text-white truncate">{s.skill}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`px-1.5 py-0.5 rounded text-xs border font-medium ${IMPORTANCE_COLOR[s.importance ?? "Medium"] ?? IMPORTANCE_COLOR.Medium}`}>
                              {s.importance}
                            </span>
                            <span className="text-xs text-muted-foreground hidden sm:inline">{s.timeToLearn}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(gapResult.recommendations?.length ?? 0) > 0 && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Recommendations</p>
                    <div className="space-y-1.5">
                      {gapResult.recommendations?.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <ChevronRight className="w-3 h-3 mt-0.5 shrink-0 text-secondary" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fastest Growing */}
          <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent shrink-0" />
              Fastest Growing
            </h2>
            <div className="space-y-3">
              {loadingTrending ? (
                [...Array(3)].map((_, i) => <div key={i} className="h-12 bg-white/5 animate-pulse rounded-md" />)
              ) : (
                trendingData?.slice(0, 4).map((skill, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-accent/30 transition-colors">
                    <span className="font-medium text-white text-sm">{skill.skill}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-accent text-sm flex items-center gap-1 font-bold">
                        <ArrowUpRight className="w-3 h-3" />{skill.weeklyGrowth}%
                      </span>
                      <span className="text-xs text-muted-foreground">{skill.hotness}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
