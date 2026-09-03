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

const PageFallback = ({ fullScreen = false }: { fullScreen?: boolean }) => (
  <div className={`flex items-center justify-center w-full bg-background text-muted-foreground ${fullScreen ? 'h-screen' : 'h-full'}`}>
    Loading...
  </div>
);

const suspended = (page: React.ReactNode, fullScreen = false) => (
  <Suspense fallback={<PageFallback fullScreen={fullScreen} />}>
    {page}
  </Suspense>
);

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
            <Routes>
              <Route path="/" element={isDesktop ? <Navigate to="/app" replace /> : suspended(<Landing />, true)} />
              <Route element={<Layout />}>
                <Route path="/app" element={suspended(<Index />)} />
                <Route path="/app/ai-chat" element={suspended(<AIChat />)} />
                <Route path="/app/social" element={suspended(<SocialPost />)} />
                <Route path="/app/comments" element={suspended(<Comments />)} />
                <Route path="/app/stories" element={suspended(<Stories />)} />
                <Route path="/app/email" element={suspended(<Email />)} />
                <Route path="/app/group-call" element={suspended(<GroupCall />)} />
                <Route path="/upgrade/success" element={suspended(<UpgradeSuccess />)} />
                <Route path="/auth" element={suspended(<Auth />)} />
                <Route path="*" element={suspended(<NotFound />)} />
              </Route>
            </Routes>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
