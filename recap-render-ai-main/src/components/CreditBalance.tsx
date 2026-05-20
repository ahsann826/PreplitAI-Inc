import { Coins, TrendingUp, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";

interface CreditBalanceProps {
  showDetails?: boolean;
  className?: string;
}

export function CreditBalance({ showDetails = false, className = "" }: CreditBalanceProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const credits = user.creditBalance ?? 0;
  const isLow = credits < 5;

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div 
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${
            isLow 
              ? 'bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800' 
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800'
          }`}
        >
          <Coins className={`w-5 h-5 ${isLow ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`} />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Credits</span>
            <span className={`text-lg font-bold ${isLow ? 'text-orange-700 dark:text-orange-300' : 'text-blue-700 dark:text-blue-300'}`}>
              {credits}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Available Credits</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{credits}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">credits</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${
          isLow 
            ? 'bg-orange-100 dark:bg-orange-950' 
            : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950'
        }`}>
          <Coins className={`w-6 h-6 ${isLow ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`} />
        </div>
      </div>

      {isLow && (
        <div className="flex items-start gap-2 p-3 mb-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <Info className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-orange-700 dark:text-orange-300">
            <p className="font-medium mb-1">Running low on credits!</p>
            <p className="text-orange-600 dark:text-orange-400">Purchase more to continue creating videos.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button 
          onClick={() => navigate('/pricing')}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Buy Credits
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/credits')}
          className="flex-1"
        >
          View History
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• 1 credit = 1 minute of video generation</p>
          <p>• Credits never expire</p>
          <p>• Get bonus credits with larger packages</p>
        </div>
      </div>
    </Card>
  );
}
