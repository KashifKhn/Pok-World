import { Achievement } from "@/hooks/useAchievements";
import { Progress } from "./ui/progress";
import { CheckCircle2 } from "lucide-react";

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const percentage = (achievement.progress / achievement.target) * 100;

  return (
    <div
      className={`relative bg-gradient-to-br from-card via-card to-muted rounded-2xl p-6 border-2 transition-all duration-300 overflow-hidden group ${
        achievement.unlocked
          ? "border-secondary shadow-[0_0_30px_rgba(255,203,5,0.3)] scale-[1.02]"
          : "border-border hover:border-primary/50 hover:shadow-lg"
      }`}
    >
      {/* Background decoration */}
      <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-300 ${
        achievement.unlocked 
          ? "from-secondary/10 via-transparent to-secondary/5 opacity-100" 
          : "from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100"
      }`}></div>

      {achievement.unlocked && (
        <>
          <div className="absolute -top-3 -right-3 bg-gradient-to-br from-secondary via-yellow-400 to-secondary rounded-full p-2.5 shadow-lg animate-bounce z-10 border-2 border-secondary-foreground/20">
            <CheckCircle2 className="w-6 h-6 text-secondary-foreground drop-shadow-md" />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
        </>
      )}

      <div className="flex items-start gap-4 relative z-10">
        <div className={`text-6xl p-3 rounded-xl transition-all duration-300 ${
          achievement.unlocked 
            ? "bg-secondary/20 shadow-lg scale-110" 
            : "bg-muted/50 group-hover:bg-primary/10 group-hover:scale-105"
        }`}>
          {achievement.icon}
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-bold text-xl text-foreground mb-1">{achievement.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm items-center">
              <span className="text-muted-foreground font-medium">Progress</span>
              <span className={`font-mono font-bold text-base ${
                achievement.unlocked ? "text-secondary" : "text-foreground"
              }`}>
                {achievement.progress} / {achievement.target}
              </span>
            </div>
            <div className="relative">
              <Progress 
                value={percentage} 
                className={`h-3 ${achievement.unlocked ? "bg-secondary/20" : ""}`}
              />
              {achievement.unlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              )}
            </div>
            {achievement.unlocked && (
              <p className="text-xs text-secondary font-semibold uppercase tracking-wide">
                ✨ Completed!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
