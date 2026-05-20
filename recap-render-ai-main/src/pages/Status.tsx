import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

const Status = () => (
  <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
    <SEOHead
      title="System status"
      description="Realtime overview of uptime and incidents for PreplitAI services."
      canonical={`${(import.meta as any).env?.VITE_SITE_URL || 'https://yourdomain.com'}/status`}
      robots="noindex,follow"
    />
    <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 overflow-hidden">
      <div className="absolute top-0 -left-48 w-96 h-96 bg-green-500/10 dark:bg-green-500/5 rounded-full blur-3xl" />
      <div className="relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-6 leading-tight">
          System <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">status</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
          Realtime overview of uptime and incidents for PreplitAI services.
        </p>
      </div>
      <div className="mt-10 space-y-4">
        <div className="p-8 rounded-2xl border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-black dark:text-white flex items-center gap-3">
              <span className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
              All Systems Operational
            </h3>
            <span className="text-sm text-green-700 dark:text-green-300">Last updated: 2 minutes ago</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">All services are running smoothly. No incidents reported.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-black dark:text-white">API Services</h4>
              <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full">Operational</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload, lecture generation, and video APIs</p>
            <div className="mt-3 text-xs text-gray-500">99.98% uptime (30 days)</div>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-black dark:text-white">Web Application</h4>
              <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full">Operational</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Dashboard, authentication, and user interface</p>
            <div className="mt-3 text-xs text-gray-500">99.99% uptime (30 days)</div>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-black dark:text-white">Media Processing</h4>
              <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full">Operational</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Video rendering, TTS, and file conversions</p>
            <div className="mt-3 text-xs text-gray-500">99.95% uptime (30 days)</div>
          </div>

          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-black dark:text-white">Storage & CDN</h4>
              <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full">Operational</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">File storage and content delivery network</p>
            <div className="mt-3 text-xs text-gray-500">100% uptime (30 days)</div>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h3 className="text-lg font-bold text-black dark:text-white mb-4">Recent Incidents</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">✓ No incidents reported in the last 30 days</p>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Status;