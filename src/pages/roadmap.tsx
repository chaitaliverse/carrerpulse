import { useState } from "react";
import { useGenerateRoadmap, useGetSavedRoadmaps } from "@workspace/api-client-react";
import { Map, Flag, Play, CheckCircle2, Circle, Clock, ExternalLink } from "lucide-react";

export function Roadmap() {
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [timeframe, setTimeframe] = useState("6 months");
  
  const generateRoadmap = useGenerateRoadmap();
  const { data: savedRoadmaps } = useGetSavedRoadmaps();

  const handleGenerate = () => {
    if (!currentRole || !targetRole) return;
    generateRoadmap.mutate({ data: { currentRole, targetRole, timeframe } });
  };

  const roadmap = generateRoadmap.data || savedRoadmaps?.[0];
  const isPending = generateRoadmap.isPending;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Map className="w-7 h-7 md:w-8 md:h-8 text-primary shrink-0" />
          Learning Roadmap
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">AI-generated phase-by-phase curriculum to reach your target role.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
        {/* Goal setter */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 hover-elevate transition-all">
            <h2 className="text-base md:text-lg font-semibold text-white mb-4">Set Goals</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Current Role</label>
                <input 
                  type="text" 
                  value={currentRole}
                  onChange={e => setCurrentRole(e.target.value)}
                  placeholder="e.g. Data Analyst"
                  className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Target Role</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  placeholder="e.g. Machine Learning Eng"
                  className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Timeframe</label>
                <select 
                  value={timeframe}
                  onChange={e => setTimeframe(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 appearance-none"
                >
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                </select>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isPending || !currentRole || !targetRole}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-medium rounded-md py-2.5 text-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] mt-2 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Generate Path
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Roadmap display */}
        <div className="lg:col-span-3">
          <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-8 min-h-[400px] relative overflow-hidden">
            {!roadmap && !isPending && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <Flag className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">No Active Roadmap</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Define your current and target roles to generate a customized learning path.
                </p>
              </div>
            )}

            {isPending && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-primary font-medium animate-pulse text-sm md:text-base">Computing learning nodes...</p>
              </div>
            )}

            {roadmap && !isPending && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 md:pb-6">
                  <div className="min-w-0">
                    <h2 className="text-lg md:text-2xl font-bold text-white neon-text-glow leading-tight">{roadmap.title}</h2>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 shrink-0" />
                      {roadmap.timeframe} estimated timeline
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-2xl font-bold text-primary">{roadmap.completionPercentage}%</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Complete</span>
                  </div>
                </div>

                <div className="relative border-l-2 border-white/10 ml-3 md:ml-4 space-y-8 md:space-y-12 pb-4">
                  {roadmap.phases.map((phase, idx) => (
                    <div key={idx} className="relative pl-6 md:pl-8">
                      <div className="absolute -left-[11px] top-1 bg-background rounded-full">
                        {phase.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 bg-background rounded-full" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground bg-background rounded-full" />
                        )}
                      </div>
                      
                      <div className={`glass-panel p-4 md:p-6 rounded-xl border transition-all ${
                        idx === 0 && !phase.completed ? 'border-primary/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/5'
                      }`}>
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">Phase {phase.phase}</span>
                            <h3 className="text-base md:text-lg font-bold text-white">{phase.title}</h3>
                          </div>
                          <span className="text-xs font-medium px-2 py-1 rounded bg-white/5 text-muted-foreground border border-white/10 shrink-0">
                            {phase.duration}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-white mb-2">Focus Skills:</p>
                          <div className="flex flex-wrap gap-1.5 md:gap-2">
                            {phase.skills.map((skill, sIdx) => (
                              <span key={sIdx} className="text-xs px-2 py-1 bg-primary/10 border border-primary/20 text-primary rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-start gap-2 md:gap-3">
                          <Flag className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Milestone</p>
                            <p className="text-sm text-white font-medium">{phase.milestone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 md:pt-8 border-t border-white/10">
                  <h3 className="text-base md:text-lg font-semibold text-white mb-4">Recommended Resources</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {roadmap.resources.map((res, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 p-3 md:p-4 rounded-lg hover:border-white/20 transition-colors group cursor-pointer">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="text-sm font-medium text-white group-hover:text-primary transition-colors leading-tight">{res.title}</h4>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </div>
                        <div className="flex items-center flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="bg-white/10 px-2 py-0.5 rounded">{res.platform}</span>
                          <span>{res.duration}</span>
                          <span>{res.difficulty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
