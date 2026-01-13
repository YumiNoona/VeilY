import { useState, lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";

const Index = lazy(() => import("./pages/Index"));
const AIChat = lazy(() => import("./pages/AIChat"));
const SocialPost = lazy(() => import("./pages/SocialPost"));
const Comments = lazy(() => import("./pages/Comments"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
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
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
