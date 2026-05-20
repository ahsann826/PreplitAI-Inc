import { Coins } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export function CreditBadge() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const credits = user.creditBalance ?? 0;
  const isLow = credits < 5;

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors cursor-pointer hover:opacity-80 ${
          isLow 
            ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300' 
            : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
        }`}
        onClick={() => navigate('/credits')}
      >
        <Coins className="w-4 h-4" />
        <span className="text-sm font-semibold">{credits}</span>
        <span className="text-xs font-medium">credits</span>
      </div>
      {isLow && (
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs"
          onClick={() => navigate('/pricing')}
        >
          Buy More
        </Button>
      )}
    </div>
  );
}
