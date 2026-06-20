import { useState } from "react";
import { useGetJobListings, useGetTopHiringCompanies, useGetJobMarketOverview } from "@workspace/api-client-react";
import { Briefcase, MapPin, Building, Globe, Star, Sparkles, TrendingUp } from "lucide-react";

const COUNTRY_FLAGS: Record<string, string> = {
  India: "🇮🇳", USA: "🇺🇸", UK: "🇬🇧",
  Singapore: "🇸🇬", Germany: "🇩🇪", Canada: "🇨🇦", Australia: "🇦🇺",
};

const COMPANY_COLORS: Record<string, string> = {
  Google: "bg-blue-500/20 text-blue-400",     Microsoft: "bg-cyan-500/20 text-cyan-400",
  Amazon: "bg-amber-500/20 text-amber-400",   Flipkart: "bg-yellow-500/20 text-yellow-400",
  PhonePe: "bg-violet-500/20 text-violet-400", Swiggy: "bg-orange-500/20 text-orange-400",
  Zomato: "bg-red-500/20 text-red-400",       Razorpay: "bg-blue-600/20 text-blue-300",
  Deloitte: "bg-green-600/20 text-green-400", Accenture: "bg-purple-600/20 text-purple-400",
  TCS: "bg-blue-700/20 text-blue-300",        Infosys: "bg-indigo-500/20 text-indigo-400",
  Wipro: "bg-sky-500/20 text-sky-400",        Cognizant: "bg-teal-500/20 text-teal-400",
  Capgemini: "bg-cyan-600/20 text-cyan-300",  IBM: "bg-blue-800/20 text-blue-200",
  Adobe: "bg-red-600/20 text-red-400",        PayPal: "bg-blue-400/20 text-blue-300",
  LinkedIn: "bg-sky-600/20 text-sky-300",     Meesho: "bg-pink-500/20 text-pink-400",
  Stripe: "bg-violet-400/20 text-violet-300", Databricks: "bg-orange-500/20 text-orange-400",
  OpenAI: "bg-emerald-500/20 text-emerald-400", Uber: "bg-gray-500/20 text-gray-300",
  Airbnb: "bg-rose-500/20 text-rose-400",     Netflix: "bg-red-700/20 text-red-300",
  Meta: "bg-blue-500/20 text-blue-300",       Apple: "bg-gray-400/20 text-gray-300",
  Salesforce: "bg-sky-500/20 text-sky-400",   NVIDIA: "bg-green-500/20 text-green-400",
  Deliveroo: "bg-teal-400/20 text-teal-300",  Revolut: "bg-indigo-400/20 text-indigo-300",
  Grab: "bg-green-600/20 text-green-300",     Shopee: "bg-orange-600/20 text-orange-300",
  N26: "bg-gray-600/20 text-gray-300",        Shopify: "bg-emerald-600/20 text-emerald-300",
};

type Job = {
  id: number; title: string; company: string; country: string;
  location: string; remote: boolean; salaryMin: number; salaryMax: number;
  currency: string; skills: string[]; postedAt: string;
  matchScore: number; industry: string; experienceLevel: string;
};

function formatSalary(min: number, max: number, currency: string): string {
  switch (currency) {
    case "INR": return `₹${(min / 100000).toFixed(0)}L – ₹${(max / 100000).toFixed(0)}L`;
    case "USD": return `$${(min / 1000).toFixed(0)}K – $${(max / 1000).toFixed(0)}K`;
    case "GBP": return `£${(min / 1000).toFixed(0)}K – £${(max / 1000).toFixed(0)}K`;
    case "SGD": return `S$${(min / 1000).toFixed(0)}K – S$${(max / 1000).toFixed(0)}K`;
    case "EUR": return `€${(min / 1000).toFixed(0)}K – €${(max / 1000).toFixed(0)}K`;
    default: return `${min} – ${max}`;
  }
}

function companyInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

function daysAgo(isoDate: string): string {
  const days = Math.round((Date.now() - new Date(isoDate).getTime()) / 86400000);
  return days === 0 ? "Today" : days === 1 ? "1d ago" : `${days}d ago`;
}

const MATCH_COLOR = (score: number) =>
  score >= 85 ? "text-emerald-400 border-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
  : score >= 70 ? "text-amber-400 border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
  : "text-red-400 border-red-400/40";

type FilterType = "All" | "India" | "Global" | "Remote";

export function Jobs() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");

  const apiParams = {
    role,
    location,
    remote: filter === "Remote" ? true : undefined,
    region: filter === "India" ? "India" : filter === "Global" ? "Global" : undefined,
  };

  const { data: listings, isLoading: loadingJobs } = useGetJobListings(apiParams as Parameters<typeof useGetJobListings>[0]);
  const { data: companies, isLoading: loadingCompanies } = useGetTopHiringCompanies();
  const { data: market, isLoading: loadingMarket } = useGetJobMarketOverview();

  const FILTERS: { label: string; value: FilterType; icon: string }[] = [
    { label: "All Jobs",    value: "All",    icon: "🌐" },
    { label: "India",       value: "India",  icon: "🇮🇳" },
    { label: "Global",      value: "Global", icon: "🌍" },
    { label: "Remote Only", value: "Remote", icon: "💻" },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Briefcase className="w-7 h-7 md:w-8 md:h-8 text-primary shrink-0" />
          Job Market Insights
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Live opportunities across India and worldwide — salaries in local currency.</p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Openings",   value: loadingMarket ? null : market?.totalOpenings.toLocaleString() },
          { label: "Remote Roles",     value: loadingMarket ? null : `${market?.remotePercentage}%` },
          { label: "Avg Time to Hire", value: loadingMarket ? null : `${market?.avgTimeToHire}d` },
          { label: "Demand Growth",    value: loadingMarket ? null : `+${market?.demandGrowth}%`, highlight: true },
        ].map(({ label, value, highlight }) => (
          <div key={label} className={`glass-panel p-3 md:p-4 rounded-xl border flex flex-col gap-1 ${highlight ? 'border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-white/5'}`}>
            <span className={`text-[10px] md:text-xs font-medium uppercase tracking-wider ${highlight ? 'text-primary flex items-center gap-1' : 'text-muted-foreground'}`}>
              {highlight && <Sparkles className="w-3 h-3 shrink-0" />}{label}
            </span>
            {!value
              ? <div className="h-7 w-16 bg-white/5 animate-pulse rounded" />
              : <span className={`text-xl md:text-2xl font-bold ${highlight ? 'text-primary neon-text-glow' : 'text-white'}`}>{value}</span>
            }
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Job listings */}
        <div className="lg:col-span-2 space-y-4 md:space-y-5">
          {/* Search + Filter */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <input
                type="text" placeholder="Role (e.g. Data Scientist)"
                value={role} onChange={e => setRole(e.target.value)}
                className="flex-1 bg-background border border-white/10 rounded-md px-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
              <input
                type="text" placeholder="City or Country"
                value={location} onChange={e => setLocation(e.target.value)}
                className="flex-1 bg-background border border-white/10 rounded-md px-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`flex items-center gap-1 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all border ${
                    filter === f.value
                      ? "bg-primary/20 text-primary border-primary/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                      : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{f.icon}</span> {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-3 md:space-y-4">
            {loadingJobs ? (
              [...Array(4)].map((_, i) => <div key={i} className="h-32 md:h-36 bg-white/5 animate-pulse rounded-xl" />)
            ) : listings?.length === 0 ? (
              <div className="glass-panel rounded-xl border border-white/5 p-8 md:p-12 text-center">
                <p className="text-muted-foreground text-sm">No jobs found for this filter. Try a different combination.</p>
              </div>
            ) : (
              (listings as unknown as Job[])?.map(job => {
                const flag = COUNTRY_FLAGS[job.country] ?? "🌐";
                const colorClass = COMPANY_COLORS[job.company] ?? "bg-primary/20 text-primary";
                return (
                  <div key={job.id} className="glass-panel rounded-xl border border-white/5 p-4 md:p-5 hover-elevate transition-all group cursor-pointer hover:border-primary/30">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border border-white/10 ${colorClass}`}>
                        {companyInitials(job.company)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm md:text-base font-bold text-white group-hover:text-primary transition-colors leading-tight">{job.title}</h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs md:text-sm text-muted-foreground">
                              <span className="flex items-center gap-1 font-medium text-white/80">
                                <Building className="w-3 h-3 shrink-0" /> {job.company}
                              </span>
                              <span className="flex items-center gap-1">
                                {job.remote
                                  ? <><Globe className="w-3 h-3 text-emerald-400 shrink-0" /><span className="text-emerald-400">Remote</span></>
                                  : <MapPin className="w-3 h-3 shrink-0" />
                                }
                                <span>{flag} {job.location}</span>
                              </span>
                              <span className="font-semibold text-secondary">
                                {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full border-2 flex items-center justify-center ${MATCH_COLOR(job.matchScore)}`}>
                              <span className="text-[10px] md:text-xs font-bold">{job.matchScore}%</span>
                            </div>
                            <span className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wider">Match</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mt-2 md:mt-3">
                          {job.skills.slice(0, 4).map((skill, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 text-muted-foreground rounded-full group-hover:bg-primary/10 group-hover:text-primary/80 transition-colors">
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 4 && <span className="text-xs text-muted-foreground/60">+{job.skills.length - 4}</span>}
                          <span className="ml-auto text-xs text-muted-foreground/60">{daysAgo(job.postedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="space-y-4 md:space-y-6">
          <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-secondary shrink-0" />
              Top Hiring Companies
            </h2>
            <div className="space-y-2 md:space-y-3">
              {loadingCompanies ? (
                [...Array(6)].map((_, i) => <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg" />)
              ) : (
                companies?.map((company, i) => {
                  const colorClass = COMPANY_COLORS[company.name] ?? "bg-primary/20 text-primary";
                  return (
                    <div key={i} className="flex items-center gap-2 md:gap-3 p-2 md:p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-secondary/30 transition-colors cursor-pointer">
                      <div className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${colorClass}`}>
                        {companyInitials(company.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-xs md:text-sm leading-tight truncate">{company.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{company.industry} · {company.openRoles} roles</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 shrink-0 text-xs font-bold">
                        {company.rating} <Star className="w-3 h-3 fill-current" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full -z-10 blur-xl" />
            <h2 className="text-sm md:text-base font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent shrink-0" />
              Market Breakdown
            </h2>
            <div className="space-y-3">
              {loadingMarket ? (
                [...Array(4)].map((_, i) => <div key={i} className="h-8 bg-white/5 animate-pulse rounded" />)
              ) : (
                market?.roleBreakdown?.map((r, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground truncate mr-2">{r.role}</span>
                      <span className="text-white font-medium shrink-0">{r.percentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${r.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-panel rounded-xl border border-white/5 p-4 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-full -z-10 blur-xl" />
            <h2 className="text-sm md:text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent shrink-0" />
              AI Market Prediction
            </h2>
            <div className="bg-background/50 border border-white/10 p-3 md:p-4 rounded-lg">
              <p className="text-xs md:text-sm text-white/90 font-medium leading-relaxed">
                "Demand for Data Engineers with cloud skills (AWS/GCP/Azure) is projected to grow 24% faster than Data Scientists over the next 6 months."
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <span className="text-xs text-muted-foreground">Confidence Score</span>
                <span className="text-xs font-bold text-accent">94%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
