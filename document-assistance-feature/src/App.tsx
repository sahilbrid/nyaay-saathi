
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";

// Lazy load pages for better performance
const CategorySelection = lazy(() => import("./pages/CategorySelection"));
const DocumentForm = lazy(() => import("./pages/DocumentForm"));
const DocumentPreview = lazy(() => import("./pages/DocumentPreview"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar/>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<CategorySelection />} />
              <Route path="/form/:category" element={<DocumentForm />} />
              <Route path="/preview/:category" element={<DocumentPreview />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
