import { Features as FeaturesGrid } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { Sparkles, CheckCircle2, ArrowRight, Zap, Shield, Globe, Brain } from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "Create",
    items: [
      "Text to Speech with studio‑quality voices",
      "Lifelike AI Avatars for presentational lectures",
      "Smart Summarization and outline generation",
      "Multi-language support with natural accents"
    ],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Zap,
    title: "Study",
    items: [
      "Auto‑generated practice questions",
      "Key concepts and flashcards",
      "Progress tracking and analytics",
      "Spaced repetition algorithms"
    ],
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Globe,
    title: "Platform",
    items: [
      "Upload PDF, DOCX, or text",
      "Export to video or share pages",
      "API & SDKs for custom workflows",
      "Integrations with LMS platforms"
    ],
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Shield,
    title: "Security",
    items: [
      "SSO, role‑based permissions",
      "Audit log and admin analytics",
      "Encryption in transit and at rest",
      "SOC 2 Type II compliance"
    ],
    gradient: "from-green-500 to-emerald-500"
  },
];

const FeaturesPage = () => {
  const siteUrl = (import.meta as any).env?.VITE_SITE_URL || "https://yourdomain.com";
  const canonical = `${siteUrl}/features`;
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <SEOHead
        title="AI Lecture Generator Features"
        description="Explore features: AI avatars, TTS, smart summarization, study tools, and enterprise security for video lectures."
        url={canonical}
        canonical={canonical}
      />
      
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 -left-48 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/30 mb-8">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Everything you need</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-6 leading-tight">
            Powerful features for
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">modern learning</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mb-10 leading-relaxed">
            Everything you need to turn notes into engaging, multilingual AI lectures — and share them with your team or class.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="px-8 py-6 h-auto text-base font-semibold bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-xl shadow-lg">
              <a href="/pricing">
                Get started
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-6 h-auto text-base font-semibold border-2 rounded-xl">
              <a href="/enterprise#contact">Talk to sales</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Main feature grid */}
      <FeaturesGrid />

      {/* Capabilities grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-4">Built for every workflow</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">From content creation to enterprise security, we've got you covered.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {capabilities.map((cap, i) => (
            <div key={i} className="group relative p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-2xl">
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${cap.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${cap.gradient} mb-6 shadow-lg`}>
                  <cap.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4">{cap.title}</h3>
                <ul className="space-y-3">
                  {cap.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
