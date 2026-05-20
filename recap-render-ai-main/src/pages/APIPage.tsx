import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";

const APIPage = () => {
  const siteUrl = (import.meta as any).env?.VITE_SITE_URL || "https://yourdomain.com";
  const canonical = `${siteUrl}/developers`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Developers", item: canonical },
    ]
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <SEOHead
        title="PreplitAI API"
        description="Build AI lecture workflows, generate videos, and search knowledge from your apps."
        url={canonical}
        canonical={canonical}
        schemaMarkup={breadcrumb}
      />
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 -right-48 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">Developers</p>
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-6 leading-tight">
            PreplitAI <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">API</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed mb-10">
            Build AI lecture workflows, generate videos, and search knowledge from your apps.
          </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="/enterprise#contact">
            <Button className="px-6 py-5 h-auto text-sm font-semibold">Request access</Button>
          </a>
        </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6 pb-8">
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-black dark:text-white">Upload document</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">POST /api/upload</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Accepts PDF/DOCX/TXT and returns a documentId.</p>
        </div>
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-black dark:text-white">Generate lecture</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">POST /api/lecture/generate</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Provide documentId, mode, and style to get a structured script.</p>
        </div>
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold text-black dark:text-white">Generate video</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">POST /api/video/generate</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Turn text into a narrated video with optional avatar/voice.</p>
        </div>
      </section>

      {/* Examples */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-black dark:text-white">Examples</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold text-black dark:text-white">cURL</h3>
            <pre className="mt-3 text-xs whitespace-pre-wrap text-gray-800 dark:text-gray-200"><code>{`curl -X POST https://your-domain/api/lecture/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "documentId": "doc_123",
    "mode": "summary",
    "style": "professor"
  }'`}</code></pre>
          </div>
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold text-black dark:text-white">JavaScript</h3>
            <pre className="mt-3 text-xs whitespace-pre-wrap text-gray-800 dark:text-gray-200"><code>{`await fetch('https://your-domain/api/video/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Hello class', options: { ttsProvider: 'edge' } })
});`}</code></pre>
          </div>
        </div>
        <p className="mt-6 text-xs text-gray-500">Note: Authentication and API keys coming soon. Request early access above.</p>
      </section>

      <Footer />
    </div>
  );
};

export default APIPage;