import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Book,
  Swords,
  HelpCircle,
  Trophy,
  Gift,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card/95 backdrop-blur-md border-b-2 border-border sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-card rounded-full border-2 border-primary"></div>
            </div>
            <span className="font-bold text-lg sm:text-xl text-foreground">
              PokeWorld
            </span>
          </Link>

          <div className="hidden lg:flex gap-2 xl:gap-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/")
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium text-sm xl:text-base">Home</span>
            </Link>

            <Link
              to="/browse"
              className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/browse")
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="font-medium text-sm xl:text-base">Browse</span>
            </Link>

            <Link
              to="/my-pokedex"
              className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/my-pokedex")
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Book className="w-5 h-5" />
              <span className="font-medium text-sm xl:text-base">
                My Pokédex
              </span>
            </Link>

            <Link
              to="/battle"
              className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/battle")
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Swords className="w-5 h-5" />
              <span className="font-medium text-sm xl:text-base">Battle</span>
            </Link>

            <Link
              to="/quiz"
              className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/quiz")
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium text-sm xl:text-base">Quiz</span>
            </Link>

            <Link
              to="/mystery-box"
              className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive("/mystery-box")
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Gift className="w-5 h-5" />
              <span className="font-medium text-sm xl:text-base">Mystery</span>
            </Link>

            <div className="h-6 w-px bg-border"></div>

            <ThemeToggle />
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

