import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import PokemonDetails from "./pages/PokemonDetails";
import MyPokedex from "./pages/MyPokedex";
import Battle from "./pages/Battle";
import Quiz from "./pages/Quiz";
import MysteryBoxPage from "./pages/MysteryBoxPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
          <Route path="/my-pokedex" element={<MyPokedex />} />
          <Route path="/battle" element={<Battle />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/mystery-box" element={<MysteryBoxPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
