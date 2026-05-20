import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TopNav } from "@/components/TopNav";
import { Analytics } from "@/components/Analytics";
import { RouteChangeTracker } from "@/components/RouteChangeTracker";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Enterprise from "./pages/Enterprise";
import AI from "./pages/AI";
import FeaturesPage from "./pages/FeaturesPage";
import RequestDemo from "./pages/RequestDemo";
import Community from "./pages/Community";
import StatusPage from "./pages/Status";
import APIPage from "./pages/APIPage";
import About from "./pages/About";
import TalkToSales from "./pages/TalkToSales";
import AccountOverview from "./pages/AccountOverview";
import AccountSettings from "./pages/AccountSettings";
import Credits from "./pages/Credits";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Analytics />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteChangeTracker />
          <TopNav />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/demo" element={<RequestDemo />} />
            <Route path="/community" element={<Community />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/developers" element={<APIPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/sales" element={<TalkToSales />} />
            <Route path="/account" element={<AccountOverview />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="/credits" element={<Credits />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
