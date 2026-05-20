import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const AccountSettings = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const onUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingName(true);
    try { await updateProfile(name); } finally { setLoadingName(false); }
  };

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPass(true);
    try { await changePassword(currentPassword, newPassword); setCurrentPassword(""); setNewPassword(""); } finally { setLoadingPass(false); }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">Account Settings</h1>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-none">
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUpdateName} className="grid gap-3 max-w-md">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e)=>setName(e.target.value)} className="h-10" required />
              </div>
              <Button type="submit" disabled={loadingName} className="w-max">{loadingName? 'Saving…' : 'Save changes'}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-none">
          <CardHeader>
            <CardTitle className="text-lg">Reset password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onChangePassword} className="grid gap-3 max-w-md">
              <div className="grid gap-1.5">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} className="h-10" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} minLength={6} className="h-10" required />
              </div>
              <Button type="submit" disabled={loadingPass} className="w-max">{loadingPass? 'Updating…' : 'Update password'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;
