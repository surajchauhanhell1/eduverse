import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import StudentDashboard from "@/pages/student-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import ContentDetail from "@/pages/content-detail";
import QuizTaking from "@/pages/quiz-taking";
import Notes from "@/pages/notes";
import StudyPlanner from "@/pages/study-planner";
import Library from "@/pages/library";
import UploadContent from "@/pages/upload-content";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={LandingPage} />
      ) : (
        <>
          {user?.role === 'admin' ? (
            <>
              <Route path="/" component={AdminDashboard} />
              <Route path="/upload" component={UploadContent} />
              <Route path="/content/:id" component={ContentDetail} />
            </>
          ) : (
            <>
              <Route path="/" component={StudentDashboard} />
              <Route path="/library" component={Library} />
              <Route path="/notes" component={Notes} />
              <Route path="/planner" component={StudyPlanner} />
              <Route path="/content/:id" component={ContentDetail} />
              <Route path="/quiz/:id" component={QuizTaking} />
            </>
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
