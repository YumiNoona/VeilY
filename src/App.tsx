import { useState, lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const AIChat = lazy(() => import("./pages/AIChat"));
const SocialPost = lazy(() => import("./pages/SocialPost"));
const Comments = lazy(() => import("./pages/Comments"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UpgradeSuccess = lazy(() => import("./pages/UpgradeSuccess"));
const Auth = lazy(() => import("./pages/Auth"));
const Stories = lazy(() => import("./pages/Stories"));
const Email = lazy(() => import("./pages/Email"));

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="flex items-center justify-center h-screen w-full bg-background text-muted-foreground">Loading...</div>}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/ai-chat" element={<AIChat />} />
                  <Route path="/social" element={<SocialPost />} />
                  <Route path="/comments" element={<Comments />} />
                  <Route path="/stories" element={<Stories />} />
                  <Route path="/email" element={<Email />} />
                  <Route path="/upgrade/success" element={<UpgradeSuccess />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
