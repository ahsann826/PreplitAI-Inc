import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = import.meta.env.PROD ? 'http://localhost:5000/api' : '/api';

type UserInfo = { id: number; email: string; name: string; created_at?: string };
interface MeResponse {
  success: boolean;
  user: UserInfo;
}

const AccountOverview = () => {
  const { user, token } = useAuth();
  const [info, setInfo] = useState<UserInfo | null>(user as UserInfo | null);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: MeResponse = await res.json();
        if (res.ok) setInfo(data.user);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [token]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">Account Overview</h1>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-none">
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <div><span className="text-gray-500">Name:</span> <span className="ml-2">{info?.name}</span></div>
            <div><span className="text-gray-500">Email:</span> <span className="ml-2">{info?.email}</span></div>
            { info?.created_at && (
              <div><span className="text-gray-500">Member since:</span> <span className="ml-2">{new Date(info.created_at).toLocaleDateString()}</span></div>
            )}
            <div className="pt-4">
              <a href="/settings"><Button variant="outline">Manage settings</Button></a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountOverview;
