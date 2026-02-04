import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Transcriptions from "./pages/Transcriptions";
import NewTranscription from "./pages/NewTranscription";
import TranscriptionView from "./pages/TranscriptionView";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner 
            position="top-right" 
            theme="dark"
            toastOptions={{
              style: {
                background: 'hsl(222 47% 8%)',
                border: '1px solid hsl(222 30% 16%)',
                color: 'hsl(210 40% 98%)',
              },
            }}
          />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/transcriptions" element={<ProtectedRoute><Transcriptions /></ProtectedRoute>} />
            <Route path="/new" element={<ProtectedRoute><NewTranscription /></ProtectedRoute>} />
            <Route path="/transcription/:id" element={<ProtectedRoute><TranscriptionView /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
