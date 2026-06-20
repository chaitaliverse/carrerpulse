import { useState } from "react";
import { useGetPortfolioProjects, useGetPortfolioScore, useAddPortfolioProject } from "@workspace/api-client-react";
import { FolderGit2, Plus, ExternalLink, Github, Award, ChevronRight } from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

export function Portfolio() {
  const [showAdd, setShowAdd] = useState(false);
  const { data: projects, isLoading: loadingProjects } = useGetPortfolioProjects();
  const { data: score, isLoading: loadingScore } = useGetPortfolioScore();
  const addProject = useAddPortfolioProject();
  void addProject;

  const scoreData = score ? [
    { name: "Score", value: score.overall, fill: "hsl(var(--primary))" }
  ] : [];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderGit2 className="w-7 h-7 md:w-8 md:h-8 text-primary shrink-0" />
            <span className="truncate">Portfolio Tracker</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage projects and evaluate your recruiter readiness.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-primary text-white hover:bg-primary/90 px-3 md:px-4 py-2 rounded-md font-medium text-sm flex items-center gap-1.5 md:gap-2 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Project</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
        {/* Score sidebar */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          {/* On mobile, show side-by-side with suggestions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 hover-elevate transition-all flex flex-col items-center">
              <h2 className="text-sm font-semibold text-white w-full mb-2">Portfolio Strength</h2>
              <div className="h-[160px] md:h-[200px] w-full relative">
                {loadingScore ? (
                  <div className="w-full h-full bg-white/5 animate-pulse rounded-full" />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={14} data={scoreData} startAngle={180} endAngle={0}>
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar background={{ fill: 'hsl(var(--muted))' }} dataKey="value" cornerRadius={10} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-5">
                      <span className="text-3xl md:text-4xl font-bold text-white neon-text-glow">{score?.overall}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="w-full space-y-2 md:space-y-3 mt-3 md:mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Complexity</span>
                  <span className="text-white font-medium">{score?.complexity}/100</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Diversity</span>
                  <span className="text-white font-medium">{score?.diversity}/100</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Readiness</span>
                  <span className="text-emerald-400 font-medium">{score?.recruiterReadiness}/100</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-bl-full -z-10 blur-xl" />
              <h3 className="text-sm font-semibold text-white mb-3">AI Suggestions</h3>
              <ul className="space-y-2 md:space-y-3">
                {score?.improvements.map((imp, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <ChevronRight className="w-3 h-3 text-secondary shrink-0 mt-0.5" />
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div className="lg:col-span-3">
          {showAdd && (
            <div className="glass-panel rounded-xl border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.1)] p-4 md:p-6 mb-4 md:mb-6 animate-in slide-in-from-top-4">
              <h2 className="text-base md:text-lg font-semibold text-white mb-4">Add New Project</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Title</label>
                  <input type="text" className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                  <textarea rows={3} className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">GitHub URL</label>
                  <input type="text" className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Live URL</label>
                  <input type="text" className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white" />
                </div>
                <div className="col-span-1 sm:col-span-2 flex justify-end gap-3 mt-1">
                  <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors">Cancel</button>
                  <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Save Project</button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {loadingProjects ? (
              [...Array(4)].map((_, i) => <div key={i} className="h-44 md:h-48 bg-white/5 animate-pulse rounded-xl" />)
            ) : (
              projects?.map(project => (
                <div key={project.id} className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 flex flex-col hover-elevate transition-all group hover:border-white/20">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="text-base md:text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight">{project.title}</h3>
                    <div className={`px-2 py-1 rounded text-xs font-bold shrink-0 ${
                      project.recruiterReadiness === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      project.recruiterReadiness === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {project.recruiterReadiness === 'High' ? 'Good' : project.recruiterReadiness} Readiness
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                    {project.skills.slice(0,3).map((skill, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 text-muted-foreground rounded uppercase tracking-wider font-medium">
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 3 && (
                      <span className="text-[10px] px-2 py-1 text-muted-foreground">+{project.skills.length - 3}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 md:gap-3">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-white transition-colors">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-white">{project.score}/100</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
