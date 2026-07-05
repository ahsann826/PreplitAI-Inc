import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/constants/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Coins, TrendingUp, TrendingDown, ArrowLeft, ArrowUpRight,
  ArrowDownRight, Clock, RefreshCw, Zap, Shield, Gift,
  ChevronRight, AlertTriangle, CheckCircle2, CreditCard, BarChart3
} from "lucide-react";

interface Transaction {
  id: number;
  type: "PURCHASE" | "DEBIT" | "REFUND" | "BONUS";
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

interface CreditStats {
  totalPurchased: number;
  totalSpent: number;
  totalRefunded: number;
}

const Credits = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [stats, setStats] = useState<CreditStats>({
    totalPurchased: 0,
    totalSpent: 0,
    totalRefunded: 0,
  });

  const loadData = useCallback(async (isRefresh = false) => {
    if (!token) return;
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const res = await fetch(`${API_BASE_URL}/credits/transactions?limit=100&offset=0`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load transactions");
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
        const txns: Transaction[] = data.transactions;
        setStats({
          totalPurchased: txns.filter(t => t.type === "PURCHASE" || t.type === "BONUS").reduce((s, t) => s + t.amount, 0),
          totalSpent: txns.filter(t => t.type === "DEBIT").reduce((s, t) => s + t.amount, 0),
          totalRefunded: txns.filter(t => t.type === "REFUND").reduce((s, t) => s + t.amount, 0),
        });
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    loadData();
  }, [token, navigate, loadData]);

  const credits = user?.creditBalance ?? 0;
  const isLow = credits < 10;
  const isCritical = credits < 3;

  const filteredTransactions = filter
    ? transactions.filter(t => t.type === filter)
    : transactions;

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "PURCHASE": return {
        icon: <CreditCard className="w-4 h-4" />,
        label: "Purchase",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950",
        border: "border-blue-200 dark:border-blue-800",
        badgeClass: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
        prefix: "+"
      };
      case "DEBIT": return {
        icon: <Zap className="w-4 h-4" />,
        label: "Used",
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-950",
        border: "border-orange-200 dark:border-orange-800",
        badgeClass: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700",
        prefix: "-"
      };
      case "REFUND": return {
        icon: <Shield className="w-4 h-4" />,
        label: "Refund",
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-950",
        border: "border-green-200 dark:border-green-800",
        badgeClass: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
        prefix: "+"
      };
      case "BONUS": return {
        icon: <Gift className="w-4 h-4" />,
        label: "Bonus",
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-950",
        border: "border-purple-200 dark:border-purple-800",
        badgeClass: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
        prefix: "+"
      };
      default: return {
        icon: <Coins className="w-4 h-4" />,
        label: type,
        color: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-50 dark:bg-gray-950",
        border: "border-gray-200 dark:border-gray-800",
        badgeClass: "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
        prefix: ""
      };
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Credits
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage your balance and view transaction history
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <Button
              onClick={() => navigate("/pricing")}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 border-0"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Buy Credits
            </Button>
          </div>
        </div>

        {/* ── Low Balance Alert ── */}
        {isCritical && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Critical:</strong> You have fewer than 3 credits remaining. Purchase more to continue generating videos.
            </p>
            <Button
              size="sm"
              onClick={() => navigate("/pricing")}
              className="ml-auto flex-shrink-0 bg-red-500 hover:bg-red-600 text-white border-0"
            >
              Buy Now
            </Button>
          </div>
        )}

        {/* ── Balance + Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* Current Balance */}
          <Card className={`col-span-2 md:col-span-1 border-2 transition-colors ${
            isCritical ? "border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20"
            : isLow ? "border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-950/20"
            : "border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20"
          }`}>
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Available Credits
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className={`text-5xl font-bold tabular-nums tracking-tight ${
                    isCritical ? "text-red-600 dark:text-red-400"
                    : isLow ? "text-orange-600 dark:text-orange-400"
                    : "text-gray-900 dark:text-white"
                  }`}>
                    {credits}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">credits</p>
                </div>
                <div className={`p-3 rounded-2xl ${
                  isCritical ? "bg-red-100 dark:bg-red-900/60"
                  : isLow ? "bg-orange-100 dark:bg-orange-900/60"
                  : "bg-blue-100 dark:bg-blue-900/60"
                }`}>
                  <Coins className={`w-7 h-7 ${
                    isCritical ? "text-red-500"
                    : isLow ? "text-orange-500"
                    : "text-blue-500"
                  }`} />
                </div>
              </div>
              {isLow && !isCritical && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-3 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Running low
                </p>
              )}
            </CardContent>
          </Card>

          {/* Total Purchased */}
          <Card className="border border-gray-200 dark:border-gray-800">
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Purchased
              </p>
              {loading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {stats.totalPurchased}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                    <p className="text-xs text-green-600 dark:text-green-400">all time</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Total Used */}
          <Card className="border border-gray-200 dark:border-gray-800">
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Used
              </p>
              {loading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {stats.totalSpent}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowDownRight className="w-3 h-3 text-orange-500" />
                    <p className="text-xs text-orange-600 dark:text-orange-400">all time</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Total Refunded */}
          <Card className="border border-gray-200 dark:border-gray-800">
            <CardContent className="pt-5 pb-5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Refunded
              </p>
              {loading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {stats.totalRefunded}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <p className="text-xs text-green-600 dark:text-green-400">auto-refunded</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Transaction History ── */}
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-500" />
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Transaction History
                </CardTitle>
                {!loading && (
                  <Badge variant="outline" className="text-xs text-gray-500 border-gray-300 dark:border-gray-600">
                    {filteredTransactions.length}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: "All", value: null },
                  { label: "Purchases", value: "PURCHASE" },
                  { label: "Usage", value: "DEBIT" },
                  { label: "Refunds", value: "REFUND" },
                ].map(({ label, value }) => (
                  <button
                    key={label}
                    onClick={() => setFilter(value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filter === value
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">No transactions yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                  Your credit activity will appear here
                </p>
                <Button
                  onClick={() => navigate("/pricing")}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600"
                >
                  Purchase Credits
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTransactions.map((txn) => {
                  const cfg = getTypeConfig(txn.type);
                  return (
                    <div
                      key={txn.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <div className={`p-2.5 rounded-xl flex-shrink-0 ${cfg.bg} ${cfg.border} border`}>
                        <span className={cfg.color}>{cfg.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {txn.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {new Date(txn.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-base font-bold tabular-nums ${
                          txn.type === "DEBIT"
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-green-600 dark:text-green-400"
                        }`}>
                          {cfg.prefix}{txn.amount}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 tabular-nums">
                          bal: {txn.balance_after}
                        </p>
                      </div>
                      <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cfg.badgeClass}`}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── How Credits Work ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Zap className="w-5 h-5 text-yellow-500" />,
              bg: "bg-yellow-50 dark:bg-yellow-950/40",
              title: "Per-minute billing",
              desc: "Billed by video duration at 130 WPM. 720p = 5 credits/min, 1080p = 8 credits/min."
            },
            {
              icon: <Shield className="w-5 h-5 text-green-500" />,
              bg: "bg-green-50 dark:bg-green-950/40",
              title: "Auto-refunds",
              desc: "If a video generation fails, the exact amount charged is automatically refunded."
            },
            {
              icon: <Gift className="w-5 h-5 text-purple-500" />,
              bg: "bg-purple-50 dark:bg-purple-950/40",
              title: "Credits never expire",
              desc: "Your credits stay in your account until you use them. No monthly reset."
            }
          ].map(({ icon, bg, title, desc }) => (
            <div key={title} className={`flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 ${bg}`}>
              <div className="flex-shrink-0 mt-0.5">{icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Buy More CTA ── */}
        <div
          className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 cursor-pointer group shadow-lg shadow-red-500/20"
          onClick={() => navigate("/pricing")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/pricing")}
        >
          <div>
            <p className="text-white font-bold text-lg">Need more credits?</p>
            <p className="text-red-100 text-sm mt-0.5">Get up to 2× bonus credits on larger packages.</p>
          </div>
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-semibold">View plans</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Credits;
