import { Dashboard } from "@/pages/dashboard";
import { SkillsAnalytics } from "@/pages/skills";
import { SalaryIntelligence } from "@/pages/salary";
import { ResumeAnalyzer } from "@/pages/resume";
import { Coach } from "@/pages/coach";
import { Roadmap } from "@/pages/roadmap";
import { Jobs } from "@/pages/jobs";
import { Portfolio } from "@/pages/portfolio";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/app-layout";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/skills" component={SkillsAnalytics} />
        <Route path="/salary" component={SalaryIntelligence} />
        <Route path="/resume" component={ResumeAnalyzer} />
        <Route path="/coach" component={Coach} />
        <Route path="/roadmap" component={Roadmap} />
        <Route path="/jobs" component={Jobs} />
        <Route path="/portfolio" component={Portfolio} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
