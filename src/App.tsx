import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transcriptions from "./pages/Transcriptions";
import NewTranscription from "./pages/NewTranscription";
import TranscriptionView from "./pages/TranscriptionView";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
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
          <Route path="/" element={<Dashboard />} />
          <Route path="/transcriptions" element={<Transcriptions />} />
          <Route path="/new" element={<NewTranscription />} />
          <Route path="/transcription/:id" element={<TranscriptionView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
