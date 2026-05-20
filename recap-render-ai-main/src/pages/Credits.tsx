import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { api, Transaction } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, TrendingUp, TrendingDown, ArrowLeft, ArrowUpRight, ArrowDownRight, Clock, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Credits = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPurchased: 0,
    totalSpent: 0,
    totalRefunded: 0,
  });

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    loadData();
  }, [token, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getTransactions(100, 0);
      if (data.success) {
        setTransactions(data.transactions);
        calculateStats(data.transactions);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (txns: Transaction[]) => {
    const purchased = txns
      .filter(t => t.type === 'PURCHASE')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const spent = txns
      .filter(t => t.type === 'DEBIT')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const refunded = txns
      .filter(t => t.type === 'REFUND')
      .reduce((sum, t) => sum + t.amount, 0);

    setStats({ totalPurchased: purchased, totalSpent: spent, totalRefunded: refunded });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'PURCHASE':
      case 'BONUS':
      case 'REFUND':
        return <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'DEBIT':
        return <ArrowDownRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      default:
        return <Coins className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'PURCHASE':
        return 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'DEBIT':
        return 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'REFUND':
        return 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'BONUS':
        return 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const filteredTransactions = filter 
    ? transactions.filter(t => t.type === filter)
    : transactions;

  const credits = user?.creditBalance ?? 0;
  const isLow = credits < 5;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Credits</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your credits and view transaction history</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/pricing')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Buy Credits
          </Button>
        </div>

        {/* Balance & Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Current Balance */}
          <Card className={`border-2 ${isLow ? 'border-orange-200 dark:border-orange-800' : 'border-blue-200 dark:border-blue-800'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${isLow ? 'bg-orange-100 dark:bg-orange-950' : 'bg-blue-100 dark:bg-blue-950'}`}>
                  <Coins className={`w-6 h-6 ${isLow ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{credits}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">credits</p>
                </div>
              </div>
              {isLow && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-3">Running low!</p>
              )}
            </CardContent>
          </Card>

          {/* Total Purchased */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Purchased</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-950">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalPurchased}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">credits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-950">
                  <TrendingDown className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSpent}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">credits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Refunded */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Refunded</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-950">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRefunded}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">credits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Transaction History</CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={filter === null ? "default" : "outline"}
                    onClick={() => setFilter(null)}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === 'PURCHASE' ? "default" : "outline"}
                    onClick={() => setFilter('PURCHASE')}
                  >
                    Purchases
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === 'DEBIT' ? "default" : "outline"}
                    onClick={() => setFilter('DEBIT')}
                  >
                    Usage
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === 'REFUND' ? "default" : "outline"}
                    onClick={() => setFilter('REFUND')}
                  >
                    Refunds
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Coins className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
                <Button 
                  onClick={() => navigate('/pricing')}
                  variant="outline"
                  className="mt-4"
                >
                  Purchase Credits
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getTransactionColor(transaction.type)}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${
                          transaction.type === 'DEBIT' 
                            ? 'text-orange-600 dark:text-orange-400' 
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {transaction.type === 'DEBIT' ? '-' : '+'}{transaction.amount}
                        </span>
                        <Badge variant="outline" className={getTransactionColor(transaction.type)}>
                          {transaction.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Balance: {transaction.balance_after}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Coins className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-medium text-gray-900 dark:text-white">How Credits Work</p>
                <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                  <li>1 credit = 1 minute of video generation</li>
                  <li>Credits never expire</li>
                  <li>Get bonus credits with larger packages</li>
                  <li>Refunds are automatically processed for failed generations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Credits;
