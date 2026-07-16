import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Discovery from "./pages/Discovery";
import Integration from "./pages/Integration";
import Community from "./pages/Community";
import KeyManager from "./pages/KeyManager";
import Comparison from "./pages/Comparison";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Preloader from "./components/Preloader";
import { AuthProvider } from "./AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); 

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  // handle section change globally
  const handleSectionChange = (section: string, query?: string) => {
    if (section === "discovery") {
      navigate("/discovery", { state: { query, discover: true } });  // ✅ pass state
    } else if (section === "integration") {
      navigate("/integration");
    } else {
      navigate(`/${section}`);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
            <Navbar />
            <Routes>
              <Route path="/" element={<Home onSectionChange={handleSectionChange} />} />
              <Route path="/discovery" element={<Discovery onSectionChange={() => {}} />} />
              <Route path="/integration" element={<Integration onSectionChange={() => {}} />} />
              <Route path="/community" element={<Community />} />
              <Route path="/keys" element={<KeyManager />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};


export default App;
