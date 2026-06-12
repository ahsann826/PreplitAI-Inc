import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword);
      onClose();
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      // Error is handled in auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(signupEmail, signupPassword, signupName);
      onClose();
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
    } catch (error) {
      // Error is handled in auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-6">
        <div>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-3xl font-bold text-center text-black dark:text-white mb-2">
Welcome to PreplitAI
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Create an account or log in to start generating lectures
          </p>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md text-gray-700 dark:text-gray-300 data-[state=active]:text-black dark:data-[state=active]:text-white font-medium"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md text-gray-700 dark:text-gray-300 data-[state=active]:text-black dark:data-[state=active]:text-white font-medium"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white text-black dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white text-black dark:text-white"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-semibold rounded-lg mt-5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-3 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-sm font-medium">Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white text-black dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white text-black dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white text-black dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-semibold rounded-lg mt-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
