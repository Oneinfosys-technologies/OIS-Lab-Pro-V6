import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import BookTest from "@/pages/book-test";
import TestDetail from "@/pages/test-detail";
import MyReports from "@/pages/my-reports";
import ReportView from "@/pages/report-view";
import ReportDownload from "@/pages/report-download";
import AdminDashboard from "@/pages/admin/dashboard";
import TestManagement from "@/pages/admin/test-management";
import ProfilePage from "@/pages/profile-page";
import SuperAdminLogin from "@/pages/sa-login";
import SuperAdminDashboard from "@/pages/sa-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/book-test" component={BookTest} />
      <ProtectedRoute path="/test/:id" component={TestDetail} />
      <ProtectedRoute path="/my-reports" component={MyReports} />
      <ProtectedRoute path="/reports/:id" component={ReportView} />
      <Route path="/reports/download/:reportId" component={ReportDownload} />
      <ProtectedRoute path="/admin" component={AdminDashboard} roles={["admin", "superadmin"]} />
      <ProtectedRoute path="/admin/tests" component={TestManagement} roles={["admin", "superadmin"]} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
