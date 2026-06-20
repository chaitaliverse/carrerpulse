import { useState } from "react";
import { useAnalyzeResume, useGetSavedResumes } from "@workspace/api-client-react";
import { FileText, Upload, AlertCircle, CheckCircle2, ChevronRight, Gauge } from "lucide-react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export function ResumeAnalyzer() {
  const [text, setText] = useState("");
  const [role, setRole] = useState("");
  const analyzeResume = useAnalyzeResume();
  const { data: savedResumes } = useGetSavedResumes();

  const handleAnalyze = () => {
    if (!text || !role) return;
    analyzeResume.mutate({ data: { resumeText: text, targetRole: role } });
  };

  const result = analyzeResume.data;
  const isPending = analyzeResume.isPending;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <FileText className="w-7 h-7 md:w-8 md:h-8 text-primary shrink-0" />
          Resume Analyzer
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">AI-powered ATS scoring and keyword optimization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Input */}
        <div className="space-y-4">
          <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 hover-elevate transition-all">
            <h2 className="text-base md:text-lg font-semibold text-white mb-4">Analysis Parameters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Target Role</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Data Engineer" 
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Resume Text</label>
                <textarea 
                  rows={10}
                  placeholder="Paste your resume content here..." 
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none font-mono text-xs" 
                />
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={isPending || !text || !role}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-medium rounded-md py-3 text-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {savedResumes && savedResumes.length > 0 && (
            <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6">
              <h3 className="text-sm font-semibold text-white mb-3">Previous Scans</h3>
              <div className="space-y-2">
                {savedResumes.map(resume => (
                  <div key={resume.id} className="flex items-center justify-between p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{resume.targetRole}</p>
                      <p className="text-xs text-muted-foreground">{new Date(resume.analyzedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-lg font-bold text-primary">{resume.atsScore}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 relative overflow-hidden min-h-[400px] md:min-h-[500px]">
          {!result && !isPending && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <Gauge className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Awaiting Input</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Paste your resume and target role to get a comprehensive ATS scan, keyword analysis, and actionable improvement steps.
              </p>
            </div>
          )}

          {isPending && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm z-10">
              <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-primary font-medium animate-pulse">Running AI Analysis...</p>
            </div>
          )}

          {result && !isPending && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
              {/* ATS Score + sub-scores */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-white/10 pb-6">
                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 relative">
                  <CircularProgressbar 
                    value={result.atsScore} 
                    text={`${result.atsScore}`}
                    styles={buildStyles({
                      textColor: '#fff',
                      pathColor: `hsl(var(--primary))`,
                      trailColor: 'rgba(255,255,255,0.05)',
                      textSize: '24px'
                    })}
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-card px-2 py-0.5 rounded text-xs font-bold text-primary border border-primary/20 shadow-[0_0_10px_rgba(59,130,246,0.3)] whitespace-nowrap">
                    ATS Score
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 flex-1 w-full">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Format</p>
                    <p className="text-lg md:text-xl font-bold text-white">{result.formatScore}/100</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Content</p>
                    <p className="text-lg md:text-xl font-bold text-white">{result.contentScore}/100</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5 col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Keywords Match</p>
                    <p className="text-lg md:text-xl font-bold text-white">{result.keywordScore}/100</p>
                  </div>
                </div>
              </div>

              {/* Improvements */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Critical Improvements</h3>
                <div className="space-y-3">
                  {result.improvements.map((imp, i) => (
                    <div key={i} className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-3 md:p-4 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white mb-1">
                          {imp.section}
                          <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded ml-2">{imp.priority}</span>
                        </p>
                        <p className="text-sm text-red-200/70">{imp.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Detected Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.skillsDetected.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-200/70">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
