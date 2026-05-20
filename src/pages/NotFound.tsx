import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">404 · Page not found</p>
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4 tracking-tight">
          We couldnt find that page.
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8">
          The link might be broken, or the page may have been moved. Check the URL, or head back to your dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="px-6 h-11 text-sm font-semibold">
            <a href="/">Back to home</a>
          </Button>
          <Button asChild variant="outline" className="px-6 h-11 text-sm font-semibold">
            <a href="/support">Contact support</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
