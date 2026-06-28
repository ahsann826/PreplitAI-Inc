import { Github, Twitter, Linkedin, Youtube } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
        {/* Brand */}
        <div className="col-span-2">
          <a href="/" className="flex items-center gap-2 mb-4">
            <span className="text-[17px] font-semibold tracking-tight text-black dark:text-white">PreplitAI</span>
          </a>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed mb-6">
            Transform your learning experience with AI-powered video lectures. Built for students, educators, and teams.
          </p>
          <div className="flex items-center gap-2">
            <a href="#" aria-label="Twitter" className="p-2 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="GitHub" className="p-2 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" aria-label="YouTube" className="p-2 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-[13px] font-semibold text-black dark:text-white uppercase tracking-wider mb-4">Product</h4>
          <ul className="space-y-3">
            <li><a href="/features" className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">Features</a></li>
            <li><a href="/pricing" className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">Pricing</a></li>
            <li><a href="/enterprise" className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">Enterprise</a></li>
            <li><a href="/ai" className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">AI Workspace</a></li>
            <li><a href="/developers" className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">API</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-[13px] font-semibold text-black dark:text-white uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-3">
            <li><a href="/about" className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">About</a></li>
            <li><a href="/sales" className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">Contact Sales</a></li>
            <li><a href="/status" className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">System Status</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-[13px] font-semibold text-black dark:text-white uppercase tracking-wider mb-4">Resources</h4>
          <ul className="space-y-3">
            <li><a href="/community" className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">Community</a></li>
            <li><a href="/demo" className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">Request Demo</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[13px] text-gray-400">
          © {new Date().getFullYear()} PreplitAI. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-[13px] text-gray-400 hover:text-black dark:hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-[13px] text-gray-400 hover:text-black dark:hover:text-white transition-colors">Terms</a>
          <a href="#" className="text-[13px] text-gray-400 hover:text-black dark:hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);