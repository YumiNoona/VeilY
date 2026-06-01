import { useState, lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { isElectron } from "@/lib/electron-utils";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";

const Landing = lazy(() => import("./pages/Landing"));
const Index = lazy(() => import("./pages/Index"));
const AIChat = lazy(() => import("./pages/AIChat"));
const SocialPost = lazy(() => import("./pages/SocialPost"));
const Comments = lazy(() => import("./pages/Comments"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UpgradeSuccess = lazy(() => import("./pages/UpgradeSuccess"));
const Auth = lazy(() => import("./pages/Auth"));
const Stories = lazy(() => import("./pages/Stories"));
const Email = lazy(() => import("./pages/Email"));
const GroupCall = lazy(() => import("./pages/GroupCall"));

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  const Router = isElectron() ? HashRouter : BrowserRouter;
  const isDesktop = isElectron();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <Router>
            <Suspense fallback={<div className="flex items-center justify-center h-screen w-full bg-background text-muted-foreground">Loading...</div>}>
              <Routes>
                <Route path="/" element={isDesktop ? <Navigate to="/app" replace /> : <Landing />} />
                <Route element={<Layout />}>
                  <Route path="/app" element={<Index />} />
                  <Route path="/app/ai-chat" element={<AIChat />} />
                  <Route path="/app/social" element={<SocialPost />} />
                  <Route path="/app/comments" element={<Comments />} />
                  <Route path="/app/stories" element={<Stories />} />
                  <Route path="/app/email" element={<Email />} />
                  <Route path="/app/group-call" element={<GroupCall />} />
                  <Route path="/upgrade/success" element={<UpgradeSuccess />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
