import { BookOpen, User, LogOut, ChevronDown, Menu, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { CreditBadge } from "@/components/CreditBadge";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const TopNav = () => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const Trigger = ({ label }: { label: string }) => (
    <NavigationMenuTrigger className="text-sm font-medium text-black dark:text-white rounded-md px-3 py-2 transition bg-transparent data-[state=open]:bg-transparent hover:bg-black/5 dark:hover:bg-white/10">
      {label}
    </NavigationMenuTrigger>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-7xl mx-auto h-14 px-4 flex items-center justify-between">
        {/* Left: Logo */}
        <a href="/" className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-black dark:text-white" />
          <span className="text-sm font-bold text-black dark:text-white">PreplitAI</span>
        </a>

        {/* Center: Menu (desktop) */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="items-center gap-1">
              {/* Simple links */}
              <NavigationMenuItem>
                <a href="/features" className="text-sm px-3 py-2 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Features</a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="/ai" className="text-sm px-3 py-2 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">AI</a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="/enterprise" className="text-sm px-3 py-2 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Enterprise</a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="/pricing" className="text-sm px-3 py-2 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Pricing</a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="/about" className="text-sm px-3 py-2 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">About</a>
              </NavigationMenuItem>

              {/* Explore mega menu */}
              <NavigationMenuItem>
                <Trigger label="Explore" />
                <NavigationMenuContent className="rounded-md border-0 ring-0 shadow-xl p-8 md:w-[1000px] bg-white dark:bg-gray-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-4">Learn</p>
                      <ul className="space-y-4">
                        <li>
<a href="/community" className="block rounded-lg p-2 -mx-2 transition hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white">
                          <div className="text-[22px] leading-7 font-semibold text-black dark:text-white">Community</div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Join events & groups</p>
                        </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-4">Build</p>
                      <ul className="space-y-4">
                        <li>
                          <a href="/developers" className="block rounded-lg p-2 -mx-2 transition hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white">
                            <div className="text-[22px] leading-7 font-semibold text-black dark:text-white">API</div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Build with PreplitAI</p>
                          </a>
                        </li>
                        <li>
<a href="/status" className="block rounded-lg p-2 -mx-2 transition hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white">
                          <div className="text-[22px] leading-7 font-semibold text-black dark:text-white">Status</div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">System health</p>
                        </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: Actions (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {user && <CreditBadge />}
          <a href="/demo" className="text-sm font-medium text-black dark:text-white hover:opacity-80">Request a demo</a>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white">
                  <User className="h-4 w-4 mr-2" />
                  {user.name}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[220px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-1 shadow-xl">
                <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                  <a href="/account" className="flex w-full items-center gap-2 px-2 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                    <LayoutDashboard className="h-4 w-4 text-gray-500" />
                    <span>Account Overview</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                  <a href="/settings" className="flex w-full items-center gap-2 px-2 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>Account Settings</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-md text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => { setAuthTab("login"); setShowAuthModal(true); }}
                className="hover:bg-transparent text-black dark:text-white font-normal"
              >
                LOGIN
              </Button>
              <Button
                onClick={() => { setAuthTab("signup"); setShowAuthModal(true); }}
                className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-semibold rounded-full px-5"
              >
                SIGN UP
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="text-black dark:text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-[100vw] bg-white dark:bg-gray-950 p-6">
              <nav className="mt-2 space-y-1">
                <a href="/features" className="block px-3 py-3 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Features</a>
                <a href="/ai" className="block px-3 py-3 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">AI</a>
                <a href="/enterprise" className="block px-3 py-3 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Enterprise</a>
                <a href="/pricing" className="block px-3 py-3 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Pricing</a>
                <a href="/about" className="block px-3 py-3 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">About</a>
                <a href="/demo" className="block px-3 py-3 rounded-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">Request a demo</a>
              </nav>

              <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4 px-1">
                {user ? (
                  <div className="space-y-3">
                    <div className="px-2 text-sm text-gray-600 dark:text-gray-400">Signed in as</div>
                    <div className="px-2 font-medium text-black dark:text-white">{user.name}</div>
                    <Button onClick={logout} className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black">
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => { setAuthTab("login"); setShowAuthModal(true); }}
                      className="border-gray-300 dark:border-gray-700"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => { setAuthTab("signup"); setShowAuthModal(true); }}
                      className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
    </header>
    <div className="h-14" />

    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      defaultTab={authTab}
    />
  </>);
};
