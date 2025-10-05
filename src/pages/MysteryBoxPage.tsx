import Navigation from "@/components/Navigation";
import MysteryBox from "@/components/MysteryBox";
import { Sparkles } from "lucide-react";

const MysteryBoxPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-12 h-12 text-secondary animate-pulse" />
              <h1 className="text-5xl font-bold text-foreground">Mystery Box</h1>
              <Sparkles className="w-12 h-12 text-secondary animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Feeling lucky? Open a mystery box and discover a random Pokémon! 
              Each box contains a surprise from the first generation.
            </p>
          </div>

          <MysteryBox />

          <div className="bg-card rounded-xl p-6 border-2 border-border">
            <h3 className="text-lg font-bold text-foreground mb-3">How it works:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                Click "Open Mystery Box" to reveal a random Pokémon
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                Wait for the exciting reveal animation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                Add it to your collection or view its details
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                Open as many boxes as you want!
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MysteryBoxPage;
